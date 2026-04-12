export default function FAQPage() {
  const faqs = [
    {
      q: "How do I place an order?",
      a: "Simply browse our products, add items to your cart, and proceed to checkout. Follow the prompts to complete your purchase."
    },
    {
      q: "What is your return policy?",
      a: "We offer a 7-day return policy for unused items in original packaging. Contact our support team to initiate a return."
    },
    {
      q: "How long does delivery take?",
      a: "Delivery typically takes 3-5 business days for standard shipping, or 1-2 days for express delivery within major cities."
    },
    {
      q: "Are your products certified?",
      a: "Yes, all our medical equipment and supplies are ISO certified and meet Nigerian health standards."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}