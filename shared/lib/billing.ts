export function getPlanLabel(plan: string) {
  switch (plan) {
    case 'trial': return '3-Day Trial';
    case 'basic': return 'Basic';
    case 'pro': return 'Pro';
    case 'enhanced': return 'Enhanced';
    case 'enterprise': return 'Enterprise';
    default: return 'Unknown';
  }
}

export function getPlanFeatures(plan: string): string[] {
  const features = {
    trial: [
      'Access to 3 basic tools',
      '15 AI requests total',
      'Basic email support',
      'Expires after 3 days'
    ],
    basic: [
      'Access to 5 tools',
      '250 AI requests per month',
      'Standard support',
      'Basic automations'
    ],
    pro: [
      'Access to all 8 tools',
      '1,000 AI requests per month',
      'Priority support',
      'Advanced automations',
      'Team access (up to 3 users)'
    ],
    enhanced: [
      'All Pro features',
      '5,000 AI requests per month',
      'Dedicated support',
      'API access',
      'Team access (up to 10 users)',
      'Advanced analytics'
    ],
    enterprise: [
      'Unlimited AI requests',
      'All tools and premium features',
      'Dedicated account manager',
      'Custom integrations',
      'Unlimited team access',
      'SLA guarantees',
      'White-label options'
    ]
  };
  
  return features[plan as keyof typeof features] || [];
}

export function getPlanPrice(plan: string, billingCycle: 'monthly' | 'annual' = 'monthly'): string {
  if (billingCycle === 'annual') {
    switch (plan) {
      case 'trial': return '$0';
      case 'basic': return '$39/month\n($468/year - save 20%)';
      case 'pro': return '$79/month\n($948/year - save 20%)';
      case 'enhanced': return '$159/month\n($1,908/year - save 20%)';
      case 'enterprise': return '$399/month\n($4,788/year - save 20%)';
      default: return 'Custom';
    }
  } else {
    switch (plan) {
      case 'trial': return '$0';
      case 'basic': return '$49/month';
      case 'pro': return '$99/month';
      case 'enhanced': return '$199/month';
      case 'enterprise': return '$499/month';
      default: return 'Custom';
    }
  }
}

export function getUsageLimits(plan: string) {
  const limits = {
    trial: {
      maxRequests: 15,
      maxTools: 3,
      maxUsers: 1,
      daysValid: 3
    },
    basic: {
      maxRequests: 250,
      maxTools: 5,
      maxUsers: 1,
      daysValid: 30
    },
    pro: {
      maxRequests: 1000,
      maxTools: 8,
      maxUsers: 3,
      daysValid: 30
    },
    enhanced: {
      maxRequests: 5000,
      maxTools: 8,
      maxUsers: 10,
      daysValid: 30
    },
    enterprise: {
      maxRequests: -1, // unlimited
      maxTools: 8,
      maxUsers: -1, // unlimited
      daysValid: 30
    }
  };
  
  return limits[plan as keyof typeof limits] || limits.trial;
}

export function canAccessTool(toolName: string, plan: string): boolean {
  // Tools available on trial plan
  const trialTier = ['comply', 'nichepress', 'grantbot'];
  
  // Basic plan tools
  const basicTier = [...trialTier, 'hireedge', 'hostflow'];
  
  // Pro plan tools
  const proTier = [...basicTier, 'advisor', 'monetizer', 'integrator'];
  
  // Enhanced and Enterprise get the same tools but with higher limits
  const enhancedTier = proTier;
  const enterpriseTier = proTier;
  
  if (plan === 'trial') {
    return trialTier.includes(toolName);
  } else if (plan === 'basic') {
    return basicTier.includes(toolName);
  } else if (plan === 'pro') {
    return proTier.includes(toolName);
  } else if (plan === 'enhanced') {
    return enhancedTier.includes(toolName);
  } else if (plan === 'enterprise') {
    return enterpriseTier.includes(toolName);
  }
  
  return false;
}