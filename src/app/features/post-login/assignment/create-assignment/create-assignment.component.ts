import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
interface TreeNode<T> {
  key: string;
  label: string;
  data?: T;
  icon?: string;
  children?: TreeNode<T>[];
  showChildren?: boolean; // New property
}
@Component({
  selector: 'app-create-assignment',
  templateUrl: './create-assignment.component.html',
  styleUrls: ['./create-assignment.component.scss'],
})
export class CreateAssignmentComponent {
  @Input() files!: TreeNode<string>[] | undefined;
  nodeHeightMap: { [height: number]: TreeNode<string>[] } = {};
  @Input() firstTime = true;
  lastNode: TreeNode<any> | undefined;
  items!: MenuItem[];
  selectedFile: any;
  visibleNewNode = false;
  constructor(
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}
  newNodeForm = this.fb.group({
    nodeName: ['', Validators.required],
  });
  ngOnInit() {
    if (this.firstTime) {
      this.files = [
        {
          key: '0',
          label: 'Documents',
          data: 'Documents Folder',
          icon: 'pi pi-fw pi-inbox',
          showChildren: false,
          children: [
            {
              key: '0-0',
              label: 'Work',
              data: 'Work Folder',
              icon: 'pi pi-fw pi-cog',
              showChildren: false,
              children: [
                {
                  key: '0-0-0',
                  label: 'Expenses.doc',
                  icon: 'pi pi-fw pi-file',
                  data: 'Expenses Document',
                  showChildren: false,
                },
                {
                  key: '0-0-1',
                  label: 'Resume.doc',
                  icon: 'pi pi-fw pi-file',
                  data: 'Resume Document',
                  showChildren: false,
                },
              ],
            },
            {
              key: '0-1',
              label: 'Home',
              data: 'Home Folder',
              icon: 'pi pi-fw pi-home',
              showChildren: false,
              children: [
                {
                  key: '0-1-0',
                  label: 'Invoices.txt',
                  icon: 'pi pi-fw pi-file',
                  data: 'Invoices for this month',
                  showChildren: false,
                },
              ],
            },
          ],
        },
        {
          key: '1',
          label: 'Events',
          data: 'Events Folder',
          icon: 'pi pi-fw pi-calendar',
          showChildren: false,
          children: [
            {
              key: '1-0',
              label: 'Meeting',
              icon: 'pi pi-fw pi-calendar-plus',
              data: 'Meeting',
              showChildren: false,
            },
            {
              key: '1-1',
              label: 'Product Launch',
              icon: 'pi pi-fw pi-calendar-plus',
              data: 'Product Launch',
              showChildren: false,
            },
            {
              key: '1-2',
              label: 'Report Review',
              icon: 'pi pi-fw pi-calendar-plus',
              data: 'Report Review',
              showChildren: false,
            },
          ],
        },
        {
          key: '2',
          label: 'Movies',
          data: 'Movies Folder',
          icon: 'pi pi-fw pi-star-fill',
          showChildren: false,
          children: [
            {
              key: '2-0',
              icon: 'pi pi-fw pi-star-fill',
              label: 'Al Pacino',
              data: 'Pacino Movies',
              showChildren: false,
              children: [
                {
                  key: '2-0-0',
                  label: 'Scarface',
                  icon: 'pi pi-fw pi-video',
                  data: 'Scarface Movie',
                  showChildren: false,
                },
                {
                  key: '2-0-1',
                  label: 'Serpico',
                  icon: 'pi pi-fw pi-video',
                  data: 'Serpico Movie',
                  showChildren: false,
                },
              ],
            },
            {
              key: '2-1',
              label: 'Robert De Niro',
              icon: 'pi pi-fw pi-star-fill',
              data: 'De Niro Movies',
              showChildren: false,
              children: [
                {
                  key: '2-1-0',
                  label: 'Goodfellas',
                  icon: 'pi pi-fw pi-video',
                  data: 'Goodfellas Movie',
                  showChildren: false,
                },
                {
                  key: '2-1-1',
                  label: 'Untouchables',
                  icon: 'pi pi-fw pi-video',
                  data: 'Untouchables Movie',
                  showChildren: false,
                },
              ],
            },
          ],
        },
      ];
    }

    // this.items = [
    //   {
    //     label: 'Thêm mới',
    //     icon: 'bi bi-plus-circle',
    //     command: (event) => this.viewFile(this.selectedFile!),
    //   },
    //   {
    //     label: 'Xóa',
    //     icon: 'bi bi-trash-fill',
    //     command: (event) => this.deleteContextMenu(),
    //   },
    // ];
    // this.splitDataByNodeHeight(this.files);
  }

  // viewFile(file: TreeNode) {
  //   // this.messageService.add({
  //   //   severity: 'info',
  //   //   summary: 'Node Details',
  //   //   detail: file.label,
  //   // });
  //   this.visibleNewNode = true;
  //   console.log(file.children?.length);
  // }
  // addNewNode() {
  //   const newNode: TreeNode = {
  //     key:
  //       this.selectedFile.children == null
  //         ? this.selectedFile.key + '-0'
  //         : this.selectedFile.key + '-' + this.selectedFile?.children.length,
  //     label: this.newNodeForm.get('nodeName')?.value + '',
  //     data: this.newNodeForm.get('nodeName')?.value,
  //     icon: 'pi pi-fw pi-cog',
  //     children: [],
  //   };
  //   console.log(newNode);
  //   for (const item of this.files) {
  //     this.addNodeToParent(item, newNode);
  //   }
  //   console.log(this.files);
  //   this.visibleNewNode = false;
  // }
  // deleteContextMenu() {
  //   for (const item of this.files) {
  //     this.deleteNodeByKey(item, this.selectedFile.key);
  //   }
  // }
  // addNodeToParent(parent: TreeNode<string>, newNode: TreeNode<string>): void {
  //   if (parent.key === this.selectedFile.key) {
  //     if (parent.children) {
  //       parent.children.push(newNode);
  //     } else {
  //       parent.children = [newNode];
  //     }
  //     return;
  //   }

  //   if (parent.children) {
  //     for (const child of parent.children) {
  //       this.addNodeToParent(child, newNode);
  //     }
  //   }
  // }
  // deleteNodeByKey(parent: TreeNode<string> | undefined, key: string): void {
  //   if (!parent || !parent.children) {
  //     return;
  //   }

  //   parent.children = parent.children.filter((child) => child.key !== key);

  //   for (const child of parent.children) {
  //     this.deleteNodeByKey(child, key);
  //   }
  // }
  getNodeHeight(node: TreeNode<string> | undefined): number {
    if (!node || !node.children || node.children.length === 0) {
      return 1; // Leaf node has a height of 1
    }

    let maxHeight = 0;
    for (const child of node.children) {
      const childHeight = this.getNodeHeight(child);
      maxHeight = Math.max(maxHeight, childHeight);
    }

    return maxHeight + 1; // Adding 1 to account for the current node
  }

  splitDataByNodeHeight(nodes: TreeNode<any>[]) {
    for (const node of nodes) {
      const height = this.getNodeHeight(node);
      if (!this.nodeHeightMap[height]) {
        this.nodeHeightMap[height] = [];
      }
      this.nodeHeightMap[height].push(node);
    }
    // console.log(this.nodeHeightMap);
  }
  // showArr(arr: TreeNode<any>[] | undefined) {
  //   console.log(arr);
  // }
  //  files: TreeNode<string>[];

  showArr(item: TreeNode<any> | undefined): void {
    if (this.lastNode != undefined) {
      this.lastNode.showChildren = false;
    }
    this.lastNode = item;
    if (item != undefined) {
      item.showChildren = true;
    }
  }
}
