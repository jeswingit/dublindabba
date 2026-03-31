const { createClient } = require('@supabase/supabase-js');

/** Vercel pre-parses JSON into req.body — reading the stream again yields nothing. */
function getJsonBody(req) {
  const b = req.body;
  if (b !== undefined && b !== null && b !== '') {
    if (typeof b === 'string') {
      try {
        return b ? JSON.parse(b) : {};
      } catch {
        return {};
      }
    }
    if (Buffer.isBuffer(b)) {
      const raw = b.toString('utf8');
      try {
        return raw ? JSON.parse(raw) : {};
      } catch {
        return {};
      }
    }
    if (typeof b === 'object') {
      return b;
    }
  }

  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: 'Server is not configured for orders yet.' });
  }

  let body;
  try {
    body = await Promise.resolve(getJsonBody(req));
  } catch {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const address = typeof body.address === 'string' ? body.address.trim() : '';
  const plan = typeof body.plan === 'string' ? body.plan.trim() : '';
  const diet = typeof body.diet === 'string' ? body.diet.trim() : '';
  const message =
    typeof body.message === 'string' && body.message.trim() ? body.message.trim() : null;

  const allowedPlans = new Set(['daily', 'weekly', 'monthly']);
  const allowedDiets = new Set(['veg', 'nonveg', 'jain']);

  if (
    name.length < 2 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    phone.length < 7 ||
    address.length < 5 ||
    !allowedPlans.has(plan) ||
    !allowedDiets.has(diet)
  ) {
    return res.status(400).json({ error: 'Please check all required fields.' });
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from('order_requests').insert({
    name,
    email,
    phone,
    address,
    plan,
    diet,
    message,
  });

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: 'Could not save your order. Please try again.' });
  }

  return res.status(201).json({ ok: true });
};
