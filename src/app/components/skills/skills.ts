import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Skill {
  name: string;
  level: string;
  tag: string;
}

interface SkillCategory {
  title: string;
  badge: string;
  icon: string;
  skills: Skill[];
}

@Component({
  selector: 'app-skills',
  imports: [CommonModule],
  templateUrl: './skills.html',
  styleUrl: './skills.css'
})
export class SkillsComponent {
  categories: SkillCategory[] = [
    {
      title: 'Frameworks & Programming Languages',
      badge: 'Core Expertise',
      icon: 'code',
      skills: [
        { name: 'Angular (2+ to Latest)', level: 'Specialist', tag: 'Modular Architecture & RxJS' },
        { name: 'TypeScript', level: 'Advanced', tag: 'Strict Typing, Interfaces & OOP' },
        { name: 'JavaScript (ES6+)', level: 'Advanced', tag: 'Async/Await & DOM Manipulation' },
        { name: 'HTML5 & CSS3', level: 'Advanced', tag: 'Semantic Layouts, Flexbox & Grid' },
        { name: 'React.js', level: 'Basic', tag: 'Functional Components & Hooks' }
      ]
    },
    {
      title: 'UI Design & Component Libraries',
      badge: 'Styling & UX',
      icon: 'palette',
      skills: [
        { name: 'PrimeNG', level: 'Specialist', tag: 'DataTables, Modals & Theme Styling' },
        { name: 'Bootstrap', level: 'Advanced', tag: 'Responsive Grid & Component Utilities' },
        { name: 'Reusable UI Component Design', level: 'Core', tag: 'DRY Modular Components & Props' },
        { name: 'TailwindCSS / Modern CSS', level: 'Proficient', tag: 'Glassmorphism & Responsive UI' }
      ]
    },
    {
      title: 'APIs, Forms & Data Management',
      badge: 'Integration',
      icon: 'database',
      skills: [
        { name: 'Angular Reactive Forms', level: 'Specialist', tag: 'Dynamic Form Validation & Real-time Checks' },
        { name: 'REST API Integration', level: 'Advanced', tag: 'HTTPClient, Data Streams & Error Handling' },
        { name: 'CRUD & Analytical Dashboards', level: 'Advanced', tag: 'Real-time Tables & Data Visualization' },
        { name: 'SQL & Relational DBs', level: 'Basic', tag: 'Data Queries & Schema Basics' }
      ]
    },
    {
      title: 'Tools, Quality & DevOps Workflow',
      badge: 'Ecosystem',
      icon: 'tools',
      skills: [
        { name: 'SonarQube', level: 'Core', tag: 'Code Quality Gates & Static Analysis' },
        { name: 'Git & Version Control', level: 'Proficient', tag: 'GitHub, GitLab, Bitbucket & PRs' },
        { name: 'Postman', level: 'Proficient', tag: 'REST API Verification & Testing' },
        { name: 'Jira & Agile Workflows', level: 'Proficient', tag: 'Sprint Cycles, User Stories & Triage' }
      ]
    }
  ];
}
