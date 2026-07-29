import type {
    ExperienceStateData
} from '../ExperienceState';

import type {
    VisualEffect
} from './VisualEffect';

export class CssLightingEffect
    implements VisualEffect {
    public readonly id = 'css-lighting';
    public readonly version = '0.15.0';
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