import { Color } from "./color";
import { Font } from "./font";
import { MacroMap } from "./macros";
import { WidgetActions } from "../ui/widgets/widgetActions";
import { Border } from "./border";
import { Position } from "./position";
import { PV } from "./pv";
import { Traces } from "./traces";
import { Axes } from "./axes";
import { Points } from "./points";

export type GenericProp =
  | string
  | string[]
  | boolean
  | number
  | PV
  | Color
  | Font
  | Border
  | Position
  | Rule[]
  | MacroMap
  | WidgetActions
  | OpiFile
  | Traces
  | Axes
  | Points;

export interface Expression {
  boolExp: string;
  value: string;
  convertedValue?: GenericProp;
}

interface RulePV {
  pvName: PV;
  trigger: boolean;
}

export interface Rule {
  name: string;
  prop: string;
  outExp: boolean;
  pvs: RulePV[];
  expressions: Expression[];
}

export interface OpiFile {
  path: string;
  macros: MacroMap;
  defaultProtocol: string;
}
