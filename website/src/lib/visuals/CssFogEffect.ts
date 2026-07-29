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
        'Controls the atmospheric fog layer in the Studio preview.';
    public readonly version = '0.16.0';
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
        if (
            this.previewStage instanceof HTMLElement
        ) {
            this.previewStage.classList.toggle(
                'preview-stage--fog-disabled',
                !state.atmosphere.fog
            );
        }

        if (
            this.fogStatus instanceof HTMLElement
        ) {
            this.fogStatus.textContent =
                state.atmosphere.fog
                    ? 'Fog active'
                    : 'Fog disabled';
        }
    }
}
