import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const RefundPolicy: React.FC = () => {
  return (
    <MainLayout>
      <div className="container py-12 max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Refund Policy</h1>
        <ul className="space-y-4 text-muted-foreground list-disc pl-5">
          <li>Orders once confirmed cannot be cancelled after packing.</li>
          <li>If payment is deducted and the order is not delivered, refund will be processed within 24 hours to the original payment method.</li>
          <li>
            For any issues contact us on{' '}
            <a href="https://wa.me/917337377689" className="text-primary underline" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            {' '}or call{' '}
            <a href="tel:+917337377689" className="text-primary underline">7337377689</a>.
          </li>
        </ul>
      </div>
    </MainLayout>
  );
};

export default RefundPolicy;
