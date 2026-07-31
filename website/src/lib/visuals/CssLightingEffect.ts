import type {
    ExperienceStateData
} from '../ExperienceState';

import type {
    VisualEffect,
    VisualEffectCategory
} from './VisualEffect';

export class CssLightingEffect
    implements VisualEffect {
    public readonly id = 'css-lighting';
    public readonly name = 'CSS Lighting';
    public readonly description =
        'Controls preset-driven Studio lighting and orb illumination.';
    public readonly version = '0.22.0';
    public readonly category:
        VisualEffectCategory = 'lighting';

    public enabled = true;

    private readonly previewStage:
        Element | null;

    private readonly lightingStatus:
        Element | null;

    constructor(
        previewStage: Element | null,
        lightingStatus: Element | null
    ) {
        this.previewStage = previewStage;
        this.lightingStatus = lightingStatus;
    }

    public update(
        state: ExperienceStateData
    ): void {
        const lightingEnabled =
            state.atmosphere.lighting;

        const intensity = Math.min(
            1,
            Math.max(0, state.lighting.intensity)
        );

        const pulseSpeed = Math.min(
            1,
            Math.max(0, state.lighting.speed)
        );

        const pulseDuration =
            state.lighting.pulse
                ? 8 - pulseSpeed * 5
                : 4;

        if (
            this.previewStage instanceof HTMLElement
        ) {
            this.previewStage.classList.toggle(
                'preview-stage--lighting-disabled',
                !lightingEnabled
            );

            this.previewStage.classList.toggle(
                'preview-stage--lighting-static',
                !state.lighting.pulse
            );

            this.previewStage.dataset.lightingPreset =
                state.lighting.preset;

            this.previewStage.style.setProperty(
                '--aether-lighting-colour',
                state.lighting.colour
            );

            this.previewStage.style.setProperty(
                '--aether-lighting-intensity',
                String(intensity)
            );

            this.previewStage.style.setProperty(
                '--aether-lighting-glow-strength',
                `${Math.round(6 + intensity * 18)}%`
            );

            this.previewStage.style.setProperty(
                '--aether-lighting-orb-strength',
                `${Math.round(22 + intensity * 48)}%`
            );

            this.previewStage.style.setProperty(
                '--aether-lighting-shadow-strength',
                `${Math.round(12 + intensity * 38)}%`
            );

            this.previewStage.style.setProperty(
                '--aether-lighting-pulse-duration',
                `${pulseDuration}s`
            );
        }

        if (
            this.lightingStatus instanceof HTMLElement
        ) {
            this.lightingStatus.textContent =
                lightingEnabled
                    ? `Lighting active · ${state.lighting.preset}`
                    : 'Lighting disabled';
        }
    }
}
