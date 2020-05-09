import {getSingle, Layer} from "../layer/layerInterface"

/**
 *alert 带关闭按钮
 */
let alertLayer = new Layer({
    layerId: "re-alert",
    layerClass: "message-box",
    cssPath: "/css/messageBox.css",
    shadeSign: true
});

alertLayer.createBoxContent = function () {
    let alertBoxContent = `
            <span class="close-btn"></span>
            <h5 class="title"></h5>
            <p class="content"></p> 
            <button type="button"  class="btn btn-highlight btn1">
            </button>`;

    $(this.layerElement).append(alertBoxContent);
    return alertBoxContent;
};

alertLayer.SingleBoxContent = getSingle(alertLayer.createBoxContent, alertLayer);

function reAlert(title, content, btnVal = '确定') {
    let scope = alertLayer;
    let alertPromise = new Promise(function (resolve, reject) {
        scope.openLayer();
        scope.SingleBoxContent();
        $(scope.layerElement).find(".close-btn").unbind("click.confirm").bind("click.confirm", function () {
            scope.closeLayer();
        }).next(".title").text(title).next(".content").text(content).next(".btn1").text(btnVal).unbind("click.alert").bind("click.alert", function () {
            scope.closeLayer();
            resolve();
        })
    });
    return alertPromise;
}

window.reAlert = reAlert();

/**
 * alert,自动消失
 */
let autoFadeLayer = new Layer({
    layerId: "auto-alert",
    layerClass: "message-box",
    cssPath: "/css/messageBox.css",
    shadeSign: true
});
autoFadeLayer.createFadeBoxContent = function () {
    let alertBoxContent = `
            <h5 class="title"></h5>
            <p class="content"></p>`;

    $(this.layerElement).append(alertBoxContent);
    return alertBoxContent;
};
autoFadeLayer.SingleFadeBoxContent=getSingle(autoFadeLayer.createFadeBoxContent,autoFadeLayer);

function fadeAlert(title,content){
    let scope=autoFadeLayer;
    let aletPromise=new Promise(function (resolve, reject) {
        scope.openLayer();
        scope.SingleFadeBoxContent();
        $(scope.layerElement).find(".title").text(title).next(".content").text(content);
        setTimeout(function () {
            scope.closeLayer();
            resolve();
        },3000)
    });

    return aletPromise;
}

window.fadeAlert=fadeAlert();
