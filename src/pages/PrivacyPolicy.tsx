import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const PrivacyPolicy: React.FC = () => {
  return (
    <MainLayout>
      <div className="container py-12 max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Personal details such as name, phone number, and email address provided during account registration.</li>
              <li>Delivery address for order fulfillment.</li>
              <li>Order history and payment details for transaction records.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To process and deliver your orders.</li>
              <li>To communicate order updates via WhatsApp, SMS, or email.</li>
              <li>To improve our services and customer experience.</li>
              <li>We do not sell or share your personal information with third parties for marketing purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Data Security</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Your data is stored securely and access is restricted to authorized personnel only.</li>
              <li>Payment information is processed through secure payment gateways and is not stored on our servers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Your Rights</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You can update or delete your account information from the Profile page at any time.</li>
              <li>You may request deletion of your data by contacting us.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Contact Us</h2>
            <p>
              For any privacy-related concerns, reach us on{' '}
              <a href="https://wa.me/917337377689" className="text-primary underline" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              {' '}or call{' '}
              <a href="tel:+917337377689" className="text-primary underline">7337377689</a>.
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicy;
