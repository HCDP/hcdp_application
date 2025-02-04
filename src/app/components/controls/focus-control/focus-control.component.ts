import { Component, OnInit } from '@angular/core';
import { Moment } from "moment-timezone";
import { VisDatasetItem, FormValue, TimeseriesData } from 'src/app/services/dataset-form-manager.service';
import { EventParamRegistrarService } from 'src/app/services/inputManager/event-param-registrar.service';

@Component({
  selector: 'app-focus-control',
  templateUrl: './focus-control.component.html',
  styleUrls: ['./focus-control.component.scss']
})
export class FocusControlComponent implements OnInit {
  focusTimeseries: TimeseriesData;
  date: Moment;
  lastDate: Moment;
  selection: FormValue;
  
  datatype: string;

  constructor(private paramService: EventParamRegistrarService) {
    paramService.createParameterHook(EventParamRegistrarService.EVENT_TAGS.dataset, (dataset: VisDatasetItem) => {
      if(dataset) {
        this.datatype = dataset.datatype;
        this.focusTimeseries = dataset.timeseriesData;
        if(this.focusTimeseries) {
          //make sure all dataset events propogate before pushing focus
          setTimeout(() => {
            this.paramService.pushFocusDate(this.lastDate);
          }, 0);
        }
      }
    });
  }

  ngOnInit() {
  }

  setFocus(focus: Moment) {
    if(this.focusTimeseries) {
      this.date = focus;
      this.lastDate = focus;
      this.paramService.pushFocusDate(focus);
    }
    
  }

}
