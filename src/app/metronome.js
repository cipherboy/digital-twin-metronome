"use client";

import React, { useState, useEffect, useMemo, useReducer, useRef } from "react";
import * as Tone from "tone";

function Metronome() {
  const synthOpts = {
    harmonicity: 3,
    detune: 0,
    oscillator : {
      type: "sine",
    },
    envelope: {
      attack: 0.01,
      decay: 0,
      sustain: 1,
      release: 0.5,
    },
    modulation: {
      type: "square",
    },
    modulationEnvelope: {
      attack: 0.01,
      decay: 0,
      sustain: 1,
      release: 1,
    },
  };

  const [bpm, _setBPM] = useState(60);
  const [playing, _setPlaying] = useState(false);

  const [beats, _setBeats] = useState(4);
  const [subdiv, _setSubDiv] = useState(4);

  const [volume, _setVolume] = useState(0);
  const [muted, _setMuted] = useState(false);

  const synthVolumeRef = useRef(null);
  const synthRef = useRef(null);
  const metronomeCancelRef = useRef(null);

  function doMetronome(start) {
    console.log("doMetrnome", start, Tone.now());
    let offset = (60 / bpm);
    let now = start !== null ? start : Tone.now();
    let toneTime = now;
    let minTime = 10;
    while (true) {
      console.log("When?", now, toneTime);
      synthRef.current.triggerAttackRelease(440*4, "64n", toneTime, 1);
      toneTime += offset;
      if ((toneTime - now) > minTime) {
        break;
      }
      // synth.triggerAttackRelease(440*2, "16n", now);
    }

    metronomeCancelRef.current = setTimeout(doMetronome, ((toneTime - now)/2) * 1000, toneTime);
  }

  useEffect(() => {
    console.log("setting bpm &c", bpm, beats, subdiv)
    Tone.Transport.bpm.value = bpm;
    Tone.Transport.timeSignature = [
      beats,
      subdiv,
    ];
    Tone.Transport.start();
  }, [bpm, beats, subdiv]);

  function resetMetronome() {
    // Reset the synth, discard everything and recreate for next time.
    Tone.Transport.stop();
    Tone.Transport.position = 0;
    Tone.Transport.cancel();

    if (synthRef.current === null && synthVolumeRef.current === null) {
      return;
    }

    synthRef.current.dispose();
    synthVolumeRef.current.dispose();
    synthVolumeRef.current = null;
    synthRef.current = null;
    if (metronomeCancelRef.current !== null) {
      clearTimeout(metronomeCancelRef.current);
      metronomeCancelRef.current = null;
    }
  }

  useEffect(() => {
    if (synthVolumeRef.current === null) {
      return;
    }

    console.log("setting volume", volume, muted)
    synthVolumeRef.current.volume.value = muted ? -1000 : volume;
    synthVolumeRef.current.mute = muted;

    if (muted) {
      resetMetronome();
    } else {
      Tone.start();
    }
  }, [volume, muted]);

  function setBPM(newValue) {
    newValue = parseInt(newValue);
    console.log("setBPM called with", newValue);
    if (newValue < 16 || newValue > 256 || isNaN(newValue)) {
      return;
    }

    _setBPM(newValue)

    resetMetronome();
    setPlaying(playing);
  }

  async function setPlaying(shouldBePlaying) {
    _setPlaying(shouldBePlaying);

    if (!shouldBePlaying) {
      _setMuted(true);
      return;
    }

    console.log("starting metronome?");

    await Tone.start();
    synthVolumeRef.current = new Tone.Volume(volume).toDestination();
    synthRef.current = new Tone.Synth(synthOpts).connect(synthVolumeRef.current);

    _setMuted(false);
    doMetronome(null)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row">
        <button
          className="btn btn-xl btn-primary"
          id="minus-10"
          type="button"
          onClick={(event) => setBPM(bpm - 10)}
        >
          -10
        </button>
        <button
          className="btn btn-xl btn-primary"
          id="minus-5"
          type="button"
          onClick={(event) => setBPM(bpm - 5)}
        >
          -5
        </button>
        <button
          className="btn btn-xl btn-primary"
          id="minus-2"
          type="button"
          onClick={(event) => setBPM(bpm - 2)}
        >
          -2
        </button>
        <input
          className="input input-xl input-primary"
          id="bpm"
          type="number"
          value={ bpm }
          onChange={(event) => setBPM(event.target.value)}
          onInput={(event) => setBPM(event.target.value)}
        />
        <button
          className="btn btn-xl btn-primary"
          id="plus-2"
          type="button"
          onClick={(event) => setBPM(bpm + 2)}
        >
          +2
        </button>
        <button
          className="btn btn-xl btn-primary"
          id="plus-5"
          type="button"
          onClick={(event) => setBPM(bpm + 5)}
        >
          +5
        </button>
        <button
          className="btn btn-xl btn-primary"
          id="plus-10"
          type="button"
          onClick={(event) => setBPM(bpm + 10)}
        >
          +10
        </button>

      </div>
      <div className="flex flex-row">
        <button
          className="btn btn-xl btn-primary"
          id="play"
          onClick={(event) => setPlaying(!playing)}
        >
          { playing ? "Pause" : "Play" }
        </button>
      </div>
    </div>
  );
}

export default Metronome;
