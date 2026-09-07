import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-strengths',
  imports: [CommonModule],
  templateUrl: './strengths.html',
  styleUrl: './strengths.css'
})
export class StrengthsComponent {
  strengths = [
    {
      title: 'Angular Development',
      desc: 'In-depth mastery of Angular architecture, reactive state, signals, modules, and routing.',
      badge: 'Core Superpower'
    },
    {
      title: 'Responsive Web Design',
      desc: 'Delivering fluid, touch-friendly layouts optimized for smartphones, tablets, and high-DPI desktop displays.',
      badge: 'UX Standard'
    },
    {
      title: 'Reusable Component Development',
      desc: 'Engineering decoupled, parameter-driven UI components reducing duplication and accelerating delivery.',
      badge: 'Productivity'
    },
    {
      title: 'Clean Code Practices',
      desc: 'Adhering to SOLID principles, DRY standards, SonarQube quality criteria, and readable structure.',
      badge: 'Maintainability'
    },
    {
      title: 'Quick Learner',
      desc: 'Rapidly assimilating new frameworks, libraries, standards, and engineering tools to solve project roadblocks.',
      badge: 'Growth Mindset'
    }
  ];

  languages = [
    { name: 'Marathi', level: 'Native', tag: 'Mother Tongue', flag: '🇮🇳' },
    { name: 'English', level: 'Professional Working Proficiency', tag: 'Global Tech', flag: '🌐' },
    { name: 'Hindi', level: 'Professional Working Proficiency', tag: 'Fluent', flag: '🇮🇳' }
  ];

  interests = [
    'Learning New Technologies',
    'Building Web Applications',
    'UI/UX Development',
    'Team Collaboration',
    'Exploring Modern Web & Software Technologies'
  ];
}
