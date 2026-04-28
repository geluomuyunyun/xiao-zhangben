/**
 * Animation System — Central Preset Registry
 *
 * All animation types must be defined here.
 * Components must reference these presets — inline animation logic is prohibited.
 * To add a new animation: extend AnimationPreset, add config to ANIMATION_PRESETS.
 */

export type AnimationPreset = 'none' | 'scale';

export interface AnimationConfig {
  duration: number;
  backdrop: boolean;
  panel: {
    property: string;
    from: Record<string, string | number>;
    to: Record<string, string | number>;
  } | null;
}

export const ANIMATION_PRESETS: Record<AnimationPreset, AnimationConfig> = {
  none: {
    duration: 0,
    backdrop: false,
    panel: null,
  },
  scale: {
    duration: 300,
    backdrop: true,
    panel: {
      property: 'transition-all',
      from: { opacity: 0, transform: 'scale(0.9)' },
      to: { opacity: 1, transform: 'scale(1)' },
    },
  },
};
