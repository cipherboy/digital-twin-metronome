"use client";

import React, { useState } from "react";
import * as Tone from "tone";

function handleSetBPM(setBPM, newValue) {
  if (newValue < 16 || newValue > 256) {
    return;
  }

  setBPM(newValue)
}

async function handleSetPlaying(setPlaying, playing, bpm) {
  setPlaying(playing);
  if (!playing) {
    return;
  }

  let synth = new Tone.PolySynth(Tone.AMSynth).toDestination();

  /*let reverb = new Tone.Reverb(990.01);
  synth.connect(reverb);*/

  /*let volume = new Tone.Volume(10).toDestination();
  synth.connect(volume);*/

  // await Tone.loaded();

  Tone.Transport.bpm.value = bpm;
    Tone.Transport.timeSignature = [
      4,
      4,
    ];
    Tone.Transport.start();

  let offset = (60 / bpm);
  console.log(offset);
  for (let i = 0; i < 100; i++) {
    const now = Tone.now();
    synth.triggerAttackRelease(440*4, "1024n", now + (i * offset), 1);
    console.log("When?", now + (i * offset));
    // synth.triggerAttackRelease(440*2, "16n", now);
  }
}

function Metronome() {
  const [bpm, setBPM] = useState(60);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <div>
        <button
          className="border-blue-600 border-2 p-2"
          id="minus-10"
          type="button"
          onClick={(event) => handleSetBPM(setBPM, bpm - 10)}
        >
          -10
        </button>
        <button
          className="border-blue-600 border-2 p-2"
          id="minus-5"
          type="button"
          onClick={(event) => handleSetBPM(setBPM, bpm - 5)}
        >
          -5
        </button>
        <button
          className="border-blue-600 border-2 p-2"
          id="minus-2"
          type="button"
          onClick={(event) => handleSetBPM(setBPM, bpm - 2)}
        >
          -2
        </button>
        <input
          className="border-blue-600 border-2 p-2"
          id="bpm"
          type="number"
          value={ bpm }
          onChange={(event) => handleSetBPM(setBPM, event.target.value)}
        />
        <button
          className="border-blue-600 border-2 p-2"
          id="plus-2"
          type="button"
          onClick={(event) => handleSetBPM(setBPM, bpm + 2)}
        >
          +2
        </button>
        <button
          className="border-blue-600 border-2 p-2"
          id="plus-5"
          type="button"
          onClick={(event) => handleSetBPM(setBPM, bpm + 5)}
        >
          +5
        </button>
        <button
          className="border-blue-600 border-2 p-2"
          id="plus-10"
          type="button"
          onClick={(event) => handleSetBPM(setBPM, bpm + 10)}
        >
          +10
        </button>

      </div>
      <div>
        <button
          id="play"
          onClick={(event) => handleSetPlaying(setPlaying, !playing, bpm)}
        >
          { playing ? "Pause" : "Play" }
        </button>
      </div>
    </div>
  );
}

export default Metronome;
