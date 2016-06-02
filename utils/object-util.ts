import Cols from "./cols";

export default class ObjectUtil {

    static equals (o1, o2) {
        if (o1 == null) {
            return o2 == null;
        }

        if (o2 == null) {
            return false;
        }

        if ((typeof o1) != (typeof o2)) {
            return false;
        }

        if (typeof o1 != "object") {
            return o1 == o2;
        }

        if (o1.length != o2.length) {
            return false;
        }

        for (var i in o1) {
            if (typeof i == "string" && i[0] == "$") {
                continue;
            }
            if (!this.equals(o1[i], o2[i])) {
                //console.log("Different: " + i);
                return false;
            }
        }
        for (var i in o2) {
            if (typeof i == "string" && i[0] == "$") {
                continue;
            }
            if (!this.equals(o1[i], o2[i])) {
                //console.log("Different: " + i);
                return false;
            }
        }

        return true;
    }

    static copy(fromO, toO) {
        for (var name in fromO) {
            toO[name] = fromO[name];
        }
        return toO;
    }


    static isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return true;
    }

    static clone(obj) {
        if (obj == null
            || typeof obj != "object"
        ) {
            return obj;
        } else if (obj.length == null) {
            var ret = {};
            for ( var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    ret[i] = this.clone(obj[i]);
                }
            }
            return ret;
        } else {
            var retArr = [];
            for (var j = 0; j < obj.length; j++) {
                retArr[j] = ObjectUtil.clone(obj[j]);
            }
            return retArr;
        }
    }

    static clear(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                delete obj[prop];
            }
        }
    }
    static hasValue(o) {
        if (o == null) {
            return false;
        }
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                return true;
            }
        }
        return false;
    }
    static toStringLines(o) {
        if (o == null) {
            return "null";
        }
        return Cols.join(Cols.yield(o, function(i) { return JSON.stringify(i);}), "\n");
    }
}