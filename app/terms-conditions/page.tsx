import React from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions | Breads & CakeStory',
  description: 'Terms and Conditions for Breads & CakeStory',
};

export default function TermsConditionsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream-50 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-cocoa-500 hover:text-luxury-gold transition-colors text-sm font-bold mb-8 uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="bg-white rounded-2xl shadow-premium border border-cream-200 p-8 sm:p-12">
            <div className="text-center mb-12">
              <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold mb-2 block">Legal Information</span>
              <h1 className="heading-luxury text-3xl sm:text-4xl text-cocoa-900 mb-4">Terms & Conditions</h1>
              <div className="w-16 h-[2px] bg-luxury-gold mx-auto mb-6" />
              <p className="text-sm text-cocoa-500">Effective Date: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="prose prose-sm sm:prose-base max-w-none text-cocoa-600 prose-headings:text-cocoa-900 prose-headings:font-bold prose-a:text-luxury-gold hover:prose-a:text-cocoa-900">
              <p>
                Welcome to <strong>Breads & CakeStory</strong>. These terms and conditions outline the rules and regulations for the use of our website and the purchase of our products and services.
              </p>
              <p>
                By accessing this website and/or placing an order with us, we assume you accept these terms and conditions in full. Do not continue to use Breads & CakeStory's website if you do not accept all of the terms and conditions stated on this page.
              </p>

              <h3>1. Orders & Custom Requests</h3>
              <ul>
                <li>All orders are subject to availability and confirmation of the order price.</li>
                <li>Custom cake inquiries must be placed with sufficient notice. Submitting an inquiry does not guarantee an order until we have confirmed availability and received any required advance payments.</li>
                <li>Modifications to custom orders must be requested at least 48 hours prior to the delivery/pickup time and are subject to approval.</li>
              </ul>

              <h3>2. Pricing & Payments</h3>
              <ul>
                <li>All prices are inclusive of applicable taxes unless stated otherwise.</li>
                <li>We reserve the right to change our product prices at any time without prior notice. However, changes will not affect orders that have already been confirmed.</li>
                <li>Payments must be completed through our designated payment gateways or in cash upon store pickup, as agreed during the ordering process.</li>
              </ul>

              <h3>3. Delivery & Fulfillment</h3>
              <ul>
                <li>Delivery charges apply based on the delivery location and will be calculated at checkout or during order confirmation.</li>
                <li>While we strive to deliver within the agreed timeframe, external factors (such as traffic and weather) may cause delays. We are not liable for any consequential losses arising from delivery delays.</li>
                <li>It is the customer's responsibility to provide accurate delivery details. Redelivery due to incorrect information may incur additional charges.</li>
              </ul>

              <h3>4. Cancellations & Refunds</h3>
              <ul>
                <li>Cancellations for standard orders are accepted if made within 24 hours of the scheduled delivery time.</li>
                <li>Custom orders cannot be canceled or refunded once preparation has begun, typically 48 hours before the delivery date.</li>
                <li>If a product arrives damaged or does not meet our quality standards, please contact us immediately with photographic evidence for assessment and potential refund or replacement.</li>
              </ul>

              <h3>5. Intellectual Property</h3>
              <p>
                Unless otherwise stated, Breads & CakeStory and/or its licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved. You may view and/or print pages from the website for your own personal use subject to restrictions set in these terms and conditions.
              </p>

              <h3>6. Limitation of Liability</h3>
              <p>
                To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this website. In no event shall Breads & CakeStory be liable for any direct, indirect, special, punitive, incidental, exemplary or consequential, damages, or any damages whatsoever, even if Breads & CakeStory has been previously advised of the possibility of such damages.
              </p>

              <h3>7. Governing Law and Jurisdiction</h3>
              <p>
                These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes relating to these Terms and Conditions will be subject to the exclusive jurisdiction of the courts located in Pune, Maharashtra, India.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
