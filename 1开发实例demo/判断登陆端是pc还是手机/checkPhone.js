function checkPhone() {
    var mobileAgent = new Array("iphone", "ipod", "ipad", "android"/*, "mobile"*/, "blackberry", "webos", "incognito", "webmate", "bada", "nokia", "lg", "ucweb", "skyfire");
    var browser = navigator.userAgent.toLowerCase();
    var isMobile = false;
    for (var i = 0; i < mobileAgent.length; i++) { //如果是浏览器是手机版
        if (browser.indexOf(mobileAgent[i]) != -1) {
            isMobile = true;
            // 重定向手机端网址
            if (window.location.href.indexOf("localhost") !== -1) {
                location.href = "http://localhost:8088/mobile/";
            }
            if (window.location.href.indexOf("homing.sg") != -1) {
                location.href = "http://homing.sg/mobile/";//正式服务器手机端网址
            }
            break;
        }
    }
}
checkPhone();
