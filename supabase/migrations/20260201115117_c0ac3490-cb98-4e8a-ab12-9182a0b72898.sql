-- Fix function search path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Seed initial products
INSERT INTO public.products (name, description, price, original_price, category, subcategory, stock, images, rating, reviews_count, featured, is_new, discount) VALUES
-- General Store Items
('Premium Basmati Rice (25kg)', 'High quality aged basmati rice, perfect for biryani and pulao', 1250.00, 1450.00, 'general', 'Rice & Grains', 50, ARRAY['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'], 4.5, 128, true, false, 14),
('Organic Wheat Flour (10kg)', 'Stone ground organic chakki atta for soft rotis', 450.00, 520.00, 'general', 'Flour', 30, ARRAY['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'], 4.8, 95, true, false, 13),
('Sunflower Cooking Oil (5L)', 'Refined sunflower oil for healthy cooking', 650.00, 750.00, 'general', 'Cooking Oil', 40, ARRAY['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'], 4.3, 67, false, false, 13),
('Sugar (5kg)', 'Pure refined white sugar', 280.00, NULL, 'general', 'Sugar & Salt', 100, ARRAY['https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400'], 4.6, 42, false, false, 0),
('Toor Dal (1kg)', 'Premium quality toor dal for everyday cooking', 180.00, 210.00, 'general', 'Pulses', 75, ARRAY['https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400'], 4.4, 56, false, true, 14),

-- Bangles
('Traditional Glass Bangles Set (24pc)', 'Beautiful multicolor glass bangles set, perfect for festivals', 299.00, 399.00, 'bangles', 'Glass Bangles', 100, ARRAY['https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400'], 4.7, 234, true, false, 25),
('Bridal Gold Plated Bangles (12pc)', 'Premium gold plated designer bangles for weddings', 1499.00, 1999.00, 'bangles', 'Bridal Bangles', 25, ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400'], 4.9, 89, true, false, 25),
('Lac Bangles Designer Set (6pc)', 'Handcrafted lac bangles with stone work', 599.00, 799.00, 'bangles', 'Lac Bangles', 40, ARRAY['https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=400'], 4.6, 156, false, true, 25),
('Silk Thread Bangles (4pc)', 'Colorful silk thread wrapped bangles', 249.00, 299.00, 'bangles', 'Thread Bangles', 60, ARRAY['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400'], 4.5, 78, false, false, 17),
('Metal Kada Set (2pc)', 'Heavy metal kada with intricate design', 899.00, 1199.00, 'bangles', 'Metal Bangles', 35, ARRAY['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400'], 4.8, 112, true, false, 25),

-- Fancy Items
('Premium Makeup Kit Complete Set', 'All-in-one professional makeup kit with brushes', 2499.00, 3499.00, 'fancy', 'Makeup', 20, ARRAY['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400'], 4.6, 187, true, true, 29),
('Designer Clutch Bag', 'Elegant party wear clutch with chain strap', 799.00, 999.00, 'fancy', 'Bags', 30, ARRAY['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400'], 4.4, 92, false, false, 20),
('Pearl Necklace Set', 'Classic pearl necklace with matching earrings', 1299.00, 1699.00, 'fancy', 'Jewellery', 15, ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400'], 4.8, 145, true, false, 24),
('Hair Accessories Gift Set', 'Complete hair styling accessories collection', 399.00, 549.00, 'fancy', 'Hair Accessories', 50, ARRAY['https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400'], 4.3, 67, false, true, 27),
('Bridal Gift Hamper', 'Luxury bridal gift set with cosmetics and accessories', 3999.00, 4999.00, 'fancy', 'Gift Sets', 10, ARRAY['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400'], 4.9, 45, true, false, 20),
('Lipstick Set (6 Shades)', 'Long lasting matte lipstick collection', 599.00, 799.00, 'fancy', 'Makeup', 45, ARRAY['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400'], 4.5, 234, false, false, 25),
('Designer Earrings Collection', 'Traditional jhumka earrings with kundan work', 899.00, 1199.00, 'fancy', 'Jewellery', 25, ARRAY['https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=400'], 4.7, 156, true, true, 25),
('Nail Art Kit', 'Complete nail art set with 50+ items', 699.00, 899.00, 'fancy', 'Nail Care', 35, ARRAY['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400'], 4.4, 89, false, true, 22);