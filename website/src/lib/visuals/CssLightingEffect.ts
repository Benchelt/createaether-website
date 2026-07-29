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
        'Controls the Studio preview glow and illuminated orb.';
    public readonly version = '0.16.0';
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
        if (
            this.previewStage instanceof HTMLElement
        ) {
            this.previewStage.classList.toggle(
                'preview-stage--lighting-disabled',
                !state.atmosphere.lighting
            );
        }

        if (
            this.lightingStatus instanceof HTMLElement
        ) {
            this.lightingStatus.textContent =
                state.atmosphere.lighting
                    ? 'Lighting active'
                    : 'Lighting disabled';
        }
    }
}