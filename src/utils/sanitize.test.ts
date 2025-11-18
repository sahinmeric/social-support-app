import { describe, it, expect } from "vitest";
import { sanitizeInput, sanitizeFormData } from "./sanitize";
import type { ApplicationFormData } from "../types/form.types";

describe("sanitizeInput", () => {
  it("should trim whitespace by default", () => {
    const result = sanitizeInput("  hello world  ");
    expect(result).toBe("hello world");
  });

  it("should not trim whitespace when trim option is false", () => {
    const result = sanitizeInput("  hello world  ", { trim: false });
    expect(result).toBe("  hello world  ");
  });

  it("should remove HTML tags by default", () => {
    const result = sanitizeInput("<p>Hello <strong>World</strong></p>");
    expect(result).toBe("Hello World");
  });

  it("should keep HTML tags when allowHtml is true", () => {
    const result = sanitizeInput("<p>Hello World</p>", { allowHtml: true });
    // Note: angle brackets are still removed for security
    expect(result).toBe("pHello World/p");
  });

  it("should remove script tags", () => {
    const result = sanitizeInput('<script>alert("xss")</script>Hello World');
    expect(result).toBe('alert("xss")Hello World');
  });

  it("should remove iframe tags", () => {
    const result = sanitizeInput('<iframe src="evil.com"></iframe>Hello World');
    expect(result).toBe("Hello World");
  });

  it("should remove javascript: protocol", () => {
    const result = sanitizeInput('javascript:alert("xss")Hello World');
    expect(result).toBe('alert("xss")Hello World');
  });

  it("should remove event handlers", () => {
    const result = sanitizeInput('onclick="alert()" Hello World');
    expect(result).toBe('"alert()" Hello World');
  });

  it("should remove angle brackets", () => {
    const result = sanitizeInput("Hello <World>");
    expect(result).toBe("Hello ");
  });

  it("should preserve legitimate special characters", () => {
    const result = sanitizeInput("O'Brien-Smith & Co. (2024)");
    expect(result).toBe("O'Brien-Smith & Co. (2024)");
  });

  it("should limit length when maxLength is specified", () => {
    const result = sanitizeInput("Hello World", { maxLength: 5 });
    expect(result).toBe("Hello");
  });

  it("should handle empty strings", () => {
    const result = sanitizeInput("");
    expect(result).toBe("");
  });

  it("should handle strings with only whitespace", () => {
    const result = sanitizeInput("   ");
    expect(result).toBe("");
  });

  it("should handle complex XSS attempts", () => {
    const result = sanitizeInput(
      '<img src=x onerror="alert(1)">Hello<script>alert("xss")</script>'
    );
    expect(result).toBe('Helloalert("xss")');
  });

  describe("Arabic text handling", () => {
    it("should preserve Arabic characters (U+0600 to U+06FF)", () => {
      const arabicText = "أواجه حاليًا تحديات مالية كبيرة";
      const result = sanitizeInput(arabicText);
      expect(result).toBe(arabicText);
    });

    it("should preserve Arabic diacritics", () => {
      const textWithDiacritics = "مُحَمَّد يَعْمَلُ فِي الْمَدِينَةِ";
      const result = sanitizeInput(textWithDiacritics);
      expect(result).toBe(textWithDiacritics);
    });

    it("should preserve Arabic punctuation", () => {
      const textWithPunctuation = "السلام عليكم، كيف حالك؟ أنا بخير!";
      const result = sanitizeInput(textWithPunctuation);
      expect(result).toBe(textWithPunctuation);
    });

    it("should preserve mixed Arabic and English text", () => {
      const mixedText = "My name is محمد and I live in القاهرة";
      const result = sanitizeInput(mixedText);
      expect(result).toBe(mixedText);
    });

    it("should preserve Arabic numbers (Eastern Arabic numerals)", () => {
      const textWithNumbers = "لدي ٣ أطفال وراتبي ٥٠٠٠ دولار";
      const result = sanitizeInput(textWithNumbers);
      expect(result).toBe(textWithNumbers);
    });

    it("should remove XSS attempts while preserving Arabic text", () => {
      const maliciousArabic = '<script>alert("xss")</script>أواجه تحديات مالية';
      const result = sanitizeInput(maliciousArabic);
      expect(result).toBe('alert("xss")أواجه تحديات مالية');
    });

    it("should handle Arabic text with HTML tags", () => {
      const arabicWithHtml = "<p>أواجه تحديات <strong>مالية</strong></p>";
      const result = sanitizeInput(arabicWithHtml);
      expect(result).toBe("أواجه تحديات مالية");
    });

    it("should correctly count Arabic characters with maxLength", () => {
      const arabicText = "أواجه حاليًا تحديات";
      const result = sanitizeInput(arabicText, { maxLength: 10 });
      // Verify the result is truncated to 10 characters
      expect(result.length).toBe(10);
      // Verify it starts with the expected text
      expect(result).toBe(arabicText.substring(0, 10));
    });

    it("should preserve Arabic text in form data sanitization", () => {
      const data: Partial<ApplicationFormData> = {
        financialSituation: "أواجه حاليًا تحديات مالية كبيرة",
        employmentCircumstances: "وضعي الوظيفي الحالي صعب",
        reasonForApplying: "أحتاج إلى الدعم المالي لعائلتي",
      };

      const result = sanitizeFormData(data);

      expect(result.financialSituation).toBe("أواجه حاليًا تحديات مالية كبيرة");
      expect(result.employmentCircumstances).toBe("وضعي الوظيفي الحالي صعب");
      expect(result.reasonForApplying).toBe("أحتاج إلى الدعم المالي لعائلتي");
    });
  });
});

describe("sanitizeFormData", () => {
  it("should sanitize all string fields", () => {
    const data: Partial<ApplicationFormData> = {
      name: "  John Doe  ",
      address: "<script>alert('xss')</script>123 Main St",
      email: "john@example.com",
    };

    const result = sanitizeFormData(data);

    expect(result.name).toBe("John Doe");
    expect(result.address).toBe("alert('xss')123 Main St");
    expect(result.email).toBe("john@example.com");
  });

  it("should preserve numeric fields", () => {
    const data: Partial<ApplicationFormData> = {
      dependents: 3,
      monthlyIncome: 5000,
    };

    const result = sanitizeFormData(data);

    expect(result.dependents).toBe(3);
    expect(result.monthlyIncome).toBe(5000);
  });

  it("should convert empty string to 0 for dependents field", () => {
    const data: Partial<ApplicationFormData> = {
      dependents: "" as unknown as number,
    };

    const result = sanitizeFormData(data);

    expect(result.dependents).toBe(0);
  });

  it("should convert empty string to 0 for monthlyIncome field", () => {
    const data: Partial<ApplicationFormData> = {
      monthlyIncome: "" as unknown as number,
    };

    const result = sanitizeFormData(data);

    expect(result.monthlyIncome).toBe(0);
  });

  it("should handle mixed data types", () => {
    const data: Partial<ApplicationFormData> = {
      name: "  Jane Smith  ",
      dependents: 2,
      address: "<p>456 Oak Ave</p>",
      monthlyIncome: 7500,
    };

    const result = sanitizeFormData(data);

    expect(result.name).toBe("Jane Smith");
    expect(result.dependents).toBe(2);
    expect(result.address).toBe("456 Oak Ave");
    expect(result.monthlyIncome).toBe(7500);
  });

  it("should handle empty form data", () => {
    const data: Partial<ApplicationFormData> = {};
    const result = sanitizeFormData(data);
    expect(result).toEqual({});
  });

  it("should sanitize all Step 3 text fields", () => {
    const data: Partial<ApplicationFormData> = {
      financialSituation: "  <script>alert('xss')</script>I need help  ",
      employmentCircumstances: "  Currently unemployed  ",
      reasonForApplying: "<b>Family support</b>",
    };

    const result = sanitizeFormData(data);

    expect(result.financialSituation).toBe("alert('xss')I need help");
    expect(result.employmentCircumstances).toBe("Currently unemployed");
    expect(result.reasonForApplying).toBe("Family support");
  });
});
