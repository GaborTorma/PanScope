export default function Header() {
    return (
        <header className="text-center space-y-1 mb-4">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                PanScope
            </h1>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Handpan skála vizualizáló
            </h2>
            <p className="text-base text-slate-500 max-w-2xl mx-auto">
                Válaszd ki a skálákat, vizsgáld meg a felépítésüket és kattints a hangok lejátszásához!
            </p>
        </header>
    );
}
