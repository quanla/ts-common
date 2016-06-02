export default class LangUtil {

    static booleanValue(o) {
        if (o == null) {
            return false;
        }

        if (o == false || o == true) {
            return o;
        }

        if (typeof o == "string") {
            return o != "false";
        }

        return true;
    }
    static toNum(o) {
        if (o == null) {
            return null;
        }

        return o * 1;
    }
}