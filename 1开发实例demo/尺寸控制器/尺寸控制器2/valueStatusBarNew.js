//obj 属性说明 datamax范围最大值,datamin范围最小值,datadefault范围内默认值,containnerid 滑动部分容器,moveblockid滑块,minvalueshowerid最小值显示部分//,maxvalueshowerid最大值显示部分,inputid输入input
/*使用例子////////////
 * valuestatusBar({
 * 		datamin:400, //最小数值 int
 *		datamax:800, //最大数值 int
 *		datadefault:600, //默认数值 int
 *	    datastep:50,//滑块移动的最小间距间隔
 *		containnerid:"scollstatus_containner",//滑块等主要组件的容器id
 *		moveblockid:"moveable_block", //滑块id
 *		minvalueshowerid:"statusminvalue", //极小值显示部分id
 *		maxvalueshowerid:"statusmaxvalue", //极大值显示部分id
 *		inputid:"statusdatainput",  //数值输入框id
 *	    slidingFunction:dealslide,//滑动过程处理函数 function
 *       slideEndFunction:slideEndFunction, //滑动后处理函数mouseup事件触发 function
 *       inputKeyupFunction:inputKeyupFunction  //输入框keyup处理函数 function
 *       mouseDownFunction:  mouseDownFunction //鼠标mouseDown滑块时的事件 function
 *
 * });
 *
 */
var valuestatusBar = function (obj) {

    var doc = document;
    var disabled = false; //模块可用状态
    var containerId = obj.containnerid, //滑块等主要组件的容器
        moveblockId = obj.moveblockid,  //滑块
        minvalueshowerId = obj.minvalueshowerid, //极小值显示部分
        maxvalueshowerId = obj.maxvalueshowerid, //极大值显示部分
        valueinputId = obj.inputid,  //数值输入框
        slidingFunction = obj.slidingFunction, //滑动过程处理函数
        slideEndFunction = obj.slideEndFunction, //滑动后处理函数mouseup事件触发
        inputKeyupFunction = obj.inputKeyupFunction,  //输入框keyup处理函数\
        mouseDownFunction = obj.mouseDownFunction,//滑块被点击时执行的函数
        datamax = obj.datamax,//数值变化的最大值
        datamin = obj.datamin,//数值变化的最小值
        datadefault = obj.datadefault, //默认初始值
        newShowValue = obj.datadefault,
        datastep = obj.datastep,//移动滑块的步距值
        introValueArr = obj.introValueArr;
    //初始化函数 获取一些元素初始化一些数据

    var containner = doc.getElementById(containerId);//滑块等主要组件的容器
    var moveBlock = doc.getElementById(moveblockId);//滑块
    var minvalueshower = doc.getElementById(minvalueshowerId); //最小值显示部分
    var maxvalueshower = doc.getElementById(maxvalueshowerId);//最大值显示部分
    var data = doc.getElementById(valueinputId); //数值输入框


    //获取和计算元素的一些参数

    var containerLeftPos = 0; //滑块容器在页面的 pageX
    var blocksContainerWidth = containner.offsetWidth; //滑块容器的宽度
    var moveBlockWidth = moveBlock.offsetWidth; //滑块的宽度
    //获取滑块滑动范围的左侧页面位置
    var moveLeftBoundary = containerLeftPos;
    //获取滑动范围的总宽度 获取最大值与最小值的差值
    var slideWidth = blocksContainerWidth - moveBlockWidth;
    //获取滑块滑动范围的右侧页面位置
    var moveRightBoundary = slideWidth;

    //设置最大值最小值的显示
    minvalueshower.innerHTML = datamin;
    maxvalueshower.innerHTML = datamax;


    //获取元素在页面的位置
    function getElePosition(id) {
        var ele;
        if (typeof id == "string") {
            ele = doc.getElementById(id);
        }
        else {
            ele = id;
        }
        var bounding = ele.getBoundingClientRect();
        return {
            X: bounding.left,
            right: bounding.right,
            Y: bounding.top,
            bottom: bounding.bottom
        }
    }

    //获取鼠标在页面的坐标
    function getMousePos(e) {    /*鼠标横坐标的位置*/
        var mouseCurrentX;
        var event = e || window.event;
        if (event.pageX) {
            mouseCurrentX = event.pageX;
        }
        console.log(event.type);

        if (typeof  mouseCurrentX == "undefined") {
            mouseCurrentX = $(doc).scrollLeft() + event.clientX;
        }
        console.log(mouseCurrentX);
        return mouseCurrentX;
    }

    //将鼠标在页面的坐标转化在滑动容器内的坐标
    function transMouseX(e) {  /*返回滑块的坐标*/
        var pageMouse = getMousePos(e);
        /*鼠标横坐标的位置*/
        var containerMouse = pageMouse - containerLeftPos;
        return containerMouse;
    }

    function transElePos(ele) {  /*滑块和滑块容器位置的差值*/
        return getElePosition(ele).X - getElePosition(containner).X;
    }

    //设置元素的绝对位置
    function setElementLeft(ele, leftPos) {
        leftPos = Math.max(0, Math.min(leftPos, slideWidth));
        ele.style.position = "absolute";
        ele.style.left = leftPos + "px";
    }

    //返回滑块位置按比例对应的value
    function getOutPutValue(moveBlockPos) {
        var dataDiff = datamax - datamin;
        /*700*/
        var partion = dataDiff / slideWidth;
        var outputValue = moveBlockPos * partion;
        outputValue = Math.max(0, Math.min(outputValue, dataDiff));
        return outputValue;
        //console.log("outofBoundry:->moveBlockPos:"+moveBlockPos+"moveLeftBoundary:"+moveLeftBoundary+"moveRightBoundary:"+  moveRightBoundary  );
    }

    //将输出值按step处理
    function getFinalValueByStep(value) {
        var stepCount = Math.floor(value / datastep); //滑块划过的宽度 除以 步数
        var stepAddData = stepCount * datastep; //步数对应数值增加
        var finalData = datamin + stepAddData;  //增加后的值
        finalData = Math.max(datamin, Math.min(datamax, finalData));
        for (var i = 0; i < introValueArr.length; i++) {
            if (introValueArr[i] == finalData || datamin == finalData || datamax == finalData) {
                return finalData;
            } else if (introValueArr[i] < finalData && introValueArr[i + 1] > finalData) {
                return introValueArr[i];
            } else if (introValueArr[0] > finalData) {
                return datamin;
            } else if (introValueArr[introValueArr.length - 1] < finalData) {
                return introValueArr[introValueArr.length - 1];
            }
        }
        // return finalData;
    }

    //鼠标mouseDown时处理函数
    var msd = false, diffX = 0;

    function mouseDownDealer(e) {
        if (!disabled) { //可用状态下的插件
            msd = true;
            var tranMouseX = transMouseX(e);
            var moveblockLeft = transElePos(moveBlock);
            diffX = tranMouseX - moveblockLeft;
        }
    }

    //鼠标mouseUp处理函数
    function mouseUpDealer() {
        msd = false;
        slidEndTransfer(finalOutPutValue);
    }

    //鼠标移动处理函数
    var finalOutPutValue;  /*800*/
    var oldOutPutValue = datadefault;  /*默认值*/

    function mouseMoveDealer(e) {
        if (msd) {
            var mouseTransX = transMouseX(e);
            var leftPos = mouseTransX - diffX;
            /*滑块划过的宽度*/
            setElementLeft(moveBlock, leftPos); //设置滑块位置
            var outPutValue = getOutPutValue(leftPos) + 0.5;
            /**由于计算比例小数点太长原因难以 计算出最大最小差值 差小数点后面一些数值 (如_9.9999 )补充0.5 可以满足条件*/
            finalOutPutValue = getFinalValueByStep(outPutValue); //获取按步长输出的最终值

            setSlideShower(finalOutPutValue);//设置滑块下方显示的元素

            //  console.log("finalOutPutValue"+finalOutPutValue);
            //  console.log("oldOutPutValue "+oldOutPutValue );
            if (finalOutPutValue - oldOutPutValue != 0) { //有步长的数值变动//避免细微滑动调动3d函数
                setInputValue(finalOutPutValue); //设置input显示的值
                slidingTransfer(finalOutPutValue);//传入3d处理函数
                oldOutPutValue = finalOutPutValue;
            }
        }
    }

    //input输入后设置滑块位置
    data.onkeyup = function () {
        var value = this.value * 1;
        setMoveBlockByValue(value);
        inputValueTransfer(value);//外部传入3d的函数处理
    };

    //根据input 输入的值计算设置滑块的位置
    function setMoveBlockByValue(value) {
        if (value >= datamin && value <= datamax) {
            var dataDiff = datamax - datamin;
            var partion = slideWidth / dataDiff;
            var pos;
            for (var i = 0; i < introValueArr.length; i++) {
                if (introValueArr[i] == value || datamin == value || datamax == value) {
                    pos = partion * (value - datamin)
                } else if (introValueArr[i] < value && introValueArr[i + 1] > value) {
                    value = introValueArr[i];
                    pos = partion * (value - datamin)
                } else if (introValueArr[0] > value) {
                    value = datamin;
                    pos = partion * (value - datamin)
                } else if (introValueArr[introValueArr.length - 1] < value) {
                    value = introValueArr[introValueArr.length - 1];
                    pos = partion * (value - datamin)
                }
            }
            // var pos = partion * (value - datamin);

            /**
             *  pos += getDataStepLength() / 2
             * 调整推荐尺寸指针的位置使指针的位置正好在尺寸指示的位置
             * +在步长对应长度的中心
             */
            pos += getDataStepLength() / 2;
            pos = Math.max(0, Math.min(pos, slideWidth));

            setElementLeft(moveBlock, pos); //设置滑块位置
            setSlideShower(value);//设置滑块下方显示的元素

        } else {
            //可以提示输入值超出允许的范围
        }
    }


    /**
     *
     * 设置滑块下方数值显示模块 //辅助函数下方1 2
     *
     * */

    function setSlideShower(value) {
        var showerParent = moveBlock.parentNode;
        var shower = showerParent.getElementsByTagName("span")[0];

        setslideShowerPos(shower);
        setSlideShowerValue(shower, value);
    }

    //1设置滑块下方显示数据的元素的显示值
    function setSlideShowerValue(shower, value) {
        shower.innerHTML = value + "mm"; //下部显示框同步输入框显示的数值
    }

    //2设置滑块下方数值显示模块的位置
    function setslideShowerPos(shower) {
        //获取滑块的参数
        var blockmh = moveBlock.offsetHeight,
            sptop = moveBlock.offsetTop,
            spleft = moveBlock.offsetLeft;

        shower.style.position = "absolute";  //设置显示块的位置
        shower.style.left = spleft - 15 + "px"; //-20调节span元素的位置 shower是跟着moveblock移动的span
        shower.style.top = sptop + blockmh + "px";
    }

    /**
     * 初始化设置推荐值显示部分
     */
    function setIntroduceValue(introValueArr) {
        //创建之前先清空可能存在的 上次创建的指示div 和span(在windiow resize重新初始化插件的时候)
        var spans = containner.getElementsByTagName("span");

        for (var j = 0, lenj = spans.length; j < lenj; j++) {
            var curspan = spans[j];
            if (curspan && curspan.className === "introductorVal") {
                containner.removeChild(curspan);
            }
        }

        var divs = containner.getElementsByTagName("div");
        for (var d = divs.length - 1; d >= 0; d--) {
            var curdiv = divs[d];
            if (curdiv && curdiv.className === "levelpointer") {
                containner.removeChild(curdiv);
            }
        }
        for (var i = 0, len = introValueArr.length; i < len; i++) {
            var introValue = introValueArr[i];
            //获取推荐值指示标签的位置
            var left = getIntroductorPos(introValue);

            var div = document.createElement("div");
            div.className = "levelpointer";
            /**
             *  left为左上角的位置，
             *  添加滑块宽度的一半调节到滑块的中心显示
             *  位置+对应滑块的微调+ 对应步长的微调，调到步长中心
             */
            div.style.left = ( left + moveBlockWidth / 2 + getDataStepLength() / 2) + "px";
            var span = document.createElement("span");
            span.innerHTML = introValue;
            span.className = "introductorVal";
            span.style.left = (left + getDataStepLength() / 2/*- 20 */) + "px";
            containner.appendChild(div);
            containner.appendChild(span);
        }
    }

    //获取推荐值指示标签的位置
    function getIntroductorPos(value) {
        if (value >= datamin && value <= datamax) {
            var dataDiff = datamax - datamin;
            var partion = slideWidth / dataDiff;
            var pos = partion * (value - datamin);
            return pos = Math.max(0, Math.min(pos, slideWidth));
        }
    }

    function getDataStepLength() {
        var dataDiff = datamax - datamin;
        var partion = slideWidth / dataDiff;
        //alert(partion * datastep);
        return partion * datastep;

    }

    /**
     *  接入的操作处理函数
     */

    //调用手动输入数值时处理函数
    function inputValueTransfer(value) {
        if (typeof value == "number" && value >= datamin && value <= datamax) {
            if (typeof inputKeyupFunction === "function") {
                inputKeyupFunction(value);
            }
        } else {
            //可以显示提示用户输入不在范围之内
        }
    }

    //调用滑动结束时处理函数
    function slidEndTransfer(value) {
        //接口函数
        if (typeof slideEndFunction === "function") {
            slideEndFunction(value);
            slideEndMoveBlock(value);
        }
    }

    function slidingTransfer(value) {
        if (typeof slidingFunction === "function") {
            slidingFunction(value);
        }
    }

    //滑动结束，鼠标提起时，滑块的位置
    function slideEndMoveBlock(value) {
        var showerParent = moveBlock.parentNode;
        var shower = showerParent.getElementsByTagName("span")[0];
        for (var i = 0; i < introValueArr.length; i++) {
            //获取推荐值指示标签的位置
            var left = getIntroductorPos(introValueArr[i]);
            var div = document.getElementsByClassName("levelpointer")[i];
            var divWidth = div.style.left = ( left + moveBlockWidth / 2 + getDataStepLength() / 2);

            if (value >= introValueArr[i] && value < introValueArr[i + 1]) {
                moveBlock.style.left = (divWidth - moveBlockWidth / 2) + "px";
            } else if (value >= introValueArr[introValueArr.length - 1] && value < datamax) {
                moveBlock.style.left = (divWidth - moveBlockWidth / 2) + "px";
            } else if (value < introValueArr[0] && value >= datamin) {
                moveBlock.style.left = 0 + "px"
            } else if (value === datamax) {
                moveBlock.style.left = (blocksContainerWidth - moveBlockWidth) + "px"
            }
            shower.style.left = moveBlock.offsetLeft - 15 + "px";
        }
    }

    /**
     *  设置插件为不可用 //单纯功能上不可用 ，不涉及外观样式的设置
     */
    function disableSizeBar() {
        disabled = true;
    }

    /**
     * 初始设置函数
     */


    //设置input输入框显示的值
    function setInputValue(value) {
        data.value = value;
    }

    //根据默认值 设置插件的初始状态
    function initBlock(value) {
        setMoveBlockByValue(value);//设置滑块
        setInputValue(value); //设置input显示
    }


    /**
     * 外部设置数值的接口函数
     */
    function setBlock(value) {
        setMoveBlockByValue(value);
        inputValueTransfer(value); //外部传入3d的函数处理
    }


    //初始化最初位置
    setIntroduceValue(introValueArr);
    initBlock(datadefault);
    //disableSizeBar();

    return {

        setBlock: setBlock,//其他输入接口函数
        disableSizeBar: disableSizeBar,
        on: function () {
            //确定鼠标点击下放
            EventUtil.addHandler(moveBlock, "touchstart", mouseDownDealer);
            EventUtil.addHandler(moveBlock, "mousedown", mouseDownDealer);
            //鼠标提起
            EventUtil.addHandler(doc, "touchend", mouseUpDealer);
            EventUtil.addHandler(doc, "mouseup", mouseUpDealer);
            //根据范围 跟踪鼠标X位置
            EventUtil.addHandler(containerId, "touchmove", mouseMoveDealer);
            EventUtil.addHandler(containerId, "mousemove", mouseMoveDealer);

        },
        off: function () {
            //确定鼠标点击下放
            EventUtil.removeHandler(moveBlock, "mousedown", mouseDownDealer);
            //鼠标提起
            EventUtil.removeHandler(doc, "mouseup", mouseUpDealer);
            //根据范围 跟踪鼠标X位置
            EventUtil.removeHandler(containerId, "mousemove", mouseMoveDealer);
            //鼠标抬起后传递数值
            // EventUtil.removeHandler(idmoveblock, "mouseup", checkValue);

            this.setBlock = null; //取消闭包引用
            this.disableSizeBar = null; //取消闭包引用
        }
    };  //用于额外赋值的接口函数

};

