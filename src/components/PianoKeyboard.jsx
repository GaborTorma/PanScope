import { getNoteNames, getNoteMatch } from '../utils/noteUtils';

/**
 * Interaktív zongora vizualizáció — kiemeli a skálák hangjait, frekvenciával
 */
export default function PianoKeyboard({
    viewMode = 'merged',
    selectedScale, compareScale,
    baseFrequency, activeNotes, playNote
}) {
    const keys = [];
    const startMidi = 43; // G2
    const endMidi = 83;   // B5

    for (let midi = startMidi; midi <= endMidi; midi++) {
        const noteClass = midi % 12;
        const isBlack = [1, 3, 6, 8, 10].includes(noteClass);

        const freq = baseFrequency * Math.pow(2, (midi - 69) / 12);
        const freqStr = (Math.round(freq * 10) / 10).toFixed(1);

        if (!isBlack) {
            const defaultName = `${getNoteNames(noteClass)[0]}${Math.floor(midi / 12) - 1}`;
            const match = getNoteMatch(midi, selectedScale, compareScale);
            const isWhitePressed = activeNotes[midi];

            const hasNextBlack = [0, 2, 5, 7, 9].includes(noteClass);
            const nextMidi = midi + 1;
            let blackMatch = null, blackDefaultName = '', isBlackPressed = false, nextFreqStr = '';

            if (hasNextBlack && nextMidi <= endMidi) {
                blackMatch = getNoteMatch(nextMidi, selectedScale, compareScale);
                blackDefaultName = `${getNoteNames(nextMidi % 12)[0]}${Math.floor(nextMidi / 12) - 1}`;
                isBlackPressed = activeNotes[nextMidi];
                const nextFreq = baseFrequency * Math.pow(2, (nextMidi - 69) / 12);
                nextFreqStr = (Math.round(nextFreq * 10) / 10).toFixed(1);
            }

            // Fehér billentyű szín és adatok meghatározása
            const whiteKey = resolveKeyDisplay(match, viewMode, defaultName);
            // Fekete billentyű szín és adatok meghatározása
            const blackKey = blackMatch ? resolveKeyDisplay(blackMatch, viewMode, blackDefaultName, true) : null;

            keys.push(
                <div key={`white-${midi}`} className="relative group select-none">
                    <div
                        onPointerDown={(e) => { e.preventDefault(); playNote(midi); }}
                        className={`w-10 sm:w-14 h-48 sm:h-60 border-2 border-slate-800 rounded-b-md flex flex-col justify-end items-center pb-2 transition-all duration-100 cursor-pointer shadow-sm
              ${isWhitePressed ? 'translate-y-1 brightness-95' : ''} ${whiteKey.bgClass}`}
                    >
                        <span className="absolute top-[125px] sm:top-[160px] left-0 w-full text-center text-[9px] sm:text-[10px] tracking-tighter text-slate-400 font-medium pointer-events-none">
                            {freqStr}
                        </span>
                        {whiteKey.displayIndex !== null && (
                            <span className="text-[10px] sm:text-xs leading-none mb-1 px-1.5 py-0.5 rounded bg-black/10 font-bold pointer-events-none text-slate-800 z-10">
                                {whiteKey.displayIndex}
                            </span>
                        )}
                        <span className={`text-sm pointer-events-none z-10 ${whiteKey.isActive ? 'font-bold text-slate-900' : 'text-slate-400'}`}>
                            {whiteKey.displayName}
                        </span>
                    </div>

                    {hasNextBlack && nextMidi <= endMidi && blackKey && (
                        <div
                            onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); playNote(nextMidi); }}
                            className={`absolute top-0 -right-3.5 sm:-right-5 w-7 sm:w-10 h-28 sm:h-36 border-2 border-slate-800 rounded-b-md flex flex-col justify-end items-center pb-2 z-20 transition-all duration-100 cursor-pointer
                ${isBlackPressed ? 'translate-y-1 brightness-90' : ''} ${blackKey.bgClass}`}
                        >
                            <span className="absolute top-2 left-0 w-full text-center text-[8px] sm:text-[9px] tracking-tighter text-white/70 font-bold pointer-events-none">{nextFreqStr}</span>
                            {blackKey.displayIndex !== null && (
                                <span className="text-[9px] sm:text-[10px] leading-none mb-1 px-1 py-0.5 rounded bg-white/20 font-bold pointer-events-none text-white z-10 mt-auto">
                                    {blackKey.displayIndex}
                                </span>
                            )}
                            <span className={`text-xs pointer-events-none z-10 ${blackKey.isActive ? 'font-bold text-white' : 'text-slate-500'} ${blackKey.displayIndex === null ? 'mt-auto' : ''}`}>
                                {blackKey.displayName}
                            </span>
                        </div>
                    )}
                </div>
            );
        }
    }

    return <>{keys}</>;
}

/**
 * Segédfüggvény: billentyű szín/név/index meghatározása a nézet mód alapján
 */
function resolveKeyDisplay(match, viewMode, defaultName, isBlack = false) {
    let bgClass, displayName = defaultName, isActive = false, displayIndex = null;

    // Alapértelmezett színek
    if (isBlack) {
        bgClass = 'bg-slate-900 hover:bg-slate-800';
    } else {
        bgClass = 'bg-white hover:bg-slate-100';
    }

    const dingWhite = 'bg-amber-300 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]';
    const dingBlack = 'bg-amber-500';
    const dingWhite2 = 'bg-orange-300 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]';
    const dingBlack2 = 'bg-orange-500';
    const bothDingW = 'bg-gradient-to-r from-amber-400 to-orange-400';
    const bothDingB = 'bg-gradient-to-r from-amber-500 to-orange-500';
    const toneWhite = 'bg-teal-200 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]';
    const toneBlack = 'bg-teal-500';
    const toneWhite2 = 'bg-purple-300 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]';
    const toneBlack2 = 'bg-purple-500';
    const bothToneW = 'bg-indigo-300 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]';
    const bothToneB = 'bg-indigo-500';

    if (viewMode === 'merged') {
        if (match.primary.isDing && match.secondary.isDing) bgClass = isBlack ? bothDingB : bothDingW;
        else if (match.primary.isDing) bgClass = isBlack ? dingBlack : dingWhite;
        else if (match.secondary.isDing) bgClass = isBlack ? dingBlack2 : dingWhite2;
        else if (match.primary.isTone && match.secondary.isTone) bgClass = isBlack ? bothToneB : bothToneW;
        else if (match.primary.isTone) bgClass = isBlack ? toneBlack : toneWhite;
        else if (match.secondary.isTone) bgClass = isBlack ? toneBlack2 : toneWhite2;

        isActive = match.primary.isActive || match.secondary.isActive;
        if (match.primary.isActive) displayName = match.primary.matchedName;
        else if (match.secondary.isActive) displayName = match.secondary.matchedName;

        if (match.primary.isActive && match.secondary.isActive) {
            displayIndex = match.primary.index === match.secondary.index ? match.primary.index : `${match.primary.index}${isBlack ? '|' : ' | '}${match.secondary.index}`;
        } else if (match.primary.isActive) displayIndex = match.primary.index;
        else if (match.secondary.isActive) displayIndex = match.secondary.index;

    } else if (viewMode === 'primary') {
        if (match.primary.isDing) bgClass = isBlack ? dingBlack : dingWhite;
        else if (match.primary.isTone) bgClass = isBlack ? toneBlack : toneWhite;
        isActive = match.primary.isActive;
        if (isActive) displayName = match.primary.matchedName;
        displayIndex = match.primary.index;

    } else if (viewMode === 'secondary') {
        if (match.secondary.isDing) bgClass = isBlack ? dingBlack2 : dingWhite2;
        else if (match.secondary.isTone) bgClass = isBlack ? toneBlack2 : toneWhite2;
        isActive = match.secondary.isActive;
        if (isActive) displayName = match.secondary.matchedName;
        displayIndex = match.secondary.index;
    }

    return { bgClass, displayName, isActive, displayIndex };
}
