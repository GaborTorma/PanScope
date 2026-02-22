import ChordList from './ChordList';

const COLORS = {
    teal: {
        bg: 'bg-teal-50/40', border: 'border-teal-100', label: 'text-teal-800',
        selectBorder: 'border-teal-300', selectText: 'text-teal-900', selectRing: 'focus:ring-teal-500/20',
        filterBorder: 'border-teal-200', filterText: 'text-teal-700', filterRing: 'focus:ring-teal-400',
        filterLabel: 'text-teal-700/70', dingBg: 'bg-amber-100 text-amber-800 border-amber-300',
        noteBg: 'bg-teal-50 text-teal-800 border-teal-200', chordScheme: 'teal',
    },
    purple: {
        bg: 'bg-purple-50/40', border: 'border-purple-100', label: 'text-purple-800',
        selectBorder: 'border-purple-300', selectText: 'text-purple-900', selectRing: 'focus:ring-purple-500/20',
        filterBorder: 'border-purple-200', filterText: 'text-purple-700', filterRing: 'focus:ring-purple-400',
        filterLabel: 'text-purple-700/70', dingBg: 'bg-amber-100 text-amber-800 border-amber-300',
        noteBg: 'bg-purple-50 text-purple-800 border-purple-200', chordScheme: 'purple',
    },
    rose: {
        bg: 'bg-rose-50/40', border: 'border-rose-200', label: 'text-rose-800',
        selectBorder: 'border-rose-300', selectText: 'text-rose-900', selectRing: 'focus:ring-rose-500/20',
        filterBorder: 'border-rose-200', filterText: 'text-rose-700', filterRing: 'focus:ring-rose-400',
        filterLabel: 'text-rose-700/70', dingBg: 'bg-amber-100 text-amber-800 border-amber-300',
        noteBg: 'bg-rose-50 text-rose-800 border-rose-200', chordScheme: 'rose',
    },
};

const SCHEME_ORDER = ['teal', 'purple', 'rose'];

/**
 * ScaleSlot — Egy teljes skálaválasztó egység:
 * szűrők (felül) → dropdown → skála infó + akkordok (alul)
 */
export default function ScaleSlot({ slot, index, totalCount, onFilterChange, onScaleChange, onRemove, onClearFilters, playChord }) {
    const schemeKey = SCHEME_ORDER[index] || 'rose';
    const c = COLORS[schemeKey];
    const scale = slot.selectedScale;
    const label = index === 0 ? '1. Skála (Fő)' : `${index + 1}. Skála`;

    return (
        <div className={`flex flex-col gap-0 ${c.bg} rounded-2xl border ${c.border} overflow-hidden shadow-sm`}>

            {/* --- Fejléc --- */}
            <div className="flex justify-between items-center px-5 pt-4 pb-2">
                <span className={`font-bold ${c.label} uppercase tracking-wider text-xs`}>{label}</span>
                {totalCount > 1 && (
                    <button
                        onClick={() => onRemove(slot.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors text-lg leading-none font-bold px-1"
                        aria-label="Skála eltávolítása"
                    >✕</button>
                )}
            </div>

            {/* --- Szűrők FELÜL --- */}
            <div className="px-5 pb-2">
                <div className="flex items-center justify-between mb-1 px-0.5">
                    <span className={`text-[10px] font-bold ${c.filterLabel} uppercase tracking-widest`}>
                        Szűrés
                    </span>
                    {slot.hasActiveFilters && (
                        <button
                            onClick={() => onClearFilters(slot.id)}
                            className="text-[10px] text-red-400 hover:text-red-600 font-bold transition-colors"
                        >
                            ✕ Törlés
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { key: 'root', placeholder: 'Alap', options: slot.availableRoots.map(r => ({ value: r, label: r })) },
                        { key: 'family', placeholder: 'Típus', options: slot.availableFamilies.map(f => ({ value: f, label: f })) },
                        { key: 'count', placeholder: 'Hang', options: slot.availableCounts.map(n => ({ value: n, label: `${n} hangos` })) },
                    ].map(({ key, placeholder, options }) => (
                        <select
                            key={key}
                            value={slot.filters[key]}
                            onChange={e => onFilterChange(slot.id, key, e.target.value)}
                            className={`p-2 text-xs font-semibold bg-white border ${c.filterBorder} ${c.filterText} rounded-lg outline-none focus:ring-2 ${c.filterRing} cursor-pointer transition-all`}
                        >
                            <option value="">Mind ({placeholder})</option>
                            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    ))}
                </div>
            </div>

            {/* --- Dropdown --- */}
            <div className="px-5 pb-4">
                <select
                    value={slot.scaleId}
                    onChange={e => onScaleChange(slot.id, e.target.value)}
                    className={`w-full p-3 bg-white border-2 ${c.selectBorder} ${c.selectText} rounded-xl text-base font-bold outline-none focus:ring-4 ${c.selectRing} cursor-pointer shadow-sm transition-all`}
                >
                    {slot.filteredScales.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
            </div>

            {/* --- Skála Infó --- */}
            {scale && (
                <div className="border-t border-slate-100 px-5 py-4 flex flex-col gap-4 bg-white/60">

                    {/* Hangulat */}
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Hangulat</p>
                        <p className={`text-sm font-semibold ${c.label} italic`}>{scale.mood}</p>
                    </div>

                    {/* Típus */}
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Típus</p>
                        <p className="text-sm text-slate-700">{scale.type}</p>
                    </div>

                    {/* Hangok — Ding külön sorban */}
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Hangok</p>
                        <div className="flex flex-col gap-1.5">
                            <span className={`inline-flex self-start px-3 py-1.5 ${c.dingBg} border rounded-lg text-xs font-bold shadow-sm`}>
                                Ding — {scale.ding}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {scale.notes.map((note, i) => (
                                    <span key={i} className={`px-2.5 py-1 ${c.noteBg} border rounded-lg text-xs font-medium`}>
                                        {note}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Jellemzés */}
                    <div className="pt-1 border-t border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Jellemzés</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{scale.description}</p>
                    </div>

                    {/* Akkordok */}
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Akkordok</p>
                        <ChordList chords={slot.chords} colorScheme={c.chordScheme} playChord={playChord} />
                    </div>
                </div>
            )}
        </div>
    );
}
