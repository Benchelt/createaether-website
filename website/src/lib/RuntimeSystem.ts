import type {
    ExperienceStateData
} from './ExperienceState';

export interface RuntimeSystem {
    readonly id: string;
    readonly version: string;
    readonly priority: number;
    enabled: boolean;

    initialise?(): void;
    start?(): void;
    update(state: ExperienceStateData): void;
    stop?(): void;
    destroy?(): void;
}

export interface RuntimeSystemDetails {
    id: string;
    version: string;
    priority: number;
    enabled: boolean;
}
