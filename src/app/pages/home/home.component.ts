import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { ContactUsService } from '../../services/contact-us.service';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RecaptchaModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  contactForm!: FormGroup;
  errorMessage: string = '';
  submissionStatus: string = '';
  captchaResponse: string | null = null;
  siteKey = environment.recaptcha.siteKey;

  constructor(
    private fb: FormBuilder,
    private contactUsService: ContactUsService
  ) {
    this.initForm();
  }

  initForm() {
    this.contactForm = this.fb.group({
      agencyName: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      topic: [false, Validators.required],
      address: ['', Validators.required],
      recaptcha: ['', Validators.required],
    });
  }
  sendFormData() {
    //console.log(this.contactForm.value);
    this.errorMessage = '';
    if (this.contactForm.valid) {
      this.contactUsService
        .submitContactForm(this.contactForm.value)
        .subscribe({
          next: (response) => {
            console.log('API Response:', response);
            this.submissionStatus = 'Thank you for contacting us!';
            this.contactForm.reset(); // Reset the form
            this.captchaResponse = null;
          },
          error: (err) => {
            this.errorMessage = err.message;
          },
        });
    } else {
      alert('Please fill in all required fields correctly!');
    }
  }
  onCaptchaResolved(response: string | null) {
    console.log(response);
    this.captchaResponse = response;
    this.contactForm.get('recaptcha')?.setValue(this.captchaResponse);
  }
  errorCheck() {
    // Mark all fields as touched so error messages show up
    Object.keys(this.contactForm.controls).forEach((field) => {
      const control = this.contactForm.get(field);
      control?.markAsTouched();
    });
    // Check if CAPTCHA is solved
    if (!this.captchaResponse) {
      this.contactForm.controls['recaptcha'].setErrors({ required: true });
    }
  }
  onSubmit() {
    this.errorCheck();
    if (this.contactForm.invalid) {
      console.log('Returning for invalid form');
      return;
    }
    this.sendFormData();
  }
}
