import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {map, Observable} from "rxjs";
import {SchoolService} from "../../../../services/school.service";
import {AccountService} from "../../../../services/account.service";
import {ToastService} from "../../../../shared/toast/toast.service";

@Component({
    selector: 'app-school-create',
    templateUrl: './school-create.component.html',
    styleUrls: ['./school-create.component.scss']
})
export class SchoolCreateComponent implements OnInit {
    saveSchoolForm: FormGroup;
    isSubmitted: boolean
    isLoading: boolean = false;


    constructor(private formBuilder: FormBuilder,
                private accountService: AccountService,
                private schoolService: SchoolService,
                private toastService : ToastService
    ) {
    }

    ngOnInit(): void {
        this.saveSchoolForm = this.formBuilder.group({
            schoolName: ['', Validators.required, [this.validateSchoolNameUnique.bind(this)]],
            exactAddress: ['', Validators.required],
            isActive: [true, Validators.required],
            email: ['', [Validators.required, Validators.email], [this.validateEmailUnique.bind(this)]]
        });

    }

    onSubmit() {
        this.isSubmitted = true;

        const saveSchoolRequest = {
            school: {
                schoolName: this.saveSchoolForm.value.schoolName,
                exactAddress: this.saveSchoolForm.value.exactAddress,
                isActive: this.saveSchoolForm.value.isActive
            },
            account: {
                email: this.saveSchoolForm.value.email
            }
        };
        if(!this.saveSchoolForm.invalid){
            this.isLoading = true;
            this.schoolService.saveSchool(saveSchoolRequest)
                .subscribe({
                    next : (result) =>{
                        console.log(result);
                    },
                    error : (error) => {
                        this.isLoading = false;
                        this.toastService.showWarn('error',"Lỗi", error.error.message)
                        console.log(error);
                    }
                })
        }

        console.log(saveSchoolRequest);
    }


    isBlank(field: string): boolean | undefined {
        return (
            this.saveSchoolForm.get(field)?.hasError('required') &&
            ((this.saveSchoolForm.get(field)?.dirty ?? false) ||
                (this.saveSchoolForm.get(field)?.touched ?? false) || this.isSubmitted)
        );
    }

    validateEmailUnique(control: AbstractControl): Promise<ValidationErrors | null> {

        const email = control.value;
        return new Promise<ValidationErrors | null>((resolve, reject) => {
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

    validateSchoolNameUnique(control: AbstractControl): Promise<ValidationErrors | null> {

        const schoolName = control.value;
        return new Promise<ValidationErrors | null>((resolve, reject) => {
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



}
