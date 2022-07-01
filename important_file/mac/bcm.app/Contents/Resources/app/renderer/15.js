(this["webpackJsonp"] = this["webpackJsonp"] || []).push([[15],{

/***/ "./node_modules/dsbridge/index.js":
/*!****************************************!*\
  !*** ./node_modules/dsbridge/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var bridge = {
    default:this,// for typescript
    call: function (method, args, cb) {
        var ret = '';
        if (typeof args == 'function') {
            cb = args;
            args = {};
        }
        var arg={data:args===undefined?null:args}
        if (typeof cb == 'function') {
            var cbName = 'dscb' + window.dscb++;
            window[cbName] = cb;
            arg['_dscbstub'] = cbName;
        }
        arg = JSON.stringify(arg)

        //if in webview that dsBridge provided, call!
        if(window._dsbridge){
           ret=  _dsbridge.call(method, arg)
        }else if(window._dswk||navigator.userAgent.indexOf("_dsbridge")!=-1){
           ret = prompt("_dsbridge=" + method, arg);
        }

       return  JSON.parse(ret||'{}').data
    },
    register: function (name, fun, asyn) {
        var q = asyn ? window._dsaf : window._dsf
        if (!window._dsInit) {
            window._dsInit = true;
            //notify native that js apis register successfully on next event loop
            setTimeout(function () {
                bridge.call("_dsb.dsinit");
            }, 0)
        }
        if (typeof fun == "object") {
            q._obs[name] = fun;
        } else {
            q[name] = fun
        }
    },
    registerAsyn: function (name, fun) {
        this.register(name, fun, true);
    },
    hasNativeMethod: function (name, type) {
        return this.call("_dsb.hasNativeMethod", {name: name, type:type||"all"});
    },
    disableJavascriptDialogBlock: function (disable) {
        this.call("_dsb.disableJavascriptDialogBlock", {
            disable: disable !== false
        })
    }
};

!function () {
    if (window._dsf) return;
    var ob = {
        _dsf: {
            _obs: {}
        },
        _dsaf: {
            _obs: {}
        },
        dscb: 0,
        dsBridge: bridge,
        close: function () {
            bridge.call("_dsb.closePage")
        },
        _handleMessageFromNative: function (info) {
            var arg = JSON.parse(info.data);
            var ret = {
                id: info.callbackId,
                complete: true
            }
            var f = this._dsf[info.method];
            var af = this._dsaf[info.method]
            var callSyn = function (f, ob) {
                ret.data = f.apply(ob, arg)
                bridge.call("_dsb.returnValue", ret)
            }
            var callAsyn = function (f, ob) {
                arg.push(function (data, complete) {
                    ret.data = data;
                    ret.complete = complete!==false;
                    bridge.call("_dsb.returnValue", ret)
                })
                f.apply(ob, arg)
            }
            if (f) {
                callSyn(f, this._dsf);
            } else if (af) {
                callAsyn(af, this._dsaf);
            } else {
                //with namespace
                var name = info.method.split('.');
                if (name.length<2) return;
                var method=name.pop();
                var namespace=name.join('.')
                var obs = this._dsf._obs;
                var ob = obs[namespace] || {};
                var m = ob[method];
                if (m && typeof m == "function") {
                    callSyn(m, ob);
                    return;
                }
                obs = this._dsaf._obs;
                ob = obs[namespace] || {};
                m = ob[method];
                if (m && typeof m == "function") {
                    callAsyn(m, ob);
                    return;
                }
            }
        }
    }
    for (var attr in ob) {
        window[attr] = ob[attr]
    }
    bridge.register("_hasJavascriptMethod", function (method, tag) {
         var name = method.split('.')
         if(name.length<2) {
           return !!(_dsf[name]||_dsaf[name])
         }else{
           // with namespace
           var method=name.pop()
           var namespace=name.join('.')
           var ob=_dsf._obs[namespace]||_dsaf._obs[namespace]
           return ob&&!!ob[method]
         }
    })
}();

module.exports = bridge;

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTUuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZHNicmlkZ2UvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIGJyaWRnZSA9IHtcbiAgICBkZWZhdWx0OnRoaXMsLy8gZm9yIHR5cGVzY3JpcHRcbiAgICBjYWxsOiBmdW5jdGlvbiAobWV0aG9kLCBhcmdzLCBjYikge1xuICAgICAgICB2YXIgcmV0ID0gJyc7XG4gICAgICAgIGlmICh0eXBlb2YgYXJncyA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYiA9IGFyZ3M7XG4gICAgICAgICAgICBhcmdzID0ge307XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFyZz17ZGF0YTphcmdzPT09dW5kZWZpbmVkP251bGw6YXJnc31cbiAgICAgICAgaWYgKHR5cGVvZiBjYiA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgY2JOYW1lID0gJ2RzY2InICsgd2luZG93LmRzY2IrKztcbiAgICAgICAgICAgIHdpbmRvd1tjYk5hbWVdID0gY2I7XG4gICAgICAgICAgICBhcmdbJ19kc2Nic3R1YiddID0gY2JOYW1lO1xuICAgICAgICB9XG4gICAgICAgIGFyZyA9IEpTT04uc3RyaW5naWZ5KGFyZylcblxuICAgICAgICAvL2lmIGluIHdlYnZpZXcgdGhhdCBkc0JyaWRnZSBwcm92aWRlZCwgY2FsbCFcbiAgICAgICAgaWYod2luZG93Ll9kc2JyaWRnZSl7XG4gICAgICAgICAgIHJldD0gIF9kc2JyaWRnZS5jYWxsKG1ldGhvZCwgYXJnKVxuICAgICAgICB9ZWxzZSBpZih3aW5kb3cuX2Rzd2t8fG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIl9kc2JyaWRnZVwiKSE9LTEpe1xuICAgICAgICAgICByZXQgPSBwcm9tcHQoXCJfZHNicmlkZ2U9XCIgKyBtZXRob2QsIGFyZyk7XG4gICAgICAgIH1cblxuICAgICAgIHJldHVybiAgSlNPTi5wYXJzZShyZXR8fCd7fScpLmRhdGFcbiAgICB9LFxuICAgIHJlZ2lzdGVyOiBmdW5jdGlvbiAobmFtZSwgZnVuLCBhc3luKSB7XG4gICAgICAgIHZhciBxID0gYXN5biA/IHdpbmRvdy5fZHNhZiA6IHdpbmRvdy5fZHNmXG4gICAgICAgIGlmICghd2luZG93Ll9kc0luaXQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5fZHNJbml0ID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vbm90aWZ5IG5hdGl2ZSB0aGF0IGpzIGFwaXMgcmVnaXN0ZXIgc3VjY2Vzc2Z1bGx5IG9uIG5leHQgZXZlbnQgbG9vcFxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYnJpZGdlLmNhbGwoXCJfZHNiLmRzaW5pdFwiKTtcbiAgICAgICAgICAgIH0sIDApXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmdW4gPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgcS5fb2JzW25hbWVdID0gZnVuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcVtuYW1lXSA9IGZ1blxuICAgICAgICB9XG4gICAgfSxcbiAgICByZWdpc3RlckFzeW46IGZ1bmN0aW9uIChuYW1lLCBmdW4pIHtcbiAgICAgICAgdGhpcy5yZWdpc3RlcihuYW1lLCBmdW4sIHRydWUpO1xuICAgIH0sXG4gICAgaGFzTmF0aXZlTWV0aG9kOiBmdW5jdGlvbiAobmFtZSwgdHlwZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxsKFwiX2RzYi5oYXNOYXRpdmVNZXRob2RcIiwge25hbWU6IG5hbWUsIHR5cGU6dHlwZXx8XCJhbGxcIn0pO1xuICAgIH0sXG4gICAgZGlzYWJsZUphdmFzY3JpcHREaWFsb2dCbG9jazogZnVuY3Rpb24gKGRpc2FibGUpIHtcbiAgICAgICAgdGhpcy5jYWxsKFwiX2RzYi5kaXNhYmxlSmF2YXNjcmlwdERpYWxvZ0Jsb2NrXCIsIHtcbiAgICAgICAgICAgIGRpc2FibGU6IGRpc2FibGUgIT09IGZhbHNlXG4gICAgICAgIH0pXG4gICAgfVxufTtcblxuIWZ1bmN0aW9uICgpIHtcbiAgICBpZiAod2luZG93Ll9kc2YpIHJldHVybjtcbiAgICB2YXIgb2IgPSB7XG4gICAgICAgIF9kc2Y6IHtcbiAgICAgICAgICAgIF9vYnM6IHt9XG4gICAgICAgIH0sXG4gICAgICAgIF9kc2FmOiB7XG4gICAgICAgICAgICBfb2JzOiB7fVxuICAgICAgICB9LFxuICAgICAgICBkc2NiOiAwLFxuICAgICAgICBkc0JyaWRnZTogYnJpZGdlLFxuICAgICAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYnJpZGdlLmNhbGwoXCJfZHNiLmNsb3NlUGFnZVwiKVxuICAgICAgICB9LFxuICAgICAgICBfaGFuZGxlTWVzc2FnZUZyb21OYXRpdmU6IGZ1bmN0aW9uIChpbmZvKSB7XG4gICAgICAgICAgICB2YXIgYXJnID0gSlNPTi5wYXJzZShpbmZvLmRhdGEpO1xuICAgICAgICAgICAgdmFyIHJldCA9IHtcbiAgICAgICAgICAgICAgICBpZDogaW5mby5jYWxsYmFja0lkLFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZiA9IHRoaXMuX2RzZltpbmZvLm1ldGhvZF07XG4gICAgICAgICAgICB2YXIgYWYgPSB0aGlzLl9kc2FmW2luZm8ubWV0aG9kXVxuICAgICAgICAgICAgdmFyIGNhbGxTeW4gPSBmdW5jdGlvbiAoZiwgb2IpIHtcbiAgICAgICAgICAgICAgICByZXQuZGF0YSA9IGYuYXBwbHkob2IsIGFyZylcbiAgICAgICAgICAgICAgICBicmlkZ2UuY2FsbChcIl9kc2IucmV0dXJuVmFsdWVcIiwgcmV0KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGNhbGxBc3luID0gZnVuY3Rpb24gKGYsIG9iKSB7XG4gICAgICAgICAgICAgICAgYXJnLnB1c2goZnVuY3Rpb24gKGRhdGEsIGNvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldC5kYXRhID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgcmV0LmNvbXBsZXRlID0gY29tcGxldGUhPT1mYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJpZGdlLmNhbGwoXCJfZHNiLnJldHVyblZhbHVlXCIsIHJldClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIGYuYXBwbHkob2IsIGFyZylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmKSB7XG4gICAgICAgICAgICAgICAgY2FsbFN5bihmLCB0aGlzLl9kc2YpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhZikge1xuICAgICAgICAgICAgICAgIGNhbGxBc3luKGFmLCB0aGlzLl9kc2FmKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy93aXRoIG5hbWVzcGFjZVxuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gaW5mby5tZXRob2Quc3BsaXQoJy4nKTtcbiAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGg8MikgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHZhciBtZXRob2Q9bmFtZS5wb3AoKTtcbiAgICAgICAgICAgICAgICB2YXIgbmFtZXNwYWNlPW5hbWUuam9pbignLicpXG4gICAgICAgICAgICAgICAgdmFyIG9icyA9IHRoaXMuX2RzZi5fb2JzO1xuICAgICAgICAgICAgICAgIHZhciBvYiA9IG9ic1tuYW1lc3BhY2VdIHx8IHt9O1xuICAgICAgICAgICAgICAgIHZhciBtID0gb2JbbWV0aG9kXTtcbiAgICAgICAgICAgICAgICBpZiAobSAmJiB0eXBlb2YgbSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbFN5bihtLCBvYik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb2JzID0gdGhpcy5fZHNhZi5fb2JzO1xuICAgICAgICAgICAgICAgIG9iID0gb2JzW25hbWVzcGFjZV0gfHwge307XG4gICAgICAgICAgICAgICAgbSA9IG9iW21ldGhvZF07XG4gICAgICAgICAgICAgICAgaWYgKG0gJiYgdHlwZW9mIG0gPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxBc3luKG0sIG9iKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBhdHRyIGluIG9iKSB7XG4gICAgICAgIHdpbmRvd1thdHRyXSA9IG9iW2F0dHJdXG4gICAgfVxuICAgIGJyaWRnZS5yZWdpc3RlcihcIl9oYXNKYXZhc2NyaXB0TWV0aG9kXCIsIGZ1bmN0aW9uIChtZXRob2QsIHRhZykge1xuICAgICAgICAgdmFyIG5hbWUgPSBtZXRob2Quc3BsaXQoJy4nKVxuICAgICAgICAgaWYobmFtZS5sZW5ndGg8Mikge1xuICAgICAgICAgICByZXR1cm4gISEoX2RzZltuYW1lXXx8X2RzYWZbbmFtZV0pXG4gICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgLy8gd2l0aCBuYW1lc3BhY2VcbiAgICAgICAgICAgdmFyIG1ldGhvZD1uYW1lLnBvcCgpXG4gICAgICAgICAgIHZhciBuYW1lc3BhY2U9bmFtZS5qb2luKCcuJylcbiAgICAgICAgICAgdmFyIG9iPV9kc2YuX29ic1tuYW1lc3BhY2VdfHxfZHNhZi5fb2JzW25hbWVzcGFjZV1cbiAgICAgICAgICAgcmV0dXJuIG9iJiYhIW9iW21ldGhvZF1cbiAgICAgICAgIH1cbiAgICB9KVxufSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJyaWRnZTsiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBIiwic291cmNlUm9vdCI6IiJ9