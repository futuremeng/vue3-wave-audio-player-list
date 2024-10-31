/*
 * @Author: be_loving@163.com 
 * @Date: 2024-10-22 18:49:23
 * @LastEditors: be_loving@163.com 
 * @LastEditTime: 2024-10-23 14:07:36
 * @FilePath: /vue3-wave-audio-player/babel.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
  presets: [
    [
      '@vue/app',
      {
        // 巨坑：默认情况下会使用 babel-polyfill，如果安装该 npm 的项目也使用了 babel-polyfill，则会报错，useBuiltIns：false 可以解决
        // 详情看官网：https://cli.vuejs.org/zh/guide/browser-compatibility.html#polyfill
        useBuiltIns: false
      }
    ]
  ]
}
