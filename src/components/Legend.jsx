/**
 * Jelmagyarázat — mutatja a szín-kódolást összehasonlítás nélkül és összehasonlítás esetén
 */
export default function Legend({ hasCompare }) {
    return (
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-6 text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-lg max-w-3xl mx-auto border border-slate-100">
            {!hasCompare ? (
                <>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-amber-400 border border-amber-500"></div> Ding</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-teal-300 border border-teal-500"></div> Hangsor (1, 2, 3...)</div>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-teal-300 border border-teal-500"></div> Csak 1. Skála</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-purple-300 border border-purple-500"></div> Csak 2. Skála</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-indigo-400 border border-indigo-600"></div> Közös hang</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 border border-amber-600"></div> Alaphang (Ding)</div>
                </>
            )}
        </div>
    );
}
