import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experience',
  imports: [CommonModule],
  templateUrl: './experience.html',
  styleUrl: './experience.css'
})
export class ExperienceComponent {
  experience = {
    company: 'Enterprise Software & IT Solutions',
    location: 'Maharashtra, India',
    role: 'Software Developer',
    duration: 'Present / Current',
    projectFocus: 'LIMA (Life in Managing Audit)',
    summary: 'Driving enterprise software architecture, building responsive and reusable UI modules, implementing reactive forms, and ensuring strict code quality standards.',
    accomplishments: [
      'Currently working on the LIMA (Life in Managing Audit) project as a core Software Developer.',
      'Developed enterprise-level Angular modules and reusable UI components to ensure consistency across modules.',
      'Built responsive user interfaces using Angular, HTML5, CSS3, Bootstrap, and PrimeNG for all screen sizes.',
      'Implemented Angular Reactive Forms with dynamic validations and real-time error handling.',
      'Integrated REST APIs for seamless and resilient client-server data communication.',
      'Developed interactive dashboards, data tables, analytical reports, and end-to-end CRUD functionalities.',
      'Optimized application performance, reduced bundle size, and resolved SonarQube code quality issues.',
      'Collaborated closely with Backend Developers, QA Engineers, and Business Analysts in Agile/Scrum ceremonies.',
      'Utilized Git, Bitbucket, Jira, Outlook, and Postman for version control, issue tracking, and API testing.'
    ],
    techStack: ['Angular', 'TypeScript', 'PrimeNG', 'HTML5/CSS3', 'Bootstrap', 'REST APIs', 'SonarQube', 'Git', 'Bitbucket', 'Jira', 'Postman']
  };
}
