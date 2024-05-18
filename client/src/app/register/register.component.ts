import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  validationErrors: string[] | undefined;
  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }
  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      username: ['', Validators.required],
      password: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(8)],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () =>
        this.registerForm.controls['confirmPassword'].updateValueAndValidity(),
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (contol: AbstractControl) => {
      return contol.value === contol.parent?.get(matchTo)?.value
        ? null
        : { notMatching: true };
    };
  }

  register() {
    const dob = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value)
    const values = {...this.registerForm.value, dateOfBirth:dob}
    console.log(values);
    
    this.accountService.register(values).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
      },
      error: (error) => {
        this.validationErrors = error;
      },
    });
  }
  cancel() {
    this.cancelRegister.emit(false);
  }
  private getDateOnly(dob: string | undefined) {
    if (!dob) return;
    let theDob = new Date(dob);
    return new Date(
      theDob.setMinutes(theDob.getMinutes() - theDob.getTimezoneOffset())
    )
      .toISOString()
      .slice(0, 10);
  }
}
