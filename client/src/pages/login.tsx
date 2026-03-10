import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full greek-pattern-bg opacity-30 pointer-events-none"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <Card className="w-full max-w-md relative z-10 glass-panel border-secondary/20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
        <CardHeader className="text-center pt-10 pb-6">
          <div className="mx-auto w-16 h-16 bg-primary rounded-md flex items-center justify-center mb-6 shadow-lg shadow-primary/20 transform -rotate-3">
            <ShieldCheck className="w-8 h-8 text-secondary transform rotate-3" />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-2" data-testid="text-app-name">Hermes</h1>
          <p className="text-sm text-muted-foreground tracking-widest uppercase font-semibold">AI-Native Intelligence</p>
        </CardHeader>
        <CardContent className="px-10 pb-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Secure Identifier</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@hermes.sys" 
                defaultValue="admin@hermes.sys"
                className="h-12 border-border/50 bg-background/50 focus-visible:ring-secondary focus-visible:border-secondary"
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Passphrase</Label>
              <Input 
                id="password" 
                type="password" 
                defaultValue="password123"
                className="h-12 border-border/50 bg-background/50 focus-visible:ring-secondary focus-visible:border-secondary"
                data-testid="input-password"
              />
            </div>
            <Button type="submit" className="w-full h-12 font-semibold tracking-wide" data-testid="button-login">
              Authenticate
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
