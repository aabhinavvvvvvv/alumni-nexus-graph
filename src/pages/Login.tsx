
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { alumni } from '@/data/mockData';
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - in real app, this would be a backend API call
    const user = alumni.find(a => a.email === email);
    
    if (user && password === 'demo123') {  // Demo password check
      // Store user info in local storage for persistence
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      });
      
      navigate('/profile');
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Alumni Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
          
          <Alert className="mt-6 bg-muted">
            <AlertDescription>
              <p className="font-medium text-center">Demo Credentials</p>
              <div className="mt-2 text-sm">
                <p><strong>Email:</strong> sarah.j@example.com</p>
                <p><strong>Password:</strong> demo123</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  (You can also use any other email from the alumni list with the same password)
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => navigate('/')}>
            Back to Alumni Network
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
