// 解析url参数
export function urlParse () {
  let obj = {}
  if (window.location.search) {
    let url = window.location.search.split('?')[1].split('&')
    for (let i = 0; i < url.length; i++) {
      let param = url[i].split('=')
      // encodeURIComponent()方法 可对特殊字符如 # %等进行编码
      // 如'20180711#abc'将编码为'20180711%23abc'
      // decodeURIComponent()方法 可对编码后的字符串进行解码
      let key = decodeURIComponent(param[0])
      let value = decodeURIComponent(param[1])
      obj[key] = value
    }
  }
  return obj
}
