'use client';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';

export default function NSAIHostFlow() {
  const [guestMessage, setGuestMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function getAutoReply() {
    setLoading(true);
    const res = await fetch('/api/hostflow/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: guestMessage })
    });
    const data = await res.json();
    setResponse(data.reply || 'No response generated.');
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">NSAI HostFlow</h1>
      <p className="mb-4 text-muted-foreground">
        Paste a message from your Airbnb guest, and get an instant reply powered by AI.
      </p>
      <textarea
        value={guestMessage}
        onChange={(e) => setGuestMessage(e.target.value)}
        placeholder="Hi! What's the Wi-Fi password and when is check-in?"
        className="p-2 border rounded w-full mb-4"
        rows={4}
      />
      <Button onClick={getAutoReply} disabled={loading || !guestMessage}>
        {loading ? 'Responding...' : 'Generate Reply'}
      </Button>
      <pre className="mt-6 bg-gray-100 p-4 rounded whitespace-pre-wrap">
        {response}
      </pre>
    </div>
  );
}