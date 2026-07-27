import type {
    ExperienceStateData
} from './ExperienceState';

export interface ExperienceRuntimeSystem {
    update(state: ExperienceStateData): void;
}

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
        if (
            !system ||
            typeof system.update !== 'function'
        ) {
            throw new TypeError(
                'Experience runtime systems must provide an update method.'
            );
        }

        this.systems.add(system);

        return () => {
            this.systems.delete(system);
        };
    }

    public update(state: ExperienceStateData): void {
        this.systems.forEach((system) => {
            system.update(state);
        });
    }

    public count(): number {
        return this.systems.size;
    }
}
