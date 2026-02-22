import ChordList from './ChordList';

/**
 * Skála infó kártya: név, típus, hangulat, hangok, akkordok, jellemzés
 */
export default function ScaleInfoCard({ scale, chords, variant = 'primary', playChord }) {
    const isPrimary = variant === 'primary';
    const borderColor = isPrimary ? 'border-t-teal-400' : 'border-t-purple-400';
    const badgeBg = isPrimary ? 'bg-teal-50' : 'bg-purple-50';
    const badgeText = isPrimary ? 'text-teal-600' : 'text-purple-600';
    const typeColor = isPrimary ? 'text-teal-700' : 'text-purple-700';
    const dingBg = isPrimary ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-orange-100 text-orange-800 border-orange-300';
    const noteBg = isPrimary ? 'bg-teal-50 text-teal-800 border-teal-200' : 'bg-purple-50 text-purple-800 border-purple-200';
    const colorScheme = isPrimary ? 'teal' : 'purple';
    const badgeLabel = isPrimary ? '1. Skála' : '2. Skála';

    return (
        <div className={`bg-white p-6 rounded-2xl shadow-lg border-t-4 ${borderColor} border border-slate-200 flex flex-col gap-5`}>
            <div>
                <span className={`text-xs font-bold ${badgeText} uppercase tracking-widest ${badgeBg} px-2 py-1 rounded`}>
                    {badgeLabel}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">{scale.name}</h2>
                <p className={`${typeColor} font-semibold`}>{scale.type}</p>
            </div>

            <div className="pt-2 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Hangulat</p>
                <p className="text-slate-800 italic">{scale.mood}</p>
            </div>

            <div>
                <p className="text-sm text-slate-500 mb-2">Hangok</p>
                <div className="flex flex-col gap-2">
                    <div>
                        <span className={`inline-block px-3 py-1 ${dingBg} border rounded-lg font-bold shadow-sm`}>
                            {scale.ding} (Ding)
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {scale.notes.map((note, i) => (
                            <span key={i} className={`px-3 py-1 ${noteBg} border rounded-lg font-medium shadow-sm`}>
                                {note}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <ChordList chords={chords} colorScheme={colorScheme} playChord={playChord} />

            <div className="mt-auto pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Jellemzés</p>
                <p className="text-sm text-slate-700 leading-relaxed">{scale.description}</p>
            </div>
        </div>
    );
}
