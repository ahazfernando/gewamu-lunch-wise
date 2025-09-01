import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Clock, 
  DollarSign, 
  Users,
  Mail,
  Check,
  X,
  Calendar,
  AlertTriangle
} from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "order_invite",
      title: "New Lunch Order: Sakura Sushi",
      message: "John Doe invited you to join a lunch order from Sakura Sushi",
      timestamp: "2 minutes ago",
      isRead: false,
      urgent: false,
      data: {
        orderId: 1,
        organizer: "John Doe",
        restaurant: "Sakura Sushi",
        dueTime: "Today, 2:00 PM",
        yourShare: 24.25
      }
    },
    {
      id: 2,
      type: "payment_reminder",
      title: "Payment Due Soon",
      message: "Your payment of $18.50 for Thai Garden is due in 1 hour",
      timestamp: "30 minutes ago",
      isRead: false,
      urgent: true,
      data: {
        orderId: 2,
        restaurant: "Thai Garden",
        amount: 18.50,
        dueTime: "Today, 3:00 PM"
      }
    },
    {
      id: 3,
      type: "payment_received",
      title: "Payment Received",
      message: "Sarah Wilson paid $22.44 for your Pizza Corner order",
      timestamp: "1 hour ago",
      isRead: true,
      urgent: false,
      data: {
        orderId: 3,
        participant: "Sarah Wilson",
        amount: 22.44,
        restaurant: "Pizza Corner"
      }
    },
    {
      id: 4,
      type: "order_reminder",
      title: "Order Closing Soon",
      message: "Your Burger Palace order closes in 15 minutes",
      timestamp: "2 hours ago",
      isRead: false,
      urgent: true,
      data: {
        orderId: 4,
        restaurant: "Burger Palace",
        closeTime: "Today, 1:30 PM"
      }
    },
    {
      id: 5,
      type: "order_complete",
      title: "Order Completed",
      message: "All payments collected for Mexican Cantina order",
      timestamp: "1 day ago",
      isRead: true,
      urgent: false,
      data: {
        orderId: 5,
        restaurant: "Mexican Cantina",
        totalAmount: 112.30
      }
    }
  ]);

  const handleNotificationAction = (notificationId, action) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;

    switch (action) {
      case 'accept':
        alert(`You've joined the ${notification.data.restaurant} order`);
        markAsRead(notificationId);
        break;
      
      case 'decline':
        alert(`You've declined the ${notification.data.restaurant} order`);
        markAsRead(notificationId);
        break;
      
      case 'pay':
        alert(`Redirecting to payment for $${notification.data.amount}`);
        break;
      
      case 'view':
        alert(`Viewing order details for ${notification.data.restaurant}`);
        break;
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    alert("All notifications marked as read");
  };

  const sendReminder = (participantName) => {
    alert(`Payment reminder sent to ${participantName}`);
  };

  const getNotificationIcon = (type, urgent) => {
    const iconClass = urgent ? "text-red-500" : "text-blue-500";
    
    switch (type) {
      case "order_invite":
        return <Users className={`h-4 w-4 sm:h-5 sm:w-5 ${iconClass}`} />;
      case "payment_reminder":
        return <AlertTriangle className={`h-4 w-4 sm:h-5 sm:w-5 ${iconClass}`} />;
      case "payment_received":
        return <DollarSign className={`h-4 w-4 sm:h-5 sm:w-5 ${iconClass}`} />;
      case "order_reminder":
        return <Clock className={`h-4 w-4 sm:h-5 sm:w-5 ${iconClass}`} />;
      case "order_complete":
        return <Check className={`h-4 w-4 sm:h-5 sm:w-5 ${iconClass}`} />;
      default:
        return <Bell className={`h-4 w-4 sm:h-5 sm:w-5 ${iconClass}`} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const pendingParticipants = [
    { name: "Mike Johnson", email: "mike@company.com", amount: 22.75, restaurant: "Sakura Sushi" },
    { name: "Lisa Chen", email: "lisa@company.com", amount: 26.50, restaurant: "Sakura Sushi" },
    { name: "Emma Davis", email: "emma@company.com", amount: 24.25, restaurant: "Pizza Corner" }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Stay updated on your lunch orders and payments</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          {unreadCount > 0 && (
            <Button 
              className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-3 py-2 text-sm"
              onClick={markAllAsRead}
            >
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Notifications List */}
        <div className="xl:col-span-2 space-y-3 sm:space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 sm:p-4 border rounded-lg transition-all ${
                    notification.isRead 
                      ? 'bg-white border-gray-200' 
                      : 'bg-blue-50 border-blue-200 shadow-sm'
                  } ${notification.urgent ? 'border-red-300 bg-red-50' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row items-start gap-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type, notification.urgent)}
                    </div>
                    
                    <div className="flex-1 space-y-2 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h4 className={`font-semibold text-sm sm:text-base ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-600'
                        } truncate`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {notification.urgent && (
                            <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              Urgent
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {notification.timestamp}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {notification.message}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        {notification.type === 'order_invite' && !notification.isRead && (
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Button 
                              className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-2 text-xs sm:text-sm"
                              onClick={() => handleNotificationAction(notification.id, 'accept')}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Join Order
                            </Button>
                            <Button 
                              className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-3 py-2 text-xs sm:text-sm"
                              onClick={() => handleNotificationAction(notification.id, 'decline')}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Decline
                            </Button>
                          </div>
                        )}
                        
                        {notification.type === 'payment_reminder' && !notification.isRead && (
                          <Button 
                            className="bg-yellow-500 text-white hover:bg-yellow-600 px-3 py-2 text-xs sm:text-sm w-full sm:w-auto"
                            onClick={() => handleNotificationAction(notification.id, 'pay')}
                          >
                            <DollarSign className="h-3 w-3 mr-1" />
                            Pay ${notification.data.amount}
                          </Button>
                        )}
                        
                        <Button 
                          className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-3 py-2 text-xs sm:text-sm w-full sm:w-auto"
                          onClick={() => handleNotificationAction(notification.id, 'view')}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {notifications.length === 0 && (
                <div className="text-center py-6 sm:py-8">
                  <Bell className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-base sm:text-lg mb-2">No Notifications</h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    You're all caught up! New notifications will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Pending Reminders */}
          <Card className="shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                Send Reminders
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Participants with pending payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
              {pendingParticipants.length > 0 ? (
                pendingParticipants.map((participant, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-3 border rounded-lg">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate">{participant.name}</div>
                      <div className="text-xs text-gray-600">
                        ${participant.amount} • {participant.restaurant}
                      </div>
                    </div>
                    <Button 
                      className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-3 py-2 text-xs w-full sm:w-auto"
                      onClick={() => sendReminder(participant.name)}
                    >
                      <Mail className="h-3 w-3 sm:mr-1" />
                      <span className="sm:inline hidden">Send</span>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <Check className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-gray-600">
                    No pending payments
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Today's Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">Open Orders</span>
                <span className="font-semibold text-sm sm:text-base">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">Pending Payments</span>
                <span className="font-semibold text-yellow-600 text-sm sm:text-base">$42.75</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">Due Today</span>
                <span className="font-semibold text-red-600 text-sm sm:text-base">$18.50</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-4 sm:p-6 pt-0">
              <Button 
                className="w-full justify-start border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-3 py-2 text-xs sm:text-sm"
                onClick={() => alert('Creating new order...')}
              >
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Create New Order
              </Button>
              <Button 
                className="w-full justify-start border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-3 py-2 text-xs sm:text-sm"
                onClick={() => alert('Tracking payments...')}
              >
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Track Payments
              </Button>
              <Button 
                className="w-full justify-start border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-3 py-2 text-xs sm:text-sm"
                onClick={() => alert('Viewing history...')}
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                View History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notifications;