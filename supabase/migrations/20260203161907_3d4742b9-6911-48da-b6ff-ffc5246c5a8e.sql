-- Fix 1: Add CHECK constraints for input validation on products table
-- Using triggers instead of CHECK constraints for better flexibility

-- Create validation trigger function for products
CREATE OR REPLACE FUNCTION public.validate_product_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    -- Validate price is positive
    IF NEW.price <= 0 THEN
        RAISE EXCEPTION 'Price must be greater than 0';
    END IF;
    
    -- Validate stock is non-negative
    IF NEW.stock < 0 THEN
        RAISE EXCEPTION 'Stock cannot be negative';
    END IF;
    
    -- Validate discount is between 0 and 100
    IF NEW.discount IS NOT NULL AND (NEW.discount < 0 OR NEW.discount > 100) THEN
        RAISE EXCEPTION 'Discount must be between 0 and 100';
    END IF;
    
    -- Validate original_price if set is positive
    IF NEW.original_price IS NOT NULL AND NEW.original_price <= 0 THEN
        RAISE EXCEPTION 'Original price must be greater than 0';
    END IF;
    
    -- Validate rating is between 0 and 5
    IF NEW.rating IS NOT NULL AND (NEW.rating < 0 OR NEW.rating > 5) THEN
        RAISE EXCEPTION 'Rating must be between 0 and 5';
    END IF;
    
    -- Validate name length (max 500 chars)
    IF LENGTH(NEW.name) > 500 THEN
        RAISE EXCEPTION 'Product name must be less than 500 characters';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for product validation
DROP TRIGGER IF EXISTS validate_product_trigger ON products;
CREATE TRIGGER validate_product_trigger
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION validate_product_data();

-- Create validation trigger function for addresses
CREATE OR REPLACE FUNCTION public.validate_address_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    -- Validate name length (max 100 chars)
    IF LENGTH(NEW.name) > 100 THEN
        RAISE EXCEPTION 'Name must be less than 100 characters';
    END IF;
    
    -- Validate phone format (10-15 digits)
    IF NEW.phone !~ '^\d{10,15}$' THEN
        RAISE EXCEPTION 'Phone number must be 10-15 digits';
    END IF;
    
    -- Validate pincode format (6 digits for India)
    IF NEW.pincode !~ '^\d{6}$' THEN
        RAISE EXCEPTION 'Pincode must be 6 digits';
    END IF;
    
    -- Validate street length (max 500 chars)
    IF LENGTH(NEW.street) > 500 THEN
        RAISE EXCEPTION 'Street address must be less than 500 characters';
    END IF;
    
    -- Validate city length (max 100 chars)
    IF LENGTH(NEW.city) > 100 THEN
        RAISE EXCEPTION 'City must be less than 100 characters';
    END IF;
    
    -- Validate state length (max 100 chars)
    IF LENGTH(NEW.state) > 100 THEN
        RAISE EXCEPTION 'State must be less than 100 characters';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for address validation
DROP TRIGGER IF EXISTS validate_address_trigger ON addresses;
CREATE TRIGGER validate_address_trigger
    BEFORE INSERT OR UPDATE ON addresses
    FOR EACH ROW
    EXECUTE FUNCTION validate_address_data();

-- Create validation trigger function for reviews
CREATE OR REPLACE FUNCTION public.validate_review_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    -- Validate rating is between 1 and 5
    IF NEW.rating < 1 OR NEW.rating > 5 THEN
        RAISE EXCEPTION 'Rating must be between 1 and 5';
    END IF;
    
    -- Validate comment length (max 2000 chars)
    IF NEW.comment IS NOT NULL AND LENGTH(NEW.comment) > 2000 THEN
        RAISE EXCEPTION 'Comment must be less than 2000 characters';
    END IF;
    
    -- Validate user_name length (max 100 chars)
    IF LENGTH(NEW.user_name) > 100 THEN
        RAISE EXCEPTION 'User name must be less than 100 characters';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for review validation
DROP TRIGGER IF EXISTS validate_review_trigger ON reviews;
CREATE TRIGGER validate_review_trigger
    BEFORE INSERT OR UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION validate_review_data();

-- Create validation trigger function for order items
CREATE OR REPLACE FUNCTION public.validate_order_item_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    -- Validate quantity is positive
    IF NEW.quantity <= 0 THEN
        RAISE EXCEPTION 'Quantity must be greater than 0';
    END IF;
    
    -- Validate price is non-negative
    IF NEW.price < 0 THEN
        RAISE EXCEPTION 'Price cannot be negative';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for order item validation
DROP TRIGGER IF EXISTS validate_order_item_trigger ON order_items;
CREATE TRIGGER validate_order_item_trigger
    BEFORE INSERT OR UPDATE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION validate_order_item_data();

-- Create validation trigger function for cart items
CREATE OR REPLACE FUNCTION public.validate_cart_item_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    -- Validate quantity is positive
    IF NEW.quantity <= 0 THEN
        RAISE EXCEPTION 'Quantity must be greater than 0';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for cart item validation
DROP TRIGGER IF EXISTS validate_cart_item_trigger ON cart_items;
CREATE TRIGGER validate_cart_item_trigger
    BEFORE INSERT OR UPDATE ON cart_items
    FOR EACH ROW
    EXECUTE FUNCTION validate_cart_item_data();

-- Fix 2: Add explicit public access denial policy for cart_items
-- The current policy uses restrictive (No) but let's ensure it's clear
-- First check if anon users are denied by default - they are via authenticated requirement
-- But let's add an explicit policy to deny public/anon access for clarity

-- The cart_items table already has RLS enabled with a policy that only allows
-- authenticated users to access their own cart items. The policy is restrictive (Permissive: No)
-- which means it acts as a deny-by-default. However, we can make this more explicit.

-- No additional RLS needed as the current policy already handles this:
-- "Users can manage their own cart" for ALL operations with USING (auth.uid() = user_id)
-- Since this is the ONLY policy and it's restrictive, anonymous users are already denied.