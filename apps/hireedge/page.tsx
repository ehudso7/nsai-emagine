'use client';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';

export default function NSAIHireEdge() {
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  async function generateApplicationKit() {
    setLoading(true);
    const res = await fetch('/api/hireedge/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, bio })
    });
    const data = await res.json();
    setOutput(data.output || 'Error generating content');
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">NSAI HireEdge</h1>
      <p className="mb-4 text-muted-foreground">
        Enter your niche job role and background. Get a complete application kit in seconds.
      </p>
      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="e.g. offshore wind turbine technician"
        className="p-2 border rounded w-full mb-2"
      />
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Describe your background, skills, and career goals..."
        className="p-2 border rounded w-full mb-4"
        rows={5}
      />
      <Button onClick={generateApplicationKit} disabled={loading || !role || !bio}>
        {loading ? 'Generating...' : 'Generate Resume & Cover Letter'}
      </Button>
      <pre className="mt-6 bg-gray-100 p-4 rounded whitespace-pre-wrap">
        {output}
      </pre>
    </div>
  );
}