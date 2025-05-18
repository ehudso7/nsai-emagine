'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import BillingSection from './components/BillingSection';
import ReferralSection from './components/ReferralSection';
import { getUser } from '@/shared/lib/auth';
import { canAccessTool } from '@/shared/lib/billing';

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState('tools');
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState({ requests: 0, maxRequests: 0 });
  
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get the current user (in production, would fetch from Supabase)
  const user = getUser();
  const userPlan = user.plan || 'free';
  const referralCode = user.referralCode || '';
  const referralCount = user.referralCount || 0;
  
  useEffect(() => {
    // Set initial tab from URL if present
    const tabParam = searchParams.get('tab');
    if (tabParam && ['tools', 'billing', 'referral'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    
    // Fetch user's current usage
    const fetchUsage = async () => {
      try {
        // In production, this would be a real API call
        // Simulate API call with a timeout
        setTimeout(() => {
          // Mock usage data based on the plan
          const maxRequests = userPlan === 'free' ? 50 : userPlan === 'basic' ? 500 : -1;
          const currentRequests = Math.floor(Math.random() * (maxRequests === -1 ? 100 : maxRequests * 0.8));
          
          setUsage({
            requests: currentRequests,
            maxRequests: maxRequests
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching usage data:', error);
        setLoading(false);
      }
    };
    
    fetchUsage();
  }, [searchParams, userPlan]);
  
  // Change the URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/dashboard?tab=${tab}`, { scroll: false });
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Status Messages */}
      {searchParams.get('billing') === 'success' && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
          Your subscription has been successfully updated. Thank you for your purchase!
        </div>
      )}
      {searchParams.get('billing') === 'cancelled' && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-6">
          Your subscription update was cancelled. If you have any questions, please contact support.
        </div>
      )}
      {searchParams.get('referral') === 'success' && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
          Referral successful! Your friend will receive their welcome email shortly.
        </div>
      )}
      {searchParams.get('reward') === 'granted' && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
          Congratulations! You've earned a reward for your referrals.
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">NSAI Emagine Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user.email}!
          </p>
        </div>
        
        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          <button 
            onClick={() => handleTabChange('tools')}
            className={`px-4 py-2 rounded-lg transition ${activeTab === 'tools' 
              ? 'bg-white text-blue-800 shadow' 
              : 'text-gray-600 hover:bg-gray-200'}`}
          >
            Tools
          </button>
          <button 
            onClick={() => handleTabChange('billing')}
            className={`px-4 py-2 rounded-lg transition ${activeTab === 'billing' 
              ? 'bg-white text-blue-800 shadow' 
              : 'text-gray-600 hover:bg-gray-200'}`}
          >
            Billing
          </button>
          <button 
            onClick={() => handleTabChange('referral')}
            className={`px-4 py-2 rounded-lg transition ${activeTab === 'referral' 
              ? 'bg-white text-blue-800 shadow' 
              : 'text-gray-600 hover:bg-gray-200'}`}
          >
            Refer & Earn
          </button>
        </div>
      </div>
      
      {activeTab === 'tools' && (
        <>
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center">
              <div>
                <h2 className="text-lg font-medium mb-1">Your Plan: <span className="font-bold">{userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}</span></h2>
                <p className="text-gray-600 text-sm">
                  {loading ? 'Loading usage data...' : (
                    usage.maxRequests === -1 
                      ? `You've made ${usage.requests} AI requests this month (unlimited)`
                      : `You've made ${usage.requests} of ${usage.maxRequests} AI requests this month`
                  )}
                </p>
              </div>
              
              {!loading && usage.maxRequests > 0 && (
                <div className="w-full md:w-1/3 mt-4 md:mt-0">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        usage.requests / usage.maxRequests > 0.9 
                          ? 'bg-red-600' 
                          : usage.requests / usage.maxRequests > 0.7 
                            ? 'bg-yellow-500' 
                            : 'bg-green-600'
                      }`}
                      style={{ width: `${Math.min(100, (usage.requests / usage.maxRequests) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {userPlan !== 'pro' && (
                <button 
                  onClick={() => handleTabChange('billing')}
                  className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Upgrade Plan
                </button>
              )}
            </div>
          </div>
          
          <h2 className="text-xl font-bold mb-3">Content & Compliance Tools</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <ToolCard 
              name="NSAI Comply" 
              path="/comply" 
              description="Automated privacy policy & legal compliance"
              isAccessible={canAccessTool('comply', userPlan)} 
            />
            <ToolCard 
              name="NichePress" 
              path="/nichepress" 
              description="SEO blog site builder for rare niches"
              isAccessible={canAccessTool('nichepress', userPlan)}
            />
          </div>
          
          <h2 className="text-xl font-bold mb-3">Specialized Tools</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <ToolCard 
              name="GrantBot" 
              path="/grantbot" 
              description="Local grant search & autofill application assistant" 
              isAccessible={canAccessTool('grantbot', userPlan)}
            />
            <ToolCard 
              name="HireEdge" 
              path="/hireedge" 
              description="Custom resume/cover letter generator" 
              isAccessible={canAccessTool('hireedge', userPlan)}
            />
            <ToolCard 
              name="HostFlow" 
              path="/hostflow" 
              description="AI concierge & automation for Airbnb hosts" 
              isAccessible={canAccessTool('hostflow', userPlan)}
            />
          </div>
          
          <h2 className="text-xl font-bold mb-3">Growth & Revenue Tools</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ToolCard 
              name="NSAI Advisor" 
              path="/advisor" 
              description="AI business coach with personalized growth recommendations" 
              isNew
              isAccessible={canAccessTool('advisor', userPlan)}
            />
            <ToolCard 
              name="NSAI Monetizer" 
              path="/monetizer" 
              description="Turn your content into revenue streams" 
              isNew
              isAccessible={canAccessTool('monetizer', userPlan)}
            />
            <ToolCard 
              name="NSAI Integrator" 
              path="/integrator" 
              description="Connect your tools with automated workflows" 
              isNew
              isAccessible={canAccessTool('integrator', userPlan)}
            />
          </div>
        </>
      )}
      
      {activeTab === 'billing' && (
        <BillingSection currentPlan={userPlan} userEmail={user.email} />
      )}
      
      {activeTab === 'referral' && (
        <ReferralSection 
          referralCode={referralCode} 
          referralCount={referralCount} 
        />
      )}
    </div>
  );
}

function ToolCard({ 
  name, 
  path, 
  description,
  isNew = false,
  isAccessible = true
}: { 
  name: string; 
  path: string; 
  description: string;
  isNew?: boolean;
  isAccessible?: boolean;
}) {
  if (!isAccessible) {
    return (
      <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50 opacity-75">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-xl text-gray-400">{name}</h2>
          {isNew && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
              New
            </span>
          )}
        </div>
        <p className="text-sm text-gray-400 mb-3">{description}</p>
        <div className="flex items-center text-sm text-blue-600">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Upgrade to access
        </div>
      </div>
    );
  }
  
  return (
    <Link href={path}>
      <div className="border rounded-xl p-4 shadow hover:shadow-md transition">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-xl">{name}</h2>
          {isNew && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
              New
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}