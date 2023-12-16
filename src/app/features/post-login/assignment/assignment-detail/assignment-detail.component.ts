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
  pdfPreviewVisibility: boolean = false;
  sub: any[] = [];
  issueId: number;
  schoolId: number;
  assId: number;
  searchData: string;
  searchItem: any[];
  searchDialogVisible: boolean = false;
  nodeStateMap: { [key: number]: boolean } = {};
  pageNo: number = 0;

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
      this.issueId = +params['issueId'];
      this.schoolId = +params['schoolId'];
      this.assId = +params['assId'];
      this.documentService
        .getAssignmentsBySchoolId(this.issueId, this.schoolId)
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
      this.schoolService.findSchoolById(this.schoolId).subscribe({
        next: (data) => {
          console.log(data.schoolName);
          this.school = data;
        },
        error: (error) => {},
      });
      if (this.assId) {
        this.openDetail(this.assId);
      }
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
    this.sub.push(method);
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

  navigateChildren(assignmentId: number) {
    this.router.navigate(['detail-assignment'], {
      queryParams: {
        issueId: this.issueId,
        schoolId: this.schoolId,
        assId: assignmentId,
      },
    });
  }
  loadAssignment() {
    this.pageNo = 0;
    if (this.searchData) {
      this.assignmentService
        .filterAsm(this.issueId, this.schoolId, this.pageNo, this.searchData)
        .subscribe({
          next: (data) => {
            this.searchItem = data;
            console.log(data);
            console.log(this.searchItem.length);
          },
        });
    } else {
      this.assignmentService
        .filterAsm(this.issueId, this.schoolId, null, this.searchData)
        .subscribe({
          next: (data) => {
            this.searchItem = data;
            console.log(data);
            console.log(this.searchItem.length);
          },
        });
    }
  }

  navigateSearch(assignment: any, ids: number[]) {
    // this.router.navigate(['/assign-assignment', this.issueId], {
    //   queryParams: { id: assignmentId },
    // });
    this.searchDialogVisible = false;
    this.openDetail(assignment.assignmentId);
    this.expandNodesByIds(ids);
    this.initData();
  }

  expandNodesByIds(nodeIds: number[]) {
    for (let i = 0; i < nodeIds.length; i++) {
      const nodeId = nodeIds[i];
      this.nodeStateMap[nodeId] = true;
      console.log(nodeId + ' ' + this.nodeStateMap[nodeId]);
    }
    console.log(this.nodeStateMap);
  }

  initData() {
    const method = this.documentService
      .getAssignmentsBySchoolId(this.issueId, this.schoolId)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.assignments = [data];
          this.restoreNodeState(this.assignments);
        },
        error: (error) => {
          this.toastService.showError('error', 'Lỗi', error.error.message);
          this.router.navigate(['/listAssignment']);
        },
      });
    this.sub.push(method);
  }

  restoreNodeState(nodes: any[]) {
    nodes.forEach((node) => {
      if (this.nodeStateMap[node.assignmentId] !== undefined) {
        node.expanded = this.nodeStateMap[node.assignmentId];
      }

      if (node.children && node.children.length > 0) {
        this.restoreNodeState(node.children);
      }
    });
    console.log('restore');
    console.log(this.nodeStateMap);
  }

  onNodeExpand(event: any) {
    const node = event.node;
    console.log('Node Toggle Event:', event);
    this.nodeStateMap[node.assignmentId] = node.expanded;
    console.log(this.nodeStateMap);
  }

  onNodeCollapse(event: any) {
    const node = event.node;
    console.log('Node Toggle Event:', event);
    this.nodeStateMap[node.assignmentId] = node.expanded;
    console.log(this.nodeStateMap);
  }

  onResultScroll(e: any) {
    const element = e.target as HTMLElement;
    console.log(element);
    console.log('offsetHeight:' + element.offsetHeight);
    console.log('scrolltop:' + element.scrollTop);
    console.log('scrollheight' + element.scrollHeight);

    if (element.offsetHeight + element.scrollTop + 1 == element.scrollHeight) {
      this.pageNo++;
      this.assignmentService
        .filterAsm(this.issueId, this.schoolId, this.pageNo, this.searchData)
        .subscribe({
          next: (data) => {
            this.searchItem.push(...data);
            console.log(this.searchItem.length);
          },
        });
    }
  }
}
