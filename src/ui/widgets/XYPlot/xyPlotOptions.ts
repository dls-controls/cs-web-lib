import { Axis } from "../../../types/axes";
import { PlotData } from "plotly.js";
import { Traces } from "../../../types/traces";
import type { DType } from "../../../types/dtypes";
import React from "react";
import { roundValue } from "../utils";

export type NewAxisSettings = {
  [key: string]: any;
};

// Constants for trace properties

const TRACE_STYLE: { [key: number]: any } = {
  0: { type: "scatter", mode: "lines", line: { dash: "solid" } },
  1: { type: "scatter", mode: "lines", line: { dash: "dash" } },
  2: { type: "scatter", mode: "markers", line: { dash: "solid" } },
  3: { type: "bar" },
  4: { type: "scatter", mode: "lines", fill: "tonexty" },
  5: { type: "scatter", mode: "lines", line: { dash: "solid" } },
  6: { type: "scatter", mode: "lines", line: { dash: "solid" } }
};

const POINT_STYLE: { [key: number]: string } = {
  0: "none",
  1: "circle",
  2: "triangle-up-open",
  3: "triangle-up",
  4: "square-open",
  5: "square",
  6: "diamond-open",
  7: "diamond",
  8: "cross",
  9: "x",
  10: "hourglass-open"
};

/**
 * Create traces containing data for each trace
 * specified.
 * @param traces trace configuration
 * @param value data from pv
 * @param bytesPerElement number of bytes each data element
 * has
 * @returns a list of PlotData traces
 */
export function createTraces(
  traces: Traces,
  value: DType,
  bytesPerElement: number
): Partial<PlotData>[] {
  const arrayValue = value.value.arrayValue;
  // TO DO - can format this better once I figure out confusing types
  if (!arrayValue) return [];
  const dataSet: Partial<PlotData>[] = [];
  traces.traceOptions.forEach(options => {
    const traceStyle = options.traceType
      ? TRACE_STYLE[options.traceType]
      : TRACE_STYLE[0];
    // Create a dataset for each trace, starting with style
    const data: Partial<PlotData> = {
      ...traceStyle
    };
    data.marker = {
      color: options.traceColor?.toString(),
      symbol: options.pointStyle
        ? POINT_STYLE[options.pointStyle]
        : POINT_STYLE[0],
      size: options.pointSize
    };
    // Line, scatter and area plots are similar in format options
    if (traceStyle.type === "scatter") {
      // different trace layout for bar and line
      data.line = {
        color: options.traceColor?.toString(),
        width: options.lineWidth
      };
      // if area plot, fill in with same colour as line
      if (traceStyle.fill) {
        data.fill = traceStyle.fill;
        data.fillcolor = options.traceColor?.toString();
      }
    }

    // Set up actual data
    let tmpY: number[] = [];
    // TO DO - figure out a way to access previous data values
    // Currently this does NOT work
    if (options.concatenateData && data.y) {
      // If concatenating, keep existing data
      data.y.forEach((val: any) => {
        tmpY.push(val);
      });
    }
    // Add new data values
    arrayValue.forEach((val: any) => {
      tmpY.push(val);
    });

    // Calculate number of points to plot with buffer size, default 100
    const bufferSize = options.bufferSize ? options.bufferSize : 100;
    // Number of points to plot
    const numPoints = bufferSize / bytesPerElement;
    // Reduce data if more points than buffer allows
    if (numPoints < tmpY.length && !options.plotMode) {
      // Use the last n points
      tmpY = tmpY.slice(-numPoints);
    } else if (numPoints < tmpY.length) {
      // Use the first n points
      tmpY = tmpY.slice(0, numPoints);
    }

    data.x = Array.from(Array(tmpY.length).keys());
    data.y = tmpY;
    dataSet.push(data);
  });
  return dataSet;
}

/**
 * Create plotly axis object for each axisOptions
 * in the axes array.
 * @param axesList list of all the axes information
 * from the file
 * @returns a Plotly formatted axis object
 */
export function createAxes(
  axesList: Axis[],
  font: React.CSSProperties
): NewAxisSettings[] {
  const formattedAxes: any[] = [];
  let idx = 0;
  for (const axis of axesList) {
    const _newAxis: NewAxisSettings = {
      autorange: true,
      showline: true,
      visible: axis.visible,
      showgrid: axis.showGrid,
      griddash: axis.dashGridLine,
      gridwidth: 0.5,
      gridcolor: axis.axisColor?.toString(),
      tickcolor: axis.axisColor?.toString(),
      zeroline: false,
      automargin: true,
      minor: {
        ticks: "outside"
      },
      tickformat: axis.scaleFormat
    };
    // Only add title labels if they exist
    if (axis.axisTitle !== "") {
      _newAxis.title = {
        text: axis.axisTitle,
        standoff: 0
      };
      _newAxis.titlefont = {
        family: font ? font.fontFamily : "Liberation sans, sans-serif",
        size: font.fontSize ? font.fontSize : 12
      };
    }
    _newAxis.range = [axis.minimum, axis.maximum];
    _newAxis.autorange = false;

    if (axis.logScale) _newAxis.type = "log";

    // More than 2 axes, determine position and location of axes
    if (idx > 1) {
      _newAxis.side = axis.leftBottomSide ? "left" : "right";
      _newAxis.overlaying = axis.yAxis ? "y" : "x";
      _newAxis.position = 0;
      _newAxis.anchor = "free";
      // Only shift to add space for 2nd y-axis if it is overlapping and visible
      if (axis.visible)
        formattedAxes[0].domain = [0.08 * (axesList.length - 1), 1];
    }
    formattedAxes.push(_newAxis);
    idx += 1;
  }
  return formattedAxes;
}

/**
 * Calculates the axis range within the maximum
 * and minimum limits using the highest and lowest
 * data values. Defaults to range specified from file
 * if calculated limits are larger.
 * @param oldAxis options object read from file
 * @param newAxis plotly axis options object
 * @param dataSet array of PV data
 * @param index the index of the axis
 * @returns modified axis options object
 */
export function calculateAxisLimits(
  oldAxis: Axis,
  newAxis: NewAxisSettings,
  dataSet: any[]
): NewAxisSettings {
  // If autoscale not enabled, do not rescale axes
  if (!oldAxis.autoScale) return newAxis;
  // Find axis limits
  const [axMin, axMax]: [number, number] = newAxis.range;
  // Determine if we are using x or y data
  let dataType = "x";
  if (oldAxis.index > 0 && oldAxis.yAxis) dataType = "y";
  // Find max and minimum value from all the traces and round to 1sf
  let actualMin = Math.min(...dataSet[0][dataType]);
  let actualMax = Math.max(...dataSet[0][dataType]);

  dataSet.forEach(arr => {
    const nextMin = Math.min(...arr[dataType]);
    const nextMax = Math.max(...arr[dataType]);
    if (actualMin > nextMin) actualMin = nextMin;
    if (actualMax < nextMax) actualMax = nextMax;
  });
  let min = roundValue(actualMin, 0);
  let max = roundValue(actualMax, 1);
  // If number is within autoscale threshold, just use axis limits
  const threshold = 1 - (max - min) / (axMax - axMin);
  if (
    oldAxis.autoScaleThreshold &&
    -oldAxis.autoScaleThreshold < threshold &&
    threshold < oldAxis.autoScaleThreshold
  ) {
    min = axMin;
    max = axMax;
  }
  newAxis.range = [min, max];
  return newAxis;
}
