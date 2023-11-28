import { error } from '@angular/compiler-cli/src/transformers/util';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { School } from 'src/app/models/task';
import { AssignmentService } from 'src/app/services/assignment.service';
import { DocumentService } from 'src/app/services/document.service';
import { FileService } from 'src/app/services/file.service';
import { SchoolService } from 'src/app/services/school.service';
import { ToastService } from 'src/app/shared/toast/toast.service';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.scss'],
})
export class AssignmentDetailComponent implements OnInit {
  assignments: any[] = [];
  selectedAssignment: any;
  detailVisible = false;
  pdfUrl: string | undefined;
  pdfLoaded: boolean = false;
  safePdfUrl: SafeResourceUrl | undefined;
  fileUrl: string;
  school: any;
  header: string;
  constructor(
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private toastService: ToastService,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private schoolService: SchoolService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const issueId = +params['issueId'];
      const schoolId = +params['schoolId'];
      this.documentService
        .getAssignmentsBySchoolId(issueId, schoolId)
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
      this.schoolService.findSchoolById(schoolId).subscribe({
        next: (data) => {
          console.log(data.schoolName);
          this.school = data;
        },
        error: (error) => {},
      });
    });
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
  previewFile(documentLink: string, fileExtension: string) {
    this.fileService.readAssignmentPDF(documentLink).subscribe((data) => {
      const blobUrl = window.URL.createObjectURL(data.body as Blob);
      this.pdfUrl = blobUrl;
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      if (this.safePdfUrl !== undefined) {
        this.fileUrl = this.safePdfUrl + '';
      }
      this.pdfLoaded = true;
      console.log(this.safePdfUrl);
    });
  }
  getIconFileType(fileExtension: string): string {
    let url = '';
    switch (fileExtension) {
      case 'application/pdf':
        url = '../../../../../assets/img/pdf.png';
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
}
