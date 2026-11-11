import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import { challengeSignupSchema } from "../src/schemas/forms";
import { verifyStripeSignature } from "../src/lib/stripe";

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

describe("verifyStripeSignature", () => {
  const secret = "whsec_test";
  const body = '{"a":1}';
  const t = 1_700_000_000;
  const sig = createHmac("sha256", secret).update(`${t}.${body}`).digest("hex");
  const now = t * 1000;

  it("accepts a valid signature", () => {
    assert.equal(verifyStripeSignature(body, `t=${t},v1=${sig}`, secret, 300, now), true);
  });
  it("rejects a tampered body", () => {
    assert.equal(verifyStripeSignature('{"a":2}', `t=${t},v1=${sig}`, secret, 300, now), false);
  });
  it("rejects an old timestamp and a missing header", () => {
    assert.equal(verifyStripeSignature(body, `t=${t},v1=${sig}`, secret, 300, now + 3_600_000), false);
    assert.equal(verifyStripeSignature(body, null, secret), false);
  });
});
