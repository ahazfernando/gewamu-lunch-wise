import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Clock, 
  Users, 
  CheckCircle, 
  CreditCard,
  Smartphone,
  Banknote,
  Calendar,
  MapPin
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const ParticipantView = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'failed'>('pending');

  // Mock order data
  const orderData = {
    id: orderId || "1",
    restaurant: "Sakura Sushi",
    organizer: "John Doe",
    organizerEmail: "john.doe@company.com",
    totalAmount: 145.50,
    myShare: 24.25,
    dueDate: "Today, 2:00 PM",
    status: "open",
    description: "Weekly team lunch order",
    items: [
      { name: "California Roll", price: 12.50, quantity: 2 },
      { name: "Chicken Teriyaki", price: 15.75, quantity: 1 },
      { name: "Miso Soup", price: 4.50, quantity: 3 },
      { name: "Green Tea", price: 3.25, quantity: 4 },
    ],
    participants: [
      { name: "John Doe", amount: 28.50, status: "paid" },
      { name: "Sarah Wilson", amount: 24.25, status: "paid" },
      { name: "Mike Johnson", amount: 22.75, status: "pending" },
      { name: "You", amount: 24.25, status: paymentStatus },
      { name: "Lisa Chen", amount: 26.50, status: "pending" },
      { name: "David Kim", amount: 19.25, status: "paid" },
    ]
  };

  const handlePayment = (method: 'digital' | 'cash') => {
    if (method === 'digital') {
      navigate(`/payment/${orderId}?method=digital`);
    } else {
      // Simulate cash payment confirmation
      setPaymentStatus('paid');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'failed':
        return <div className="h-4 w-4 rounded-full bg-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-success text-success-foreground">Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Order Details</h1>
          <p className="text-muted-foreground">Review your lunch order and payment details</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
          {paymentStatus === 'pending' && (
            <Button onClick={() => handlePayment('digital')}>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay Now
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {orderData.restaurant}
                </span>
                <Badge variant={orderData.status === 'open' ? 'default' : 'secondary'}>
                  {orderData.status === 'open' ? 'Open' : 'Closed'}
                </Badge>
              </CardTitle>
              <CardDescription>
                Organized by {orderData.organizer} • {orderData.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Due: {orderData.dueDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{orderData.participants.length} participants</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total: ${orderData.totalAmount}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(paymentStatus)}
                  <span className="text-sm">Your payment: {getStatusBadge(paymentStatus)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Items included in this order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">Quantity: {item.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">${item.price} each</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle>Participants & Payment Status</CardTitle>
              <CardDescription>See who's participating and their payment status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {orderData.participants.map((participant, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(participant.status)}
                      <span className="font-medium">{participant.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">${participant.amount}</span>
                      {getStatusBadge(participant.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Section */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Your Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 border rounded-lg bg-muted/50">
                <div className="text-3xl font-bold text-primary">${orderData.myShare}</div>
                <div className="text-sm text-muted-foreground">Your share</div>
              </div>

              {paymentStatus === 'pending' && (
                <div className="space-y-3">
                  <div className="text-sm font-medium">Choose Payment Method:</div>
                  
                  <Button 
                    className="w-full justify-start h-16"
                    onClick={() => handlePayment('digital')}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6" />
                      <div className="text-left">
                        <div className="font-medium">Pay Digitally</div>
                        <div className="text-sm opacity-90">Card, Wallet, or UPI</div>
                      </div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline"
                    className="w-full justify-start h-16"
                    onClick={() => handlePayment('cash')}
                  >
                    <div className="flex items-center gap-3">
                      <Banknote className="h-6 w-6" />
                      <div className="text-left">
                        <div className="font-medium">Cash in Hand</div>
                        <div className="text-sm opacity-70">Pay directly to organizer</div>
                      </div>
                    </div>
                  </Button>
                </div>
              )}

              {paymentStatus === 'paid' && (
                <div className="text-center p-6 border rounded-lg bg-success/10 border-success/20">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
                  <div className="font-medium text-success">Payment Confirmed</div>
                  <div className="text-sm text-muted-foreground">
                    Thank you for your payment!
                  </div>
                </div>
              )}

              {paymentStatus === 'failed' && (
                <div className="text-center p-6 border rounded-lg bg-destructive/10 border-destructive/20">
                  <div className="h-12 w-12 rounded-full bg-destructive mx-auto mb-3 flex items-center justify-center">
                    <span className="text-destructive-foreground font-bold">!</span>
                  </div>
                  <div className="font-medium text-destructive">Payment Failed</div>
                  <div className="text-sm text-muted-foreground mb-3">
                    There was an issue with your payment
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setPaymentStatus('pending')}
                  >
                    Try Again
                  </Button>
                </div>
              )}

              <div className="pt-4 border-t text-center">
                <div className="text-sm text-muted-foreground">
                  Need help? Contact{' '}
                  <span className="font-medium">{orderData.organizer}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {orderData.organizerEmail}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParticipantView;