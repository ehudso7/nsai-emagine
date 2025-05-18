// Helper functions for the referral system

export function generateReferralCode(userId: string, name: string): string {
  // Create a code based on user's name (first part) and a portion of their ID
  const namePart = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 6);
  const idPart = userId.substring(0, 6);
  return `${namePart}-${idPart}`;
}

export function getRewardTiers() {
  return [
    { count: 3, reward: 'Free month of Pro plan' },
    { count: 5, reward: '$50 account credit' },
    { count: 10, reward: 'Lifetime 25% discount' }
  ];
}

export function formatReferralLink(referralCode: string): string {
  return `${process.env.NEXT_PUBLIC_SITE_URL || 'https://nsai-emagine.com'}?ref=${referralCode}`;
}

export function getNextReward(referralCount: number) {
  const tiers = getRewardTiers();
  for (const tier of tiers) {
    if (referralCount < tier.count) {
      return {
        next: tier,
        remaining: tier.count - referralCount
      };
    }
  }
  
  // If they've passed all tiers
  return null;
}