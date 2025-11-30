// Statistics Module
export function getEffectiveTime(solve) {
    if (solve.penalty === 'dnf') return Infinity;
    if (solve.penalty === 'plus2') return solve.time + 2000;
    return solve.time;
}

export function calculateAverage(times, trimmed = false) {
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
