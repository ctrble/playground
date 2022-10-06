import { useState } from "react";
import useGlobalEvent from "beautiful-react-hooks/useGlobalEvent";

function TestComponent() {
  const [granted, setGranted] = useState(false);
  const [deviceOrientation, setDeviceOrientation] = useState();
  const [deviceMotion, setDeviceMotion] = useState();
  const onDeviceOrientation = useGlobalEvent("deviceorientation");
  const onDeviceMotion = useGlobalEvent("devicemotion");

  onDeviceOrientation((event) => {
    console.log(event);
    setDeviceOrientation(event);
  });

  onDeviceMotion((event) => {
    console.log(event);
    setDeviceMotion(event);
  });

  const handleClick = (event) => {
    DeviceMotionEvent.requestPermission()
      .then((response) => {
        if (response == "granted") {
          setGranted(true);
          // window.addEventListener("devicemotion", (e) => {
          //   // do something with e
          // });
        }
      })
      .catch(console.error);
  };

  return (
    <p>
      <button type="button" onClick={handleClick}>
        Request
      </button>
      {granted}
      Current window width:
      {deviceOrientation && JSON.parse(deviceOrientation)}
      {deviceMotion && JSON.parse(deviceMotion)}
    </p>
  );
}

export default TestComponent;
