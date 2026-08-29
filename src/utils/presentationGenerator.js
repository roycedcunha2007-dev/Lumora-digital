import { generateId } from './math';

export const PRESENTATION_STYLES = {
  professional: {
    id: 'professional',
    name: 'Corporate Professional',
    bg: '#0F172A',
    surface: '#1E293B',
    accent: '#38BDF8',
    secondary: '#818CF8',
    text: '#F8FAFC',
    muted: '#94A3B8',
    font: 'Inter',
  },
  modern: {
    id: 'modern',
    name: 'Modern Gradient',
    bg: '#090D16',
    surface: '#131A29',
    accent: '#6366F1',
    secondary: '#EC4899',
    text: '#FFFFFF',
    muted: '#A1A1AA',
    font: 'Inter',
  },
  minimal: {
    id: 'minimal',
    name: 'Clean Minimalist',
    bg: '#18181B',
    surface: '#27272A',
    accent: '#F4F4F5',
    secondary: '#A1A1AA',
    text: '#FFFFFF',
    muted: '#71717A',
    font: 'Inter',
  },
  tech: {
    id: 'tech',
    name: 'Cyber & Tech Dark',
    bg: '#050811',
    surface: '#0D1322',
    accent: '#10B981',
    secondary: '#06B6D4',
    text: '#F0FDF4',
    muted: '#6EE7B7',
    font: 'Space Mono',
  },
  creative: {
    id: 'creative',
    name: 'Creative Studio',
    bg: '#1A0B2E',
    surface: '#2D124D',
    accent: '#F59E0B',
    secondary: '#EC4899',
    text: '#FAF5FF',
    muted: '#D8B4FE',
    font: 'Inter',
  },
  academic: {
    id: 'academic',
    name: 'Academic & Research',
    bg: '#0A192F',
    surface: '#112240',
    accent: '#64FFDA',
    secondary: '#8892B0',
    text: '#CCD6F6',
    muted: '#8892B0',
    font: 'Inter',
  }
};

export const SLIDE_LAYOUT_TYPES = [
  { id: 'title', name: 'Title Slide', desc: 'Hero heading, subtitle and presenter' },
  { id: 'title_content', name: 'Title + Content', desc: 'Heading with structured bullet points' },
  { id: 'two_columns', name: 'Two Columns', desc: 'Split comparison or dual features' },
  { id: 'image_text', name: 'Image + Text', desc: 'Media visual paired with narrative' },
  { id: 'stats_metrics', name: 'Stats & Metrics', desc: '3 high-impact metric KPI cards' },
  { id: 'section_header', name: 'Section Break', desc: 'Full-bleed thematic chapter divider' },
  { id: 'timeline', name: 'Roadmap & Timeline', desc: '4-phase sequential milestones' },
  { id: 'quote', name: 'Callout Quote', desc: 'Large inspirational quote with author' },
  { id: 'chart', name: 'Chart & Insights', desc: 'Interactive visual bar chart' },
  { id: 'blank', name: 'Blank Slide', desc: 'Clean 16:9 canvas' },
];

export function createSlideElements(layoutType, title = 'Slide Title', subtitle = '', styleKey = 'modern') {
  const theme = PRESENTATION_STYLES[styleKey] || PRESENTATION_STYLES.modern;
  const W = 1920;
  const H = 1080;

  const frameId = `frame_slide_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const children = [];

  switch (layoutType) {
    case 'title': {
      children.push(
        {
          id: `el_${Date.now()}_glow`,
          name: 'Hero Glow',
          type: 'ellipse',
          x: W / 2 - 300,
          y: H / 2 - 300,
          width: 600,
          height: 600,
          fill: theme.accent,
          opacity: 0.25,
          blur: 100,
        },
        {
          id: `el_${Date.now()}_badge`,
          name: 'Topic Tag',
          type: 'rounded_rect',
          x: W / 2 - 120,
          y: H / 2 - 180,
          width: 240,
          height: 40,
          cornerRadius: 20,
          fill: theme.surface,
          stroke: theme.accent,
          strokeWidth: 1.5,
        },
        {
          id: `el_${Date.now()}_badge_txt`,
          name: 'Tag Text',
          type: 'text',
          x: W / 2 - 120,
          y: H / 2 - 170,
          width: 240,
          height: 24,
          text: 'KEYNOTE PRESENTATION',
          fontFamily: theme.font,
          fontSize: 14,
          fontWeight: 700,
          fill: theme.accent,
          textAlign: 'center',
        },
        {
          id: `el_${Date.now()}_title`,
          name: 'Main Title',
          type: 'text',
          x: 160,
          y: H / 2 - 80,
          width: W - 320,
          height: 120,
          text: title,
          fontFamily: theme.font,
          fontSize: 64,
          fontWeight: 800,
          fill: theme.text,
          textAlign: 'center',
          lineHeight: 1.15,
        },
        {
          id: `el_${Date.now()}_sub`,
          name: 'Subtitle',
          type: 'text',
          x: 260,
          y: H / 2 + 60,
          width: W - 520,
          height: 60,
          text: subtitle || 'A comprehensive overview and strategic vision',
          fontFamily: theme.font,
          fontSize: 24,
          fontWeight: 400,
          fill: theme.muted,
          textAlign: 'center',
        },
        {
          id: `el_${Date.now()}_author`,
          name: 'Presenter Info',
          type: 'text',
          x: 200,
          y: H - 140,
          width: W - 400,
          height: 30,
          text: 'Prepared by FigmaLite Creative Studio',
          fontFamily: theme.font,
          fontSize: 16,
          fontWeight: 500,
          fill: theme.muted,
          textAlign: 'center',
        }
      );
      break;
    }

    case 'title_content': {
      children.push(
        {
          id: `el_${Date.now()}_title`,
          name: 'Slide Title',
          type: 'text',
          x: 120,
          y: 100,
          width: W - 240,
          height: 70,
          text: title,
          fontFamily: theme.font,
          fontSize: 48,
          fontWeight: 800,
          fill: theme.text,
        },
        {
          id: `el_${Date.now()}_line`,
          name: 'Accent Rule',
          type: 'rounded_rect',
          x: 120,
          y: 180,
          width: 120,
          height: 6,
          cornerRadius: 3,
          fill: theme.accent,
        },
        {
          id: `el_${Date.now()}_card1`,
          name: 'Content Card 1',
          type: 'rounded_rect',
          x: 120,
          y: 240,
          width: W - 240,
          height: 180,
          cornerRadius: 24,
          fill: theme.surface,
          stroke: 'rgba(255,255,255,0.06)',
          strokeWidth: 1,
        },
        {
          id: `el_${Date.now()}_c1_title`,
          name: 'Point 1 Title',
          type: 'text',
          x: 160,
          y: 270,
          width: W - 320,
          height: 32,
          text: '1. Strategic Core Foundations',
          fontFamily: theme.font,
          fontSize: 24,
          fontWeight: 700,
          fill: theme.accent,
        },
        {
          id: `el_${Date.now()}_c1_desc`,
          name: 'Point 1 Body',
          type: 'text',
          x: 160,
          y: 310,
          width: W - 320,
          height: 70,
          text: 'Leveraging automated workflows and intelligent data structures to eliminate design friction and accelerate production cycles.',
          fontFamily: theme.font,
          fontSize: 18,
          fontWeight: 400,
          fill: theme.muted,
          lineHeight: 1.5,
        },
        {
          id: `el_${Date.now()}_card2`,
          name: 'Content Card 2',
          type: 'rounded_rect',
          x: 120,
          y: 460,
          width: W - 240,
          height: 180,
          cornerRadius: 24,
          fill: theme.surface,
          stroke: 'rgba(255,255,255,0.06)',
          strokeWidth: 1,
        },
        {
          id: `el_${Date.now()}_c2_title`,
          name: 'Point 2 Title',
          type: 'text',
          x: 160,
          y: 490,
          width: W - 320,
          height: 32,
          text: '2. Measurable Performance Impact',
          fontFamily: theme.font,
          fontSize: 24,
          fontWeight: 700,
          fill: theme.secondary,
        },
        {
          id: `el_${Date.now()}_c2_desc`,
          name: 'Point 2 Body',
          type: 'text',
          x: 160,
          y: 530,
          width: W - 320,
          height: 70,
          text: 'Deliver scalable cross-platform output with verified rendering precision, zero latency and persistent state rehydration.',
          fontFamily: theme.font,
          fontSize: 18,
          fontWeight: 400,
          fill: theme.muted,
          lineHeight: 1.5,
        },
        {
          id: `el_${Date.now()}_card3`,
          name: 'Content Card 3',
          type: 'rounded_rect',
          x: 120,
          y: 680,
          width: W - 240,
          height: 180,
          cornerRadius: 24,
          fill: theme.surface,
          stroke: 'rgba(255,255,255,0.06)',
          strokeWidth: 1,
        },
        {
          id: `el_${Date.now()}_c3_title`,
          name: 'Point 3 Title',
          type: 'text',
          x: 160,
          y: 710,
          width: W - 320,
          height: 32,
          text: '3. Next Generation Expansion',
          fontFamily: theme.font,
          fontSize: 24,
          fontWeight: 700,
          fill: '#10B981',
        },
        {
          id: `el_${Date.now()}_c3_desc`,
          name: 'Point 3 Body',
          type: 'text',
          x: 160,
          y: 750,
          width: W - 320,
          height: 70,
          text: 'Future-proof visual architecture designed for rapid collaboration, offline reliability and zero dependency overhead.',
          fontFamily: theme.font,
          fontSize: 18,
          fontWeight: 400,
          fill: theme.muted,
          lineHeight: 1.5,
        }
      );
      break;
    }

    case 'two_columns': {
      const colW = (W - 300) / 2;
      children.push(
        {
          id: `el_${Date.now()}_title`,
          name: 'Slide Title',
          type: 'text',
          x: 120,
          y: 100,
          width: W - 240,
          height: 70,
          text: title,
          fontFamily: theme.font,
          fontSize: 48,
          fontWeight: 800,
          fill: theme.text,
        },
        {
          id: `el_${Date.now()}_col1`,
          name: 'Left Column Card',
          type: 'rounded_rect',
          x: 120,
          y: 220,
          width: colW,
          height: 700,
          cornerRadius: 32,
          fill: theme.surface,
          stroke: theme.accent,
          strokeWidth: 1.5,
        },
        {
          id: `el_${Date.now()}_col1_t`,
          name: 'Left Header',
          type: 'text',
          x: 160,
          y: 270,
          width: colW - 80,
          height: 40,
          text: 'Current Challenges',
          fontFamily: theme.font,
          fontSize: 28,
          fontWeight: 700,
          fill: theme.accent,
        },
        {
          id: `el_${Date.now()}_col1_p`,
          name: 'Left Paragraph',
          type: 'text',
          x: 160,
          y: 330,
          width: colW - 80,
          height: 520,
          text: '• Fragmented design workflows slowing down team output\n\n• Inconsistent brand assets scattered across tools\n\n• High barrier to entry for non-technical team members\n\n• Cluttered interfaces with excessive button overload',
          fontFamily: theme.font,
          fontSize: 20,
          fontWeight: 400,
          fill: theme.muted,
          lineHeight: 1.6,
        },
        {
          id: `el_${Date.now()}_col2`,
          name: 'Right Column Card',
          type: 'rounded_rect',
          x: 180 + colW,
          y: 220,
          width: colW,
          height: 700,
          cornerRadius: 32,
          fill: theme.surface,
          stroke: theme.secondary,
          strokeWidth: 1.5,
        },
        {
          id: `el_${Date.now()}_col2_t`,
          name: 'Right Header',
          type: 'text',
          x: 220 + colW,
          y: 270,
          width: colW - 80,
          height: 40,
          text: 'Our Proposed Solution',
          fontFamily: theme.font,
          fontSize: 28,
          fontWeight: 700,
          fill: theme.secondary,
        },
        {
          id: `el_${Date.now()}_col2_p`,
          name: 'Right Paragraph',
          type: 'text',
          x: 220 + colW,
          y: 330,
          width: colW - 80,
          height: 520,
          text: '• Unified Canva-style simplicity with professional power\n\n• One-click presentation generation and slide templates\n\n• Instant cloudless local persistence in IndexedDB\n\n• Contextual toolbar showing only what you need',
          fontFamily: theme.font,
          fontSize: 20,
          fontWeight: 400,
          fill: theme.muted,
          lineHeight: 1.6,
        }
      );
      break;
    }

    case 'image_text': {
      children.push(
        {
          id: `el_${Date.now()}_title`,
          name: 'Slide Title',
          type: 'text',
          x: 120,
          y: 100,
          width: W - 240,
          height: 70,
          text: title,
          fontFamily: theme.font,
          fontSize: 48,
          fontWeight: 800,
          fill: theme.text,
        },
        {
          id: `el_${Date.now()}_img_card`,
          name: 'Visual Showcase Card',
          type: 'rounded_rect',
          x: 120,
          y: 220,
          width: 800,
          height: 700,
          cornerRadius: 32,
          fill: theme.surface,
          stroke: 'rgba(255,255,255,0.08)',
          strokeWidth: 1,
        },
        {
          id: `el_${Date.now()}_img_inner`,
          name: 'Graphic Display',
          type: 'rounded_rect',
          x: 160,
          y: 260,
          width: 720,
          height: 620,
          cornerRadius: 24,
          fill: `linear-gradient(135deg, ${theme.accent}, ${theme.secondary})`,
        },
        {
          id: `el_${Date.now()}_img_txt`,
          name: 'Graphic Label',
          type: 'text',
          x: 200,
          y: 530,
          width: 640,
          height: 60,
          text: 'Interactive Visual Asset',
          fontFamily: theme.font,
          fontSize: 32,
          fontWeight: 800,
          fill: '#FFFFFF',
          textAlign: 'center',
        },
        {
          id: `el_${Date.now()}_text_header`,
          name: 'Narrative Header',
          type: 'text',
          x: 980,
          y: 240,
          width: 800,
          height: 48,
          text: 'Design Crafted For Maximum Impact',
          fontFamily: theme.font,
          fontSize: 32,
          fontWeight: 700,
          fill: theme.text,
        },
        {
          id: `el_${Date.now()}_text_body`,
          name: 'Narrative Body',
          type: 'text',
          x: 980,
          y: 310,
          width: 800,
          height: 400,
          text: 'Every presentation element is dynamically calculated to ensure harmonious visual rhythm, balanced negative space, and crystal-clear contrast on any display device.\n\nCustomizable in real time with our contextual top ribbon and intuitive drag-and-drop elements panel.',
          fontFamily: theme.font,
          fontSize: 20,
          fontWeight: 400,
          fill: theme.muted,
          lineHeight: 1.6,
        },
        {
          id: `el_${Date.now()}_cta`,
          name: 'Badge Highlight',
          type: 'rounded_rect',
          x: 980,
          y: 760,
          width: 320,
          height: 64,
          cornerRadius: 20,
          fill: theme.accent,
        },
        {
          id: `el_${Date.now()}_cta_t`,
          name: 'Badge Text',
          type: 'text',
          x: 980,
          y: 780,
          width: 320,
          height: 24,
          text: 'Explore Keynote Features →',
          fontFamily: theme.font,
          fontSize: 16,
          fontWeight: 700,
          fill: '#FFFFFF',
          textAlign: 'center',
        }
      );
      break;
    }

    case 'stats_metrics': {
      const cardW = (W - 320) / 3;
      children.push(
        {
          id: `el_${Date.now()}_title`,
          name: 'Slide Title',
          type: 'text',
          x: 120,
          y: 100,
          width: W - 240,
          height: 70,
          text: title,
          fontFamily: theme.font,
          fontSize: 48,
          fontWeight: 800,
          fill: theme.text,
        },
        {
          id: `el_${Date.now()}_kpi1`,
          name: 'Metric Card 1',
          type: 'rounded_rect',
          x: 120,
          y: 240,
          width: cardW,
          height: 660,
          cornerRadius: 32,
          fill: theme.surface,
          stroke: theme.accent,
          strokeWidth: 1.5,
        },
        {
          id: `el_${Date.now()}_v1`,
          name: 'Value 1',
          type: 'text',
          x: 150,
          y: 320,
          width: cardW - 60,
          height: 90,
          text: '10x',
          fontFamily: theme.font,
          fontSize: 80,
          fontWeight: 900,
          fill: theme.accent,
          textAlign: 'center',
        },
        {
          id: `el_${Date.now()}_l1`,
          name: 'Label 1',
          type: 'text',
          x: 150,
          y: 430,
          width: cardW - 60,
          height: 36,
          text: 'Faster Creation Speed',
          fontFamily: theme.font,
          fontSize: 22,
          fontWeight: 700,
          fill: theme.text,
          textAlign: 'center',
        },
        {
          id: `el_${Date.now()}_d1`,
          name: 'Desc 1',
          type: 'text',
          x: 160,
          y: 480,
          width: cardW - 80,
          height: 300,
          text: 'Instant layout generation allows users to build complete multi-slide presentations in minutes.',
          fontFamily: theme.font,
          fontSize: 16,
          fontWeight: 400,
          fill: theme.muted,
          textAlign: 'center',
          lineHeight: 1.5,
        },
        {
          id: `el_${Date.now()}_kpi2`,
          name: 'Metric Card 2',
          type: 'rounded_rect',
          x: 160 + cardW,
          y: 240,
          width: cardW,
          height: 660,
          cornerRadius: 32,
          fill: theme.surface,
          stroke: theme.secondary,
          strokeWidth: 1.5,
        },
        {
          id: `el_${Date.now()}_v2`,
          name: 'Value 2',
          type: 'text',
          x: 190 + cardW,
          y: 320,
          width: cardW - 60,
          height: 90,
          text: '99.8%',
          fontFamily: theme.font,
          fontSize: 80,
          fontWeight: 900,
          fill: theme.secondary,
          textAlign: 'center',
        },
        {
          id: `el_${Date.now()}_l2`,
          name: 'Label 2',
          type: 'text',
          x: 190 + cardW,
          y: 430,
          width: cardW - 60,
          height: 36,
          text: 'User Satisfaction',
          fontFamily: theme.font,
          fontSize: 22,
          fontWeight: 700,
          fill: theme.text,
          textAlign: 'center',
        },
        {
          id: `el_${Date.now()}_d2`,
          name: 'Desc 2',
          type: 'text',
          x: 200 + cardW,
          y: 480,
          width: cardW - 80,
          height: 300,
          text: 'Designed specifically for both beginners and experienced creators needing fast results.',
          fontFamily: theme.font,
          fontSize: 16,
          fontWeight: 400,
          fill: theme.muted,
          textAlign: 'center',
          lineHeight: 1.5,
        },
        {
          id: `el_${Date.now()}_kpi3`,
          name: 'Metric Card 3',
          type: 'rounded_rect',
          x: 200 + cardW * 2,
          y: 240,
          width: cardW,
          height: 660,
          cornerRadius: 32,
          fill: theme.surface,
          stroke: '#10B981',
          strokeWidth: 1.5,
        },
        {
          id: `el_${Date.now()}_v3`,
          name: 'Value 3',
          type: 'text',
          x: 230 + cardW * 2,
          y: 320,
          width: cardW - 60,
          height: 90,
          text: '100%',
          fontFamily: theme.font,
          fontSize: 80,
          fontWeight: 900,
          fill: '#10B981',
          textAlign: 'center',
        },
        {
          id: `el_${Date.now()}_l3`,
          name: 'Label 3',
          type: 'text',
          x: 230 + cardW * 2,
          y: 430,
          width: cardW - 60,
          height: 36,
          text: 'Offline & Local Privacy',
          fontFamily: theme.font,
          fontSize: 22,
          fontWeight: 700,
          fill: theme.text,
          textAlign: 'center',
        },
        {
          id: `el_${Date.now()}_d3`,
          name: 'Desc 3',
          type: 'text',
          x: 240 + cardW * 2,
          y: 480,
          width: cardW - 80,
          height: 300,
          text: 'All slides, assets and documents persist directly in your browser with zero server latency.',
          fontFamily: theme.font,
          fontSize: 16,
          fontWeight: 400,
          fill: theme.muted,
          textAlign: 'center',
          lineHeight: 1.5,
        }
      );
      break;
    }

    case 'section_header': {
      children.push(
        {
          id: `el_${Date.now()}_bg_accent`,
          name: 'Section Glow',
          type: 'ellipse',
          x: W / 2 - 400,
          y: H / 2 - 400,
          width: 800,
          height: 800,
          fill: theme.secondary,
          opacity: 0.2,
          blur: 140,
        },
        {
          id: `el_${Date.now()}_sec_num`,
          name: 'Section Number',
          type: 'text',
          x: 160,
          y: H / 2 - 140,
          width: W - 320,
          height: 48,
          text: 'CHAPTER / SECTION',
          fontFamily: theme.font,
          fontSize: 24,
          fontWeight: 700,
          fill: theme.accent,
          textAlign: 'center',
          letterSpacing: 4,
        },
        {
          id: `el_${Date.now()}_sec_t`,
          name: 'Section Heading',
          type: 'text',
          x: 160,
          y: H / 2 - 70,
          width: W - 320,
          height: 120,
          text: title,
          fontFamily: theme.font,
          fontSize: 64,
          fontWeight: 900,
          fill: theme.text,
          textAlign: 'center',
        },
        {
          id: `el_${Date.now()}_sec_d`,
          name: 'Section Subtitle',
          type: 'text',
          x: 240,
          y: H / 2 + 70,
          width: W - 480,
          height: 60,
          text: subtitle || 'Deep dive into implementation, methodology and outcomes',
          fontFamily: theme.font,
          fontSize: 22,
          fontWeight: 400,
          fill: theme.muted,
          textAlign: 'center',
        }
      );
      break;
    }

    case 'quote': {
      children.push(
        {
          id: `el_${Date.now()}_q_card`,
          name: 'Quote Card',
          type: 'rounded_rect',
          x: 200,
          y: 200,
          width: W - 400,
          height: 680,
          cornerRadius: 40,
          fill: theme.surface,
          stroke: theme.accent,
          strokeWidth: 2,
        },
        {
          id: `el_${Date.now()}_q_mark`,
          name: 'Quote Mark',
          type: 'text',
          x: 280,
          y: 240,
          width: 120,
          height: 100,
          text: '“',
          fontFamily: theme.font,
          fontSize: 140,
          fontWeight: 900,
          fill: theme.accent,
          opacity: 0.5,
        },
        {
          id: `el_${Date.now()}_q_text`,
          name: 'Quote Body',
          type: 'text',
          x: 280,
          y: 360,
          width: W - 560,
          height: 280,
          text: title || 'Simplicity is about subtracting the obvious and adding the meaningful.',
          fontFamily: theme.font,
          fontSize: 40,
          fontWeight: 600,
          fill: theme.text,
          lineHeight: 1.4,
        },
        {
          id: `el_${Date.now()}_q_author`,
          name: 'Quote Author',
          type: 'text',
          x: 280,
          y: 720,
          width: W - 560,
          height: 40,
          text: subtitle || '— John Maeda, The Laws of Simplicity',
          fontFamily: theme.font,
          fontSize: 22,
          fontWeight: 700,
          fill: theme.accent,
        }
      );
      break;
    }

    case 'chart': {
      children.push(
        {
          id: `el_${Date.now()}_title`,
          name: 'Slide Title',
          type: 'text',
          x: 120,
          y: 100,
          width: W - 240,
          height: 70,
          text: title,
          fontFamily: theme.font,
          fontSize: 48,
          fontWeight: 800,
          fill: theme.text,
        },
        {
          id: `el_${Date.now()}_chart_el`,
          name: 'Interactive Chart',
          type: 'chart',
          chartType: 'bar',
          x: 120,
          y: 220,
          width: 1100,
          height: 700,
          fill: theme.accent,
          cornerRadius: 24,
          chartData: [
            { label: 'Q1 Growth', value: 340 },
            { label: 'Q2 Growth', value: 580 },
            { label: 'Q3 Growth', value: 890 },
            { label: 'Q4 Projection', value: 1240 },
          ],
        },
        {
          id: `el_${Date.now()}_summary_card`,
          name: 'Insights Card',
          type: 'rounded_rect',
          x: 1260,
          y: 220,
          width: W - 1380,
          height: 700,
          cornerRadius: 32,
          fill: theme.surface,
          stroke: 'rgba(255,255,255,0.08)',
          strokeWidth: 1,
        },
        {
          id: `el_${Date.now()}_ins_title`,
          name: 'Key Takeaways',
          type: 'text',
          x: 1300,
          y: 260,
          width: W - 1460,
          height: 40,
          text: 'Data Summary',
          fontFamily: theme.font,
          fontSize: 28,
          fontWeight: 700,
          fill: theme.accent,
        },
        {
          id: `el_${Date.now()}_ins_body`,
          name: 'Takeaways Text',
          type: 'text',
          x: 1300,
          y: 320,
          width: W - 1460,
          height: 540,
          text: '• 365% overall adoption velocity over the trailing 12 months\n\n• Q4 projection establishes clear market leadership\n\n• Sustained compounding retention across user segments',
          fontFamily: theme.font,
          fontSize: 18,
          fontWeight: 400,
          fill: theme.muted,
          lineHeight: 1.6,
        }
      );
      break;
    }

    case 'timeline': {
      const stepW = (W - 320) / 4;
      children.push(
        {
          id: `el_${Date.now()}_title`,
          name: 'Slide Title',
          type: 'text',
          x: 120,
          y: 100,
          width: W - 240,
          height: 70,
          text: title,
          fontFamily: theme.font,
          fontSize: 48,
          fontWeight: 800,
          fill: theme.text,
        },
        {
          id: `el_${Date.now()}_line`,
          name: 'Connecting Track',
          type: 'rounded_rect',
          x: 160,
          y: 380,
          width: W - 320,
          height: 8,
          cornerRadius: 4,
          fill: theme.surface,
        }
      );

      const phases = [
        { num: '01', title: 'Research & Discovery', date: 'Phase 1' },
        { num: '02', title: 'Architecture & Design', date: 'Phase 2' },
        { num: '03', title: 'Execution & Beta', date: 'Phase 3' },
        { num: '04', title: 'Global Launch', date: 'Phase 4' },
      ];

      phases.forEach((p, idx) => {
        const px = 120 + idx * stepW;
        children.push(
          {
            id: `el_${Date.now()}_dot_${idx}`,
            name: `Step ${p.num} Node`,
            type: 'ellipse',
            x: px + stepW / 2 - 24,
            y: 360,
            width: 48,
            height: 48,
            fill: idx === 0 ? theme.accent : idx === 1 ? theme.secondary : theme.surface,
            stroke: theme.accent,
            strokeWidth: 2,
          },
          {
            id: `el_${Date.now()}_card_${idx}`,
            name: `Step Card ${idx + 1}`,
            type: 'rounded_rect',
            x: px + 10,
            y: 450,
            width: stepW - 20,
            height: 400,
            cornerRadius: 24,
            fill: theme.surface,
            stroke: 'rgba(255,255,255,0.06)',
            strokeWidth: 1,
          },
          {
            id: `el_${Date.now()}_dt_${idx}`,
            name: `Date ${idx + 1}`,
            type: 'text',
            x: px + 30,
            y: 480,
            width: stepW - 60,
            height: 24,
            text: p.date,
            fontFamily: theme.font,
            fontSize: 14,
            fontWeight: 700,
            fill: theme.accent,
          },
          {
            id: `el_${Date.now()}_st_${idx}`,
            name: `Step Title ${idx + 1}`,
            type: 'text',
            x: px + 30,
            y: 510,
            width: stepW - 60,
            height: 60,
            text: p.title,
            fontFamily: theme.font,
            fontSize: 20,
            fontWeight: 700,
            fill: theme.text,
          }
        );
      });
      break;
    }

    case 'blank':
    default:
      break;
  }

  const frame = {
    id: frameId,
    name: title || 'Slide Canvas',
    type: 'frame',
    x: 0,
    y: 0,
    width: W,
    height: H,
    fill: theme.bg,
    cornerRadius: 0,
    stroke: 'transparent',
    strokeWidth: 0,
    children: children,
  };

  return [frame];
}

export function generatePresentationFromTopic({
  topic = 'New Venture Pitch Deck',
  slideCount = 8,
  audience = 'General',
  styleKey = 'modern'
}) {
  const count = Number(slideCount) || 8;
  const theme = PRESENTATION_STYLES[styleKey] || PRESENTATION_STYLES.modern;

  const topicTemplates = [
    { layout: 'title', title: topic, subtitle: `Executive presentation tailored for ${audience}` },
    { layout: 'two_columns', title: 'Problem & Market Need', subtitle: 'Analyzing existing industry bottlenecks' },
    { layout: 'title_content', title: 'Core Strategic Solution', subtitle: 'Our differentiated product vision' },
    { layout: 'image_text', title: 'Product Architecture & UX', subtitle: 'Delivering seamless user journeys' },
    { layout: 'stats_metrics', title: 'Key Performance Metrics', subtitle: 'Traction and benchmark outcomes' },
    { layout: 'chart', title: 'Market Opportunity & Growth', subtitle: 'Quantifiable expansion trajectory' },
    { layout: 'timeline', title: 'Implementation Roadmap', subtitle: 'Key deployment milestones' },
    { layout: 'quote', title: '“Empowering creators through effortless design.”', subtitle: '— Leadership Vision' },
    { layout: 'title_content', title: 'Competitive Advantage', subtitle: 'Defensible differentiation' },
    { layout: 'stats_metrics', title: 'Unit Economics & ROI', subtitle: 'Financial resilience and scalability' },
    { layout: 'section_header', title: 'Summary & Next Steps', subtitle: 'Actionable path forward' },
  ];

  const selectedBlueprints = topicTemplates.slice(0, count);

  const pages = selectedBlueprints.map((blueprint, index) => {
    const pageId = `page_slide_${index + 1}_${Date.now()}`;
    const slideElements = createSlideElements(
      blueprint.layout,
      blueprint.title,
      blueprint.subtitle,
      styleKey
    );

    return {
      id: pageId,
      name: `Slide ${index + 1}: ${blueprint.title.substring(0, 24)}`,
      background: theme.bg,
      notes: `Speaker Notes for Slide ${index + 1}: Introduce "${blueprint.title}" to the ${audience}. Emphasize key takeaways clearly.`,
      elements: slideElements,
    };
  });

  return {
    id: `pres_${Date.now()}`,
    name: `${topic} — Presentation`,
    description: `Auto-generated presentation for ${audience} using ${theme.name} style.`,
    isPresentation: true,
    styleKey: styleKey,
    updatedAt: new Date().toISOString(),
    pages: pages,
    prototypes: [],
    comments: [],
    components: {},
    styles: {},
  };
}

export function applyDesignStyleToProject(project, styleKey) {
  const theme = PRESENTATION_STYLES[styleKey] || PRESENTATION_STYLES.modern;

  const newPages = project.pages.map((p) => {
    const newElements = p.elements.map((el) => {
      if (el.type === 'frame') {
        const newChildren = (el.children || []).map((child) => {
          if (child.type === 'text') {
            const isHeading = (child.fontSize || 16) >= 28;
            return {
              ...child,
              fontFamily: theme.font,
              fill: isHeading ? theme.text : theme.muted,
            };
          }
          if (child.type === 'rounded_rect' || child.type === 'rectangle') {
            return {
              ...child,
              fill: child.fill === '#6366F1' ? theme.accent : theme.surface,
            };
          }
          if (child.type === 'ellipse') {
            return {
              ...child,
              fill: theme.accent,
            };
          }
          return child;
        });

        return {
          ...el,
          fill: theme.bg,
          children: newChildren,
        };
      }
      return el;
    });

    return {
      ...p,
      background: theme.bg,
      elements: newElements,
    };
  });

  return {
    ...project,
    styleKey: styleKey,
    pages: newPages,
    updatedAt: new Date().toISOString(),
  };
}

export function checkPresentationConsistency(project) {
  const issues = [];
  let totalWords = 0;

  project.pages.forEach((p, pIdx) => {
    (p.elements || []).forEach((el) => {
      if (el.type === 'frame') {
        (el.children || []).forEach((child) => {
          if (child.type === 'text') {
            totalWords += (child.text || '').split(/\s+/).length;
            if (child.x + child.width > el.width) {
              issues.push({
                id: `overflow_${child.id}`,
                slideNumber: pIdx + 1,
                elementName: child.name,
                type: 'overflow',
                message: `Text on Slide ${pIdx + 1} extends past the slide boundary`,
              });
            }
          }
        });
      }
    });
  });

  return {
    issues,
    slideCount: project.pages.length,
    totalWords,
    isConsistent: issues.length === 0,
  };
}
