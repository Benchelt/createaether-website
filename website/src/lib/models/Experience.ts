export interface AudioSettings {
    enabled: boolean;
    volume: number;
    track: string;
}

export interface AtmosphereSettings {
    particles: boolean;
    lighting: boolean;
    fog: boolean;
}

export interface Experience {
    id: string;
    name: string;
    description: string;
    status: string;

    audio: AudioSettings;
    atmosphere: AtmosphereSettings;
}
