import Head from "next/head";
import dynamic from "next/dynamic";

const DynamicTest = dynamic(() => import("src/components/TestComponent"), {
  ssr: false,
});

import ParallaxTilt from "src/components/ParallaxTilt";
import Tilter from "src/components/Tilter";

import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      {/* <ParallaxTilt /> */}
      <Tilter />
    </>
  );
}
