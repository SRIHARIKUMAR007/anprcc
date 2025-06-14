
-- Add role-based authentication system (corrected version)

-- Drop existing constraint if it exists and recreate it
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles 
ALTER COLUMN role SET DEFAULT 'viewer',
ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'operator', 'viewer'));

-- Create a function to assign default role during user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'viewer')::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update existing users without roles to have 'viewer' role
UPDATE public.profiles 
SET role = 'viewer' 
WHERE role IS NULL;

-- Create a security definer function to get user role safely
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE id = user_id LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create more granular RLS policies based on roles
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;

-- New role-based policies for profiles
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    public.get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "profiles_update_own_or_admin" ON public.profiles
  FOR UPDATE USING (
    auth.uid() = id OR 
    public.get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Update detection policies for role-based access
DROP POLICY IF EXISTS "detections_insert_operator_admin" ON public.detections;
CREATE POLICY "detections_insert_operator_admin" ON public.detections
  FOR INSERT WITH CHECK (
    public.get_user_role(auth.uid()) IN ('admin', 'operator')
  );

DROP POLICY IF EXISTS "detections_update_admin" ON public.detections;
CREATE POLICY "detections_update_admin" ON public.detections
  FOR UPDATE USING (
    public.get_user_role(auth.uid()) = 'admin'
  );

-- Update camera policies for role-based access (separate policies for each operation)
DROP POLICY IF EXISTS "cameras_select_authenticated" ON public.cameras;
DROP POLICY IF EXISTS "cameras_all_authenticated" ON public.cameras;
DROP POLICY IF EXISTS "cameras_manage_admin" ON public.cameras;

CREATE POLICY "cameras_select_all" ON public.cameras
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "cameras_insert_admin" ON public.cameras
  FOR INSERT WITH CHECK (
    public.get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "cameras_update_admin" ON public.cameras
  FOR UPDATE USING (
    public.get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "cameras_delete_admin" ON public.cameras
  FOR DELETE USING (
    public.get_user_role(auth.uid()) = 'admin'
  );

-- Update system stats policies
DROP POLICY IF EXISTS "system_stats_insert_operator_admin" ON public.system_stats;
CREATE POLICY "system_stats_insert_operator_admin" ON public.system_stats
  FOR INSERT WITH CHECK (
    public.get_user_role(auth.uid()) IN ('admin', 'operator')
  );

CREATE POLICY "system_stats_select_all" ON public.system_stats
  FOR SELECT USING (auth.role() = 'authenticated');
