import type {
    ExperienceStateData
} from '../ExperienceState';

import type {
    CanvasRenderable,
    CanvasRenderFrame
} from '../rendering/CanvasRenderer';

import {
    CanvasRenderer
} from '../rendering/CanvasRenderer';

import type {
    VisualEffect,
    VisualEffectCategory
} from './VisualEffect';

interface CanvasParticle {
    readonly x: number;
    readonly y: number;
    readonly phase: number;
}

export class CanvasParticleEffect
    implements VisualEffect, CanvasRenderable {

    public readonly id = 'canvas-particles';

    public readonly name = 'Canvas Particles';

    public readonly description =
        'Renders animated particles through the Canvas renderer.';

    public readonly version = '0.18.0';

    public readonly category:
        VisualEffectCategory = 'particles';

    public enabled = true;

    private active = true;

    private unregisterRenderer:
        (() => void) | null = null;

    private readonly particles:
        readonly CanvasParticle[] = [
            {
                x: 0.22,
                y: 0.56,
                phase: 0
            },
            {
                x: 0.50,
                y: 0.31,
                phase: 2.1
            },
            {
                x: 0.78,
                y: 0.59,
                phase: 4.2
            }
        ];

    constructor(
        private readonly renderer: CanvasRenderer
    ) {}

    public initialise(): void {
        if (this.unregisterRenderer) {
            return;
        }

        this.unregisterRenderer =
            this.renderer.register(this);
    }

    public start(): void {
        this.renderer.start();
    }

    public update(
        state: ExperienceStateData
    ): void {
        this.active =
            state.atmosphere.particles;
    }

    public render(
        frame: CanvasRenderFrame
    ): void {
        if (!this.active) {
            return;
        }

        const {
            context,
            width,
            height,
            elapsedTime
        } = frame;

        const time =
            elapsedTime / 1000;

        for (const particle of this.particles) {
            const movement =
                Math.sin(
                    time * 1.4
                    + particle.phase
                );

            const pulse =
                0.65
                + (
                    Math.sin(
                        time * 2
                        + particle.phase
                    )
                    * 0.25
                );

            const x =
                width * particle.x
                + (
                    Math.cos(
                        time
                        + particle.phase
                    )
                    * 8
                );

            const y =
                height * particle.y
                + (movement * 12);

            context.save();

            context.globalAlpha = pulse;

            context.shadowColor =
                'rgba(147, 197, 253, 0.95)';

            context.shadowBlur = 18;

            context.fillStyle =
                'rgba(191, 219, 254, 0.95)';

            context.beginPath();

            context.arc(
                x,
                y,
                3,
                0,
                Math.PI * 2
            );

            context.fill();
            context.restore();
        }
    }

    public stop(): void {
        this.active = false;
    }

    public destroy(): void {
        this.unregisterRenderer?.();
        this.unregisterRenderer = null;
        this.active = false;
    }
}
