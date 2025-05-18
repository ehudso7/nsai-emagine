'use client';
import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { getPlanFeatures, getPlanLabel, getPlanPrice } from '@/shared/lib/billing';

interface BillingSectionProps {
  currentPlan: string;
  userEmail: string;
}

export default function BillingSection({ currentPlan, userEmail }: BillingSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  
  const handleUpgrade = async (plan: string) => {
    const planId = billingCycle === 'annual' ? `${plan}_annual` : plan;
    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, plan })
      });
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setIsLoading(false);
    }
  };
  
  const plans = [
    { id: 'trial', name: '3-Day Trial', cta: 'Current', highlight: false },
    { id: 'basic', name: 'Basic', cta: 'Upgrade', highlight: false },
    { id: 'pro', name: 'Pro', cta: 'Upgrade', highlight: true },
    { id: 'enhanced', name: 'Enhanced', cta: 'Upgrade', highlight: false },
    { id: 'enterprise', name: 'Enterprise', cta: 'Upgrade', highlight: false }
  ];
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Subscription Plan</h2>
      <p className="mb-4">
        You are currently on the <span className="font-semibold">{getPlanLabel(currentPlan)}</span> plan.
        {currentPlan === 'trial' && (
          <span className="text-red-500 font-semibold ml-2">Your trial expires in 3 days. Upgrade now to avoid service interruption!</span>
        )}
      </p>
      
      <div className="flex justify-center items-center mb-6">
        <span className={`mr-2 ${billingCycle === 'monthly' ? 'font-bold' : 'text-gray-500'}`}>Monthly</span>
        <button 
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')} 
          className="relative inline-flex h-6 w-12 items-center rounded-full bg-gray-300 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span 
            className={`${billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out`}
          />
        </button>
        <span className={`ml-2 ${billingCycle === 'annual' ? 'font-bold' : 'text-gray-500'}`}>Annual <span className="text-xs text-green-500 font-bold">Save 20%</span></span>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-5 mb-6">
        {plans.map((plan) => {
          const isCurrentPlan = plan.id === currentPlan;
          const features = getPlanFeatures(plan.id);
          
          return (
            <div 
              key={plan.id} 
              className={`border rounded-lg p-4 ${isCurrentPlan ? 'border-blue-500 bg-blue-50' : ''} ${plan.highlight ? 'border-green-500 shadow-lg relative' : ''}`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-0 right-0 mx-auto text-center">
                  <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold">RECOMMENDED</span>
                </div>
              )}
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">{plan.name}</h3>
                <span className="font-bold whitespace-pre-line">{getPlanPrice(plan.id, billingCycle)}</span>
              </div>
              
              <ul className="space-y-2 mb-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <svg className="h-5 w-5 text-green-500 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isLoading || isCurrentPlan}
                variant={isCurrentPlan ? 'outline' : 'default'}
                className="w-full"
              >
                {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </Button>
            </div>
          );
        })}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="font-bold text-lg mb-2">Need more advanced features?</h3>
        <p className="mb-3">Our Enterprise plan includes additional benefits:</p>
        <ul className="space-y-2 mb-4">
          <li className="flex items-start text-sm">
            <svg className="h-5 w-5 text-green-500 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Custom API development</span>
          </li>
          <li className="flex items-start text-sm">
            <svg className="h-5 w-5 text-green-500 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>White-label solutions</span>
          </li>
          <li className="flex items-start text-sm">
            <svg className="h-5 w-5 text-green-500 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Dedicated account manager</span>
          </li>
        </ul>
        <Button className="w-full">Schedule Enterprise Demo</Button>
      </div>
      
      <div className="text-sm text-gray-500">
        <p>Need a custom plan for your team? <a href="#" className="text-blue-500">Contact our sales team</a>.</p>
      </div>
    </div>
  );
}