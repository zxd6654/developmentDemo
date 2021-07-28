/**
 * jsonReader
 */
//json数据读取模块

window.JsonReader = {
    //复制一个常规的对象
    copyNormalObject: function (obj) {
        var newObj = {};
        for (var prop in obj) {
            newObj[prop] = obj[prop];
        }
        return newObj;
    },
    //比较两个简单的常规对象是否一样
    compareObj: function (obj1, obj2) {
        var equal = true;
        for (var prop in obj1) {
            if (obj1[prop] != obj2[prop]) {
                equal = false;
                break;
            }
        }
        for (var prop in obj2) {
            if (obj2[prop] != obj1[prop]) {
                equal = false;
                break;
            }
        }
        return equal;
    },
//在对象数组(对象组成的数组)查找对应的对象 // 通过属性和属性值查找//寻找包含相应属性和属性值 的对象
    getObjectThroughValue: function (objectArr, property, value) { //有属性且属性等于value
        for (var i = 0, len = objectArr.length; i < len; i++) {
            var object = objectArr[i];  //引用的对象
            if (typeof object[property] != "undefined" && object[property] == value) {
                return object;
            }
        }
    },

//在对象中读出一组属性 // 根据一组属性名读出
// 一组属性值  //传入的值是读值的对象和 需要的属性组成的数组
    getValuesOfProperties: function (object, propertiesArr) {
        var valuesArr = [];
        for (var i = 0, len = propertiesArr.length; i < len; i++) {
            var prop = propertiesArr[i];
            if (typeof object[prop] !== "undefined") {
                valuesArr.push(object[prop]);
            }
            else {
                valuesArr.push("undefined");
            }
        }
        return valuesArr;
    },

//在一组对象里读出某一个公共包含的属性 //返回一个数组 //例如读出一组room对象里的room_id
    getPropertyValueInObjects: function (objectArr, property) {
        var ValuesOfProps = [];
        var len = objectArr.length;
        for (var i = 0; i < len; i++) {
            var object = objectArr[i];
            if (typeof object[property] !== "undefined") {
                ValuesOfProps.push(object[property]);
            }
            else {
                console.log("getPropertyValueInObjects读取失败，有的对象不包含公共属性:" + property);
                return;
            }
        }
        return ValuesOfProps;

    },
    //判断一个对象数组里的所有对象 是否包含了某个名值对（某一个包含即可） //返回boolean
    objectArrHasPropValue: function (objArr, prop, value) {
        var hasPropValue = false;
        for (var i = 0, len = objArr.length; i < len; i++) {
            var curObj = objArr[i];
            if (curObj[prop] == value) {
                hasPropValue = true;
                break;
            }
        }
        return hasPropValue;
    },
//将一些名值对加入某个{}
    addValueToObj: function (prop, value, object) {  //pro属性名 value属性值 //返回值是{}
        if (typeof prop !== "uncefined" && typeof value !== "undefined") {
            object[prop] = value;
        }
    },
    getPropertyOfObject: function (object, property) {
        return object[property];
    },
//判断对象是否是空对象
    isEmptyObject: function (object) {
        for (var prop in object) {
            return true;
        }
        return false;
    },

//判断数组是否有某项 //用于功能模块的筛选功能
    hasValue: function (arr, val) {
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            if (arr[i] === val) {
                return true;
            }
        }
        return false;
    },
//获取arr2 在arr1小数组内的项  //用于将arr2内在数组arr1内的数组显示 不在的不显示  //用于功能模块的筛选功能
    arrFilter: function (arr1, arr2) {
        var storage = [];
        for (var i = 0, len = arr1.length; i < len; i++) {
            for (var j = 0, len1 = arr2.length; j < len; j++) {
                if (arr2[j] == arr[i]) {
                    storage.push(arr2[j]);
                }
            }
        }
        return storage;	 //返回一个数组
    },

//unused
//将数组arr的内容存放在storageArr数组中
    restoreArr: function (arr, storageArr) {
        for (var i = 0, len = arr.length; i < len; i++) {
            storageArr.push(arr[i]);
        }
    },
    //数组升序排列方法
    compare: function (a, b) {
        if (a > b) {
            return 1;
        } else {
            return -1;
        }
    },
//数组存储函数
    storeArr: function (functionArr, storage) {
        var len = functionArr.length;
        for (var i = 0; i < len; i++) {
            storage.push(arr[i]);
        }
    },
//判断数组是否有某个非引用类型的数据值
    ArrHasValue: function (arr, value) {
        if (!arr instanceof Array) {
            console.error("传入的arr参数不是数组！");
        }
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] == value) {
                return arr[i];
            }
        }
        return false;
    }
};

//页面url
GetURLInfo = {
    //获取url内第一个参数
    getURLSingleParam: function () {
        var url = window.location.href;
        var idStr = url.split("?")[1];
        if (idStr.indexOf("&") != -1) {
            var idStr = idStr.split("&")[0];
        }
        return idStr.split("=")[1];
    },
    getParamThroughName: function (paramName) {
        var params = {};
        var url = window.location.href;
        if (url.indexOf("?") != -1) {
            var idStr = url.split("?")[1];
            if (idStr.indexOf("&") != -1) {
                idValueArr = idStr.split("&");
                for (var i = 0, len = idValueArr.length; i < len; i++) {
                    params[decodeURIComponent(idValueArr[i].split("=")[0])] = decodeURIComponent(idValueArr[i].split("=")[1]);
                }
            } else {
                params[decodeURIComponent(idStr.split("=")[0])] = decodeURIComponent(idStr.split("=")[1]);
            }
            if (params[paramName]) {
                console.log(JSON.stringify(params));
                return params[paramName];
            }
        }
    }
};
