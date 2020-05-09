
window.activityTime=function (obj) {
    setInterval(function () {
            var oDateNow = new Date();
            var oDateStart = new Date();
            var oDateEnd = new Date();
            if (oDateNow < oDateStart) {
                divin.innerHTML = "等待活动开启";
            }
            else if (oDateNow >= oDateStart && oDateNow <= oDateEnd) {
                oDateStart = oDateNow;
                var ms = oDateEnd - oDateStart;
                var s = Math.floor(ms / 1000);
                var min = Math.floor(ms / 1000 / 60);
                var h = Math.floor(ms / 1000 / 60 / 60);
                var day = Math.floor(ms / 1000 / 60 / 60 / 24);
//                    ms -= s * 1000;
                s -= min * 60;
                min -= h * 60;
                h -= day * 24;
                timer = "距离活动结束剩余 ：" + day + "天" + h + "小时" + min + "分" + s + "秒";
                divin.innerHTML = timer;
            } else {
                divin.innerHTML = "活动已结束";
            }

        }
        , 1000);
};