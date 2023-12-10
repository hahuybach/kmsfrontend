import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NoWhitespaceValidator} from "../../../../shared/validators/no-white-space.validator";
import {dateToTuiDay} from "../../../../shared/util/util";
import {TuiDay} from "@taiga-ui/cdk";
import {SelectItem} from "primeng/api";
import {InspectionplanInspectorlistService} from "../../../../services/inspectionplan-inspectorlist.service";
import {InspectorService} from "../../../../services/inspector.service";
import {UserResponseForUserList} from "../../../../models/user-response-for-user-list";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-create-issue',
  templateUrl: './create-issue.component.html',
  styleUrls: ['./create-issue.component.scss']
})


export class CreateIssueComponent implements OnInit {
  tomorrowDate: Date;
  tomorrow: TuiDay;
  issueForm: FormGroup;
  selectedInspectors: UserResponseForUserList[] = [];
  inspectors: UserResponseForUserList[];
  inspectorListIsValid: boolean = false;
  popupInspectorVisible: boolean = false;

  private subscriptions: Subscription[] = [];

  //breadcrumb
  breadCrumb = [
    {
      caption: 'Trang chủ',
      routerLink: '/',
    },
    {
      caption: 'Danh sách kế hoạch kiểm tra',
      routerLink: '/issue/list',
    },
    {
      caption: 'Tạo mới kế hoạch kiểm tra',
      routerLink: '/issue/create',
    },
  ];

  constructor(
    private fb: FormBuilder,
    protected http: HttpClient,
    private readonly inspectionplanInspectorService: InspectionplanInspectorlistService,
    private readonly inspectorService: InspectorService,
  ) {
  }

  ngOnInit() {
    this.tomorrowDate = new Date();
    this.tomorrowDate.setDate(this.tomorrowDate.getDate() + 1);
    this.tomorrow = dateToTuiDay(this.tomorrowDate)

    this.issueForm = this.fb.group({
      issueName: [null, Validators.compose([NoWhitespaceValidator(), Validators.required, Validators.maxLength(256)])],
      issueDetail: [null, Validators.compose([NoWhitespaceValidator(), Validators.required])],
      inspectorId: [null, Validators.compose([Validators.required])],
      endDate: [this.tomorrow, Validators.compose([Validators.required])],
      issueDocList: this.fb.group({
        issueDoc_1: this.fb.group({
          documentName: [null, Validators.compose([NoWhitespaceValidator(), Validators.required, Validators.maxLength(256)])],
          documentTypeId: [null, Validators.compose([Validators.required])],
          documentCode: [null, Validators.compose([NoWhitespaceValidator(), Validators.required, Validators.maxLength(256)])],
          documentFile: [null, Validators.compose([Validators.required])]
        }),
        issueDoc_2: this.fb.group({
          documentName: [null, Validators.compose([NoWhitespaceValidator(), Validators.required, Validators.maxLength(256)])],
          documentTypeId: [null, Validators.compose([Validators.required])],
          documentCode: [null, Validators.compose([NoWhitespaceValidator(), Validators.required, Validators.maxLength(256)])],
          documentFile: [null, Validators.compose([Validators.required])]
        }),
        issueDoc_3: this.fb.group({
          documentName: [null, Validators.compose([NoWhitespaceValidator(), Validators.required, Validators.maxLength(256)])],
          documentTypeId: [null, Validators.compose([Validators.required])],
          documentCode: [null, Validators.compose([NoWhitespaceValidator(), Validators.required, Validators.maxLength(256)])],
          documentFile: [null, Validators.compose([Validators.required])]
        })
      })
    })

    this.inspectionplanInspectorService.setInspectorList(this.selectedInspectors);
    const setInspectorList = this.inspectionplanInspectorService.inspectorList$.subscribe(list => this.selectedInspectors = list);
    const setInspectorListValid = this.inspectionplanInspectorService.inspectorListIsValid$.subscribe(isValid => {
      this.inspectorListIsValid = isValid;
    });

    this.initInspectorList();;

    this.fileInputPlaceholders = ['', '', ''];
  }

  initInspectorList() {
    this.subscriptions.push(
      this.inspectorService.getNoneInspectors().subscribe({
        next: (data) => {
          this.inspectors = data;
          this.inspectionplanInspectorService.setPopupInspectorList(this.inspectors);
          const setPopUpList = this.inspectionplanInspectorService.popupInspectorList$.subscribe(list => this.inspectors = list);
          this.subscriptions.push(setPopUpList);
        },
        error: (error) => {
          console.log(error);
        }
      })
    )
  }

  changeInspectorVisible() {
    this.popupInspectorVisible = !this.popupInspectorVisible;
  }

  onResetList() {
    this.inspectionplanInspectorService.resetBothLists();
  }

  getInspectorIds(data: any) {
    let inspectorListId = data.map((item: { accountId: any; }) => item.accountId);
    console.log(inspectorListId);
    this.issueForm.get('inspectorId')?.setValue(inspectorListId);
  }

  resetInspectorList() {
    this.issueForm.get('inspectorId')?.setValue(null);
    this.selectedInspectors = [];
    this.inspectors = [];
    this.inspectionplanInspectorService.setInspectorListIsValid(false);
    this.initInspectorList();
  }

  fileInputPlaceholders: string[] = [];

  handleFileInputChange(fileInput: any, position: number): void {
    const files = fileInput.files;
    if (files.length > 0) {
      const file = files[0];
      switch (position) {
        case 1:
          this.issueForm.get("issueDocList.issueDoc_1.documentFile")?.setValue(file);
          this.fileInputPlaceholders[0] = file.name;
          break;
        case 2:
          this.issueForm.get("issueDocList.issueDoc_2.documentFile")?.setValue(file);
          this.fileInputPlaceholders[1] = file.name;
          break;
        case 3:
          this.issueForm.get("issueDocList.issueDoc_3.documentFile")?.setValue(file);
          this.fileInputPlaceholders[2] = file.name;
          break;
      }
    } else {
      this.fileInputPlaceholders[position - 1] = '';
    }
  }

  get documentFirstNameControls() {
    return (this.issueForm.get('issueDocList.issueDoc_1') as FormGroup).controls['documentName'];
  }

  get documentFirstTypeControls() {
    return (this.issueForm.get('issueDocList.issueDoc_1') as FormGroup).controls['documentTypeId'];
  }

  get documentFirstCodeControls() {
    return (this.issueForm.get('issueDocList.issueDoc_1') as FormGroup).controls['documentCode'];
  }

  get documentFirstFileControls() {
    return (this.issueForm.get('issueDocList.issueDoc_1') as FormGroup).controls['documentFile'];
  }


  onSubmit() {
    if (this.issueForm.invalid) {
      this.issueForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const issue = {
      issueName: this.issueForm.get('issueName')?.value,
      inspectorId: [],
      description: this.issueForm.get('issueDetail')?.value,
      documentIssues: [],
    }

    for (let i = 1; i <= 3; i++) {
      const docFileControl = this.issueForm.get(`issueDocList.issueDoc_${i}.documentFile`);
      console.log(docFileControl?.value.name);
      if (docFileControl?.value) {
        const docFile = docFileControl.value;
        formData.append(`files`, docFile, docFile.name);

        const documentName = this.issueForm.get(`issueDocList.issueDoc_${i}.documentName`)?.value;
        const documentTypeId = this.issueForm.get(`issueDocList.issueDoc_${i}.documentTypeId`)?.value;
        const documentCode = this.issueForm.get(`issueDocList.issueDoc_${i}.documentCode`)?.value;

        console.log(documentName, documentTypeId, documentCode)

        // @ts-ignore
        issue.documentIssues.push({
          documentName,
          documentTypeId,
          documentCode,
        });
      }
    }

    formData.append("issue", new Blob([JSON.stringify(issue)], {type: "application/json"}));

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'undefined');

    this.http.post('http://localhost:8080/api/v1/issue/save', formData, {headers}).subscribe(
      (response) => {
        console.log('Form data sent to the backend:', response);
      },
      (error) => {
        console.error('Error while sending form data:', error);
      }
    );
  }

  filterOptions(options: SelectItem[], value1: any, value2: any): SelectItem[] {
    return options.filter(option => option.value !== value1 && option.value !== value2);
  }

  docTypes_select_1: SelectItem[] = [
    {label: 'Chọn loại tài liệu', value: null},
    {label: 'Kế hoạch công tác kiểm tra năm học', value: 1},
    {label: 'Hướng dẫn công tác KTNB', value: 2},
    {label: 'Quyết định thành lập BKTB', value: 3}
  ];

  docTypes_select_2: SelectItem[] = [
    {label: 'Chọn loại tài liệu', value: null},
    {label: 'Kế hoạch công tác kiểm tra năm học', value: 1},
    {label: 'Hướng dẫn công tác KTNB', value: 2},
    {label: 'Quyết định thành lập BKTB', value: 3}
  ];

  docTypes_select_3: SelectItem[] = [
    {label: 'Chọn loại tài liệu', value: null},
    {label: 'Kế hoạch công tác kiểm tra năm học', value: 1},
    {label: 'Hướng dẫn công tác KTNB', value: 2},
    {label: 'Quyết định thành lập BKTB', value: 3}
  ];

  selectedValue_1: any;
  selectedValue_2: any;
  selectedValue_3: any;


  onChange1(e: any) {
    this.selectedValue_1 = e.value;
    this.issueForm.get('issueDocList.issueDoc_1.documentTypeId')?.setValue(this.selectedValue_1);
    console.log(this.issueForm.get('issueDocList.issueDoc_1.documentTypeId')?.value);
  };

  onChange2(e: any) {
    this.selectedValue_2 = e.value;

  };

  onChange3(e: any) {
    this.selectedValue_3 = e.value;
  };

}


