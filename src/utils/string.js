export function randomString(len) {
  len = len || 32
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  const maxPos = $chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

export function formatDictText(dicts, values) {
  if (!(Array.isArray(dicts) && dicts.length > 0)) {
    return values
  }
  if (!values) {
    return ''
  }
  const valueArr = values.split(',')
  const contentArr = []
  dicts.forEach(dict => {
    for (let i = 0; i < valueArr.length; i++) {
      if (valueArr[i] === dict.value) {
        contentArr.push(dict.content)
        break
      }
    }
  })
  return contentArr.toString()
}
