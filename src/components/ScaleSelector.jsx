/**
 * Egy skálaválasztó blokk szűrőkkel (újrahasználható az 1. és 2. skálához)
 * Open/Closed: props-on keresztül variálható, nem kell módosítani a kódot
 */
export default function ScaleSelector({
    label, colorScheme, // 'teal' vagy 'purple'
    selectedId, onScaleChange,
    filteredScales,
    filters, onFilterChange,
    availableRoots, availableFamilies, availableCounts,
    isCompare = false,
}) {
    const colors = colorScheme === 'teal'
        ? { bg: 'bg-teal-50/40', border: 'border-teal-100', text: 'text-teal-800', selectBorder: 'border-teal-200', selectText: 'text-teal-900', filterBorder: 'border-teal-200', filterText: 'text-teal-700', filterRing: 'focus:ring-teal-400', filterLabel: 'text-teal-700/70', selectRing: 'focus:ring-teal-500/20' }
        : { bg: 'bg-purple-50/40', border: 'border-purple-100', text: 'text-purple-800', selectBorder: 'border-purple-300', selectText: 'text-purple-900', filterBorder: 'border-purple-200', filterText: 'text-purple-700', filterRing: 'focus:ring-purple-400', filterLabel: 'text-purple-700/70', selectRing: 'focus:ring-purple-500/20' };

    return (
        <div className={`flex flex-col gap-3 ${colors.bg} p-5 rounded-xl border ${colors.border}`}>
            <label className={`font-bold ${colors.text} uppercase tracking-wider text-sm`}>
                {label}
            </label>
            <select
                value={selectedId}
                onChange={(e) => onScaleChange(e.target.value, isCompare)}
                className={`w-full p-3 bg-white border-2 ${isCompare && !selectedId ? 'border-slate-200 text-slate-500' : `${colors.selectBorder} ${colors.selectText} ${colors.selectRing}`} rounded-xl text-lg font-bold outline-none cursor-pointer shadow-sm transition-all ${selectedId ? `focus:ring-4 ${colors.selectRing}` : ''}`}
            >
                {isCompare && <option value="">-- Nincs összehasonlítás --</option>}
                {filteredScales.map(scale => (
                    <option key={`s-${scale.id}`} value={scale.id}>{scale.name}</option>
                ))}
            </select>

            <div className="flex flex-col gap-1 mt-1">
                <div className="flex justify-between items-center px-1">
                    <span className={`text-[10px] font-bold ${colors.filterLabel} uppercase tracking-widest`}>
                        Szűrés (Alap ➝ Típus ➝ Hang)
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <select
                        value={filters.root}
                        onChange={(e) => onFilterChange('root', e.target.value)}
                        className={`p-2 text-xs font-semibold bg-white border ${colors.filterBorder} ${colors.filterText} rounded-lg outline-none focus:ring-2 ${colors.filterRing} cursor-pointer transition-all`}
                    >
                        <option value="">Mind (Alap)</option>
                        {availableRoots.map(r => <option key={`r-${r}`} value={r}>{r}</option>)}
                    </select>
                    <select
                        value={filters.family}
                        onChange={(e) => onFilterChange('family', e.target.value)}
                        className={`p-2 text-xs font-semibold bg-white border ${colors.filterBorder} ${colors.filterText} rounded-lg outline-none focus:ring-2 ${colors.filterRing} cursor-pointer transition-all`}
                    >
                        <option value="">Mind (Típus)</option>
                        {availableFamilies.map(f => <option key={`f-${f}`} value={f}>{f}</option>)}
                    </select>
                    <select
                        value={filters.count}
                        onChange={(e) => onFilterChange('count', e.target.value)}
                        className={`p-2 text-xs font-semibold bg-white border ${colors.filterBorder} ${colors.filterText} rounded-lg outline-none focus:ring-2 ${colors.filterRing} cursor-pointer transition-all`}
                    >
                        <option value="">Mind (Hang)</option>
                        {availableCounts.map(n => <option key={`n-${n}`} value={n}>{n} hangos</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
}
