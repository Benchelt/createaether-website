import type {
    ExperienceStateData
} from '../ExperienceState';

import type {
    ExperienceRuntimeSystem
} from '../ExperienceRuntime';

import type {
    VisualEffect
} from '../visuals/VisualEffect';

export class VisualSystem
    implements ExperienceRuntimeSystem {
    public readonly id = 'visuals';
    public readonly version = '0.15.0';
    public readonly priority = 30;
    public enabled = true;

    private readonly effects =
        new Map<string, VisualEffect>();

    private started = false;

    public register(
        effect: VisualEffect
    ): () => void {
        if (
            !effect ||
            typeof effect.id !== 'string' ||
            effect.id.trim() === '' ||
            typeof effect.update !== 'function'
        ) {
            throw new TypeError(
                'Visual effects must provide an id and update method.'
            );
        }

        if (this.effects.has(effect.id)) {
            throw new Error(
                `Visual effect "${effect.id}" is already registered.`
            );
        }

        this.effects.set(
            effect.id,
            effect
        );

        return () => {
            this.unregister(effect.id);
        };
    }

    public unregister(
        effectId: string
    ): boolean {
        return this.effects.delete(effectId);
    }

    public get(
        effectId: string
    ): VisualEffect | null {
        return this.effects.get(effectId) ?? null;
    }

    public has(
        effectId: string
    ): boolean {
        return this.effects.has(effectId);
    }

    public list(): VisualEffect[] {
        return Array.from(
            this.effects.values()
        );
    }

    public count(): number {
        return this.effects.size;
    }

    public initialise(): void {
        this.started = false;

        this.effects.forEach((effect) => {
            if (
                effect.enabled &&
                typeof effect.initialise === 'function'
            ) {
                effect.initialise();
            }
        });
    }

    public start(): void {
        this.started = true;

        this.effects.forEach((effect) => {
            if (
                effect.enabled &&
                typeof effect.start === 'function'
            ) {
                effect.start();
            }
        });
    }

    public update(
        state: ExperienceStateData
    ): void {
        if (!this.started) {
            return;
        }

        this.effects.forEach((effect) => {
            if (!effect.enabled) {
                return;
            }

            effect.update(state);
        });
    }

    public stop(): void {
        this.started = false;

        this.effects.forEach((effect) => {
            if (typeof effect.stop === 'function') {
                effect.stop();
            }
        });
    }

    public destroy(): void {
        this.started = false;

        this.effects.forEach((effect) => {
            if (typeof effect.destroy === 'function') {
                effect.destroy();
            }
        });

        this.effects.clear();
    }
}
