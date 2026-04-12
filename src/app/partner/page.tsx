export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Partner Hub</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 mb-4">
            Become a strategic partner and grow your business with Fittrust Medicals.
          </p>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Partnership Opportunities</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
            <li>Distributor Partnerships</li>
            <li>Manufacturer Collaborations</li>
            <li>Healthcare Facility Partnerships</li>
            <li>Logistics Partners</li>
          </ul>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Apply for Partnership
          </button>
        </div>
      </div>
    </div>
  );
}