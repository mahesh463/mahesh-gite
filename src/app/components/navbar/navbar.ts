import { Component, signal, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  linkedin = 'https://www.linkedin.com/in/mahesh-gite-669738313/';
  resumeUrl = 'assets/media_1788593016045.pdf';

  navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Strengths', href: '#strengths' },
    { label: 'Contact', href: '#contact' },
  ];

  ngOnInit() {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');
    try {
      localStorage.removeItem('mahesh_theme');
    } catch (e) {}
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
}
