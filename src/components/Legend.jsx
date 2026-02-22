/**
 * Jelmagyarázat — csak összehasonlítás esetén látható (2+ skála aktív)
 */
export default function Legend({ scaleCount }) {
    const has3 = scaleCount >= 3;

    return (
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 mt-6 text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-lg max-w-4xl mx-auto border border-slate-100">

            {/* Egyedi hangok */}
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-teal-300 border border-teal-500"></div> Csak 1. Skála</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-purple-300 border border-purple-500"></div> Csak 2. Skála</div>
            {has3 && <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-rose-300 border border-rose-500"></div> Csak 3. Skála</div>}

            {/* Közös hangok — gradient a két skála színéből keverve */}
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-teal-300 to-purple-300 border border-teal-400"></div>
                {has3 ? '1+2 Közös' : 'Közös hang'}
            </div>
            {has3 && <>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-teal-300 to-rose-300 border border-teal-400"></div>
                    1+3 Közös
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-300 to-rose-300 border border-purple-400"></div>
                    2+3 Közös
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-teal-300 via-purple-300 to-rose-300 border border-purple-400"></div>
                    Mindhárom közös
                </div>
            </>}

            {/* Alaphang */}
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-400 border border-amber-600"></div>
                Alaphang (Ding)
            </div>
        </div>
    );
}
