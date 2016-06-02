
export default class RegexUtil {

    static each(exp, str, func) {

        var regExp = typeof exp == "object" ? exp : new RegExp(exp, "g");
        for (var match;(match=regExp.exec(str)) != null;) {
            func(match);
        }
    }
    static replaceAll(str, exp, replace) {

        if (typeof replace == "string") {
            var replaceStr = replace;
            replace = function(m) {
                return RegexUtil.replaceAll(replaceStr, "\\$(\\d+)", function(m1) {
                    return m[1*m1[1]];
                });
            };
        }

        var index = 0;
        var regExp = new RegExp(exp, "g");
        var ret = "";
        for (var m; (m = regExp.exec(str)) != null;) {
            if (m.index > index) {
                ret+=str.substring(index, m.index);
            }
            //str.substring(0, m.index);

            ret += replace(m);

            index = m.index + m[0].length;
        }

        if (index < str.length) {
            ret += str.substring(index);
        }
        return ret;
    }

    static escape(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
}
