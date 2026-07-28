import type {
    ExperienceStateData
} from './ExperienceState';

import {
    RuntimeEvents
} from './RuntimeEvents';

import type {
    RuntimeSystem,
    RuntimeSystemDetails
} from './RuntimeSystem';

export type ExperienceRuntimeSystem =
    RuntimeSystem;

export class ExperienceRuntime {
    private readonly systems =
        new Map<string, RuntimeSystem>();

    public readonly events:
        RuntimeEvents;

    constructor(
        systems: RuntimeSystem[] = [],
        events: RuntimeEvents = new RuntimeEvents()
    ) {
        this.events = events;

        systems.forEach((system) => {
            this.register(system);
        });
    }

    public register(
        system: RuntimeSystem
    ): () => void {
        if (
            !system ||
            typeof system.id !== 'string' ||
            system.id.trim() === '' ||
            typeof system.update !== 'function'
        ) {
            throw new TypeError(
                'Runtime systems must provide an id and update method.'
            );
        }

        if (this.systems.has(system.id)) {
            throw new Error(
                `Runtime system "${system.id}" is already registered.`
            );
        }

        this.systems.set(
            system.id,
            system
        );

        return () => {
            this.unregister(system.id);
        };
    }

    public unregister(
        systemId: string
    ): boolean {
        return this.systems.delete(systemId);
    }

    public get(
        systemId: string
    ): RuntimeSystem | null {
        return this.systems.get(systemId) ?? null;
    }

    public has(systemId: string): boolean {
        return this.systems.has(systemId);
    }

    public enable(systemId: string): boolean {
        const system = this.systems.get(systemId);

        if (!system) {
            return false;
        }

        system.enabled = true;

        return true;
    }

    public disable(systemId: string): boolean {
        const system = this.systems.get(systemId);

        if (!system) {
            return false;
        }

        system.enabled = false;

        return true;
    }

    public list(): RuntimeSystemDetails[] {
        return Array.from(
            this.systems.values()
        )
            .sort(
                (firstSystem, secondSystem) =>
                    firstSystem.priority -
                    secondSystem.priority
            )
            .map((system) => ({
                id: system.id,
                version: system.version,
                priority: system.priority,
                enabled: system.enabled
            }));
    }

    public initialise(): void {
        this.callLifecycleMethod(
            'initialise'
        );
    }

    public start(): void {
        this.callLifecycleMethod(
            'start'
        );
    }

    public stop(): void {
        this.callLifecycleMethod(
            'stop',
            true
        );
    }

    public destroy(): void {
        this.callLifecycleMethod(
            'destroy',
            true
        );

        this.systems.clear();
    }

    private callLifecycleMethod(
        methodName:
            'initialise' |
            'start' |
            'stop' |
            'destroy',
        reverseOrder = false
    ): void {
        const orderedSystems =
            Array.from(
                this.systems.values()
            ).sort(
                (firstSystem, secondSystem) =>
                    firstSystem.priority -
                    secondSystem.priority
            );

        if (reverseOrder) {
            orderedSystems.reverse();
        }

        orderedSystems.forEach((system) => {
            const requiresEnabledSystem =
                methodName === 'initialise' ||
                methodName === 'start';

            if (
                requiresEnabledSystem &&
                !system.enabled
            ) {
                return;
            }

            const lifecycleMethod =
                system[methodName];

            if (
                typeof lifecycleMethod
                !== 'function'
            ) {
                return;
            }

            try {
                lifecycleMethod.call(system);
            } catch (error) {
                console.error(
                    `Runtime system "${system.id}" failed during ${methodName}().`,
                    error
                );
            }
        });
    }

    public update(state: ExperienceStateData): void {
        this.events.emit(
            'runtime:update-start',
            { state }
        );

        const orderedSystems =
            Array.from(
                this.systems.values()
            ).sort(
                (firstSystem, secondSystem) =>
                    firstSystem.priority -
                    secondSystem.priority
            );

        orderedSystems.forEach((system) => {
            if (!system.enabled) {
                return;
            }

            try {
                system.update(state);
            } catch (error) {
                console.error(
                    `Runtime system "${system.id}" failed.`,
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
