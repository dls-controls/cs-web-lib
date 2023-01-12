import { Color } from "./color";
import { Font, FontStyle } from "./font";

export class Axis {
  public index?: number;
  public autoScale?: boolean;
  public axisColor?: Color;
  public axisTitle?: string;
  public showGrid?: boolean;
  public gridColor?: Color;
  public dashGridLine?: boolean;
  public timeFormat?: number;
  public scaleFormat?: string;
  public scaleFont?: Font;
  public titleFont?: Font;
  public visible?: boolean;
  public logScale?: boolean;
  public leftBottomSide?: boolean;
  public maximum?: number;
  public minimum?: number;

  /**
   * Set default values for properties not yet
   * set, otherwise use set property. Uses same
   * default values as csstudio.opibuilder.xygraph.
   */
  public constructor() {
    this.index = this.index ?? 0;
    this.autoScale = this.autoScale ?? true;
    this.axisColor = this.axisColor ?? new Color("rgb(0, 0, 0");
    this.axisTitle = this.axisTitle ?? "";
    this.showGrid = this.showGrid ?? false;
    this.gridColor = this.gridColor ?? new Color("rgb(0, 0, 0");
    this.dashGridLine = this.dashGridLine ?? true;
    this.timeFormat = this.timeFormat ?? 0;
    this.scaleFormat = this.scaleFormat ?? "";
    this.scaleFont = this.scaleFont ?? new Font();
    this.titleFont = this.titleFont ?? new Font(10, FontStyle.Bold);
    this.visible = this.visible ?? true;
    this.logScale = this.logScale ?? false;
    this.leftBottomSide = this.leftBottomSide ?? true;
    this.maximum = this.maximum ?? 0;
    this.minimum = this.minimum ?? 100;
  }
}

export class Axes {
  public count: number;
  public axisOptions: Axis[];

  public constructor(count: number, axes: Axis[]) {
    if (count !== axes.length) {
      throw new Error(
        `Count ${count} is not equal to number of axes ${axes.length}`
      );
    }
    this.count = count;
    this.axisOptions = axes;
  }
}