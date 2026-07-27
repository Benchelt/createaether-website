import type {
    ExperienceStateData
} from './ExperienceState';

export type ExperienceRuntimeSystem = (
    state: ExperienceStateData
) => void;

export class ExperienceRuntime {
    private readonly systems =
        new Set<ExperienceRuntimeSystem>();

    constructor(
        systems: ExperienceRuntimeSystem[] = []
    ) {
        systems.forEach((system) => {
            this.register(system);
        });
    }

    public register(
        system: ExperienceRuntimeSystem
    ): () => void {
        if (typeof system !== 'function') {
            throw new TypeError(
                'Experience runtime systems must be functions.'
            );
        }

        this.systems.add(system);

        return () => {
            this.systems.delete(system);
        };
    }

    public update(state: ExperienceStateData): void {
        this.systems.forEach((system) => {
            system(state);
        });
    }

    public count(): number {
        return this.systems.size;
    }
}
