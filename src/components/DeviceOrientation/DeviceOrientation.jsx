import { useEffect, useState, useRef } from "react";
import useGlobalEvent from "beautiful-react-hooks/useGlobalEvent";
import useMouseEvents from "beautiful-react-hooks/useMouseEvents";
import useWindowResize from "beautiful-react-hooks/useWindowResize";
// import useThrottledCallback from "beautiful-react-hooks/useThrottledCallback";

import styles from "./DeviceOrientation.module.scss";

function DeviceOrientation() {
  const [deviceOrientation, setDeviceOrientation] = useState();
  const onDeviceOrientation = useGlobalEvent("deviceorientation");
  const [isGyroSupported, setIsGyroSupported] = useState(false);

  const initialCoordinates = [0, 0];
  const initialDelta = [0, 0];
  const [coordinates, setCoordinates] = useState(initialCoordinates);
  const [delta, setDelta] = useState(initialDelta);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const ref = useRef();
  const { onMouseMove } = useMouseEvents(ref);

  useEffect(() => {
    if (typeof window !== undefined) {
      const supported = window.DeviceOrientationEvent;
      if (supported) {
        setIsGyroSupported(true);
      }
    }
  }, []);

  onDeviceOrientation((event) => {
    // if (isGyroSupported) {
    setDeviceOrientation(event);
    // }
  });

  onMouseMove((event) => {
    // if (!isGyroSupported) {
    const nextCoords = [event.clientX, event.clientY];
    const nextDeltas = [event.movementX, event.movementY];
    setCoordinates(nextCoords);
    setDelta(nextDeltas);
    // }
  });

  useWindowResize((event) => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  });

  const xMouse = coordinates[0] / width;
  const yMouse = coordinates[1] / height;

  const xGyro = deviceOrientation?.beta ? Math.abs(deviceOrientation?.beta) : 0;
  const yGyro = deviceOrientation?.gamma
    ? Math.abs(deviceOrientation?.gamma)
    : 0;

  const xValue = xGyro || xMouse;
  const yValue = yGyro || yMouse;

  return (
    <section
      className={styles.outer}
      style={{
        "--coordinates-x": `${(xValue / width) * 100}%`,
        "--coordinates-y": `${(yValue / height) * 100}%`,
        "--delta-x": `${(delta[0] / 360) * 100}deg`,
        "--delta-y": `${(delta[1] / 360) * 100}deg`,
        // "--delta-x": `${Math.abs(delta[0] / 360) * 100}deg`,
        // "--delta-y": `${Math.abs(delta[1] / 360) * 100}deg`
      }}
      ref={ref}
    >
      {/* <div className={styles.inner} /> */}

      <p>
        Current orientation:
        <code>{deviceOrientation?.alpha}</code>
        <code>{deviceOrientation?.beta}</code>
        <code>
          {deviceOrientation?.gamma} / {yGyro}
        </code>
      </p>

      <p>
        Coordinates:
        <code>
          x {coordinates[0]} / y {coordinates[1]}
        </code>
      </p>

      <p>
        Coordinates:
        <code>
          x {xValue} / y {yValue}
        </code>
      </p>
    </section>
  );
}

export default DeviceOrientation;
