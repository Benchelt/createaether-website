import type {
    ExperienceStateData
} from '../ExperienceState';

export type VisualEffectCategory =
    | 'lighting'
    | 'fog'
    | 'particles'
    | 'weather'
    | 'camera'
    | 'post-processing';

export interface VisualEffect {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly version: string;
    readonly category: VisualEffectCategory;

    enabled: boolean;

    initialise?(): void;
    start?(): void;

    update(
        state: ExperienceStateData
    ): void;

    stop?(): void;
    destroy?(): void;
}