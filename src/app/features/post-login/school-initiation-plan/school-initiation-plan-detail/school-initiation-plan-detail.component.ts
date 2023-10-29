import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {
  ConfirmEventType,
  ConfirmationService,
  MessageService,
} from 'primeng/api';
import { FileService } from 'src/app/services/file.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { InitiationplanService } from 'src/app/services/initiationplan.service';
import { switchMap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-school-initiation-plan-detail',
  templateUrl: './school-initiation-plan-detail.component.html',
  styleUrls: ['./school-initiation-plan-detail.component.scss'],
})
export class SchoolInitiationPlanDetailComponent implements OnInit {
  uploadedFiles: any[] = [];
  schoolinitiationplan: any;
  docHistoryVisible = false;
  uploadFileVisible = false;
  resetDeadlineVisible = false;
  file: File;
  fileStatus = false;
  iconStatus = true;
  buttonApproveStatus = false;
  minDate: Date;
  today: Date = new Date();
  pdfUrl: string | undefined;
  pdfLoaded: boolean = false;
  safePdfUrl: SafeResourceUrl | undefined;
  initiationplanId: number;
  lastDocs: any;
  ngOnInit(): void {
    this.minDate = new Date();
    // th1,2
    // this.schoolinitiationplan = {
    //   initiationPlanId: 1,
    //   initiationPLanName:
    //     'Kế hoạch thực hiện nhiệm vụ năm học năm 2023 trường Ánh Sao',
    //   deadline: '2023-10-26T02:36:28',
    //   createdDate: '2023-10-26T02:36:41.529556',
    //   createdBy: 'Trần Lê Hải',
    //   status: {
    //     statusId: 2,
    //     statusName: 'Chờ phê duyệt',
    //     statusType: 'Kế hoạch thực hiện năm học',
    //   },
    //   school: {
    //     schoolId: 1,
    //     schoolName: 'Ánh Sao',
    //     exactAddress: '123 Cầu Giấy',
    //   },
    //   issueId: 1,
    //   documents: [
    //     {
    //       id: 1,
    //       schoolDocument: {
    //         documentId: 4,
    //         documentName: 'School Doc1',
    //         account: {
    //           accountId: 7,
    //           email: 'hieutruong@gmail.com',
    //           user: {
    //             userId: 7,
    //             fullName: 'Hiệu Thị Trưởng',
    //             dob: '1999-03-01',
    //             gender: 'MALE',
    //             phoneNumber: '0394335205',
    //           },
    //           school: {
    //             schoolId: 1,
    //             schoolName: 'Ánh Sao',
    //             exactAddress: '123 Cầu Giấy',
    //           },
    //         },
    //         documentCode: 'DOC001',
    //         documentLink: '1q_NtIqhLI1tP4g19h9dC-4R8LSIWMRG7',
    //         uploadedDate: '2023-10-26T02:36:53.89875',
    //         size: 617677,
    //         status: {
    //           statusId: 2,
    //           statusName: 'Mất hiệu lực',
    //           statusType: 'Chung',
    //         },
    //         sizeFormat: null,
    //         documentTypeId: 4,
    //       },
    //       departmentDocument: 'a',
    //     },
    //   ],
    // };
    // th3,4
    this.route.params
      .pipe(
        switchMap((params) => {
          this.initiationplanId = +params['id'];
          console.log(this.initiationplanId);
          return this.initiationplanService.getInitiationPlanById(
            this.initiationplanId
          );
        })
      )
      .subscribe((data) => {
        this.schoolinitiationplan = data;
        console.log(this.schoolinitiationplan);
        this.lastDocs =
          this.schoolinitiationplan.documents[
            this.schoolinitiationplan.documents.length - 1
          ];
        console.log(this.lastDocs);
      });

    // console.log(
    //   this.schoolinitiationplan.documents[
    //     this.schoolinitiationplan.documents.length - 1
    //   ].departmentDocument
    // );
  }

  selectedFilename: any;
  fileInputPlaceholders: string;
  // dropdownOptions: any[] = [
  //   { label: 'Phê duyệt', value: '3', severity: 'success' },
  //   { label: 'Không phê duyệt', value: '4', severity: 'danger' },
  // ];
  selectedOption: string;
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private initiationplanService: InitiationplanService,
    private route: ActivatedRoute,
    protected http: HttpClient
  ) {}
  inputFileForm = this.fb.group({
    documentName: ['', Validators.required],
    documentCode: ['', Validators.required],
    documentTypeId: 4,
    deadline: [this.today, Validators.required],
    isPasssed: [false, Validators.required],
    file: [''],
  });
  getStatusSeverity(statusId: number): string {
    const statusSeverityMap: { [key: number]: string } = {
      6: 'info',
      7: 'warning',
      8: 'success',
      9: 'danger',
    };

    return statusSeverityMap[statusId] || 'info'; // Default to ' info' if statusId is not in the map
  }
  deleteFile() {
    this.fileStatus = false;
    this.buttonApproveStatus = false;
    this.inputFileForm.get('documentName')?.setValue('');
    this.inputFileForm.get('documentCode')?.setValue('');
    this.inputFileForm.get('file')?.setValue('');
    this.fileInputPlaceholders = '';
  }
  approve() {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn phê duyệt kế hoạch này?',
      header: 'Xác nhận phê duyệt',
      icon: 'bi bi-exclamation-triangle-fill',
      accept: () => {
        this.inputFileForm.get('isPasssed')?.setValue(true);
        const formData = new FormData();
        const initiationplan = {
          initiationPlanId: this.schoolinitiationplan.initiationPlanId,
          isPassed: true,
          deadline: null,
          departmentDocument: {
            documentName: this.inputFileForm.get('documentName')?.value,
            documentCode: this.inputFileForm.get('documentCode')?.value,
          },
        };
        console.log(initiationplan);
        formData.append(
          'initiation_plan',
          new Blob([JSON.stringify(initiationplan)], {
            type: 'application/json',
          })
        );
        const fileControl = this.inputFileForm.get('file');
        if (fileControl?.value) {
          const pdfFile = fileControl.value;
          formData.append('files', pdfFile);
        }
        //
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'undefined');
        this.http
          .put(
            'http://localhost:8080/api/v1/initiation_plan/evaluate_school_document',
            formData,
            { headers }
          )
          .subscribe(
            (response) => {
              console.log('Form data sent to the backend:', response);
              this.messageService.add({
                severity: 'success',
                summary: 'Phê duyệt',
                detail: 'Phê duyệt thành công',
              });
            },
            (error) => {
              console.error('Error while sending form data:', error);
            }
          );
      },
      reject: (type: any) => {},
    });
  }
  reject() {
    console.log(1234);
    this.resetDeadlineVisible = true;
    console.log(this.resetDeadlineVisible);
  }
  upload() {
    console.log(this.inputFileForm.value);
    this.uploadFileVisible = false;
    this.fileStatus = true;
    this.buttonApproveStatus = true;
    this.schoolinitiationplan.documents.departmentDocument = '';
  }
  handleFileInputChange(fileInput: any): void {
    const files = fileInput.files;
    if (files.length > 0) {
      const file = files[0];
      this.inputFileForm.get('file')?.setValue(file);
      this.fileInputPlaceholders = file.name;
    }
  }
  resetDeadline() {
    let newDeadline = this.inputFileForm.get('deadline')?.value;
    let formattedDeadline = this.datePipe.transform(newDeadline, 'dd/MM/yyyy');
    this.confirmationService.confirm({
      message:
        'Bạn có chắc chắn không phê duyệt kế hoạch này và thay đổi lịch sang ngày ' +
        formattedDeadline +
        '?',
      header: 'Xác nhận không phê duyệt',
      icon: 'bi bi-exclamation-triangle-fill',
      accept: () => {
        this.inputFileForm.get('isPasssed')?.setValue(false);
        const formData = new FormData();
        const initiationplan = {
          initiationplanId: this.schoolinitiationplan.initiationPlanId,
          isPassed: true,
          deadline: this.inputFileForm.get('deadline')?.value,
          deparmentDocument: {
            documentName: this.inputFileForm.get('documentName')?.value,
            documentCode: this.inputFileForm.get('documentCode')?.value,
          },
        };
        console.log(initiationplan);
        formData.append(
          'initiation_plan',
          new Blob([JSON.stringify(initiationplan)], {
            type: 'application/json',
          })
        );
        const fileControl = this.inputFileForm.get('file');
        if (fileControl?.value) {
          const pdfFile = fileControl.value;
          formData.append('files', pdfFile);
        }
        //
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'undefined');
        this.http
          .put(
            'http://localhost:8080/api/v1/initiation_plan/evaluate_school_document',
            formData,
            { headers }
          )
          .subscribe(
            (response) => {
              console.log('Form data sent to the backend:', response);
              this.messageService.add({
                severity: 'success',
                summary: 'Đã gửi đánh giá',
                detail: 'Đã gửi đánh giá thành công',
              });
            },
            (error) => {
              console.error('Error while sending form data:', error);
            }
          );
      },
      reject: (type: any) => {},
    });
  }
  // displayNewFileUpload(file: File) {
  //   const blobUrl = window.URL.createObjectURL(file as Blob);
  //   this.pdfUrl = blobUrl;
  //   this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  //   this.pdfLoaded = true;
  // }
  openNewTab(documentLink: string) {
    console.log(documentLink);
    this.fileService
      .readInitiationplanPDF(documentLink)
      .subscribe((response) => {
        const blobUrl = window.URL.createObjectURL(response.body as Blob);
        this.pdfUrl = blobUrl;
        this.safePdfUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.pdfLoaded = true;
      });
  }
  redirectToIssue() {
    this.router.navigateByUrl('/issuelist/1');
  }
}
