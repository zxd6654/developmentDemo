/**
 * 管理单例
 */

let getSingle = function (fn, that) {
    let result;
    return function () {
        return result || (result = fn.apply(that, arguments));
    }
};

/**
 * 弹框操作
 * shadeSign是否显示半透遮罩
 */

class LayerOperator {
    constructor(layer, shadeSign = false) {
        this.layer = layer || null;
        this.shadeSign = shadeSign;
        this.checkLayer();
    }

    checkLayer() {
        if (!this.layer) {
            throw new Error("the argument must be a layer Element");
        }
    };

//   显示弹窗
    showLayer() {
        if (this.shadeSign) {
            $("#allPageDisabled").show();
        }
        this.layer.style.display = "block";
    }

//    关闭窗口
    closeLayer() {
        if (this.shadeSign) {
            $("#allPageDisabled").hide();
        }
        this.layer.style.display = "none";
    }
}

/**
 * 弹框都有打开、创建、关闭动作
 */
let cssPath = [];//保存添加的layer样式，避免相同样式重复引入
class Layer {
    constructor(obj) {
        if (obj.layerId &&
            obj.cssPath &&
            obj.layerClass
        ) {
            this.layerId = obj.layerId;
            this.layerClass = obj.layerClass;
            this.cssPath = obj.cssPath;
            this.shadeSign = obj.shadeSign ? obj.shadeSign : null;
        } else {
            throw new Error("arguments error");
        }

        this.layerElement = null;
        this.layerOperator = null;
        this.createSingleLayer=getSingle(this.createLayer,this);
    }

//    创建弹窗以后，初始化弹窗事件
    initLayer(){
         this.layerElement=document.getElementById(this.layerId);
         this.layerOperator=new LayerOperator(this.layerElement,this.shadeSign);
    }

//   创建弹窗
    createLayer() {
        let cssAddsign = cssPath.indexOf($.trim(this.cssPath)) == -1 ? true : false;
        if(cssAddsign){
            let styleElement=`<link type="text/css" rel="stylesheet" href="${this.cssPath}">`;
             $('head').append(styleElement);
             cssPath.push(this.cssPath);
        }

        let layer=`<div class="${this.layerClass}" id="${this.layerId}">`;
        $("body").append(layer);

        this.initLayer();

        return layer;
    }

    closeLayer(){
        this.layerOperator.closeLayer();
    }

    openLayer(){
        this.createSingleLayer();
        this.layerOperator.showLayer();
    }

}

export {Layer,getSingle}