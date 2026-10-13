import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { contactSchema, applicationSchema } from "../src/schemas/forms";

describe("contactSchema", () => {
  it("rejects missing privacy acknowledgment", () => {
    const result = contactSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      topic: "Coaching",
      message: "Hello there, I have a question about coaching.",
      privacyAcknowledged: false,
    });
    assert.equal(result.success, false);
  });

  it("accepts valid payload", () => {
    const result = contactSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      topic: "Coaching",
      message: "Hello there, I have a question about coaching.",
      privacyAcknowledged: true,
      website: "",
    });
    assert.equal(result.success, true);
  });
});

describe("applicationSchema", () => {
  it("requires adult confirmation", () => {
    const result = applicationSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      isAdult: false,
      country: "Canada",
      timeZone: "America/Toronto",
      preferredPackage: "Help me choose",
      trainingExperience: "Beginner",
      mainGoals: "Build strength and confidence over the next year.",
      trainingDays: "Mon Wed Fri",
      equipmentAccess: "Full gym",
      lifestyleNotes: "Work 9-5",
      contactMethod: "email",
      privacyAcknowledged: true,
    });
    assert.equal(result.success, false);
  });
});
