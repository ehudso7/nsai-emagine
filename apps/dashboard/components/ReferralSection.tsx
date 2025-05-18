'use client';
import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { formatReferralLink, getNextReward } from '@/shared/lib/referral';

interface ReferralSectionProps {
  referralCode: string;
  referralCount: number;
}

export default function ReferralSection({ referralCode, referralCount }: ReferralSectionProps) {
  const [copied, setCopied] = useState(false);
  
  const referralLink = formatReferralLink(referralCode);
  const nextReward = getNextReward(referralCount);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const shareOnTwitter = () => {
    const text = `Join me on NSAI Emagine, the all-in-one AI platform for entrepreneurs. Use my referral link to get started: ${referralLink}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Refer & Earn</h2>
      <p className="mb-6">
        Share NSAI Emagine with friends and colleagues. You'll both get rewards!
      </p>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Referral Link
        </label>
        <div className="flex">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-grow p-2 border rounded-l text-sm bg-white"
          />
          <Button
            onClick={copyToClipboard}
            className="rounded-l-none"
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Share via</h3>
        <div className="flex space-x-2">
          <Button onClick={shareOnTwitter} variant="outline" className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
            Twitter
          </Button>
          <Button variant="outline" className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
            </svg>
            Facebook
          </Button>
          <Button variant="outline" className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
            LinkedIn
          </Button>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Your Rewards</h3>
        <div className="flex items-center justify-between mb-4">
          <span>Successful referrals:</span>
          <span className="font-bold">{referralCount}</span>
        </div>
        
        {nextReward ? (
          <div>
            <div className="mb-2 text-sm">
              Refer {nextReward.remaining} more to get: <span className="font-bold">{nextReward.next.reward}</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(referralCount / nextReward.next.count) * 100}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="text-blue-800 text-sm">
            Congratulations! You've unlocked all reward tiers.
          </div>
        )}
      </div>
    </div>
  );
}