/* The intention of this file is to provide a generic parsing mechanism
   that can be used for different filetypes by calling parseWidget with
   appropriate arguments.

   Limitations:
    - rules can only apply to props that have 'simple' parsers

   Possible enhancements:
    - be able to register new parsing functions for particular widgets
    - allow 'complex' parsers to be able to return multiple props
    - more precise TypeScript types
*/

import log from "loglevel";
import { GenericProp } from "../../../types/props";
import { WidgetDescription } from "../createComponent";
import { StringProp, PositionProp } from "../propTypes";
import { ElementCompact } from "xml-js";

// Specific widgets we should allow empty string parsing for
const PARSE_EMPTY_STRINGS = ["text", "label", "on_label", "off_label", "title"];

function isEmpty(obj: any): boolean {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
}
export function toArray(element?: ElementCompact): ElementCompact[] {
  let array = [];
  if (Array.isArray(element)) {
    array = element;
  } else if (element) {
    array = [element];
  }
  return array;
}

export type ParserDict = {
  [key: string]: [string, (value: any) => GenericProp | undefined];
};

export type ComplexParserDict = {
  [key: string]: (value: any) => GenericProp;
};

export type PatchFunction = (props: WidgetDescription, path?: string) => void;

/* Take an object representing a widget and return our widget description. */
export function genericParser(
  widget: any, // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
  targetWidget: React.FC,
  simpleParsers: ParserDict,
  complexParsers: ComplexParserDict,
  // Whether props with no registered function should be passed through
  // with no parsing.
  passThrough: boolean
): WidgetDescription {
  const newProps: any = { type: targetWidget };
  const allProps = {
    type: StringProp,
    position: PositionProp,
    /* We will need another way of using prop-types at runtime here. */
    // eslint-disable-next-line react/forbid-foreign-prop-types
    ...targetWidget.propTypes
  };
  /* First, parse our props if we know how to. */
  for (const prop of Object.keys(allProps)) {
    log.debug(`Trying to parse prop ${prop}`);
    if (simpleParsers.hasOwnProperty(prop)) {
      log.debug(`simple parser for ${prop}`);
      const [opiPropName, propParser] = simpleParsers[prop];
      try {
        if (widget.hasOwnProperty(opiPropName)) {
          if (!isEmpty(widget[opiPropName])) {
            newProps[prop] = propParser(widget[opiPropName]);
            log.debug(`result ${newProps[prop]}`);
            // For certain simple string props we want to accept an empty value e.g. text
          } else if (
            isEmpty(widget[opiPropName]) &&
            PARSE_EMPTY_STRINGS.includes(opiPropName)
          ) {
            newProps[prop] = "";
            log.debug(`result ${newProps[prop]}`);
          }
        }
      } catch (e) {
        log.warn(`Could not convert simple prop ${prop}:`);
        log.warn(widget[opiPropName]);
        log.warn(e);
      }
    } else if (complexParsers.hasOwnProperty(prop)) {
      /* More complex props need access to the entire widget. */
      log.debug(`complex parser for ${prop}`);
      const propParser = complexParsers[prop];
      try {
        newProps[prop] = propParser(widget);
        log.debug(`result ${newProps[prop]}`);
      } catch (e) {
        log.warn(`Could not convert complex prop ${prop}:`);
        log.warn(e);
      }
    } else if (passThrough) {
      newProps[prop] = widget[prop];
    }
  }
  // TO DO - a way of parsing nested macros for PVs needs to be properly implemented.
  // Currently nested macros are not parsed, which means a PV connection cannot be made.
  // This is a hack to get it to work for XYPlot, but this will fail for multiple PVs
  // on a single widget, and is not an ideal way of implementing.
  if (newProps.hasOwnProperty("traces")) {
    newProps.pvName.name = newProps.traces.pvName;
  }

  return newProps;
}

export function parseWidget(
  props: any, // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
  getTargetWidget: (props: any) => React.FC,
  childrenName: string,
  simpleParsers: ParserDict,
  complexParsers: ComplexParserDict,
  passThrough: boolean,
  patchFunctions: PatchFunction[],
  filepath?: string
): WidgetDescription {
  const targetWidget = getTargetWidget(props);
  const widgetDescription = genericParser(
    props,
    targetWidget,
    simpleParsers,
    complexParsers,
    passThrough
  );
  // Execute patch functions.
  for (const patcher of patchFunctions) {
    patcher(widgetDescription, filepath);
  }
  /* Child widgets */
  const childWidgets = toArray(props[childrenName]);
  widgetDescription.children = childWidgets.map((child: any) => {
    return parseWidget(
      child,
      getTargetWidget,
      childrenName,
      simpleParsers,
      complexParsers,
      passThrough,
      patchFunctions,
      filepath
    );
  });

  // Default to true if precision is not defined.
  // Applicable to BOB files.
  if (widgetDescription.precision === undefined) {
    widgetDescription.precisionFromPv = true;
  }
  // Default to true if showUnits is not defined.
  // Applicable to BOB files.
  if (widgetDescription.showUnits === undefined) {
    widgetDescription.showUnits = true;
  }
  // Default to true if wrapWords is not defined.
  // Applicable to BOB files.
  if (widgetDescription.wrapWords === undefined) {
    widgetDescription.wrapWords = true;
  }

  return widgetDescription;
}
