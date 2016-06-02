import Cols from "./cols";
import Fs   from "./fs";

export var Http = Http || {};
Http.afterSharp = function() {
    var href = window.location.href;
    var index = href.indexOf("#");
    if (index == -1) {
        return null;
    }
    return href.substring(index + 1);
};

export var Async = Async || {};

Async.createLazyExec = function(delay) {
    var timeout;
    return function(task) {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(task, delay);
    }
};
Async.rapidCallAbsorber = function(targetFunc, duration) {
    duration = duration || 100;

    var timeout;
    return function(p1, p2) {
        if (timeout) {
            return;
        }
        timeout = setTimeout(function() {
            targetFunc(p1, p2);
            timeout = null;
        }, duration);
    }
};

/**
 * Once scheduled, it's fixed, can not reschedule until it's done
 * @param func
 * @returns {Function}
 */
Async.schedule = function(func) {
    var oldScheduleTime;
    var timeout;

    var invoke = function() {
        func();
        timeout = null;
        oldScheduleTime = null;
    };

    return function(delay) {
        var scheduledTime = new Date().getTime() + delay;

        if (oldScheduleTime != null && Math.abs(oldScheduleTime - scheduledTime) < 100) {
            // Scheduled at that time, no need to redo
            return;
        }

        timeout = setTimeout(invoke, delay);

        oldScheduleTime = scheduledTime;
    };
};


///**
// * After scheduled, can cancel or reschedule, only run once
// * @param func
// * @returns {Function}
// */
//Async.scheduleFlex1 = function(func) {
//    var timeout;
//    var ran = false;
//
//    var invoke = function () {
//        func();
//        ran = true;
//    };
//
//    var schedule = function(delay) {
//        if (ran) { return; }
//
//        if (timeout) {
//            clearTimeout(timeout);
//        }
//
//        if (!delay) {
//            invoke();
//        } else {
//            timeout = setTimeout(invoke, delay);
//        }
//
//    };
//
//    schedule.cancel = function() {
//        if (timeout) {
//            clearTimeout(timeout);
//            timeout = null;
//        }
//    };
//
//    return schedule;
//};



Async.ladyFirst = function() {
    var afterLadyDone = [];
    var freeToGo = false;
    return {
        ladyDone: function() {
            freeToGo = true;
            if (Cols.isNotEmpty(afterLadyDone)) {
                Fs.invokeAll(afterLadyDone);
                afterLadyDone = [];
            }
        },
        manTurn: function(func) {
            if (freeToGo) {
                func();
            } else {
                afterLadyDone.push(func);
            }
        }
    };
};

/**
 * @return checkF(checkIndex);
 */
Async.runWhenAllChecked = function(checkCount, func) {
    var flags = new Array(checkCount);
    for (var i=0;i<checkCount;i++) {
        flags[i] = false;
    }
    return function(chechIndex) {
        flags[chechIndex] = true;

        for (var i=0;i<checkCount;i++) {
            if (flags[i] == false) {
                return;
            }
        }

        func();
    }
};

Async.runAfterCount= function(checkCount, func) {
    return function(chechIndex) {
        checkCount --;

        if (checkCount <= 0) {
            func();
        }
    }
};

/**
 * func(quantity) => interrupted
 * @param func
 */
Async.incrementalRepeater = function(func) {
    var quantityFF = function() {
        var i = 0;
        var array = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
        return function() {
            i++;
            return array[Math.min(Math.floor(i / 10), array.length-1)];
        }
    };

    var createRunner = function() {

        var sleepTimeF = Cols.toEnd([400, 300, 300, 300, 200, 200, 100]);
        var quantityF = quantityFF();
        var alive = true;
        // Start
        var run = function() {
            if (!alive) {
                return;
            }
            var interrupted = func(quantityF());
            if (interrupted) {
                alive = false;
                return;
            }
            setTimeout(run, sleepTimeF());
        };
        run();

        return {
            stop: function() {
                alive = false;
            }
        };
    };
    var runner = null;
    return {
        start: function() {
            if (runner != null) {
                return;
            }
            runner = createRunner();
        },
        stop: function() {
            if (runner != null) {
                runner.stop();
                runner = null;
            }
        }
    };
};

/**
 * checkF(val, stillValid)
 * @return invoke(val)
 */
Async.lazyValidate = function(startF, checkF) {
    var validating = [null];
    return function(val) {
        if (val == null) {
            alert("Async.lazyValidate: Not support null value");
            return;
        }
        var thisValidate = [val];
        if (validating[0] != null) {
            if (validating[0][0] == val) {
                // This val is being validated (not done)
                return;
            }
            validating[0][0] = null;
        }
        validating[0] = thisValidate;
        var stillValid = function() {
            return thisValidate[0] != null;
        };

        startF();
        setTimeout(function() {
            if (!stillValid()) {
                return;
            }
            checkF(val, stillValid);
        }, 500);
    }
};

export var EmailUtil = EmailUtil || {};
EmailUtil.validEmail = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

export var RandomUtil = RandomUtil || {};
RandomUtil.choose = function(list) {
    return list[Math.floor(Math.random() * list.length)];
};

export var MathUtil = MathUtil||{};
MathUtil.incMap = function(key, map) {
    var value = map[key];
    if (value == null) {
        map[key] = 1;
    } else {
        map[key]++;
    }
};


export var Watchers = Watchers || {};
Watchers.watcher = function(onChange) {
    var oldValue;
    return function(currentValue) {
        if (currentValue != oldValue) {
            onChange(currentValue);
            oldValue = currentValue;
        }
    }
};

export var RangeUtil = RangeUtil || {};
RangeUtil.inside = function(pos, ranges) {
    return Cols.hasAny(ranges, function(r) {
        return (pos > r.from && pos < r.to);
    });
};
RangeUtil.rangeTouch = function(r1, r2) {
    return !(r1.to <= r2.from || r1.from >= r2.to);
};
RangeUtil.length = function(range) {
    return range.to - range.from;
};




