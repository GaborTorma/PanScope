/**
 * Akkord gombok listája — Liskov Substitution: bármely chord tömbbel működik
 */
export default function ChordList({ chords, colorScheme = 'teal', playChord }) {
    const colors = colorScheme === 'teal'
        ? { major: 'text-teal-800', minor: 'text-teal-600', majorBtn: 'border-teal-200 text-teal-700 hover:bg-teal-50', minorBtn: 'border-teal-200 text-teal-600 hover:bg-teal-50' }
        : { major: 'text-purple-800', minor: 'text-purple-600', majorBtn: 'border-purple-200 text-purple-700 hover:bg-purple-50', minorBtn: 'border-purple-200 text-purple-600 hover:bg-purple-50' };

    return (
        <div>
            <p className="text-sm text-slate-500 mb-2">Kijátszható akkordok (kattints rá)</p>
            <div className="flex flex-col gap-2">
                {chords.length > 0 ? chords.map((chord, i) => (
                    <div key={i} className="grid grid-cols-[80px_1fr] items-start gap-2">
                        <span className={`pt-0.5 font-bold text-sm ${chord.type === 'major' ? colors.major : chord.type === 'minor' ? colors.minor : 'text-slate-600'}`}>
                            {chord.name}:
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {chord.voicings.map((voicing, j) => (
                                <button
                                    key={j}
                                    onClick={() => playChord(voicing.midiNotes)}
                                    className={`px-2.5 py-1 bg-white border rounded-md text-xs font-semibold shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-1 group ${chord.type === 'major' ? colors.majorBtn : chord.type === 'minor' ? colors.minorBtn : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <span className="text-[9px] opacity-40 group-hover:opacity-100 transition-opacity">▶</span>
                                    {voicing.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )) : <span className="text-sm text-slate-400 italic">Nincs elég hang akkordok építéséhez</span>}
            </div>
        </div>
    );
}
