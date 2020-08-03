// 测试用的 备用
import config from '@/config'
import common from './index'
var websock = null
var globalCallback = null

// 初始化weosocket
function initWebSocket() {
    // ws地址 -->这里是你的请求路径
    websock = new WebSocket(config.socketUrl);
    websock.onmessage = function (e) {
        websocketonmessage(e)
    }
    websock.onclose = function (e) {
        websocketclose(e)
    }
    websock.onopen = function () {
        websocketOpen()
    }

    // 连接发生错误的回调方法
    websock.onerror = function () {
        console.log('WebSocket连接发生错误')
    }
}

// 实际调用的方法
function sendSock(agentData, callback) {
    globalCallback = callback
    if (websock.readyState === websock.OPEN) {
        // 若是ws开启状态
        websocketsend(agentData)
    } else if (websock.readyState === websock.CONNECTING) {
        // 若是 正在开启状态，则等待1s后重新调用
        setTimeout(function () {
            sendSock(agentData, callback)
        }, 1000)
    } else {
        // 若未开启 ，则等待1s后重新调用
        setTimeout(function () {
            sendSock(agentData, callback)
        }, 1000)
    }
}

// 数据接收
function websocketonmessage(e) {
    globalCallback(JSON.parse(e.data))
}

// 数据发送
function websocketsend(agentData) {
    websock.send(JSON.stringify(agentData))
}

// 关闭
function websocketclose(e) {
    console.log('connection closed (' + e.code + ')')
}

// 创建 websocket 连接
function websocketOpen(e) {
    console.log(common.getLocalStorage("userInfo"));
    var dataContent = `{"styleCode":28, "senderId":"${
        common.getLocalStorage("userInfo").userId
        }", "receiverId":"2", "extand": null}`;

    websocketsend(dataContent)
}

initWebSocket()

// 将方法暴露出去
export {
    sendSock
}


// initWebSocket() {
//     //初始化weosocket
//     // const wsuri = 'ws://127.0.0.1:9219/ws'
//     this.websock = new WebSocket(this.$config.socketUrl);
//     this.websock.onopen = this.websocketonopen;
//     this.websock.onmessage = this.websocketonmessage;
//     this.websock.onerror = this.websocketonerror;
//     this.websock.onclose = this.websocketclose;
//   },
//   websocketonopen() {
//     //连接建立之后执行send方法发送数据
//     console.log(this.$common.getLocalStorage("userInfo"));
//     var dataContent = `{"styleCode":28, "senderId":"${
//       this.$common.getLocalStorage("userInfo").userId
//     }", "receiverId":"2", "extand": null}`;
//     this.websocketsend(dataContent);
//   },
//   websocketonerror() {
//     //连接建立失败重连
//     this.initWebSocket();
//   },
//   websocketonmessage(e) {
//     console.log(e, "接收");
//     let _this = this; //数据接收
//     if (e.data == "连接成功") {
//       //这个判断是我业务需求才加的
//       return;
//     }
//     //业务需求，将socket接收到的值存进vuex
//     // _this.$store.store.dispatch('RESET_ID') //先调用reset方法置空vuex > store里面的scorketId（为什么置空，下面标题3解释）
//     // _this.$store.store.dispatch('SAVE_ID', JSON.parse(e.data).areaId) //重新给store中的scorketId赋值（数据格式问题先转了json）
//     // console.log(_this.$store.store.state.scorketId);
//   },
//   websocketsend(Data) {
//     //数据发送
//     console.log(Data);
//     this.websock.send(Data);
//   },
//   websocketclose(e) {
//     //关闭
//     console.log("断开连接", e);
//   }