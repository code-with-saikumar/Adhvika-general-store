import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Store, Heart, Users, MapPin, Phone } from 'lucide-react';
import storeBanner from '@/assets/adhvika-general-4.jpeg';

const AboutUs: React.FC = () => {
  return (
    <MainLayout>
      <div className="container py-12 max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">About Us</h1>

        <div className="space-y-10 text-muted-foreground">
          {/* Our Story */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Store className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Our Story</h2>
            </div>
            <p className="leading-relaxed">
              Adhvika General Store was founded by <span className="font-medium text-foreground">Vinod Kumar</span> with a simple vision — to serve the local community with quality products at honest prices. What started as a small neighborhood shop has grown into a trusted destination for daily essentials, beautiful bangles, cosmetics, and fancy items.
            </p>
            <p className="leading-relaxed mt-3">
              Located at New Bus Stand Road, Lokeshwaram, our store has been a part of the community for years, building lasting relationships with our customers through dedication and reliable service.
            </p>
            <div className="rounded-2xl overflow-hidden mt-6 max-w-xs mx-auto">
              <img src={storeBanner} alt="Adhvika General & Fancy Store, Bangles" className="w-full object-cover rounded-2xl" />
            </div>
          </section>

          {/* What We Offer */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">What We Offer</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-medium text-foreground">General Store</span> — Everyday groceries, household essentials, and daily-use products.</li>
              <li><span className="font-medium text-foreground">Bangles Collection</span> — Traditional, designer, and festive bangles for every occasion.</li>
              <li><span className="font-medium text-foreground">Fancy Items</span> — Cosmetics, accessories, jewelry, gifts, and more.</li>
            </ul>
          </section>

          {/* Our Team */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Our Team</h2>
            </div>
            <p className="leading-relaxed">
              Led by proprietor <span className="font-medium text-foreground">Vinod Kumar</span>, our small and dedicated team works hard to ensure every customer leaves satisfied. We believe in personal attention, helpful recommendations, and going the extra mile for our community.
            </p>
          </section>

          {/* Visit Us */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Visit Us</h2>
            </div>
            <div className="space-y-2">
              <p>New Bus Stand Road, Lokeshwaram</p>
              <p>Open: Monday – Sunday, 8:00 AM – 8:00 PM</p>
              <p className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <a href="tel:+917337377689" className="text-primary underline">7337377689</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutUs;
