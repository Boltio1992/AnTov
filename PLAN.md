# AnTov — Proper Webapp Plan
*Created 2026-10-03. Status: plan approved, ready to scaffold.*

## Decisions (confirmed by Master)
- **Reading gesture:** Vertical-first (Wattpad-style scroll). Horizontal swipe = bonus gesture only inside installed PWA, with edge dead-zones. Never depend on horizontal swipes.
- **Stack:** Next.js 14 (App Router) + Tailwind CSS + Framer Motion. TypeScript.
- **Hosting:** Vercel free tier.
- **Auth (phase 2):** Username + password (bcrypt, httpOnly JWT cookie). Guests read free; unlock = account.
- **Payments (phase 2):** Manual — KHQR/bank QR shown in-app → user submits name + transaction ID → Master verifies in bank app → marks account unlocked via admin page. No card processing, no payment data stored.
- **v1:** No admin, no login. Content = files in repo; Master provides text, agent adds it.

## Constraint notes (why these choices)
1. **Browser edge-swipe back/forward** cannot be disabled in browser tabs on iOS/Android.
   → Vertical scroll reading + edge dead-zones (ignore horizontal swipes starting <24px from edge).
   → PWA install (standalone mode) removes the gesture conflict entirely → promote "Add to Home Screen".
2. **Screenshot/copy prevention** is impossible at OS level on web.
   → Deterrents only: text-selection off on reader, canvas-render option for premium text, faint per-user watermark, blur-on-blur (visibilitychange). Value proposition = convenience, not DRM.
3. **Sound autoplay** is blocked → ambient sound (rain/heartbeat/wind via Web Audio API) toggled by user, fades in on first interaction.
4. **Performance:** next/image lazy loading, font subsetting (Lora + Inter), content-split chapters, target <2s first load on 3G.

## Architecture
```
antov-app/
  content/
    universes.json        # folders: {id, name, desc, emoji}
    series/<id>.json      # {title, emoji, desc, tags, universeId, chapters:[{slug,title,byline,blocks,locked}]}
    media/                # images per chapter, ambient loops
  app/
    page.tsx              # Home: continue-reading, universe filter, series cards
    series/[id]/page.tsx  # Series: hero + chapter list (locked states)
    read/[series]/[chapter]/page.tsx  # Immersive reader (client component)
    api/                  # phase 2: auth, claims, admin
  components/             # ReaderShell, AmbientAudio, ChapterSheet, ThemeEngine...
```

## Reader features (v1)
- Immersive mode (tap to hide chrome), bottom nav: prev / chapters sheet / progress / next
- Themes: Paper / Night / Dim + brightness slider + font size/line-height (localStorage)
- Position autosave + Continue Reading card
- Ambient sound toggle; images revealed by scroll (dimmed → focus)
- PWA: manifest + service worker + install prompt

## Design direction (awwwards-tier, readable-first)
- Cinematic dark base, oversized editorial type, film-grain overlay
- Scroll-driven reveals (chapter titles fade in like smoke), parallax cover art
- Micro-interactions: haptic-style button feedback, progress bar turns blood-red as % climbs

## Phases
1. **v1 (now):** scaffold, design system, reader, all reader features, Master adds content via agent.
2. **v2:** accounts (username+password), manual payment claim flow + admin verify page, locked premium chapters per account/tier.
3. **v3 ideas:** notifications for new chapters, bookmarks/notes, Khmer UI toggle, offline packs.

## Demo status
- Old single-file demo unpublished (2026-10-03). Story text of "The Shift Before Dawn" lives in `../antov/index.html` — reuse as first content in v1.
