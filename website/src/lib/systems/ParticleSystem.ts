import type {
    ExperienceStateData
} from '../ExperienceState';

import type {
    ExperienceRuntimeSystem
} from '../ExperienceRuntime';

export class ParticleSystem
    implements ExperienceRuntimeSystem {
    public readonly id = 'particles';
    public readonly version = '0.13.1';
    public readonly priority = 20;
    public enabled = true;

    public update(
        state: ExperienceStateData
    ): void {
        this.enabled =
            state.atmosphere.particles;
    }
}