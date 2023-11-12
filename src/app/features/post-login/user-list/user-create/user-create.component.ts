import {Component, OnInit} from '@angular/core';
import {AccountService} from "../../../../services/account.service";
import {Route, Router} from "@angular/router";
import {RoleService} from "../../../../services/role.service";
import {RoleResponse} from "../../../../models/role-response";
import {AuthService} from "../../../../services/auth.service";
import {ToastService} from "../../../../shared/toast/toast.service";
import {AbstractControl, FormBuilder, ValidationErrors, Validators} from "@angular/forms";
import {NoWhitespaceValidator} from "../../../../shared/validators/no-white-space.validator";

@Component({
    selector: 'app-user-create',
    templateUrl: './user-create.component.html',
    styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {
    roles: RoleResponse[];
    selectedRole: RoleResponse;
    genders: any[] = [{label: 'Nam', value: 'MALE'},
        {label: 'Nữ', value: 'FEMALE'}]

    createUserForm = this.fb.group({
        email: ['', [Validators.email, Validators.required], [this.validateEmailUnique.bind(this)]],
        roleId: [-1,[Validators.required,Validators.min(1)] ],
        fullName: [],
        gender: [],
        phoneNumber: [null, [Validators.pattern("^[0-9]{10}$")]],
        dob: [null,this.validateDateNotGreaterThanToday.bind(this)],
        isActive: [true],
        schoolId:[]

    })
    isSubmitted: boolean = false;
    isLoading: boolean = false;

    constructor(private accountService: AccountService,
                private route: Router,
                private auth: AuthService,
                private roleService: RoleService,
                private toast: ToastService,
                private fb: FormBuilder) {
    }

    ngOnInit(): void {
        for (const argument of this.auth.getRoleFromJwt()) {
            if (argument.authority === "Trưởng Phòng") {
                this.roleService.findDeptRoles().subscribe({
                    next: (data) => {
                        this.roles = data.roles;


                    },
                    error: (err) => {
                        this.toast.showWarn('error', "Lỗi", err.error.message)
                        console.log(err);
                    }
                })
            }
        }
        this.createUserForm.patchValue({
            schoolId: this.auth.getSchoolFromJwt().schoolId
        })
        console.log(this.auth.getSchoolFromJwt());
        console.log(this.auth.getRoleFromJwt());
    }

    onSubmit() {
        this.isSubmitted = true;
        console.log(this.createUserForm.get('fullName'));
        if (!this.createUserForm.invalid){
            this.isLoading = true;
            console.log("is valid")
         this.accountService.saveUser(this.createUserForm).subscribe({
             next: (data) => {

                 console.log(data);
                 this.route.navigate(['user/' + data.userDto.userId])
             },
             error : (err) =>{
                 this.isLoading = false;
                 this.toast.showWarn('error', "Lỗi", err.error.message)
                 console.log(err);
             }
         })
        }
        console.log(this.createUserForm.value);
    }

    patchRoleId() {
        console.log(this.selectedRole);
        this.createUserForm.patchValue({
            roleId: this.selectedRole?.roleId
        })
    }
    isBlank(field: string): boolean | undefined {
        return (
            this.createUserForm.get(field)?.hasError('required') &&
            ((this.createUserForm.get(field)?.dirty ?? false) ||
                (this.createUserForm.get(field)?.touched ?? false) || this.isSubmitted)
        );
    }
    isError(field: string, errorCode: string): boolean | undefined {
        return (
            this.createUserForm.get(field)?.hasError(errorCode) &&
            ((this.createUserForm.get(field)?.dirty ?? false) ||
                (this.createUserForm.get(field)?.touched ?? false))
        );
    }
    validatePhoneNumber(control: AbstractControl): ValidationErrors | null {
        const phoneNumberRegex = /^\d{10}$/; // Regex pattern for a 10-digit phone number

        if (control.value && !phoneNumberRegex.test(control.value)) {
            return { 'invalidPhoneNumber': true };
        }

        return null;
    }

    validateDateNotGreaterThanToday(control: AbstractControl): ValidationErrors | null {
        const selectedDate = control.value;
        const today = new Date();

        if (selectedDate && new Date(selectedDate) > today) {
            return { 'invalidDate': true };
        }

        return null;
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

}
