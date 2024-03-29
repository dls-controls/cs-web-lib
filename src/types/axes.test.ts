import { Color } from "./color";
import { Axes, Axis } from "./axes";
import { Font, FontStyle } from "./font";

describe("Axes", () => {
  it("creates the axes object", (): void => {
    const axesList: Axis[] = [
      {
        index: 0,
        axisColor: new Color("rgb(256, 255, 254"),
        axisTitle: "X axis",
        showGrid: false,
        gridColor: new Color("rgb(256, 255, 254"),
        dashGridLine: false,
        titleFont: new Font(),
        visible: true,
        logScale: false,
        maximum: 10,
        minimum: 0
      },
      {
        index: 1,
        axisColor: new Color("rgb(256, 255, 254"),
        axisTitle: "Y axis",
        showGrid: false,
        gridColor: new Color("rgb(256, 255, 254"),
        titleFont: new Font(),
        visible: true,
        logScale: false,
        maximum: 30,
        minimum: 15
      }
    ];
    const axes = new Axes(2, axesList);
    expect(axes).toEqual({
      count: 2,
      axisOptions: [
        {
          index: 0,
          axisColor: new Color("rgb(256, 255, 254"),
          axisTitle: "X axis",
          showGrid: false,
          gridColor: new Color("rgb(256, 255, 254"),
          dashGridLine: false,
          titleFont: new Font(),
          visible: true,
          logScale: false,
          maximum: 10,
          minimum: 0
        },
        {
          index: 1,
          axisColor: new Color("rgb(256, 255, 254"),
          axisTitle: "Y axis",
          showGrid: false,
          gridColor: new Color("rgb(256, 255, 254"),
          titleFont: new Font(),
          visible: true,
          logScale: false,
          maximum: 30,
          minimum: 15
        }
      ]
    });
  });
  it("throw error if count different to number of traces", (): void => {
    const axesList: Axis[] = [
      {
        index: 0,
        axisColor: new Color("rgb(0, 0, 0"),
        axisTitle: "Z axis",
        showGrid: true,
        gridColor: new Color("rgb(0, 0, 0"),
        dashGridLine: false,
        titleFont: new Font(),
        visible: true,
        logScale: false,
        maximum: 10,
        minimum: 0
      }
    ];
    expect(() => {
      new Axes(3, axesList);
    }).toThrow(Error("Count 3 is not equal to number of axes 1"));
  });
});

describe("Axis", () => {
  it("construct the axis with values", (): void => {
    const axis = new Axis(1);
    axis.autoScale = false;
    axis.autoScaleThreshold = 0.7;
    axis.axisColor = new Color("rgb(255, 0, 0");
    axis.axisTitle = "Velocity";
    axis.showGrid = true;
    axis.gridColor = new Color("rgb(255, 0, 0");
    axis.dashGridLine = false;
    axis.timeFormat = 2;
    axis.scaleFormat = "0.0";
    axis.scaleFont = new Font(10, FontStyle.Bold, "Comic sans");
    axis.titleFont = new Font(10, FontStyle.Bold, "Comic sans");
    axis.visible = false;
    axis.logScale = true;
    axis.leftBottomSide = false;
    axis.maximum = 40;
    axis.minimum = 10;
    axis.yAxis = true;

    expect(axis).toEqual({
      index: 1,
      autoScale: false,
      autoScaleThreshold: 0.7,
      axisColor: new Color("rgb(255, 0, 0"),
      axisTitle: "Velocity",
      showGrid: true,
      gridColor: new Color("rgb(255, 0, 0"),
      dashGridLine: false,
      timeFormat: 2,
      scaleFormat: "0.0",
      scaleFont: new Font(10, FontStyle.Bold, "Comic sans"),
      titleFont: new Font(10, FontStyle.Bold, "Comic sans"),
      visible: false,
      logScale: true,
      leftBottomSide: false,
      maximum: 40,
      minimum: 10,
      yAxis: true
    });
    expect(axis).toBeInstanceOf(Axis);
  });

  it("construct the axis with only defaults", (): void => {
    const axis = new Axis(0);

    expect(axis).toEqual({
      index: 0,
      autoScale: true,
      autoScaleThreshold: 0.95,
      axisColor: new Color("rgb(0, 0, 0"),
      axisTitle: "",
      showGrid: false,
      gridColor: new Color("rgb(0, 0, 0"),
      dashGridLine: true,
      timeFormat: 0,
      scaleFormat: "",
      scaleFont: new Font(),
      titleFont: new Font(10, FontStyle.Bold),
      visible: true,
      logScale: false,
      leftBottomSide: true,
      maximum: 100,
      minimum: 0,
      yAxis: false
    });
    expect(axis).toBeInstanceOf(Axis);
  });
});
