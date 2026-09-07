import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class HeroComponent implements OnInit, OnDestroy {
  name = 'Mahesh Gite';
  title = 'Software Developer';
  subtitle = 'Angular & Enterprise Applications';
  location = 'Sakur, Maharashtra';
  email = 'gitemahesh32@gmail.com';
  phone = '+91 9637201245';
  linkedin = 'https://www.linkedin.com/in/mahesh-gite-669738313/';

  // Typewriter / Dynamic Title
  roles = [
    'Software Developer',
    'Angular 22 Specialist',
    'Enterprise UI Architect',
    'TypeScript & PrimeNG Engineer'
  ];
  displayedRole = signal<string>('Software Developer');
  private roleIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private typingTimeout: any = null;

  // Infinite Tech Marquee
  techTicker = [
    'Angular 22',
    'TypeScript',
    'PrimeNG',
    'Tailwind CSS',
    'RxJS',
    'RESTful APIs',
    'Reactive Forms',
    'Enterprise Architecture',
    'SonarQube',
    'Git & GitLab',
    'Bitbucket',
    'Bootstrap 5',
    'Vitest'
  ];

  skillsList = [
    'Angular',
    'TypeScript',
    'PrimeNG',
    'JavaScript',
    'HTML5 & CSS3',
    'Bootstrap',
    'REST APIs',
    'SonarQube',
    'Git & Bitbucket'
  ];

  stats = [
    { label: 'Primary Tech Stack', value: 'Angular & TypeScript' },
    { label: 'Key Projects Delivered', value: 'LIMA & Simplify VMS' },
    { label: 'Core Expertise', value: 'Reactive Forms & UI Architecture' },
    { label: 'Domain Expertise', value: 'Enterprise Software' }
  ];

  ngOnInit() {
    this.startTypewriter();
  }

  ngOnDestroy() {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  private startTypewriter() {
    const currentFull = this.roles[this.roleIndex];

    if (this.isDeleting) {
      this.displayedRole.set(currentFull.substring(0, this.charIndex - 1));
      this.charIndex--;
    } else {
      this.displayedRole.set(currentFull.substring(0, this.charIndex + 1));
      this.charIndex++;
    }

    let delay = this.isDeleting ? 45 : 85;

    if (!this.isDeleting && this.charIndex === currentFull.length) {
      delay = 2200; // Pause at end of word
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.roleIndex = (this.roleIndex + 1) % this.roles.length;
      delay = 450; // Pause before next word
    }

    this.typingTimeout = setTimeout(() => this.startTypewriter(), delay);
  }

  downloadResume() {
    const link = document.createElement('a');
    link.href = 'assets/Mahesh%20Gite%20Resume.pdf%20(1).pdf';
    link.download = 'Mahesh Gite Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

