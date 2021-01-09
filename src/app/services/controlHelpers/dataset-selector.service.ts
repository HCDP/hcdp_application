import { Injectable } from '@angular/core';
import {FormControl} from '@angular/forms';
import moment, { Moment } from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DatasetSelectorService {

  constructor() { }

//   export interface DatasetConfig {
//     initialSetIndex: number,
//     datasets: any[]
// }

/*
dataset hierarchy:
classification (rainfall, temp, etc)
- date range: user selected, valid range controlled by classification (encompassing all available datasets for classification)
-- datasets: set of subclassifications, their set info, date ranges they cover

have datasets be auto selected based on date range, with hybrids used for ranges that cover multiple
provide description of dataset(s) being used and the time ranges they exist for, and allow user to select order of preference of datasets (allows for expansion to more than 2 subclasses)
dataset with highest preference that includes data for a given date will be used

have service determine dataset to be used, this will construct a set of properties to be used in query... make sure to also integrate into caching system

new control type, ordered list, draggable elements
cdkDropList around a set of cdkDrag

note category select, date range select, and dataset precedence selector (if hybrid) are global (should be available for all datasets), rest of controls and info are based on Dataset info
*/

config: any = {
    initialSetIndex: 0,
    //categorized by type
    datasets: {
        rainfall: {
            range: {
                start: "1990-01-01",
                end: "2019-12-31"
            },
            //subclass selected automatically based on selected time range, should show what type of data will be displayed though (description of ranges)
            //if overlap then have option of which to use as default
            subclasses: {
              //used for overlap
              default: "new",
              values: {
                new: {
                  range: {
                    start: "1990-01-01",
                    end: "2019-12-31"
                  }
                },
                //what should the range on this actually be?
                legacy: {
                  range: {
                    start: "1990-01-01",
                    end: "2019-12-31"
                  }
                }
              }
            },
            // controls
            // timesteps: ["monthly"],
            methods: ["new"],
            timestepsAvailable: ["monthly", "daily"],
            fillTypes: ["filled", "partial", "unfilled"]
        }
    }
}

// let selectors = [];

// //generate discreet sets
// for(let dataset of config.datasets) {
//     let base = {

//     }
// }

  getDatasets(): string[] {
      return Object.keys(this.config);
  }
}

//don't give date option for vis,

//classifications of vis items --- map, station/value items
//value items have timeseries data attached - this is not part of the selected dataset but will be options for generating time series vis

//what else, vis time granularities total (order of granularity), export time granularities, time granularities per i

/*
need general info (applicable to any data class)
- classification (readonly)
- date range (readonly)
- subclasses (readonly)
-- subrange (readonly)
-- vis included items (readonly)
-- export included items (readonly)
- subclass precedence
*/

//note vis items have to be well defined for later use

class SelectedSetInfo {

  t = {
    classification: "rainfall",
    dateRange: {
      min: moment("2012-01"),
      max: moment("2019-12")
    },
    subsets: [{
      subclassification: "new",
      precedence: 0,
      range: {
        min: moment("2012-01"),
        max: moment("2019-12")
      },
      visItems: {
        options: [{

        }],
        map: {
          options: [
            {
              type: "select",
              tag: "granularity",
              values: ["monthly"]
            }
          ]
        },
        stations: {
          options: {

          }
        }
      },
      exportItems: {

      }
    },
    {
      subclassification: "legacy",
      precedence: 1,
      visItems: {
        map: {
          min: moment("2012-01"),
          max: moment("2019-12")
        },
        stations: null
      },
      exportItems: {}
    }]
  }



  //length should be one less than date list
  datasets: Dataset[];
  dates: Moment[];

  getDatasetForDate(date: Moment) {

  }

  getDatasetsForDateRange

}


class Granularity {
  name: string;
  precedence: number;

  constructor(name: string, precedence: number) {
    this.name = name;
    this.precedence = precedence;
  }


}

class VisItemPack {
  mainGranularity: string
  items
}

class ExportItemPack {

}

abstract class DataItem {
  value: string
}

abstract class VisItem extends DataItem {

}

class ValueItem extends VisItem {
  timeSeriesGranularities: string[];

}

class MapItem extends VisItem {

}

//what is needed for generating request? (identifying resource)
class ExportItem extends DataItem {

}



//separate export info and display info
//store information on what items are available for display and export, and how to retrieve the data
//display info should have a static set of things that can be displayed, need to know for application, export can have anything, just need info on how to retrieve resource
//no, because need some sort of function based on date to get actual resource location, just have classifications of export items and have query info generated by service that handles that stuff
//just make sure you have a handler for each of the types, would have needed to add that anyway
//this is just a set of tags that identify which handler you'll need to use
//in whatever service using to do actual export logic it should have a mapping of these tags along with date and classification/subclassification and determine how to retreive resource
//same with display stuff, don't have the query logic here, this should just tag what items should be retrieved
//NOTE THAT YOULL NEED TO ADD CAVEAT TO DOWNLOAD PACKAGE STUFF THAT NOT ALL DATA MIGHT BE THERE, ADD LOGIC TO DISPLAY NOTHING IF AN ITEM ISNT RETREIVED (e.g. if not retreiving rainfall station data)
//also need other information on what data to use, what is to be selected by users, what is bound between display and export options and what is separately selected by export
//"display" options are logically first, and any data with same tag shares any dataset selection properties with same export tag, so have "bound" flag to indicate implicit carryover
//use any selected display data to seed export data if not bound
//e.g. for fill type have it unbound (user can select multiples for export), but seed export by having selected display fill type initially selected

//export data implicitly has a toggle control
class Dataset {
  subclass: string
  label: string;
  info: string;
  //sets of tags of items that are valid for these categories
  displayOpts: DisplayItemOptions;
  exportOpts: ExportItemOptions;
  //

  dateRange: DateRange;

  constructor(subclass: string, label: string, displayOpts: DisplayItemOptions, exportOpts: ExportItemOptions, dateRange: DateRange, info: string) {

  }

  //bind

}

class DatasetGroup {
  classification: string;

}

interface DisplayItemOptions {
  [tag: string]: AbstractControlData[]
}
interface ExportItemOptions {
  [tag: string]: AbstractControlData[]
}

//typings for specific tags to indicate availability of data for display and export
type DisplayTag = "raster" | "station";
type ExportTag = "raster" | "station" | "anomaly" | "se" | "anomaly_se" | "metadata";

interface DateRange {
  start: Moment,
  end: Moment
}

abstract class AbstractControlData {
  type: string
  control: FormControl;
  defaultValue: any;
  label: string;
  info: string;

  constructor(label: string, type: string, defaultValue: any, info?: string) {
    this.type = type;
    this.control = new FormControl();
    this.info = info;
  }
}

class SelectControl extends AbstractControlData {
  defaultValue: string;
  values: SelectorValues[];
  allowBlank: boolean;

  constructor(label: string, defaultValue: string, values: SelectorValues[], allowBlank: boolean = true, info?: string) {
    let type = "select"
    super(label, type, defaultValue, info)
    this.values = values;
    this.allowBlank = allowBlank;
  }
}

class ToggleControl extends AbstractControlData {
  defaultValue: boolean

  constructor(label: string, defaultValue: boolean, info?: string) {
    let type = "toggle"
    super(label, type, defaultValue, info)
  }
}


interface SelectorValues {
  value: string,
  label: string
}