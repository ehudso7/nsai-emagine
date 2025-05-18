export const PLAN_LIMITS = {
  trial: {
    maxBlogs: 2,
    maxPolicies: 1,
    aiReports: false
  },
  basic: {
    maxBlogs: 15,
    maxPolicies: 3,
    aiReports: true
  },
  pro: {
    maxBlogs: 50,
    maxPolicies: 10,
    aiReports: true
  },
  enhanced: {
    maxBlogs: 200,
    maxPolicies: 30,
    aiReports: true
  },
  enterprise: {
    maxBlogs: Infinity,
    maxPolicies: Infinity,
    aiReports: true
  }
};

export function getPlanFeatures(plan: keyof typeof PLAN_LIMITS) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
}