import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BillingSection from '../apps/dashboard/components/BillingSection';
import { getPlanFeatures, getPlanLabel, getPlanPrice } from '../shared/lib/billing';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ url: 'https://checkout.stripe.com/test' }),
  })
) as jest.Mock;

// Mock window.location
Object.defineProperty(window, 'location', {
  writable: true,
  value: { href: '' },
});

describe('BillingSection Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders properly with current plan', () => {
    render(<BillingSection currentPlan="trial" userEmail="test@example.com" />);
    
    // Check if the current plan is displayed
    expect(screen.getByText(/You are currently on the/)).toBeInTheDocument();
    expect(screen.getByText('3-Day Trial')).toBeInTheDocument();
    
    // Should see a warning for trial users
    expect(screen.getByText(/Your trial expires in 3 days/)).toBeInTheDocument();
  });

  it('shows different plan options', () => {
    render(<BillingSection currentPlan="trial" userEmail="test@example.com" />);
    
    // Check if all plans are displayed
    expect(screen.getByText('3-Day Trial')).toBeInTheDocument();
    expect(screen.getByText('Basic')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Enhanced')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
    
    // Pro plan should have a 'RECOMMENDED' badge
    expect(screen.getByText('RECOMMENDED')).toBeInTheDocument();
  });

  it('switches between monthly and annual billing', () => {
    render(<BillingSection currentPlan="trial" userEmail="test@example.com" />);
    
    // Should default to monthly billing
    expect(screen.getByText('Monthly').className).toContain('font-bold');
    expect(screen.getByText('Annual').className).toContain('text-gray-500');
    
    // Switch to annual billing
    fireEvent.click(screen.getByRole('button', { name: '' })); // The toggle button
    
    // Now annual should be highlighted
    expect(screen.getByText('Monthly').className).toContain('text-gray-500');
    expect(screen.getByText('Annual').className).toContain('font-bold');
    
    // Text should mention the discount
    expect(screen.getByText('Save 20%')).toBeInTheDocument();
  });

  it('calls upgrade when clicking an upgrade button', async () => {
    render(<BillingSection currentPlan="trial" userEmail="test@example.com" />);
    
    // Click the upgrade button for the Pro plan
    const upgradeButton = screen.getAllByText(/Upgrade to/)[1]; // Pro plan upgrade button
    fireEvent.click(upgradeButton);
    
    // Should call fetch with correct parameters
    expect(fetch).toHaveBeenCalledWith('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', plan: 'pro' }),
    });
  });
});

describe('Billing Utility Functions', () => {
  it('returns correct plan labels', () => {
    expect(getPlanLabel('trial')).toBe('3-Day Trial');
    expect(getPlanLabel('basic')).toBe('Basic');
    expect(getPlanLabel('pro')).toBe('Pro');
    expect(getPlanLabel('enhanced')).toBe('Enhanced');
    expect(getPlanLabel('enterprise')).toBe('Enterprise');
  });

  it('returns correct plan prices', () => {
    // Monthly prices
    expect(getPlanPrice('trial')).toBe('$0');
    expect(getPlanPrice('basic')).toBe('$49/month');
    expect(getPlanPrice('pro')).toBe('$99/month');
    expect(getPlanPrice('enhanced')).toBe('$199/month');
    expect(getPlanPrice('enterprise')).toBe('$499/month');
    
    // Annual prices
    expect(getPlanPrice('basic', 'annual')).toContain('$39/month');
    expect(getPlanPrice('basic', 'annual')).toContain('save 20%');
    expect(getPlanPrice('pro', 'annual')).toContain('$79/month');
    expect(getPlanPrice('enhanced', 'annual')).toContain('$159/month');
    expect(getPlanPrice('enterprise', 'annual')).toContain('$399/month');
  });

  it('returns plan features for each tier', () => {
    const trialFeatures = getPlanFeatures('trial');
    expect(trialFeatures).toContain('Access to 3 basic tools');
    expect(trialFeatures).toContain('Expires after 3 days');
    
    const basicFeatures = getPlanFeatures('basic');
    expect(basicFeatures).toContain('Access to 5 tools');
    expect(basicFeatures).toContain('250 AI requests per month');
    
    const proFeatures = getPlanFeatures('pro');
    expect(proFeatures).toContain('Access to all 8 tools');
    expect(proFeatures).toContain('Team access (up to 3 users)');
    
    const enhancedFeatures = getPlanFeatures('enhanced');
    expect(enhancedFeatures).toContain('API access');
    expect(enhancedFeatures).toContain('Team access (up to 10 users)');
    
    const enterpriseFeatures = getPlanFeatures('enterprise');
    expect(enterpriseFeatures).toContain('Unlimited AI requests');
    expect(enterpriseFeatures).toContain('White-label options');
  });
});