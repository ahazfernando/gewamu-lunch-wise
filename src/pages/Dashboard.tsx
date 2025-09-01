import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Users, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const activeOrders = [
    {
      id: 1,
      restaurant: "Sakura Sushi",
      organizer: "John Doe",
      totalAmount: 145.50,
      participants: 6,
      status: "open",
      dueDate: "Today, 2:00 PM",
      myShare: 24.25
    },
    {
      id: 2,
      restaurant: "Pizza Corner",
      organizer: "Sarah Wilson", 
      totalAmount: 89.75,
      participants: 4,
      status: "closed",
      dueDate: "Today, 1:30 PM",
      myShare: 22.44
    }
  ];

  const pendingPayments = [
    {
      id: 1,
      restaurant: "Thai Garden",
      amount: 18.50,
      dueDate: "Yesterday",
      overdue: true
    },
    {
      id: 2,
      restaurant: "Burger Palace",
      amount: 12.75,
      dueDate: "2 days ago",
      overdue: true
    }
  ];

  const stats = [
    {
      title: "Active Orders",
      value: "3",
      description: "Currently participating",
      icon: Users,
      trend: "+2 from last week"
    },
    {
      title: "Pending Payments",
      value: "$31.25",
      description: "Outstanding amount",
      icon: DollarSign,
      trend: "-$15 from last week"
    },
    {
      title: "Orders Organized",
      value: "12",
      description: "This month",
      icon: TrendingUp,
      trend: "+4 from last month"
    },
    {
      title: "Total Saved",
      value: "$240",
      description: "Through group orders",
      icon: CheckCircle,
      trend: "+$45 this month"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Manage your lunch orders and payments</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate("/notifications")}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Clock className="h-4 w-4" />
            <span className="sm:inline">Join Order</span>
          </Button>
          <Button 
            onClick={() => navigate("/create-order")}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span className="sm:inline">Create Order</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <p className="text-xs text-success mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Lunch Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Active Lunch Orders
            </CardTitle>
            <CardDescription>
              Orders you're participating in or organizing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/order/${order.id}`)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-foreground">{order.restaurant}</h4>
                  <Badge 
                    variant={order.status === 'open' ? 'default' : 'secondary'}
                    className="w-fit"
                  >
                    {order.status === 'open' ? 'Open' : 'Closed'}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm text-muted-foreground mb-2">
                  <span>Organized by {order.organizer}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {order.dueDate}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-sm">
                    {order.participants} participants • ${order.totalAmount}
                  </span>
                  <span className="font-semibold text-primary">
                    Your share: ${order.myShare}
                  </span>
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/history")}
            >
              View All Orders
            </Button>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Pending Payments
            </CardTitle>
            <CardDescription>
              Orders waiting for your payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingPayments.length > 0 ? (
              pendingPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/payment/${payment.id}`)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-foreground">
                      {payment.restaurant}
                    </h4>
                    <Badge 
                      variant={payment.overdue ? 'destructive' : 'secondary'}
                      className="w-fit"
                    >
                      {payment.overdue ? 'Overdue' : 'Due'}
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-sm text-muted-foreground">
                      Due: {payment.dueDate}
                    </span>
                    <span className="font-semibold text-destructive">
                      ${payment.amount}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">All caught up!</h3>
                <p className="text-sm text-muted-foreground">
                  No pending payments at the moment
                </p>
              </div>
            )}
            {pendingPayments.length > 0 && (
              <Button 
                className="w-full"
                onClick={() => navigate("/payment-tracking")}
              >
                Pay All Pending
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate("/create-order")}
            >
              <Plus className="h-5 w-5" />
              <span>Create New Order</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate("/history")}
            >
              <Clock className="h-5 w-5" />
              <span>View Order History</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate("/payment-tracking")}
            >
              <DollarSign className="h-5 w-5" />
              <span>Track Payments</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;