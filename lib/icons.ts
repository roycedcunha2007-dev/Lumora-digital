import {
  PenTool,
  Code2,
  MonitorSmartphone,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Rocket,
  Wand2,
  Gem,
  Wallet,
  Zap,
  Layers,
  HeartHandshake,
  MousePointerClick,
  Search,
  Map,
  Palette,
  Bug,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  PenTool,
  Code2,
  MonitorSmartphone,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Rocket,
  Wand2,
  Gem,
  Wallet,
  Zap,
  Layers,
  HeartHandshake,
  MousePointerClick,
  Search,
  Map,
  Palette,
  Bug,
  LifeBuoy,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Sparkles;
}
