import type {
    ExperienceStateData
} from '../ExperienceState';

import type {
    VisualEffect,
    VisualEffectCategory
} from './VisualEffect';

export class CssFogEffect
    implements VisualEffect {
    public readonly id = 'css-fog';
    public readonly name = 'CSS Fog';
    public readonly description =
        'Controls preset-driven atmospheric fog in the Studio preview.';
    public readonly version = '0.22.0';
    public readonly category:
        VisualEffectCategory = 'fog';

    public enabled = true;

    private readonly previewStage:
        Element | null;

    private readonly fogStatus:
        Element | null;

    constructor(
        previewStage: Element | null,
        fogStatus: Element | null
    ) {
        this.previewStage = previewStage;
        this.fogStatus = fogStatus;
    }

    public update(
        state: ExperienceStateData
    ): void {
        const fogEnabled =
            state.atmosphere.fog;

        const density = Math.min(
            1,
            Math.max(0, state.fog.density)
        );

        const speed = Math.min(
            1,
            Math.max(0, state.fog.speed)
        );

        const driftDuration =
            18 - speed * 10;

        if (
            this.previewStage instanceof HTMLElement
        ) {
            this.previewStage.classList.toggle(
                'preview-stage--fog-disabled',
                !fogEnabled
            );

            this.previewStage.dataset.fogPreset =
                state.fog.preset;

            this.previewStage.style.setProperty(
                '--aether-fog-colour',
                state.fog.colour
            );

            this.previewStage.style.setProperty(
                '--aether-fog-density',
                String(density)
            );

            const fogOpacity =
                0.22 + density * 0.58;

            const secondaryFogOpacity =
                fogOpacity * 0.58;

            const fogBlur =
                14 + density * 24;

            this.previewStage.style.setProperty(
                '--aether-fog-opacity',
                String(fogOpacity)
            );

            this.previewStage.style.setProperty(
                '--aether-fog-secondary-opacity',
                String(secondaryFogOpacity)
            );

            this.previewStage.style.setProperty(
                '--aether-fog-blur',
                `${fogBlur}px`
            );

            this.previewStage.style.setProperty(
                '--aether-fog-duration',
                `${driftDuration}s`
            );

            this.previewStage.style.setProperty(
                '--aether-transition-duration',
                `${state.transition.duration}ms`
            );

            this.previewStage.style.setProperty(
                '--aether-transition-easing',
                state.transition.easing
            );
        }

        if (
            this.fogStatus instanceof HTMLElement
        ) {
            this.fogStatus.textContent =
                fogEnabled
                    ? `Fog active · ${state.fog.preset}`
                    : 'Fog disabled';
        }
    }
}
