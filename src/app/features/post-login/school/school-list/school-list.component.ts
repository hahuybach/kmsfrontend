import { Component, OnInit } from '@angular/core';
import { SchoolResponse } from '../../../../models/school-response';
import { SchoolService } from '../../../../services/school.service';
import { Table } from 'primeng/table';
import {
  ConfirmationService,
  ConfirmEventType,
  FilterMatchMode,
  PrimeNGConfig,
} from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { Role } from '../../../../shared/enum/role';
import { ToastService } from '../../../../shared/toast/toast.service';

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss'],
})
export class SchoolListComponent implements OnInit {
  schools: SchoolResponse[];
  statuses: any[];
  selectedSchool: SchoolResponse;
  visible = false;
  excelFile: any;
  isLoading = false;
  submitCompleted = false;
  filterVisible: Boolean = false;
  constructor(
    private schoolService: SchoolService,
    private config: PrimeNGConfig,
    private router: Router,
    private auth: AuthService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService
  ) {}
  sub: any[] = [];
  isPrincipal: boolean = false;
  isDirector: boolean = false;
  isAdmin: boolean = false;
  isInspector: boolean = false;
  isChiefInspector: boolean = false;
  isViceDirector: boolean = false;
  isSchoolNormalEmp: boolean = false;
  isSpecialist: boolean = false;
  schoolRoles: any[] = [
    Role.VICE_PRINCIPAL,
    Role.CHIEF_TEACHER,
    Role.CHIEF_OFFICE,
    Role.TEACHER,
    Role.ACCOUNTANT,
    Role.MEDIC,
    Role.CLERICAL_ASSISTANT,
    Role.SECURITY,
  ];

  setAuth() {
    if (this.auth.getRolesFromCookie()) {
      for (const argument of this.auth.getRoleFromJwt()) {
        if (argument.authority === Role.DIRECTOR) {
          this.isDirector = true;
        }
        if (argument.authority === Role.PRINCIPAL) {
          this.isPrincipal = true;
        }
        if (argument.authority === Role.ADMIN) {
          this.isAdmin = true;
        }
        if (argument.authority === Role.VICE_DIRECTOR) {
          this.isViceDirector = true;
        }
        if (argument.authority === Role.INSPECTOR) {
          this.isInspector = true;
        }
        if (argument.authority === Role.CHIEF_INSPECTOR) {
          this.isChiefInspector = true;
        }
        if (argument.authority === Role.SPECIALIST) {
          this.isSpecialist = true;
        }
        if (this.schoolRoles.some((value) => value === argument.authority)) {
          this.isSchoolNormalEmp = true;
        }
      }
    }
  }

  ngOnInit(): void {
    this.setAuth();
    this.schoolService.findAllSchools().subscribe({
      next: (value) => {
        this.schools = value;
        console.log(this.schools);
      },
    });
    this.statuses = [
      { label: 'Đang hoạt động', value: true },
      { label: 'Ngưng hoạt động', value: false },
    ];
    this.config.setTranslation({
      startsWith: 'Bắt đầu bằng',
      contains: 'Bao gồm',
      notContains: 'Không bao gồm',
      endsWith: 'Kết thúc bằng',
      equals: 'Bằng',
      notEquals: 'Không bằng',
      noFilter: 'Bỏ lọc',
      lt: 'Bé hơn',
    });
  }

  clear(table: Table) {
    table.clear();
  }

  onDetail(schoolId: any) {
    this.router.navigate(['school/' + schoolId]);
  }

  onCreateSchool() {
    this.router.navigate(['/school/create']);
  }

  onUpdate(schoolId: any) {
    this.router.navigate(['/school/update/' + schoolId]);
  }

  showImportSchool() {
    this.visible = true;
  }

  downloadTemplate() {
    this.schoolService.getSchoolTemplate().subscribe({
      next: (data) => {
        const blob = new Blob([data.body as BlobPart], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'template.xlsx'; // Set the desired filename for the downloaded file
        a.click();
        window.URL.revokeObjectURL(url);
      },
    });
  }

  onSubmitFile(event: any) {
    const file = event.target.files[0];
    if (
      file.type === 'application/vnd.ms-excel' ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      this.excelFile = file;
      console.log(this.excelFile);
    } else {
      // Handle error or provide feedback to the user
      this.toastService.showWarn(
        'error',
        'Lỗi',
        'File tải lên phải ở dưới dạng excel (.xls)'
      );
      event.target.value = null;
    }
  }

  onCreateSchoolByFile() {
    if (!this.excelFile) {
      this.toastService.showError('error', 'Thông báo', 'Vui lòng chọn 1 file');
    }
    if (this.excelFile) {
      this.isLoading = true;
      this.schoolService.uploadFileExcel(this.excelFile).subscribe({
        next: (data) => {
          this.submitCompleted = true;
          setTimeout(() => {
            this.toastService.showSuccess(
              'error',
              'Thông báo',
              'Tạo ' + data.length + ' trường thành công'
            );
            this.schoolService.findAllSchools().subscribe({
              next: (value) => {
                this.schools = value;
                console.log(this.schools);
              },
            });
          }, 1500);
          this.isLoading = false;
        },
        error: (error) => {
          this.toastService.showWarn('error', 'Lỗi', error.error.message);
        },
      });
    }
  }
  confirm() {
    this.confirmationService.confirm({
      message: 'Bạn có xác nhận việc tạo trường bằng file excel này không?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Có',
      rejectLabel: 'Không',
      accept: () => {
        this.onCreateSchoolByFile();
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.toastService.showError(
              'error',
              'Hủy bỏ',
              'Bạn đã hủy việc tạo trường'
            );
            break;
          case ConfirmEventType.CANCEL:
            this.toastService.showWarn(
              'error',
              'Hủy bỏ',
              'Bạn đã hủy việc tạo trường'
            );
            break;
        }
      },
      key: 'createSchoolByExcel',
    });
  }
  changeFilterVisible(status: Boolean) {
    this.filterVisible = status;
  }
}