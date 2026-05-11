let done = false;
const cbs: Array<() => void> = [];

export function markLoaderDone() {
  if (done) return;
  done = true;
  cbs.splice(0).forEach((fn) => fn());
}

export function onLoaderDone(fn: () => void): () => void {
  if (done) { fn(); return () => {}; }
  cbs.push(fn);
  return () => {
    const i = cbs.indexOf(fn);
    if (i >= 0) cbs.splice(i, 1);
  };
}
