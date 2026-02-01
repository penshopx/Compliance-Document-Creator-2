import { getUncachableStripeClient } from '../server/stripeClient';

async function createProducts() {
  const stripe = await getUncachableStripeClient();

  console.log('Creating Compliance Hub subscription products...');

  const existingProducts = await stripe.products.search({ query: "name:'Starter'" });
  if (existingProducts.data.length > 0) {
    console.log('Products already exist, skipping creation');
    return;
  }

  const starterProduct = await stripe.products.create({
    name: 'Starter',
    description: 'Paket gratis untuk memulai perjalanan compliance',
    metadata: {
      tier: 'starter',
      features: 'Pancek Basic, 5 Template Dokumen, 1 Profil Perusahaan'
    }
  });

  await stripe.prices.create({
    product: starterProduct.id,
    unit_amount: 0,
    currency: 'idr',
    recurring: { interval: 'month' },
    metadata: { tier: 'starter' }
  });

  console.log('Created Starter plan:', starterProduct.id);

  const proProduct = await stripe.products.create({
    name: 'Professional',
    description: 'Paket lengkap untuk perusahaan yang serius dengan compliance',
    metadata: {
      tier: 'professional',
      features: 'Unlimited Perusahaan, SMAP + Pancek, 270+ Template, AI Mentor Unlimited, Export PDF, Tracking Sertifikasi'
    }
  });

  await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 49900000,
    currency: 'idr',
    recurring: { interval: 'month' },
    metadata: { tier: 'professional' }
  });

  console.log('Created Professional plan:', proProduct.id);

  const enterpriseProduct = await stripe.products.create({
    name: 'Enterprise',
    description: 'Paket enterprise untuk grup perusahaan besar',
    metadata: {
      tier: 'enterprise',
      features: 'Semua fitur Professional, Multi-User, Dedicated Manager, Training, API, SLA 24/7'
    }
  });

  await stripe.prices.create({
    product: enterpriseProduct.id,
    unit_amount: 149900000,
    currency: 'idr',
    recurring: { interval: 'month' },
    metadata: { tier: 'enterprise' }
  });

  console.log('Created Enterprise plan:', enterpriseProduct.id);

  console.log('All products created successfully!');
}

createProducts().catch(console.error);
