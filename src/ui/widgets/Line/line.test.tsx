import React from "react";
import renderer, { ReactTestRendererJSON } from "react-test-renderer";
import { render } from "@testing-library/react";
import { LineComponent } from "./line";
import { Color } from "../../../types/color";

const LineRenderer = (lineProps: any): ReactTestRendererJSON => {
  return renderer
    .create(<LineComponent {...lineProps} />)
    .toJSON() as ReactTestRendererJSON;
};

describe("<LineComponent />", (): void => {
  test("matches snapshot", (): void => {
    const { asFragment } = render(
      <LineComponent
        {...({
          backgroundColor: Color.fromRgba(0, 255, 255),
          width: 20,
          height: 15,
          lineWidth: 4,
          rotationAngle: 45,
          points: {
            values: [
              { x: 2, y: 20 },
              { x: 6, y: 30 },
              { x: 15, y: 4 }
            ]
          }
        } as any)}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test("default properties are added to line component", (): void => {
    const lineProps = {
      width: 20,
      height: 25,
      backgroundColor: Color.fromRgba(0, 255, 255),
      points: {
        values: [
          { x: 1, y: 10 },
          { x: 15, y: 20 },
          { x: 4, y: 15 }
        ]
      }
    };

    const svg = LineRenderer(lineProps);
    expect(svg.props.viewBox).toEqual("0 0 20 25");

    const lines = svg.children as Array<ReactTestRendererJSON>;

    expect(lines[0].props.stroke).toEqual("rgba(0,255,255,255)");
    expect(lines[0].props.strokeWidth).toEqual(3);
    expect(lines[0].props.transform).toEqual("rotation(0,0,0)");
    expect(lines[0].props.points).toEqual("1,10 15,20 4,15 ");
  });

  test("props override default properties, no arrows", (): void => {
    const lineProps = {
      width: 30,
      height: 20,
      lineWidth: 15,
      backgroundColor: Color.fromRgba(0, 254, 250),
      transparent: true,
      rotationAngle: 45,
      visible: true,
      points: {
        values: [
          { x: 16, y: 4 },
          { x: 25, y: 10 },
          { x: 4, y: 15 }
        ]
      },
      arrows: 0
    };

    const svg = LineRenderer(lineProps);
    expect(svg.props.viewBox).toEqual("0 0 30 20");

    const lines = svg.children as Array<ReactTestRendererJSON>;

    expect(lines[0].props.stroke).toEqual("rgba(0,0,0,0)");
    expect(lines[0].props.strokeWidth).toEqual(15);
    expect(lines[0].props.transform).toEqual("rotation(45,0,0)");
    expect(lines[0].props.points).toEqual("16,4 25,10 4,15 ");
  });

  test("line with filled arrowhead", (): void => {
    const lineProps = {
      width: 30,
      height: 20,
      lineWidth: 15,
      backgroundColor: Color.fromRgba(0, 254, 250),
      transparent: true,
      rotationAngle: 45,
      visible: true,
      points: {
        values: [
          { x: 16, y: 5 },
          { x: 26, y: 10 },
          { x: 6, y: 15 }
        ]
      },
      arrows: 3,
      arrowLength: 2,
      fillArrow: true
    };

    const svg = LineRenderer(lineProps);
    expect(svg.props.viewBox).toEqual("0 0 30 20");

    const lines = svg.children as Array<ReactTestRendererJSON>;
    const marker = lines[0].children as Array<ReactTestRendererJSON>;

    // Check arrowhead definitions were created
    expect(marker[0].props.markerWidth).toEqual("2");
    expect(marker[0].props.markerHeight).toEqual("2");
    expect(marker[0].props.orient).toEqual("auto-start-reverse");
    expect(marker[0].props.markerUnits).toEqual("userSpaceOnUse");

    expect(lines[1].props).toHaveProperty("markerStart");
    expect(lines[1].props).toHaveProperty("markerEnd");
    expect(lines[1].props.points).toEqual("18,6 26,10 8,15 ");
  });

  test("line with unfilled arrowhead", (): void => {
    const lineProps = {
      width: 30,
      height: 20,
      lineWidth: 2,
      backgroundColor: Color.fromRgba(0, 254, 250),
      transparent: true,
      rotationAngle: 45,
      visible: true,
      points: {
        values: [
          { x: 40, y: 10 },
          { x: 40, y: 20 },
          { x: 20, y: 20 }
        ]
      },
      arrows: 1,
      arrowLength: 2,
      fillArrow: false
    };

    const svg = LineRenderer(lineProps);
    expect(svg.props.viewBox).toEqual("0 0 30 20");

    const lines = svg.children as Array<ReactTestRendererJSON>;
    const marker = lines[0].children as Array<ReactTestRendererJSON>;

    // Check arrowhead definitions were created
    expect(marker[0].props.markerWidth).toEqual("1");
    expect(marker[0].props.markerHeight).toEqual("1");
    expect(marker[0].props.orient).toEqual("auto-start-reverse");
    expect(marker[0].props.markerUnits).toEqual("strokeWidth");

    expect(lines[1].props).toHaveProperty("markerStart");
    expect(lines[1].props.stroke).toEqual("rgba(0,0,0,0)");
    expect(lines[1].props.points).toEqual("40,10 40,20 20,20 ");
  });

  test("line component not created if no points to plot", (): void => {
    const lineProps = {
      width: 20,
      height: 25,
      backgroundColor: Color.fromRgba(0, 255, 255)
    };

    const svg = LineRenderer(lineProps);
    expect(svg).toBeNull();
  });
});
