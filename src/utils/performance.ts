/**
 * Performance monitoring utility
 * Tracks execution time of synchronous and asynchronous operations
 */

interface PerformanceStats {
  avg: number;
  min: number;
  max: number;
  count: number;
}

export class PerformanceMonitor {
  private static measurements: Map<string, number[]> = new Map();

  /**
   * Measure execution time of a synchronous operation
   * @param name - Name of the operation being measured
   * @param fn - Function to measure
   * @returns Result of the function
   */
  static measure<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const duration = end - start;

    this.recordMeasurement(name, duration);

    return result;
  }

  /**
   * Measure execution time of an asynchronous operation
   * @param name - Name of the operation being measured
   * @param fn - Async function to measure
   * @returns Result of the async function
   */
  static async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    const duration = end - start;

    this.recordMeasurement(name, duration);

    return result;
  }

  /**
   * Record a measurement
   * @param name - Name of the operation
   * @param duration - Duration in milliseconds
   */
  private static recordMeasurement(name: string, duration: number): void {
    if (!this.measurements.has(name)) {
      this.measurements.set(name, []);
    }
    this.measurements.get(name)!.push(duration);

    // Log in development mode
    if (import.meta.env.DEV) {
      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
    }
  }

  /**
   * Get statistics for a specific operation
   * @param name - Name of the operation
   * @returns Statistics object or null if no measurements exist
   */
  static getStats(name: string): PerformanceStats | null {
    const measurements = this.measurements.get(name);
    if (!measurements || measurements.length === 0) {
      return null;
    }

    const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);

    return {
      avg: parseFloat(avg.toFixed(2)),
      min: parseFloat(min.toFixed(2)),
      max: parseFloat(max.toFixed(2)),
      count: measurements.length,
    };
  }

  /**
   * Log all performance statistics to console
   */
  static logAllStats(): void {
    if (this.measurements.size === 0) {
      console.log("No performance measurements recorded");
      return;
    }

    const stats = Array.from(this.measurements.keys()).map((name) => ({
      Operation: name,
      ...this.getStats(name),
    }));

    console.table(stats);
  }

  /**
   * Clear all measurements
   */
  static clear(): void {
    this.measurements.clear();
  }

  /**
   * Get all measurement names
   */
  static getMeasurementNames(): string[] {
    return Array.from(this.measurements.keys());
  }
}
