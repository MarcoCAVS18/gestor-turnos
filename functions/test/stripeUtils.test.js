const test = require('node:test');
const assert = require('node:assert/strict');
const u = require('../stripeUtils');

const ts = (ms) => ({ ms }); // stand-in for Firestore Timestamp

test('period end: legacy shape and clover shape (items)', () => {
  assert.equal(u.getPeriodEnd({ current_period_end: 100 }), 100);
  assert.equal(u.getPeriodEnd({ items: { data: [{ current_period_end: 200 }, { current_period_end: 300 }] } }), 300);
  assert.equal(u.getPeriodEnd({ items: { data: [] } }), null);
  assert.equal(u.getExpiryMillis({ items: { data: [{ current_period_end: 200 }] } }), 200000);
  assert.equal(u.getExpiryMillis({}, 1000), 1000 + 30 * 24 * 3600 * 1000);
});

test('invoice subscription id: legacy, clover parent, line items, one-off', () => {
  assert.equal(u.getInvoiceSubscriptionId({ subscription: 'sub_a' }), 'sub_a');
  assert.equal(u.getInvoiceSubscriptionId({ subscription: { id: 'sub_b' } }), 'sub_b');
  assert.equal(u.getInvoiceSubscriptionId({ parent: { subscription_details: { subscription: 'sub_c' } } }), 'sub_c');
  assert.equal(u.getInvoiceSubscriptionId({ lines: { data: [{ parent: { subscription_item_details: { subscription: 'sub_d' } } }] } }), 'sub_d');
  assert.equal(u.getInvoiceSubscriptionId({ parent: null, lines: { data: [] } }), null);
});

test('invoice paid and client secret in both shapes', () => {
  assert.equal(u.isInvoicePaid({ paid: true }), true);
  assert.equal(u.isInvoicePaid({ status: 'paid' }), true);
  assert.equal(u.isInvoicePaid({ status: 'open' }), false);
  assert.equal(u.getInvoiceClientSecret({ confirmation_secret: { client_secret: 'pi_1_secret_x' } }), 'pi_1_secret_x');
  assert.equal(u.getInvoiceClientSecret({ payment_intent: { client_secret: 'pi_2_secret_y' } }), 'pi_2_secret_y');
  assert.equal(u.getInvoiceClientSecret({ payment_intent: 'pi_3' }), null);
});

test('state mapping: trialing, active, cancelling via app or portal, past_due, canceled, incomplete', () => {
  const sub = (extra) => ({ id: 'sub_1', customer: { id: 'cus_1' }, items: { data: [{ current_period_end: 2000 }] }, ...extra });
  const t = u.subscriptionStateUpdates(sub({ status: 'trialing', trial_end: 1500 }), ts);
  assert.equal(t['subscription.status'], 'trialing');
  assert.equal(t['subscription.isPremium'], true);
  assert.deepEqual(t['subscription.trialEnd'], { ms: 1500000 });
  assert.equal(t['subscription.stripeCustomerId'], 'cus_1');

  const a = u.subscriptionStateUpdates(sub({ status: 'active' }), ts);
  assert.equal(a['subscription.status'], 'active');
  assert.deepEqual(a['subscription.expiryDate'], { ms: 2000000 });
  assert.equal(a['subscription.trialEnd'], null);

  assert.equal(u.subscriptionStateUpdates(sub({ status: 'active', cancel_at_period_end: true }), ts)['subscription.status'], 'cancelling');
  assert.equal(u.subscriptionStateUpdates(sub({ status: 'active', cancel_at: 2000 }), ts)['subscription.status'], 'cancelling');
  assert.equal(u.subscriptionStateUpdates(sub({ status: 'past_due' }), ts)['subscription.status'], 'past_due');
  const c = u.subscriptionStateUpdates(sub({ status: 'canceled' }), ts);
  assert.equal(c['subscription.isPremium'], false);
  assert.equal(c['subscription.status'], 'cancelled');
  assert.equal(u.subscriptionStateUpdates(sub({ status: 'incomplete' }), ts), null);
});
