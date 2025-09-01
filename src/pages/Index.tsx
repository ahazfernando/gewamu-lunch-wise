import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Shield,
  Zap,
  Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Smart Group Ordering",
      description: "Easily organize lunch orders for your team with automatic participant management"
    },
    {
      icon: DollarSign,
      title: "Automated Payment Splitting",
      description: "Automatically calculate and track individual payment amounts with precision"
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Monitor payment status and send reminders with live updates"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Multiple payment options including digital wallets, cards, and cash tracking"
    }
  ];

  const benefits = [
    "No more manual calculations",
    "Automatic payment reminders", 
    "Complete payment transparency",
    "Easy expense tracking",
    "Seamless team coordination"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-lg p-2">
              <Users className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Gewamu</h1>
              <p className="text-xs text-muted-foreground">Smart Office Lunch Splitter</p>
            </div>
          </div>
          <Button onClick={() => navigate('/login')}>
            Get Started
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge variant="secondary" className="mb-4">
          Smart Office Lunch Management
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
          Split Lunch Orders<br />
          <span className="text-primary">Effortlessly</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Automate lunch ordering payments, track contributions, and ensure accurate payments. 
          Perfect for teams who want to streamline their group dining experience.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/login')}>
            <Users className="h-5 w-5 mr-2" />
            Start Organizing
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
            Join as Participant
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Teams Choose Gewamu</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built specifically for office teams who want to make lunch ordering simple, 
            fair, and completely transparent.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Perfect for Modern Teams</h2>
              <p className="text-muted-foreground mb-6">
                Stop the hassle of manual calculations, forgotten payments, and awkward 
                reminders. Gewamu handles all the complexity so your team can focus on 
                enjoying great food together.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Card className="p-8">
              <div className="text-center">
                <Zap className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Ready in Minutes</h3>
                <p className="text-muted-foreground mb-6">
                  Get your team started with organized lunch orders in just a few clicks
                </p>
                <Button className="w-full" onClick={() => navigate('/login')}>
                  <Target className="h-4 w-4 mr-2" />
                  Start Your First Order
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-2xl mx-auto p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Simplify Lunch Orders?</h2>
          <p className="text-muted-foreground mb-6">
            Join teams who have already streamlined their lunch coordination with Gewamu
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/login')}>
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              View Demo
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-primary rounded-lg p-2">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-primary">Gewamu</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Smart Office Lunch Splitter - Making team dining effortless
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
