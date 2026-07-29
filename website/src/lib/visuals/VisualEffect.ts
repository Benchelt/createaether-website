import type {
    ExperienceStateData
} from '../ExperienceState';

export interface VisualEffect {
    readonly id: string;
    readonly version: string;

    enabled: boolean;

    initialise?(): void;
    start?(): void;

    update(
        state: ExperienceStateData
    ): void;

    stop?(): void;
    destroy?(): void;
}