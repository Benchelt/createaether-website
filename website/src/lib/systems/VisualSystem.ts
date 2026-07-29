import type {
    ExperienceStateData
} from '../ExperienceState';

import type {
    ExperienceRuntimeSystem
} from '../ExperienceRuntime';

export class VisualSystem
    implements ExperienceRuntimeSystem {
    public readonly id = 'visuals';
    public readonly version = '0.14.0';
    public readonly priority = 30;
    public enabled = true;

    private started = false;
    private particlesEnabled = false;

    public initialise(): void {
        this.started = false;
        this.particlesEnabled = false;
    }

    public start(): void {
        this.started = true;
    }

    public update(
        state: ExperienceStateData
    ): void {
        if (!this.started) {
            return;
        }

        this.particlesEnabled =
            state.atmosphere.particles;
    }

    public stop(): void {
        this.started = false;
    }

    public destroy(): void {
        this.started = false;
        this.particlesEnabled = false;
    }
}
