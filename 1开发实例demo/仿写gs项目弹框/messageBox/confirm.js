import {Layer,getSingle} from "../layer/layerInterface"

let confirmLayer=new Layer({
    layerId : "re-confirm",
    layerClass:"message-box",
    cssPath : "/css/messageBox.css",
    shadeSign:true
});

confirmLayer.createBoxContent=function(){
    let alertBoxContent=`
            <span class="close-btn"></span>
            <h5 class="title"></h5>
            <p class="content"></p> 
            <div class="btn-container">
                <button type="button"  class="btn btn1 btn-highlight">
                </button>
                <button type="button"  class="btn btn2">
                </button>
            </div>`;

    $(this.layerElement).append(alertBoxContent);
    return alertBoxContent;
};

confirmLayer.createSingleBoxContent=getSingle(confirmLayer.createBoxContent,confirmLayer);



function reConfirm(title, content,btn1Val="确定",btn2Val="取消"){
    let scope=confirmLayer;
    let confirmPromise = new Promise(function (resolve, reject) {
        scope.openLayer();
        scope.createSingleBoxContent();
        $(scope.layerElement).find(".close-btn").unbind("click.confirm").bind("click.confirm",function(){
            scope.closeLayer();
        }).next(".title").text(title).next(".content").text(content).next(".btn-container").children(".btn1").text(btn1Val).next(".btn2").text(btn2Val);

        $(scope.layerElement).find(`.btn1`).unbind("click.confirm").bind("click.confirm",function () {
            scope.closeLayer();
            resolve();
        }).next(".btn2").unbind("click.confirm").bind("click.confirm",function(){
            scope.closeLayer();
            reject();
        })
    });
    return confirmPromise;
}

window.reConfirm=reConfirm();