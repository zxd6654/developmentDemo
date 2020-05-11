/**
 * 手机端检测跳转到手机端 检查是否是手机端，如果是手机端而且点击过切换到电脑端，这时不会切换到手机
 */
 function checkPhone() {
    let mobileAgent = new Array("iphone", "ipod", "ipad", "android"/*, "mobile"*/, "blackberry", "webos", "incognito", "webmate", "bada", "nokia", "lg", "ucweb", "skyfire");
    let browser = navigator.userAgent.toLowerCase();
    for (let i = 0; i < mobileAgent.length; i++) { //如果是浏览器是手机版
        if (browser.indexOf(mobileAgent[i]) != -1) {
            let origin = location.origin;
            let str = location.href;
            let index = str.indexOf('?');

            if(str.indexOf('/mycenter/orders')!=-1){
                if (index === -1) {
                    location.href = origin + "/index.php?route=mobile/index&#/orders";
                } else {
                    location.href = origin + "/index.php?route=mobile/index&#/orders" + str.substr(index + 1);
                }
            }else{
                if (index === -1) {
                    location.href = origin + "/index.php?route=mobile/index&";
                } else {
                    location.href = origin + "/index.php?route=mobile/index&" + str.substr(index + 1);
                }
            }
            break;
        }
    }
}

checkPhone();
