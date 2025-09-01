import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Mail,
  AlertTriangle,
  Download,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PaymentTracking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [orders, setOrders] = useState([
    {
      id: 1,
      restaurant: "Sakura Sushi",
      totalAmount: 46560, // 145.50 USD * 320 LKR/USD
      createdDate: "2024-01-15",
      dueDate: "Today, 2:00 PM",
      status: "active",
      participants: [
        { name: "John Doe", email: "john@company.com", amount: 9120, status: "paid", paymentMethod: "digital" },
        { name: "Sarah Wilson", email: "sarah@company.com", amount: 7760, status: "paid", paymentMethod: "digital" },
        { name: "Mike Johnson", email: "mike@company.com", amount: 7280, status: "pending", paymentMethod: null },
        { name: "Lisa Chen", email: "lisa@company.com", amount: 8480, status: "pending", paymentMethod: null },
        { name: "David Kim", email: "david@company.com", amount: 6160, status: "paid", paymentMethod: "cash" },
        { name: "Emma Davis", email: "emma@company.com", amount: 7760, status: "pending", paymentMethod: null },
      ]
    },
    {
      id: 2,
      restaurant: "Pizza Corner",
      totalAmount: 28720, // 89.75 USD * 320 LKR/USD
      createdDate: "2024-01-14",
      dueDate: "Yesterday, 1:30 PM",
      status: "completed",
      participants: [
        { name: "Alice Johnson", email: "alice@company.com", amount: 7180, status: "paid", paymentMethod: "digital" },
        { name: "Bob Smith", email: "bob@company.com", amount: 7180, status: "paid", paymentMethod: "cash" },
        { name: "Carol White", email: "carol@company.com", amount: 7180, status: "paid", paymentMethod: "digital" },
        { name: "Daniel Brown", email: "daniel@company.com", amount: 7180, status: "paid", paymentMethod: "digital" },
      ]
    }
  ]);

  const sendReminder = (orderId: number, participantEmail: string, participantName: string) => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent to ${participantName}`,
    });
  };

  const sendBulkReminder = (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    const pendingCount = order?.participants.filter(p => p.status === 'pending').length || 0;
    
    toast({
      title: "Bulk Reminder Sent",
      description: `Payment reminders sent to ${pendingCount} participants`,
    });
  };

  const getStatusIcon = (status: string, paymentMethod: string | null) => {
    switch (status) {
      case 'paid':
        return paymentMethod === 'cash' 
          ? <DollarSign className="h-4 w-4 text-success" />
          : <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-success text-success-foreground">Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const getOrderProgress = (participants: any[]) => {
    const paidCount = participants.filter(p => p.status === 'paid').length;
    const totalCount = participants.length;
    const percentage = (paidCount / totalCount) * 100;
    return { paidCount, totalCount, percentage };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Payment Tracking</h1>
          <p className="text-muted-foreground">Monitor payment status for your organized orders</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="outline" className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => {
          const progress = getOrderProgress(order.participants);
          const paidAmount = order.participants
            .filter(p => p.status === 'paid')
            .reduce((sum, p) => sum + p.amount, 0);
          const pendingAmount = order.totalAmount - paidAmount;

          return (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span>{order.restaurant}</span>
                      <Badge variant={order.status === 'active' ? 'default' : 'secondary'} className="w-fit">
                        {order.status === 'active' ? 'Active' : 'Completed'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Created {order.createdDate} • Due {order.dueDate}
                    </CardDescription>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-2xl font-bold text-foreground">
                      LKR {order.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {progress.paidCount}/{progress.totalCount} paid
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Payment Progress</span>
                    <span>{progress.percentage.toFixed(0)}% Complete</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-success h-2 rounded-full transition-all"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Paid: LKR {paidAmount.toLocaleString()}</span>
                    <span>Pending: LKR {pendingAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Quick Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => sendBulkReminder(order.id)}
                      disabled={order.status === 'completed'}
                      className="w-full sm:w-auto"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Send Bulk Reminder</span>
                      <span className="sm:hidden">Bulk Reminder</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/order/${order.id}`)}
                      className="w-full sm:w-auto"
                    >
                      View Details
                    </Button>
                  </div>

                  {/* Participants List */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Participants</h4>
                    <div className="grid gap-2">
                      {order.participants.map((participant, index) => (
                        <div 
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {getStatusIcon(participant.status, participant.paymentMethod)}
                            <div className="flex-1">
                              <div className="font-medium">{participant.name}</div>
                              <div className="text-sm text-muted-foreground">{participant.email}</div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <div className="text-left sm:text-right">
                              <div className="font-medium">LKR {participant.amount.toLocaleString()}</div>
                              {participant.paymentMethod && (
                                <div className="text-xs text-muted-foreground capitalize">
                                  {participant.paymentMethod}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {getStatusBadge(participant.status)}
                              
                              {participant.status === 'pending' && order.status === 'active' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => sendReminder(order.id, participant.email, participant.name)}
                                  className="w-full sm:w-auto"
                                >
                                  <Mail className="h-3 w-3 mr-1" />
                                  <span className="sm:hidden">Send Reminder</span>
                                  <span className="hidden sm:inline">Remind</span>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-semibold text-success">
                        LKR {paidAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Collected</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-semibold text-warning">
                        LKR {pendingAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-semibold text-primary">
                        {progress.percentage.toFixed(0)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Complete</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Orders State */}
      {orders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Orders to Track</h3>
            <p className="text-muted-foreground mb-6">
              You haven't organized any orders yet. Create your first order to start tracking payments.
            </p>
            <Button onClick={() => navigate('/create-order')}>
              Create First Order
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentTracking;