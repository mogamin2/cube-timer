import { describe, it, expect } from 'vitest';
import { formatTime } from '../../src/modules/timeFormatter.js';

describe('formatTime', () => {
    it('should format milliseconds correctly', () => {
        expect(formatTime(1234)).toBe('1.23');
        expect(formatTime(5678)).toBe('5.67');
        expect(formatTime(9999)).toBe('9.99');
    });

    it('should format seconds correctly', () => {
        expect(formatTime(10000)).toBe('10.00');
        expect(formatTime(59999)).toBe('59.99');
    });

    it('should format minutes correctly', () => {
        expect(formatTime(60000)).toBe('1:00.00');
        expect(formatTime(125340)).toBe('2:05.34');
        expect(formatTime(659999)).toBe('10:59.99');
    });

    it('should pad seconds and centiseconds', () => {
        expect(formatTime(61000)).toBe('1:01.00');
        expect(formatTime(60050)).toBe('1:00.05');
        expect(formatTime(60001)).toBe('1:00.00');
    });

    it('should handle DNF (Infinity)', () => {
        expect(formatTime(Infinity)).toBe('DNF');
        expect(formatTime(-Infinity)).toBe('DNF');
    });

    it('should handle NaN', () => {
        expect(formatTime(NaN)).toBe('DNF');
    });

    it('should handle zero', () => {
        expect(formatTime(0)).toBe('0.00');
    });

    it('should round centiseconds correctly', () => {
        expect(formatTime(1239)).toBe('1.23');
        expect(formatTime(1235)).toBe('1.23');
        expect(formatTime(1245)).toBe('1.24');
    });

    it('should handle very large times', () => {
        const tenMinutes = 600000;
        expect(formatTime(tenMinutes)).toBe('10:00.00');
        const oneHour = 3600000;
        expect(formatTime(oneHour)).toBe('60:00.00');
    });
});
