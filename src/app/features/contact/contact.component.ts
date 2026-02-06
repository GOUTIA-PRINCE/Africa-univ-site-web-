import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export class ContactComponent {
    contactForm: FormGroup;
    submitted = false;

    constructor(private fb: FormBuilder) {
        this.contactForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            subject: ['', Validators.required],
            message: ['', [Validators.required, Validators.minLength(10)]]
        });
    }

    onSubmit() {
        if (this.contactForm.valid) {
            this.submitted = true;
            console.log('Message sent', this.contactForm.value);
            // Simulate API call
            setTimeout(() => {
                this.contactForm.reset();
                this.submitted = false;
                alert('Votre message a été envoyé avec succès !');
            }, 2000);
        }
    }
}
