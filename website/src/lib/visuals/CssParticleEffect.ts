import type {
    ExperienceStateData
} from '../ExperienceState';

import type {
    VisualEffect,
    VisualEffectCategory
} from './VisualEffect';

export class CssParticleEffect
    implements VisualEffect {

    public readonly id = 'css-particles';

    public readonly name = 'CSS Particles';

    public readonly description =
        'Controls the preview particle visibility and status.';

    public readonly version = '0.17.0';

    public readonly category:
        VisualEffectCategory = 'particles';

    public enabled = true;

    constructor(
        private readonly previewStage: Element | null,
        private readonly particlesStatus: Element | null
    ) {}

    public update(
        state: ExperienceStateData
    ): void {

        if (this.previewStage instanceof HTMLElement) {
            this.previewStage.classList.toggle(
                'preview-stage--particles-disabled',
                !state.atmosphere.particles
            );
        }

        if (this.particlesStatus instanceof HTMLElement) {
            this.particlesStatus.textContent =
                state.atmosphere.particles
                    ? 'Particles active'
                    : 'Particles disabled';
        }
    }
}
