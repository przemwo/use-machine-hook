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
    effect: ({ msg }) => {
      setTimeout(() => {
        msg("open");
      }, 500);
    },
    done: {
      open: "open",
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
    effect: ({ msg }) => {
      setTimeout(() => {
        msg("close");
      }, 500);
    },
    done: {
      close: "closed",
    },
  },
};

const useMachine = (state) => {
  const [current, setCurrent] = useState(state.initial);

  const msg = useCallback((msg, canTransition = () => true) => {
    if (!canTransition()) return;
    if (state[current].on[msg]) {
      setCurrent(state[current].on[msg])
    } else if (state[current].done[msg]) {
      setCurrent(state[current].done[msg]);
    }
  }, [current, state]);

  useEffect(() => {
    let canTransition = true;
    state[current].effect && state[current].effect({ msg: (m) => msg(m, () => canTransition) });
    return () => canTransition = false;
  }, [current, state, msg]);

  return { current, msg };
};

export const App = () => {
  const machine = useMachine(toggleState);
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