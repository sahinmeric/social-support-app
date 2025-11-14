import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  FormSkeleton,
  ModalSkeleton,
  ProgressSkeleton,
} from "./SkeletonLoader";

describe("SkeletonLoader Components", () => {
  describe("FormSkeleton", () => {
    it("renders 5 skeleton fields", () => {
      const { container } = render(<FormSkeleton />);

      // Should have 5 field skeletons (each with label and input)
      const rectangularSkeletons = container.querySelectorAll(
        ".MuiSkeleton-rectangular"
      );
      expect(rectangularSkeletons).toHaveLength(5);
    });

    it("renders text skeletons for labels", () => {
      const { container } = render(<FormSkeleton />);

      // Should have 5 text skeletons for labels
      const textSkeletons = container.querySelectorAll(".MuiSkeleton-text");
      expect(textSkeletons).toHaveLength(5);
    });

    it("renders with proper spacing", () => {
      const { container } = render(<FormSkeleton />);

      // Check that Stack component is rendered
      const stack = container.querySelector(".MuiStack-root");
      expect(stack).toBeInTheDocument();
    });
  });

  describe("ModalSkeleton", () => {
    it("renders skeleton for modal content", () => {
      const { container } = render(<ModalSkeleton />);

      // Should have title skeleton (text)
      const textSkeletons = container.querySelectorAll(".MuiSkeleton-text");
      expect(textSkeletons.length).toBeGreaterThan(0);

      // Should have content skeleton (rectangular)
      const rectangularSkeletons = container.querySelectorAll(
        ".MuiSkeleton-rectangular"
      );
      expect(rectangularSkeletons.length).toBeGreaterThan(0);
    });

    it("renders skeleton for modal buttons", () => {
      const { container } = render(<ModalSkeleton />);

      // Should have button skeletons
      const rectangularSkeletons = container.querySelectorAll(
        ".MuiSkeleton-rectangular"
      );
      // 1 for content + 2 for buttons = 3 total
      expect(rectangularSkeletons).toHaveLength(3);
    });

    it("renders with proper layout", () => {
      const { container } = render(<ModalSkeleton />);

      // Check that Box component is rendered
      const box = container.querySelector(".MuiBox-root");
      expect(box).toBeInTheDocument();
    });
  });

  describe("ProgressSkeleton", () => {
    it("renders skeleton for progress bar", () => {
      const { container } = render(<ProgressSkeleton />);

      // Should have progress bar skeleton (rectangular)
      const rectangularSkeletons = container.querySelectorAll(
        ".MuiSkeleton-rectangular"
      );
      expect(rectangularSkeletons).toHaveLength(1);
    });

    it("renders 3 circular skeletons for step indicators", () => {
      const { container } = render(<ProgressSkeleton />);

      // Should have 3 circular skeletons for steps
      const circularSkeletons = container.querySelectorAll(
        ".MuiSkeleton-circular"
      );
      expect(circularSkeletons).toHaveLength(3);
    });

    it("renders with proper layout", () => {
      const { container } = render(<ProgressSkeleton />);

      // Check that Box component is rendered
      const box = container.querySelector(".MuiBox-root");
      expect(box).toBeInTheDocument();
    });
  });
});
