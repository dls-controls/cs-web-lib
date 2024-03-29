import React, { CSSProperties } from "react";
import { Widget } from "../widget";
import {
  InferWidgetProps,
  ColorPropOpt,
  StringPropOpt,
  FontPropOpt,
  TracesPropOpt,
  AxesPropOpt,
  BoolPropOpt,
  FloatPropOpt
} from "../propTypes";
import { PVComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import {
  calculateAxisLimits,
  createAxes,
  createTraces,
  NewAxisSettings
} from "./xyPlotOptions";
import { Color } from "../../../types/color";
import { trimFromString } from "../utils";

export const XYPlotProps = {
  height: FloatPropOpt,
  width: FloatPropOpt,
  plotBackgroundColor: ColorPropOpt,
  title: StringPropOpt,
  titleFont: FontPropOpt,
  showLegend: BoolPropOpt,
  showPlotBorder: BoolPropOpt,
  showToolbar: BoolPropOpt,
  traces: TracesPropOpt,
  axes: AxesPropOpt
};

// Create plot component from minimal Plotly package
// This is necessary because normal Plot component is too large,
// and causing issues in clients using cs-web-lib with memory
const Plot = createPlotlyComponent(Plotly);

export type XYPlotComponentProps = InferWidgetProps<typeof XYPlotProps> &
  PVComponent;

export const XYPlotComponent = (props: XYPlotComponentProps): JSX.Element => {
  const {
    height = 250,
    width = 400,
    value,
    plotBackgroundColor = Color.fromRgba(255, 255, 255),
    title = "",
    titleFont,
    showLegend = true,
    showPlotBorder,
    // showToolbar, // TO DO - do we want a toolbar as well?
    traces,
    axes
  } = props;
  // TO DO - having all these checks is not ideal
  if (
    value?.value.arrayValue &&
    axes &&
    traces &&
    titleFont &&
    width &&
    height
  ) {
    const bytesPerElement = value.value.arrayValue.BYTES_PER_ELEMENT;
    // If data exists, creates traces to plot
    const dataSet = createTraces(traces, value, bytesPerElement);
    // Set up style
    let style: CSSProperties = {};
    if (showPlotBorder) {
      style = { border: "1px solid black", padding: "1px" };
    }
    const font = titleFont?.css();
    // Sometimes font is a string with "px" on the end
    if (typeof font.fontSize === "string")
      font.fontSize = trimFromString(font.fontSize);

    const newAxisOptions = createAxes(axes.axisOptions, font);
    newAxisOptions.forEach((newAxis: NewAxisSettings, index: number) => {
      newAxis = calculateAxisLimits(axes.axisOptions[index], newAxis, dataSet);
    });
    // Set up plot appearance
    const plotLayout: any = {
      margin: {
        t: 20,
        b: 5,
        l: 5,
        r: 5
      },
      overflow: "hidden",
      paper_bgcolor: plotBackgroundColor.toString(),
      plot_bgcolor: plotBackgroundColor.toString(),
      showlegend: showLegend,
      width: width - 5,
      height: height - 5,
      title: {
        text: title,
        font: {
          family: font ? font.fontFamily : "Liberation sans, sans-serif",
          size: font.fontSize ? font.fontSize : 12
        }
      },
      uirevision: 1 // This number needs to stay same to persist zoom on refresh
    };
    // TO DO - better way of coordinating axis names
    const axisNames = ["xaxis", "yaxis", "yaxis2", "yaxis3"];
    const len = newAxisOptions.length;
    for (let i = 0; i < len; i++) {
      plotLayout[axisNames[i]] = newAxisOptions.shift();
    }
    return (
      <div className={"showBorder"} style={style}>
        <Plot data={dataSet} layout={plotLayout} />
      </div>
    );
  }
  // If doesn't pass checks above, render empty box with msg
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        fontSize: "14px",
        fontWeight: "bold",
        border: "2px solid red",
        padding: "1px"
      }}
    >
      XYPlot could not be displayed. Please check the .opi file and connection
      to PV {traces?.pvName}.
    </div>
  );
};

const XYPlotWidgetProps = {
  ...XYPlotProps,
  ...PVWidgetPropType
};

export const XYPlot = (
  props: InferWidgetProps<typeof XYPlotWidgetProps>
): JSX.Element => <Widget baseWidget={XYPlotComponent} {...props} />;

registerWidget(XYPlot, XYPlotWidgetProps, "xyplot");
