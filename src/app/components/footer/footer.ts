import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  email = 'gitemahesh32@gmail.com';
  phone = '+91 9637201245';
  linkedin = 'https://www.linkedin.com/in/mahesh-gite-669738313/';

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
