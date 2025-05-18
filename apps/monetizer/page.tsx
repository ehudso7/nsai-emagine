'use client';
import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';

export default function NSAIMonetizer() {
  const [niche, setNiche] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function generateMonetizationPlan() {
    setLoading(true);
    try {
      const res = await fetch('/api/monetizer/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, content })
      });
      const data = await res.json();
      setResult(data.suggestions || 'Failed to generate suggestions. Please try again.');
    } catch (error) {
      console.error('Error generating monetization plan:', error);
      setResult('An error occurred while generating your monetization plan.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">NSAI Monetizer</h1>
      <p className="mb-6 text-muted-foreground">
        Turn your content into revenue with AI-powered monetization strategies.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="font-bold text-lg mb-4">Content Details</h2>
          
          <div className="mb-4">
            <label htmlFor="niche" className="block text-sm font-medium text-gray-700 mb-1">
              Your Content Niche
            </label>
            <input
              id="niche"
              type="text"
              className="w-full p-2 border rounded"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. exotic houseplants, digital marketing, travel photography"
              required
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Paste Your Content
            </label>
            <textarea
              id="content"
              className="w-full p-2 border rounded min-h-[200px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste a blog post, article, or product description here..."
              required
            />
          </div>
        </div>
        
        <div>
          <h2 className="font-bold text-lg mb-4">Monetization Options</h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium mb-2">What You Can Generate:</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Affiliate product suggestions</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Digital product ideas (eBooks, courses)</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Call-to-action (CTA) templates</span>
              </li>
            </ul>
          </div>
          
          <Button 
            onClick={generateMonetizationPlan}
            disabled={loading || !niche || !content}
            className="w-full"
          >
            {loading ? 'Generating...' : 'Generate Monetization Plan'}
          </Button>
        </div>
      </div>

      {result && (
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Your Monetization Strategy</h3>
          <div className="whitespace-pre-wrap">{result}</div>
        </div>
      )}
    </div>
  );
}