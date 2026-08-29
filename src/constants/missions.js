export const DESIGN_MISSIONS = [
  {
    id: 'mission_saas',
    title: 'Create a SaaS Landing Page',
    description: 'Design a responsive marketing landing page with header navigation, hero section, CTA, and feature highlights.',
    difficulty: 'Intermediate',
    reward: 'Product Designer Badge',
    requirements: [
      { id: 'req_frame', label: 'Create at least one Desktop or Mobile Frame', check: (elements) => elements.some((el) => el.type === 'frame') },
      { id: 'req_nav', label: 'Add Navigation Bar / Header', check: (elements) => elements.some((el) => el.name.toLowerCase().includes('nav') || el.name.toLowerCase().includes('header')) },
      { id: 'req_h1', label: 'Add Main Hero Headline (FontSize >= 32px)', check: (elements) => elements.some((el) => el.type === 'text' && (el.fontSize || 0) >= 32) },
      { id: 'req_cta', label: 'Create CTA Button with rounded corners', check: (elements) => elements.some((el) => el.name.toLowerCase().includes('btn') || el.name.toLowerCase().includes('cta') || el.name.toLowerCase().includes('button')) },
      { id: 'req_tokens', label: 'Use Consistent Colors & Gradients', check: (elements) => elements.length >= 4 },
      { id: 'req_components', label: 'Create Master Component or Instance', check: (elements, project) => Object.keys(project.components || {}).length > 0 || elements.some((el) => el.isMasterComponent) },
    ]
  },
  {
    id: 'mission_mobile_app',
    title: 'Design a Mobile Wallet App',
    description: 'Build interactive mobile screens with balance card, transaction list, and prototype interactions.',
    difficulty: 'Advanced',
    reward: 'UX Master Badge',
    requirements: [
      { id: 'req_mobile_frames', label: 'Create at least 2 Mobile Frames (375-430px wide)', check: (elements) => elements.filter((el) => el.type === 'frame' && el.width <= 500).length >= 2 },
      { id: 'req_prototype', label: 'Connect frames with Prototype Interaction Wire', check: (elements, project) => (project.prototypes || []).length > 0 },
      { id: 'req_card', label: 'Design a Card Surface with Corner Radius', check: (elements) => elements.some((el) => (el.cornerRadius || 0) >= 16) },
      { id: 'req_comments', label: 'Add a Feedback Comment Pin', check: (elements, project) => (project.comments || []).length > 0 },
    ]
  }
];
export function evaluateMissionProgress(mission, elements, project) {
  let completed = 0;
  const checklist = mission.requirements.map((req) => {
    const passed = Boolean(req.check(elements, project));
    if (passed) completed += 1;
    return { ...req, passed };
  });
  const percentage = Math.round((completed / mission.requirements.length) * 100);
  return { checklist, percentage, isComplete: percentage === 100 };
}