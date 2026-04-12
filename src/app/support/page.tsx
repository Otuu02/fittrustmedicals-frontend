// src/app/support/page.tsx
'use client';

import { useState } from 'react';
import AIChat from '@/components/chat/AIChat';
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle,
  ChevronRight,
  Headphones,
  FileText,
  Users,
  Shield
} from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketData, setTicketData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send to your backend
    setTicketSubmitted(true);
    setTimeout(() => setTicketSubmitted(false), 3000);
    setTicketData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* AI Chat Component */}
      <AIChat />
      
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
            <Headphones className="w-4 h-4" />
            <span className="text-sm font-medium">24/7 Support Available</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How Can We Help You?</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get instant answers with our AI assistant or connect with our support team
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Live AI Chat</h3>
            <p className="text-gray-500 text-sm mb-4">Instant answers 24/7</p>
            <button 
              onClick={() => document.querySelector('button')?.click()}
              className="text-blue-600 text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              Start Chat <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Email Support</h3>
            <p className="text-gray-500 text-sm mb-4">Response within 24 hours</p>
            <a href="mailto:support@fittrustmedical.com" className="text-blue-600 text-sm font-medium">
              support@fittrustmedical.com
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Phone Support</h3>
            <p className="text-gray-500 text-sm mb-4">Mon-Fri, 9am - 6pm</p>
            <a href="tel:+2341234567890" className="text-blue-600 text-sm font-medium">
              +234 123 456 7890
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "How do I place an order?", a: "Browse our products, add to cart, and checkout securely." },
                { q: "What payment methods do you accept?", a: "Cards, bank transfer, and pay on delivery." },
                { q: "How long does shipping take?", a: "3-5 business days standard, 1-2 days express." },
                { q: "What is your return policy?", a: "7-day return policy for unused items." }
              ].map((faq, i) => (
                <details key={i} className="group">
                  <summary className="cursor-pointer list-none flex justify-between items-center py-2 font-medium text-gray-800 hover:text-blue-600">
                    {faq.q}
                    <ChevronRight className="w-4 h-4 transform group-open:rotate-90 transition" />
                  </summary>
                  <p className="text-gray-600 text-sm mt-2 pl-4 border-l-2 border-blue-200">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
            <Link href="/faq" className="mt-4 inline-block text-blue-600 text-sm font-medium">
              View all FAQs →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Support Resources</h2>
            <div className="space-y-3">
              {[
                { icon: FileText, label: "Product Documentation", desc: "User manuals and guides" },
                { icon: Users, label: "Community Forum", desc: "Connect with other users" },
                { icon: Shield, label: "Warranty Info", desc: "Product warranty details" },
                { icon: Clock, label: "Status Page", desc: "System uptime and maintenance" }
              ].map((resource, i) => (
                <Link key={i} href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <resource.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{resource.label}</p>
                    <p className="text-sm text-gray-500">{resource.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Submit a Support Ticket</h2>
          <p className="text-gray-600 mb-6">We'll get back to you within 24 hours</p>
          
          {ticketSubmitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-700">Ticket submitted successfully! We'll respond shortly.</p>
            </div>
          )}

          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={ticketData.name}
                  onChange={(e) => setTicketData({...ticketData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={ticketData.email}
                  onChange={(e) => setTicketData({...ticketData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <input
                type="text"
                required
                value={ticketData.subject}
                onChange={(e) => setTicketData({...ticketData, subject: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea
                rows={5}
                required
                value={ticketData.message}
                onChange={(e) => setTicketData({...ticketData, message: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder="Describe your issue in detail..."
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
            >
              Submit Ticket
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}