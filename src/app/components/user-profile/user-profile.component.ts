import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AccountService} from "../../services/account.service";
import {FormBuilder, Validators} from "@angular/forms";
import {NoWhitespaceValidator} from "../../shared/validators/no-white-space.validator";
import {validateDateNotGreaterThanToday} from "../../shared/validators/date-not-greater-than-today";
import {UserResponseForUserList} from "../../models/user-response-for-user-list";
import {ToastService} from "../../shared/toast/toast.service";
import {ConfirmationService} from "primeng/api";
import {getFirstAndLastName, unSub} from "../../shared/util/util";

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    isUpdate = false
    currentUser: UserResponseForUserList
    form = this.fb.group({
        fullName: ['', [NoWhitespaceValidator(), Validators.maxLength(254)]],
        dob: [null as unknown as Date, validateDateNotGreaterThanToday.bind(this)],
        gender: ['', Validators.required],
        phoneNumber: ['', [Validators.pattern("^[0-9]{10}$"), Validators.required]]
    })
    subs: any[] = []

    constructor(private fb: FormBuilder,
                private accountService: AccountService,
                private toastService: ToastService,
                private confirmationService: ConfirmationService
    ) {
    }

    genders: any[] = [{label: 'Nam', value: 'MALE'},
        {label: 'Nữ', value: 'FEMALE'}]
    isSubmitted = false
    isVisible: any;
    isLoading = false;
    submitCompleted = false;
    avatar: string;

    ngOnInit(): void {

        const sub = this.accountService.getCurrentUser().subscribe({
            next: (data) => {
                this.currentUser = data.userDto;
                this.avatar = getFirstAndLastName(this.currentUser.fullName);
                this.form.patchValue({
                    fullName: this.currentUser.fullName,
                    dob: this.currentUser?.dob,
                    gender: this.currentUser.gender,
                    phoneNumber: this.currentUser.phoneNumber,
                })
            }

        })
        this.subs.push(sub);
        console.log(this.form.value);
    }

    resetVisible() {
        this.visibleChange.emit(this.visible);
        this.isUpdate = false;
        this.form.patchValue({
            fullName: this.currentUser.fullName,
            dob: this.currentUser?.dob,
            gender: this.currentUser.gender,
            phoneNumber: this.currentUser.phoneNumber,
        })
    }

    onUpdate() {
        this.isUpdate = !this.isUpdate;
        this.form.patchValue({
            fullName: this.currentUser.fullName,
            dob: this.currentUser?.dob,
            gender: this.currentUser.gender,
            phoneNumber: this.currentUser.phoneNumber,
        })
    }

    isBlank(field: string): boolean | undefined {
        return (
            this.form.get(field)?.hasError('required') &&
            ((this.form.get(field)?.dirty ?? false) ||
                (this.form.get(field)?.touched ?? false) || this.isSubmitted)
        );
    }

    isError(field: string, errorCode: string): boolean | undefined {
        return (
            this.form.get(field)?.hasError(errorCode) &&
            ((this.form.get(field)?.dirty ?? false) ||
                (this.form.get(field)?.touched ?? false))
        );
    }

    onSubmit() {
        if (!this.form.invalid) {
            this.isLoading = true

            const sub = this.accountService.updateUserDetail(this.form.value).subscribe({
                next: (data) => {
                    this.isUpdate = false;
                    this.submitCompleted = true;
                    setTimeout(() => {
                        this.ngOnInit();
                    }, 1500)
                    setTimeout(() => {
                        this.isLoading = false
                    }, 1500)
                }, error: (error) => {
                    this.isLoading = false;
                    this.submitCompleted = false;
                    this.toastService.showWarn("user-profile", "Lỗi", error.error.message);
                }

            })
            this.subs.push(sub);
        }
    }

    confirm() {
        if (!this.form.touched) {
            return;
        }
        if (this.form.invalid) {
            this.isSubmitted = true;
            return
        }
        this.confirmationService.confirm({
            message: 'Bạn có xác nhận việc thay đổi này không?',
            header: 'Xác nhân',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Có',
            rejectLabel: 'Không',
            accept: () => {
                this.onSubmit()

            }, key: "user-profile-confirm",
        });
    }

    onClickChangePassword() {
        this.isVisible = !this.isVisible;
    }

    ngOnDestroy(): void {
        unSub(this.subs);
    }
}
