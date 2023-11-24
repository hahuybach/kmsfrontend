import {Component, OnInit} from '@angular/core';
import {SchoolResponse} from "../../../models/school-response";
import {SchoolService} from "../../../services/school.service";
import {Table} from "primeng/table";
import {FilterMatchMode, PrimeNGConfig} from "primeng/api";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {Role} from "../../../shared/enum/role";
import {ToastService} from "../../../shared/toast/toast.service";

@Component({
    selector: 'app-school-list',
    templateUrl: './school-list.component.html',
    styleUrls: ['./school-list.component.scss']
})
export class SchoolListComponent implements OnInit {
    schools: SchoolResponse[];
    statuses: any[];
    selectedSchool: SchoolResponse;
    isDirector: boolean;
    visible = false;
    excelFile: any

    constructor(private schoolService: SchoolService,
                private config: PrimeNGConfig,
                private router: Router,
                private auth: AuthService,
                private toastService: ToastService
    ) {

    }

    setAuth() {
        for (const role of this.auth.getRoleFromJwt()) {
            if (role.authority === Role.DIRECTOR) {
                this.isDirector = true;
            }
        }
    }

    ngOnInit(): void {
        this.setAuth()
        this.schoolService.findAllSchools().subscribe({

            next: (value) => {
                this.schools = value;
                console.log(this.schools);
            }
        })
        this.statuses = [
            {label: 'Đang hoạt động', value: true},
            {label: 'Ngưng hoạt động', value: false}
        ]
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
        this.router.navigate(['school/' + schoolId])
    }

    onCreateSchool() {
        this.router.navigate(['/schools/create'])
    }

    onUpdate(schoolId: any) {
        this.router.navigate(['school/' + schoolId + '/update'])
    }

    showImportSchool() {
        this.visible = true;
    }

    downloadTemplate() {
        this.schoolService.getSchoolTemplate().subscribe({
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
    }

    onSubmitFile(event: any) {
        const file = event.target.files[0];
        if (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            this.excelFile = file;
            console.log(this.excelFile);

        } else {
            // Handle error or provide feedback to the user
            this.toastService.showWarn('error', "Lỗi", "File tải lên phải ở dưới dạng excel (.xls)")
            event.target.value = null;

        }
    }

    onCreateSchoolByFile() {
        if (this.excelFile) {
            this.schoolService.uploadFileExcel(this.excelFile).subscribe({
                next: (data) => {
                    this.toastService.showSuccess('error', "Thông báo", "Tạo trường thành công")
                    this.schoolService.findAllSchools().subscribe({

                        next: (value) => {
                            this.schools = value;
                            console.log(this.schools);
                        }
                    })
                },
                error: (error) => {
                    this.toastService.showWarn('error', "Lỗi", error.error.message)

                }
            });
        }

    }
}
