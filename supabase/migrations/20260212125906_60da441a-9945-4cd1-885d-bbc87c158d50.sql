CREATE POLICY "Users can cancel their own orders"
ON public.orders
FOR UPDATE
USING (auth.uid() = user_id AND order_status = 'placed')
WITH CHECK (auth.uid() = user_id AND order_status = 'cancelled');