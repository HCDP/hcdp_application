import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import {Map as LMap, Control, DomUtil, ControlPosition} from 'leaflet';
import * as rasterizeHTML from 'rasterizehtml';

@Component({
  selector: 'app-leaflet-image-export',
  templateUrl: './leaflet-image-export.component.html',
  styleUrls: ['./leaflet-image-export.component.scss']
})
export class LeafletImageExportComponent implements OnInit {
  @ViewChild("exportControl") exportControl: ElementRef;

  @Input() position: ControlPosition = "topleft";
  @Input() set map(map: LMap) {
    if(map) {
      let ExportControl = Control.extend({
        onAdd: function () {
          let control = DomUtil.get("export-control");
          return control;
        }
      });
      new ExportControl({position: this.position}).addTo(map);
    }
  }
  @Input() imageContainer: ElementRef;
  @Input() hiddenControls: string[] = [];

  constructor() {
  }

  ngOnInit() {

  }

  exportImage() {
    let canvas = document.createElement("canvas");
    let containerEl: HTMLElement = this.imageContainer.nativeElement;
    let nodeReplacements: HTMLNodeReplaceData[] = this.replaceCanvasNodesWithImg(containerEl);
    let mapBounds: DOMRect = containerEl.getBoundingClientRect();
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    let ctx = canvas.getContext("2d");
    ctx.rect(mapBounds.x, mapBounds.y, mapBounds.width, mapBounds.height);
    ctx.clip();
    let defaultDisplays = new Map<HTMLElement, string>();
    rasterizeHTML.drawDocument(document, canvas).then(() => {
      let link = document.createElement("a");
      link.download = "HCDP_map.png";
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      //cleanup
      document.body.removeChild(link);
      //reset control displays
      for(let data of defaultDisplays.entries()) {
        data[0].style.display = data[1];
      }
      //revert converted image nodes to canvas
      console.log(nodeReplacements);
      this.revertNodeReplacments(nodeReplacements);
    });

    for(let className of this.hiddenControls) {
      for(let element of <any>document.getElementsByClassName(className)) {
        defaultDisplays.set(element, element.style.display);
        element.style.display = "none";
      }
    }
  }


  private revertNodeReplacments(replaceData: HTMLNodeReplaceData[]) {
    for(let item of replaceData) {
      for(let data of item.replacements) {
        item.root.removeChild(data.replacement);
        item.root.appendChild(data.original);
      }
    }
  }

  private replaceCanvasNodesWithImg(root: HTMLElement): HTMLNodeReplaceData[] {
    let replaceData: HTMLNodeReplaceData[] = [];
    let replaceItem: HTMLNodeReplaceData = {
      root: root,
      replacements: []
    };
    //removing child nodes in forEach causes issues
    for(let child of Array.from(root.childNodes)) {
      let node = <HTMLElement>child;
      if(node.tagName == "CANVAS") {
        let original = root.removeChild(node);
        let canvasNode: HTMLCanvasElement = <HTMLCanvasElement>node;
        let dataURL = canvasNode.toDataURL("2d");
        let imageEl = document.createElement("img");
        imageEl.src = dataURL;
        //set html props
        imageEl.className = canvasNode.className;
        imageEl.width = canvasNode.width;
        for(let style in canvasNode.style) {
          try {
            imageEl.style[style] = canvasNode.style[style];
          }
          catch {}
        }
        //append image node to root
        root.appendChild(imageEl);
        replaceItem.replacements.push({
          original,
          replacement: imageEl
        });
      }
      replaceData = replaceData.concat(this.replaceCanvasNodesWithImg(node));
    }
    //only add the node if any replacements were made
    if(replaceItem.replacements.length > 0) {
      replaceData.push(replaceItem);
    }

    return replaceData;
  }

}

interface HTMLNodeReplaceData {
  root: HTMLElement,
  replacements: {
    original: HTMLElement,
    replacement: HTMLElement
  }[]
}