(()=>{"use strict";var e={607:function(e,o,n){var t=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(o,"__esModule",{value:!0});const r=t(n(17)),i=n(298);let a=null;function l(){a=new i.BrowserWindow({webPreferences:{preload:r.default.join(__dirname,"preload.js"),webSecurity:!1,nodeIntegration:!0},minHeight:600,minWidth:960,icon:r.default.join(__dirname,"./assets/logo.png"),show:!1}),a.maximize(),a.loadFile(r.default.join(__dirname,"/../renderer/index.html")),i.Menu.setApplicationMenu(null),i.app.isPackaged,a.on("closed",(()=>{a=null})),a.once("ready-to-show",(()=>{a&&(a.focus(),a.show())}))}i.app.on("ready",l),i.app.on("activate",(()=>{null===a&&l()})),i.app.on("window-all-closed",(()=>{i.app.quit()}))},298:e=>{e.exports=require("electron")},17:e=>{e.exports=require("path")}},o={};!function n(t){var r=o[t];if(void 0!==r)return r.exports;var i=o[t]={exports:{}};return e[t].call(i.exports,i,i.exports,n),i.exports}(607)})();