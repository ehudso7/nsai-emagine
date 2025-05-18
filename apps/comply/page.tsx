'use client';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';

export default function NSAIComplyPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function generatePolicy() {
    setLoading(true);
    const res = await fetch('/api/comply/generate', { method: 'POST' });
    const data = await res.json();
    setResult(data.policy || 'Error generating policy');
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">NSAI Comply</h1>
      <p className="mb-4 text-muted-foreground">
        Click below to generate a GDPR-compliant Privacy Policy using AI.
      </p>
      <Button onClick={generatePolicy} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Policy'}
      </Button>
      <pre className="mt-6 bg-gray-100 p-4 rounded whitespace-pre-wrap">
        {result}
      </pre>
    </div>
  );
}