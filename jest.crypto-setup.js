Object.defineProperty(global, "crypto", {
  value: {
    subtle: {
      digest: () =>
        new Promise((resolve) => {
          // eslint-disable-next-line no-magic-numbers
          resolve(new Uint8Array(32).fill(0x11).buffer);
        }),
    },
  },
});
