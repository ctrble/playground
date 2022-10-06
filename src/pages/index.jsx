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

import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <Tilter>
      <DeviceOrientation />
    </Tilter>
  );
}