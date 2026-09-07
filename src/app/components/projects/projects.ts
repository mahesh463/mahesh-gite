import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  title: string;
  subtitle: string;
  role: string;
  techStack: string[];
  status: string;
  description: string;
  highlights: string[];
  metrics: { label: string; val: string }[];
}

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class ProjectsComponent {
  projects: Project[] = [
    {
      title: 'LIMA',
      subtitle: 'Life in Managing Audit',
      role: 'Software Developer',
      status: 'Active / Enterprise',
      techStack: ['Angular', 'TypeScript', 'PrimeNG', 'REST APIs', 'SonarQube'],
      description: 'Comprehensive enterprise audit lifecycle management platform engineered to streamline compliance tracking, audit scheduling, multi-tier reviews, and real-time analytical reporting.',
      highlights: [
        'Developed end-to-end audit management modules using modular Angular architecture.',
        'Engineered reusable and responsive UI components with PrimeNG and custom styling.',
        'Implemented complex dynamic reactive forms with multi-step validations and custom validators.',
        'Seamlessly integrated application services with backend REST APIs for synchronized data flows.',
        'Architected real-time analytical dashboards, interactive data tables, and reporting modules.',
        'Optimized UI rendering performance and systematically resolved SonarQube code quality issues.'
      ],
      metrics: [
        { label: 'Architecture', val: 'Angular Modular' },
        { label: 'UI Library', val: 'PrimeNG' },
        { label: 'Quality', val: 'SonarQube Clean' }
      ]
    },
    {
      title: 'Simplify VMS',
      subtitle: 'Vendor Management System',
      role: 'Software Developer',
      status: 'Production Deployed',
      techStack: ['Angular', 'TypeScript', 'REST APIs', 'Bootstrap', 'HTML5/CSS3'],
      description: 'Centralized vendor management and configuration portal designed to govern vendor onboarding, contracts, performance ratings, and billing workflows with high reliability.',
      highlights: [
        'Developed full Vendor Management and System Configuration modules.',
        'Created mobile-responsive and reusable UI components across all administrative dashboards.',
        'Integrated application services with secure backend REST APIs.',
        'Implemented extensive client-side form validations and dynamic UI enhancements.',
        'Delivered production support, proactive bug triage, and incremental feature upgrades.'
      ],
      metrics: [
        { label: 'Domain', val: 'Vendor Mgmt' },
        { label: 'UI Design', val: 'Responsive' },
        { label: 'Workflow', val: 'CRUD & Support' }
      ]
    }
  ];
}
