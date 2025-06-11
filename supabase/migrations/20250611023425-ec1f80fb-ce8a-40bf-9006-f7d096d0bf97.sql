
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'operator' CHECK (role IN ('admin', 'operator', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create detections table for ANPR data
CREATE TABLE public.detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate_number TEXT NOT NULL,
  camera_id TEXT NOT NULL,
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  location TEXT NOT NULL,
  status TEXT DEFAULT 'cleared' CHECK (status IN ('cleared', 'flagged', 'processing')),
  image_url TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system stats table
CREATE TABLE public.system_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  active_cameras INTEGER NOT NULL DEFAULT 0,
  total_cameras INTEGER NOT NULL DEFAULT 0,
  detections_today INTEGER NOT NULL DEFAULT 0,
  detections_hour INTEGER NOT NULL DEFAULT 0,
  accuracy_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  cpu_usage DECIMAL(5,2) NOT NULL DEFAULT 0,
  memory_usage DECIMAL(5,2) NOT NULL DEFAULT 0,
  network_latency DECIMAL(8,2) NOT NULL DEFAULT 0
);

-- Create cameras table
CREATE TABLE public.cameras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  camera_id TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  ip_address INET,
  last_heartbeat TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cameras ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Detections policies
CREATE POLICY "Authenticated users can view detections" ON public.detections
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Operators and admins can insert detections" ON public.detections
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'operator')
    )
  );

CREATE POLICY "Admins can update detections" ON public.detections
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- System stats policies
CREATE POLICY "Authenticated users can view system stats" ON public.system_stats
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Operators and admins can insert system stats" ON public.system_stats
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'operator')
    )
  );

-- Cameras policies
CREATE POLICY "Authenticated users can view cameras" ON public.cameras
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage cameras" ON public.cameras
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for tables
ALTER TABLE public.detections REPLICA IDENTITY FULL;
ALTER TABLE public.system_stats REPLICA IDENTITY FULL;
ALTER TABLE public.cameras REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.detections;
ALTER PUBLICATION supabase_realtime ADD TABLE public.system_stats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cameras;

-- Insert some initial data
INSERT INTO public.cameras (camera_id, location, status, ip_address) VALUES
  ('CAM-01', 'Main Entrance', 'active', '192.168.1.101'),
  ('CAM-02', 'Parking Lot A', 'active', '192.168.1.102'),
  ('CAM-03', 'Highway Junction', 'active', '192.168.1.103'),
  ('CAM-04', 'Toll Plaza', 'active', '192.168.1.104'),
  ('CAM-05', 'Exit Gate', 'active', '192.168.1.105'),
  ('CAM-06', 'Security Checkpoint', 'maintenance', '192.168.1.106'),
  ('CAM-07', 'Loading Dock', 'active', '192.168.1.107'),
  ('CAM-08', 'Service Road', 'active', '192.168.1.108');

-- Insert initial system stats
INSERT INTO public.system_stats (
  active_cameras, total_cameras, detections_today, 
  detections_hour, accuracy_rate, cpu_usage, 
  memory_usage, network_latency
) VALUES (7, 8, 2847, 127, 95.3, 65.4, 72.1, 23.5);
