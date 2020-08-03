import directive from './directives'

const importDirective = Vue => {
  /**
   * number指令 v-number="options"
   * options = {
   *  key:  /文本框 v-model 变量/,
   *  max:  /限制文本框最大值/,
   * }
   */
  Vue.directive('number', directive.number),
  /**
   * clipboard指令 v-clipboard="options"
   * options = {
   *  value:    /需要复制的值/,
   *  success:  /复制成功后的回调/,
   *  error:    /复制失败后的回调/
   * }
   */
  Vue.directive('clipboard', directive.clipboard)
}

export default importDirective
