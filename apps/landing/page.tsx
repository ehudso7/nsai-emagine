'use client';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  async function joinWaitlist(e) {
    e.preventDefault();
    
    // This would normally send to an API endpoint
    // In a real app, implement: /api/waitlist 
    console.log('Joining waitlist with email:', email);
    
    // Simulate API call
    setTimeout(() => {
      setStatus('Success! You're on the list.');
      setEmail('');
    }, 500);
  }

  const features = [
    {
      title: 'Privacy Policy Generator',
      description: 'Generate GDPR-compliant privacy policies in seconds.',
      icon: '📝'
    },
    {
      title: 'SEO Content Creator',
      description: 'Create SEO-optimized blog content for niche topics.',
      icon: '📊'
    },
    {
      title: 'Grant Finder',
      description: 'Discover and apply for grants tailored to your needs.',
      icon: '💰'
    },
    {
      title: 'Resume Builder',
      description: 'Build expert resumes for specialized industries.',
      icon: '📄'
    },
    {
      title: 'Airbnb Host Assistant',
      description: 'Automate guest communications and property management.',
      icon: '🏠'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">NSAI Emagine</h1>
          <p className="text-xl md:text-2xl mb-8">
            Fully autonomous AI micro-services to power your solo business.
          </p>
          
          <div className="max-w-md mx-auto">
            {!status ? (
              <form onSubmit={joinWaitlist} className="flex flex-col md:flex-row gap-2">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="flex-grow px-4 py-2 rounded-md text-gray-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit">Join Waitlist</Button>
              </form>
            ) : (
              <div className="bg-green-100 text-green-800 p-4 rounded-md">
                {status}
              </div>
            )}
          </div>
          
          <div className="mt-12">
            <Link href="/dashboard">
              <Button size="lg">See Demo</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful AI Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} NSAI Emagine. All rights reserved.</p>
          <div className="mt-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white mx-2">
              Demo
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white mx-2">
              About
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white mx-2">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}