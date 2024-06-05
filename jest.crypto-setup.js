Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => "11111111-1111-1111-1111-111111111111",
  },
});
