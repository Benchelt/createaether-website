import type {
    ExperienceStateData
} from '../ExperienceState';

import type {
    ExperienceRuntimeSystem
} from '../ExperienceRuntime';

import type {
    AudioTrack
} from '../models/AudioTrack';

export class AudioSystem
    implements ExperienceRuntimeSystem {
    private readonly audioElement:
        HTMLAudioElement | null;

    private readonly tracks:
        Map<string, AudioTrack>;

    private readonly fallbackTrack:
        AudioTrack | null;

    private activeTrackId:
        string | null = null;

    constructor(
        audioElement: Element | null,
        tracks: AudioTrack[] = []
    ) {
        this.audioElement =
            audioElement instanceof HTMLAudioElement
                ? audioElement
                : null;

        this.tracks = new Map(
            tracks.map((track) => [
                track.id,
                track
            ])
        );

        this.fallbackTrack =
            tracks[0] ?? null;
    }

    public update(
        state: ExperienceStateData
    ): void {
        if (!this.audioElement) {
            return;
        }

        const requestedTrack =
            this.tracks.get(state.audio.track);

        const resolvedTrack =
            requestedTrack ?? this.fallbackTrack;

        if (
            resolvedTrack &&
            resolvedTrack.id !== this.activeTrackId
        ) {
            const wasPlaying =
                !this.audioElement.paused;

            this.audioElement.src =
                resolvedTrack.src;

            this.audioElement.loop =
                resolvedTrack.loop;

            this.audioElement.load();

            this.activeTrackId =
                resolvedTrack.id;

            if (wasPlaying && state.audio.enabled) {
                void this.audioElement.play().catch(
                    (error) => {
                        console.error(
                            'Unable to switch audio track.',
                            error
                        );
                    }
                );
            }
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
