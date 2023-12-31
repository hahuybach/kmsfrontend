import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserResponseForUserList} from "../../../../models/user-response-for-user-list";
import {SchoolResponse} from "../../../../models/school-response";
import {RoleResponse} from "../../../../models/role-response";
import {AccountService} from "../../../../services/account.service";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {SchoolService} from "../../../../services/school.service";
import {ToastService} from "../../../../shared/toast/toast.service";
import {RoleService} from "../../../../services/role.service";
import {AuthService} from "../../../../services/auth.service";
import {Role} from "../../../../shared/enum/role";
import {ConfirmationService, ConfirmEventType} from "primeng/api";
import {unSub} from "../../../../shared/util/util";


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  users: UserResponseForUserList[];
  schools: SchoolResponse[];
  roles: RoleResponse[];
  selectedRole: any;
  currentSchool: any;
  totalElements: number = 0;
  pageNo: number = 1;
  pageSize: number = 5;
  sortBy: string = 'user.userId';
  sortDirection: string = 'desc';
  gender: string = '';
  genders: any[] = [{label: 'Nam', value: 'MALE'},
    {label: 'Nữ', value: 'FEMALE'}]
  phoneNumber: string = '';
  isActive: any;
  isActives: any[] = [{label: 'Đang hoạt động', value: 'true'},
    {label: 'Ngưng hoạt động', value: 'false'}]
  email: string = '';
  fullName: string = '';
  globalSearch: string = '';
  advanceSearch: boolean = false;
  advanceSearchButtonText = 'Hiện tra cứu nâng cao';
  totalPages: number = 0;
  maxPageError: boolean = false;
  recordPerPageOption: number[] = [5, 15, 25];
  currentUser: UserResponseForUserList;
  hasPrincipalRow: any;
  isPrincipal: boolean;
  isAdmin: boolean;
  isDirector: boolean
  excelFile: any
  visible = false;
  isLoading = false;
  submitCompleted = false;
  sub: any[] = []
  sortByCriteria: string[] = ['user.userId', 'user.fullName','user.account.email','user.phoneNumber','user.account.school','user.account.school.schoolName','user.account.accountRoles.role.roleName','user.account.isActive']
  @ViewChild('fileInput')
  myInputVariable: ElementRef;
    removeChiefInspector(){
        this.roles = this.roles.filter(value => !(value.roleId == 5))

    }

  resetExcelFile() {
    console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = "";
    console.log(this.myInputVariable.nativeElement.files);
  }

  setAuthority() {
    for (const argument of this.auth.getRoleFromJwt()) {
      if (argument.authority === Role.PRINCIPAL) {
        this.isPrincipal = true;
      }
      if (argument.authority === Role.ADMIN) {
        this.isAdmin = true;
      }
      if (argument.authority === Role.DIRECTOR) {
        this.isDirector = true;
      }
    }
  }

  isUpdatable(updateUser: UserResponseForUserList) {
    if (updateUser.accountRoles?.some(value => value.role?.roleName === Role.ADMIN)) {
      return false;
    }
    if (updateUser.school?.schoolId == 1 && (this.isDirector || this.isAdmin)) {
      if (this.isDirector && updateUser.accountRoles?.some(value => value.role?.roleName === Role.DIRECTOR)) {
        return false;
      }
      return true;
    }
    if (updateUser.school?.schoolId != 1 && (this.isAdmin || this.isPrincipal)) {
      if (this.isPrincipal && updateUser.accountRoles?.some(value => value.role?.roleName === Role.PRINCIPAL)) {
        return false;
      }
      return true;
    }
    return false;
  }

  constructor(
    private accountService: AccountService,
    private schoolService: SchoolService,
    private toastService: ToastService,
    private route: Router,
    private activateRouter: ActivatedRoute,
    private roleService: RoleService,
    private auth: AuthService,
    private confirmationService: ConfirmationService
  ) {
  }


  loadSelectionForAdminAndDirector() {
    const roleSub = this.roleService.findAll().subscribe(
      {
        next: (data) => {
          this.roles = data.roles;
          console.log(this.roles);
            this.removeChiefInspector()

        },
        error: (err) => {
          this.toastService.showWarn('userListError', "Lỗi", err.error.message)
          console.log(err);
        }
      }
    );
    this.sub.push(roleSub)

    const schoolSub = this.schoolService.findAll().subscribe(
      {
        next: (data) => {
          this.schools = data;
          console.log(this.schools);
        },
        error: (err) => {
          this.toastService.showWarn('userListError', "Lỗi", err.error.message)
          console.log(err);
        }
      }
    )
    this.sub.push(schoolSub)
  }

  loadSelectionForPrincipal() {
    const roleSub = this.roleService.findSchoolRole().subscribe(
      {
        next: (data) => {
          this.roles = data.roles;
          console.log(this.roles);
            this.removeChiefInspector()

        },
        error: (err) => {
          this.toastService.showWarn('userListError', "Lỗi", err.error.message)
          console.log(err);
        }
      }
    );
    this.currentSchool = this.currentUser.school?.schoolId;
    this.sub.push(roleSub)
  }

  ngOnInit(): void {
    this.setAuthority();

    const currentUserSub = this.accountService.getCurrentUser().subscribe(
      {
        next: (data) => {
          this.currentUser = data.userDto;
          this.hasPrincipalRow = this.currentUser.accountRoles?.some((accountRole) =>
            accountRole.role?.roleName === 'Hiệu Trưởng'
          )
          if (!this.hasPrincipalRow) {
            this.loadSelectionForAdminAndDirector()
          } else {
            this.loadSelectionForPrincipal();

          }

        },
        error: (err) => {
          this.toastService.showWarn('userListError', "Lỗi", err.error.message)
          console.log(err);
        }
      }
    )
    this.sub.push(currentUserSub)
    this.activateRouter.queryParams.subscribe(
      value => {
        if (value['pageNo']) {
          this.pageNo = value['pageNo'];
          if (isNaN(this.pageSize)){
            this.pageNo = 1
          }
        }
        if (value['pageSize']) {
          this.pageSize = value['pageSize'];
          if (isNaN(this.pageSize)){
            this.pageSize = 5
          }
          if (this.pageSize > 25) {
            this.pageSize = 5;
          }
        }
        if (value['sortBy']) {
          this.sortBy = value['sortBy'];
          if (!this.sortByCriteria.some(str => str == this.sortBy)){
            this.sortBy = 'user.userId';
          }else {
            this.sortBy = value['sortBy'];
          }
        }
        if (value['sortDirection']) {
          this.sortDirection = value['sortDirection'];
          if (this.sortDirection != 'desc' && this.sortDirection != 'asc'){
            this.sortDirection = 'desc'
          }
        }
        if (value['phoneNumber']) {
          this.phoneNumber = value['phoneNumber'];
        }
        if (value['isActive']) {
          this.isActive = value['isActive'];
        }
        if (value['email']) {
          this.email = value['email'];
        }
        if (value['fullName']) {
          this.fullName = value['fullName']
        }
        if (value['selectedRole'] && value['selectedRole'] !== undefined) {
          this.selectedRole = Number(value['selectedRole']);

        }
        if (value['globalSearch']) {
          this.globalSearch = value['globalSearch']
        }
        if (value['currentSchool'] && value['currentSchool'] !== undefined) {
          this.currentSchool = Number(value['currentSchool']);

        }
        if (value['advanceSearch']) {
          this.advanceSearch = (value['advanceSearch'] == 'true')
        }
        if (value['advanceSearch']) {
          this.advanceSearch = (value['advanceSearch'] == 'true')
          if (this.advanceSearch) {
            this.advanceSearchButtonText = "Ẩn tra cứu nâng cao"
          } else {
            this.advanceSearchButtonText = "Hiện tra cứu nâng cao"

          }
        }
      })

    this.loadUsers();
  }

  loadUsers() {
    const usersLoadSub = this.accountService.filterAccount(
      this.pageNo, this.pageSize, this.sortBy, this.sortDirection, this.fullName,
      this.gender, this.phoneNumber, this.isActive, this.globalSearch, this.email,
      this.selectedRole, this.currentSchool)
      .subscribe({
        next: (data) => {
          this.users = data.userDtoPage.content;
          this.totalPages = data.userDtoPage.totalPages;
          this.totalElements = data.userDtoPage.totalElements;
          console.log(data);
          this.route.navigate([], {
            relativeTo: this.activateRouter,
            queryParams: {
              pageNo: this.pageNo,
              pageSize: this.pageSize,
              sortBy: this.sortBy,
              sortDirection: this.sortDirection,
              phoneNumber: this.phoneNumber,
              isActive: this.isActive,
              email: this.email,
              selectedRole: this.selectedRole,
              currentSchool: this.currentSchool,
              fullName: this.fullName,
              globalSearch: this.globalSearch,
              advanceSearch: this.advanceSearch
              // Add other query parameters as needed
            },
            queryParamsHandling: 'merge'
          });
          this.onChangePageSize()

        },error: (error) => {
          console.log(error);
        }
      })
    this.sub.push(usersLoadSub);
  }

  onAdvanceSearch() {
    if (this.advanceSearch) {
      this.reset();
      this.advanceSearch = false;
      this.advanceSearchButtonText = 'Hiện tra cứu nâng cao'
    } else {
      this.reset();
      this.advanceSearch = true;
      this.advanceSearchButtonText = 'Ẩn tra cứu nâng cao'
    }

  }

  getStatusSeverity(status: boolean | undefined): string {
    if (status) {
      return 'success';
    }
    return 'danger';
  }

  getStatusValue(status: undefined | boolean): string {
    if (status) {
      return 'Đang hoạt động';
    }
    return 'Ngưng hoạt động';
  }

  protected reset() {
    this.pageNo = 1;
    this.sortBy = 'user.userId';
    this.sortDirection = 'desc';
    this.fullName = ''
    this.gender = '';
    this.phoneNumber = '';
    this.isActive = undefined;
    this.email = '';
    this.selectedRole = null;
    this.currentSchool = null;
    this.fullName = '';
    this.globalSearch = '';
    this.loadUsers();
  }

  onSort(sortBy: string) {
    if (this.sortBy === sortBy) {
      // If it is the same column, toggle the sort direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // If it is a different column, set the new sortBy and sortDirection
      this.sortBy = sortBy;
      this.sortDirection = 'asc'; // or 'desc' depending on your default sorting preference
    }

    // Reload the guidance documents with the updated sorting
    this.loadUsers();
  }

  onDetail(userId: number | undefined) {
    this.route.navigate(['user/' + userId])
  }

  maxPageOnKeyUp() {
    if (this.pageNo > this.totalPages) {
      this.pageNo = this.totalPages;
      this.toastService.showWarn('paging', "Thông báo", 'Số trang bạn vừa tìm không thể vượt quá ' + this.totalPages)
    }
  }

  onChangePageSize() {
    if (this.users.length == 0 && this.pageNo > 1 && this.totalPages != 0) {
      this.pageNo = this.totalPages;
      this.loadUsers();
    }
  }

  onTableDataChange($event: number) {
    this.pageNo = $event;
    this.loadUsers()
  }

  removeGender() {
    this.gender = '';
    this.loadUsers();
  }

  removeStatus() {
    this.isActive = undefined;
    this.loadUsers();

  }

  onCreateUser() {
    this.route.navigate(['user/create'])
  }

  onUpdate(userId: number | undefined) {
    this.route.navigate(['user/update/' + userId])

  }

  onSubmitFile(event: any) {

    const file = event.target.files[0];
    if (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.excelFile = file;

    } else {
      // Handle error or provide feedback to the user
      this.toastService.showWarn('userListError', "Lỗi", "File tải lên phải ở dưới dạng excel (.xls)")
      event.target.value = null;

    }

  }

  onCreateUserByFile() {
    if (!this.excelFile) {
      this.toastService.showError('userListError', 'Thông báo', "Vui lòng chọn 1 file")
    }
    if (this.excelFile) {
      this.isLoading = true
      const uploadExcelSub = this.accountService.uploadFileExcel(this.excelFile).subscribe({
        next: (data) => {
          this.submitCompleted = true;
          setTimeout(() => {
            this.toastService.showSuccess('userListError', "Thông báo", "Tạo " + data.length + " người dùng thành công")
            this.loadUsers();
          }, 1500)
          this.isLoading = false;
          this.excelFile = null;
          this.resetExcelFile();
        },
        error: (error) => {
          this.submitCompleted = false;
          this.isLoading = false;
          this.toastService.showWarn('userListError', "Lỗi", error.error.message)
          this.excelFile = null;
          this.resetExcelFile();

        }
      });
      this.sub.push(uploadExcelSub)
    }

  }


  showImportUser() {
    this.visible = true;
  }

  downloadTemplate() {
    const getUserTemplateSub = this.accountService.getUserTemplate().subscribe({
      next: (data) => {
        const blob = new Blob([data.body as BlobPart], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'template.xlsx'; // Set the desired filename for the downloaded file
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
    this.sub.push(getUserTemplateSub)
  }

  confirm() {
    if (!this.excelFile) {
      this.toastService.showWarn('userListError', 'Thông báo', 'Vui lòng chọn 1 file');
      return
    }
    this.confirmationService.confirm({
      message: 'Bạn có xác nhận việc tạo người dùng bằng file excel này không?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Có',
      rejectLabel: 'Không',
      accept: () => {
        this.onCreateUserByFile()

      },
      key: 'createUserByExcel'
    });
  }

  ngOnDestroy(): void {
    unSub(this.sub)
  }

}
