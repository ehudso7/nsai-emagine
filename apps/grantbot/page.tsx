'use client';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';

export default function NSAIGrantBot() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState('');
  const [loading, setLoading] = useState(false);

  async function findGrants() {
    setLoading(true);
    const res = await fetch('/api/grantbot/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword })
    });
    const data = await res.json();
    setResults(data.output || 'No grants found.');
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">NSAI GrantBot</h1>
      <p className="mb-4 text-muted-foreground">
        Enter your focus area or project type. We'll scan for local, regional, and national grants.
      </p>
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="e.g. rural broadband, youth arts, mental health"
        className="p-2 border rounded w-full mb-4"
      />
      <Button onClick={findGrants} disabled={loading || !keyword}>
        {loading ? 'Searching...' : 'Find Grants'}
      </Button>
      <pre className="mt-6 bg-gray-100 p-4 rounded whitespace-pre-wrap">
        {results}
      </pre>
    </div>
  );
}