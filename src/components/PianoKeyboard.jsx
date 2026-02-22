import { getNoteNames, getNoteMatch } from '../utils/noteUtils';

/**
 * Interaktív zongora vizualizáció — kiemeli a skálák hangjait, frekvenciával
 */
export default function PianoKeyboard({
    viewMode = 'merged',
    selectedScale, compareScale, tertiaryScale = null,
    baseFrequency, activeNotes, playNote,
    startMidi = 43,
    endMidi = 83,
}) {
    const keys = [];

    for (let midi = startMidi; midi <= endMidi; midi++) {
        const noteClass = midi % 12;
        const isBlack = [1, 3, 6, 8, 10].includes(noteClass);

        const freq = baseFrequency * Math.pow(2, (midi - 69) / 12);
        const freqStr = (Math.round(freq * 10) / 10).toFixed(1);

        if (!isBlack) {
            const defaultName = `${getNoteNames(noteClass)[0]}${Math.floor(midi / 12) - 1}`;
            const match = getNoteMatch(midi, selectedScale, compareScale, tertiaryScale);
            const isWhitePressed = activeNotes[midi];

            const hasNextBlack = [0, 2, 5, 7, 9].includes(noteClass);
            const nextMidi = midi + 1;
            let blackMatch = null, blackDefaultName = '', isBlackPressed = false, nextFreqStr = '';

            if (hasNextBlack && nextMidi <= endMidi) {
                blackMatch = getNoteMatch(nextMidi, selectedScale, compareScale, tertiaryScale);
                blackDefaultName = `${getNoteNames(nextMidi % 12)[0]}${Math.floor(nextMidi / 12) - 1}`;
                isBlackPressed = activeNotes[nextMidi];
                const nextFreq = baseFrequency * Math.pow(2, (nextMidi - 69) / 12);
                nextFreqStr = (Math.round(nextFreq * 10) / 10).toFixed(1);
            }

            const whiteKey = resolveKeyDisplay(match, viewMode, defaultName);
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

    if (isBlack) {
        bgClass = 'bg-slate-900 hover:bg-slate-800';
    } else {
        bgClass = 'bg-white hover:bg-slate-100';
    }

    // Skála 1 — türkiz
    const dingW  = 'bg-amber-300 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]';
    const dingB  = 'bg-amber-500';
    const tone1W = 'bg-teal-200 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]';
    const tone1B = 'bg-teal-500';

    // Skála 2 — lila
    const ding2W = 'bg-orange-300 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]';
    const ding2B = 'bg-orange-500';
    const tone2W = 'bg-purple-300 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]';
    const tone2B = 'bg-purple-500';

    // Skála 3 — narancs
    const tone3W = 'bg-orange-200 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]';
    const tone3B = 'bg-orange-400';

    // Közös hangok (merged nézet) — a két érintett skála színéből keverve
    const both12W = 'bg-gradient-to-r from-teal-200 to-purple-300 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]';
    const both12B = 'bg-gradient-to-r from-teal-400 to-purple-500';
    const both13W = 'bg-gradient-to-r from-teal-200 to-orange-200 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]';
    const both13B = 'bg-gradient-to-r from-teal-400 to-orange-400';
    const both23W = 'bg-gradient-to-r from-purple-300 to-orange-200 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]';
    const both23B = 'bg-gradient-to-r from-purple-500 to-orange-400';
    const all3W   = 'bg-gradient-to-r from-teal-200 via-purple-300 to-orange-200 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]';
    const all3B   = 'bg-gradient-to-r from-teal-400 via-purple-500 to-orange-400';
    const bothDingW = 'bg-gradient-to-r from-amber-400 to-orange-400';
    const bothDingB = 'bg-gradient-to-r from-amber-500 to-orange-500';

    const p = match.primary, s = match.secondary, t = match.tertiary;

    if (viewMode === 'merged') {
        // Ding elsőbbség — ha bármelyik skálában Ding
        const anyDing = p.isDing || s.isDing || t.isDing;
        if (anyDing) {
            bgClass = isBlack ? bothDingB : bothDingW;
        }
        // 3-skálás hangkombinációk
        else if (p.isTone && s.isTone && t.isTone) bgClass = isBlack ? all3B   : all3W;
        else if (p.isTone && t.isTone)             bgClass = isBlack ? both13B  : both13W;
        else if (s.isTone && t.isTone)             bgClass = isBlack ? both23B  : both23W;
        else if (p.isTone && s.isTone)             bgClass = isBlack ? both12B  : both12W;
        else if (t.isTone)                         bgClass = isBlack ? tone3B   : tone3W;
        else if (p.isTone)                         bgClass = isBlack ? tone1B   : tone1W;
        else if (s.isTone)                         bgClass = isBlack ? tone2B   : tone2W;

        isActive = p.isActive || s.isActive || t.isActive;
        if (p.isActive)      displayName = p.matchedName;
        else if (s.isActive) displayName = s.matchedName;
        else if (t.isActive) displayName = t.matchedName;

        const indices = [
            p.isActive ? p.index : null,
            s.isActive ? s.index : null,
            t.isActive ? t.index : null,
        ].filter(v => v !== null);
        const unique = [...new Set(indices)];
        if (unique.length === 1)      displayIndex = unique[0];
        else if (unique.length > 1)   displayIndex = unique.join(isBlack ? '|' : '/');

    } else if (viewMode === 'primary') {
        if (p.isDing)      bgClass = isBlack ? dingB  : dingW;
        else if (p.isTone) bgClass = isBlack ? tone1B : tone1W;
        isActive = p.isActive;
        if (isActive) displayName = p.matchedName;
        displayIndex = p.index;

    } else if (viewMode === 'secondary') {
        if (s.isDing)      bgClass = isBlack ? ding2B  : ding2W;
        else if (s.isTone) bgClass = isBlack ? tone2B  : tone2W;
        isActive = s.isActive;
        if (isActive) displayName = s.matchedName;
        displayIndex = s.index;

    } else if (viewMode === 'tertiary') {
        if (t.isDing)      bgClass = isBlack ? dingB  : dingW;
        else if (t.isTone) bgClass = isBlack ? tone3B : tone3W;
        isActive = t.isActive;
        if (isActive) displayName = t.matchedName;
        displayIndex = t.index;
    }

    return { bgClass, displayName, isActive, displayIndex };
}
