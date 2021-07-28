function XAjaxRequester(bool) {
    this.openTempData = ( typeof bool === "boolean" ) ? bool : true; //不设置bool时默认打开
    this.tempSaveData = {};
}

XAjaxRequester.prototype = {
    get: function (url, data, successCallBack, failureCallBack) { //包含参数的url
        var _self = this;
        //请求数据 至少请求三次
        if (typeof data == "object") {
            url = this.encodeGetData(url, data);
        } else {
            console.error("传入参数格式错误!需要传入对象参数！");
            return;
        }

        var sendCount = 0,
            xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if ((this.status >= 200 && this.status < 300) || this.status == 304) {
                    /* var res = JSON.parse(this.responseText);*/
                    var res = this.responseText;
                    if (typeof  successCallBack == "function") {
                        successCallBack.call(this, res);
                        _self.saveToLocalData(url, res);//加入缓存
                    }
                }
                else {
                    if (++sendCount < 3) { //额外请求2次作为请求的补充 //网站约定返回400时重新请求token;
                        xhr.open("get", url, true);
                        xhr.send(null);
                    } else {
                        if (typeof  failureCallBack == "function") {
                            failureCallBack.call();
                        }
                    }
                }
            }
        };

        if (this.openTempData && (data == this.getLocalStorage(url))) {
            successCallBack(data);
        } else {
            xhr.open("get", url, true);
            xhr.send(null);
        }
    },
    saveToLocalData: function (url, data) {
        if (window.sessionStorage) {
            window.sessionStorage.setItem(url, data);
        } else {
            this.tempSaveData[url] = data; //加入缓存
        }

    },
    getLocalStorage: function (url) {
        if (window.sessionStorage) {
            return window.sessionStorage.getItem(url);
        } else {
            return this.tempSaveData[url]; //加入缓存
        }

    },

//ajax get请求参数encode处理
    encodeGetData: function (urlStr, dataObject) {

        for (var prop in dataObject) {
            var encodeProp = encodeURIComponent(prop);   //encodeURIComponent() 函数可把字符串作为 URI 组件进行编码。
            var encodeValue = encodeURIComponent(dataObject[prop]);
            urlStr += (urlStr.indexOf("?") == -1 ? "?" : "&");
            var dataStr = encodeProp + "=" + encodeValue;
            urlStr += dataStr;
        }
        return urlStr;
    },
    post: function (url, data, successCallBack, failureCallBack, header) {

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if ((this.status >= 200 && this.status < 300) || this.status == 304) {
                    if (typeof successCallBack == "function") {
                        successCallBack.call(this, this.responseText);
                    }
                } else {
                    if (typeof failureCallBack == "function") {
                        failureCallBack.call(this, this.responseText);
                    }
                }
            }
        };
        xhr.open("post", url, true);
        //设置头信息
        if (header) {
            for (var prop in header) {
                this.setRequestHeader(prop, header[prop]);
            }
        } else {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        xhr.send(data);
    },
//处理post data数据
    encodePostData: function (dataObj) {
        var dataStrArr = [];
        for (var prop in dataObj) {
            var property = encodeURIComponent(prop);
            var value = encodeURIComponent(dataObj[prop]);
            var dataStr = property + "=" + value;
            dataStrArr.push(dataStr);
        }
        return dataStrArr.join("&");
    },
    setRequestHeader: function (name, value) {
        if (typeof name === "string" && typeof value === "string") {
            xhr.setRequestHeader(name, value);
        }
    }
//ajax get请求参数encode处理
};


//不包含缓存的ajax请求函数
AjaxObject = {
    // 回调函数可选 可不选
    get: function (url, data, successCallBack, failureCallBack) { //包含参数的url

        //请求数据 至少请求三次
        if (typeof data == "object") {
            url = this.encodeGetData(url, data);
        } else {
            console.error("传入参数格式错误!需要传入对象参数！");
        }
        var sendCount = 0;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if ((this.status >= 200 && this.status < 300) || this.status == 304) {
                    var res = JSON.parse(this.responseText);
                    if (typeof   successCallBack == "function") {
                        successCallBack(res);
                    }
                } else {
                    if (++sendCount < 3) { //额外请求2次作为请求的补充
                        // console.log(url);
                        xhr.open("get", url, true);
                        xhr.send(null);
                    } else {
                        if (typeof  failureCallBack == "function") {
                            failureCallBack();
                        }

                    }
                }
            }
        };
        xhr.open("get", url, true);
        xhr.send(null);

    },
//ajax get请求参数encode处理
    encodeGetData: function (urlStr, dataObject) {

        for (var prop in dataObject) {
            var encodeProp = encodeURIComponent(prop);
            var encodeValue = encodeURIComponent(dataObject[prop]);
            urlStr += (urlStr.indexOf("?") == -1 ? "?" : "&");
            var dataStr = encodeProp + "=" + encodeValue;
            urlStr += dataStr;
        }
        return urlStr;
    }

};
