'use client';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';

export default function NSAINichePress() {
  const [niche, setNiche] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function generateNicheSite() {
    setLoading(true);
    const res = await fetch('/api/nichepress/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ niche })
    });
    const data = await res.json();
    setResult(data.output || 'Error generating site');
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">NSAI NichePress</h1>
      <p className="mb-4 text-muted-foreground">
        Describe a niche, and we'll build a blog starter kit in seconds.
      </p>
      <input
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
        placeholder="e.g. exotic bonsai trees"
        className="p-2 border rounded w-full mb-4"
      />
      <Button onClick={generateNicheSite} disabled={loading || !niche}>
        {loading ? 'Generating...' : 'Generate Site'}
      </Button>
      <pre className="mt-6 bg-gray-100 p-4 rounded whitespace-pre-wrap">
        {result}
      </pre>
    </div>
  );
}