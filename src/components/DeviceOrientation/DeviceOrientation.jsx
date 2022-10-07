import { useEffect, useState, useRef } from "react";
import useGlobalEvent from "beautiful-react-hooks/useGlobalEvent";
import useMouseEvents from "beautiful-react-hooks/useMouseEvents";
import useWindowResize from "beautiful-react-hooks/useWindowResize";
import useThrottledCallback from "beautiful-react-hooks/useThrottledCallback";

import { constrainToRange } from "./helpers";

import styles from "./DeviceOrientation.module.scss";

function DeviceOrientation() {
  const initialOrientation = {
    alpha: 0,
    beta: 0,
    gamma: 0,
  };
  const [deviceOrientation, setDeviceOrientation] =
    useState(initialOrientation);
  const onDeviceOrientation = useGlobalEvent("deviceorientation");

  const initialCoordinates = [0, 0];
  const initialDelta = [0, 0];
  const [coordinates, setCoordinates] = useState(initialCoordinates);
  const [delta, setDelta] = useState(initialDelta);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const ref = useRef();
  const { onMouseMove } = useMouseEvents(ref);
  const onWindowResize = useWindowResize();

  onDeviceOrientation(
    useThrottledCallback(
      (event) => {
        setDeviceOrientation(event);
      },
      [],
      25
    )
  );

  onMouseMove(
    useThrottledCallback(
      (event) => {
        const nextCoords = [event.clientX, event.clientY];
        const nextDeltas = [event.movementX, event.movementY];
        setCoordinates(nextCoords);
        setDelta(nextDeltas);
        console.log("next", nextCoords);
      },
      [],
      25
    )
  );

  onWindowResize(
    useThrottledCallback((event) => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    })
  );

  // create a percentage based on window size for mouse movement
  const xMouse = (coordinates[0] / width) * 100;
  const yMouse = (coordinates[1] / height) * 100;

  // set a max since we won't look at it upside down
  const degreesMax = 90;

  // around x axis is beta: [-180, 180]
  // around y axis is gamma: [-90, 90]
  // around z axis is alpha: [0, 360]
  // remap x to y because of angle around vs angle towards
  const xTiltAngle = deviceOrientation?.gamma;
  const yTiltAngle = deviceOrientation?.beta;
  const zTiltAngle = deviceOrientation?.alpha;

  // get percentage
  const xTiltPercent = (xTiltAngle / degreesMax) * 100;
  const yTiltPercent = (yTiltAngle / degreesMax) * 100;
  const zTiltPercent = (zTiltAngle / degreesMax) * 100;

  // recenter the angles
  // might not need with deviceOrientation.absolute
  const xTiltOffset = Math.abs(
    constrainToRange(xTiltPercent + degreesMax / 2, -100, 100)
  );
  const yTiltOffset = Math.abs(
    constrainToRange(yTiltPercent + degreesMax / 2, -100, 100)
  );
  const zTiltOffset = Math.abs(
    constrainToRange(zTiltPercent + degreesMax / 2, -100, 100)
  );

  // fallback to 0 if there's no data
  const xTilt = xTiltAngle ? xTiltOffset : 0;
  const yTilt = yTiltAngle ? yTiltOffset : 0;
  const zTilt = zTiltAngle ? zTiltOffset : 0;

  // offset the tilt by half to make the middle neutral
  const xValue = xTilt || xMouse;
  const yValue = yTilt || yMouse;
  const zValue = zTilt || 0;

  return (
    <section
      className={styles.outer}
      style={{
        "--coordinates-x": `${xValue}%`,
        "--coordinates-y": `${yValue}%`,
        "--delta-x": `${(delta[0] / 360) * 100}deg`,
        "--delta-y": `${(delta[1] / 360) * 100}deg`,
        // "--delta-x": `${Math.abs(delta[0] / 360) * 100}deg`,
        // "--delta-y": `${Math.abs(delta[1] / 360) * 100}deg`
      }}
      ref={ref}
    >
      <div className={styles.vertical} />

      <p>
        Current orientation:
        <br />
        <code>alpha raw {deviceOrientation?.alpha}</code>
        <br />
        <code>z tilt {zTilt}</code>
        <hr />
        <code>beta raw {deviceOrientation?.beta}</code>
        <br />
        <code>x tilt {xTilt}</code>
        <hr />
        <code>gamma raw {deviceOrientation?.gamma}</code>
        <br />
        <code>y tilt {yTilt}</code>
      </p>

      <p>
        Coordinates:
        <br />
        <code>
          x {coordinates[0]} / y {coordinates[1]}
        </code>
      </p>

      <p>
        Output:
        <br />
        <code>xValue {xValue}%</code>
        <br />
        <code>yValue {yValue}%</code>
        <br />
        <code>zValue {zValue}%</code>
      </p>
    </section>
  );
}

export default DeviceOrientation;
