import { Injectable } from '@angular/core';
import * as L from "leaflet";
import { DataRetreiverService } from "../util/data-retreiver.service";
import { ColorScale } from '../../models/colorScale';
import { RasterHeader, IndexedValues } from '../../models/RasterData';

export let R: any = L;

@Injectable({
  providedIn: 'root'
})
export class LeafletRasterLayerService {
  constructor(private dataRetreiver: DataRetreiverService) {
    R.GridLayer.RasterLayer = L.GridLayer.extend({
      initialize: function(options: RasterOptions) {
        let internalOpts: RasterOptionsInternal = {
          ...options
        };
        if(options.cacheEmpty) {
          internalOpts.cache = new Set<string>();
        }
        else if(options.cacheEmpty == undefined) {
          internalOpts.cacheEmpty = false;
        }
        L.Util.setOptions(this, internalOpts);
      },

      clearEmptyTileCache: function() {
        if(this.options.cache) {
          this.options.cache.clear();
        }
      },

      setData: function(values: IndexedValues, header?: RasterHeader) {
        this.options.data.values = values;
        if(header != undefined) {
          this.options.data.header = header;
        }
        //if empty data set (no data from query) the data positions will change, also just in case data indices shift for some reason
        this.clearEmptyTileCache();
        this.redraw();
      },

      setColorScale: function(colorScale: ColorScale) {
        this.options.colorScale = colorScale;
        this.redraw();
      },

      createTile: function(coords: any) {
        let coordString = JSON.stringify(coords);
        let tile: HTMLCanvasElement = <HTMLCanvasElement>L.DomUtil.create('canvas', 'leaflet-tile');

        if(!this.options.cacheEmpty || !this.options.cache.has(coordString)) {
          let ctx = tile.getContext("2d");
          let tileSize = this.getTileSize();
          tile.width = tileSize.x;
          tile.height = tileSize.y;
          let imgData = ctx.getImageData(0, 0, tileSize.x, tileSize.y);

          //get the coordinates of the tile corner, tile coords times scale
          let xMin = coords.x * tileSize.x;
          let yMin = coords.y * tileSize.y;
          let xMax = xMin + tileSize.x;
          let yMax = yMin + tileSize.y;

          let x = 0;
          let y = 0;
          let colorOff = 0;

          let hasValue = false;

          for(y = yMin; y < yMax; y++) {
            for(x = xMin; x < xMax; x++) {
              //unproject fast enough that unnecessary to decouple
              let latlng: L.LatLng = this._map.unproject([x, y], coords.z);

              let color = dataRetreiver.geoPosToColor(this.options.data.header, this.options.data.values, latlng, this.options.colorScale);
              if(color != undefined) {
                hasValue = true;
                imgData.data[colorOff] = color.r;
                imgData.data[colorOff + 1] = color.g;
                imgData.data[colorOff + 2] = color.b;
                imgData.data[colorOff + 3] = color.a;
              }
              colorOff += 4;
            }
          }

          //if caching empty tiles and tile had no values in it, add to empty tile cache
          if(this.options.cacheEmpty && !hasValue) {
            this.options.cache.add(coordString);
          }
          ctx.putImageData(imgData, 0, 0);
        }
        return tile;
      }
    });

    R.gridLayer.RasterLayer = function(options: RasterOptions) {
      return new R.GridLayer.RasterLayer(options);
    };
  }
}

export interface RasterOptions {
  cacheEmpty?: boolean,
  colorScale: ColorScale,
  data: {
    header: RasterHeader,
    values: IndexedValues
  }
}

interface RasterOptionsInternal extends RasterOptions {
  cache?: Set<string>
}
