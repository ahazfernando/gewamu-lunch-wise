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
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Notifications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleNotificationAction = (notificationId: number, action: 'accept' | 'decline' | 'pay' | 'view') => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;

    switch (action) {
      case 'accept':
        toast({
          title: "Order Joined",
          description: `You've joined the ${notification.data.restaurant} order`,
        });
        markAsRead(notificationId);
        navigate(`/order/${notification.data.orderId}`);
        break;
      
      case 'decline':
        toast({
          title: "Order Declined",
          description: `You've declined the ${notification.data.restaurant} order`,
        });
        markAsRead(notificationId);
        break;
      
      case 'pay':
        navigate(`/payment/${notification.data.orderId}`);
        break;
      
      case 'view':
        navigate(`/order/${notification.data.orderId}`);
        break;
    }
  };

  const markAsRead = (notificationId: number) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    toast({
      title: "All Notifications Read",
      description: "Marked all notifications as read",
    });
  };

  const sendReminder = (participantName: string) => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent to ${participantName}`,
    });
  };

  const getNotificationIcon = (type: string, urgent: boolean) => {
    const iconClass = urgent ? "text-destructive" : "text-primary";
    
    switch (type) {
      case "order_invite":
        return <Users className={`h-5 w-5 ${iconClass}`} />;
      case "payment_reminder":
        return <AlertTriangle className={`h-5 w-5 ${iconClass}`} />;
      case "payment_received":
        return <DollarSign className={`h-5 w-5 ${iconClass}`} />;
      case "order_reminder":
        return <Clock className={`h-5 w-5 ${iconClass}`} />;
      case "order_complete":
        return <Check className={`h-5 w-5 ${iconClass}`} />;
      default:
        return <Bell className={`h-5 w-5 ${iconClass}`} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const pendingParticipants = [
    { name: "Mike Johnson", email: "mike@company.com", amount: 22.75, restaurant: "Sakura Sushi" },
    { name: "Lisa Chen", email: "lisa@company.com", amount: 26.50, restaurant: "Sakura Sushi" },
    { name: "Emma Davis", email: "emma@company.com", amount: 24.25, restaurant: "Pizza Corner" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">Stay updated on your lunch orders and payments</p>
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg transition-all ${
                    notification.isRead 
                      ? 'bg-background border-border' 
                      : 'bg-muted/50 border-primary/20 shadow-sm'
                  } ${notification.urgent ? 'border-destructive/30' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type, notification.urgent)}
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-semibold ${
                          !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          {notification.urgent && (
                            <Badge variant="destructive" className="text-xs">Urgent</Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {notification.timestamp}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        {notification.type === 'order_invite' && !notification.isRead && (
                          <>
                            <Button 
                              size="sm"
                              onClick={() => handleNotificationAction(notification.id, 'accept')}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Join Order
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleNotificationAction(notification.id, 'decline')}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Decline
                            </Button>
                          </>
                        )}
                        
                        {notification.type === 'payment_reminder' && !notification.isRead && (
                          <Button 
                            size="sm"
                            onClick={() => handleNotificationAction(notification.id, 'pay')}
                            className="bg-warning text-warning-foreground hover:bg-warning/90"
                          >
                            <DollarSign className="h-3 w-3 mr-1" />
                            Pay ${notification.data.amount}
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="ghost"
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
                <div className="text-center py-8">
                  <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No Notifications</h3>
                  <p className="text-muted-foreground">
                    You're all caught up! New notifications will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          {/* Pending Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Send Reminders
              </CardTitle>
              <CardDescription>
                Participants with pending payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingParticipants.length > 0 ? (
                pendingParticipants.map((participant, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{participant.name}</div>
                      <div className="text-xs text-muted-foreground">
                        ${participant.amount} • {participant.restaurant}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => sendReminder(participant.name)}
                    >
                      <Mail className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <Check className="h-8 w-8 text-success mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No pending payments
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Open Orders</span>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending Payments</span>
                <span className="font-semibold text-warning">$42.75</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Due Today</span>
                <span className="font-semibold text-destructive">$18.50</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/create-order')}
              >
                <Users className="h-4 w-4 mr-2" />
                Create New Order
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/payment-tracking')}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Track Payments
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/history')}
              >
                <Calendar className="h-4 w-4 mr-2" />
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