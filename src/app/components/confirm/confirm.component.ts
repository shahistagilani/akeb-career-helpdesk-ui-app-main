import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  name: string='';
  constructor(private actRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.name = this.actRouter.snapshot.params['name'];

  }

}
