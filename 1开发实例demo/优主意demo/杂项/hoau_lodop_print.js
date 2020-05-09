var CreatedOKLodop7766 = null;
var hoau = {};
var LODOP;
/**调用主方法，需传一个arrlist数组
 数组的对象为一个包含下面字段的对象
 'printTime'---打印时间
 'transportType'---运输类型
 'waybill'---运单号
 'pieces'---总件数
 'indexPiece'-当前件数
 'transportChar'---运输类型字符
 'startDept'--起始地
 'endDept'---目的地
 'barcode'----条码
 'barcodeText'----条码内容
 **/
arrlist = [
    {
        'printTime': '2016-07-23 15:57:00',
        'transportType': '定日达',
        'waybill': 'F1234567',
        'pieces': '2',
        'indexPiece': '1',
        'transportChar': 'D',
        'startDept': 'N上海5',
        'endDept': 'N北京8',
        'barcode': '111F123456700014',
        'barcodeText': '11F12345670001'
    },
    {
        'printTime': '2016-07-23 15:57:00',
        'transportType': '定日达',
        'waybill': 'F1234567',
        'pieces': '2',
        'indexPiece': '2',
        'transportChar': 'D',
        'startDept': 'N上海5',
        'endDept': 'N北京8',
        'barcode': '111F123456700024',
        'barcodeText': '11F12345670002'
    }
]

/**
 当前适用于80*65的纸张
 如若需要微调，可传x,y值----单位毫米
 x--整体向右移动（负值向左移动）
 y--整体向下移动（负值向上移动）
 **/
hoau.print = function (arrList, x, y) {
    if (!(arrList instanceof Array) || arrList == null || arrList.length == 0) {
        alert('请正确传入所需打印的参数！');
        return;
    }


    if (typeof x == 'undefined') {
        x = 0;
    }
    if (typeof y == 'undefined') {
        y = 0;
    }

    LODOP = getLodop();
    LODOP.PRINT_INIT("");
    console.log(arrList.length);
    console.log(arrList);
    for (var i = 0; i < arrList.length; i++) {
        hoau.printOne(arrList[i], x, y);
    }

    LODOP.SET_PREVIEW_WINDOW(0, 0, 0, 0, 0, "");
    LODOP.PREVIEW();

};


/*getLodop = function (oOBJECT, oEMBED) {
 /!***************************************************************************
 * 本函数根据浏览器类型决定采用哪个页面元素作为Lodop对象： IE系列、IE内核系列的浏览器采用oOBJECT，
 * 其它浏览器(Firefox系列、Chrome系列、Opera系列、Safari系列等)采用oEMBED,
 * 如果页面没有相关对象元素，则新建一个或使用上次那个,避免重复生成。 64位浏览器指向64位的安装程序install_lodop64.exe。
 **************************************************************************!/
 var strHtmInstall = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop64.rar' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
 var strHtmUpdate = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop32.rar' target='_self'>执行升级</a>,升级后请重新进入。</font>";
 var strHtm64_Install = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop64.rar' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
 var strHtm64_Update = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop64.rar' target='_self'>执行升级</a>,升级后请重新进入。</font>";
 var strHtmFireFox = "<br><br><font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>";
 var strHtmChrome = "<br><br><font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>";
 var LODOP;
 try {
 // =====判断浏览器类型:===============
 var isIE = (navigator.userAgent.indexOf('MSIE') >= 0)
 || (navigator.userAgent.indexOf('Trident') >= 0);
 var is64IE = isIE && (navigator.userAgent.indexOf('x64') >= 0);
 // =====如果页面有Lodop就直接使用，没有则新建:==========
 if (oOBJECT != undefined || oEMBED != undefined) {
 if (isIE)
 LODOP = oOBJECT;
 else
 LODOP = oEMBED;
 } else {
 if (CreatedOKLodop7766 == null) {
 LODOP = document.createElement("object");
 LODOP.setAttribute("width", 0);
 LODOP.setAttribute("height", 0);
 LODOP
 .setAttribute("style",
 "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
 if (isIE)
 LODOP.setAttribute("classid",
 "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
 else
 LODOP.setAttribute("type", "application/x-print-lodop");
 document.documentElement.appendChild(LODOP);
 CreatedOKLodop7766 = LODOP;
 } else
 LODOP = CreatedOKLodop7766;
 }

 // =====判断Lodop插件是否安装过，没有安装或版本过低就提示下载安装:==========
 if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined")) {
 if (navigator.userAgent.indexOf('Chrome') >= 0)
 document.documentElement.innerHTML = strHtmChrome
 + document.documentElement.innerHTML;
 if (navigator.userAgent.indexOf('Firefox') >= 0)
 document.documentElement.innerHTML = strHtmFireFox
 + document.documentElement.innerHTML;
 if (is64IE)
 document.write(strHtm64_Install);
 else if (isIE) {
 console.log(1);
 document.write(strHtmInstall);
 } else {
 console.log(2);
 document.documentElement.innerHTML = strHtmInstall
 + document.documentElement.innerHTML;
 return LODOP;
 }
 } else if (LODOP.VERSION < "6.1.9.6") {
 if (is64IE)
 document.write(strHtm64_Update);
 else if (isIE)
 document.write(strHtmUpdate);
 else
 document.documentElement.innerHTML = strHtmUpdate
 + document.documentElement.innerHTML;
 return LODOP;
 }

 // =====如下空白位置适合调用统一功能(如注册码、语言选择等):====
 LODOP.SET_LICENSES("", "394101451001069811011355115108", "", "");
 // ============================================================
 return LODOP;
 } catch (err) {
 if (is64IE)
 document.documentElement.innerHTML = "Error:" + strHtm64_Install
 + document.documentElement.innerHTML;
 else
 console.log(3);
 document.documentElement.innerHTML = "Error:" + strHtmInstall
 + document.documentElement.innerHTML;
 return LODOP;
 }
 ;
 }*/

//====判断是否需要安装CLodop云打印服务器:====
function needCLodop() {
    try {
        var ua = navigator.userAgent;
        if (ua.match(/Windows\sPhone/i) != null) return true;
        if (ua.match(/iPhone|iPod/i) != null) return true;
        if (ua.match(/Android/i) != null) return true;
        if (ua.match(/Edge\D?\d+/i) != null) return true;

        var verTrident = ua.match(/Trident\D?\d+/i);
        var verIE = ua.match(/MSIE\D?\d+/i);
        var verOPR = ua.match(/OPR\D?\d+/i);
        var verFF = ua.match(/Firefox\D?\d+/i);
        var x64 = ua.match(/x64/i);
        if ((verTrident == null) && (verIE == null) && (x64 !== null))
            return true; else if (verFF !== null) {
            verFF = verFF[0].match(/\d+/);
            if ((verFF[0] >= 42) || (x64 !== null)) return true;
        } else if (verOPR !== null) {
            verOPR = verOPR[0].match(/\d+/);
            if (verOPR[0] >= 32) return true;
        } else if ((verTrident == null) && (verIE == null)) {
            var verChrome = ua.match(/Chrome\D?\d+/i);
            if (verChrome !== null) {
                verChrome = verChrome[0].match(/\d+/);
                if (verChrome[0] >= 42) return true;
            }
            ;
        }
        ;
        return false;
    } catch (err) {
        return true;
    }
    ;
};

//====页面引用CLodop云打印必须的JS文件：====
if (needCLodop()) {
    var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    var oscript = document.createElement("script");
    oscript.src = "http://localhost:8000/CLodopfuncs.js?priority=1";
    head.insertBefore(oscript, head.firstChild);

    //引用双端口(8000和18000）避免其中某个被占用：
    oscript = document.createElement("script");
    oscript.src = "http://localhost:18000/CLodopfuncs.js?priority=0";
    head.insertBefore(oscript, head.firstChild);
}
;

//====获取LODOP对象的主过程：====
function getLodop(oOBJECT, oEMBED) {
    var strHtmInstall = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop32.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
    var strHtmUpdate = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop32.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
    var strHtm64_Install = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop64.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
    var strHtm64_Update = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop64.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
    var strHtmFireFox = "<br><br><font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>";
    var strHtmChrome = "<br><br><font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>";
    var strCLodopInstall = "<br><font color='#FF00FF'>CLodop云打印服务(localhost本地)未安装启动!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行安装</a>,安装后请刷新页面。</font>";
    var strCLodopUpdate = "<br><font color='#FF00FF'>CLodop云打印服务需升级!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行升级</a>,升级后请刷新页面。</font>";
    var LODOP;
    try {
        var isIE = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0);
        if (needCLodop()) {
            try {
                LODOP = getCLodop();
            } catch (err) {
            }
            ;
            if (!LODOP && document.readyState !== "complete") {
                alert("C-Lodop没准备好，请稍后再试！");
                return;
            }
            ;
            if (!LODOP) {
                if (isIE) document.write(strCLodopInstall); else
                    document.documentElement.innerHTML = strCLodopInstall + document.documentElement.innerHTML;
                return;
            } else {

                if (CLODOP.CVERSION < "2.1.0.2") {
                    if (isIE) document.write(strCLodopUpdate); else
                        document.documentElement.innerHTML = strCLodopUpdate + document.documentElement.innerHTML;
                }
                ;
                if (oEMBED && oEMBED.parentNode) oEMBED.parentNode.removeChild(oEMBED);
                if (oOBJECT && oOBJECT.parentNode) oOBJECT.parentNode.removeChild(oOBJECT);
            }
            ;
        } else {
            var is64IE = isIE && (navigator.userAgent.indexOf('x64') >= 0);
            //=====如果页面有Lodop就直接使用，没有则新建:==========
            if (oOBJECT != undefined || oEMBED != undefined) {
                if (isIE) LODOP = oOBJECT; else  LODOP = oEMBED;
            } else if (CreatedOKLodop7766 == null) {
                LODOP = document.createElement("object");
                LODOP.setAttribute("width", 0);
                LODOP.setAttribute("height", 0);
                LODOP.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
                if (isIE) LODOP.setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
                else LODOP.setAttribute("type", "application/x-print-lodop");
                document.documentElement.appendChild(LODOP);
                CreatedOKLodop7766 = LODOP;
            } else LODOP = CreatedOKLodop7766;
            //=====Lodop插件未安装时提示下载地址:==========
            if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined")) {
                if (navigator.userAgent.indexOf('Chrome') >= 0)
                    document.documentElement.innerHTML = strHtmChrome + document.documentElement.innerHTML;
                if (navigator.userAgent.indexOf('Firefox') >= 0)
                    document.documentElement.innerHTML = strHtmFireFox + document.documentElement.innerHTML;
                if (is64IE) document.write(strHtm64_Install); else if (isIE)   document.write(strHtmInstall); else
                    document.documentElement.innerHTML = strHtmInstall + document.documentElement.innerHTML;
                return LODOP;
            }
            ;
        }
        ;
        if (LODOP.VERSION < "6.2.1.7") {
            if (needCLodop())
                document.documentElement.innerHTML = strCLodopUpdate + document.documentElement.innerHTML; else if (is64IE) document.write(strHtm64_Update); else if (isIE) document.write(strHtmUpdate); else
                document.documentElement.innerHTML = strHtmUpdate + document.documentElement.innerHTML;
            return LODOP;
        }
        ;
        //===如下空白位置适合调用统一功能(如注册语句、语言选择等):===

        //===========================================================
        return LODOP;
    } catch (err) {
        alert("getLodop出错:" + err);
    }
    ;
};

hoau.printOne = function (model, x, y) {

    LODOP.NewPage();
    //设置纸张
    LODOP.SET_PRINT_PAGESIZE(1, "80mm", "65mm", "");
    LODOP.SET_PRINT_STYLE("FontSize", 10);
    LODOP.SET_PRINT_STYLE("Bold", 1);
    //天地华宇
    LODOP.ADD_PRINT_TEXT(y + 7 + "mm", x + 7 + "mm", "30mm", "8mm", "天地华宇");

    //运输类型
    LODOP.SET_PRINT_STYLE("FontSize", 14);
    LODOP.ADD_PRINT_TEXT(y + 7 + "mm", x + 50 + "mm", "30mm", "8mm", model.transportType);
    //运单号
    LODOP.SET_PRINT_STYLE("FontSize", 13);
    LODOP.ADD_PRINT_TEXT(y + 13 + "mm", x + 7 + "mm", "50mm", "8mm", model.waybill + ' -' + model.pieces + '(' + model.indexPiece + ')');
    //起运地
    LODOP.ADD_PRINT_TEXT(y + 20 + "mm", x + 7 + "mm", "60mm", "8mm", model.startDept);

    //目的地
    LODOP.ADD_PRINT_TEXT(y + 27 + "mm", x + 10 + "mm", "60mm", "8mm", '==>' + model.endDept);
    LODOP.SET_PRINT_STYLE("FontSize", 24);
    LODOP.ADD_PRINT_TEXT(y + 13 + "mm", x + 60 + "mm", "20mm", "8mm", model.transportChar);
    //打印时间
    LODOP.SET_PRINT_STYLE("FontSize", 6);
    LODOP.SET_PRINT_STYLE("Bold", 0);
    LODOP.ADD_PRINT_TEXT(y + 8 + "mm", x + 25 + "mm", "40mm", "4mm", model.printTime);


    //打印code128条码
    LODOP.ADD_PRINT_BARCODE(y + 35 + "mm", x + 7 + "mm", "60mm", "12mm", "128Auto", model.barcode);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    //打印条码对应标签
    LODOP.SET_PRINT_STYLE("FontSize", 10);
    LODOP.ADD_PRINT_TEXT(y + 49 + "mm", x + 10 + "mm", "50mm", "12mm", model.barcodeText);
    //打印网址和电话
    LODOP.ADD_PRINT_TEXT(y + 60 + "mm", x + 5 + "mm", "75mm", "5mm", "400-808-6666            www.hoau.net");


};
