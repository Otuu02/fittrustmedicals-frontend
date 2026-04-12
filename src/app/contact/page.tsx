'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Have a question about a product, need help with an order, or looking for bulk pricing? Our team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-full text-blue-600">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Phone</h3>
              <p className="text-gray-600 mt-1">+2348083483440,+2348164091531</p>
              <p className="text-sm text-gray-500 mt-1">Mon-Fri from 8am to 5pm.</p>
            </div>
          </Card>

          <Card className="p-6 flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-full text-blue-600">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Email</h3>
              <p className="text-gray-600 mt-1">fittrustsurgical@gmail.com</p>
              <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours.</p>
            </div>
          </Card>

          <Card className="p-6 flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-full text-blue-600">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Office</h3>
              <p className="text-gray-600 mt-1">123 Healthway Drive<br />Medical District, NY 10001</p>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="p-8">
            {sent ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <Send size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">We've received your message and will get back to you shortly.</p>
                <Button className="mt-6" onClick={() => setSent(false)}>Send Another Message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="First Name" required />
                  <Input label="Last Name" required />
                </div>
                <Input label="Email Address" type="email" required />
                <Input label="Subject" required />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[150px]"
                    required
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <Button type="submit" size="lg" isLoading={loading} className="w-full sm:w-auto">
                  Send Message
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}