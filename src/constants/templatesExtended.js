import { DEMO_PROJECTS } from './templates';
export const TEMPLATE_CATEGORIES = [
  'All',
  'Social Media',
  'Marketing',
  'Business',
  'Web & Apps',
];
export const EXTENDED_TEMPLATES = [
  ...DEMO_PROJECTS,
  {
    id: 'tpl_instagram_post',
    name: 'Cyber Monday — Instagram Post',
    category: 'Social Media',
    description: 'Vibrant 1080x1080 social media sale poster with neon gradients and bold typography.',
    updatedAt: new Date().toISOString(),
    pages: [
      {
        id: 'page_ig_post',
        name: 'Instagram Post (1080x1080)',
        background: '#09090B',
        elements: [
          {
            id: 'frame_ig_post',
            name: 'Instagram Square (1080x1080)',
            type: 'frame',
            x: 80,
            y: 80,
            width: 1080,
            height: 1080,
            fill: '#0A0A0C',
            cornerRadius: 0,
            stroke: '#27272A',
            strokeWidth: 1,
            children: [
              {
                id: 'ig_glow',
                name: 'Neon Glow',
                type: 'ellipse',
                x: 300,
                y: 200,
                width: 500,
                height: 500,
                fill: '#EC4899',
                opacity: 0.25,
                blur: 80,
              },
              {
                id: 'ig_badge',
                name: 'Limited Deal Pill',
                type: 'rounded_rect',
                x: 390,
                y: 180,
                width: 300,
                height: 48,
                cornerRadius: 24,
                fill: '#F43F5E',
              },
              {
                id: 'ig_badge_text',
                name: 'Badge Text',
                type: 'text',
                x: 390,
                y: 194,
                width: 300,
                height: 24,
                text: '⚡ 70% OFF CYBER SALE',
                fontFamily: 'Plus Jakarta Sans',
                fontSize: 16,
                fontWeight: 800,
                fill: '#FFFFFF',
                textAlign: 'center',
              },
              {
                id: 'ig_headline',
                name: 'Big Headline',
                type: 'text',
                x: 100,
                y: 300,
                width: 880,
                height: 220,
                text: 'FUTURE OF AUDIO EXPERIENCE',
                fontFamily: 'Plus Jakarta Sans',
                fontSize: 68,
                fontWeight: 900,
                fill: '#FFFFFF',
                textAlign: 'center',
                lineHeight: 1.1,
              },
              {
                id: 'ig_cta',
                name: 'Shop Button',
                type: 'rounded_rect',
                x: 390,
                y: 780,
                width: 300,
                height: 72,
                cornerRadius: 36,
                fill: '#6366F1',
              },
              {
                id: 'ig_cta_text',
                name: 'Shop Label',
                type: 'text',
                x: 390,
                y: 804,
                width: 300,
                height: 30,
                text: 'SHOP NOW →',
                fontFamily: 'Inter',
                fontSize: 20,
                fontWeight: 800,
                fill: '#FFFFFF',
                textAlign: 'center',
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'tpl_youtube_thumb',
    name: 'Pro Coding — YouTube Thumbnail',
    category: 'Social Media',
    description: 'High-contrast 1280x720 video thumbnail with gradient backdrop, badges, and bold title.',
    updatedAt: new Date().toISOString(),
    pages: [
      {
        id: 'page_yt_thumb',
        name: 'Thumbnail Page',
        background: '#09090B',
        elements: [
          {
            id: 'frame_yt_thumb',
            name: 'YouTube 16:9 (1280x720)',
            type: 'frame',
            x: 80,
            y: 80,
            width: 1280,
            height: 720,
            fill: '#0F172A',
            cornerRadius: 0,
            stroke: '#1E293B',
            strokeWidth: 1,
            children: [
              {
                id: 'yt_title_h1',
                name: 'Video Title',
                type: 'text',
                x: 80,
                y: 200,
                width: 700,
                height: 180,
                text: 'BUILD FIGMA IN REACT FROM SCRATCH',
                fontFamily: 'Plus Jakarta Sans',
                fontSize: 54,
                fontWeight: 900,
                fill: '#FACC15',
                lineHeight: 1.1,
              },
              {
                id: 'yt_badge_tag',
                name: 'Tag Badge',
                type: 'rounded_rect',
                x: 80,
                y: 120,
                width: 180,
                height: 44,
                cornerRadius: 10,
                fill: '#EF4444',
              },
              {
                id: 'yt_badge_text',
                name: 'Tag Text',
                type: 'text',
                x: 80,
                y: 132,
                width: 180,
                height: 24,
                text: 'FULL COURSE',
                fontFamily: 'Inter',
                fontSize: 16,
                fontWeight: 800,
                fill: '#FFFFFF',
                textAlign: 'center',
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'tpl_business_presentation',
    name: 'Pitch Deck — Presentation Slide',
    category: 'Business',
    description: 'Clean 1920x1080 presentation slide with metrics cards, clean typography, and branding.',
    updatedAt: new Date().toISOString(),
    pages: [
      {
        id: 'page_deck_slide',
        name: 'Slide 1: Overview',
        background: '#09090B',
        elements: [
          {
            id: 'frame_deck_slide',
            name: 'Slide 16:9 (1920x1080)',
            type: 'frame',
            x: 80,
            y: 80,
            width: 1920,
            height: 1080,
            fill: '#0B0F19',
            cornerRadius: 0,
            stroke: '#1E293B',
            strokeWidth: 2,
            children: [
              {
                id: 'deck_title',
                name: 'Slide Title',
                type: 'text',
                x: 120,
                y: 120,
                width: 1200,
                height: 80,
                text: 'Market Opportunity & Growth Metrics',
                fontFamily: 'Plus Jakarta Sans',
                fontSize: 56,
                fontWeight: 800,
                fill: '#FFFFFF',
              },
              {
                id: 'deck_card_1',
                name: 'Metric Card 1',
                type: 'rounded_rect',
                x: 120,
                y: 300,
                width: 500,
                height: 380,
                cornerRadius: 24,
                fill: '#131927',
                stroke: '#1E293B',
                strokeWidth: 1,
              },
              {
                id: 'deck_metric_num_1',
                name: 'Stat 1',
                type: 'text',
                x: 160,
                y: 360,
                width: 420,
                height: 80,
                text: '$14.2B',
                fontFamily: 'Plus Jakarta Sans',
                fontSize: 64,
                fontWeight: 800,
                fill: '#38BDF8',
              },
              {
                id: 'deck_metric_desc_1',
                name: 'Stat Description 1',
                type: 'text',
                x: 160,
                y: 460,
                width: 420,
                height: 100,
                text: 'Total Addressable Market projected for browser-native collaborative design tools by 2028.',
                fontFamily: 'Inter',
                fontSize: 20,
                fontWeight: 400,
                fill: '#94A3B8',
                lineHeight: 1.5,
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'tpl_flyer_marketing',
    name: 'Event Showcase — Marketing Flyer',
    category: 'Marketing',
    description: 'Modern portrait marketing flyer with gradient header, speaker cards, and registration barcode.',
    updatedAt: new Date().toISOString(),
    pages: [
      {
        id: 'page_flyer',
        name: 'Flyer Page (800x1100)',
        background: '#09090B',
        elements: [
          {
            id: 'frame_flyer',
            name: 'Event Flyer',
            type: 'frame',
            x: 80,
            y: 80,
            width: 800,
            height: 1100,
            fill: '#080C14',
            cornerRadius: 0,
            stroke: '#1E293B',
            strokeWidth: 1,
            children: [
              {
                id: 'flyer_header_card',
                name: 'Header Banner',
                type: 'rounded_rect',
                x: 40,
                y: 40,
                width: 720,
                height: 380,
                cornerRadius: 24,
                fill: 'linear-gradient(135deg, #6366F1, #EC4899)',
              },
              {
                id: 'flyer_h1',
                name: 'Flyer Title',
                type: 'text',
                x: 80,
                y: 120,
                width: 640,
                height: 120,
                text: 'GLOBAL DESIGN SUMMIT 2026',
                fontFamily: 'Plus Jakarta Sans',
                fontSize: 48,
                fontWeight: 900,
                fill: '#FFFFFF',
                textAlign: 'center',
                lineHeight: 1.1,
              }
            ]
          }
        ]
      }
    ]
  }
];