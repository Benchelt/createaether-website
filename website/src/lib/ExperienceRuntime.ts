import type {
    ExperienceStateData
} from './ExperienceState';

import {
    RuntimeEvents
} from './RuntimeEvents';

export interface ExperienceRuntimeSystem {
    update(state: ExperienceStateData): void;
}

export class ExperienceRuntime {
    private readonly systems =
        new Set<ExperienceRuntimeSystem>();

    public readonly events:
        RuntimeEvents;

    constructor(
        systems: ExperienceRuntimeSystem[] = [],
        events: RuntimeEvents = new RuntimeEvents()
    ) {
        this.events = events;

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
        this.events.emit(
            'runtime:update-start',
            { state }
        );

        this.systems.forEach((system) => {
            try {
                system.update(state);
            } catch (error) {
                console.error(
                    'Runtime system failed.',
                    system,
                    error
                );
            }
        });

        this.events.emit(
            'runtime:update-complete',
            { state }
        );
    }

    public count(): number {
        return this.systems.size;
    }
}
