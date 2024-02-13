;(() => {
  'use strict'
  var A = {
      298: (A) => {
        A.exports = require('electron')
      },
      344: (A) => {
        A.exports = JSON.parse('thisisaplacewhichshouldbereplace')
      }
    },
    c = {}
  function j(n) {
    var R = c[n]
    if (void 0 !== R) return R.exports
    var i = (c[n] = { exports: {} })
    return A[n](i, i.exports, j), i.exports
  }
  ;(() => {
    const { contextBridge: A } = j(298)
    let c
    try {
      c = j(344)
    } catch {
      console.log('加载作品失败, 将加载默认作品'), (c = '')
    }
    A.exposeInMainWorld('kitten4_player', { bcmc_json: c && JSON.stringify(c) })
  })()
})()
