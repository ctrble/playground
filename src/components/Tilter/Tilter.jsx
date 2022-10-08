import React, { useEffect, useState } from "react";

function Tilter({ children }) {
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

  const isReady = (requiresPermission && granted) || !requiresPermission;

  if (isReady) {
    return children;
  }

  return (
    <>
      {requiresPermission && (
        <button type="button" onClick={handleClick}>
          Request Permission
        </button>
      )}

      <p>Requires is {requiresPermission.toString()}</p>
      <p>Permission is {granted.toString()}</p>
    </>
  );
}

export default Tilter;
