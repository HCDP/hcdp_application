import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { StringMap } from 'src/app/models/types';
import { ActiveFormData, DatasetFormManagerService, ExportDatasetItem, FormManager, FileGroup, FileProperty, FileData } from 'src/app/services/dataset-form-manager.service';
import { DateManagerService } from 'src/app/services/dateManager/date-manager.service';

@Component({
  selector: 'app-export-add-item',
  templateUrl: './export-add-item.component.html',
  styleUrls: ['./export-add-item.component.scss']
})
export class ExportAddItemComponent {
  formData: ActiveFormData<ExportDatasetItem>;
  controls: ExportControlData;
  private lockDatasetUpdates: boolean;

  private _formManager: FormManager<ExportDatasetItem>;

  numSelected: number;

  constructor(public dialogRef: MatDialogRef<ExportAddItemComponent>, @Inject(MAT_DIALOG_DATA) public data: FormState, private dateManager: DateManagerService, private formService: DatasetFormManagerService) {
    this._formManager = formService.exportFormManager;
    //set up form controls
    //inject values
    //this.setupControls(data);
    // this.updateDataset();
    this.initializeControls(data);
  }


  
  private initializeControls(initialValues: FormState) {
    this.controls = {
      datatype: null,
      dataset: {},
      fileGroups: {}
    };
    let formData = initialValues? this._formManager.setValues(initialValues.dataset) : this._formManager.getFormData();
    this.formData = formData;
    let {datatype, ...values} = formData.values;
    //setup main datatype control (always there, only needed once)
    this.setupDatatypeControl(datatype);
    //setup variable controls
    this.setupDatasetControls(values);
    this.setupFileGroupControls(initialValues?.fileGroups);
  }

  private setupDatatypeControl(datatype: string) {
    let control = new FormControl(datatype);
    let sub = control.valueChanges.subscribe((value: string) => {
      if(!this.lockDatasetUpdates) {
        this.updateDatatype(value)
      }
    });
    this.controls.datatype = {
      control,
      sub 
    };
  }

  private updateDatatype(value: string) {
    let formData = this._formManager.setDatatype(value);
    this.formData = formData;
    let {datatype, ...values} = formData.values;
    //unsubscribe from controls so new ones can be created
    this.cleanupControlSubscriptions();
    this.setupDatasetControls(values);
    this.setupFileGroupControls(null);
  }

  private setupDatasetControls(values: StringMap) {
    for(let field in values) {
      let control = new FormControl(values[field]);
      let sub = control.valueChanges.subscribe((value) => {
        if(!this.lockDatasetUpdates) {
          let formData = this._formManager.setValue(field, value);
          this.formData = formData;
          let {datatype, ...values} = formData.values;
          this.updateDatasetControlValues(values);
          this.cleanupFileGroupControlSubscriptions();
          this.setupFileGroupControls(null);
        }
      });   
      this.controls.dataset[field] = {
        control,
        sub
      }
    }
  }

  private updateDatasetControlValues(values: StringMap) {
    this.lockDatasetUpdates = true;
    for(let tag in values) {
      this.controls.dataset[tag].control.setValue(values[tag]);
    }
    this.lockDatasetUpdates = false;
  }

  private setupFileGroupControls(values: FileGroupStates) {
    for(let group of this.formData.datasetItem.fileGroups) {
      let groupValues = values? values[group.tag] : null;
      let filePropertyControls = this.getFilePropertyControls(group.additionalProperties, groupValues?.fileProps);
      let fileSelectControls = this.getFileSelectControls(group.fileData, groupValues?.files);
      this.controls.fileGroups[group.tag] = {
        fileProps: filePropertyControls,
        files: fileSelectControls
      };
    }
  }

  private getFilePropertyControls(properties: FileProperty[], values: FilePropState): Controls {
    let filePropertyControls: Controls = {};
    //set up file property controls
    for(let field of properties) {
      let tag = field.formData.tag;
      let defaults = field.defaultValues;
      let control = new FormControl(defaults);
      let lastValues = defaults;
      let sub = control.valueChanges.subscribe((values: string[]) => {
        if(values.length < 1) {
          control.setValue(lastValues);
        }
        else {
          lastValues = values;
        }
      });
      filePropertyControls[tag] = {
        control,
        sub
      };
    }
    return filePropertyControls;
  }

  private getFileSelectControls(fileData: FileData[], values: FileSelectState): FileControls {
    let fileSelectControls: FileControls = {};
    //set up file select controls
    this.numSelected = 0;
    for(let file of fileData) {
      let tag = file.tag;
      let initValue: boolean = values ? values[tag] : false;
      //set to false initially, separately set initial values so control listener handles side effects
      let control = new FormControl(initValue);
      let lastValue = false;
      let sub = control.valueChanges.subscribe((value: boolean) => {
        //use to debounce same values if toggled due to requirements
        if(value == lastValue) {
          return;
        }
        if(value) {
          this.numSelected++;
          //update required files
          for(let tag of file.requires) {
            let requiredControlData = fileSelectControls[tag];
            requiredControlData.reqCount++;
            requiredControlData.data.control.setValue(true);
          }
          lastValue = value;
        }
        //if trying to unselect check if required, if it is reselect
        else if(controlData.reqCount > 0) {
          control.setValue(true);
        }
        else {
          this.numSelected--;
          //update required file counts
          for(let tag of file.requires) {
            let requiredControlData = fileSelectControls[tag];
            requiredControlData.reqCount--;
          }
          lastValue = value;
        }
      });
      let controlData = {
        data: {
          control, sub
        },
        reqCount: 0
      };
      fileSelectControls[tag] = controlData;
    }
    return fileSelectControls;
  }

  //cleanup
  cleanupControlSubscriptions() {
    this.cleanupDatasetControlSubscriptions();
    this.cleanupFileGroupControlSubscriptions();
  }

  cleanupDatasetControlSubscriptions() {
    for(let tag in this.controls.dataset) {
      this.controls.dataset[tag].sub.unsubscribe();
    }
    this.controls.dataset = {};
  }

  cleanupFileGroupControlSubscriptions() {
    for(let groupTag in this.controls.fileGroups) {
      let fileProps = this.controls.fileGroups[groupTag].fileProps;
      for(let tag in fileProps) {
        fileProps[tag].sub.unsubscribe();
      }
      let files = this.controls.fileGroups[groupTag].files;
      for(let tag in files) {
        files[tag].data.sub.unsubscribe();
      }
    }
    this.controls.fileGroups = {};
  }

  //return info about the export item
  cancel(): void {
    this.dialogRef.close(null);
  }

  submit() {
    this.dialogRef.close(null);
  }


}

export interface FormState {
  dataset: StringMap,
  fileGroups: FileGroupStates
}

export type FileGroupStates = {[tag: string]: FileGroupState};

export interface FileGroupState {
  fileProps: FilePropState,
  files: FileSelectState
}

export type FilePropState = {[tag: string]: string[]};
export type FileSelectState = {[tag: string]: boolean};

interface FileControl {
  reqCount: number,
  data: ControlData
}

type Controls = {[tag: string]: ControlData}
type FileControls = {[tag: string]: FileControl}

interface ControlData {
  control: FormControl,
  sub: Subscription
}

interface FileGroupControls {
  [tag: string]: {
    fileProps: Controls,
    files: FileControls
  }
}

interface ExportControlData {
  datatype: ControlData,
  dataset: Controls,
  fileGroups: FileGroupControls
}

