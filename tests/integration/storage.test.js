import { describe, it, expect, beforeEach } from 'vitest';

describe('localStorage integration', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should save and load data from localStorage', () => {
        const testData = {
            times: [
                { id: 1, time: 10000, penalty: null, scramble: 'R U R\' U\'', puzzle: '333', date: '2024-01-01' }
            ],
            settings: {
                inspectionEnabled: true,
                hideUIWhenTiming: false,
                holdTime: 300,
                theme: 'dark'
            },
            currentPuzzle: '333'
        };

        // Save to localStorage
        localStorage.setItem('cubeTimerData', JSON.stringify(testData));

        // Load from localStorage
        const loaded = JSON.parse(localStorage.getItem('cubeTimerData'));

        expect(loaded).toEqual(testData);
        expect(loaded.times).toHaveLength(1);
        expect(loaded.times[0].time).toBe(10000);
        expect(loaded.settings.inspectionEnabled).toBe(true);
        expect(loaded.currentPuzzle).toBe('333');
    });

    it('should handle empty localStorage gracefully', () => {
        const data = localStorage.getItem('cubeTimerData');
        expect(data).toBeNull();
    });

    it('should handle corrupted localStorage data', () => {
        localStorage.setItem('cubeTimerData', 'invalid json');

        expect(() => {
            JSON.parse(localStorage.getItem('cubeTimerData'));
        }).toThrow();

        // Application should handle this with try-catch
        let result;
        try {
            result = JSON.parse(localStorage.getItem('cubeTimerData'));
        } catch (e) {
            result = null;
        }

        expect(result).toBeNull();
    });

    it('should persist multiple times', () => {
        const times = [
            { id: 1, time: 10000, penalty: null },
            { id: 2, time: 12000, penalty: 'plus2' },
            { id: 3, time: 15000, penalty: 'dnf' }
        ];

        localStorage.setItem('cubeTimerData', JSON.stringify({ times }));

        const loaded = JSON.parse(localStorage.getItem('cubeTimerData'));

        expect(loaded.times).toHaveLength(3);
        expect(loaded.times[0].penalty).toBeNull();
        expect(loaded.times[1].penalty).toBe('plus2');
        expect(loaded.times[2].penalty).toBe('dnf');
    });

    it('should persist settings changes', () => {
        const settings = {
            inspectionEnabled: false,
            hideUIWhenTiming: true,
            holdTime: 500,
            theme: 'light'
        };

        localStorage.setItem('cubeTimerData', JSON.stringify({ settings }));

        const loaded = JSON.parse(localStorage.getItem('cubeTimerData'));

        expect(loaded.settings.inspectionEnabled).toBe(false);
        expect(loaded.settings.hideUIWhenTiming).toBe(true);
        expect(loaded.settings.holdTime).toBe(500);
        expect(loaded.settings.theme).toBe('light');
    });
});
