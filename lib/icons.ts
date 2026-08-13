import {
  Nut,
  Layers,
  Zap,
  Pipette,
  Hammer,
  Package,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Nut,
  Layers,
  Zap,
  Pipette,
  Hammer,
  Package,
};

export function getCategoryIcon(iconName: string | null | undefined): LucideIcon {
  if (iconName && iconMap[iconName]) return iconMap[iconName];
  return Package;
}
