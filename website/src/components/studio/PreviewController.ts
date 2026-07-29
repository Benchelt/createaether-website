import type {
    ExperienceStateData
} from '../../lib/ExperienceState';

import type {
    ExperienceRuntimeSystem
} from '../../lib/ExperienceRuntime';

export interface PreviewElements {
    volumeValue: Element | null;
    previewStage: Element | null;
    particlesStatus: Element | null;
}

export class PreviewController
    implements ExperienceRuntimeSystem {
    public readonly id = 'studio-preview';
    public readonly version = '0.11.0';
    public readonly priority = 10;
    public enabled = true;

    private readonly elements: PreviewElements;

    constructor(elements: PreviewElements) {
        this.elements = elements;
    }

    private updateVolume(
        state: ExperienceStateData
    ): void {
        const { volumeValue } = this.elements;

        if (volumeValue instanceof HTMLOutputElement) {
            volumeValue.value = `${state.audio.volume}%`;
        }
    }

    private updateParticles(
        state: ExperienceStateData
    ): void {
        const {
            previewStage,
            particlesStatus
        } = this.elements;

        if (previewStage instanceof HTMLElement) {
            previewStage.classList.toggle(
                'preview-stage--particles-disabled',
                !state.atmosphere.particles
            );
        }

        if (particlesStatus instanceof HTMLElement) {
            particlesStatus.textContent =
                state.atmosphere.particles
                    ? 'Particles active'
                    : 'Particles disabled';
        }
    }    public update(state: ExperienceStateData): void {
        this.updateVolume(state);
        this.updateParticles(state);
    }
}
