-- Add expected_delivery_date column to orders table
ALTER TABLE public.orders 
ADD COLUMN expected_delivery_date DATE NULL;

-- Add a comment explaining the column
COMMENT ON COLUMN public.orders.expected_delivery_date IS 'Expected delivery date set by admin';