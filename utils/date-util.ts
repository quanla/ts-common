export default class DateUtil {

    static SECOND_LENGTH = 1000;
    static MINUTE_LENGTH = 60 * DateUtil.SECOND_LENGTH;
    static HOUR_LENGTH = 60 * DateUtil.MINUTE_LENGTH;
    static DAY_LENGTH = 24 * DateUtil.HOUR_LENGTH;
    static YEAR_LENGTH = 365 * DateUtil.DAY_LENGTH;

    static yesterday() {
        return this.addDays(new Date(), -1 );
    }

    static addDays(date1, days) {
        var date = new Date(date1.getTime());
        date.setDate(date.getDate() + days);
        return date;
    }
    static addMonth(date1, month) {
        var date = new Date(date1.getTime());
        date.setMonth(date.getMonth() + month);
        return date;
    }
    static addMinutes(date1, minutes) {
        var date = new Date(date1.getTime());
        date.setMinutes(date.getMinutes() + minutes);
        return date;
    }
    static format2digits(num) {
        num = "" + num;
        if (num.length == 1) {
            return "0" + num;
        }
        return num;
    }
    static format(date, format) {

        var months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];
        return format
            .replace(/yyyy/g, date.getFullYear())
            .replace(/MMM/g, months[date.getMonth()])
            .replace(/MM/g, this.format2digits(date.getMonth()+1))
            .replace(/dd/g, this.format2digits(date.getDate()))
            .replace(/HH/g, this.format2digits(date.getHours()))
            .replace(/mm/g, this.format2digits(date.getMinutes()))
            ;
    }

    static sameDay(d1, d2) {
        return this.truncate(d1).getTime() == this.truncate(d2).getTime();
    }

    static parse(str, format) {
        if (format=="yyyy_MM_dd") {
            var m:RegExpExecArray = /(\d+)_(\d+)_(\d+)/.exec(str);
            return new Date(+m[1], +m[2] - 1, +m[3]);
        }
        if (format=="yyyy_MM") {
            var m = /(\d+)_(\d+)/.exec(str);
            return new Date(+m[1], +m[2] - 1);
        }
        if (format=="dd.mm.yy") {
            var m = /(\d+)\.(\d+)\.(\d+)/.exec(str);
            return new Date(+m[3], +m[2] - 1, +m[1]);
        }
        if (format=="mm/dd/yy") {
            var m = /(\d+)\/(\d+)\/(\d+)/.exec(str);
            return new Date(+m[3], +m[1] - 1, +m[2]);
        }
        if (format=="MM d") {
            var m = /(\w+) (\d+)/.exec(str);
            var months = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ];
            return new Date(new Date().getFullYear(), months.indexOf(m[1]), +m[2]);
        }
        throw "Unsupported format: " + format;
    }

    static dayOfWeek(day) {
        if (day == 0) {
            return "Chủ nhật";
        }
        return "Thứ " + (day+1);
    }

    static isToday(date) {
        return this.truncate(date).getTime() == this.truncate(new Date()).getTime();
    }

    static dayEnd(date) {
        return new Date(this.truncate(this.addDays(date, 1)).getTime() - 1);
    }
    static monthEnd(date) {
        return new Date(this.truncateMonth(this.addMonth(date, 1)).getTime() - 1);
    }
    static truncate(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    static truncateHour(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, 0);
    }
    static truncateMinute(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0);
    }
    static truncateMonth(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
    }

    static weekBegin(date) {
        var dow = date.getDay();

        return new Date(date.getFullYear(), date.getMonth(), date.getDate() - dow, 0, 0, 0);
    }
}
