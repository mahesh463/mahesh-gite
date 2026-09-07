import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  imports: [CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  email = 'gitemahesh32@gmail.com';
  phone = '+91 9637201245';
  location = 'Sakur, Maharashtra, India';
  linkedin = 'https://www.linkedin.com/in/mahesh-gite-669738313/';
}

