
-- Create a function to decrement product stock when order is delivered
CREATE OR REPLACE FUNCTION public.decrement_stock_on_delivery()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    -- Only trigger when status changes TO 'delivered'
    IF NEW.order_status = 'delivered' AND OLD.order_status != 'delivered' THEN
        -- Decrement stock for each item in the order
        UPDATE public.products p
        SET stock = GREATEST(0, p.stock - oi.quantity)
        FROM public.order_items oi
        WHERE oi.order_id = NEW.id
          AND p.id = oi.product_id;
    END IF;
    
    -- If order is cancelled after delivery, restore stock
    IF NEW.order_status = 'cancelled' AND OLD.order_status = 'delivered' THEN
        UPDATE public.products p
        SET stock = p.stock + oi.quantity
        FROM public.order_items oi
        WHERE oi.order_id = NEW.id
          AND p.id = oi.product_id;
    END IF;
    
    -- If order is returned, restore stock
    IF NEW.order_status = 'returned' AND OLD.order_status = 'delivered' THEN
        UPDATE public.products p
        SET stock = p.stock + oi.quantity
        FROM public.order_items oi
        WHERE oi.order_id = NEW.id
          AND p.id = oi.product_id;
    END IF;
    
    RETURN NEW;
END;
$function$;

-- Create trigger on orders table
CREATE TRIGGER decrement_stock_on_delivery_trigger
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.decrement_stock_on_delivery();
