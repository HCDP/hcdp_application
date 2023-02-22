
import { Component, OnInit, NgZone, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ExportAddItemComponent, ExportPackageItemData, FormState } from 'src/app/dialogs/export-add-item/export-add-item.component';
import { ExportManagerService } from 'src/app/services/export/export-manager.service';
import { ErrorPopupService } from 'src/app/services/errorHandling/error-popup.service';
import { Observable } from 'rxjs';
import { DateManagerService } from 'src/app/services/dateManager/date-manager.service';
import { ResourceReq } from 'src/app/models/exportData';


@Component({
  selector: 'app-export-interface',
  templateUrl: './export-interface.component.html',
  styleUrls: ['./export-interface.component.scss']
})
export class ExportInterfaceComponent implements OnInit, OnChanges {

  @Input() active: boolean;

  exportActivityMonitor = {
    active: false,
    mode: "query",
    value: 0
  };

  emailData: {
    useEmailControl: FormControl,
    emailInputControl: FormControl,
    maxSizeExceeded: boolean
  };

  acknowledgeControl: FormControl;

  exportItems: ExportPackageItemData[] = [];

  constructor(public dialog: MatDialog, private exportManager: ExportManagerService, private errorService: ErrorPopupService, private dateService: DateManagerService, private ngZone: NgZone) {
    this.emailData = {
      useEmailControl: new FormControl(false),
      emailInputControl: new FormControl(),
      maxSizeExceeded: false
    }
    this.emailData.emailInputControl.setValidators(Validators.email);
    this.acknowledgeControl = new FormControl(false);
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.active && this.active && this.exportItems.length == 0) {
      this.addExportData(-1);
    }
  }

  checkEmailReq() {
    // let numFiles: number = this.exportItems.reduce((acc: number, item: any) => {
    //   let numDateFiles = item.data.range[1].diff(item.data.range[0], item.data.period) + 1;
    //   let numExtentFiles: number = (<string[][]>Object.values(item.data.files)).reduce((acc: number, extents: string[]) => {
    //     return acc + extents.length;
    //   }, 0);
    //   let numItemFiles = numDateFiles * numExtentFiles;
    //   return acc + numItemFiles;
    // }, 0);
    // this.emailData.maxSizeExceeded = numFiles > 150;
    // if(this.emailData.maxSizeExceeded) {
    //   this.emailData.useEmailControl.setValue(true);
    // }
  }


  removeExportItem(i: number) {
    this.exportItems.splice(i, 1);
    this.checkEmailReq();
  }


  addExportData(i: number) {
    let initData: FormState = i < 0 ? null : this.exportItems[i].state;

    //panelClass applies global class to form (styles.scss)
    const dialogRef = this.dialog.open(ExportAddItemComponent, {
      width: "80%",
      height: "90%",
      panelClass: "export-dialog",
      data: initData
    });

    dialogRef.afterClosed().subscribe((data: ExportPackageItemData) => {
      if(data) {
        if(i < 0) {
          this.exportItems.push(data);
        }
        else {
          this.exportItems.splice(i, 1, data);
        }
        this.checkEmailReq();
      }

    });
  }

  export() {
    let reqs: ResourceReq[] = this.exportItems.map((item: ExportPackageItemData) => {
      let resourceDates = null;
      if(item.state.dates) {
        let startDateStr = this.dateService.dateToString(item.state.dates.start, item.state.dates.unit);
        let endDateStr = this.dateService.dateToString(item.state.dates.end, item.state.dates.unit);
        resourceDates = {
          start: startDateStr,
          end: endDateStr,
          unit: item.state.dates.unit,
          interval: item.state.dates.interval
        }
      }
      
      let { datatype, ...params } = item.state.dataset;
      let fileData = [];
      for(let groupTag in item.state.fileGroups) {
        let fileGroup = item.state.fileGroups[groupTag];
        let files: string[] = [];
        for(let file in fileGroup.files) {
          if(fileGroup.files[file]) {
            files.push(file);
          }
        }
        let fileDataItem = {
          fileParams: fileGroup.fileProps,
          files
        }
        fileData.push(fileDataItem);
      }
      let req: ResourceReq = {
        datatype,
        params,
        fileData
      }
      if(resourceDates) {
        req.dates = resourceDates;
      }
      return req;
    });
    let email = this.emailData.emailInputControl.value
    if(this.emailData.useEmailControl.value) {
      this.exportActivityMonitor.mode = "indeterminate"
      this.exportActivityMonitor.active = true;
      this.exportManager.submitEmailPackageReq(reqs, email).then(() => {
        let message = `A download request has been generated. You should receive an email at ${email} with your download package shortly. If you do not receive an email within 4 hours, please ensure the email address you entered is spelled correctly and try again or contact the site administrators.`;
        this.errorService.notify("info", message);
        this.exportActivityMonitor.active = false;
      })
      .catch((e) => {
        this.errorService.notify("error", "An error occured while requesting the download package.");
        this.exportActivityMonitor.active = false;
      });
    }
    else {
      this.exportActivityMonitor.mode = "query"
      this.exportActivityMonitor.active = true;
      this.exportManager.submitInstantDownloadReq(reqs, email).then((progress: Observable<number>) => {
        this.exportActivityMonitor.mode = "determinate";
        this.exportActivityMonitor.value = 0;
        progress.subscribe((percent: number) => {
          //wrap everything in subscription in zone for change detection and to prevent bug where dialog won't close
          this.ngZone.run(() => {
            this.exportActivityMonitor.value = percent;
          });
        }, (e: any) => {
          this.ngZone.run(() => {
            this.errorService.notify("error", "An error occured while retreiving the download package.");
            this.exportActivityMonitor.active = false;
          });
        }, () => {
          this.ngZone.run(() => {
            let message = `Your download package has been generated. Check your browser for the downloaded file.`;
            this.errorService.notify("info", message);
            this.exportActivityMonitor.active = false;
          });

        });

      })
      .catch((e) => {
        console.error(e);
        this.errorService.notify("error", "An error occured while generating the download package.");
        this.exportActivityMonitor.active = false;
      });
    }
  }
}

