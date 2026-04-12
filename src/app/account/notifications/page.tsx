'use client';

import { useAuthStore } from '@/stores/authStore';
import { Bell, Check, Trash2, Package, CreditCard, Truck, Tag } from 'lucide-react';

export default function NotificationsPage() {
  const { 
    customer, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    deleteNotification,
    getUnreadCount 
  } = useAuthStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'payment':
        return <CreditCard className="w-5 h-5 text-green-600" />;
      case 'shipping':
        return <Truck className="w-5 h-5 text-orange-600" />;
      case 'promotion':
        return <Tag className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-50';
      case 'payment':
        return 'bg-green-50';
      case 'shipping':
        return 'bg-orange-50';
      case 'promotion':
        return 'bg-purple-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">You have {getUnreadCount()} unread notifications</p>
        </div>
        {customer?.notifications && customer.notifications.length > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {customer?.notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          customer?.notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-sm border p-4 flex items-start space-x-4 ${
                notification.read ? 'border-gray-100 opacity-75' : 'border-blue-200 bg-blue-50/30'
              }`}
            >
              <div className={`p-3 rounded-lg ${getTypeColor(notification.type)}`}>
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {!notification.read && (
                      <button
                        onClick={() => markNotificationAsRead(notification.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}