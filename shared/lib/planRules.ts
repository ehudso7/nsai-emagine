export const PLAN_LIMITS = {
  free: {
    maxBlogs: 3,
    maxPolicies: 1,
    aiReports: false
  },
  basic: {
    maxBlogs: 20,
    maxPolicies: 5,
    aiReports: true
  },
  pro: {
    maxBlogs: Infinity,
    maxPolicies: Infinity,
    aiReports: true
  }
};

export function getPlanFeatures(plan: keyof typeof PLAN_LIMITS) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
}