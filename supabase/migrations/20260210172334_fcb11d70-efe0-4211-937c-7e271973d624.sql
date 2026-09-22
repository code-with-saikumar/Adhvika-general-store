-- Allow admins to update any review (for approval/hiding)
CREATE POLICY "Admins can update any review"
ON public.reviews
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));
