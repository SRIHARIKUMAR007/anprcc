
-- Drop all existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view cameras" ON public.cameras;
DROP POLICY IF EXISTS "Authenticated users can manage cameras" ON public.cameras;
DROP POLICY IF EXISTS "Users can view cameras" ON public.cameras;
DROP POLICY IF EXISTS "Admins can manage cameras" ON public.cameras;

-- Create a security definer function to get current user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create proper RLS policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create simple policies for cameras
CREATE POLICY "cameras_select_authenticated" ON public.cameras
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "cameras_all_authenticated" ON public.cameras
  FOR ALL USING (auth.role() = 'authenticated');

-- Add some sample detection data
INSERT INTO public.detections (plate_number, camera_id, confidence, location, status)
VALUES
  ('DL-01-AB-1234', 'CAM-01', 95, 'Main Gate', 'cleared'),
  ('MH-12-CD-5678', 'CAM-02', 88, 'Highway Junction', 'flagged'),
  ('UP-16-EF-9012', 'CAM-01', 92, 'Main Gate', 'cleared'),
  ('GJ-05-GH-3456', 'CAM-04', 97, 'Toll Plaza', 'cleared'),
  ('KA-09-IJ-7890', 'CAM-02', 85, 'Highway Junction', 'processing')
ON CONFLICT DO NOTHING;
