
-- Table to store OTPs for password reset
CREATE TABLE public.password_reset_otps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.password_reset_otps ENABLE ROW LEVEL SECURITY;

-- No direct user access - only edge functions with service role key can access
-- We intentionally leave no public policies so only service_role can read/write

-- Index for fast lookups
CREATE INDEX idx_password_reset_otps_email ON public.password_reset_otps (email, used, expires_at);

-- Auto-cleanup old OTPs (optional: can also be done in the edge function)
