"use client";

import { X, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Button } from './button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Input } from './input';
import { Label } from './label';
import { env } from '@/config/env';

export function AuthModal() {
  const { isAuthModalOpen, authModalType, closeAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(authModalType || 'login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  // Update active tab when authModalType changes
  useEffect(() => {
    if (authModalType) {
      setActiveTab(authModalType);
    }
  }, [authModalType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent, type: 'login' | 'register') => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Implement actual auth logic
      console.log(`${type} with:`, formData);
      // Simulate API call
      
    //   await new Promise(resolve => setTimeout(resolve, 1000));
      if(type === 'login') {
        const response = await fetch(`${env.API_AUTH}/user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        })
        const responseData = await response.json() as { success: boolean };
        console.log(responseData);
        if (!responseData.success) throw new Error('Failed to login');

      }
      if(type === 'register') {
        const response = await fetch(`${env.API_AUTH}/user/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        })
        const responseData = await response.json() as { success: boolean };
        console.log(responseData);
        if (!responseData.success) throw new Error('Failed to register');
      }
      
      
      // On success
      closeAuthModal();
    } catch (error) {
      console.error(`${type} error:`, error);
      // Handle error (show toast/notification)
    } finally {
      setIsLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-2xl border-0 p-0 overflow-hidden">
        <div className="px-8 pt-10 pb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activeTab === 'login' 
                ? 'Sign in to your account to continue'
                : 'Join our community today'}
            </p>
          </div>

        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'login' | 'register')} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg h-10">
            <TabsTrigger 
              value="login" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-md transition-all duration-200"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-md transition-all duration-200"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <form onSubmit={(e) => handleSubmit(e, 'login')} className="space-y-5">
              <div className="space-y-1">
                <Label htmlFor="login-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 h-11 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </Label>
                  <button
                    type="button"
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                    onClick={() => {}}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 h-11 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-200"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-6">
            <form onSubmit={(e) => handleSubmit(e, 'register')} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="register-firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="register-firstName"
                      name="firstName"
                      
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="pl-10 h-11 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="register-lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="register-lastName"
                      name="lastName"
                      
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="pl-10 h-11 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="register-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 h-11 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="register-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 h-11 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-200"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 mt-2"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        
        
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          {activeTab === 'login' ? (
            <>
              Don't have an account?{' '}
              <button 
                type="button" 
                className="font-medium text-primary hover:text-primary/80 transition-colors"
                onClick={() => setActiveTab('register')}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button 
                type="button" 
                className="font-medium text-primary hover:text-primary/80 transition-colors"
                onClick={() => setActiveTab('login')}
              >
                Sign in
              </button>
            </>
          )}
        </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;
