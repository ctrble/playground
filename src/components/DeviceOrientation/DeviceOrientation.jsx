import { useState, useRef } from "react";
import useGlobalEvent from "beautiful-react-hooks/useGlobalEvent";

function DeviceOrientation() {
  const [deviceOrientation, setDeviceOrientation] = useState();
  const onDeviceOrientation = useGlobalEvent("deviceorientation");

  onDeviceOrientation((event) => {
    // console.log(event);
    setDeviceOrientation(event);
  });

  return (
    <p>
      Current orientation:
      <pre>{deviceOrientation?.alpha}</pre>
      <pre>{deviceOrientation?.beta}</pre>
      <pre>{deviceOrientation?.gamma}</pre>
    </p>
  );
}

export default DeviceOrientation;
