import { error } from '@angular/compiler-cli/src/transformers/util';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentService } from 'src/app/services/assignment.service';
import { DocumentService } from 'src/app/services/document.service';
import { FileService } from 'src/app/services/file.service';
import { inspectionPlanService } from 'src/app/services/inspectionplan.service';
import { SchoolService } from 'src/app/services/school.service';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-inspection-school-document',
  templateUrl: './inspection-school-document.component.html',
  styleUrls: ['./inspection-school-document.component.scss'],
})
export class InspectionSchoolDocumentComponent implements OnInit {
  inspectionId: number;
  issueId: number;
  schoolId: number;
  assignments: any;
  detailVisible: boolean = false;
  selectedAssignment: any;
  pdfPreviewVisibility: boolean = false;
  pdfUrl: string | undefined;
  pdfLoaded: boolean = false;
  safePdfUrl: SafeResourceUrl | undefined;
  sub: any[] = [];
  school: any;
  constructor(
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private toastService: ToastService,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private schoolService: SchoolService,
    private router: Router,
    private inspectionPlanService: inspectionPlanService
  ) {}
  ngOnInit(): void {
    this.route.parent?.params.subscribe((parentParams) => {
      this.inspectionId = parentParams['id'];
      console.log(parentParams['id']);
    });

    this.inspectionPlanService
      .getInspectionDoctree(this.inspectionId)
      .pipe(
        switchMap((data) => {
          this.issueId = data.issueId;
          this.schoolId = data.schoolId;
          return this.documentService.getAssignmentsBySchoolId(
            this.issueId,
            this.schoolId
          );
        })
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.assignments = [data];
        },
        error: (error) => {
          this.toastService.showError('error', 'Lỗi', error.error.message);
          this.router.navigate(['/listAssignment']);
        },
      });
    // this.schoolService.findSchoolById(this.schoolId).subscribe({
    //   next: (data) => {
    //     console.log(data.schoolName);
    //     this.school = data;
    //   },
    //   error: (error) => {},
    // });
  }
  openDetail(assignmentId: number) {
    this.detailVisible = true;
    this.assignmentService.getAssignmentsById(assignmentId).subscribe({
      next: (data) => {
        this.selectedAssignment = data;
        console.log(this.selectedAssignment);
      },
      error: (error) => {},
    });
  }
  getIconFileType(fileExtension: string): string {
    let url = '';
    switch (fileExtension) {
      case 'application/pdf':
        url = '../../../../../assets/img/pdf_logo.svg';
        break;
      case 'application/msword':
        url = '../../../../../assets/img/doc.png';
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        url = '../../../../../assets/img/doc.png';
        break;
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        url = '../../../../../assets/img/xls.png';
        break;
    }
    return url;
  }
  openNewTab(documentLink: string, fileExtension: string) {
    if (fileExtension === 'application/pdf') {
      this.pdfPreviewVisibility = true;
    }
    const method = this.fileService
      .readAssignmentPDF(documentLink)
      .subscribe((response) => {
        const blobUrl = window.URL.createObjectURL(response.body as Blob);
        this.pdfUrl = blobUrl;
        this.safePdfUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.pdfLoaded = true;
      });
    // this.sub.push(method);
  }
  getFileExtension(fileExtension: string): string {
    let extension = '';
    switch (fileExtension) {
      case 'application/pdf':
        extension = 'pdf';
        break;
      case 'application/msword':
        extension = 'docx';
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        extension = 'docx';
        break;
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        extension = 'xlsx';
        break;
    }
    return extension;
  }
  onHideFilePreviewEvent() {
    this.pdfUrl = '';
    this.safePdfUrl = '';
    this.pdfLoaded = false;
  }
}
