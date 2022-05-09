import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-date-group',
  templateUrl: './date-group.component.html',
  styleUrls: ['./date-group.component.scss']
})
export class DateGroupComponent implements OnInit {

  @Input() dateGroups: string[];
  @Output() groupChange: EventEmitter<string> = new EventEmitter<string>();

  control: FormControl = new FormControl("month");

  constructor() { }

  ngOnInit() {
  }

}
