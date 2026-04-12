'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Megaphone, 
  Plus, 
  Calendar, 
  Percent, 
  Tag,
  Edit2,
  Trash2,
  Eye,
  Pause,
  Play,
  Image,
  X,
  Gift,
  Clock,
  Search,
  Check,
  Package
} from 'lucide-react';
import { usePromotionsStore } from '@/stores/promotionsStore';
import { useProductsStore } from '@/stores/productsStore';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  stock: number;
  status: string;
  discountPercentage?: number;
}

interface Promotion {
  id: string;
  name: string;
  type: 'percentage' | 'fixed_amount' | 'buy_one_get_one' | 'banner' | 'campaign';
  value: number;
  code?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  displayOnHomepage?: boolean;
  bannerText?: string;
  imageUrl?: string;
  usageCount: number;
  usageLimit?: number;
  createdAt: string;
  productIds?: string[];
  selectedProducts?: Product[];
}

// Placeholder image as data URL to avoid network errors
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';

// Helper function to sync campaigns to API
const syncCampaignToAPI = async (action: string, campaign?: any) => {
  try {
    await fetch('/api/catalog/products-with-campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, campaignId: campaign?.id, campaign })
    });
  } catch (error) {
    console.error('Error syncing campaign:', error);
  }
};

export default function PromotionsPage() {
  const { promotions, createPromotion, togglePromotion, deletePromotion, updatePromotion } = usePromotionsStore();
  const { products, setPromotional, removePromotional } = useProductsStore();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [modalType, setModalType] = useState<'banner' | 'campaign'>('campaign');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'campaign' as 'banner' | 'campaign',
    value: 10,
    code: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    bannerText: '',
    imageUrl: '',
    displayOnHomepage: true,
    usageLimit: 100,
    isActive: true
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/catalog/products');
      const data = await response.json();
      
      let productsData = [];
      if (data.success && data.products) {
        productsData = data.products;
      } else if (Array.isArray(data)) {
        productsData = data;
      } else if (data.products) {
        productsData = data.products;
      }
      
      const processedProducts = productsData.map((p: Product) => ({
        ...p,
        image: p.image && !p.image.includes('placeholder') ? p.image : PLACEHOLDER_IMAGE
      }));
      
      setAllProducts(processedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleOpenCreateBanner = () => {
    setModalType('banner');
    setEditingPromotion(null);
    setSelectedProducts([]);
    setSearchTerm('');
    setFormData({
      name: '',
      type: 'banner',
      value: 15,
      code: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      bannerText: 'Special offer! Get discount on selected items',
      imageUrl: '',
      displayOnHomepage: true,
      usageLimit: 500,
      isActive: true
    });
    setShowCreateModal(true);
  };

  const handleOpenCreateCampaign = () => {
    setModalType('campaign');
    setEditingPromotion(null);
    setSelectedProducts([]);
    setSearchTerm('');
    setFormData({
      name: '',
      type: 'campaign',
      value: 10,
      code: `SALE${Math.floor(Math.random() * 10000)}`,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      bannerText: '',
      imageUrl: '',
      displayOnHomepage: true,
      usageLimit: 100,
      isActive: true
    });
    setShowCreateModal(true);
  };

  const handleEditPromotion = (promo: Promotion) => {
    setModalType(promo.bannerText || promo.type === 'percentage' ? 'banner' : 'campaign');
    setEditingPromotion(promo);
    setSelectedProducts(promo.selectedProducts || []);
    setFormData({
      name: promo.name,
      type: promo.bannerText || promo.type === 'percentage' ? 'banner' : 'campaign',
      value: promo.value,
      code: promo.code || '',
      startDate: promo.startDate.split('T')[0],
      endDate: promo.endDate.split('T')[0],
      bannerText: promo.bannerText || '',
      imageUrl: promo.imageUrl || '',
      displayOnHomepage: promo.displayOnHomepage ?? true,
      usageLimit: promo.usageLimit || 100,
      isActive: promo.isActive
    });
    setShowCreateModal(true);
  };

  const toggleProductSelection = (product: Product) => {
    const isSelected = selectedProducts.find(p => p.id === product.id);
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const removeSelectedProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const handleSubmitPromotion = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a promotion name');
      return;
    }

    const storeType = formData.type === 'banner' ? 'percentage' : 'fixed_amount';

    const promotionData = {
      id: editingPromotion?.id || Date.now().toString(),
      name: formData.name,
      type: storeType,
      value: formData.value,
      code: formData.type === 'campaign' ? formData.code : undefined,
      startDate: formData.startDate,
      endDate: formData.endDate,
      bannerText: formData.type === 'banner' ? formData.bannerText : undefined,
      imageUrl: formData.type === 'banner' ? formData.imageUrl : undefined,
      displayOnHomepage: formData.displayOnHomepage,
      usageLimit: formData.usageLimit,
      usageCount: editingPromotion?.usageCount || 0,
      isActive: formData.isActive,
      createdAt: editingPromotion?.createdAt || new Date().toISOString(),
      applicableProducts: selectedProducts.map(p => p.id),
      applicableCategories: [],
      selectedProducts: selectedProducts
    };

    if (editingPromotion) {
      updatePromotion(editingPromotion.id, promotionData as any);
      await syncCampaignToAPI('update', promotionData);
      alert(`${formData.type === 'banner' ? 'Banner' : 'Campaign'} updated successfully!`);
    } else {
      createPromotion(promotionData as any);
      await syncCampaignToAPI('add', promotionData);
      alert(`${formData.type === 'banner' ? 'Banner' : 'Campaign'} created successfully!`);
    }

    setShowCreateModal(false);
    setEditingPromotion(null);
    setSelectedProducts([]);
  };

  const handleDeletePromotion = async (promoId: string, promoName: string) => {
    if (confirm(`Delete "${promoName}"? This action cannot be undone.`)) {
      deletePromotion(promoId);
      await syncCampaignToAPI('delete', { id: promoId });
      alert('Campaign deleted successfully!');
    }
  };

  const handleTogglePromotion = (promoId: string, productId?: string) => {
    const promo = promotions.find(p => p.id === promoId);
    if (productId && promo) {
      if (promo.isActive) {
        removePromotional(productId);
      } else {
        setPromotional(productId, true, promo.value || 10);
      }
    }
    togglePromotion(promoId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (startDate: string, endDate: string, isActive: boolean) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (!isActive) return 'bg-gray-100 text-gray-800';
    if (now < start) return 'bg-yellow-100 text-yellow-800';
    if (now > end) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (startDate: string, endDate: string, isActive: boolean) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (!isActive) return 'Paused';
    if (now < start) return 'Scheduled';
    if (now > end) return 'Expired';
    return 'Active';
  };

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const homepagePromotions = promotions.filter(p => 
    p.displayOnHomepage === true && 
    p.isActive === true
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Promotions & Campaigns</h2>
          <p className="text-gray-500 mt-1">Manage discounts, sales, and marketing campaigns</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleOpenCreateBanner}
            className="flex items-center space-x-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
          >
            <Image className="w-5 h-5" />
            <span>Create New Banner</span>
          </button>
          <button 
            onClick={handleOpenCreateCampaign}
            className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            <Gift className="w-5 h-5" />
            <span>Create New Campaign</span>
          </button>
        </div>
      </div>

      {/* Active Promotions on Homepage Section - FIXED */}
      {homepagePromotions.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Image className="w-5 h-5 text-purple-600" />
            Active Homepage Promotions ({homepagePromotions.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homepagePromotions.map((promo) => (
              <motion.div 
                key={promo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative overflow-hidden rounded-2xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow ${
                  promo.bannerText || promo.type === 'percentage' 
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white' 
                    : 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white'
                }`}
                onClick={() => handleEditPromotion(promo as Promotion)}
              >
                <div className="relative z-10">
                  <div className="flex items-center space-x-2 mb-3">
                    {promo.bannerText || promo.type === 'percentage' ? (
                      <>
                        <Megaphone className="w-5 h-5" />
                        <span className="font-medium text-purple-100">Banner</span>
                      </>
                    ) : (
                      <>
                        <Gift className="w-5 h-5" />
                        <span className="font-medium text-blue-100">Campaign</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{promo.name}</h3>
                  <p className="text-white/80 text-sm mb-4">
                    {promo.bannerText || promo.code || `Get ${promo.value}% OFF`}
                  </p>
                  <div className="flex items-center space-x-4 text-sm flex-wrap gap-2">
                    <span className="flex items-center space-x-1">
                      <Percent className="w-4 h-4" />
                      <span>{promo.value}% OFF</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Ends {new Date(promo.endDate).toLocaleDateString()}</span>
                    </span>
                  </div>
                  {promo.code && (
                    <div className="mt-3 px-3 py-1 bg-white/20 rounded-lg inline-block">
                      <span className="text-xs font-mono">Code: {promo.code}</span>
                    </div>
                  )}
                </div>
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Promotion Placeholder */}
      {homepagePromotions.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={handleOpenCreateBanner}
            className="rounded-2xl border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-gray-500 hover:border-purple-500 hover:text-purple-600 transition-colors min-h-[200px]"
          >
            <Image className="w-12 h-12 mb-2" />
            <span className="font-medium">Create New Banner</span>
            <span className="text-sm mt-1">Display promotional banners on homepage</span>
          </button>
          <button 
            onClick={handleOpenCreateCampaign}
            className="rounded-2xl border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors min-h-[200px]"
          >
            <Gift className="w-12 h-12 mb-2" />
            <span className="font-medium">Create New Campaign</span>
            <span className="text-sm mt-1">Set up discount campaigns with promo codes</span>
          </button>
        </div>
      )}

      {/* Promotions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">All Promotions ({promotions.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Campaign</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Homepage</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Usage</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {promotions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Megaphone className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No promotions created yet</p>
                    <div className="flex gap-3 justify-center mt-4">
                      <button 
                        onClick={handleOpenCreateBanner}
                        className="text-purple-600 hover:underline"
                      >
                        Create a banner
                      </button>
                      <span className="text-gray-300">|</span>
                      <button 
                        onClick={handleOpenCreateCampaign}
                        className="text-blue-600 hover:underline"
                      >
                        Create a campaign
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                [...promotions].map((promo) => (
                  <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          promo.bannerText || promo.type === 'percentage' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {promo.bannerText || promo.type === 'percentage' ? <Image className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{promo.name}</p>
                          {promo.code && (
                            <p className="text-sm text-gray-500">Code: {promo.code}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        promo.bannerText || promo.type === 'percentage' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      } capitalize`}>
                        {promo.bannerText || promo.type === 'percentage' ? 'Banner' : 'Campaign'}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">{promo.value}% off</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="whitespace-nowrap">
                          {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleTogglePromotion(promo.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${getStatusColor(promo.startDate, promo.endDate, promo.isActive)}`}
                      >
                        {getStatusText(promo.startDate, promo.endDate, promo.isActive) === 'Active' && <Play className="w-3 h-3 mr-1" />}
                        {getStatusText(promo.startDate, promo.endDate, promo.isActive) === 'Paused' && <Pause className="w-3 h-3 mr-1" />}
                        {getStatusText(promo.startDate, promo.endDate, promo.isActive) === 'Scheduled' && <Clock className="w-3 h-3 mr-1" />}
                        {getStatusText(promo.startDate, promo.endDate, promo.isActive)}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        promo.displayOnHomepage ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {promo.displayOnHomepage ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {promo.usageCount || 0} / {promo.usageLimit || '∞'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleEditPromotion(promo as Promotion)}
                          className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePromotion(promo.id, promo.name)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal with Product Selection */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {editingPromotion ? 'Edit' : 'Create New'} {modalType === 'banner' ? 'Banner' : 'Campaign'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {modalType === 'banner' 
                    ? 'Add a promotional banner to attract customers' 
                    : 'Set up a discount campaign with a promo code and select products'}
                </p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rest of the modal remains the same */}
            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name / Title *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder={modalType === 'banner' ? "e.g., Spring Sale 2026" : "e.g., Summer Discount Campaign"}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value (%)</label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: parseInt(e.target.value) || 0})}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {/* Promo Code (Campaign only) */}
              {modalType === 'campaign' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="e.g., SUMMER20"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
                  />
                </div>
              )}

              {/* Banner Text (Banner only) */}
              {modalType === 'banner' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Text</label>
                  <input
                    type="text"
                    value={formData.bannerText}
                    onChange={(e) => setFormData({...formData, bannerText: e.target.value})}
                    placeholder="e.g., Get 20% off on all medical equipment"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              )}

              {/* Product Selection (Campaign only) */}
              {modalType === 'campaign' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Products for this Campaign</label>
                  
                  {/* Search Products */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search products by name or category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  {/* Selected Products */}
                  {selectedProducts.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Selected Products ({selectedProducts.length})</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedProducts.map((product) => (
                          <div key={product.id} className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                            <img 
                              src={product.image || PLACEHOLDER_IMAGE} 
                              alt={product.name} 
                              className="w-6 h-6 rounded object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                              }}
                            />
                            <span className="text-sm text-gray-700">{product.name}</span>
                            <button onClick={() => removeSelectedProduct(product.id)} className="text-red-500 hover:text-red-700">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Products Grid */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-1">
                      {filteredProducts.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No products found</p>
                        </div>
                      ) : (
                        filteredProducts.map((product) => {
                          const isSelected = selectedProducts.some(p => p.id === product.id);
                          return (
                            <div
                              key={product.id}
                              onClick={() => toggleProductSelection(product)}
                              className={`flex items-center gap-4 p-3 cursor-pointer transition-colors ${
                                isSelected ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img 
                                  src={product.image || PLACEHOLDER_IMAGE} 
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 truncate">{product.name}</p>
                                <div className="flex items-center gap-3 mt-0.5">
                                  <span className="text-sm text-blue-600 font-semibold">{formatPrice(product.price)}</span>
                                  <span className="text-xs text-gray-500">{product.category}</span>
                                  <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    Stock: {product.stock}
                                  </span>
                                </div>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                              }`}>
                                {isSelected && <Check className="w-4 h-4 text-white" />}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Select products that will be included in this campaign
                  </p>
                </div>
              )}

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Usage Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({...formData, usageLimit: parseInt(e.target.value) || 0})}
                  min="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Set to 0 for unlimited usage</p>
              </div>

              {/* Show on Homepage */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <label className="text-sm font-medium text-gray-700">Show on Homepage</label>
                <button
                  onClick={() => setFormData({...formData, displayOnHomepage: !formData.displayOnHomepage})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.displayOnHomepage ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.displayOnHomepage ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <label className="text-sm font-medium text-gray-700">Active Status</label>
                <button
                  onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.isActive ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPromotion}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                {editingPromotion ? 'Update' : 'Create'} {modalType === 'banner' ? 'Banner' : 'Campaign'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}