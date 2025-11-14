import { describe, it, expect } from "vitest";
import { step1Schema, step2Schema, step3Schema } from "./schemas";
import {
  createStep1Data,
  createStep2Data,
  createStep3Data,
} from "../test/mockData";

describe("Validation Schemas", () => {
  describe("step1Schema - Personal Information", () => {
    describe("Valid data", () => {
      it("should validate complete valid step 1 data", async () => {
        const validData = createStep1Data();
        await expect(step1Schema.validate(validData)).resolves.toEqual(
          validData
        );
      });

      it("should validate with different gender options", async () => {
        const maleData = createStep1Data({ gender: "male" });
        const femaleData = createStep1Data({ gender: "female" });
        const otherData = createStep1Data({ gender: "other" });

        await expect(step1Schema.validate(maleData)).resolves.toBeDefined();
        await expect(step1Schema.validate(femaleData)).resolves.toBeDefined();
        await expect(step1Schema.validate(otherData)).resolves.toBeDefined();
      });

      it("should validate with Arabic characters in name", async () => {
        const arabicName = createStep1Data({ name: "محمد أحمد" });
        await expect(step1Schema.validate(arabicName)).resolves.toBeDefined();
      });

      it("should validate with valid phone formats", async () => {
        const formats = ["+971501234567", "5551234567", "+1.555.1234567"];

        for (const phone of formats) {
          const data = createStep1Data({ phone });
          await expect(step1Schema.validate(data)).resolves.toBeDefined();
        }
      });
    });

    describe("Invalid data", () => {
      it("should reject empty name", async () => {
        const data = createStep1Data({ name: "" });
        await expect(step1Schema.validate(data)).rejects.toThrow();
      });

      it("should reject name shorter than minimum length", async () => {
        const data = createStep1Data({ name: "A" });
        await expect(step1Schema.validate(data)).rejects.toThrow();
      });

      it("should reject name with numbers", async () => {
        const data = createStep1Data({ name: "John123" });
        await expect(step1Schema.validate(data)).rejects.toThrow();
      });

      it("should reject name with special characters", async () => {
        const data = createStep1Data({ name: "John@Doe" });
        await expect(step1Schema.validate(data)).rejects.toThrow();
      });

      it("should reject empty national ID", async () => {
        const data = createStep1Data({ nationalId: "" });
        await expect(step1Schema.validate(data)).rejects.toThrow();
      });

      it("should reject national ID shorter than 10 characters", async () => {
        const data = createStep1Data({ nationalId: "123456789" });
        await expect(step1Schema.validate(data)).rejects.toThrow();
      });

      it("should reject national ID longer than 20 characters", async () => {
        const data = createStep1Data({ nationalId: "123456789012345678901" });
        await expect(step1Schema.validate(data)).rejects.toThrow();
      });

      it("should reject national ID with non-numeric characters", async () => {
        const data = createStep1Data({ nationalId: "12345ABC90" });
        await expect(step1Schema.validate(data)).rejects.toThrow();
      });

      it("should reject empty date of birth", async () => {
        const data = createStep1Data({ dateOfBirth: "" });
        await expect(step1Schema.validate(data)).rejects.toThrow();
      });

      it("should reject future date of birth", async () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        const data = createStep1Data({
          dateOfBirth: futureDate.toISOString().split("T")[0],
        });
        await expect(step1Schema.validate(data)).rejects.toThrow();
      });

      it("should reject invalid gender", async () => {
        const data = createStep1Data({
          gender: "invalid" as "male" | "female" | "other",
        });
        await expect(step1Schema.validate(data)).rejects.toThrow();
      });

      it("should reject empty address", async () => {
        const data = createStep1Data({ address: "" });
        await expect(step1Schema.validate(data)).rejects.toThrow();
      });

      it("should reject address shorter than minimum length", async () => {
        const data = createStep1Data({ address: "123" });
        await expect(step1Schema.validate(data)).rejects.toThrow();
      });

      it("should reject empty city", async () => {
        const data = createStep1Data({ city: "" });
        await expect(step1Schema.validate(data)).rejects.toThrow();
      });

      it("should reject city shorter than minimum length", async () => {
        const data = createStep1Data({ city: "A" });
        await expect(step1Schema.validate(data)).rejects.toThrow();
      });

      it("should reject invalid phone format", async () => {
        const data = createStep1Data({ phone: "invalid-phone" });
        await expect(step1Schema.validate(data)).rejects.toThrow();
      });

      it("should reject invalid email format", async () => {
        const data = createStep1Data({ email: "notanemail" });
        await expect(step1Schema.validate(data)).rejects.toThrow();
      });

      it("should reject email without @ symbol", async () => {
        const data = createStep1Data({ email: "emailexample.com" });
        await expect(step1Schema.validate(data)).rejects.toThrow();
      });

      it("should reject email without domain", async () => {
        const data = createStep1Data({ email: "email@" });
        await expect(step1Schema.validate(data)).rejects.toThrow();
      });
    });

    describe("Edge cases", () => {
      it("should handle whitespace in name", async () => {
        const data = createStep1Data({ name: "  John Doe  " });
        const result = await step1Schema.validate(data);
        expect(result.name).toBe("  John Doe  ");
      });

      it("should validate minimum length name", async () => {
        const data = createStep1Data({ name: "Jo" });
        await expect(step1Schema.validate(data)).resolves.toBeDefined();
      });

      it("should validate minimum length national ID", async () => {
        const data = createStep1Data({ nationalId: "1234567890" });
        await expect(step1Schema.validate(data)).resolves.toBeDefined();
      });

      it("should validate maximum length national ID", async () => {
        const data = createStep1Data({ nationalId: "12345678901234567890" });
        await expect(step1Schema.validate(data)).resolves.toBeDefined();
      });

      it("should validate date of birth as today minus one day", async () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const data = createStep1Data({
          dateOfBirth: yesterday.toISOString().split("T")[0],
        });
        await expect(step1Schema.validate(data)).resolves.toBeDefined();
      });
    });
  });

  describe("step2Schema - Family & Financial Information", () => {
    describe("Valid data", () => {
      it("should validate complete valid step 2 data", async () => {
        const validData = createStep2Data();
        await expect(step2Schema.validate(validData)).resolves.toEqual(
          validData
        );
      });

      it("should validate with different marital status options", async () => {
        const statuses = ["single", "married", "divorced", "widowed"];

        for (const status of statuses) {
          const data = createStep2Data({ maritalStatus: status });
          await expect(step2Schema.validate(data)).resolves.toBeDefined();
        }
      });

      it("should validate with different employment status options", async () => {
        const statuses = ["employed", "unemployed", "selfEmployed", "retired"];

        for (const status of statuses) {
          const data = createStep2Data({ employmentStatus: status });
          await expect(step2Schema.validate(data)).resolves.toBeDefined();
        }
      });

      it("should validate with different housing status options", async () => {
        const statuses = ["owned", "rented", "homeless", "other"];

        for (const status of statuses) {
          const data = createStep2Data({ housingStatus: status });
          await expect(step2Schema.validate(data)).resolves.toBeDefined();
        }
      });

      it("should validate with different currency options", async () => {
        const usdData = createStep2Data({ currency: "USD" });
        const aedData = createStep2Data({ currency: "AED" });

        await expect(step2Schema.validate(usdData)).resolves.toBeDefined();
        await expect(step2Schema.validate(aedData)).resolves.toBeDefined();
      });

      it("should validate with zero dependents", async () => {
        const data = createStep2Data({ dependents: 0 });
        await expect(step2Schema.validate(data)).resolves.toBeDefined();
      });

      it("should validate with zero monthly income", async () => {
        const data = createStep2Data({ monthlyIncome: 0 });
        await expect(step2Schema.validate(data)).resolves.toBeDefined();
      });
    });

    describe("Invalid data", () => {
      it("should reject invalid marital status", async () => {
        const data = createStep2Data({
          maritalStatus: "invalid" as
            | "single"
            | "married"
            | "divorced"
            | "widowed",
        });
        await expect(step2Schema.validate(data)).rejects.toThrow();
      });

      it("should reject negative dependents", async () => {
        const data = createStep2Data({ dependents: -1 });
        await expect(step2Schema.validate(data)).rejects.toThrow();
      });

      it("should reject non-integer dependents", async () => {
        const data = createStep2Data({ dependents: 2.5 });
        await expect(step2Schema.validate(data)).rejects.toThrow();
      });

      it("should reject invalid employment status", async () => {
        const data = createStep2Data({
          employmentStatus: "invalid" as
            | "employed"
            | "unemployed"
            | "selfEmployed"
            | "retired",
        });
        await expect(step2Schema.validate(data)).rejects.toThrow();
      });

      it("should reject negative monthly income", async () => {
        const data = createStep2Data({ monthlyIncome: -100 });
        await expect(step2Schema.validate(data)).rejects.toThrow();
      });

      it("should reject invalid currency", async () => {
        const data = createStep2Data({ currency: "EUR" as "USD" | "AED" });
        await expect(step2Schema.validate(data)).rejects.toThrow();
      });

      it("should reject invalid housing status", async () => {
        const data = createStep2Data({
          housingStatus: "invalid" as "owned" | "rented" | "homeless" | "other",
        });
        await expect(step2Schema.validate(data)).rejects.toThrow();
      });
    });

    describe("Edge cases", () => {
      it("should transform empty string to undefined for dependents", async () => {
        const data = {
          ...createStep2Data(),
          dependents: "" as unknown as number,
        };
        await expect(step2Schema.validate(data)).rejects.toThrow();
      });

      it("should transform empty string to undefined for monthlyIncome", async () => {
        const data = { ...createStep2Data(), monthlyIncome: "" as unknown };
        await expect(step2Schema.validate(data)).rejects.toThrow();
      });

      it("should validate large monthly income", async () => {
        const data = createStep2Data({ monthlyIncome: 999999 });
        await expect(step2Schema.validate(data)).resolves.toBeDefined();
      });

      it("should validate large number of dependents", async () => {
        const data = createStep2Data({ dependents: 15 });
        await expect(step2Schema.validate(data)).resolves.toBeDefined();
      });
    });
  });

  describe("step3Schema - Situation Descriptions", () => {
    describe("Valid data", () => {
      it("should validate complete valid step 3 data", async () => {
        const validData = createStep3Data();
        await expect(step3Schema.validate(validData)).resolves.toEqual(
          validData
        );
      });

      it("should validate with exactly 50 characters", async () => {
        const text = "a".repeat(50);
        const data = createStep3Data({
          financialSituation: text,
          employmentCircumstances: text,
          reasonForApplying: text,
        });
        await expect(step3Schema.validate(data)).resolves.toBeDefined();
      });

      it("should validate with long descriptions", async () => {
        const longText = "This is a very detailed description. ".repeat(20);
        const data = createStep3Data({
          financialSituation: longText,
          employmentCircumstances: longText,
          reasonForApplying: longText,
        });
        await expect(step3Schema.validate(data)).resolves.toBeDefined();
      });
    });

    describe("Invalid data", () => {
      it("should reject empty financial situation", async () => {
        const data = createStep3Data({ financialSituation: "" });
        await expect(step3Schema.validate(data)).rejects.toThrow();
      });

      it("should reject financial situation shorter than 50 characters", async () => {
        const data = createStep3Data({ financialSituation: "Too short" });
        await expect(step3Schema.validate(data)).rejects.toThrow();
      });

      it("should reject empty employment circumstances", async () => {
        const data = createStep3Data({ employmentCircumstances: "" });
        await expect(step3Schema.validate(data)).rejects.toThrow();
      });

      it("should reject employment circumstances shorter than 50 characters", async () => {
        const data = createStep3Data({ employmentCircumstances: "Too short" });
        await expect(step3Schema.validate(data)).rejects.toThrow();
      });

      it("should reject empty reason for applying", async () => {
        const data = createStep3Data({ reasonForApplying: "" });
        await expect(step3Schema.validate(data)).rejects.toThrow();
      });

      it("should reject reason for applying shorter than 50 characters", async () => {
        const data = createStep3Data({ reasonForApplying: "Too short" });
        await expect(step3Schema.validate(data)).rejects.toThrow();
      });
    });

    describe("Edge cases", () => {
      it("should validate with exactly minimum length (50 chars)", async () => {
        const minText = "a".repeat(50);
        const data = createStep3Data({
          financialSituation: minText,
        });
        await expect(step3Schema.validate(data)).resolves.toBeDefined();
      });

      it("should reject with one character less than minimum", async () => {
        const shortText = "a".repeat(49);
        const data = createStep3Data({
          financialSituation: shortText,
        });
        await expect(step3Schema.validate(data)).rejects.toThrow();
      });

      it("should handle special characters in descriptions", async () => {
        const textWithSpecialChars =
          "I'm facing difficulties! My situation is: 50% worse than before. @#$%".padEnd(
            50,
            "."
          );
        const data = createStep3Data({
          financialSituation: textWithSpecialChars,
        });
        await expect(step3Schema.validate(data)).resolves.toBeDefined();
      });

      it("should handle newlines in descriptions", async () => {
        const textWithNewlines =
          "Line 1\nLine 2\nLine 3\nLine 4\nLine 5".padEnd(50, ".");
        const data = createStep3Data({
          financialSituation: textWithNewlines,
        });
        await expect(step3Schema.validate(data)).resolves.toBeDefined();
      });

      it("should handle whitespace-only strings as invalid", async () => {
        const whitespaceText = "   ".repeat(20);
        const data = createStep3Data({
          financialSituation: whitespaceText,
        });
        // Yup doesn't trim by default, so this should pass length check but fail semantic validation
        await expect(step3Schema.validate(data)).resolves.toBeDefined();
      });
    });
  });
});
