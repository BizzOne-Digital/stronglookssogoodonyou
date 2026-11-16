import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { challengeSignupSchema } from "../src/schemas/forms";
import { isOrderId, verifyCompletedOrder } from "../src/lib/paypal";

const valid = { firstName: "Sam", email: "sam@example.com", disclaimerAccepted: true };

describe("challengeSignupSchema", () => {
  it("rejects when the disclaimer is not accepted", () => {
    assert.equal(challengeSignupSchema.safeParse({ ...valid, disclaimerAccepted: false }).success, false);
    assert.equal(challengeSignupSchema.safeParse({ firstName: "Sam", email: "sam@example.com" }).success, false);
  });
  it("defaults marketing consent to false (separate, optional)", () => {
    const r = challengeSignupSchema.parse(valid);
    assert.equal(r.marketingConsent, false);
  });
  it("accepts explicit marketing consent", () => {
    assert.equal(challengeSignupSchema.parse({ ...valid, marketingConsent: true }).marketingConsent, true);
  });
  it("rejects bad email and empty name", () => {
    assert.equal(challengeSignupSchema.safeParse({ ...valid, email: "nope" }).success, false);
    assert.equal(challengeSignupSchema.safeParse({ ...valid, firstName: "  " }).success, false);
  });
});

const expected = { customId: "28-day-body-sculpting-program", amountCents: 2999, currency: "cad" };
const completed = {
  id: "ORDER123456",
  status: "COMPLETED",
  payer: { email_address: "Buyer@Example.com" },
  purchase_units: [
    { payments: { captures: [{ status: "COMPLETED", custom_id: expected.customId, amount: { currency_code: "CAD", value: "29.99" } }] } },
  ],
};

describe("verifyCompletedOrder", () => {
  it("accepts a completed payment for the right product and price", () => {
    const p = verifyCompletedOrder(completed, expected);
    assert.equal(p?.email, "buyer@example.com");
    assert.equal(p?.orderId, "ORDER123456");
  });
  it("rejects wrong amount, currency, product or status", () => {
    const cap = completed.purchase_units[0].payments.captures[0];
    const withCap = (c: object) => ({ ...completed, purchase_units: [{ payments: { captures: [{ ...cap, ...c }] } }] });
    assert.equal(verifyCompletedOrder(withCap({ amount: { currency_code: "CAD", value: "1.00" } }), expected), null);
    assert.equal(verifyCompletedOrder(withCap({ amount: { currency_code: "USD", value: "29.99" } }), expected), null);
    assert.equal(verifyCompletedOrder(withCap({ custom_id: "other" }), expected), null);
    assert.equal(verifyCompletedOrder({ ...completed, status: "APPROVED" }, expected), null);
  });
});

describe("isOrderId", () => {
  it("only allows short alphanumeric ids", () => {
    assert.equal(isOrderId("5O190127TN364715T"), true);
    assert.equal(isOrderId("../etc/passwd"), false);
    assert.equal(isOrderId(undefined), false);
  });
});
