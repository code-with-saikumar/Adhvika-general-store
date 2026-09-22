import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const TermsConditions: React.FC = () => {
  return (
    <MainLayout>
      <div className="container py-12 max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Terms & Conditions</h1>
        <ul className="space-y-4 text-muted-foreground list-disc pl-5">
          <li>This website is operated by Adhvika General Store.</li>
          <li>We provide General, Bangles and Fancy items delivery within local area only.</li>
          <li>Orders will be prepared after payment confirmation.</li>
          <li>Delivery time depends on availability of items.</li>
          <li>We reserve the right to cancel orders in case of stock issues (refund issued).</li>
        </ul>
      </div>
    </MainLayout>
  );
};

export default TermsConditions;
