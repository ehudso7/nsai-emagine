'use client';
import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';

export default function NSAIAdvisor() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState('');
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [userSummary, setUserSummary] = useState(`
• NSAI Comply: Generated 1 privacy policy for e-commerce site (05/12)
• NSAI NichePress: Created 3 blog posts about exotic plant care (05/10)
• NSAI GrantBot: Applied for 2 local small business grants (05/08)
• NSAI HostFlow: Managing 2 Airbnb properties with 12 guest messages
• Email marketing: List size of 230 subscribers, 12% open rate
• Monthly goal: Increase traffic to blog by 15%
  `.trim());

  async function generateAdvice() {
    setLoading(true);
    try {
      const res = await fetch('/api/advisor/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userSummary })
      });
      const data = await res.json();
      setReport(data.advice || 'Failed to generate advice. Please try again.');
    } catch (error) {
      console.error('Error generating advice:', error);
      setReport('An error occurred while generating your advice.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">NSAI Advisor</h1>
      <p className="mb-6 text-muted-foreground">
        Your AI business consultant that provides personalized growth recommendations based on your NSAI tool usage.
      </p>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-blue-800">Your Business Summary</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSummaryVisible(!summaryVisible)}
          >
            {summaryVisible ? 'Hide' : 'View & Edit'}
          </Button>
        </div>
        
        {summaryVisible && (
          <div className="mt-4">
            <textarea
              className="w-full p-2 border rounded min-h-[150px]"
              value={userSummary}
              onChange={(e) => setUserSummary(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Edit your business summary to get more accurate advice.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Business Growth Report</h2>
        <Button onClick={generateAdvice} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Advice'}
        </Button>
      </div>

      {report ? (
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Your Strategic Recommendations</h3>
          <div className="whitespace-pre-wrap">{report}</div>
        </div>
      ) : (
        <div className="bg-gray-50 border rounded-lg p-6 text-center text-gray-500">
          Click "Generate Advice" to receive your personalized business recommendations.
        </div>
      )}

      <div className="mt-8 border-t pt-6">
        <h3 className="font-bold text-lg mb-4">Schedule Weekly Advisor Reports</h3>
        <p className="mb-4 text-gray-600">
          Get automatic business advice delivered to your email every week.
        </p>
        <Button variant="outline">Enable Weekly Reports</Button>
      </div>
    </div>
  );
}