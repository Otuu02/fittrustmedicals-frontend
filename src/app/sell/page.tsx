export default function SellPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sell on Fittrust Medicals</h1>
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <p className="text-gray-600 mb-4">
            Join our marketplace and reach thousands of healthcare professionals and medical facilities across Nigeria.
          </p>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Why Sell With Us?</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
            <li>Access to a large customer base of medical professionals</li>
            <li>Easy product listing and management</li>
            <li>Secure payment processing</li>
            <li>Dedicated seller support</li>
          </ul>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Become a Seller
          </button>
        </div>
      </div>
    </div>
  );
}