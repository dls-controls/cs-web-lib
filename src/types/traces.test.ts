import { Color } from "./color";
import { Traces, Trace } from "./traces";

describe("Traces", () => {
  it("creates the traces object", (): void => {
    const traceList: Trace[] = [
      {
        index: 0,
        name: "trace 1",
        plotMode: 1,
        lineWidth: 2,
        traceType: 2,
        traceColor: new Color("rgba(255,0,0,255)"),
        pointStyle: 1,
        pointSize: 2,
        concatenateData: false,
        visible: true
      },
      {
        index: 1,
        name: "trace 2",
        plotMode: 1,
        lineWidth: 2,
        traceType: 2,
        traceColor: new Color("rgba(255,255,255)"),
        pointStyle: 4,
        pointSize: 2,
        concatenateData: false,
        visible: true
      }
    ];
    const traces = new Traces(2, "test", traceList);
    expect(traces).toEqual({
      count: 2,
      pvName: "test",
      traceOptions: [
        {
          index: 0,
          name: "trace 1",
          plotMode: 1,
          lineWidth: 2,
          traceType: 2,
          traceColor: new Color("rgba(255,0,0,255)"),
          pointStyle: 1,
          pointSize: 2,
          concatenateData: false,
          visible: true
        },
        {
          index: 1,
          name: "trace 2",
          plotMode: 1,
          lineWidth: 2,
          traceType: 2,
          traceColor: new Color("rgba(255,255,255)"),
          pointStyle: 4,
          pointSize: 2,
          concatenateData: false,
          visible: true
        }
      ]
    });
  });
  it("throw error if count different to number of traces", (): void => {
    const traceList: Trace[] = [
      {
        index: 0,
        name: "trace 3",
        plotMode: 2,
        lineWidth: 3,
        traceType: 2,
        traceColor: new Color("rgba(255,0,0,255)"),
        pointStyle: 1,
        pointSize: 2,
        concatenateData: true,
        visible: true
      }
    ];
    expect(() => {
      new Traces(2, "test", traceList);
    }).toThrow(Error("Count 2 is not equal to number of traces 1"));
  });
});

describe("Trace", () => {
  it("construct the trace with values", (): void => {
    const trace = new Trace(0);
    trace.name = "trace 4";
    trace.plotMode = 2;
    trace.lineWidth = 5;
    trace.traceType = 1;
    trace.traceColor = new Color("rgb(255, 254, 253");
    trace.updateDelay = 50;
    trace.updateMode = 3;
    trace.pointStyle = 5;
    trace.pointSize = 3;
    trace.concatenateData = false;
    trace.bufferSize = 1000;
    trace.visible = true;
    trace.xPv = "xPvTest";
    trace.xPvValue = 5;
    trace.xAxisIndex = 0;
    trace.yPv = "yPvTest";
    trace.yPvValue = 4;
    trace.yAxisIndex = 1;

    expect(trace).toEqual({
      index: 0,
      name: "trace 4",
      plotMode: 2,
      lineWidth: 5,
      traceType: 1,
      traceColor: new Color("rgb(255, 254, 253"),
      updateDelay: 50,
      updateMode: 3,
      pointStyle: 5,
      pointSize: 3,
      concatenateData: false,
      bufferSize: 1000,
      visible: true,
      xPv: "xPvTest",
      xPvValue: 5,
      xAxisIndex: 0,
      yPv: "yPvTest",
      yPvValue: 4,
      yAxisIndex: 1
    });
    expect(trace).toBeInstanceOf(Trace);
  });

  it("construct the trace with only defaults", (): void => {
    const trace = new Trace(0);

    expect(trace).toEqual({
      index: 0,
      name: "",
      plotMode: 0,
      lineWidth: 1,
      traceType: 0,
      traceColor: new Color("rgb(21, 21, 196)"),
      updateDelay: 100,
      updateMode: 0,
      pointStyle: 0,
      pointSize: 4,
      concatenateData: true,
      bufferSize: 100,
      visible: true,
      xPv: undefined,
      xPvValue: undefined,
      xAxisIndex: 0,
      yPv: undefined,
      yPvValue: undefined,
      yAxisIndex: 1
    });
    expect(trace).toBeInstanceOf(Trace);
  });
});
