export default function PaymentShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment & Shipping</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Payment Methods</h2>
          <ul className="space-y-2 text-gray-600 mb-6">
            <li>✓ Credit/Debit Cards (Visa, Mastercard, Verve)</li>
            <li>✓ Bank Transfer</li>
            <li>✓ Pay on Delivery (Selected locations)</li>
            <li>✓ Mobile Money</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Shipping Information</h2>
          <ul className="space-y-2 text-gray-600">
            <li>✓ Free shipping on orders over ₦50,000</li>
            <li>✓ Express delivery: 1-2 business days</li>
            <li>✓ Standard delivery: 3-5 business days</li>
            <li>✓ Nationwide delivery across Nigeria</li>
          </ul>
        </div>
      </div>
    </div>
  );
}