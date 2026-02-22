/**
 * Jelmagyarázat — csak összehasonlítás esetén látható (2+ skála aktív)
 */
export default function Legend({ scaleCount }) {
    return (
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-6 text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-lg max-w-3xl mx-auto border border-slate-100">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-teal-300 border border-teal-500"></div> Csak 1. Skála</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-purple-300 border border-purple-500"></div> Csak 2. Skála</div>
            {scaleCount >= 3 && (
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-orange-300 border border-orange-500"></div> Csak 3. Skála</div>
            )}
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-indigo-400 border border-indigo-600"></div> Közös hang</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 border border-amber-600"></div> Alaphang (Ding)</div>
        </div>
    );
}
