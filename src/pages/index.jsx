import Head from "next/head";
import dynamic from "next/dynamic";

import Card from "src/components/Card";

const DeviceOrientation = dynamic(
  () => import("src/components/DeviceOrientation"),
  {
    ssr: false,
  }
);

// import ParallaxTilt from "src/components/ParallaxTilt";
import Tilter from "src/components/Tilter";

export default function Home() {
  return (
    <>
      <Tilter>
        <DeviceOrientation>
          <Card />
        </DeviceOrientation>
      </Tilter>
    </>
  );
}
