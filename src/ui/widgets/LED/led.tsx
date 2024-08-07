import React, { CSSProperties } from "react";
import { Widget } from "../widget";
import {
  InferWidgetProps,
  ColorPropOpt,
  IntPropOpt,
  BoolPropOpt,
  FloatPropOpt
} from "../propTypes";
import { PVComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import classes from "./led.module.css";
import { DAlarm } from "../../../types/dtypes";
import { Color } from "../../../types";
import { WIDGET_DEFAULT_SIZES } from "../EmbeddedDisplay/bobParser";

/**
 * width: the diameter of the LED
 */
export const LedProps = {
  width: FloatPropOpt,
  onColor: ColorPropOpt,
  offColor: ColorPropOpt,
  lineColor: ColorPropOpt,
  alarmSensitive: BoolPropOpt,
  bit: IntPropOpt
};

export type LedComponentProps = InferWidgetProps<typeof LedProps> & PVComponent;

/**
 * @param props properties to pass in, these will be handled by the below LED
 * function and only extra props defined on LedProps need to be passed in as well,
 * to define some text explaining the meaning of the LED in different colours add a
 * tooltip property in a json file containing a led
 */
export const LedComponent = (props: LedComponentProps): JSX.Element => {
  const {
    value,
    onColor = Color.fromRgba(0, 255, 0),
    offColor = Color.fromRgba(60, 100, 60),
    lineColor = Color.fromRgba(50, 50, 50, 178),
    width = WIDGET_DEFAULT_SIZES["led"][0],
    alarmSensitive = false,
    bit = -1
  } = props;

  const style: CSSProperties = {};

  let ledOn = false;
  const doubleValue = value?.getDoubleValue();
  if (doubleValue !== undefined) {
    if (bit < 0) {
      // Off if vlaue is 0, on otherwise.
      ledOn = doubleValue !== 0;
    } else {
      // Off if value-th bit is 0, on if it is 1
      ledOn = ((1 << doubleValue) & bit) === bit;
    }
  }
  style["backgroundColor"] = ledOn ? onColor?.toString() : offColor?.toString();
  style["border"] = `2px solid ${lineColor.toString()}`;

  // make sizes similar to size in CS-Studio, five taken
  // away from default in css file too
  style.width = `${width - 5}px`;
  style.height = `${width - 5}px`;

  let className = classes.Led;
  if (alarmSensitive) {
    const alarm = value?.getAlarm() || DAlarm.NONE;
    className += ` ${classes[alarm.quality]}`;
  }

  return <div className={className} style={style} />;
};

const LedWidgetProps = {
  ...LedProps,
  ...PVWidgetPropType
};

export const LED = (
  props: InferWidgetProps<typeof LedWidgetProps>
): JSX.Element => <Widget baseWidget={LedComponent} {...props} />;

registerWidget(LED, LedWidgetProps, "led");
