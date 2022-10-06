import React, { useEffect, useState } from "react";

function Tilter() {
  const [granted, setGranted] = useState(false);
  const [requiresPermission, setRequiresPermission] = useState(false);

  const handleClick = async (event) => {
    const response = await DeviceOrientationEvent.requestPermission();
    setGranted(response === "granted");
  };

  useEffect(() => {
    if (typeof window !== undefined) {
      const needsPermission =
        typeof DeviceOrientationEvent.requestPermission === "function";
      if (needsPermission) {
        setRequiresPermission(true);
      }
    }
  }, []);

  return (
    <>
      {requiresPermission && (
        <button type="button" onClick={handleClick}>
          Request
        </button>
      )}
      <p>Requires is {requiresPermission.toString()}</p>
      <p>Permission is {granted.toString()}</p>
    </>
  );
}

export default Tilter;
