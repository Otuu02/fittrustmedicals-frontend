export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Returns Policy</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Our Return Guarantee</h2>
          <p className="text-gray-600 mb-4">We want you to be completely satisfied with your purchase.</p>
          
          <h3 className="font-semibold text-gray-800 mt-4 mb-2">Return Conditions:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4">
            <li>Items must be returned within 7 days of delivery</li>
            <li>Products must be unused and in original packaging</li>
            <li>Medical equipment must be in original condition</li>
            <li>Contact support before returning any items</li>
          </ul>
          
          <h3 className="font-semibold text-gray-800 mt-4 mb-2">How to Return:</h3>
          <ol className="list-decimal list-inside space-y-1 text-gray-600">
            <li>Contact our customer support team</li>
            <li>Provide your order number and reason for return</li>
            <li>Wait for return authorization</li>
            <li>Ship the item back to us</li>
          </ol>
        </div>
      </div>
    </div>
  );
}