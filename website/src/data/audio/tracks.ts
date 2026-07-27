import type { AudioTrack } from '../../lib/models/AudioTrack';

export const audioTracks: AudioTrack[] = [
    {
        id: 'om-so-hum',
        title: 'OM SO HUM',
        description: 'A continuous meditative soundscape for the runtime preview.',
        src: '/audio/om-so-hum.mp3',
        loop: true,
    },
];

export const defaultAudioTrack = audioTracks[0];
