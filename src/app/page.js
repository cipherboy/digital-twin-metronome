"use client";

import dynamic from "next/dynamic";
import React from "react";

import Metronome from "./metronome.js";


const App = ({ Component, pageProps }) => {
  return <Metronome {...pageProps} />;
};

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
