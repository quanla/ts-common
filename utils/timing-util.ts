export default class TimingUtil {

    static syncDelay(f, delay) {
        delay = delay || 1000;

        var globalInterrupted = null;
        return function() {
            if (globalInterrupted) {
                globalInterrupted[0] = true;
            }
            var interrupted = [false];
            globalInterrupted = interrupted;
            setTimeout(function() {
                if (!interrupted[0]) {
                    f();
                }
            }, delay);
        };
    }
    static repeativeCallLock(f, delay) {
        delay = delay || 1000;

        var lockUntil = null;
        return function() {
            var now = new Date().getTime();
            if (lockUntil != null && lockUntil > now) {
                return;
            }
            lockUntil = now + delay;
            f();
        };
    }
}