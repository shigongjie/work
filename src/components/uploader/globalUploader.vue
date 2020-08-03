<template>
    <div id="global-uploader">
        <!-- 上传 -->
        <uploader ref="uploader" :file-status-text="statusText" :options="options" @file-complete="fileComplete" @file-added="onFileAdded" @file-success="onFileSuccess" @file-error="onFileError" class="uploader-app">
            <uploader-unsupport></uploader-unsupport>
    
            <uploader-btn id="global-uploader-btn" :attrs="attrs" ref="uploadBtn">选择文件</uploader-btn>
    
            <uploader-list v-show="panelShow">
                <div class="file-panel" slot-scope="props" :class="{'collapse': collapse}">
                    <div class="file-title">
                        <h2>文件列表</h2>
                        <div class="operate">
                            <el-button @click="fileListShow" type="text" :title="collapse ? '展开':'折叠' ">
                                <i :class="collapse ? ' el-icon-full-screen ': 'el-icon-minus'"></i>
                            </el-button>
                            <el-button @click="close" type="text" title="关闭">
                                <i class="el-icon-close"></i>
                            </el-button>
                        </div>
                    </div>
    
                    <ul class="file-list">
                        <li v-for="file in props.fileList" :key="file.id">
                            <uploader-file :class="'file_' + file.id" ref="files" :file="file" :list="true"></uploader-file>
                        </li>
                        <div class="no-file" v-if="!props.fileList.length">
                            <i class="iconfont icon-empty-file"></i> 暂无待上传文件
                        </div>
                    </ul>
                </div>
            </uploader-list>
        </uploader>
    </div>
</template>

<script>
/**
 *   全局上传插件
 *   调用方法：Bus.$emit('openUploader', {}) 打开文件选择框，参数为需要传递的额外参数
 *   监听函数：Bus.$on('fileAdded', fn); 文件选择后的回调
 *            Bus.$on('fileSuccess', fn); 文件上传成功的回调
 */
// import { ACCEPT_CONFIG } from "./js/config";
import SparkMD5 from "spark-md5";
import axios from "axios";
import qs from "qs";
import Bus from "@/axios/bus";
import $ from "jquery";
export default {
    data() {
        return {
            isAll: true,
            isType: true,
            options: {
                target: process.env.VUE_APP_NODE_ENV === "production" ?
                    "https://ossupload.91ready.com/uploader/chunk"
                    :"http://10.0.0.52:9700/uploader/chunk",
                chunkSize: 10 * 1024 * 1024,
                testChunks: true //是否开启服务器分片校验
            },
            submitoptions: {
                target: process.env.VUE_APP_NODE_ENV === "production" ?
                    "https://ossupload.91ready.com/uploader/mergeFile" 
                    :"http://10.0.0.52:9700/uploader/mergeFile",
                chunkSize: 10 * 1024 * 1024,
                testChunks: true //是否开启服务器分片校验
            },
            statusText: {
                success: "上传成功",
                error: "出错了",
                uploading: "上传中",
                paused: "暂停中",
                waiting: "等待中"
            },
            attrs: {
                // accept: []
            },
            panelShow: false, //选择文件后，展示上传panel
            collapse: false
        };
    },
    mounted() {
        Bus.$on("openUploader", obj => {
            this.params = {};
            this.isAll = true;
            if (obj.fieldFormat.length > 0) {
                for (let i = 0; i < obj.fieldFormat.length; i++) {
                    if (obj.fieldFormat[i] == "不限") {
                        this.isAll = false;
                    }
                }
            } else {
                this.isAll = false;
            }
            if (this.isAll) {
                this.format = obj.fieldFormat;
            }
            if (this.$refs.uploadBtn) {
                document.getElementById("global-uploader-btn").click();
            }
        });
    },
    computed: {
        //Uploader实例
        uploader() {
            return this.$refs.uploader.uploader;
        }
    },
    methods: {
        onFileAdded(file) {
            let type = file.name.slice(file.name.lastIndexOf(".") + 1);
            if (this.isAll) {
                let num = 0;
                for (let i = 0; i < this.format.length; i++) {
                    if (this.format[i] !== type) {
                        num++;
                    }
                }
                if (num === this.format.length) {
                    this.isType = false;
                } else {
                    this.isType = true;
                }
            }
            if (!this.isType) {
                this.$message.error("不支持该格式的文件上传");
                return;
                //Bus.$emit("fileSuccess", false);
            } else {
                this.panelShow = true;
                this.computeMD5(file);
                Bus.$emit("fileAdded");
            }
        },
        fileComplete() {
            if (this.isType) {
                const file = arguments[0].file;
                console.log(file)
                axios
                    .post(
                        this.submitoptions.target,
                        // "//ossupload.91ready.com/uploader/mergeFile",
                        qs.stringify({
                            filename: file.name,
                            identifier: arguments[0].uniqueIdentifier,
                            totalSize: file.size,
                            type: file.type
                        })
                    )
                    .then(function(response) {
                        Bus.$emit("fileSuccess", response.data.data);
                        // this.statusRemove(file.id);
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            }
        },
        onFileSuccess(rootFile, file, response, chunk) {
            if (!this.isType) {
                this.statusSet(file.id, "failed");
            }
            // this.statusSet(file.id, "failed");
            // Bus.$emit("fileSuccess");
        },
        onFileError(rootFile, file, response, chunk) {
            this.$message({
                message: response,
                type: "error"
            });
        },
        /**
         * 计算md5，实现断点续传及秒传
         * @param file
         */
        computeMD5(file) {
            let fileReader = new FileReader();
            let time = new Date().getTime();
            let blobSlice =
                File.prototype.slice ||
                File.prototype.mozSlice ||
                File.prototype.webkitSlice;
            let currentChunk = 0;
            const chunkSize = 10 * 1024 * 1000;
            let chunks = Math.ceil(file.size / chunkSize);
            let spark = new SparkMD5.ArrayBuffer();
            // 文件状态设为"计算MD5"
            this.statusSet(file.id, "md5");
            file.pause();
            loadNext();
            fileReader.onload = e => {
                spark.append(e.target.result);
                if (currentChunk < chunks) {
                    currentChunk++;
                    loadNext();
                    // 实时展示MD5的计算进度
                    this.$nextTick(() => {
                        document.querySelector(`.myStatus_${file.id}`).innerText =
                            "校验MD5 " + ((currentChunk / chunks) * 100).toFixed(0) + "%";
                    });
                } else {
                    let md5 = spark.end();
                    this.computeMD5Success(md5, file);
                }
            };
            fileReader.onerror = function() {
                this.error(`文件${file.name}读取出错，请检查该文件`);
                file.cancel();
            };

            function loadNext() {
                let start = currentChunk * chunkSize;
                let end =
                    start + chunkSize >= file.size ? file.size : start + chunkSize;
                fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
            }
        },
        computeMD5Success(md5, file) {
            // 将自定义参数直接加载uploader实例的opts上
            Object.assign(this.uploader.opts, {
                query: {
                    ...this.params
                }
            });
            file.uniqueIdentifier = md5;
            file.resume();
            this.statusRemove(file.id);
        },
        fileListShow() {
            let $list = $("#global-uploader .file-list");
            if ($list.is(":visible")) {
                $list.slideUp();
                this.collapse = true;
            } else {
                $list.slideDown();
                this.collapse = false;
            }
        },
        close() {
            this.uploader.cancel();
            this.panelShow = false;
        },
        /**
         * 新增的自定义的状态: 'md5'、'transcoding'、'failed'
         * @param id
         * @param status
         */
        statusSet(id, status) {
            let statusMap = {
                md5: {
                    text: "校验MD5",
                    bgc: "#fff"
                },
                merging: {
                    text: "合并中",
                    bgc: "#e2eeff"
                },
                transcoding: {
                    text: "转码中",
                    bgc: "#e2eeff"
                },
                failed: {
                    text: "上传失败",
                    bgc: "#e2eeff"
                }
            };
            this.$nextTick(() => {
                $(`<p class="myStatus_${id}"></p>`)
                    .appendTo(`.file_${id} .uploader-file-status`)
                    .css({
                        position: "absolute",
                        top: "0",
                        left: "0",
                        right: "0",
                        bottom: "0",
                        zIndex: "1",
                        backgroundColor: statusMap[status].bgc
                    })
                    .text(statusMap[status].text);
            });
        },
        statusRemove(id) {
            this.$nextTick(() => {
                $(`.myStatus_${id}`).remove();
            });
        },
        error(msg) {
            this.$notify({
                title: "错误",
                message: msg,
                type: "error",
                duration: 2000
            });
        }
    },
    watch: {},
    destroyed() {
        // Bus.$off("openUploader");
    },
    components: {}
};
</script>

<style scoped lang="scss">
#global-uploader {
    position: fixed;
    z-index: 20;
    right: 15px;
    bottom: 15px;
    font-size: 14px;
    h2 {
        font-size: 16px;
    }
    .uploader-app {
        width: 520px;
    }
    .file-panel {
        background-color: #fff;
        border: 1px solid #e2e2e2;
        border-radius: 7px 7px 0 0;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        .file-title {
            display: flex;
            height: 40px;
            line-height: 40px;
            padding: 0 15px;
            border-bottom: 1px solid #ddd;
            .operate {
                flex: 1;
                text-align: right;
            }
        }
        .file-list {
            position: relative;
            height: 240px;
            overflow-x: hidden;
            overflow-y: auto;
            background-color: #fff;
            >li {
                background-color: #fff;
            }
        }
        &.collapse {
            .file-title {
                background-color: #e7ecf2;
            }
        }
    }
    .no-file {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 16px;
    }
    /deep/ .uploader-file-icon {
        &:before {
            content: "" !important;
        }
        &[icon="image"] {
            background: url("./images/image-icon.png");
        }
        &[icon="video"] {
            background: url(./images/video-icon.png);
        }
        &[icon="document"] {
            background: url(./images/text-icon.png);
        }
    }
    .uploader-file-actions>span {
        margin-right: 6px;
    }
}

/* 隐藏上传按钮 */

#global-uploader-btn {
    position: absolute;
    clip: rect(0, 0, 0, 0);
}

#global-uploader {
    z-index: 9999;
}
</style>