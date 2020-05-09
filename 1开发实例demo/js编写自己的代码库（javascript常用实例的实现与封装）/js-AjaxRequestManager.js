/*  ajax管理器思想  传统是按照浏览器队列处理ajax请求,请求比较多时不会区分请求的优先级，应该比较快速反应的请求有可能排列在队列后面，管理器核心功能根据请求优先级排列请求执行的顺序
 *
 *执行过程
 * 传递函数一个请求对象，函数将请求对象添加优先级属性然后 加入包含所有请求的数组items，数组根据优先级排列内部请求对象的顺序，定时检查
 * 正在执行的请求数组_active,是否有执行完毕的对象（对象属性 .otransport.readystate==4）,
 * 如果_active内请求数小于两个则在items内取出排好顺序的第一个对象并加入ajax的属性执行通信,放在_active数组内，
 *
 * */





 //列表数据结构 构造函数
function PriorityQueue(fnCompare) {
    this._items = new Array();
    if (typeof fnCompare == "function"){
        this._compare = fnCompare;
    }
}

PriorityQueue.prototype = {
    //默认的升序排列items数组的函数，可在构造函数自定义覆盖
    _compare : function (oValue1, oValue2) {
        if (oValue1 < oValue2) {
            return -1;
        } else if (oValue1 > oValue2) {
            return 1;
        } else {
            return 0;
        }
    },
     //从items数组中取出第一项并删除
    get : function() {
        return this._items.shift();
    },
    //从item数组中读取第 iIndex项
    item : function (iIndex) {
        return this._items[iIndex];
    },
     //读取items数组内第一项
    peek : function () {
        return this._items[0];
    },
     //升序排列items数组
    prioritize : function () {
        this._items.sort(this._compare);
    },
    //items数组从末尾加入一个新的项，然后执行升序操作
    put : function (oValue) {
        this._items.push(oValue);
        this.prioritize();
    }, 
      //从items数组中删除值为oValue的项
    remove : function (oValue) {
        for (var i=0; i < this._items.length; i++) {
            if (this._items[i] === oValue) {
                this._items.splice(i, 1);
                return true;
            }
        }
        return false;
    },
     //返回items数组的长度
    size : function () {
        return this._items.length;
    }

};


/****************************************以上priority queue js*******************************************************/
/****************************************以下request Manager js*******************************************************/


/*用于处理多请求短时间内多请求问题，取代js自然请求队列，创建根据优先级方法执行的有序队列*//*几乎同时发送的请求确定顺序*/
/*具体功能：处理多请求有序进行，保证同时进行的请求数是两个以内（包含2个）*/

var RequestManager = function () {

    var oManager = {
    
        //---------------------------------------------------------------------
        // Constants
        //---------------------------------------------------------------------        
    
        /**
         * Maximum age for a priority before it must be promoted.
         * @type int
         */
        AGE_LIMIT : 60000,
        
        /**
         * Default priority to use if one is not provided.
         * @type int
         */
        DEFAULT_PRIORITY: 10,        
        
        /**
         * The number of milliseconds to check to the active requests.
         * @type int
         */
        INTERVAL : 250,
    
        //---------------------------------------------------------------------
        // Protected Properties
        //---------------------------------------------------------------------

        /**
         * Array of active requests.
         * @type Array
         */
        _active : new Array(),
        
        /**
         * Queue of pending requests.
         * @type PriorityQueue
         */
          //初始化数据结构对象，一个新的PriorityQueue，内部items排序方法为升序
        _pending: new PriorityQueue(function (oRequest1, oRequest2) {
            return oRequest1.priority - oRequest2.priority;
        }),
        
        //---------------------------------------------------------------------
        // Protected Methods
        //---------------------------------------------------------------------
        
        /**
         * Searches through the pending requests for those that need to be
         * promoted and upgrades their priority.
         */

        //将优先级低的但是超出时间限定的队列提前
        _agePromote : function() {
            for (var i=0; i < this._pending.size(); i++) {
                var oRequest = this._pending.item(i);
                oRequest.age += this.INTERVAL;     //修改时修改oRequest对象本身，而非引用oRequest对象的局部变量oRequest
                if (oRequest.age >= this.AGE_LIMIT){
                    oRequest.age = 0;  //归零总的请求等待时间
                    oRequest.priority--;  //增加此次请求优先级
                }
            }
            this._pending.prioritize();   // 根据优先级排列执行顺序
        },
                
       /**
         * Checks active requests to see if any are complete. //查看是否有执行完毕的_active数组内请求，如果有则在active删除，然后根据status执行对应的函数
         */
        _checkActiveRequests : function () {
        
            var oRequest = null;
            var oTransport = null;

            for (var i=this._active.length-1; i >= 0; i--) {
                oRequest = this._active[i];
                oTransport = oRequest.transport;
                if (oTransport.readyState == 4) {
                    oRequest.active = false;
                    this._active.splice(i, 1);        
                    var fnCallback = null;          
                    if (oTransport.status >= 200 && oTransport.status < 300) {  //请求成功
                        if (typeof oRequest.onsuccess == "function") {
                            fnCallback = oRequest.onsuccess;
                        }
                    } else if (oTransport.status == 304) {  //应用缓存
                        if (typeof oRequest.onnotmodified == "function") {
                            fnCallback = oRequest.onnotmodified;
                        }
                    } else {
                        if (typeof oRequest.onfailure == "function") {  //请求失败
                            fnCallback = oRequest.onfailure;
                        }
                    }  
					/*回掉函数，传入对象包含参数:请求状态 status,请求返回的数据data,请求的XMLHttpRequest的对象request*/
                    if (fnCallback != null) {
                        setTimeout((function (fnCallback, oRequest, oTransport) { //setTimeout 构建一个闭包结构，放到本次检测轮询所有执行队列之后执行，保存oRequest oTransport等独有参数//  避免其它请求对当前请求的参数更换错误
                            return function (){
                                fnCallback.call(oRequest.scope||window, { 
                                    status : oTransport.status, 
                                    data : oTransport.responseText, 
                                    request : oRequest});
                            }
                        })(fnCallback, oRequest, oTransport), 1);
                    }
    
                }
            }        
        
        },
        
        /*
         * Creates an appropriate XHR object depending on browser capabilities.
         * @type XMLHttpRequest
         */
        _createTransport : function (){
            if (typeof XMLHttpRequest != "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject != "undefined") {
                var http = null;      
                try {
                    http = new ActiveXObject("MSXML2.XmlHttp.6.0");
                    return http;
                } catch (ex) {
                    try {
                        http = new ActiveXObjct("MSXML2.XmlHttp.3.0");
                        return http;
                    } catch (ex2) {
                        throw Error("Cannot create XMLHttp object.");
                    }
                }            
            }                
        },
        
        /**
         * Sends the next pending request.
         */
        _sendNext : function () {
            if (this._active.length < 2) {
                var oRequest = this._pending.get();
                if (oRequest != null) {
                    this._active.push(oRequest);
                    oRequest.transport = this._createTransport();
                    oRequest.transport.open(oRequest.type, oRequest.url, true);

                      //oRequest.transport.setRequestHeader("Content-Type", "application/json; charset=utf-8"); //请求json数据类型
                    //oRequest.transport.setRequestHeader('Content-type','application/x-www-form-urlencoded');

                    oRequest.transport.send(oRequest.data);
                    oRequest.active = true;
                }
            }
            
        },
                
        //---------------------------------------------------------------------
        // Public Methods
        //---------------------------------------------------------------------
        
        /** 
         * Cancels the given request, removing it from the pending or active lists.
         * @param {Request} oRequest The request decription object to cancel.
         */
        cancel : function (oRequest) {
            if (!this._pending.remove(oRequest)){
            
                oRequest.transport.abort();
                
                if (this._active[0] === oRequest) {
                    this._active.shift();
                } else if (this._active[1] === oRequest) {
                    this._active.pop();
                }
                
                if (typeof oRequest.oncancel == "function") {
                    oRequest.oncancel.call(oRequest.scope||window, { 
                        request : oRequest});   
                }          
                
            }
        },
        
        /**
         * Executes a request for Periodic Refresh.定期刷新的优先级为3
         * @param {Request} oRequest The request decription object to send.
         */
        poll : function (oRequest) {
            oRequest.priority = 3;
            this.send(oRequest);
        },

        /**
         * Executes a request for Predictive Fetch or Multi-Stage Download. 预先下载 或多阶段下载5
         * @param {Request} oRequest The request decription object to send.
         */
        prefetch : function (oRequest) {
            oRequest.priority = 5;
            this.send(oRequest);
        },
        
        /**
         * Places the given request into the pending queue to be sent.
         * @param {Request} oRequest The request decription object to send.
         */
        send : function (oRequest) {
            if(typeof oRequest.priority != "number"){
                oRequest.priority = this.DEFAULT_PRIORITY;
            }
            oRequest.active = false;
            oRequest.age = 0;
            this._pending.put(oRequest);
        },
        
        /**
         * Places a high-priority request for a user action. 用户操作 最高优先级0
         * @param {Request} oRequest The request decription object to send.
         */
        submit : function (oRequest) {
            oRequest.priority = 0;
            this.send(oRequest);
        },

        /**
         * Places a submission throttling request.提节流方式的ajax请求2
         * @param {Request} oRequest The request decription object to send.
         */
        submitPart : function (oRequest) {
            oRequest.priority = 2;
            this.send(oRequest);
        }

    
    
    };    
    
    //setup interval to check everything
    setTimeout(function () {
        RequestManager._checkActiveRequests();
        RequestManager._sendNext();
        RequestManager._agePromote();
        setTimeout(arguments.callee, RequestManager.INTERVAL);
    }, oManager.INTERVAL);


    //return the object
    return oManager;

}();




