function Puzzle(imgWidth,imgHeight,cuttingoffX,cuttingoffY,img){
    var selectPanel=document.getElementById("selectpanel");//拼图面板
    var mathPanel=document.getElementById("mathpanel");//拼图匹配面板
    var orginalImg=document.getElementById("orginalimg");//参照图面板
    selectPanel.style.cssText='width: auto;height: auto;border: 2px solid black;overflow: hidden;float: left;margin: 10px;';
    mathPanel.style.cssText='width: auto;height: auto;border: 2px solid black;overflow: hidden;float: right;margin: 10px;';
    var amount=(imgWidth/cuttingoffX)*(imgHeight/cuttingoffY);//根据自定义每块拼图的宽高，计算拼图的总数量
    var jsonPosition=[];
    for(var i=0;i<amount;i++){//一个数组模拟成一个二维矩阵，用json来存这个矩阵，并且每个位置给它一个匹配值M
        jsonPosition[i]={X:i%(imgWidth/cuttingoffX),Y:parseInt(i/(imgHeight/cuttingoffY)),M:i};
    }
    for(var c=0;c<amount;c++){//随机生成拼图位置
        var divImg=document.createElement("div");
        divImg.style.width=cuttingoffX+"px";
        divImg.style.height=cuttingoffY+"px";
        divImg.style.backgroundImage="url(img/"+img+")";
        divImg.style.backgroundRepeat="no-repeat";
        divImg.style.border="1px dashed gray";
        divImg.style.float="left";
        divImg.style.cursor="pointer";
        if(c%(imgWidth/cuttingoffX)==0&&c!=0)
            divImg.style.clear="left";
        var rendomPositon=jsonPosition.splice(Math.floor(Math.random()*jsonPosition.length),1)[0];
        divImg.style.backgroundPosition=rendomPositon['X']*(-cuttingoffX)+'px'+' '+rendomPositon['Y']*(-cuttingoffY)+'px';
        divImg.draggable="true";
        divImg.maths=rendomPositon["M"];
        selectPanel.appendChild(divImg);
    }
    for(var c=0;c<amount;c++){//生成拼图匹配面板
        var divEmpty=document.createElement("div");
        divEmpty.style.width=cuttingoffX+"px";
        divEmpty.style.height=cuttingoffY+"px";
        divEmpty.style.border="1px solid gray";
        divEmpty.style.float="left";
        if(c%(imgWidth/cuttingoffX)==0&&c!=0)
            divEmpty.style.clear="left";
        divEmpty.maths=c;
        mathPanel.appendChild(divEmpty);
    }
    var orginalImgWidth=document.body.clientWidth-(selectPanel.offsetWidth+selectPanel.offsetLeft+10)*2;
    orginalImg.style.cssText="width: "+orginalImgWidth+"px;height:"+orginalImgWidth+"px;position:absolute;left:50%;margin-left:"+(-orginalImgWidth/2)+"px;top:10px;";
    orginalImg.style.background="url(img/"+img+") no-repeat 0 0";
    orginalImg.style.backgroundSize=orginalImgWidth+"px "+orginalImgWidth+"px";

    var divImgs=selectPanel.getElementsByTagName("div");
    var divEmptys=mathPanel.getElementsByTagName("div");
    for(var e=0;e<divImgs.length;e++){
        divImgs[e].ondragstart=function(event){//鼠标开始拖拽拼图，并且拿到它的匹配值maths
            var event=event||window.event;
            event.dataTransfer.setData("math",this.maths);
        }
        divImgs[e].ondrag=function(){
        }
        divImgs[e].ondragend=function(){
        }
        divEmptys[e].ondragenter=function(){
            this.style.backgroundColor="red";
        }
        divEmptys[e].ondragover=function(event){//取消在拼图匹配面板的默认事件，否则ondrop无效
            return false;
        }
        divEmptys[e].ondragleave=function(){
            this.style.backgroundColor="transparent";
        }
        divEmptys[e].ondrop=function(event){//拖拽的拼图在匹配面板放下时执行函数
            var event=event||window.event;
            this.style.backgroundColor="transparent";
            if(event.dataTransfer.getData("math")==this.maths){//判断拼图传过来的maths匹配值是否和匹配面板的maths一样，如果是则匹配成功
                for(var i=0;i<divImgs.length;i++){
                    if(divImgs[i].maths==this.maths){
                        this.style.backgroundImage=divImgs[i].style.backgroundImage;
                        this.style.backgroundRepeat=divImgs[i].style.backgroundRepeat;
                        this.style.backgroundPosition=divImgs[i].style.backgroundPosition;
                        divImgs[i].setAttribute("draggable","false");
                        divImgs[i].style.background="none";
                    }
                }
            }
        }
    }
}
//浏览器窗口发生变化时的图片处理
window.onresize=function(){
    var selectPanel=document.getElementById("selectpanel");
    var orginalImg=document.getElementById("orginalimg");
    var orginalImgWidth=document.body.clientWidth-(selectPanel.offsetWidth+selectPanel.offsetLeft+10)*2;
    orginalImg.style.width=orginalImg.style.height=orginalImgWidth+"px";
    orginalImg.style.marginLeft=-orginalImgWidth/2+"px";
    orginalImg.style.backgroundSize=orginalImgWidth+"px "+orginalImgWidth+"px";
}