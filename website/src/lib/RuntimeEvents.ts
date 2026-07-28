import type {
    ExperienceStateData
} from './ExperienceState';

import type {
    AudioTrack
} from './models/AudioTrack';

export interface RuntimeEventMap {
    'runtime:update-start': {
        state: ExperienceStateData;
    };

    'runtime:update-complete': {
        state: ExperienceStateData;
    };

    'audio:track-changing': {
        fromTrackId: string | null;
        toTrack: AudioTrack;
    };

    'audio:track-changed': {
        track: AudioTrack;
    };

    'audio:fade-start': {
        fromVolume: number;
        toVolume: number;
        durationMs: number;
    };

    'audio:fade-complete': {
        volume: number;
    };
}

export type RuntimeEventName =
    keyof RuntimeEventMap;

export type RuntimeEventListener<
    Name extends RuntimeEventName
> = (
    payload: RuntimeEventMap[Name]
) => void;

export class RuntimeEvents {
    private readonly listeners =
        new Map<
            RuntimeEventName,
            Set<RuntimeEventListener<RuntimeEventName>>
        >();

    public on<Name extends RuntimeEventName>(
        eventName: Name,
        listener: RuntimeEventListener<Name>
    ): () => void {
        const existingListeners =
            this.listeners.get(eventName) ??
            new Set<
                RuntimeEventListener<RuntimeEventName>
            >();

        existingListeners.add(
            listener as RuntimeEventListener<
                RuntimeEventName
            >
        );

        this.listeners.set(
            eventName,
            existingListeners
        );

        return () => {
            this.off(
                eventName,
                listener
            );
        };
    }

    public off<Name extends RuntimeEventName>(
        eventName: Name,
        listener: RuntimeEventListener<Name>
    ): void {
        const existingListeners =
            this.listeners.get(eventName);

        if (!existingListeners) {
            return;
        }

        existingListeners.delete(
            listener as RuntimeEventListener<
                RuntimeEventName
            >
        );

        if (existingListeners.size === 0) {
            this.listeners.delete(eventName);
        }
    }

    public emit<Name extends RuntimeEventName>(
        eventName: Name,
        payload: RuntimeEventMap[Name]
    ): void {
        const existingListeners =
            this.listeners.get(eventName);

        if (!existingListeners) {
            return;
        }

        existingListeners.forEach(
            (listener) => {
                listener(payload);
            }
        );
    }

    public count(
        eventName?: RuntimeEventName
    ): number {
        if (eventName) {
            return this.listeners.get(
                eventName
            )?.size ?? 0;
        }

        let total = 0;

        this.listeners.forEach(
            (eventListeners) => {
                total += eventListeners.size;
            }
        );

        return total;
    }
}
