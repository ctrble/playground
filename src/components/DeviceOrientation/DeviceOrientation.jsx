import { useState, useRef } from "react";
import useGlobalEvent from "beautiful-react-hooks/useGlobalEvent";
import useMouseEvents from "beautiful-react-hooks/useMouseEvents";
import useWindowResize from "beautiful-react-hooks/useWindowResize";
import useThrottledCallback from "beautiful-react-hooks/useThrottledCallback";
import classNames from "classnames";

import { constrainToRange } from "./helpers";

import styles from "./DeviceOrientation.module.scss";

function DeviceOrientation({ children }) {
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
  const deltaMouse = ((delta[0] + delta[1]) / 360) * 100;

  // set a max since we won't look at it upside down
  const xDegreesMax = 90;
  const yDegreesMax = 90;

  // around x axis is beta: [-180, 180]
  // around y axis is gamma: [-90, 90]
  // around z axis is alpha: [0, 360]

  // remap x to y because of angle around vs angle towards
  const xTiltAngle = deviceOrientation?.gamma;
  const yTiltAngle = deviceOrientation?.beta;
  const zTiltAngle = deviceOrientation?.alpha;

  // get percentage
  const xTiltPercent = (xTiltAngle / xDegreesMax) * 100;
  const yTiltPercent = (yTiltAngle / yDegreesMax) * 100;

  // recenter the angles
  // might not need with deviceOrientation.absolute
  const xTiltOffset = Math.abs(
    constrainToRange(xTiltPercent + xDegreesMax / 2, -100, 100)
  );
  const yTiltOffset = Math.abs(
    constrainToRange(yTiltPercent + yDegreesMax / 2, -100, 100)
  );

  // fallback to 0 if there's no data
  const xTilt = xTiltAngle ? xTiltOffset : 0;
  const yTilt = yTiltAngle ? yTiltOffset : 0;
  const zTilt = zTiltAngle ? zTiltAngle : 0;

  // offset the tilt by half to make the middle neutral
  const xValue = Math.round(xTilt) || xMouse;
  const yValue = Math.round(yTilt) || yMouse;
  const zValue = Math.round(zTilt) || deltaMouse;

  return (
    <section
      className={styles.wrapper}
      style={{
        "--coordinates-x": `${xValue}%`,
        "--coordinates-y": `${yValue}%`,
        "--degrees-z": `${zValue}deg`,
      }}
      ref={ref}
    >
      {children}
      {/* <div className={styles.mask}>
        <div className={styles.horizontal}>
          <div className={styles.vertical}>
            <div className={styles.turn}>{children}</div>
          </div>
        </div>
      </div> */}
      {/* <div className={styles.horizontal} />
        <div className={styles.vertical} />
        <div className={styles.turn} /> */}
      {/* <div className={styles.glare} /> */}
    </section>
  );
}

export default DeviceOrientation;
