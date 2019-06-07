// 存储到本地localstorage中的通用方法
export function saveToLocal (id, key, value) {
  let seller = window.localStorage.__seller__
  if (!seller) {
    seller = {}
    seller[id] = {}
  } else {
    seller = JSON.parse(seller) // localStorage中储存的是字符串，需要先转换为JSON对象
    if (!seller[id]) {
      seller[id] = {}
    }
  }
  seller[id][key] = value
  // 将新创建的seller对象转换为字符串储存到localStorage中
  window.localStorage.__seller__ = JSON.stringify(seller)
}
// 从本地localstorage中读取数据的通用方法
export function loadFromLocal (id, key, def) {
  let seller = window.localStorage.__seller__
  if (!seller) {
    return def
  }
  seller = JSON.parse(seller)[id]
  if (!seller) {
    return def
  }
  let ret = seller[key]
  return ret || def
}
