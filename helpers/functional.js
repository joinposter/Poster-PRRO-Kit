import { pipe } from "ramda";

const asyncPipe =
  (...fns) =>
  (arg) =>
    fns.reduce((p, f) => p.then(f), Promise.resolve(arg));

export { pipe, asyncPipe };
