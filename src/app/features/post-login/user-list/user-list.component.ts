import {Component, OnInit} from '@angular/core';
import {UserResponseForUserList} from "../../../models/user-response-for-user-list";
import {SchoolResponse} from "../../../models/school-response";
import {RoleResponse} from "../../../models/role-response";
import {AccountService} from "../../../services/account.service";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {SchoolService} from "../../../services/school.service";
import {ToastService} from "../../../shared/toast/toast.service";
import {RoleService} from "../../../services/role.service";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
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


  constructor(
    private accountService: AccountService,
    private schoolService: SchoolService,
    private toastService: ToastService,
    private router: Router,
    private activateRouter: ActivatedRoute,
    private roleService: RoleService,
    private auth: AuthService
  ) {
  }


  loadSelectionForAdminAndDirector(){
    this.roleService.findAll().subscribe(
      {
        next: (data) => {
          this.roles = data.roles;
          console.log(this.roles);
        },
        error: (err) => {
          this.toastService.showWarn('error', "Lỗi", err.error.message)
          console.log(err);
        }
      }
    );

    this.schoolService.findAll().subscribe(
      {
        next: (data) => {
          this.schools = data;
          console.log(this.schools);
        },
        error: (err) => {
          this.toastService.showWarn('error', "Lỗi", err.error.message)
          console.log(err);
        }
      }
    )
  }

  loadSelectionForPrincipal(){
    this.roleService.findSchoolRole().subscribe(
      {
        next: (data) => {
          this.roles = data.roles;
          console.log(this.roles);
        },
        error: (err) => {
          this.toastService.showWarn('error', "Lỗi", err.error.message)
          console.log(err);
        }
      }
    );
    this.currentSchool = this.currentUser.school;
  }
  ngOnInit(): void {
    this.accountService.getCurrentUser().subscribe(
      {
        next: (data) => {
          this.currentUser = data.userDto;
          this.hasPrincipalRow = this.currentUser.accountRoles?.some((accountRole) =>
            accountRole.role?.roleName === 'Hiệu Trưởng'
          )
          if (!this.hasPrincipalRow){
            this.loadSelectionForAdminAndDirector()
          }else {
            this.loadSelectionForPrincipal();
          }

        },
        error: (err) => {
          this.toastService.showWarn('error', "Lỗi", err.error.message)
          console.log(err);
        }
      }
    )

    this.loadUsers();
  }

  loadUsers() {
    this.accountService.filterAccount(
      this.pageNo, this.pageSize, this.sortBy, this.sortDirection, this.fullName,
      this.gender, this.phoneNumber, this.isActive, this.globalSearch, this.email,
      this.selectedRole, this.currentSchool)
      .subscribe({
        next: (data) => {
          this.users = data.userDtoPage.content;
          this.totalPages = data.userDtoPage.totalPages;
          this.totalElements = data.userDtoPage.totalElements;
          console.log(data);
          this.onChangePageSize()
        }
      })
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

  reset() {
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
    this.router.navigate(['user/' + userId])
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
    this.router.navigate(['users/create'])
  }
}
