import ObjectUtil from "./object-util";

export default class Cols {

    static getSingle(col) {
        if (col == null) {
            return null;
        }
        for (var k in col) {
            return col[k];
        }
    }
    static getSingleKey(col) {
        if (col == null) {
            return null;
        }
        for (var k in col) {
            return k;
        }
    }

    static flatten(cols) {
        var ret = [];

        cols.forEach(function(e) {
            if (e.length && e.forEach) {
                ret = ret.concat(Cols.flatten(e));
            } else {
                ret.push(e);
            }
        });
        return ret;
    }
    static keepOldRefs(newCol, oldCol, by) {
        if (oldCol == null) {
            return newCol;
        }

        for (var i = 0; i < newCol.length; i++) {
            var newE = newCol[i];
            var oldE = Cols.find(oldCol, function(oldE) {
                return oldE[by] == newE[by];
            });
            if (oldE != null) {
                ObjectUtil.clear(oldE);
                ObjectUtil.copy(newE, oldE);
                newCol[i] = oldE;
            }
        }
        return newCol;
    }

    static sortByTiers(array, tiers) {
        function compare(v1, v2) {

            if (v1 == v2) {
                return null;
            }
            if (v1 == null) {
                return -1;
            }
            if (v2 == null) {
                return 1;
            }

            if (v1 > v2) {
                return 1;
            } else {
                return -1;
            }
        }


        array.sort(function (a, b) {
            for (var i = 0; i < tiers.length; i++) {
                var tier = tiers[i];
                if (tier.func == null) {
                    continue;
                }

                var v1 = tier.func(a);
                var v2 = tier.func(b);

                var comp = compare(v1, v2);

                if (comp==null) {
                    continue;
                }
                return (tier.desc ? -1 : 1) * comp;
            }
            return 0;
        });
    }




    static assureLength(length, col, createNew) {
        for (; col.length < length;) {
            col.push(createNew ? createNew() : null);
        }
        col.splice(length, col.length - length);
    }
    static values(map) {
        var ret = [];
        for ( var k in map) {
            ret.push(map[k]);
        }
        return ret;
    }

    //static length(obj) {
    //    var count = 0;
    //    for (var k in obj) {
    //        if (obj.hasOwnProperty(k) && obj[k] != null) {
    //            count++;
    //        }
    //    }
    //    return count;
    //}

    static find(col, func) {
        for (var i in col) {
            var e = col[i];
            if (func(e)) {
                return e;
            }
        }
        return null;
    }

    static hasAny(col, func) {
        return Cols.find(col, func) != null;
    }

    static findReverse(col, func) {
        for (var i = col.length - 1; i > -1; i--) {
            var e = col[i];

            if (func(e)) {
                return e;
            }
        }
        return null;
    }

    static findIndex(col,func){
        for(var i in col){
            var e = col[i];
            if(func(e)){
                return i;
            }
        }
        return null;
    }

    static yield(col, func) {
        var ret = Array.isArray(col) ? [] : {};
        for (var i in col) {
            var e = func(col[i]);
            if (e != null) {
                ret[i] = e;
            }
        }
        return ret;
    }
    static filter(col, func) {
        var ret = [];
        for (var i in col) {
            var e = col[i];
            if (func(e)) {
                ret.push(e);
            }
        }
        return ret;
    }
    static join(col, delimiter) {
        var ret = "";
        for (var i in col) {
            if (ret.length > 0) {
                ret += delimiter;
            }
            ret += col[i];
        }
        return ret;
    }
    static joinWrap(col, start, end) {
        return start + Cols.join(col, end + start) + end;
    }
    static merge(map1, map2) {
        for ( var k in map2) {
            map1[k] = map2[k];
        }
        return map1;
    }

    /**
     * Add from map1 to map2
     * @param map1
     * @param map2
     * @returns {*}
     */
    static mapAddAll(map1, map2) {
        for ( var k in map1) {
            if (map1.hasOwnProperty(k)) {
                map2[k] = map1[k];
            }
        }
        return map2;
    }

    static eachLine(/*final List<F>*/ steps, /*final P2<F,P1<N>>*/ digF, /*final List<N>*/ collecteds, /*final P1<List<N>>*/ resultF) {

        if (steps.length == 0) {
            resultF(collecteds);
            return;
        }

        var feed = steps[0];
        digF(feed, function(n) {
            var newCollecteds = Cols.copy(collecteds);
            newCollecteds.push(n);
            Cols.eachLine(steps.slice(1, steps.length), digF, newCollecteds, resultF);
        });
    }

    static each(col, p1) {
        for (var i = 0; i<col.length; i++) {
            p1(col[i]);
        }
    }

    static eachEntry(obj, p2) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                p2(key, obj[key]);
            }
        }
    }

    static split(col, max) {
        var ret = [];

        var buffer = [];
        for (var i = 0; i < col.length; i++) {
            var o = col[i];
            buffer.push(o);
            if ((i + 1) % max == 0) {
                ret.push(buffer);
                buffer = [];
            }
        }
        if (buffer.length > 0) {
            ret.push(buffer);
        }

        return ret;
    }

    /**
     * collect(ele, total)
     */
    static collect<T>(col, init: T, collect) {
        if (col==null) {
            return init;
        }
        var total = init;
        for (var i in col) {
            total = collect(col[i], total);
        }
        return total;
    }
    static sum(col, getNum) {
        return Cols.collect(col, 0, function(e, sum) {
            var val = (getNum ? getNum(e) : e);
            if (val == null) {
                return sum;
            }
            return val + sum;
        });
    }

    /**
     * p2<Element,P0 onDone>
     */
    static eachPar(col, p2) {
        Cols.eachPar1(0, col, p2);
    }
    static eachPar1(index, col, p2) {
        if (index >= col.length) {
            return;
        }

        p2(col[index], function() {
            Cols.eachPar1(index+1, col, p2);
        });
    }


    static indexOf(ele, col, colExtract) {
        if (col==null) {
            return -1;
        }
        for (var i = 0; i < col.length; i++) {
            if (colExtract(col[i]) == ele) {
                return i;
            }
        }
        return -1;
    }

    static indexUnique(col, by) {
        if (typeof by == "string") {
            var byAttr = by;
            by = function(ele) { return ele[byAttr];};
        }

        return Cols.collect(col, {}, function(ele, groups) {
            var key = by(ele);
            groups[key] = ele;
            return groups;
        });
    }

    static copy(arr1) {
        var ret = [];

        for (var i in arr1) {
            ret.push(arr1[i]);
        }
        return ret;
    }
    static eachChildRecursive(/*A*/ a,
                                       /*F1<A, Collection<A>>*/ digF,
                                       /*P1<A>*/ p1) {
        var col = digF(a);
        if (col==null) {
            return;
        }
        for (var childI in col) {
            var child = col[childI];
            p1(child);
            Cols.eachChildRecursive(child, digF, p1);
        }
    }

    static addList(key, value, maps) {
        var list = maps[key];
        if (list == null) {
            list = [];
            maps[key] = list;
        }
        list.push(value);

        return function() {
            Cols.remove(value, list);
        }
    }

    static isEmpty(col) {
        return col == null || col.length == 0;
    }

    static isNotEmpty(col) {
        return !Cols.isEmpty(col);
    }

    static addAll(from, to) {
        for (var i in from) {
            to.push(from[i]);
        }
    }

    static addAllSet(from, to) {
        for (var i = 0; i < from.length; i++) {
            var e = from[i];
            if (to.indexOf(e) == -1) {
                to.push(e);
            }
        }
    }

    static addAllSet_deepEquals(from, to) {
        F1:
            for (var i = 0; i < from.length; i++) {
                var e = from[i];

                for (var j = 0; j < to.length; j++) {
                    var te = to[j];
                    if (ObjectUtil.equals(e, te)) {
                        continue F1;
                    }
                }

                to.push(e);
            }
    }

    static addRemove(col, item) {
        col.push(item);
        return function() {
            col.splice(col.indexOf(item), 1);
        }
    }

    static toEnd(array) {
        var i = array.length + 1;
        return function() {
            if (i > 1) {
                i--;
            }
            return array[array.length-i];
        }
    }

    static remove(e, col) {
        var i = col.indexOf(e);
        if (i == -1) {
            return false;
        }
        col.splice(i, 1);
        return true;
    }

    static removeBy(col, f) {
        var removed = [];
        for (var j = 0; j < col.length; j++) {
            var obj = col[j];
            if (f(obj)) {
                col.splice(j, 1);
                j--;
                removed.push(obj);
            }
        }
        return removed;
    }
    static removeAll(col, list) {
        for (var i in col) {
            var item = col[i];
            var rowI = list.indexOf(item);

            if (rowI == -1) {
//            alert("Can not find");
                return;
            }
            list.splice(rowI, 1);
        }
    }

    static sortBy(byF) {
        if (typeof byF == "string") {
            var byAttr = byF;
            byF = function(ele) { return ele[byAttr];};
        }

        var nullGoLast = true;
        return function(rd1, rd2) {
            var by1 = byF(rd1);
            var by2 = byF(rd2);

            if (by1 == null) {
                return by2 == null ? 0 : (nullGoLast ? 1 : -1);
            } else if (by2 == null) {
                return nullGoLast ? -1 : 1;
            }

            if ((typeof by1) == "string" ) {
                if (by1 < by2)
                    return -1;
                if (by1 > by2)
                    return 1;
                return 0;
            }
            return by1 - by2;
        };
    }

    static index<T>(col:Array<T>, by, valueF?:(T)=>any) {
        if (typeof by == "string") {
            var byAttr = by;
            by = function(ele) { return ele[byAttr];};
        }

        return Cols.collect(col, {}, function(ele, groups) {
            var index = by(ele);
            var list = groups[index];
            if (list == null) {
                list = [];
                groups[index] = list;
            }
            list.push(valueF == null ? ele : valueF(ele));
            return groups;
        });
    }

    static reverseIndex(index) {
        var ret = {};

        for (var key in index) {
            var list = index[key];

            for (var i = 0; i < list.length; i++) {
                var value = list[i];

                var newList = ret[value];
                if (newList == null) {
                    newList = [];
                    ret[value] = newList;
                }
                newList.push(key);
            }
        }

        return ret;
    }

    static min(col, by) {
        if (typeof by == "string") {
            var byAttr = by;
            by = function(ele) { return ele[byAttr];};
        }
        var min = null;
        var minE = null;
        for (var i = 0; i < col.length; i++) {
            var e = col[i];
            var val = by(e);
            if (min == null || val < min) {
                min = val;
                minE = e;
            }
        }
        return minE;
    }
    static max(col, by) {
        if (typeof by == "string") {
            var byAttr = by;
            by = function(ele) { return ele[byAttr];};
        }

        var max = null;
        var maxE = null;
        for (var i = 0; i < col.length; i++) {
            var e = col[i];
            var val = by(e);
            if (max == null || val > max) {
                max = val;
                maxE = e;
            }
        }
        return maxE;
    }

    static group(col, by) {
        return Cols.values(Cols.index(col, by));
    }
    static arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;

        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.

        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }


    static addLists(cols) {
        var ret = [];
        for (var i = 0; i < cols.length; i++) {
            var col = cols[i];
            Cols.addAll(col, ret);
        }
        return ret;
    }

    static move(arr, pos, newPos){
        if( newPos === pos) return;

        var value = arr[pos];
        var dir ;

        if(pos > newPos){
            dir = -1;
        }else {
            dir = 1;
        }
        for(var i = pos; i != newPos; i += dir){
            arr[i] = arr[i + dir];
        }
        arr[newPos] = value;
    }

}