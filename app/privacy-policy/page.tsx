import React from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Breads & CakeStory',
  description: 'Privacy Policy for Breads & CakeStory',
};

export default function PrivacyPolicyPage() {
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
              <h1 className="heading-luxury text-3xl sm:text-4xl text-cocoa-900 mb-4">Privacy Policy</h1>
              <div className="w-16 h-[2px] bg-luxury-gold mx-auto mb-6" />
              <p className="text-sm text-cocoa-500">Effective Date: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="prose prose-sm sm:prose-base max-w-none text-cocoa-600 prose-headings:text-cocoa-900 prose-headings:font-bold prose-a:text-luxury-gold hover:prose-a:text-cocoa-900">
              <p>
                At <strong>Breads & CakeStory</strong> ("we," "us," or "our"), we respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
              </p>

              <h3>1. Information We Collect</h3>
              <p>
                We may collect, use, store, and transfer different kinds of personal data about you, which we have grouped together as follows:
              </p>
              <ul>
                <li><strong>Identity Data:</strong> includes first name, last name, username, or similar identifier.</li>
                <li><strong>Contact Data:</strong> includes billing address, delivery address, email address, and telephone numbers.</li>
                <li><strong>Financial Data:</strong> includes payment card details (processed securely via our payment gateways, not stored on our servers).</li>
                <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location.</li>
              </ul>

              <h3>2. How We Use Your Data</h3>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul>
                <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., fulfilling your cake order).</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal or regulatory obligation.</li>
              </ul>

              <h3>3. Data Security</h3>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
              </p>

              <h3>4. Data Retention</h3>
              <p>
                We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
              </p>

              <h3>5. Your Legal Rights</h3>
              <p>
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, or to object to processing.
              </p>

              <h3>6. Jurisdiction and Governing Law</h3>
              <p>
                This Privacy Policy and any disputes arising out of or in connection with it shall be governed by and construed in accordance with the laws of India. You agree that the courts of Pune, Maharashtra, India, shall have exclusive jurisdiction to resolve any disputes.
              </p>

              <h3>7. Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <ul>
                <li><strong>Business Name:</strong> Breads & CakeStory</li>
                <li><strong>Address:</strong> Ambegaon, Pune - 46, Maharashtra, India</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
