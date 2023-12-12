import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {inspectionPlanService} from "../../../../services/inspectionplan.service";
import {Subscription, switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {FileService} from "../../../../services/file.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-inspection-plan-detail',
  templateUrl: './inspection-plan-detail.component.html',
  styleUrls: ['./inspection-plan-detail.component.scss']
})
export class InspectionPlanDetailComponent implements OnInit, OnDestroy {
  data: any;
  inspectionPlanId: number;
  inspectionPlanDetail: any;
  pdfUrl: string | undefined;
  pdfLoaded: boolean = false;
  safePdfUrl: SafeResourceUrl | undefined;
  pdfPreviewVisibility: boolean = false;

  breadCrumb = [
    {
      caption: 'Trang chủ',
      routerLink: '/',
    },
    {
      caption: 'Danh sách kế hoạch thanh tra',
      routerLink: '/inspection-plan/list',
    },
    {
      caption: 'Chi tiết kế hoạch thanh tra'
    },
  ];

  private subscriptions: Subscription[] = [];

  getStatusSeverity(status: string): string {
    const statusSeverityMap: { [key: string]: string } = {
      "Chưa bắt đầu": 'info',
      "Đang tiến hành": 'warning',
      "Đã hoàn thành": 'success',
      "Đã quá hạn": 'danger',
    };

    return statusSeverityMap[status] || 'info'; // Default to ' info' if statusId is not in the map
  }

  openNewTab(documentLink: string) {
    console.log(documentLink);
    this.pdfPreviewVisibility = true;
    this.subscriptions.push(this.fileService.readInspectionPlanPDF(documentLink).subscribe((response) => {
      const blobUrl = window.URL.createObjectURL(response.body as Blob);
      this.pdfUrl = blobUrl;
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      this.pdfLoaded = true;
    }))
  }

  constructor(
    private readonly inspectionPlanService: inspectionPlanService,
    private readonly route: ActivatedRoute,
    private readonly cdref: ChangeDetectorRef,
    private readonly fileService: FileService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this
      .inspectionPlanDetail = {
      inspectionPlan: {
        inspectionPlanId: 0,
        inspectionPlanName: '',
        createdDate: null,
        description: '',
        school: {
          schoolId: 0,
          schoolName: '',
          exactAddress: '',
          isActive: false
        },
        documents: [],
        startDate: null,
        endDate: null,
        status: {
          statusId: 0,
          statusName: '',
          statusType: ''
        }
      },
      inspectors: [],
      reportId: 0,
      conclusionId: 0
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(this.route.params
      .pipe(
        switchMap((params) => {
          this.inspectionPlanId = +params['id'];
          return this.inspectionPlanService.getInspectionPlanById(this.inspectionPlanId);
        })
      ).subscribe({
        next: (data) => {
          this.data = data;
        },
        error: (error) => {
        }
      }))
  }

  ngAfterContentChecked() {
    if (this.data) {
      this.inspectionPlanDetail = this.data;
      this.cdref.detectChanges();
    }
  }

  private unsubscribeAll(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  onUpdate() {
    this.router.navigate(['inspection-plan/update/' + this.inspectionPlanId])
  }
}
