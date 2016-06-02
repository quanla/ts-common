export default class StringUtil {

    static uppercaseFirstChar(str:string) {
        return str.substring(0, 1).toUpperCase() + str.substring(1, str.length);
    }
    static uppercaseOnlyFirstChar(str:string) {
        return str.substring(0, 1).toUpperCase() + str.substring(1, str.length).toLowerCase();
    }
    static isBlank(val:string) {
        if ((typeof val) == "string") {
            return val==null || val.replace(/\s/g, "").length == 0;
        } else {
            return val == null;
        }
    }
    static isEmpty(val:string) {
        return val==null || val == '';
    }

    static isNotEmpty(val:string) {
        return !StringUtil.isEmpty(val);
    }
    static isNotBlank(val:string) {
        return !StringUtil.isBlank(val);
    }

    static getLastWord(str:string) {
        return /\b\w+$/.exec(str)[0];
    }
    static startsWith(target:string, str:string) {
        if (str == null || str.length < target.length) {
            return false;
        }
        return str.substring(0, target.length) == target;
    }
    static endsWith(target:string, str:string) {
        if (str == null || str.length < target.length) {
            return false;
        }
        return str.substring(str.length - target.length) == target;
    }

    static trim(val:string) {
        if (!val) {
            return null;
        }

        return val.replace(/^\s+/, "").replace(/\s+$/, "");
    }

    static replaceAll(from:string, to:string, src:string) {

        function escapeRegExp(string) {
            return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        }

        return src.replace(new RegExp(escapeRegExp(from), "g"), to);
    }

    static equalsIgnoreCase(s1:string, s2:string) {
        if (s1 == null) {
            return s2 == null;
        }
        if (s2 == null) {
            return false;
        }

        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();
        return s1 == s2;
    }

    static randomId(length:number) {
        var possible1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        var possible2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        var text = possible1.charAt(Math.floor(Math.random() * possible1.length));
        for ( var i=0; i < length-1; i++ ) {
            text += possible2.charAt(Math.floor(Math.random() * possible2.length));
        }
        return text;
    }
}
