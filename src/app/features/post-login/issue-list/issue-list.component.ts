import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Issue } from 'src/app/models/issue.model';
import { IssueService } from 'src/app/services/issue.service';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.scss']
})
export class IssueListComponent implements OnInit {
  issues!: Issue[];
  loading: boolean = true;
  constructor(private issueService: IssueService, private router: Router){

  }
  ngOnInit(){
  this.issueService.getIssues().subscribe((data) => {
      // Handle the data here
      this.issues = data
    });
  };
   
  navigateToCreateIssue(){
    this.router.navigate(['/createissue'])
  }
  navigateToDetail(issueId: number){
    this.router.navigate(['/issuelist', issueId])
  }
  navigateToUpdate(issueId: number){
    this.router.navigate(['/issuelist/update', issueId])
  }
}
