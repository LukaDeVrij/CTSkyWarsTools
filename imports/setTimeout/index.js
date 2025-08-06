const Runnable = Java.type("java.lang.Runnable");
const Executors = Java.type("java.util.concurrent.Executors");
const TimeUnit = Java.type("java.util.concurrent.TimeUnit");

const timers = [];

const scheduler = Executors.newSingleThreadScheduledExecutor();

console.log("setTimeout module loaded");

/**
 * @typedef {any} ScheduledFuture
 */

/**
 *
 * @param {(...args: any[]) => void} callback
 * @param {number} delay delay in ms
 * @param  {...any=} args args to be passed to the callback
 * @returns {ScheduledFuture}
 */
const setInterval = (callback, delay, ...args) => {
  args ??= [];

  const timer = scheduler.scheduleAtFixedRate(
    new JavaAdapter(Runnable, {
      run: () => callback(...args),
    }),
    delay,
    delay,
    TimeUnit.MILLISECONDS
  );
  timers.push(timer);
  return timer;
};

/**
 *
 * @param {(...args: any[]) => void} callback
 * @param {number} delay delay in ms
 * @param  {...any=} args args to be passed to the callback
 * @returns {ScheduledFuture}
 */
let setTimeout = (callback, delay, ...args) => {
  args ??= [];

  const timer = scheduler.schedule(
    new JavaAdapter(Runnable, {
      run: () => callback(...args),
    }),
    delay,
    TimeUnit.MILLISECONDS
  );
  timers.push(timer);
  return timer;
};

const cancelFuture = (timer) => timer.cancel(true);

/**
 *
 * @param {ScheduledFuture} timer
 * @returns {void}
 */
const clearTimeout = (timer) => cancelFuture(timer);

/**
 *
 * @param {ScheduledFuture} timer
 * @returns {void}
 */
const clearInterval = (timer) => cancelFuture(timer);

export { setInterval, setTimeout, clearInterval, clearTimeout };

register("gameUnload", () => {
  timers.forEach(cancelFuture);
  timers.length = 0;
});
