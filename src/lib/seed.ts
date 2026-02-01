import dbConnect from './db';
import Deal from '../models/Deal';

const sampleDeals = [
  {
    title: '50% Off Notion Pro',
    description: 'Get 50% off Notion Pro for the first year. Perfect for organizing your startup operations.',
    partnerName: 'Notion',
    category: 'tools',
    isLocked: false,
    eligibilityText: 'Available to all registered startups',
  },
  {
    title: 'Free Slack Pro for 6 Months',
    description: 'Free Slack Pro plan for 6 months. Includes unlimited message history and integrations.',
    partnerName: 'Slack',
    category: 'tools',
    isLocked: false,
    eligibilityText: 'Available to all registered startups',
  },
  {
    title: 'AWS Credits - $5,000',
    description: 'Receive $5,000 in AWS credits to kickstart your cloud infrastructure.',
    partnerName: 'Amazon Web Services',
    category: 'services',
    isLocked: true,
    eligibilityText: 'Requires verification as an active startup with revenue under $1M',
  },
  {
    title: 'Stripe Atlas Discount',
    description: '20% discount on Stripe Atlas incorporation fees.',
    partnerName: 'Stripe',
    category: 'finance',
    isLocked: true,
    eligibilityText: 'Requires verification as a pre-launch startup',
  },
  {
    title: 'Google Workspace Business Starter',
    description: 'Free Google Workspace Business Starter for 1 year.',
    partnerName: 'Google',
    category: 'tools',
    isLocked: false,
    eligibilityText: 'Available to all registered startups',
  },
  {
    title: 'HubSpot CRM Free',
    description: 'Free HubSpot CRM Professional plan for 6 months.',
    partnerName: 'HubSpot',
    category: 'marketing',
    isLocked: false,
    eligibilityText: 'Available to all registered startups',
  },
];

export async function seedDeals() {
  try {
    await dbConnect();

    // Clear existing deals
    await Deal.deleteMany({});

    // Insert sample deals
    await Deal.insertMany(sampleDeals);

    console.log('Deals seeded successfully');
  } catch (error) {
    console.error('Error seeding deals:', error);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  seedDeals().then(() => process.exit(0));
}
