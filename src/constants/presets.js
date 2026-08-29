export const FRAME_PRESETS = [
  {
    category: 'Popular',
    items: [
      { name: 'Desktop HD', width: 1440, height: 1024, icon: 'Monitor' },
      { name: 'MacBook Pro 14"', width: 1512, height: 982, icon: 'Laptop' },
      { name: 'iPhone 16 Pro', width: 393, height: 852, icon: 'Smartphone' },
      { name: 'iPad Pro 11"', width: 834, height: 1194, icon: 'Tablet' },
    ]
  },
  {
    category: 'Desktop & Laptop',
    items: [
      { name: 'Desktop (1920x1080)', width: 1920, height: 1080, icon: 'Monitor' },
      { name: 'Desktop (1440x900)', width: 1440, height: 900, icon: 'Monitor' },
      { name: 'MacBook Air', width: 1280, height: 832, icon: 'Laptop' },
      { name: 'Wireframe Standard', width: 1200, height: 800, icon: 'Layout' },
    ]
  },
  {
    category: 'Phone & Mobile',
    items: [
      { name: 'iPhone 16 Pro Max', width: 430, height: 932, icon: 'Smartphone' },
      { name: 'iPhone 16 / 15', width: 393, height: 852, icon: 'Smartphone' },
      { name: 'iPhone SE', width: 375, height: 667, icon: 'Smartphone' },
      { name: 'Android Large', width: 412, height: 915, icon: 'Smartphone' },
      { name: 'Android Small', width: 360, height: 800, icon: 'Smartphone' },
    ]
  },
  {
    category: 'Social Media & Marketing',
    items: [
      { name: 'Instagram Post', width: 1080, height: 1080, icon: 'Instagram' },
      { name: 'Instagram Story', width: 1080, height: 1920, icon: 'Instagram' },
      { name: 'YouTube Thumbnail', width: 1280, height: 720, icon: 'Youtube' },
      { name: 'Twitter/X Header', width: 1500, height: 500, icon: 'Twitter' },
      { name: 'Dribbble Shot', width: 1600, height: 1200, icon: 'Dribbble' },
    ]
  },
  {
    category: 'Presentation & Paper',
    items: [
      { name: 'Slide 16:9', width: 1920, height: 1080, icon: 'Presentation' },
      { name: 'Slide 4:3', width: 1024, height: 768, icon: 'Presentation' },
      { name: 'A4 Portrait', width: 595, height: 842, icon: 'FileText' },
    ]
  }
];
export const FONT_FAMILIES = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Plus Jakarta Sans', value: "'Plus Jakarta Sans', sans-serif" },
  { name: 'Outfit', value: 'Outfit, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Playfair Display (Serif)', value: "'Playfair Display', serif" },
  { name: 'Fira Code (Mono)', value: "'Fira Code', monospace" },
  { name: 'System Sans', value: 'system-ui, -apple-system, sans-serif' },
];
export const COLOR_PALETTE_PRESETS = [
  '#000000', '#18181B', '#3F3F46', '#71717A', '#A1A1AA', '#E4E4E7', '#FFFFFF',
  '#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6', '#6366F1',
  '#8B5CF6', '#EC4899', '#F43F5E', '#14B8A6', '#84CC16', '#EAB308', '#64748B'
];
export const GRADIENT_PRESETS = [
  { name: 'Indigo Dream', type: 'linear', angle: 135, stops: [{ color: '#6366F1', offset: 0, opacity: 1 }, { color: '#A855F7', offset: 100, opacity: 1 }] },
  { name: 'Sunset Glow', type: 'linear', angle: 90, stops: [{ color: '#F43F5E', offset: 0, opacity: 1 }, { color: '#FB923C', offset: 100, opacity: 1 }] },
  { name: 'Ocean Breeze', type: 'linear', angle: 120, stops: [{ color: '#06B6D4', offset: 0, opacity: 1 }, { color: '#3B82F6', offset: 100, opacity: 1 }] },
  { name: 'Emerald Forest', type: 'linear', angle: 180, stops: [{ color: '#10B981', offset: 0, opacity: 1 }, { color: '#047857', offset: 100, opacity: 1 }] },
  { name: 'Cyber Neon', type: 'linear', angle: 45, stops: [{ color: '#F43F5E', offset: 0, opacity: 1 }, { color: '#8B5CF6', offset: 50, opacity: 1 }, { color: '#06B6D4', offset: 100, opacity: 1 }] },
  { name: 'Cosmic Violet', type: 'radial', stops: [{ color: '#C084FC', offset: 0, opacity: 1 }, { color: '#3B0764', offset: 100, opacity: 1 }] },
];
export const DEFAULT_STYLE_TOKENS = {
  colors: [
    { id: 'c_primary', name: 'Primary Indigo', value: '#6366F1' },
    { id: 'c_secondary', name: 'Secondary Purple', value: '#A855F7' },
    { id: 'c_accent', name: 'Accent Cyan', value: '#06B6D4' },
    { id: 'c_bg_dark', name: 'Dark Surface', value: '#09090B' },
    { id: 'c_card_dark', name: 'Card Surface', value: '#18181B' },
    { id: 'c_text_main', name: 'Main Text', value: '#F4F4F5' },
    { id: 'c_text_muted', name: 'Muted Text', value: '#A1A1AA' },
    { id: 'c_border', name: 'Subtle Border', value: '#27272A' },
  ],
  typography: [
    { id: 't_h1', name: 'Heading 1', fontFamily: 'Inter', fontSize: 36, fontWeight: 700, lineHeight: 1.2, letterSpacing: -0.8 },
    { id: 't_h2', name: 'Heading 2', fontFamily: 'Inter', fontSize: 24, fontWeight: 600, lineHeight: 1.3, letterSpacing: -0.4 },
    { id: 't_h3', name: 'Heading 3', fontFamily: 'Inter', fontSize: 18, fontWeight: 600, lineHeight: 1.4, letterSpacing: -0.2 },
    { id: 't_body', name: 'Body Regular', fontFamily: 'Inter', fontSize: 14, fontWeight: 400, lineHeight: 1.5, letterSpacing: 0 },
    { id: 't_small', name: 'Small / Caption', fontFamily: 'Inter', fontSize: 12, fontWeight: 500, lineHeight: 1.4, letterSpacing: 0.2 },
    { id: 't_code', name: 'Code Mono', fontFamily: 'Fira Code', fontSize: 13, fontWeight: 500, lineHeight: 1.6, letterSpacing: 0 },
  ],
  radii: [
    { id: 'r_none', name: 'None', value: 0 },
    { id: 'r_sm', name: 'Small', value: 4 },
    { id: 'r_md', name: 'Medium', value: 8 },
    { id: 'r_lg', name: 'Large', value: 12 },
    { id: 'r_xl', name: 'Extra Large', value: 16 },
    { id: 'r_full', name: 'Pill / Full', value: 9999 },
  ],
  shadows: [
    { id: 's_sm', name: 'Subtle Shadow', x: 0, y: 1, blur: 3, spread: 0, color: 'rgba(0,0,0,0.2)' },
    { id: 's_md', name: 'Card Shadow', x: 0, y: 4, blur: 12, spread: -2, color: 'rgba(0,0,0,0.35)' },
    { id: 's_lg', name: 'Floating Shadow', x: 0, y: 12, blur: 24, spread: -4, color: 'rgba(0,0,0,0.5)' },
    { id: 's_glow', name: 'Indigo Glow', x: 0, y: 0, blur: 20, spread: 2, color: 'rgba(99,102,241,0.4)' },
  ]
};