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

export interface ParticleSettings {
    count: number;
    colour: string;
    glow: number;

    minRadius: number;
    maxRadius: number;

    minSpeed: number;
    maxSpeed: number;

    drift: number;

    minOpacity: number;
    maxOpacity: number;

    minLifetime: number;
    maxLifetime: number;
}

export interface Experience {
    id: string;
    name: string;
    description: string;
    status: string;

    audio: AudioSettings;
    atmosphere: AtmosphereSettings;
    particles: ParticleSettings;
}
