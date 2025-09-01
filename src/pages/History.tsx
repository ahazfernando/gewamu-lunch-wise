import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'cancelled'>('all');

  const orderHistory = [
    {
      id: 1,
      restaurant: "Sakura Sushi",
      organizer: "You",
      totalAmount: 145.50,
      myShare: 24.25,
      participants: 6,
      date: "2024-01-15",
      status: "completed",
      role: "organizer",
      paymentMethod: null
    },
    {
      id: 2,
      restaurant: "Pizza Corner",
      organizer: "Sarah Wilson",
      totalAmount: 89.75,
      myShare: 22.44,
      participants: 4,
      date: "2024-01-14",
      status: "completed",
      role: "participant",
      paymentMethod: "digital"
    },
    {
      id: 3,
      restaurant: "Thai Garden",
      organizer: "Mike Johnson",
      totalAmount: 67.20,
      myShare: 16.80,
      participants: 4,
      date: "2024-01-12",
      status: "completed",
      role: "participant", 
      paymentMethod: "cash"
    },
    {
      id: 4,
      restaurant: "Burger Palace",
      organizer: "You",
      totalAmount: 95.60,
      myShare: 19.12,
      participants: 5,
      date: "2024-01-10",
      status: "completed",
      role: "organizer",
      paymentMethod: null
    },
    {
      id: 5,
      restaurant: "Mexican Cantina",
      organizer: "Lisa Chen",
      totalAmount: 112.30,
      myShare: 18.72,
      participants: 6,
      date: "2024-01-08",
      status: "cancelled",
      role: "participant",
      paymentMethod: null
    },
    {
      id: 6,
      restaurant: "Indian Spice",
      organizer: "You",
      totalAmount: 78.45,
      myShare: 15.69,
      participants: 5,
      date: "2024-01-05",
      status: "completed",
      role: "organizer",
      paymentMethod: null
    }
  ];

  const filteredHistory = orderHistory.filter(order => {
    const matchesSearch = order.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalOrders: orderHistory.filter(o => o.status === 'completed').length,
    totalSpent: orderHistory.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.myShare, 0),
    ordersOrganized: orderHistory.filter(o => o.role === 'organizer' && o.status === 'completed').length,
    averageOrder: orderHistory.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.myShare, 0) / orderHistory.filter(o => o.status === 'completed').length || 0
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    return (
      <Badge variant={role === 'organizer' ? 'default' : 'secondary'}>
        {role === 'organizer' ? 'Organized' : 'Participated'}
      </Badge>
    );
  };

  const exportData = () => {
    // Simulate CSV export
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Date,Restaurant,Role,Amount,Status\n" +
      filteredHistory.map(order => 
        `${order.date},${order.restaurant},${order.role},$${order.myShare},${order.status}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lunch_order_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Order History</h1>
          <p className="text-muted-foreground">View your past lunch orders and spending</p>
        </div>
        <Button onClick={exportData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Completed orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spent
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${stats.totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Orders Organized
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.ordersOrganized}</div>
            <p className="text-xs text-muted-foreground">Led by you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Order
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${stats.averageOrder.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per order</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by restaurant or organizer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'completed' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('completed')}
              >
                Completed
              </Button>
              <Button
                variant={filterStatus === 'cancelled' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('cancelled')}
              >
                Cancelled
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredHistory.map((order) => (
          <Card 
            key={order.id} 
            className="hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => navigate(`/order/${order.id}`)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{order.restaurant}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{order.date}</span>
                      <span>•</span>
                      <span>Organized by {order.organizer}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold text-lg">${order.myShare.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">
                      Your share of ${order.totalAmount.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {getStatusBadge(order.status)}
                    {getRoleBadge(order.role)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{order.participants} participants</span>
                </div>
                {order.paymentMethod && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span className="capitalize">Paid via {order.paymentMethod}</span>
                  </div>
                )}
                {order.role === 'organizer' && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>You organized this order</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredHistory.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? "Try adjusting your search or filter criteria."
                : "You haven't participated in any lunch orders yet."
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Button onClick={() => navigate('/create-order')}>
                Create Your First Order
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default History;