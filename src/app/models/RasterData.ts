

export class RasterData {

    private data: {
        header: RasterHeader,
        data: BandData
    };

    constructor(header: RasterHeader) {
        this.data = {
            header: header,
            data: {}
        }
    }

    combine(raster: RasterData, renameFunction?: (bandName: string) => string | undefined): UpdateStatus<FailedBands> {
        let stat = {
            code: UpdateFlags.OK,
            details: {bands: []}
        };
        if(renameFunction == undefined) {
            renameFunction = (bandName: string) => {
                return null;
            };
        }
        //can only combine if headers are the same (data must be spatially coincident)
        if(this.compareHeader(raster.getHeader()).length == 0) {
            let bands: BandData = {};
            let inBands = raster.getBands();
            let name: string;
            let rename: string;
            let band: string;
            for(band in inBands) {
                name = band;
                rename = renameFunction(band);
                //rename if defined
                if(rename !== undefined && rename !== null) {
                    name = rename;
                }
                bands[name] = inBands[band];
            }
            stat = this.addBands(bands);
        }
        else {
            stat.code |= UpdateFlags.ERROR_HEADER_MISMATCH;
            stat.details = null;
        }
        return stat;
    }

    exportRasterAsJSON() {

    }

    addBand(name: string, values: IndexedValues): UpdateStatus<null> {
        let success = {
            code: UpdateFlags.OK,
            details: null
        };
        if(this.data.data[name] == undefined) {
            this.data.data[name] = values;
        }
        else {
            success.code |= UpdateFlags.ERROR_NAME_TAKEN;
        }
        return success;
    }

    addBands(bands: BandData): UpdateStatus<FailedBands> {
        let stat = {
            code: UpdateFlags.OK,
            details: {bands: []}
        }
        let subStat: UpdateStatus<null>;
        let band: string;
        for(band in bands) {
            subStat = this.addBand(band, bands[band]);
            if(subStat.code != UpdateFlags.OK) {
                stat.code |= UpdateFlags.WARNING_NAME_TAKEN
                stat.details.bands.push(band);
            }
        }
        return stat;
    }

    verifyIndexRange(values: IndexedValues): boolean {
        let valid = true;
        let maxValue = this.data.header.nRows * this.data.header.nCols;
        let indices = values.keys();
        let pos = indices.next();
        while(!pos.done) {
            if(pos.value >= maxValue) {
                valid = false;
                break;
            }
            pos = indices.next();
        }
        return valid;
    }

    getHeader(): RasterHeader {
        return this.data.header;
    }

    renameBand(oldName: string, newName: string): UpdateStatus<null> {
        let stat = {
            code: UpdateFlags.OK,
            details: null
        };
        let data = this.data.data[oldName];
        let newValid = this.data.data[newName];
        //old band name must exist, new band name must not
        if(data != undefined && newValid == undefined) {
            this.data.data[newName] = data;
            delete this.data.data[oldName];
        }
        else {
            //set appropriate errors
            if(data == undefined) {
                stat.code |= UpdateFlags.ERROR_INVALID_BAND;
            }
            if(newValid != undefined) {
                stat.code |= UpdateFlags.ERROR_NAME_TAKEN
            }
        }

        return stat;
    }

    getBandNames(): string[] {
        return Object.keys(this.data.data);
    }

    getBands(bands?: string[]): BandData {
        let data: BandData = {};
        if(bands == undefined) {
            data = this.data.data;
        }
        else {
            let name: string;
            let i: number;
            for(i = 0; i < bands.length; i++) {
                name = bands[i];
                data[name] = this.data.data[name]
            }
        }
        return data;
    }

    //compare this objects header with the passed header
    //returns array of differing fields
    compareHeader(header: RasterHeader): string[] {
        let diff: string[] = [];
        let fields = Object.keys(this.data.header);
        let field: string;
        let i: number;
        for(i = 0; i < fields.length; i++) {
            field = fields[i];
            if(this.data.header[field] != header[field]) {
                diff.push(field);
            }
        }
        return diff;
    }

    updateBand(band: string, values: IndexedValues, updateUndefined: boolean = false): UpdateStatus<FailedIndices> {
        let status = {
            code: UpdateFlags.OK,
            details: {indices: []}
        };
        let data: IndexedValues = this.data.data[band];
        //need to verify not out of raster range
        let maxValues = this.data.header.nCols * this.data.header.nRows;
        if(data != undefined) {
            values.forEach((value: number, index: number) => {
                if(index < maxValues) {
                    //if shouldn't update undefined values, ensure not undefined
                    if(updateUndefined || data.get(index) != undefined) {
                        data.set(index, value);
                    }
                    else {
                        //if fail check set code and update failedIndices list
                        status.code |= UpdateFlags.WARNING_INVALID_INDEX_UNDEFINED;
                        status.details.indices.push(index);
                    }
                }
                else {
                    status.code |= UpdateFlags.WARNING_INVALID_INDEX_OOR;
                    status.details.indices.push(index);
                }
            });
        }
        else {
            status.code |= UpdateFlags.ERROR_INVALID_BAND;
            status.details = null;
        }



        return status;
    }

}


export interface FailedIndices {
    indices: number[]
}

export interface FailedBands {
    bands: string[]
}

export type IndexedValues = Map<number, number>;

export interface BandData {
    [bandName: string]: IndexedValues
}

export interface RasterHeader {
    nCols: number,
    nRows: number,
    xllCorner: number,
    yllCorner: number,
    cellXSize: number,
    cellYSize: number
}

export interface UpdateStatus<T> {
    code: UpdateFlags,
    details: T
}


export enum UpdateFlags {
    OK = 0,
    WARNING_INVALID_INDEX_OOR = 1,
    WARNING_INVALID_INDEX_UNDEFINED = 1 << 1,
    ERROR_INVALID_BAND = 1 << 2,
    ERROR_NAME_TAKEN = 1 << 3,
    WARNING_NAME_TAKEN = 1 << 4,
    ERROR_HEADER_MISMATCH = 1 << 5
}

