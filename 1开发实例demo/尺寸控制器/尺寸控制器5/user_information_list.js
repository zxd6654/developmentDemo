/**
 * 右侧用户选择信息显示模块 js
 */
GoodStyleModel.UserInforList = {
    doc: document,
    userLoginBtn: null,
    userRegister: null,
    userShoppingCart: null,
    priceTag: null,
    buyBtn: null,
    shoppingCarBtn: null, //加入购物车按钮
    articleNameTag: null,
    widthTag: null,
    heightTag: null,
    depthTag: null,
    exteriorsCont: null,
    actionsCont: null,
    boardCont: null,
    fittingCont: null,

    //设置家具价格
    setPrice: function (price) {
        this.priceTag.innerHTML = price;
    },
    //设置家具名称
    setArticleName: function (name) {
        this.articleNameTag.innerHTML = name;
    },
    //宽度
    setWidthTag: function (width) {
        this.widthTag.innerHTML = width;
    },
    //高度
    setHeightTag: function (height) {
        this.heightTag.innerHTML = height;
    },
    //深度
    setDepthTag: function (depth) {
        this.depthTag.innerHTML = depth;
    },
    //外观
    setExteriorTag: function (name) {
        var li = this.doc.createElement("li");
        li.innerHTML = name;
        this.exteriorsCont.appendChild(li);
    },
    clearExterior: function () {
        this.exteriorsCont.innerHTML = "";
    },
    //功能
    setActionTag: function (action) {
        var li = this.doc.createElement("li");
        li.innerHTML = action;
        this.actionsCont.appendChild(li);
    },
    clearAction: function () {
        this.actionsCont.innerHTML = "";
    },
    //板材
    setBoardTag: function (board) {
        var li = this.doc.createElement("li");
        li.innerHTML = board;
        this.boardCont.appendChild(li);
    },
    clearBoard: function () {
        this.boardCont.innerHTML = "";
    },
    //五金
    setFittingTag: function (fitting) {
        var li = this.doc.createElement("li");
        li.innerHTML = fitting;
        this.fittingCont.appendChild(li);
    },
    clearFitting: function () {
        this.fittingCont.innerHTML = "";
    },
    //立即购买按钮点击事件 //函数 fn  ，fn作用域scopeObj ，fn接受的参数argArr
    setBuyBtnAction: function (fn, scopeObj, argArr) {
        this.buyBtn.onclick = function () {
            fn.apply(scopeObj, argArr);
        }
    },
    //加入购物车按钮点击事件 //函数 fn  ，fn作用域scopeObj ，fn接受的参数argArr
    setShoppingCarAction: function (fn, scopeObj, argArr) {
        this.shoppingCarBtn.onclick = function () {
            fn.apply(scopeObj, argArr);
        }
    },
    //用户登陆按钮点击事件
    loginBtnAction: function (fn, scope, argArr) {
        this.userLoginBtn.onclick = function () {
            fn.apply(scope, argArr);
        }
    },
    registerBtnAction: function (fn, scope, argArr) {
        this.userRegister.onclick = function () {
            fn.apply(scope, argArr);
        }
    },
    shoppingCartAction: function (fn, scope, argArr) {
        this.userShoppingCart.onclick = function () {
            fn.apply(scope, argArr);
        }
    },

    initUserInforBlock: function () {
        this.userLoginBtn = this.doc.getElementById("user-login");
        this.userRegister = this.doc.getElementById("user-regist");
        this.userShoppingCart = this.doc.getElementById("user-shopping-cart");
        this.priceTag = this.doc.getElementById("model-page-calculate-price");
        this.buyBtn = this.doc.getElementById("model-page-buy-btn");
        this.shoppingCarBtn = this.doc.getElementById("model-page-chargecar-btn"); //加入购物车按钮
        this.articleNameTag = this.doc.getElementById("article-name-tag");
        this.widthTag = this.doc.getElementById("model-page-width-value");
        this.heightTag = this.doc.getElementById("model-page-height-value");
        this.depthTag = this.doc.getElementById("model-page-depth-value");
        this.exteriorsCont = this.doc.getElementById("extrior-infor-container");
        this.actionsCont = this.doc.getElementById("action-infor-container");
        this.boardCont = this.doc.getElementById("board-infor-container");
        this.fittingCont = this.doc.getElementById("fitting-infor-container");
    }, //设置外观列表
    setExteriorBlockInfor: function (articleJson,exteriorId) {
        //设置信息列表
        var articleBoardStyles=articleJson.article_board_styles;
        var exteriorItem= GoodStyleModel.Jsonreader.getObjectThroughValue(articleBoardStyles,"id",exteriorId);
        var exteriorName= exteriorItem.name;
        GoodStyleModel.UserInforList.clearExterior();//清空外观列表
        GoodStyleModel.UserInforList.setExteriorTag(exteriorName); //设置外观列表
    },
    //设置功能定制 信息列表  //target为点击按钮
    setActionBlockInfor: function (ArticleObj, RoomUnitObj) {
        var articleTags = [];
        if( ArticleObj.frame.room_unit_range &&  ArticleObj.frame.room_unit_range.length!=0 ){

            var roomUnitRange = ArticleObj.frame.room_unit_range;

            for (var prop in RoomUnitObj) {

                var roomObj = GoodStyleModel.Jsonreader.getObjectThroughValue(roomUnitRange, "room_id", prop);
                var curRoomUnitRange = roomObj.unit_range;
                var curUnit = GoodStyleModel.Jsonreader.getObjectThroughValue(curRoomUnitRange, "id", RoomUnitObj[prop]);
                var unitTag = curUnit.tag;
                for (var i = 0, len = unitTag.length; i < len; i++) {
                    var curtag = unitTag[i];
                    var tagName=curtag.name;
                    if (!GoodStyleModel.Jsonreader.hasValue(articleTags, tagName)) {
                        articleTags.push(tagName);
                    }
                }
            }

        }else{

            var ActionListObjectArr = ArticleObj.article_unit_styles;
            var curArticleUnitStyle=GoodStyleModel.Jsonreader.getObjectThroughValue(ActionListObjectArr,"id",GoodStyleModel.DataRequestManager.curNormalActionId);
            var tagArr=curArticleUnitStyle.tag;
            for (var n = 0, lenn = tagArr.length; n < lenn; n++) {
                articleTags.push(tagArr[n].name);
            }
        }

        GoodStyleModel.UserInforList.clearAction();
        for(var j= 0,lenj=articleTags.length;j<lenj;j++){
            GoodStyleModel.UserInforList.setActionTag(articleTags[j]);
        }

    },
    //获取五金信息
    changeArticleFittingItem: function (articleObj, fittingStyleId) {
        var fitttingStyleObjArr = articleObj.article_fitting_styles;
        var fittingObj = GoodStyleModel.Jsonreader.getObjectThroughValue(fitttingStyleObjArr, "id", fittingStyleId);
        var fittingName = fittingObj.name;
        GoodStyleModel.UserInforList.clearFitting();
        GoodStyleModel.UserInforList.setFittingTag(fittingName);
    },
    initAllUserListInformation:function(articleObj,object){//object->{price:price,name:name,width:width,height:height,depth:depth,exteriorId:exteriorId,roomUnitObj:roomUnitObj,fittingStyleId:fittingStyleId}
        this.initUserInforBlock(); //初始化使用的页面元素
        this.setPrice(object.price);
        this.setArticleName(object.name);
        this.setWidthTag(object.width);
        this.setHeightTag(object.height);
        this.setDepthTag(object.depth);
        this.clearExterior();
        this.setExteriorBlockInfor(articleObj,object.exteriorId);
        this.clearAction();
        this.setActionBlockInfor(articleObj,object.RoomUnitObj);
        this.clearFitting();
        this.changeArticleFittingItem(articleObj,object.fittingStyleId);
        this.initBuyBtnClick();
        this.initShoppingCarClick();
    },
    inforMationListBtnDealer:function(url){
        GoodStyleModel.UserModelData.saveModelData(url); //确保this 指向对象本身
    },

    //初始化点击购买按钮执行的事件
    initBuyBtnClick:function(){
        GoodStyleModel.UserInforList.setBuyBtnAction(this.inforMationListBtnDealer, null, ["/to/make/order/by/design/data"]);
    },
    //初始化点击加入购物车执行的事件
    initShoppingCarClick:function(){
        GoodStyleModel.UserInforList.setShoppingCarAction(this.inforMationListBtnDealer, null, ["/shopping/cart/add/by/design/data"]);
    }

};





//以下为测试使用
/*
GoodStyleModel.UserInforList.setArticleName("2016新款鞋柜");
GoodStyleModel.UserInforList.setPrice(4000);
GoodStyleModel.UserInforList.setWidthTag(1200);
GoodStyleModel.UserInforList.setHeightTag(1200);
GoodStyleModel.UserInforList.setDepthTag(1200);

GoodStyleModel.UserInforList.clearExterior();
GoodStyleModel.UserInforList.setExteriorTag("旗红");

GoodStyleModel.UserInforList.clearAction();
GoodStyleModel.UserInforList.setActionTag("路由器");
GoodStyleModel.UserInforList.setActionTag("雨伞");

GoodStyleModel.UserInforList.clearBoard();
GoodStyleModel.UserInforList.setBoardTag("实木板材");
GoodStyleModel.UserInforList.setBoardTag("胶合板材");

GoodStyleModel.UserInforList.clearFitting();
GoodStyleModel.UserInforList.setFittingTag("海福乐五金");
GoodStyleModel.UserInforList.setFittingTag("欧莱雅五金");

GoodStyleModel.UserInforList.setBuyBtnAction(speak, null, ["立即购买"]);
GoodStyleModel.UserInforList.setShoppingCarAction(say, null, ["加入购物车"]);

function speak(m) {
    alert(m);
}
function say(m) {
    alert(m);
}
*/
