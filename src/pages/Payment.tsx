import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  CreditCard, 
  Smartphone, 
  Banknote,
  CheckCircle,
  AlertCircle,
  Clock,
  Shield,
  Lock
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Payment = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const defaultMethod = searchParams.get('method') || 'card';
  
  const [paymentMethod, setPaymentMethod] = useState(defaultMethod);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  // Mock order data
  const orderData = {
    id: orderId || "1",
    restaurant: "Sakura Sushi",
    organizer: "John Doe",
    amount: 24.25,
    dueDate: "Today, 2:00 PM"
  };

  const handlePayment = async () => {
    setPaymentStatus('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      if (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) {
        setPaymentStatus('failed');
        toast({
          title: "Payment Failed",
          description: "Please fill in all card details.",
          variant: "destructive"
        });
        return;
      }
      
      // Simulate random success/failure for demo
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        setPaymentStatus('success');
        toast({
          title: "Payment Successful!",
          description: "Your payment has been processed successfully.",
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setPaymentStatus('failed');
        toast({
          title: "Payment Failed",
          description: "There was an issue processing your payment. Please try again.",
          variant: "destructive"
        });
      }
    }, 2000);
  };

  const PaymentMethodCard = ({ method, icon: Icon, title, description, selected, onSelect }: {
    method: string;
    icon: any;
    title: string;
    description: string;
    selected: boolean;
    onSelect: () => void;
  }) => (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        selected 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:border-primary/50'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        <RadioGroupItem value={method} id={method} />
        <Icon className="h-5 w-5" />
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>
      </div>
    </div>
  );

  const StatusIcon = () => {
    switch (paymentStatus) {
      case 'processing':
        return <Clock className="h-12 w-12 text-warning animate-pulse" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-success" />;
      case 'failed':
        return <AlertCircle className="h-12 w-12 text-destructive" />;
      default:
        return null;
    }
  };

  if (paymentStatus === 'processing') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Clock className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
            <p className="text-muted-foreground">
              Please wait while we process your payment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-success">Payment Successful!</h2>
            <p className="text-muted-foreground mb-4">
              Your payment of ${orderData.amount} has been processed successfully.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>Restaurant: {orderData.restaurant}</div>
              <div>Organizer: {orderData.organizer}</div>
              <div>Amount: ${orderData.amount}</div>
            </div>
            <Button 
              className="w-full mt-6"
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payment</h1>
          <p className="text-muted-foreground">Complete your payment for {orderData.restaurant}</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Select Payment Method
              </CardTitle>
              <CardDescription>
                Choose how you'd like to pay for your lunch order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-3">
                  <PaymentMethodCard
                    method="card"
                    icon={CreditCard}
                    title="Credit/Debit Card"
                    description="Pay securely with your card"
                    selected={paymentMethod === 'card'}
                    onSelect={() => setPaymentMethod('card')}
                  />
                  
                  <PaymentMethodCard
                    method="wallet"
                    icon={Smartphone}
                    title="Digital Wallet"
                    description="Apple Pay, Google Pay, Samsung Pay"
                    selected={paymentMethod === 'wallet'}
                    onSelect={() => setPaymentMethod('wallet')}
                  />
                  
                  <PaymentMethodCard
                    method="upi"
                    icon={Smartphone}
                    title="UPI"
                    description="Pay using UPI ID or QR code"
                    selected={paymentMethod === 'upi'}
                    onSelect={() => setPaymentMethod('upi')}
                  />
                  
                  <PaymentMethodCard
                    method="cash"
                    icon={Banknote}
                    title="Cash in Hand"
                    description="Pay directly to the organizer"
                    selected={paymentMethod === 'cash'}
                    onSelect={() => setPaymentMethod('cash')}
                  />
                </div>
              </RadioGroup>

              {/* Payment Details Forms */}
              <div className="mt-6">
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="h-4 w-4 text-success" />
                      <span className="text-sm text-muted-foreground">
                        Your card details are secure and encrypted
                      </span>
                    </div>
                    
                    <div>
                      <Label htmlFor="card-name">Cardholder Name</Label>
                      <Input
                        id="card-name"
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="card-expiry">Expiry Date</Label>
                        <Input
                          id="card-expiry"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="card-cvv">CVV</Label>
                        <Input
                          id="card-cvv"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'wallet' && (
                  <div className="text-center py-8">
                    <Smartphone className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">Digital Wallet Payment</h3>
                    <p className="text-sm text-muted-foreground">
                      You'll be redirected to your wallet app to complete the payment
                    </p>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="upi-id">UPI ID</Label>
                      <Input
                        id="upi-id"
                        placeholder="yourname@upi"
                        type="email"
                      />
                    </div>
                    <div className="text-center py-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Or scan QR code</p>
                      <div className="w-32 h-32 bg-muted mx-auto rounded-lg flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">QR Code</span>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'cash' && (
                  <div className="text-center py-8">
                    <Banknote className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">Cash Payment</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Hand over ${orderData.amount} to {orderData.organizer} directly
                    </p>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium">Important:</p>
                      <p className="text-xs text-muted-foreground">
                        Make sure to get confirmation from the organizer after payment
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Restaurant:</span>
                  <span className="font-medium">{orderData.restaurant}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Organizer:</span>
                  <span className="font-medium">{orderData.organizer}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Due:</span>
                  <span className="font-medium">{orderData.dueDate}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Amount to Pay:</span>
                  <span className="text-primary">${orderData.amount}</span>
                </div>
              </div>

              {paymentStatus === 'failed' && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">Payment Failed</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please check your details and try again
                  </p>
                </div>
              )}

              <Button 
                className="w-full" 
                onClick={handlePayment}
                disabled={paymentStatus !== 'idle' && paymentStatus !== 'failed'}
              >
                <Lock className="h-4 w-4 mr-2" />
                {paymentMethod === 'cash' ? 'Confirm Cash Payment' : `Pay $${orderData.amount}`}
              </Button>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Secure payment processing</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;