import {
  Activity,
  BarChart3,
  ClipboardList,
  Database,
  Facebook,
  FileBarChart,
  Gauge,
  Github,
  Globe2,
  Layers,
  Leaf,
  LineChart,
  Linkedin,
  Map,
  PenTool,
  PieChart,
  Search,
  Shield,
  Sparkles,
  Target,
  Twitter,
  Users,
  Workflow,
  Youtube,
  type LucideIcon,
} from "lucide-react";

import type { SocialPlatform } from "@/lib/queries";

const iconMap: Record<string, LucideIcon> = {
  barChart: BarChart3,
  lineChart: LineChart,
  pieChart: PieChart,
  activity: Activity,
  target: Target,
  database: Database,
  workflow: Workflow,
  globe: Globe2,
  leaf: Leaf,
  shield: Shield,
  map: Map,
  users: Users,
  clipboard: ClipboardList,
  gauge: Gauge,
  layers: Layers,
  search: Search,
  fileChart: FileBarChart,
  sparkles: Sparkles,
};

export function resolveIcon(key: string | undefined | null): LucideIcon {
  if (!key) return Sparkles;
  return iconMap[key] ?? Sparkles;
}

const socialMap: Record<SocialPlatform, LucideIcon> = {
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  facebook: Facebook,
  youtube: Youtube,
  medium: PenTool,
};

export function resolveSocialIcon(platform: SocialPlatform): LucideIcon {
  return socialMap[platform] ?? Globe2;
}
