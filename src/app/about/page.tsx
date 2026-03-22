import Image from 'next/image';
import { Shield, Award, Users, HeartPulse } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About FitTrust Medicals</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Providing high-quality, reliable medical supplies to healthcare professionals and individuals since 2020.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="max-w-7xl mx-auto px-4 py-16 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: Shield, title: 'Certified Quality', desc: 'All products meet strict medical standards.' },
            { icon: Users, title: 'Customer First', desc: 'Dedicated support for all our clients.' },
            { icon: Award, title: 'Industry Leaders', desc: 'Partnered with top healthcare brands.' },
            { icon: HeartPulse, title: 'Health Driven', desc: 'Our mission is your well-being.' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md text-center border border-gray-100">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              Founded with a vision to make premium medical supplies accessible to everyone, FitTrust Medicals has grown into a trusted partner for clinics, hospitals, and homes nationwide.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We understand that behind every order is a patient in need, a doctor preparing for surgery, or a family caring for a loved one. That's why we meticulously vet our suppliers and guarantee the authenticity of every product we ship.
            </p>
          </div>
          <div className="flex-1 w-full aspect-video bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
            [Team / Office Image Placeholder]
          </div>
        </div>
      </div>
    </div>
  );
}