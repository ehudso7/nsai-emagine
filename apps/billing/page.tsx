'use client';
import React from 'react';
import { Button } from '@/shared/components/ui/button';

export default function Billing() {
  const plans = [
    {
      name: 'Basic',
      price: '$29',
      period: 'per month',
      features: [
        '100 AI requests per month',
        'Access to Comply & NichePress',
        'Email support',
        'Single user'
      ],
      recommended: false
    },
    {
      name: 'Pro',
      price: '$79',
      period: 'per month',
      features: [
        '500 AI requests per month',
        'Access to all tools',
        'Priority support',
        'Up to 3 users',
        'API access'
      ],
      recommended: true
    },
    {
      name: 'Enterprise',
      price: '$249',
      period: 'per month',
      features: [
        'Unlimited AI requests',
        'Access to all tools',
        'Dedicated support',
        'Unlimited users',
        'Custom integrations',
        'White-label option'
      ],
      recommended: false
    }
  ];

  const billingHistory = [
    { date: '2023-10-01', amount: '$79.00', status: 'Paid', invoice: 'INV-2023-001' },
    { date: '2023-09-01', amount: '$79.00', status: 'Paid', invoice: 'INV-2023-002' },
    { date: '2023-08-01', amount: '$79.00', status: 'Paid', invoice: 'INV-2023-003' }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Billing & Subscription</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Subscription Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`border rounded-lg p-4 ${plan.recommended ? 'border-blue-500 shadow-md' : ''}`}
              >
                {plan.recommended && (
                  <div className="bg-blue-500 text-white text-xs font-bold uppercase py-1 px-2 rounded-full inline-block mb-2">
                    Recommended
                  </div>
                )}
                <h3 className="font-bold text-lg">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 text-sm"> {plan.period}</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-sm flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button 
                    variant={plan.recommended ? 'default' : 'outline'} 
                    className="w-full"
                  >
                    {plan.recommended ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Payment Method</h2>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="w-12 h-8 bg-gray-300 rounded mr-3"></div>
              <div>
                <div className="font-bold">•••• •••• •••• 4242</div>
                <div className="text-sm text-gray-500">Expires 12/25</div>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="text-sm w-full">Update Payment Method</Button>
            </div>
          </div>
          
          <h2 className="text-xl font-bold mb-4">Billing History</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-2">Date</th>
                  <th className="text-left pb-2">Amount</th>
                  <th className="text-left pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((item, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-2">{item.date}</td>
                    <td className="py-2">{item.amount}</td>
                    <td className="py-2">
                      <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <Button variant="outline" className="text-sm w-full">View All Invoices</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}