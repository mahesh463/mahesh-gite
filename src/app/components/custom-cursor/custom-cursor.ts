import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  NgZone,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-cursor.html',
  styleUrl: './custom-cursor.css'
})
export class CustomCursorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('trailCanvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('cursorDot', { static: false })
  dotRef!: ElementRef<HTMLDivElement>;

  @ViewChild('cursorRing', { static: false })
  ringRef!: ElementRef<HTMLDivElement>;

  private ngZone = inject(NgZone);

  isVisible = false;
  isHovering = false;
  isClicking = false;
  isTextHover = false;
  ripples: Ripple[] = [];

  private mouseX = -100;
  private mouseY = -100;
  private ringX = -100;
  private ringY = -100;
  private lastEmitX = -100;
  private lastEmitY = -100;

  private animFrameId: number | null = null;
  private particles: TrailParticle[] = [];
  private ctx: CanvasRenderingContext2D | null = null;
  private isFinePointer = false;
  private rippleCounter = 0;

  private boundOnMouseMove!: (e: MouseEvent) => void;
  private boundOnMouseDown!: (e: MouseEvent) => void;
  private boundOnMouseUp!: (e: MouseEvent) => void;
  private boundOnMouseLeave!: () => void;
  private boundOnMouseEnter!: () => void;
  private boundOnResize!: () => void;

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;

    this.isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!this.isFinePointer) return;

    // Enable custom cursor styles on body
    document.body.classList.add('has-custom-cursor');

    this.boundOnMouseMove = (e: MouseEvent) => this.handleMouseMove(e);
    this.boundOnMouseDown = (e: MouseEvent) => this.handleMouseDown(e);
    this.boundOnMouseUp = (e: MouseEvent) => this.handleMouseUp(e);
    this.boundOnMouseLeave = () => this.handleMouseLeave();
    this.boundOnMouseEnter = () => this.handleMouseEnter();
    this.boundOnResize = () => this.handleResize();

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('mousemove', this.boundOnMouseMove, { passive: true });
      window.addEventListener('mousedown', this.boundOnMouseDown, { passive: true });
      window.addEventListener('mouseup', this.boundOnMouseUp, { passive: true });
      document.addEventListener('mouseleave', this.boundOnMouseLeave);
      document.addEventListener('mouseenter', this.boundOnMouseEnter);
      window.addEventListener('resize', this.boundOnResize, { passive: true });

      this.startRenderLoop();
    });
  }

  ngOnDestroy() {
    if (typeof window === 'undefined') return;

    document.body.classList.remove('has-custom-cursor');

    if (this.boundOnMouseMove) {
      window.removeEventListener('mousemove', this.boundOnMouseMove);
      window.removeEventListener('mousedown', this.boundOnMouseDown);
      window.removeEventListener('mouseup', this.boundOnMouseUp);
      document.removeEventListener('mouseleave', this.boundOnMouseLeave);
      document.removeEventListener('mouseenter', this.boundOnMouseEnter);
      window.removeEventListener('resize', this.boundOnResize);
    }

    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private handleMouseMove(e: MouseEvent) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    if (!this.isVisible) {
      this.isVisible = true;
      this.ringX = this.mouseX;
      this.ringY = this.mouseY;
      this.updateVisibilityClass();
    }

    // Direct update to inner dot for instantaneous tracking
    if (this.dotRef?.nativeElement) {
      this.dotRef.nativeElement.style.transform = `translate3d(${this.mouseX}px, ${this.mouseY}px, 0)`;
    }

    // Detect interactive target under cursor
    const target = e.target as HTMLElement | null;
    if (target) {
      const isInteractive = Boolean(
        target.closest(
          'a, button, input, textarea, select, [role="button"], .glass-card, .chip-tech, .cursor-pointer, .btn-primary-glow, nav, [data-cursor="hover"]'
        )
      );

      const isText =
        !isInteractive &&
        Boolean(
          target.closest('p, h1, h2, h3, h4, h5, h6, span.typing-cursor, [data-cursor="text"]')
        );

      if (isInteractive !== this.isHovering || isText !== this.isTextHover) {
        this.isHovering = isInteractive;
        this.isTextHover = isText;
        this.updateInteractiveClasses();
      }
    }

    // Spawn subtle stardust trail particles when moving
    const dist = Math.hypot(this.mouseX - this.lastEmitX, this.mouseY - this.lastEmitY);
    if (dist > 7) {
      this.spawnParticle(this.mouseX, this.mouseY);
      this.lastEmitX = this.mouseX;
      this.lastEmitY = this.mouseY;
    }
  }

  private handleMouseDown(e: MouseEvent) {
    this.isClicking = true;
    this.updateInteractiveClasses();

    // Trigger ripple
    this.createRipple(e.clientX, e.clientY);
  }

  private handleMouseUp(e: MouseEvent) {
    this.isClicking = false;
    this.updateInteractiveClasses();
  }

  private handleMouseLeave() {
    this.isVisible = false;
    this.updateVisibilityClass();
  }

  private handleMouseEnter() {
    this.isVisible = true;
    this.updateVisibilityClass();
  }

  private handleResize() {
    if (this.canvasRef?.nativeElement) {
      this.canvasRef.nativeElement.width = window.innerWidth;
      this.canvasRef.nativeElement.height = window.innerHeight;
    }
  }

  private updateVisibilityClass() {
    const ring = this.ringRef?.nativeElement;
    const dot = this.dotRef?.nativeElement;
    if (!ring || !dot) return;

    if (this.isVisible) {
      ring.style.opacity = '1';
      dot.style.opacity = '1';
    } else {
      ring.style.opacity = '0';
      dot.style.opacity = '0';
    }
  }

  private updateInteractiveClasses() {
    const ring = this.ringRef?.nativeElement;
    const dot = this.dotRef?.nativeElement;
    if (!ring || !dot) return;

    ring.classList.toggle('ring-hover', this.isHovering);
    ring.classList.toggle('ring-clicking', this.isClicking);
    ring.classList.toggle('ring-text', this.isTextHover);

    dot.classList.toggle('dot-hover', this.isHovering);
    dot.classList.toggle('dot-clicking', this.isClicking);
  }

  private createRipple(x: number, y: number) {
    this.ngZone.run(() => {
      const id = ++this.rippleCounter;
      this.ripples.push({ id, x, y });
      setTimeout(() => {
        this.ripples = this.ripples.filter(r => r.id !== id);
      }, 650);
    });
  }

  private spawnParticle(x: number, y: number) {
    if (this.particles.length > 25) return;

    const colors = [
      'rgba(37, 99, 235, 0.7)',  // Blue
      'rgba(79, 70, 229, 0.65)', // Indigo
      'rgba(124, 58, 237, 0.6)', // Purple
      'rgba(56, 189, 248, 0.75)' // Cyan
    ];

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.8 + 0.2;

    this.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 2.8 + 1.2,
      alpha: 0.85,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  private startRenderLoop() {
    const canvas = this.canvasRef?.nativeElement;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.ctx = canvas.getContext('2d');
    }

    const loop = () => {
      // Smooth lerp for outer ring: 0.16 damping factor for organic fluid trail
      const damping = this.isHovering ? 0.24 : 0.16;
      this.ringX += (this.mouseX - this.ringX) * damping;
      this.ringY += (this.mouseY - this.ringY) * damping;

      if (this.ringRef?.nativeElement) {
        this.ringRef.nativeElement.style.transform = `translate3d(${this.ringX}px, ${this.ringY}px, 0)`;
      }

      // Draw canvas stardust particles
      this.renderParticles();

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  private renderParticles() {
    if (!this.ctx || !this.canvasRef?.nativeElement) {
      const canvas = this.canvasRef?.nativeElement;
      if (canvas) {
        this.ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.038;
      p.size = Math.max(0, p.size - 0.04);

      if (p.alpha <= 0 || p.size <= 0.1) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.shadowBlur = 6;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();
      this.ctx.restore();
    }
  }
}
