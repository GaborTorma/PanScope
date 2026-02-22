# 🎵 PanScope — Handpan Skála Vizualizáló

Interaktív webalkalmazás handpan skálák felfedezéséhez — zongora vizualizáció, akkordszámítás, skála-összehasonlítás és AI zenei tippek.

## 🚀 Helyi futtatás

```bash
# Függőségek telepítése
npm install

# Fejlesztői szerver indítása (http://localhost:5173)
npm run dev
```

## 🐳 Docker

```bash
# Build és indítás (http://localhost:8080)
docker compose up --build

# Leállítás
docker compose down
```

## 🌐 Netlify Deploy

1. Pushold a repót GitHubra
2. Netlify-on: **Add new site** → **Import an existing project** → válaszd a repót
3. A build beállítások a `netlify.toml`-ból automatikusan jönnek:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Ha használni akarod az AI funkciót: **Site settings** → **Environment variables** → add hozzá: `VITE_GEMINI_API_KEY`

## 🤖 AI funkció (opcionális)

Az alkalmazás tartalmaz egy Gemini AI integrációt, ami zenei tippeket és skála-összehasonlítást ad.

1. Másold a `.env.example`-t `.env`-nek
2. Szerezz egy API kulcsot: [Google AI Studio](https://aistudio.google.com/)
3. Írd be a kulcsot: `VITE_GEMINI_API_KEY=your-key-here`

## 📁 Projekt struktúra

```
├── src/
│   ├── App.jsx          # Fő alkalmazás komponens
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind CSS + egyedi stílusok
├── public/
│   └── favicon.svg      # Handpan ikon
├── index.html           # Vite HTML template
├── Dockerfile           # Multi-stage build (Node → nginx)
├── docker-compose.yml   # Docker Compose konfig
├── netlify.toml         # Netlify deploy beállítások
└── tailwind.config.js   # Tailwind konfig
```

## 🛠️ Technológiák

- **React 19** + **Vite 6**
- **Tailwind CSS 3**
- **Web Audio API** (hangszintézis)
- **Google Gemini API** (AI tippek)
- **Docker** (nginx:alpine production)
- **Netlify** (statikus hosting)
