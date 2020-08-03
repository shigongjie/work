import config from '@/config'

const JSON = require('circular-json');
export default {
  getLocalStorage(key) {
    var value = localStorage.getItem(key);
    return value ? JSON.parse(value) : false;
  },
  setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeLocalStorage(key) { localStorage.removeItem(key) },
  setSessionStorage(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  getSessionStorage(key) {
    var value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : false;
  },
  removeSessionStorage(key) { sessionStorage.removeItem(key); },
  getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return unescape(arr[2]);
    else
      return false;
  },
  setQueryConfig(queryConfig) {
    var _str = "";
    for (var o in queryConfig) {
      _str += o + "=" + queryConfig[o] + "&";
    }
    var _str = _str.substring(0, _str.length - 1);
    return _str;
  },
  checkBrowser() {
    var ua = navigator.userAgent.toLocaleLowerCase();
    var browserType = null;
    if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
      browserType = "IE";
      browserVersion = ua.match(/msie ([\d.]+)/) != null ? ua.match(/msie ([\d.]+)/)[1] : ua.match(/rv:([\d.]+)/)[1];
    } else if (ua.match(/firefox/) != null) {
      browserType = "火狐";
    } else if (ua.match(/ubrowser/) != null) {
      browserType = "UC";
    } else if (ua.match(/opera/) != null) {
      browserType = "欧朋";
    } else if (ua.match(/bidubrowser/) != null) {
      browserType = "百度";
    } else if (ua.match(/metasr/) != null) {
      browserType = "搜狗";
    } else if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null) {
      browserType = "QQ";
    } else if (ua.match(/maxthon/) != null) {
      browserType = "遨游";
    } else if (ua.match(/chrome/) != null) {
      var is360 = _mime("type", "application/vnd.chromium.remoting-viewer");
      function _mime(option, value) {
        var mimeTypes = navigator.mimeTypes;
        for (var mt in mimeTypes) {
          if (mimeTypes[mt][option] == value) {
            return true;
          }
        }
        return false;
      }
      if (is360) {
        browserType = '360';
      } else {
        browserType = "谷歌";
      }

    } else if (ua.match(/safari/) != null) {
      browserType = "Safari";
    }
    return browserType;
  },
  exportXls(query, url = '/match-boot/admin/export/excel/projectScoreList') {
    console.log(query)
    for (var o in query) {
      query[o] = encodeURIComponent(query[o]);
    }
    var { token } = this.getLocalStorage('userInfo')
    query = { ...query, token };
    //   http://10.0.0.52:9051/
    // 'https://api.qcwlyss.com/'
    let name = this.checkBrowser()
    if (name === '360') {
      window.open(config.file
        + url + '?'
        + this.setQueryConfig(query))
    } else {
      window.location = config.file
        + url + '?'
        + this.setQueryConfig(query)
    }

  }
}

