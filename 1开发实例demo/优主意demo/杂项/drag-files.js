/**
 * 拖拽上传插件，无依赖文件
 *
 *  var dragUpload = new DragUpload();
 * dragUpload.init({
 *        innerStatusId: "", //设置百分比宽度的进度条
 *        submitBtnId: "",  //确认上传文件按钮,点击后上传文件
 *        dropTargetId: "", //文件拖放的目标元素
 *        fileInfoListShowerId: "",  //拖放文件到目标后显示文件信息的元素
 *        url:"" //上传文件的后台地址
 *        upLoadedDeal: function () {  //上传文件完毕后执行的函数
 *            console.log("uploaded!");
 *        }
 *    });
 */
function DragUpload() {
    this.doc = document;
    this.outerStatus = null;
    this.innerStatus = null;
    this.submitBtn = null;
    this.dropEle = null;
    this.percent = 0;
    this.url = "";
    this.span = null;//      var span = document.getElementById("file-info");
    this.formData = null;
}
DragUpload.prototype = {
    constructor: "DragUpload",
    //获取拖拽文件
    getDragFiles: function (e) {
        var dt = e.dataTransfer;
        var files = dt.files;
        var str = "";
        this.formData = new FormData();
        for (var i = 0, len = files.length; i < len; i++) {
            this.formData.append("file" + i, files[i]);
            str += "fileName:" + files[i].name + "fileType" + files[i].type + "filesize:" + files[i].size + "</br>";
        }
        this.span.innerHTML = str;//显示拖拽文件的信息
        e.preventDefault();
    },
    //文件上传函数
    uploadFile: function () {
        var _self = this;
        var totalSize = 0, loaded = 0, percent = 0;
        var xhr = new XMLHttpRequest();
        xhr.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                console.log("process");
                totalSize = e.total;
                loaded = e.loaded;
                percent = loaded / totalSize * 100;
                _self.uploadStatus(percent);
            }
        };
        xhr.upload.onload = function (e) {
            //上传完毕执行事件
            if (typeof _self.uploadedDeal == "function") {
                _self.uploadStatus(100);
                _self.uploadedDeal();

            }
        };
        xhr.open("post", this.url, true);
        xhr.send(this.formData);
    },
    //设置上传进度显示
    uploadStatus: function (percent) {
        this.innerStatus.style.width = percent + "%";
    },
    //使用初始化
    init: function (obj) {

        // this.outerStatus = null;//进度条外部
        var _self = this;
        this.innerStatus = this.doc.getElementById(obj.innerStatusId);//上传进度条内部变动部分
        this.submitBtn = this.doc.getElementById(obj.submitBtnId);//确认上传按钮
        this.dropEle = this.doc.getElementById(obj.dropTargetId);//拖拽放置区域
        this.span = this.doc.getElementById(obj.fileInfoListShowerId);//拖拽上传文件
        this.url = obj.url;

        //设置上传完毕
        if (typeof obj.upLoadedDeal == "function") {
            this.uploadedDeal = obj.upLoadedDeal;
        }
        this.submitBtn.onclick = function () {
            _self.uploadFile();
        };
        this.dropEle.ondragenter = function () {
            console.log("dragenter");
            return false;
        };
        this.dropEle.ondragover = function () {
            console.log("dragover");
            return false;
        };
        this.dropEle.ondrop = function (e) {
            _self.getDragFiles(e);

        };
        console.log("init");
    }
};