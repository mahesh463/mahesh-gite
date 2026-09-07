import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class AboutComponent {
  features = [
    {
      icon: 'layers',
      title: 'Modular & Reusable Architecture',
      desc: 'Expertise in building scalable, enterprise-grade Angular modules and reusable UI components that reduce development overhead and enhance maintainability.'
    },
    {
      icon: 'devices',
      title: '100% Responsive Design',
      desc: 'Crafting pixel-perfect layouts using HTML5, modern CSS3, Bootstrap, and PrimeNG that seamlessly adapt across mobile, tablet, and desktop screens.'
    },
    {
      icon: 'api',
      title: 'REST API & State Architecture',
      desc: 'Expert integration of complex REST APIs with application services, handling asynchronous streams, real-time data binding, and robust error management.'
    },
    {
      icon: 'shield-check',
      title: 'Clean Code & Quality',
      desc: 'Committed to writing maintainable, clean code, resolving SonarQube quality gates, and following industry best practices and design patterns.'
    }
  ];

  domains = [
    { name: 'Audit Management (LIMA)', badge: 'Current Project' },
    { name: 'Vendor Management System (VMS)', badge: 'Completed' },
    { name: 'Education LMS Systems', badge: 'Domain Experience' },
    { name: 'Job Portals & Recruitment', badge: 'Domain Experience' }
  ];
}
