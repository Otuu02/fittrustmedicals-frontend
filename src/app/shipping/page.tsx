export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Shipping Information</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Delivery Options</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800">Standard Delivery (3-5 business days)</h3>
              <p className="text-gray-600">₦3,000 or FREE on orders over ₦50,000</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Express Delivery (1-2 business days)</h3>
              <p className="text-gray-600">₦5,000 - Available in Lagos, Abuja, Port Harcourt</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Delivery Areas</h2>
          <p className="text-gray-600">We deliver to all states in Nigeria. Express delivery available in major cities.</p>
          <button className="mt-4 text-blue-600 hover:text-blue-700">Check your delivery area →</button>
        </div>
      </div>
    </div>
  );
}