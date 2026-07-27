import type {
    ExperienceStateData
} from '../ExperienceState';

import type {
    ExperienceRuntimeSystem
} from '../ExperienceRuntime';

export class AudioSystem
    implements ExperienceRuntimeSystem {
    private readonly audioElement:
        HTMLAudioElement | null;

    constructor(audioElement: Element | null) {
        this.audioElement =
            audioElement instanceof HTMLAudioElement
                ? audioElement
                : null;
    }

    public update(
        state: ExperienceStateData
    ): void {
        if (!this.audioElement) {
            return;
        }

        const normalisedVolume = Math.min(
            1,
            Math.max(
                0,
                state.audio.volume / 100
            )
        );

        this.audioElement.volume =
            normalisedVolume;

        this.audioElement.muted =
            !state.audio.enabled;

        if (
            !state.audio.enabled &&
            !this.audioElement.paused
        ) {
            this.audioElement.pause();
        }
    }
}
