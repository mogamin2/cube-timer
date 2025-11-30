import { describe, it, expect } from 'vitest';
import { scrambleGenerator } from '../../src/modules/scrambleGenerator.js';

describe('scrambleGenerator', () => {
    describe('generate()', () => {
        it('should generate scramble with correct length for 2x2', () => {
            const scramble = scrambleGenerator.generate('222');
            const moves = scramble.split(' ');
            expect(moves).toHaveLength(9);
        });

        it('should generate scramble with correct length for 3x3', () => {
            const scramble = scrambleGenerator.generate('333');
            const moves = scramble.split(' ');
            expect(moves).toHaveLength(20);
        });

        it('should generate scramble with correct length for 4x4', () => {
            const scramble = scrambleGenerator.generate('444');
            const moves = scramble.split(' ');
            expect(moves).toHaveLength(40);
        });

        it('should generate scramble with correct length for 5x5', () => {
            const scramble = scrambleGenerator.generate('555');
            const moves = scramble.split(' ');
            expect(moves).toHaveLength(60);
        });

        it('should not repeat same move consecutively', () => {
            for (let i = 0; i < 20; i++) {
                const scramble = scrambleGenerator.generate('333');
                const moves = scramble.split(' ');

                for (let j = 1; j < moves.length; j++) {
                    const prevMove = moves[j - 1].replace(/['2]/g, '');
                    const currMove = moves[j].replace(/['2]/g, '');
                    expect(prevMove).not.toBe(currMove);
                }
            }
        });

        it('should only use valid moves for 2x2', () => {
            const scramble = scrambleGenerator.generate('222');
            const moves = scramble.split(' ').map(m => m.replace(/['2]/g, ''));
            const validMoves = ['R', 'U', 'F'];

            moves.forEach(move => {
                expect(validMoves).toContain(move);
            });
        });

        it('should return string format', () => {
            const scramble = scrambleGenerator.generate('333');
            expect(typeof scramble).toBe('string');
            expect(scramble).toMatch(/^[RLUDFB]['2]?( [RLUDFB]['2]?)*$/);
        });
    });

    describe('getOpposite()', () => {
        const opposites = [
            ['R', 'L'], ['U', 'D'], ['F', 'B'],
            ['Rw', 'Lw'], ['Uw', 'Dw'], ['Fw', 'Bw']
        ];

        opposites.forEach(([move1, move2]) => {
            it(`should return ${move2} for ${move1}`, () => {
                expect(scrambleGenerator.getOpposite(move1)).toBe(move2);
                expect(scrambleGenerator.getOpposite(move2)).toBe(move1);
            });
        });
    });

    describe('getAxis()', () => {
        it('should return x axis for R and L moves', () => {
            expect(scrambleGenerator.getAxis('R')).toBe('x');
            expect(scrambleGenerator.getAxis('L')).toBe('x');
            expect(scrambleGenerator.getAxis('Rw')).toBe('x');
            expect(scrambleGenerator.getAxis('Lw')).toBe('x');
        });

        it('should return y axis for U and D moves', () => {
            expect(scrambleGenerator.getAxis('U')).toBe('y');
            expect(scrambleGenerator.getAxis('D')).toBe('y');
            expect(scrambleGenerator.getAxis('Uw')).toBe('y');
            expect(scrambleGenerator.getAxis('Dw')).toBe('y');
        });

        it('should return z axis for F and B moves', () => {
            expect(scrambleGenerator.getAxis('F')).toBe('z');
            expect(scrambleGenerator.getAxis('B')).toBe('z');
            expect(scrambleGenerator.getAxis('Fw')).toBe('z');
            expect(scrambleGenerator.getAxis('Bw')).toBe('z');
        });
    });
});
