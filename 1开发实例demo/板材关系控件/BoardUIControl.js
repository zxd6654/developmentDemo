//面板控件
function BoardControl() {
    let _that = this;
    // 父级选择select
    //title, 父级的名字
    // parentOptions,父级选择器的内容
    // parentId, 容器
    // callBack, 点击选择按钮执行的函数，事件。
    _that.parentControl = function (title, parentOptions, parentId, callBack) {
        let start = `<div class="parentWrap clearfloat">
                    <div class="arrow" id="arrow" isDropDown="false" onclick="arrowToggle(this)"></div>
                    <div class="parentControl">
                        <span class="parentTitle">${title}</span>
                        <input type="text" name="makeupCo" id="makeupCo" class="makeupCo" onfocus="setFocus(this)" oninput="setInput(this);" value=""/>
                        <select name="makeupCoSe" id="typenum" class="typenum" onclick="changeF(this)" size="100" style="display:none;">`;
        let content = "";
        let end = `</select></div>
                <div class="unified"><span>统一</span><input type="checkbox" id="unified" checked onclick="unified(this)"></div>
                <div class="choose" id="choose"><input type="button" value="选择" onclick="selectButton()"></div></div>`;
        let result = "";
        parentOptions[0].options.forEach(function (object) {
            if (object.select) {
                content += `<option value ="${object.value}" selected>${object.name}</option>`
            } else {
                content += `<option value ="${object.value}">${object.name}</option>`
            }
        });
        result += start + content + end;
        let parentName = document.getElementById(parentId);
        $(parentName).append(result);

        _that.selectBtn = callBack;
    };
    // 子级选择select
    // data, 子级选择数据
    // parentId，容器
    _that.childControl = function (data, parentId) {
        let start = `<div class="children">`;
        let content = "";
        let end = `</div>`;
        let result = "";
        data.forEach(function (object, index) {
            let zIndex = 9999 - index;
            let inputId = "makeupCo" + index;
            let selectId = "typenum" + index;
            console.log(zIndex);
            let begin = `<div class="childWrap clearfloat" style='z-index:${zIndex}'>
            <div class="childControl">
                <span class="childTitle">${object.name}</span>
                <input type="text" name="makeupCo" id="${inputId}" class="makeupCo" onfocus="setFocus(this)"
                       oninput="setInput(this);" disabled/>
                <select name="makeupCoSe" id="${selectId}" class="typenum" onchange="changeF(this)" size="10"
                        style="display:none;">`;
            let middle = "";
            let end = `</select></div></div>`;
            object.options.forEach(function (option) {
                if (option.select) {
                    middle += `<option value ="${option.value}" selected>${option.name}</option>`;
                } else {
                    middle += `<option value ="${option.value}">${option.name}</option>`;
                }
            });
            content += begin + middle + end;
        });
        result += start + content + end;

        let parentName = document.getElementById(parentId);
        $(parentName).append(result);
    };
    //选择按钮
    _that.selectBtn = null;
}

//预加载事件
$(function () {
    //选取selected的默认值
    //父级元素
    let parentId = $(".parentWrap select");
    let parentOptionVal = parentId.find("option:selected").text();
    parentId.prev().val(parentOptionVal);
    //子级元素
    let childId = $(".children select");
    let childOptionVal = [];
    for (var i = 0; i < childId.length; i++) {
        childOptionVal.push(childId.eq(i).find("option:selected").text());
        childId.eq(i).prev().val(childOptionVal[i])
    }
    //模糊查询时，使用的数组。
    TempArr = [];
    parentId.find("option").each(function (index) {
        TempArr[index] = $(this).text();
    });
});

//判断select的有无
$(document).bind('click', function (e) {
    var e = e || window.event; //浏览器兼容性
    var elem = e.target || e.srcElement;
    while (elem) { //循环判断至跟节点，防止点击的是div子元素
        if (elem.id && (elem.id.indexOf('typenum') !== -1 || elem.id.indexOf('makeupCo') !== -1)) {
            return;
        }
        elem = elem.parentNode;
    }
    $(this).find("select").css('display', 'none'); //点击的不是div或其子元素
});

//select的option改变时，触发的函数
function changeF(this_) {
    var optionVal = $(this_).find("option:selected").text();
    $(this_).prev("input").val(optionVal);
    let optionArr = [];
    //    在统一选中的情况下，
    if ($("#unified").attr("checked")) {
        $(".childWrap").find("input").val(optionVal);
        $(".childWrap select option").each(function (index) {
            optionArr[index] = $(this).text();
            if(optionVal===optionArr[index]){
                $(this).attr("selected","true");
                $(this).siblings().removeAttr("selected");
            }
        });
    }
    $(this_).css({"display": "none"});
}

//输入框获取焦点出发的函数
function setFocus(this_) {
    var select = $(this_).next();
    select.css({"display": ""});
    $(this_).parents(".childWrap").siblings().find("select").css({"display": "none"});
}

//在输入框输入时，模糊检索
function setInput(this_) {
    var select = $(this_).next();
    select.html("");
    for (let i = 0; i < TempArr.length; i++) {
        if (TempArr[i].indexOf(this_.value) !== -1) {
            var option = $("<option></option>").text(TempArr[i]);
            select.append(option);
        }
    }
}

//统一选框的处理逻辑
function unified(this_) {
    if ($(this_).is(":checked")) {
        $(".childWrap").find("input").attr("disabled", "disabled");
        $(".parentWrap").find("input:first").removeAttr("disabled");
        let parentId=$(".parentWrap").find("input:first").val();
        $(".childWrap").find("input").val(parentId);
        $(".childWrap select option").each(function () {
            if(parentId===$(this).text()){
                $(this).attr("selected","true");
                $(this).siblings().removeAttr("selected");
            }
        });
    } else {
        $(".childWrap").find("input").removeAttr("disabled");
        $(".parentWrap").find("input:first").attr("disabled", "disabled");
    }
}

//展开闭合逻辑
function arrowToggle(this_) {
    if ($(this_).attr("isDropDown") == "false") {
        $(".children").slideDown();
        $(this_).css("background-image", "url(xia.png)");
        $(this_).attr("isDropDown", "true");
    } else {
        $(".children").slideUp();
        $(this_).css("background-image", "url(shang.png)");
        $(this_).attr("isDropDown", "false");
    }
}

//选择按钮逻辑
function selectButton() {
    boardControl.selectBtn();
}
