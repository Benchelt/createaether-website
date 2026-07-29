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

interface Particle {
    x: number;
    y: number;

    velocityX: number;
    velocityY: number;

    radius: number;
    opacity: number;

    age: number;
    lifetime: number;
}

export class CanvasParticleEffect
    implements VisualEffect, CanvasRenderable {

    public readonly id = 'canvas-particles';

    public readonly name = 'Canvas Particles';

    public readonly description =
        'Renders a field of animated particles through the Canvas renderer.';

    public readonly version = '0.19.0';

    public readonly category:
        VisualEffectCategory = 'particles';

    public enabled = true;

    private active = true;

    private unregisterRenderer:
        (() => void) | null = null;

    private readonly targetParticleCount = 42;

    private readonly particles: Particle[] = [];

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
        this.active = true;
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
            deltaTime
        } = frame;

        if (width <= 1 || height <= 1) {
            return;
        }

        this.ensureParticleCount(
            width,
            height
        );

        const deltaSeconds =
            Math.min(deltaTime / 1000, 0.1);

        for (const particle of this.particles) {
            this.updateParticle(
                particle,
                deltaSeconds,
                width,
                height
            );

            this.drawParticle(
                context,
                particle
            );
        }
    }

    public stop(): void {
        this.active = false;
    }

    public destroy(): void {
        this.unregisterRenderer?.();
        this.unregisterRenderer = null;

        this.particles.length = 0;
        this.active = false;
    }

    private ensureParticleCount(
        width: number,
        height: number
    ): void {
        while (
            this.particles.length
            < this.targetParticleCount
        ) {
            this.particles.push(
                this.createParticle(
                    width,
                    height,
                    true
                )
            );
        }
    }

    private createParticle(
        width: number,
        height: number,
        distributeAcrossScene = false
    ): Particle {
        const lifetime =
            this.randomBetween(5, 12);

        return {
            x: this.randomBetween(
                0,
                width
            ),

            y: distributeAcrossScene
                ? this.randomBetween(0, height)
                : height + this.randomBetween(4, 40),

            velocityX:
                this.randomBetween(-4, 4),

            velocityY:
                this.randomBetween(-15, -5),

            radius:
                this.randomBetween(1, 3.5),

            opacity:
                this.randomBetween(0.35, 0.9),

            age: distributeAcrossScene
                ? this.randomBetween(0, lifetime)
                : 0,

            lifetime
        };
    }

    private updateParticle(
        particle: Particle,
        deltaSeconds: number,
        width: number,
        height: number
    ): void {
        particle.age += deltaSeconds;

        particle.x +=
            particle.velocityX
            * deltaSeconds;

        particle.y +=
            particle.velocityY
            * deltaSeconds;

        const expired =
            particle.age >= particle.lifetime;

        const outsideScene =
            particle.y < -40
            || particle.x < -40
            || particle.x > width + 40;

        if (expired || outsideScene) {
            Object.assign(
                particle,
                this.createParticle(
                    width,
                    height
                )
            );
        }
    }

    private drawParticle(
        context: CanvasRenderingContext2D,
        particle: Particle
    ): void {
        const progress =
            particle.age / particle.lifetime;

        const fade =
            Math.sin(
                Math.PI
                * Math.min(
                    Math.max(progress, 0),
                    1
                )
            );

        const alpha =
            particle.opacity * fade;

        if (alpha <= 0) {
            return;
        }

        context.save();

        context.globalAlpha = alpha;

        context.shadowColor =
            'rgba(147, 197, 253, 0.9)';

        context.shadowBlur =
            particle.radius * 5;

        context.fillStyle =
            'rgba(191, 219, 254, 0.95)';

        context.beginPath();

        context.arc(
            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2
        );

        context.fill();
        context.restore();
    }

    private randomBetween(
        minimum: number,
        maximum: number
    ): number {
        return minimum
            + Math.random()
            * (maximum - minimum);
    }
}
