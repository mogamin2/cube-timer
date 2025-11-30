// Scramble Generator Module
export const scrambleGenerator = {
    moves: {
        '222': ['R', 'U', 'F'],
        '333': ['R', 'L', 'U', 'D', 'F', 'B'],
        '444': ['R', 'L', 'U', 'D', 'F', 'B', 'Rw', 'Lw', 'Uw', 'Dw', 'Fw', 'Bw'],
        '555': ['R', 'L', 'U', 'D', 'F', 'B', 'Rw', 'Lw', 'Uw', 'Dw', 'Fw', 'Bw']
    },
    modifiers: ['', "'", '2'],
    lengths: {
        '222': 9,
        '333': 20,
        '444': 40,
        '555': 60
    },

    getOpposite(move) {
        const opposites = {
            'R': 'L', 'L': 'R',
            'U': 'D', 'D': 'U',
            'F': 'B', 'B': 'F',
            'Rw': 'Lw', 'Lw': 'Rw',
            'Uw': 'Dw', 'Dw': 'Uw',
            'Fw': 'Bw', 'Bw': 'Fw'
        };
        return opposites[move] || null;
    },

    getAxis(move) {
        const baseMove = move.replace('w', '');
        if (['R', 'L', 'Rw', 'Lw'].includes(move)) return 'x';
        if (['U', 'D', 'Uw', 'Dw'].includes(move)) return 'y';
        if (['F', 'B', 'Fw', 'Bw'].includes(move)) return 'z';
        return null;
    },

    generate(puzzle) {
        const moves = this.moves[puzzle] || this.moves['333'];
        const length = this.lengths[puzzle] || 20;
        const scramble = [];
        let lastMove = null;
        let lastAxis = null;

        for (let i = 0; i < length; i++) {
            let move;
            let attempts = 0;

            do {
                move = moves[Math.floor(Math.random() * moves.length)];
                attempts++;
            } while (
                attempts < 20 && (
                    move === lastMove ||
                    (lastMove && this.getOpposite(move) === lastMove && this.getAxis(move) === lastAxis)
                )
            );

            const modifier = this.modifiers[Math.floor(Math.random() * this.modifiers.length)];
            scramble.push(move + modifier);
            lastMove = move;
            lastAxis = this.getAxis(move);
        }

        return scramble.join(' ');
    }
};
