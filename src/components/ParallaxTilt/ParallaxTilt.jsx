import React, { useState } from "react";
import Tilt from "react-parallax-tilt";

function ParallaxTilt() {
  const [granted, setGranted] = useState(false);

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
    <>
      <button type="button" onClick={handleClick}>
        Request
      </button>
      {granted && (
        <Tilt
          gyroscope={true}
          // tileEnable={granted}
          tiltMaxAngleX={25}
          tiltMaxAngleY={25}
          tiltReverse={true}
          trackOnWindow={true}
        >
          <div style={{ height: "300px", backgroundColor: "darkgreen" }}>
            <h1>React Parallax Tilt 👀</h1>
          </div>
        </Tilt>
      )}
    </>
  );
}

export default ParallaxTilt;
