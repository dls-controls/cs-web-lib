import React, { useContext } from "react";

import { commonCss, Widget } from "../widget";
import { PVWidgetPropType, PVComponent } from "../widgetProps";
import {
  InferWidgetProps,
  BoolPropOpt,
  StringPropOpt,
  ColorPropOpt,
  FloatPropOpt,
  BorderPropOpt,
  StringProp,
  ChoicePropOpt,
  FontPropOpt,
  ActionsPropType
} from "../propTypes";
import { registerWidget } from "../register";
import { ImageComponent } from "../Image/image";
import { LabelComponent } from "../Label/label";
import { Color } from "../../../types/color";
import { executeActions, WidgetActions } from "../widgetActions";
import { MacroContext } from "../../../types/macros";
import { ExitFileContext, FileContext } from "../../../misc/fileContext";
import { DType } from "../../../types/dtypes";

const SymbolProps = {
  imageFile: StringProp,
  alt: StringPropOpt,
  backgroundColor: ColorPropOpt,
  showBooleanLabel: BoolPropOpt,
  labelPosition: ChoicePropOpt([
    "top",
    "left",
    "center",
    "right",
    "bottom",
    "top left",
    "top right",
    "bottom left",
    "bottom right"
  ]),
  border: BorderPropOpt,
  rotation: FloatPropOpt,
  flipHorizontal: BoolPropOpt,
  flipVertical: BoolPropOpt,
  visible: BoolPropOpt,
  stretchToFit: BoolPropOpt,
  actions: ActionsPropType,
  font: FontPropOpt
};

export type SymbolComponentProps = InferWidgetProps<typeof SymbolProps> &
  PVComponent;

/**
 * This component combines the use of a svg with a label, and is used to replace
 * the MultistateMonitorWidget from CS-Studio
 * @param props
 */
export const SymbolComponent = (props: SymbolComponentProps): JSX.Element => {
  const style = commonCss(props as any);

  let imageFile = props.imageFile;
  const regex = / [0-9]\./;
  const intValue = DType.coerceDouble(props.value);
  if (!isNaN(intValue)) {
    imageFile = props.imageFile.replace(regex, ` ${intValue.toFixed(0)}.`);
  }

  let alignItems = "center";
  let justifyContent = "center";
  switch (props.labelPosition) {
    case "top":
      alignItems = "flex-start";
      break;
    case "right":
      justifyContent = "flex-end";
      break;
    case "bottom":
      alignItems = "flex-end";
      break;
    case "left":
      justifyContent = "flex-start";
      break;
    case "top right":
      alignItems = "flex-start";
      justifyContent = "flex-end";
      break;
    case "bottom right":
      alignItems = "flex-end";
      justifyContent = "flex-end";
      break;
    case "bottom left":
      alignItems = "flex-end";
      justifyContent = "flex-start";
      break;
    case "top left":
      alignItems = "flex-start";
      justifyContent = "flex-start";
      break;
  }

  const files = useContext(FileContext);
  const exitContext = useContext(ExitFileContext);
  const parentMacros = useContext(MacroContext).macros;
  function onClick(event: React.MouseEvent<HTMLDivElement>): void {
    if (props.actions !== undefined) {
      executeActions(
        props.actions as WidgetActions,
        files,
        exitContext,
        parentMacros
      );
    }
  }

  // Note: I would've preferred to define the onClick on div that wraps
  // both sub-components, but replacing the fragment with a div, with the way
  // the image component is written causes many images to be of the incorrect size
  return (
    <>
      <ImageComponent {...props} imageFile={imageFile} onClick={onClick} />
      {props.showBooleanLabel && (
        <>
          <div
            onClick={onClick}
            style={{
              ...style,
              backgroundColor: "transparent",
              position: "absolute",
              height: "100%",
              width: "100%",
              top: 0,
              left: 0,
              display: "flex",
              alignItems,
              justifyContent
            }}
          >
            <div style={{ padding: "5%" }}>
              <LabelComponent
                {...props}
                backgroundColor={Color.TRANSPARENT}
                text={props.value?.getStringValue()}
              ></LabelComponent>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const SymbolWidgetProps = {
  ...SymbolProps,
  ...PVWidgetPropType
};

export const Symbol = (
  props: InferWidgetProps<typeof SymbolWidgetProps>
): JSX.Element => <Widget baseWidget={SymbolComponent} {...props} />;

registerWidget(Symbol, SymbolWidgetProps, "symbol");
