export function getPlanLabel(plan: string) {
  switch (plan) {
    case 'free': return 'Free';
    case 'basic': return 'Pro';
    case 'pro': return 'Business';
    default: return 'Unknown';
  }
}

export function getPlanFeatures(plan: string): string[] {
  const features = {
    free: [
      'Access to 3 basic tools',
      '50 AI requests per month',
      'Email support'
    ],
    basic: [
      'Access to all tools',
      '500 AI requests per month',
      'Priority support',
      'Workflow automations'
    ],
    pro: [
      'Unlimited AI requests',
      'All tools and features',
      'Dedicated support',
      'Advanced integrations',
      'Team access (up to 5 users)'
    ]
  };
  
  return features[plan as keyof typeof features] || [];
}

export function getPlanPrice(plan: string): string {
  switch (plan) {
    case 'free': return '$0';
    case 'basic': return '$29/month';
    case 'pro': return '$79/month';
    default: return 'Custom';
  }
}

export function getUsageLimits(plan: string) {
  const limits = {
    free: {
      maxRequests: 50,
      maxTools: 3,
      maxUsers: 1
    },
    basic: {
      maxRequests: 500,
      maxTools: 8,
      maxUsers: 1
    },
    pro: {
      maxRequests: -1, // unlimited
      maxTools: 8,
      maxUsers: 5
    }
  };
  
  return limits[plan as keyof typeof limits] || limits.free;
}

export function canAccessTool(toolName: string, plan: string): boolean {
  // Tools available on free plan
  const freeTier = ['comply', 'nichepress', 'grantbot'];
  
  // Additional tools on basic plan
  const basicTier = [...freeTier, 'hireedge', 'hostflow'];
  
  // All tools on pro plan
  const proTier = [...basicTier, 'advisor', 'monetizer', 'integrator'];
  
  if (plan === 'free') {
    return freeTier.includes(toolName);
  } else if (plan === 'basic') {
    return basicTier.includes(toolName);
  } else if (plan === 'pro') {
    return proTier.includes(toolName);
  }
  
  return false;
}