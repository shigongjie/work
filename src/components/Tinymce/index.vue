<template>
  <div class="tinymce-editor">
    <editor v-model="myValue" :init="init" :disabled="disabled" @onClick="onClick"></editor>
  </div>
</template>
<script>
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver";
// import 'tinymce/plugins/fullscreen' //全屏
import "tinymce/plugins/preview"; //预览
// 编辑器插件plugins
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import "tinymce/plugins/image"; // 插入上传图片插件
// import "tinymce/plugins/media"; // 插入视频插件
// import "tinymce/plugins/table"; // 插入表格插件
import "tinymce/plugins/lists"; // 列表插件
// import "tinymce/plugins/wordcount"; // 字数统计插件
import "tinymce/plugins/link";
import "tinymce/plugins/charmap";
import "tinymce/plugins/code";
import "tinymce/plugins/pagebreak";
import "tinymce/plugins/paste";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/contextmenu";
import "tinymce/plugins/print";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/colorpicker";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/fullscreen";
export default {
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    isLoad: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default:
        "lists image preview  table  print code  nonbreaking insertdatetime  searchreplace  pagebreak link charmap paste fullscreen "
    },
    toolbar: {
      type: [String, Array],
      default: () => [
        "bold forecolor backcolor | alignleft aligncenter alignright alignjustify  lists image  table  | bullist numlist outdent indent |  preview|fullscreen ",
        ""
      ]
    }
  },
  data() {
    return {
      isDisabled: true,
      init: {
        menubar: this.plugins,
        language_url: "/tinymce/zh_CN.js", //public目录下
        language: "zh_CN",
        skin_url: "/tinymce/skins/ui/oxide", //public目录下
        height: 300,
        paste_retain_style_properties: "all",
        paste_word_valid_elements: "*[*]", // word需要它
        paste_data_images: true,
        paste_convert_word_fake_lists: false, // 插入word文档需要该属性
        paste_webkit_styles: "all",
        paste_merge_formats: true,
        nonbreaking_force_tab: false,
        font_formats: `
            微软雅黑=微软雅黑;
            宋体=宋体;
            黑体=黑体;
            仿宋=仿宋;
            楷体=楷体;
            隶书=隶书;
            幼圆=幼圆;
            Andale Mono=andale mono,times;
            Arial=arial, helvetica,
            sans-serif;
            Arial Black=arial black, avant garde;
            Book Antiqua=book antiqua,palatino;
            Comic Sans MS=comic sans ms,sans-serif;
            Courier New=courier new,courier;
            Georgia=georgia,palatino;
            Helvetica=helvetica;
            Impact=impact,chicago;
            Symbol=symbol;
            Tahoma=tahoma,arial,helvetica,sans-serif;
            Terminal=terminal,monaco;
            Times New Roman=times new roman,times;
            Trebuchet MS=trebuchet ms,geneva;
            Verdana=verdana,geneva;
            Webdings=webdings;
            Wingdings=wingdings,zapf dingbats`,
        paste_auto_cleanup_on_paste: false,
        custom_undo_redo_levels: 10,
        plugins: this.plugins,
        toolbar: this.toolbar,
        images_upload_url: `${this.$config.host}${this.$api.common.upload}`, //上传路径
        images_upload_handler: (blobInfo, success, failure) => {
          this.handleImgUpload(blobInfo, success, failure);
        }
      },
      myValue: this.value
    };
  },
  mounted() {
    tinymce.init({});
  },
  methods: {
    async handleImgUpload(blobInfo, success, failure) {
      var formData = new FormData();
      formData.append("multipartFile", blobInfo.blob());
      console.log(blobInfo.blob());
      const d = await this.post2(this.$api.common.upload, formData);
      if (d.code === 0) {
        success(d.data.url);
      }
    },
    onClick(e) {
      this.$emit("onClick", e, tinymce);
    }
  },
  watch: {
    value(newValue) {
      this.myValue = newValue;
    },
    isLoad(val) {
      if (val) {
        tinymce.init(this.init);
      }
    },
    disabled(val) {
      this.isDisabled = val;
    },
    myValue(newValue) {
      this.$emit("input", newValue);
    }
  }
};
</script>
<style>
.tox-silver-sink {
  z-index: 3000 !important;
}
</style>
