// Cube Timer Application
(function() {
    'use strict';

    // ============================================
    // State
    // ============================================
    const state = {
        times: [],
        currentPuzzle: '333',
        settings: {
            inspectionEnabled: true,
            hideUIWhenTiming: false,
            holdTime: 300,
            theme: 'dark'
        },
        timer: {
            state: 'idle', // idle, holding, ready, inspection, running
            startTime: null,
            elapsed: 0,
            holdStartTime: null,
            inspectionStartTime: null,
            animationFrame: null
        }
    };

    // ============================================
    // DOM Elements
    // ============================================
    const elements = {
        app: document.getElementById('app'),
        timerDisplay: document.getElementById('timerDisplay'),
        timerTime: document.getElementById('timerTime'),
        timerHint: document.getElementById('timerHint'),
        stateIndicator: document.getElementById('stateIndicator'),
        inspectionIndicator: document.getElementById('inspectionIndicator'),
        inspectionTime: document.getElementById('inspectionTime'),
        scramble: document.getElementById('scramble'),
        newScrambleBtn: document.getElementById('newScrambleBtn'),
        puzzleType: document.getElementById('puzzleType'),
        timesList: document.getElementById('timesList'),
        clearSessionBtn: document.getElementById('clearSessionBtn'),
        settingsBtn: document.getElementById('settingsBtn'),
        settingsModal: document.getElementById('settingsModal'),
        modalBackdrop: document.getElementById('modalBackdrop'),
        closeSettingsBtn: document.getElementById('closeSettingsBtn'),
        inspectionEnabled: document.getElementById('inspectionEnabled'),
        hideUIWhenTiming: document.getElementById('hideUIWhenTiming'),
        holdTime: document.getElementById('holdTime'),
        themeSelect: document.getElementById('themeSelect'),
        statBest: document.getElementById('statBest'),
        statAo5: document.getElementById('statAo5'),
        statAo12: document.getElementById('statAo12'),
        statAvg: document.getElementById('statAvg'),
        statCount: document.getElementById('statCount')
    };

    // ============================================
    // Scramble Generator
    // ============================================
    const scrambleGenerator = {
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

    // ============================================
    // Timer Functions
    // ============================================
    function formatTime(ms, showMillis = true) {
        if (ms === Infinity || ms === -Infinity || isNaN(ms)) return 'DNF';

        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const centiseconds = Math.floor((ms % 1000) / 10);

        if (minutes > 0) {
            return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
        }
        return `${seconds}.${centiseconds.toString().padStart(2, '0')}`;
    }

    function updateTimerDisplay(time) {
        elements.timerTime.textContent = formatTime(time);
    }

    function setTimerState(newState) {
        state.timer.state = newState;
        elements.timerDisplay.className = 'timer-display ' + newState;

        switch (newState) {
            case 'idle':
                elements.timerHint.textContent = 'スペースキーを長押しして開始';
                elements.inspectionIndicator.classList.remove('active');
                break;
            case 'holding':
                elements.timerHint.textContent = 'ホールド中...';
                break;
            case 'ready':
                elements.timerHint.textContent = '離すと開始';
                break;
            case 'inspection':
                elements.timerHint.textContent = 'インスペクション中';
                elements.inspectionIndicator.classList.add('active');
                break;
            case 'running':
                elements.timerHint.textContent = '';
                elements.inspectionIndicator.classList.remove('active');
                if (state.settings.hideUIWhenTiming) {
                    elements.app.classList.add('timing-mode');
                }
                break;
        }
    }

    function startHolding() {
        if (state.timer.state === 'running') {
            stopTimer();
            return;
        }

        if (state.timer.state !== 'idle' && state.timer.state !== 'inspection') return;

        const wasInspecting = state.timer.state === 'inspection';
        state.timer.holdStartTime = performance.now();

        if (wasInspecting) {
            setTimerState('holding');
            updateTimerDisplay(0);
        } else {
            setTimerState('holding');
            updateTimerDisplay(0);
        }

        checkHoldComplete(wasInspecting);
    }

    function checkHoldComplete(wasInspecting) {
        if (state.timer.state !== 'holding') return;

        const holdDuration = performance.now() - state.timer.holdStartTime;

        if (holdDuration >= state.settings.holdTime) {
            setTimerState('ready');
        } else {
            requestAnimationFrame(() => checkHoldComplete(wasInspecting));
        }
    }

    function releaseHold() {
        if (state.timer.state === 'holding') {
            setTimerState('idle');
            updateTimerDisplay(0);
            return;
        }

        if (state.timer.state === 'ready') {
            if (state.settings.inspectionEnabled && state.timer.inspectionStartTime === null) {
                startInspection();
            } else {
                startTimer();
            }
        }
    }

    function startInspection() {
        state.timer.inspectionStartTime = performance.now();
        setTimerState('inspection');
        updateInspection();
    }

    function updateInspection() {
        if (state.timer.state !== 'inspection') return;

        const elapsed = (performance.now() - state.timer.inspectionStartTime) / 1000;
        const remaining = Math.ceil(15 - elapsed);

        if (remaining <= 0) {
            elements.inspectionTime.textContent = '+2';
            if (remaining <= -2) {
                elements.inspectionTime.textContent = 'DNF';
            }
        } else {
            elements.inspectionTime.textContent = remaining;
        }

        state.timer.animationFrame = requestAnimationFrame(updateInspection);
    }

    function startTimer() {
        let penalty = null;

        if (state.timer.inspectionStartTime !== null) {
            const inspectionElapsed = (performance.now() - state.timer.inspectionStartTime) / 1000;
            if (inspectionElapsed > 17) {
                penalty = 'dnf';
            } else if (inspectionElapsed > 15) {
                penalty = 'plus2';
            }
        }

        state.timer.startTime = performance.now();
        state.timer.inspectionStartTime = null;
        state.timer.penalty = penalty;

        if (state.timer.animationFrame) {
            cancelAnimationFrame(state.timer.animationFrame);
        }

        setTimerState('running');
        updateRunningTimer();
    }

    function updateRunningTimer() {
        if (state.timer.state !== 'running') return;

        state.timer.elapsed = performance.now() - state.timer.startTime;
        updateTimerDisplay(state.timer.elapsed);
        state.timer.animationFrame = requestAnimationFrame(updateRunningTimer);
    }

    function stopTimer() {
        if (state.timer.state !== 'running') return;

        if (state.timer.animationFrame) {
            cancelAnimationFrame(state.timer.animationFrame);
        }

        const finalTime = performance.now() - state.timer.startTime;

        elements.app.classList.remove('timing-mode');
        setTimerState('idle');
        updateTimerDisplay(finalTime);

        // Save the solve
        const solve = {
            id: Date.now(),
            time: finalTime,
            penalty: state.timer.penalty || null,
            scramble: elements.scramble.textContent,
            puzzle: state.currentPuzzle,
            date: new Date().toISOString()
        };

        state.times.unshift(solve);
        saveData();
        updateStats();
        renderTimesList();
        generateNewScramble();
    }

    // ============================================
    // Statistics
    // ============================================
    function getEffectiveTime(solve) {
        if (solve.penalty === 'dnf') return Infinity;
        if (solve.penalty === 'plus2') return solve.time + 2000;
        return solve.time;
    }

    function calculateAverage(times, trimmed = false) {
        if (times.length === 0) return null;

        const effectiveTimes = times.map(getEffectiveTime);

        // Check for DNF
        const dnfCount = effectiveTimes.filter(t => t === Infinity).length;

        if (trimmed && times.length >= 3) {
            // For ao5, ao12 etc., remove best and worst
            if (dnfCount > 1) return Infinity; // More than one DNF in trimmed average = DNF

            const sorted = [...effectiveTimes].sort((a, b) => a - b);
            const trimCount = Math.ceil(times.length * 0.05) || 1;
            const trimmedTimes = sorted.slice(trimCount, -trimCount);

            if (trimmedTimes.some(t => t === Infinity)) return Infinity;

            return trimmedTimes.reduce((a, b) => a + b, 0) / trimmedTimes.length;
        } else {
            if (dnfCount > 0) return Infinity;
            return effectiveTimes.reduce((a, b) => a + b, 0) / effectiveTimes.length;
        }
    }

    function updateStats() {
        const times = state.times;

        // Best
        if (times.length > 0) {
            const validTimes = times.filter(t => t.penalty !== 'dnf');
            if (validTimes.length > 0) {
                const best = Math.min(...validTimes.map(getEffectiveTime));
                elements.statBest.textContent = formatTime(best);
            } else {
                elements.statBest.textContent = 'DNF';
            }
        } else {
            elements.statBest.textContent = '-';
        }

        // ao5
        if (times.length >= 5) {
            const ao5 = calculateAverage(times.slice(0, 5), true);
            elements.statAo5.textContent = ao5 === Infinity ? 'DNF' : formatTime(ao5);
        } else {
            elements.statAo5.textContent = '-';
        }

        // ao12
        if (times.length >= 12) {
            const ao12 = calculateAverage(times.slice(0, 12), true);
            elements.statAo12.textContent = ao12 === Infinity ? 'DNF' : formatTime(ao12);
        } else {
            elements.statAo12.textContent = '-';
        }

        // Mean
        if (times.length > 0) {
            const mean = calculateAverage(times, false);
            elements.statAvg.textContent = mean === Infinity ? 'DNF' : formatTime(mean);
        } else {
            elements.statAvg.textContent = '-';
        }

        // Count
        elements.statCount.textContent = times.length;
    }

    // ============================================
    // Times List
    // ============================================
    function renderTimesList() {
        if (state.times.length === 0) {
            elements.timesList.innerHTML = '<p class="no-times">まだタイムがありません</p>';
            return;
        }

        const html = state.times.map((solve, index) => {
            const effectiveTime = getEffectiveTime(solve);
            const displayTime = formatTime(solve.time);
            const penaltyClass = solve.penalty === 'dnf' ? 'dnf' : (solve.penalty === 'plus2' ? 'plus2' : '');
            const penaltyText = solve.penalty === 'plus2' ? '+2' : '';

            return `
                <div class="time-item" data-id="${solve.id}">
                    <span class="time-index">${state.times.length - index}.</span>
                    <span class="time-value ${penaltyClass}">
                        ${solve.penalty === 'dnf' ? 'DNF' : displayTime}
                        ${penaltyText ? `<span class="time-penalty">${penaltyText}</span>` : ''}
                    </span>
                    <div class="time-actions">
                        <button class="time-action-btn ${solve.penalty === 'plus2' ? 'active' : ''}"
                                data-action="plus2" title="+2ペナルティ">+2</button>
                        <button class="time-action-btn ${solve.penalty === 'dnf' ? 'active' : ''}"
                                data-action="dnf" title="DNF">DNF</button>
                        <button class="time-action-btn delete" data-action="delete" title="削除">✕</button>
                    </div>
                </div>
            `;
        }).join('');

        elements.timesList.innerHTML = html;
    }

    function handleTimeAction(solveId, action) {
        const solve = state.times.find(t => t.id === solveId);
        if (!solve) return;

        if (action === 'delete') {
            state.times = state.times.filter(t => t.id !== solveId);
        } else if (action === 'plus2') {
            solve.penalty = solve.penalty === 'plus2' ? null : 'plus2';
        } else if (action === 'dnf') {
            solve.penalty = solve.penalty === 'dnf' ? null : 'dnf';
        }

        saveData();
        updateStats();
        renderTimesList();
    }

    // ============================================
    // Scramble
    // ============================================
    function generateNewScramble() {
        const scramble = scrambleGenerator.generate(state.currentPuzzle);
        elements.scramble.textContent = scramble;
    }

    // ============================================
    // Settings
    // ============================================
    function openSettings() {
        elements.settingsModal.classList.add('active');
    }

    function closeSettings() {
        elements.settingsModal.classList.remove('active');
    }

    function applySettings() {
        state.settings.inspectionEnabled = elements.inspectionEnabled.checked;
        state.settings.hideUIWhenTiming = elements.hideUIWhenTiming.checked;
        state.settings.holdTime = parseInt(elements.holdTime.value, 10);
        state.settings.theme = elements.themeSelect.value;

        document.documentElement.setAttribute('data-theme', state.settings.theme);
        saveData();
    }

    function loadSettingsToUI() {
        elements.inspectionEnabled.checked = state.settings.inspectionEnabled;
        elements.hideUIWhenTiming.checked = state.settings.hideUIWhenTiming;
        elements.holdTime.value = state.settings.holdTime;
        elements.themeSelect.value = state.settings.theme;
        document.documentElement.setAttribute('data-theme', state.settings.theme);
    }

    // ============================================
    // Storage
    // ============================================
    function saveData() {
        const data = {
            times: state.times,
            settings: state.settings,
            currentPuzzle: state.currentPuzzle
        };
        localStorage.setItem('cubeTimerData', JSON.stringify(data));
    }

    function loadData() {
        try {
            const data = JSON.parse(localStorage.getItem('cubeTimerData'));
            if (data) {
                state.times = data.times || [];
                state.settings = { ...state.settings, ...data.settings };
                state.currentPuzzle = data.currentPuzzle || '333';
            }
        } catch (e) {
            console.error('Failed to load data:', e);
        }
    }

    // ============================================
    // Event Handlers
    // ============================================
    function handleKeyDown(e) {
        // Ignore if modal is open or in input field
        if (elements.settingsModal.classList.contains('active')) return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

        if (e.code === 'Space') {
            e.preventDefault();
            if (!e.repeat) {
                startHolding();
            }
        } else if (e.code === 'Escape') {
            if (state.timer.state === 'running') {
                // Cancel solve
                if (state.timer.animationFrame) {
                    cancelAnimationFrame(state.timer.animationFrame);
                }
                elements.app.classList.remove('timing-mode');
                setTimerState('idle');
                updateTimerDisplay(0);
            } else if (state.timer.state === 'inspection') {
                if (state.timer.animationFrame) {
                    cancelAnimationFrame(state.timer.animationFrame);
                }
                state.timer.inspectionStartTime = null;
                setTimerState('idle');
                updateTimerDisplay(0);
            }
        }
    }

    function handleKeyUp(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            releaseHold();
        }
    }

    function handleTouchStart(e) {
        if (elements.settingsModal.classList.contains('active')) return;
        if (e.target.closest('.times-section') ||
            e.target.closest('.header') ||
            e.target.closest('.scramble-section') ||
            e.target.closest('.stats-section')) return;

        e.preventDefault();
        startHolding();
    }

    function handleTouchEnd(e) {
        if (state.timer.state === 'holding' || state.timer.state === 'ready') {
            e.preventDefault();
            releaseHold();
        } else if (state.timer.state === 'running') {
            e.preventDefault();
            stopTimer();
        }
    }

    function handleTimesListClick(e) {
        const actionBtn = e.target.closest('.time-action-btn');
        if (!actionBtn) return;

        const timeItem = actionBtn.closest('.time-item');
        const solveId = parseInt(timeItem.dataset.id, 10);
        const action = actionBtn.dataset.action;

        handleTimeAction(solveId, action);
    }

    // ============================================
    // Initialization
    // ============================================
    function init() {
        // Load saved data
        loadData();

        // Apply settings to UI
        loadSettingsToUI();

        // Set initial puzzle
        elements.puzzleType.value = state.currentPuzzle;

        // Generate initial scramble
        generateNewScramble();

        // Update stats and times list
        updateStats();
        renderTimesList();

        // Event listeners - keyboard
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        // Event listeners - touch
        document.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: false });

        // Event listeners - UI controls
        elements.newScrambleBtn.addEventListener('click', generateNewScramble);

        elements.puzzleType.addEventListener('change', (e) => {
            state.currentPuzzle = e.target.value;
            generateNewScramble();
            saveData();
        });

        elements.clearSessionBtn.addEventListener('click', () => {
            if (confirm('セッションをクリアしますか？全てのタイムが削除されます。')) {
                state.times = [];
                saveData();
                updateStats();
                renderTimesList();
            }
        });

        // Event listeners - settings
        elements.settingsBtn.addEventListener('click', openSettings);
        elements.closeSettingsBtn.addEventListener('click', closeSettings);
        elements.modalBackdrop.addEventListener('click', closeSettings);

        elements.inspectionEnabled.addEventListener('change', applySettings);
        elements.hideUIWhenTiming.addEventListener('change', applySettings);
        elements.holdTime.addEventListener('change', applySettings);
        elements.themeSelect.addEventListener('change', applySettings);

        // Event listeners - times list
        elements.timesList.addEventListener('click', handleTimesListClick);

        // Prevent context menu on long press (mobile)
        document.addEventListener('contextmenu', (e) => {
            if (state.timer.state !== 'idle') {
                e.preventDefault();
            }
        });

        console.log('Cube Timer initialized');
    }

    // Start the app
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
