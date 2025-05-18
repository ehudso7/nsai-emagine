import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get email from request body
    const { email } = JSON.parse(req.body);

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // This is a stub - in a real application, you would:
    // 1. Store the email in a database (Supabase, MongoDB, etc.)
    // 2. Send a confirmation email
    // 3. Maybe add to a newsletter service like Mailchimp or ConvertKit
    
    console.log(`Adding to waitlist: ${email}`);
    
    // For now, just return success
    return res.status(200).json({ success: true, message: 'Added to waitlist' });
  } catch (error) {
    console.error('Waitlist error:', error);
    return res.status(500).json({ error: 'Failed to join waitlist' });
  }
}