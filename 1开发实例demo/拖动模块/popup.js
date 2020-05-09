// alert弹出框(无确定按钮)
// popupValue:提示内容
function CommonPopup(popupValue,callback){
	$("#common-popup").show();
	$("#allpage-disabled-common-popup").show();
	$("#popup-info").html(popupValue);
	$(".popup-close").unbind("click").bind("click",function(){
		CommonPopupClose();
		if(typeof callback==="function"){
    		callback();
    	}
	});
	setTimeout(function () {
        CommonPopupClose();
        if(typeof callback==="function"){
    		callback();
    	}
    },2000)
}
function CommonPopupClose(){
	$("#common-popup").fadeOut(0);
    $("#allpage-disabled-common-popup").fadeOut(0);
    $("#popup-info").html("");
}

// alert弹出框(有确定按钮)
// popupValue:提示内容
function CommonAlert(alertValue,callback){
	$("#common-alert").show();
	$("#allpage-disabled-common-popup").show();
	$("#alert-info").html(alertValue);
	$(".alert-yes,#alert-close").unbind("click").bind("click",function(){
		CommonAlertClose();
		if(typeof callback==="function"){
    		callback();
    	}
	})
}
function CommonAlertClose(){
	$("#common-alert").fadeOut(0);
    $("#allpage-disabled-common-popup").fadeOut(0);
    $("#alert-info").html("");
}


// alert弹出框(自动消失)
// function CommonReminder(){

// }

// confirm确认框
// 点击确认执行回调函数
function CommonConfirm(confirmValue,callback1,callback2,callback1Val,callback2Val){
	$("#common-confirm").show();
	$("#allpage-disabled-common-popup").show();
	$("#confirm-info").html(confirmValue);
	$(".confirm-yes").html("确定");
	$(".confirm-no").html("取消");
	$("#common-confirm button").unbind("click").bind("click",function(){
		CommonConfirmClose();
	    if($(this).html()=='确定'){
			if(typeof callback1==="function"){
	    		callback1(callback1Val);
	    	}
	    }else{
			if(typeof callback2==="function"){
	    		callback2(callback2Val);
	    	}
	    }
	})
	$('#confirm-close').unbind("click").bind('click',function(){
		CommonConfirmClose();
		if(typeof callback2==="function"){
    		callback2(callback2Val);
    	}
	})
}
// 自定义按钮内容，分别执行不同的回调函数
function CommonConfirmAdvance(confirmValue,btnvalue1,btnvalue2,callback1,callback2,callback1val,callback2val,callback3){
	$("#common-confirm").show();
	$("#allpage-disabled-common-popup").show();
	$("#confirm-info").html(confirmValue);
	$(".confirm-yes").html(btnvalue1);
	$(".confirm-no").html(btnvalue2);
	$("#common-confirm button").unbind("click").bind("click",function(){
		if($(this).html()==$.trim(btnvalue1)){
			if(typeof callback1==="function"){
				callback1(callback1val);
			}
		}else{
			if(typeof callback2==="function"){
	    		callback2(callback2val);
	    	}
		}
		CommonConfirmClose(callback3);
	});
	$('#confirm-close').unbind("click").bind('click',function(){
		CommonConfirmClose(callback3);
	})
}
function CommonConfirmClose(callback){
	$("#common-confirm").fadeOut(0);
    $("#allpage-disabled-common-popup").fadeOut(0);
    if(typeof callback==="function"){
    	callback();
    	console.log(1);
    }
}

//普通弹框
// element:弹框dom节点
function ShowCommonPopup(popElement,callback){
	if(typeof callback==="function"){
		callback();
	}
	$(popElement).fadeIn();
	$("#allpage-disabled").fadeIn();
}

function HideCommonPopup(popElement,callback){
	$(popElement).fadeOut(0);
	$("#allpage-disabled").fadeOut(0);
	if(typeof callback==="function"){
		callback();
	}
}


// 手机端翻页效果弹窗
function ShowMobilePopup(showElement,HideElement,callback){
	if(typeof callback==="function"){
		callback();
	}
	$(showElement).show();
	$(HideElement).hide();
}

function HideMobilePopup(showElement,HideElement,callback){
	$(showElement).hide();
	$(HideElement).show();
	if(typeof callback==="function"){
		callback();
	}
}
