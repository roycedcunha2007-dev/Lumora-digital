# FigmaLite 2.0 — Professional Local-First Visual Design & Canvas Studio

**Design. Create. Prototype. Export.**

FigmaLite 2.0 is a browser-based visual design editor and canvas studio built with React, Vite, Tailwind CSS, SVG, and HTML5 Canvas. It runs 100% offline and stores all projects, components, assets, and version snapshots locally in IndexedDB and LocalStorage.

---

## 🌟 FigmaLite 2.0 Signature Features

### 1. 🧠 Design Doctor & QA Scanner
Deterministic document inspection engine analyzing:
* **Layout**: Alignment, spacing consistency, object overlaps, frame bounds, uneven margins.
* **Typography**: Font size consistency, scale harmonization, line height, typographic hierarchy.
* **Color & Contrast**: Palette consistency, repeated colors, WCAG AA/AAA contrast ratios.
* **Components**: Detached instances, missing master components.
* **Accessibility**: Low-contrast text warnings, touch target size validation (<44px).
* **Click-to-Locate**: Clicking any diagnostic issue selects and highlights the relevant object on the canvas.
* **Auto-Fix**: One-click deterministic repair for typography normalization, touch target enlargement, and default constraints.

### 2. ✨ Design Improvement Engine
Deterministic rules engine suggesting actionable design improvements:
* Normalize spacing gaps to standard 8px/16px/24px/32px grid tokens.
* Harmonize corner radii across cards and containers.
* Standardize heading and body font sizes to design system typography tokens.

### 3. 🎨 Design Style Extractor
Inspects any frame or page to extract:
* **Color Palette**: Primary, Secondary, Background, Surface, Text, Muted, Accent, and Border tokens.
* **Typography Scale**: Detected font sizes, font families, and font weights.
* **Spacing Scale**: Detected layout gap and padding tokens (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px).
* **Radii & Shadows**: Border radius swatches and shadow configurations.
* **Export**: One-click export to production CSS Custom Properties (`:root { ... }`) and JSON tokens.

### 4. ⚡ Magic Responsive Resize
Deterministic layout adaptation engine:
* Presets for Desktop, Laptop, Tablet, Mobile (iPhone 16 Pro), Instagram Posts/Stories, YouTube Thumbnails, and Pitch Deck Presentations.
* Applies responsive constraints, scales auto layout frames, and reflows typography proportionally with full undo/redo support.

### 5. 🎬 Smart Animate Prototyping
Enhanced presentation runner with native property interpolation:
* Matching layers between frames by ID or name are interpolated across X, Y, Width, Height, Rotation, Opacity, Corner Radius, Fill, and Stroke.
* Supports Ease In, Ease Out, Ease In Out, and Linear transitions.
* Interactive hotspot flashes show clickable areas when clicking non-interactive regions.
* Device mockup frame toggle (iPhone, iPad, MacBook, Fullscreen Stage) inside presentation mode.

### 6. 🧩 Component Lab & Variants
Interactive master component inspector:
* Configure variant properties across **Type** (Primary, Secondary, Outline), **Size** (Small, Medium, Large), and **State** (Default, Hover, Pressed, Disabled).
* Live visual preview of component variants with instant insertion of variant instances onto the canvas.
* Master component modifications propagate across all active instances.

### 7. 🕰️ Design Time Machine (Version History)
Named milestone version history separate from session undo/redo:
* Create named snapshots (e.g. "Homepage Final", "Client Review", "Before Redesign").
* Chronological visual timeline with timestamps and element counts.
* Snapshot preview, restoration, and deletion backed by local IndexedDB.

### 8. 🔬 Design Insights Inspector
Contextual inspector panel showing document relationships for any selected element:
* Component hierarchy and master component status.
* Auto Layout mode, gap, and padding values.
* Horizontal and vertical responsive constraints.
* Applied color tokens and design system variables.

### 9. 🪄 Design Variations Generator
Deterministic theme variant generator:
* **Cyberpunk Dark Mode**: Deep navy backdrops with neon accents.
* **Clean Minimalist**: High-legibility monochromatic styling.
* **High Contrast**: Pure black background with Stark white text.
* **Compact Dense Layout**: Tightened spacing matrix and reduced typography scale.

### 10. 📱 Responsive Viewport Simulator
Interactive on-canvas viewport simulator:
* Switch between Desktop (1440px), Laptop (1280px), Tablet (768px), and Mobile (393px).
* Draggable viewport handle with live overflow detection badges.

### 11. 🧱 Layout Blueprint Mode
Schematic architectural wireframe overlay:
* Visualizes container hierarchies, auto layout directions, layer bounds, and constraint anchors directly on canvas.

### 12. 📊 Editable Native Charts
Native editable chart elements:
* Bar Charts, Line Charts, Pie Charts, Donut Charts, and Area Charts.
* Editable dataset table (Labels & Values) directly inside the Inspector panel.

### 13. 🧰 Canva-Style Elements Library
Drag-and-drop elements panel:
* Badges, pills, glassmorphism cards, geometric decorative shapes, and chart presets.

### 14. 🎨 Canva-Style Template Studio
Curated editable templates across categories:
* **Social Media**: Instagram Posts, Instagram Stories, YouTube Thumbnails.
* **Marketing**: Marketing Flyers, Event Posters, Banners.
* **Business**: Pitch Deck Slides, Business Cards, Resumes.
* **Web & Apps**: SaaS Landing Pages, CryptoPay Mobile Prototype, Dashboard Layouts.

### 15. 📱 Device Mockup Studio
Realistic presentation frames wrapping selected designs:
* iPhone 16 Pro, iPad Pro, MacBook Pro, and Desktop Browser frames.

### 16. ♿ Accessibility & WCAG Checker
* Comprehensive WCAG 2.1 AA/AAA color contrast ratio calculation.
* Minimum touch target size validation (44x44px standard).
* Small text warnings (<12px).

### 17. 🧭 Professional Editor Navigation
* **Breadcrumb Trail**: Active element hierarchy path (`Page / Frame / Group / Element`) with click-to-select.
* **Canvas Minimap**: Interactive radar overview with viewport rectangle and click-to-pan.
* Quick zoom presets (`Zoom to Fit`, `Zoom to Selection`, `100%`).

### 18. 🔥 Floating Quick Actions HUD
Contextual floating toolbar hovering above active selection for rapid actions: Duplicate, Group, Ungroup, Align, Distribute, Auto Layout, and Component creation.

### 19. 💾 Automatic Crash Recovery
* Periodic background checkpoints saved every 15 seconds to local IndexedDB.
* Automatic recovery prompt on unexpected browser reloads.

### 20. ⚙️ Performance & Canvas Health Monitor
* Real-time metrics on total active objects, memory allocation, nesting tree depth, and local asset storage.

### 21. 📦 Full Design Package Export
* Downloads a complete structured JSON bundle containing document schemas, extracted design tokens, CSS custom properties, and master component definitions.

### 22. 📴 Offline-First Studio Workspace
* Clear workspace dashboard verifying that 100% of data remains on device.

---

## 🛠️ Architecture & Tech Stack

* **Framework**: React 19 + Vite
* **Styling**: Tailwind CSS v4
* **Icons**: Lucide React
* **Graphics**: SVG + HTML5 Canvas
* **Persistence**: IndexedDB (`FigmaLiteDB` v2) + LocalStorage
* **Backend**: None (100% Local-First Frontend)

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```
