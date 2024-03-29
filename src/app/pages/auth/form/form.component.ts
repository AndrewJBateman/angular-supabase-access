import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiError, User, UserCredentials } from '@supabase/gotrue-js';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '@auth/services/auth.services';
import { ACTIONS } from '@shared/constants/constant';

export interface OptionsForm {
  id: string;
  label: string;
}
interface UserReponse extends User, ApiError {}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  authForm!: UntypedFormGroup;
  signIn = ACTIONS.signIn;
  @Input() options!: OptionsForm;

  constructor(
    private readonly authSvc: AuthService,
    private readonly fb: UntypedFormBuilder,
    private readonly router: Router,
    private readonly toastSvc: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  // credentials = {"email": "a string", "password": "another string"}
  async onSubmit(): Promise<void> {
    const credentials: UserCredentials = this.authForm.value;
    let actionToCall = this.authSvc.signUp(credentials);

    if (this.options.id === ACTIONS.signIn) {
      actionToCall = this.authSvc.signIn(credentials);
    }

    try {
      const result = (await actionToCall) as UserReponse;
      if (result.email) {
        this.redirectUser();
      } else {
        this.toastSvc.info(result.message, 'Info');
      }
    } catch (error) {
      console.log(error);
    }
  }

  private initForm(): void {
    this.authForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  private redirectUser(): void {
    this.router.navigate(['/home']);
  }
}
