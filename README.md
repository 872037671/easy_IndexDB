# easy_IndexDB
关于indexDB的一些api封装，后续继续更新
初始化： let db = IndexDB.createInstance({
  name: '', // 数据库名
  storeName: '', // 储存空间名
  keyPath: '' // 键名
});

setTimeout(() => {
// 添加数据
db.setItem(key, value).then((res) => {
  
});
  
// 通过key获取对应的value
db.getItem(key).then((res) => {
  console.log(res)
})

// 清空store
db.clearItem(key).then((res) => {
  console.log(res)
})

// 删除key对应的一条数据
db.delItem(key).then((res) => {
  console.log(res)
})

// 关闭
db.close(key)
  
  
  
  
}, 100)
