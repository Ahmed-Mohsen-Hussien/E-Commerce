import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChangePasswordService } from '../../services/change-password.service';
import { Router } from '@angular/router';
import { STORED_KEYS } from '../../../../../core/constants/storedKeys';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly changePasswordService = inject(ChangePasswordService);
  changePasswordForm!: FormGroup;
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showRePassword: boolean = false;

  ngOnInit(): void {
    this.changePasswordFormInitialization();
  }
  changePasswordFormInitialization(): void {
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: [null, [Validators.required]],
        password: [
          null,
          [
            Validators.required,
            Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/),
          ],
        ],
        rePassword: [null, [Validators.required]],
      },
      { validators: this.handleConfirmPassword },
    );
  }
  submitChangePasswordForm(): void {
    if (this.changePasswordForm.valid) {
      this.changePasswordService.changePassword(this.changePasswordForm.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Your password has been changed , You will be redirected to login page',
            });
            localStorage.removeItem(STORED_KEYS.userToken);
            this.router.navigate(['/login']);
          }
          console.log(res);
        },
      });
    } else {
      this.showFirstError();
    }
  }
  handleConfirmPassword(form: AbstractControl) {
    return form.get('password')?.value === form.get('rePassword')?.value
      ? null
      : { mismatch: true };
  }
  showFirstError(): void {
    const controls = this.changePasswordForm.controls;
    for (const key in controls) {
      const control = controls[key];
      if (control.invalid) {
        control.markAsTouched();
        break;
      }
    }
  }
  toggleCurrentPassword(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }
  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }
  toggleRePassword(): void {
    this.showRePassword = !this.showRePassword;
  }
}
