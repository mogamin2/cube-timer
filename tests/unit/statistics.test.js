import { describe, it, expect } from 'vitest';
import { getEffectiveTime, calculateAverage } from '../../src/modules/statistics.js';

describe('statistics', () => {
    describe('getEffectiveTime', () => {
        it('should return time for clean solve', () => {
            expect(getEffectiveTime({ time: 10000, penalty: null })).toBe(10000);
        });

        it('should add 2000ms for +2 penalty', () => {
            expect(getEffectiveTime({ time: 10000, penalty: 'plus2' })).toBe(12000);
        });

        it('should return Infinity for DNF', () => {
            expect(getEffectiveTime({ time: 10000, penalty: 'dnf' })).toBe(Infinity);
        });
    });

    describe('calculateAverage - non-trimmed', () => {
        it('should calculate mean of clean times', () => {
            const times = [
                { time: 10000, penalty: null },
                { time: 12000, penalty: null },
                { time: 14000, penalty: null }
            ];
            expect(calculateAverage(times, false)).toBe(12000);
        });

        it('should include +2 penalties in calculation', () => {
            const times = [
                { time: 10000, penalty: null },
                { time: 10000, penalty: 'plus2' }, // → 12000
                { time: 10000, penalty: null }
            ];
            const result = calculateAverage(times, false);
            expect(result).toBeCloseTo(10666.67, 1);
        });

        it('should return Infinity if any DNF present', () => {
            const times = [
                { time: 10000, penalty: null },
                { time: 12000, penalty: 'dnf' },
                { time: 14000, penalty: null }
            ];
            expect(calculateAverage(times, false)).toBe(Infinity);
        });

        it('should return null for empty array', () => {
            expect(calculateAverage([], false)).toBeNull();
        });
    });

    describe('calculateAverage - trimmed (ao5/ao12)', () => {
        it('should trim best and worst from ao5', () => {
            const times = [
                { time: 10000, penalty: null }, // best - trimmed
                { time: 12000, penalty: null },
                { time: 13000, penalty: null },
                { time: 14000, penalty: null },
                { time: 20000, penalty: null }  // worst - trimmed
            ];
            // Average of 12, 13, 14 = 13000
            expect(calculateAverage(times, true)).toBe(13000);
        });

        it('should handle single DNF in ao5 (trim it)', () => {
            const times = [
                { time: 10000, penalty: null },
                { time: 12000, penalty: null },
                { time: 13000, penalty: null },
                { time: 14000, penalty: null },
                { time: 20000, penalty: 'dnf' } // worst - trimmed
            ];
            // After sorting: 10000, 12000, 13000, 14000, Infinity
            // Trim best (10000) and worst (Infinity)
            // Average of 12000, 13000, 14000 = 13000
            const result = calculateAverage(times, true);
            expect(result).toBe(13000);
        });

        it('should return DNF for 2+ DNFs in ao5', () => {
            const times = [
                { time: 10000, penalty: 'dnf' },
                { time: 12000, penalty: null },
                { time: 13000, penalty: null },
                { time: 14000, penalty: null },
                { time: 20000, penalty: 'dnf' }
            ];
            expect(calculateAverage(times, true)).toBe(Infinity);
        });

        it('should handle +2 penalties in trimmed average', () => {
            const times = [
                { time: 10000, penalty: null },
                { time: 11000, penalty: 'plus2' }, // → 13000
                { time: 12000, penalty: null },
                { time: 13000, penalty: null },
                { time: 14000, penalty: null }
            ];
            // Trims 10000 (best) and 14000 (worst)
            // Average of 13000, 12000, 13000 = 12666.67
            const result = calculateAverage(times, true);
            expect(result).toBeCloseTo(12666.67, 1);
        });

        it('should handle ao12 correctly', () => {
            const times = Array(12).fill(null).map((_, i) => ({
                time: 10000 + (i * 1000),
                penalty: null
            }));
            // Times: 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
            // Trim 1 best (10) and 1 worst (21)
            // Average of 11-20 = 15500
            const result = calculateAverage(times, true);
            expect(result).toBe(15500);
        });
    });
});
