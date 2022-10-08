import Head from "next/head";
import dynamic from "next/dynamic";

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
    <Tilter>
      <DeviceOrientation>
        <p>hello</p>
      </DeviceOrientation>
    </Tilter>
  );
}
