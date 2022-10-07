import { useEffect, useState, useRef } from "react";
import useGlobalEvent from "beautiful-react-hooks/useGlobalEvent";
import useMouseEvents from "beautiful-react-hooks/useMouseEvents";
import useWindowResize from "beautiful-react-hooks/useWindowResize";
import useThrottledCallback from "beautiful-react-hooks/useThrottledCallback";

import { constrainToRange } from "./helpers";

import styles from "./DeviceOrientation.module.scss";

function DeviceOrientation() {
  const [deviceOrientation, setDeviceOrientation] = useState();
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

  const xMouse = (coordinates[0] / width) * 100;
  const yMouse = (coordinates[1] / height) * 100;

  const degreesMax = 90;
  // range: [-180, 180]
  const xGyro = deviceOrientation?.gamma
    ? (deviceOrientation?.gamma / degreesMax) * 100
    : 0;
  // range: [-90, 90]
  const yGyro = deviceOrientation?.beta
    ? (deviceOrientation?.beta / degreesMax) * 100
    : 0;

  const xValue = Math.abs(constrainToRange(xGyro, -100, 100)) || xMouse;
  const yValue = Math.abs(constrainToRange(yGyro, -100, 100)) || yMouse;

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
        <code>{deviceOrientation?.rotationRate?.alpha}</code>
        <code>
          {deviceOrientation?.rotationRate?.beta} / {xGyro}
        </code>
        <code>
          {deviceOrientation?.rotationRate?.gamma} / {yGyro}
        </code>
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
      </p>
    </section>
  );
}

export default DeviceOrientation;
