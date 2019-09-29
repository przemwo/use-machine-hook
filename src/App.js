import React, { useState, useEffect, useCallback } from 'react';


const toggleState = {
  initial: "closed",
  closed: {
    on: {
      open: "opening",
    }
  },
  opening: {
    on: {
      close: "closing",
    },
    effect: {
      src: "fooEffect",
      done: "open",
    },
  },
  open: {
    on: {
      close: "closing",
    }
  },
  closing: {
    on: {
      open: "opening",
    },
    effect: {
      src: "fooEffect",
      done: "closed",
    },
  },
};

const useMachine = (state, { effects } = {}) => {
  const [current, setCurrent] = useState(state.initial);

  const msg = useCallback(
    (msg) => state[current].on[msg] && setCurrent(state[current].on[msg]),
    [current, state]
  );

  const done = useCallback(
    (canTransition = () => true) => canTransition() && setCurrent(state[current].effect.done),
    [current, state]
  );
  
  useEffect(() => {
    let canTransition = true;
    state[current].effect && effects[state[current].effect.src] && effects[state[current].effect.src]({ done: () => done(() => canTransition) });
    return () => canTransition = false;
  }, [current, state, done, effects]);

  return { current, msg };
};

export const App = () => {

  const fooEffect = ({ done }) => {
    setTimeout(() => {
      done();
    }, 500);
  };

  const machine = useMachine(toggleState, {
    effects: { fooEffect }
  });
  console.log('current: ', machine.current)
  return(
    <div>
      <h1>Current state: {machine.current}</h1>
      <button
        onClick={() => machine.msg("open")}
        disabled={machine.current === "open" || machine.current === "opening"}
      >
        Open
      </button>
      <button
        onClick={() => machine.msg("close")}
        disabled={machine.current === "closed" || machine.current === "closing"}
      >
        Close
      </button>
    </div>
  );
};