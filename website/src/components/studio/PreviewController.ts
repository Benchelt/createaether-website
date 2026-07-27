import type {
    ExperienceStateData
} from '../../lib/ExperienceState';

export interface PreviewElements {
    volumeValue: Element | null;
    previewStage: Element | null;
    particlesStatus: Element | null;
    lightingStatus: Element | null;
    fogStatus: Element | null;
}

export class PreviewController {
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
    }

    private updateLighting(
        state: ExperienceStateData
    ): void {
        const {
            previewStage,
            lightingStatus
        } = this.elements;

        if (previewStage instanceof HTMLElement) {
            previewStage.classList.toggle(
                'preview-stage--lighting-disabled',
                !state.atmosphere.lighting
            );
        }

        if (lightingStatus instanceof HTMLElement) {
            lightingStatus.textContent =
                state.atmosphere.lighting
                    ? 'Lighting active'
                    : 'Lighting disabled';
        }
    }

    private updateFog(
        state: ExperienceStateData
    ): void {
        const {
            previewStage,
            fogStatus
        } = this.elements;

        if (previewStage instanceof HTMLElement) {
            previewStage.classList.toggle(
                'preview-stage--fog-disabled',
                !state.atmosphere.fog
            );
        }

        if (fogStatus instanceof HTMLElement) {
            fogStatus.textContent =
                state.atmosphere.fog
                    ? 'Fog active'
                    : 'Fog disabled';
        }
    }

    public render(state: ExperienceStateData): void {
        this.updateVolume(state);
        this.updateParticles(state);
        this.updateLighting(state);
        this.updateFog(state);
    }
}
