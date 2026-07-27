import type { Experience } from './models/Experience';

export type ExperienceStateData = Pick<
    Experience,
    'audio' | 'atmosphere'
>;

export interface ExperienceControls {
    volumeControl: Element | null;
    particlesToggle: Element | null;
    lightingToggle: Element | null;
    fogToggle: Element | null;
}

export type ExperienceRenderer = (
    state: ExperienceStateData
) => void;

export class ExperienceState {
    public readonly data: ExperienceStateData;

    private readonly controls: ExperienceControls;
    private readonly render: ExperienceRenderer;

    constructor(
        controls: ExperienceControls,
        render: ExperienceRenderer
    ) {
        this.controls = controls;
        this.render = render;

        this.data = {
            audio: {
                enabled: true,
                volume: 40
            },

            atmosphere: {
                particles: true,
                lighting: true,
                fog: false
            }
        };
    }

    private readControls(): void {
        const {
            volumeControl,
            particlesToggle,
            lightingToggle,
            fogToggle
        } = this.controls;

        if (volumeControl instanceof HTMLInputElement) {
            this.data.audio.volume = Number(volumeControl.value);
        }

        if (particlesToggle instanceof HTMLInputElement) {
            this.data.atmosphere.particles =
                particlesToggle.checked;
        }

        if (lightingToggle instanceof HTMLInputElement) {
            this.data.atmosphere.lighting =
                lightingToggle.checked;
        }

        if (fogToggle instanceof HTMLInputElement) {
            this.data.atmosphere.fog = fogToggle.checked;
        }
    }

    public update(): void {
        this.readControls();
        this.render(this.data);
    }

    public initialise(): void {
        this.readControls();
        this.render(this.data);
    }
}
