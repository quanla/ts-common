import Cols from "./cols"

export default class Fs {

    static p0(p1, a) {
        return function() {
            p1(a);
        }
    }
    static noop(ret?) {
        return function() {
            return ret;
        }
    }
    static f0(f1, a) {
        return function() {
            return f1(a);
        }
    }

    static invokeAll(funcs, data1?, data2?, data3?) {
        for (var i in funcs) {
            funcs[i](data1, data2, data3);
        }
    }
    static invokeWithEach(list, func) {
        for (var i in list) {
            func(list[i]);
        }
    }

    static invokeAllF(col) {
        return function() {
            Cols.each(col, function(f) { f(); });
        };
    }

    static invokeChecks(funcs, data) {
        for (var i in funcs) {
            if (funcs[i](data)) {
                return true;
            }
        }
        return false;
    }

    static cache(f0) {
        var invoked = false;
        var cachedData = null;
        return function() {
            if (!invoked) {
                cachedData = f0();
                invoked = true;
            }

            return cachedData;
        };
    }

    static sequel (fs) {
        return function() {
            for (var i in fs) {
                fs[i]();
            }
        };
    }

    static tail0(func, a, b) {
        return function() {
            return func(a, b);
        };
    }
    static tail1(func, b, c) {
        return function(a) {
            return func(a, b, c);
        };
    }
    static tail2(func, c, d) {
        return function(a, b) {
            return func(a, b, c, d);
        };
    }

    static invoke(func) {
        if ((typeof func) == "function") {
            return func();
        } else {
            return func;
        }
    }
}