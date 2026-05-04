;(() => {
  'use strict'

  const { contextBridge } = require('electron')

  const PROJECT_DATA_BASE64 = '__KITTEN4_PROJECT_DATA_BASE64__'
  const isTemplatePlaceholder = PROJECT_DATA_BASE64 === '__KITTEN4_PROJECT_DATA_BASE64__'

  let projectData = ''
  try {
    if (!isTemplatePlaceholder && PROJECT_DATA_BASE64) {
      const projectJsonText = Buffer.from(PROJECT_DATA_BASE64, 'base64').toString('utf8')
      projectData = JSON.parse(projectJsonText)
    }
  } catch {
    console.log('加载作品失败，将加载默认作品')
    projectData = ''
  }

  contextBridge.exposeInMainWorld('kitten4_player', {
    bcmc_json: projectData ? JSON.stringify(projectData) : ''
  })
})()
