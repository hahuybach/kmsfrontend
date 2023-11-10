import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SchoolService} from "../../../../services/school.service";
import {AbstractControl, FormBuilder, ValidationErrors, Validators} from "@angular/forms";
import {SchoolResponse} from "../../../../models/school-response";
import {switchMap} from "rxjs";
import {AccountResponse} from "../../../../models/account-response";
import {AccountService} from "../../../../services/account.service";
import {ToastService} from "../../../../shared/toast/toast.service";

@Component({
    selector: 'app-school-update',
    templateUrl: './school-update.component.html',
    styleUrls: ['./school-update.component.scss']
})
export class SchoolUpdateComponent implements OnInit {
    updateForm = this.fb.group({
        schoolId: [-1, Validators.required],
        schoolName: ['', Validators.required, [this.validateSchoolNameUnique.bind(this)]],
        address: ['', Validators.required],
        isActive: [false, Validators.required],
        principalEmail: ['', [Validators.email, Validators.required], [this.validateEmailUnique.bind(this)]]
    })
    school: SchoolResponse;
    principal: AccountResponse
    isUpdatePrincipalEmail: Boolean = false;
    isSubmitted: boolean = false;
    isLoading: boolean = false;

    constructor(private router: Router,
                private schoolService: SchoolService,
                private fb: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private accountService: AccountService,
                private toastService: ToastService) {


    }

    ngOnInit(): void {
        this.activatedRoute.params.pipe(
            switchMap((param) => {
                return this.schoolService.findSchoolById(param['id'])
            })
        ).subscribe((data) => {
            this.school = data;
            this.principal = data.principal;
            this.updateForm.patchValue({
                schoolId: this.school.schoolId,
                schoolName: this.school.schoolName,
                address: this.school.exactAddress,
                isActive: this.school.isActive,
                principalEmail: this.principal.email

            })
            console.log(data);
        })

    }

    protected readonly onsubmit = onsubmit;

    onSubmit() {
        this.isSubmitted = true;

        console.log(this.updateForm.value);
        if (!this.updateForm.invalid) {
            this.isLoading = true;
            this.schoolService.updateSchool(this.updateForm.value).subscribe(
                {
                    next: (data) => {
                       this.router.navigate(['school/' + this.school.schoolId])
                    },
                    error: (err) => {
                        this.isLoading = false;
                        this.toastService.showWarn('error',"Lỗi", err.error.message)
                        console.log(err);
                    }
                }
            )
        }
    }


    onClickNotUpdatePrincipalEmail() {
        if (this.isUpdatePrincipalEmail) {
            this.isUpdatePrincipalEmail = false;
            this.updateForm.patchValue({
                principalEmail: this.principal.email
            })

        } else {
            this.isUpdatePrincipalEmail = true;

        }

    }

    isBlank(field: string): boolean | undefined {
        return (
            this.updateForm.get(field)?.hasError('required') &&
            ((this.updateForm.get(field)?.dirty ?? false) ||
                (this.updateForm.get(field)?.touched ?? false) || this.isSubmitted)
        );
    }

    validateSchoolNameUnique(control: AbstractControl): Promise<ValidationErrors | null> {

        const schoolName = control.value;

        return new Promise<ValidationErrors | null>((resolve, reject) => {
            if (this.school.schoolName == schoolName) {
                resolve(null);
            }
            this.schoolService.isSchoolNameUnique(schoolName).subscribe({
                next: (result) => {
                    console.log(result);
                    if (result.isUnique) {
                        setTimeout(() => {
                            resolve(null);

                        }, 1000)
                    } else {
                        setTimeout(() => {
                            resolve({'notUnique': true});

                        }, 1000)
                    }
                },
                error: (error) => {
                    console.error(error);
                    // Handle the error if necessary
                    reject(error);
                },
                complete: () => {
                },
            });
        });
    }

    validateEmailUnique(control: AbstractControl): Promise<ValidationErrors | null> {

        const email = control.value;
        return new Promise<ValidationErrors | null>((resolve, reject) => {
            if (this.principal.email == email) {
                resolve(null)
            }
            this.accountService.isUnique(email).subscribe({
                next: (result) => {
                    console.log(result);
                    if (result.isUnique) {
                        setTimeout(() => {
                            resolve(null);

                        }, 1000)
                    } else {
                        setTimeout(() => {
                            resolve({'notUnique': true});

                        }, 1000)
                    }
                },
                error: (error) => {
                    console.error(error);
                    // Handle the error if necessary
                    reject(error);
                },
                complete: () => {
                },
            });
        });
    }

    onBack() {
        this.router.navigate(['school/' + this.school.schoolId])
    }
}
