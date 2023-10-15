import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {IssueService} from "../../../../services/issue.service";
interface Inspector{
  name: string,
  school: string
}
@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss']
})
export class IssueDetailComponent implements OnInit{
  issueId: any;
  issue: any;

  constructor(private route: ActivatedRoute, private issueService: IssueService) {
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.issueId = +params['id'];
      // Now 'issueId' contains the value from the 'id' parameter

      // Call the service method to fetch issue data
      this.issueService.getIssueById(this.issueId).subscribe((data) => {
        this.issue = data; // Store the fetched issue data
        console.log(this.issue)
      });
    })
  }
}
