import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Minus, 
  X, 
  DollarSign, 
  Users, 
  AlertTriangle,
  Save,
  Send,
  Calculator
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  assignedAmount: number;
}

const CreateOrder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [restaurantName, setRestaurantName] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [equalSplit, setEqualSplit] = useState(true);
  const [manualTotal, setManualTotal] = useState("");
  
  const [newItem, setNewItem] = useState({ name: "", price: "" });
  const [newParticipant, setNewParticipant] = useState({ name: "", email: "" });

  const calculatedTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const displayTotal = manualTotal ? parseFloat(manualTotal) || 0 : calculatedTotal;
  const assignedTotal = participants.reduce((total, p) => total + p.assignedAmount, 0);
  const totalMismatch = Math.abs(displayTotal - assignedTotal) > 0.01;

  const addItem = () => {
    if (newItem.name && newItem.price) {
      const item: OrderItem = {
        id: Date.now().toString(),
        name: newItem.name,
        price: parseFloat(newItem.price) || 0,
        quantity: 1
      };
      setItems([...items, item]);
      setNewItem({ name: "", price: "" });
      updateParticipantShares([...items, item]);
    }
  };

  const removeItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    updateParticipantShares(updatedItems);
  };

  const updateItemQuantity = (id: string, change: number) => {
    const updatedItems = items.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    );
    setItems(updatedItems);
    updateParticipantShares(updatedItems);
  };

  const addParticipant = () => {
    if (newParticipant.name && newParticipant.email) {
      const participant: Participant = {
        id: Date.now().toString(),
        name: newParticipant.name,
        email: newParticipant.email,
        assignedAmount: 0
      };
      setParticipants([...participants, participant]);
      setNewParticipant({ name: "", email: "" });
      updateParticipantShares(items, [...participants, participant]);
    }
  };

  const removeParticipant = (id: string) => {
    const updatedParticipants = participants.filter(p => p.id !== id);
    setParticipants(updatedParticipants);
    updateParticipantShares(items, updatedParticipants);
  };

  const updateParticipantShares = (currentItems = items, currentParticipants = participants) => {
    if (equalSplit && currentParticipants.length > 0) {
      const total = manualTotal ? parseFloat(manualTotal) || 0 : 
        currentItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const sharePerPerson = total / currentParticipants.length;
      
      setParticipants(currentParticipants.map(p => ({
        ...p,
        assignedAmount: parseFloat(sharePerPerson.toFixed(2))
      })));
    }
  };

  const updateParticipantAmount = (id: string, amount: number) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, assignedAmount: amount } : p
    ));
  };

  const resetShares = () => {
    updateParticipantShares();
  };

  const handleEqualSplitToggle = (checked: boolean) => {
    setEqualSplit(checked);
    if (checked) {
      updateParticipantShares();
    }
  };

  const handleSaveOrder = () => {
    if (!restaurantName || items.length === 0 || participants.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in restaurant name, add items, and participants.",
        variant: "destructive"
      });
      return;
    }

    if (totalMismatch) {
      toast({
        title: "Amount Mismatch",
        description: "The assigned amounts don't match the total bill.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Order Saved",
      description: "Your order has been saved as draft.",
    });
  };

  const handleSendOrder = () => {
    if (!restaurantName || items.length === 0 || participants.length === 0) {
      toast({
        title: "Missing Information", 
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (totalMismatch) {
      toast({
        title: "Amount Mismatch",
        description: "The assigned amounts don't match the total bill.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Order Sent!",
      description: "Participants have been notified about the lunch order.",
    });
    
    setTimeout(() => {
      navigate("/payment-tracking");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Order</h1>
          <p className="text-muted-foreground">Set up a new lunch order for your team</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveOrder}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleSendOrder}>
            <Send className="h-4 w-4 mr-2" />
            Send to Participants
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Restaurant Information */}
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Information</CardTitle>
              <CardDescription>Enter the restaurant details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="restaurant">Restaurant Name</Label>
                  <Input
                    id="restaurant"
                    placeholder="Enter restaurant name"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items & Prices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Items & Prices
              </CardTitle>
              <CardDescription>Add items and their prices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Item */}
              <div className="flex gap-2">
                <Input
                  placeholder="Item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="w-32"
                />
                <Button onClick={addItem}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Items List */}
              {items.length > 0 && (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-muted-foreground">${item.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateItemQuantity(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateItemQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Manual Total Override */}
              <div className="pt-4 border-t">
                <Label htmlFor="manual-total">Manual Total (optional)</Label>
                <Input
                  id="manual-total"
                  type="number"
                  placeholder="Override calculated total"
                  value={manualTotal}
                  onChange={(e) => {
                    setManualTotal(e.target.value);
                    updateParticipantShares();
                  }}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Calculated: ${calculatedTotal.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participants
              </CardTitle>
              <CardDescription>Add participants and assign amounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Equal Split Toggle */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label htmlFor="equal-split">Equal Split</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically divide the total equally
                  </p>
                </div>
                <Switch
                  id="equal-split"
                  checked={equalSplit}
                  onCheckedChange={handleEqualSplitToggle}
                />
              </div>

              {/* Add New Participant */}
              <div className="flex gap-2">
                <Input
                  placeholder="Participant name"
                  value={newParticipant.name}
                  onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={newParticipant.email}
                  onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
                />
                <Button onClick={addParticipant}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Participants List */}
              {participants.length > 0 && (
                <div className="space-y-2">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{participant.name}</div>
                        <div className="text-sm text-muted-foreground">{participant.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={participant.assignedAmount}
                          onChange={(e) => updateParticipantAmount(participant.id, parseFloat(e.target.value) || 0)}
                          disabled={equalSplit}
                          className="w-24"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeParticipant(participant.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!equalSplit && participants.length > 0 && (
                <Button variant="outline" onClick={resetShares} className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Reset to Equal Shares
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Restaurant:</span>
                  <span className="font-medium">{restaurantName || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Participants:</span>
                  <span className="font-medium">{participants.length}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Bill:</span>
                  <span>${displayTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Assigned:</span>
                  <span>${assignedTotal.toFixed(2)}</span>
                </div>
              </div>

              {totalMismatch && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <div className="text-sm">
                    <div className="font-medium text-destructive">Amount Mismatch</div>
                    <div className="text-muted-foreground">
                      Difference: ${Math.abs(displayTotal - assignedTotal).toFixed(2)}
                    </div>
                  </div>
                </div>
              )}

              {!totalMismatch && participants.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg">
                  <div className="text-sm">
                    <div className="font-medium text-success">Amounts Match</div>
                    <div className="text-muted-foreground">Ready to send</div>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-4 border-t">
                <Button 
                  className="w-full" 
                  onClick={handleSendOrder}
                  disabled={totalMismatch || !restaurantName || items.length === 0 || participants.length === 0}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send & Notify Participants
                </Button>
                <Button variant="outline" className="w-full" onClick={handleSaveOrder}>
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;