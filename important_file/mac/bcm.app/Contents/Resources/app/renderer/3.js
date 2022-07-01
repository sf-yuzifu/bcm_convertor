(this["webpackJsonp"] = this["webpackJsonp"] || []).push([[3],{

/***/ "./src/acceptance_test.ts":
/*!********************************!*\
  !*** ./src/acceptance_test.ts ***!
  \********************************/
/*! exports provided: set_acceptance_test, test_set_change_bcm, get_assert_tool, listen_test_finished, register_test_block_domain_function, register_test_blocks, get_test_result, reset_assert_tool */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "set_acceptance_test", function() { return set_acceptance_test; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "test_set_change_bcm", function() { return test_set_change_bcm; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get_assert_tool", function() { return get_assert_tool; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "listen_test_finished", function() { return listen_test_finished; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "register_test_block_domain_function", function() { return register_test_block_domain_function; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "register_test_blocks", function() { return register_test_blocks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get_test_result", function() { return get_test_result; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reset_assert_tool", function() { return reset_assert_tool; });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _crc_heart_build_dev_tool_test_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @crc/heart/build/dev_tool/test_blocks */ "./node_modules/@crc/heart/build/dev_tool/test_blocks/index.js");
/* harmony import */ var _crc_heart_build_dev_tool_test_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_crc_heart_build_dev_tool_test_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _crc_heart_build_dev_tool_assert_tool__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @crc/heart/build/dev_tool/assert_tool */ "./node_modules/@crc/heart/build/dev_tool/assert_tool/index.js");
/* harmony import */ var _crc_heart_build_dev_tool_assert_tool__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_crc_heart_build_dev_tool_assert_tool__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _redux_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./redux/store */ "./src/redux/store.ts");




function set_acceptance_test(ht) {
  if (!ht || !_redux_store__WEBPACK_IMPORTED_MODULE_3__["store_manager"]) {
    return;
  }

  var test_done = false;
  var test_result = {
    success: false,
    message: ''
  };
  register_test_block_domain_function(ht.get_registry());
  listen_test_finished(function () {
    test_done = true;
  });
  ht.get_event_bus().runtime_manager.idle.immediate.sub(function () {
    test_done = true;
  });

  window.acceptance_test_check_done = function () {
    // Check if test using variable 'DONE'.
    var v_done = lodash__WEBPACK_IMPORTED_MODULE_0__["find"](_redux_store__WEBPACK_IMPORTED_MODULE_3__["store_manager"].get_state().variable_states, {
      name: 'DONE'
    });

    if (v_done) {
      // Check if test done with 'DONE' variable, if so save result and return;
      var is_pass = ht.get_runtime_manager().get_global_variable(v_done.id) === 1;

      if (is_pass) {
        test_result = {
          success: true,
          message: ''
        };
      }

      return is_pass;
    } // Check if test done with 'Test is done' block, if so, save result and return;


    if (test_done) {
      test_result = get_test_result();
    }

    return test_done;
  };

  window.acceptance_test_get_result = function () {
    return test_result;
  };

  window.acceptance_test_reset = function () {
    test_result = {
      success: false,
      message: ''
    };
    test_done = false;
    reset_assert_tool();
  };

  test_set_change_bcm();
}
function test_set_change_bcm() {
  window.check_load_is_done = function () {
    return _redux_store__WEBPACK_IMPORTED_MODULE_3__["store_manager"].get_state().cloud_states.loading_state === 'load_done';
  };
}

var _assert_tool;

var _test_finished_listeners = [];
function get_assert_tool() {
  if (_assert_tool == undefined) {
    _assert_tool = _crc_heart_build_dev_tool_assert_tool__WEBPACK_IMPORTED_MODULE_2__["create"]();
  }

  return _assert_tool;
}
function listen_test_finished(cb) {
  _test_finished_listeners.push(cb);
}
function register_test_block_domain_function(registry) {
  var _test_blocks$register = _crc_heart_build_dev_tool_test_blocks__WEBPACK_IMPORTED_MODULE_1__["register_domain_functions"](registry, get_assert_tool()),
      subscribe_test_done = _test_blocks$register.subscribe_test_done;

  subscribe_test_done(function () {
    for (var i = 0; i < _test_finished_listeners.length; i++) {
      _test_finished_listeners[i]();
    }
  });
}
function register_test_blocks(registry) {
  _crc_heart_build_dev_tool_test_blocks__WEBPACK_IMPORTED_MODULE_1__["register_blocks"](registry);
  register_test_block_domain_function(registry);
}
function get_test_result() {
  return get_assert_tool().get_result();
}
function reset_assert_tool() {
  return get_assert_tool().reset();
}
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(set_acceptance_test, "set_acceptance_test", "/Applications/project/kitten-player/src/acceptance_test.ts");

  __REACT_HOT_LOADER__.register(test_set_change_bcm, "test_set_change_bcm", "/Applications/project/kitten-player/src/acceptance_test.ts");

  __REACT_HOT_LOADER__.register(_assert_tool, "_assert_tool", "/Applications/project/kitten-player/src/acceptance_test.ts");

  __REACT_HOT_LOADER__.register(_test_finished_listeners, "_test_finished_listeners", "/Applications/project/kitten-player/src/acceptance_test.ts");

  __REACT_HOT_LOADER__.register(get_assert_tool, "get_assert_tool", "/Applications/project/kitten-player/src/acceptance_test.ts");

  __REACT_HOT_LOADER__.register(listen_test_finished, "listen_test_finished", "/Applications/project/kitten-player/src/acceptance_test.ts");

  __REACT_HOT_LOADER__.register(register_test_block_domain_function, "register_test_block_domain_function", "/Applications/project/kitten-player/src/acceptance_test.ts");

  __REACT_HOT_LOADER__.register(register_test_blocks, "register_test_blocks", "/Applications/project/kitten-player/src/acceptance_test.ts");

  __REACT_HOT_LOADER__.register(get_test_result, "get_test_result", "/Applications/project/kitten-player/src/acceptance_test.ts");

  __REACT_HOT_LOADER__.register(reset_assert_tool, "reset_assert_tool", "/Applications/project/kitten-player/src/acceptance_test.ts");
}();

;

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9hY2NlcHRhbmNlX3Rlc3QudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0ICogYXMgdGVzdF9ibG9ja3MgZnJvbSAnQGNyYy9oZWFydC9idWlsZC9kZXZfdG9vbC90ZXN0X2Jsb2Nrcyc7XG5pbXBvcnQgKiBhcyBhc3NlcnRfdG9vbCBmcm9tICdAY3JjL2hlYXJ0L2J1aWxkL2Rldl90b29sL2Fzc2VydF90b29sJztcbmltcG9ydCB7IHN0b3JlX21hbmFnZXIgfSBmcm9tICcuL3JlZHV4L3N0b3JlJztcbmltcG9ydCB7XG4gIEhlYXJ0LFxuICBSZWdpc3RyeSxcbn0gZnJvbSAnLi9oZWFydCc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHNldF9hY2NlcHRhbmNlX3Rlc3QoaHQ6SGVhcnQpIHtcbiAgaWYgKCFodCB8fCAhc3RvcmVfbWFuYWdlcikge1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgdGVzdF9kb25lID0gZmFsc2U7XG4gIGxldCB0ZXN0X3Jlc3VsdDphc3NlcnRfdG9vbC5Bc3NlcnRpb25Ub29sUmVzdWx0ID0ge1xuICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgIG1lc3NhZ2U6ICcnLFxuICB9O1xuICByZWdpc3Rlcl90ZXN0X2Jsb2NrX2RvbWFpbl9mdW5jdGlvbihodC5nZXRfcmVnaXN0cnkoKSk7XG4gIGxpc3Rlbl90ZXN0X2ZpbmlzaGVkKCgpID0+IHtcbiAgICB0ZXN0X2RvbmUgPSB0cnVlO1xuICB9KTtcbiAgaHQuZ2V0X2V2ZW50X2J1cygpLnJ1bnRpbWVfbWFuYWdlci5pZGxlLmltbWVkaWF0ZS5zdWIoKCkgPT4ge1xuICAgIHRlc3RfZG9uZSA9IHRydWU7XG4gIH0pO1xuXG4gICh3aW5kb3cgYXMgYW55KS5hY2NlcHRhbmNlX3Rlc3RfY2hlY2tfZG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIENoZWNrIGlmIHRlc3QgdXNpbmcgdmFyaWFibGUgJ0RPTkUnLlxuICAgIGNvbnN0IHZfZG9uZSA9IF8uZmluZChcbiAgICAgIHN0b3JlX21hbmFnZXIuZ2V0X3N0YXRlKCkudmFyaWFibGVfc3RhdGVzLFxuICAgICAgeyBuYW1lOiAnRE9ORScgfSxcbiAgICApO1xuICAgIGlmICh2X2RvbmUpIHtcbiAgICAgIC8vIENoZWNrIGlmIHRlc3QgZG9uZSB3aXRoICdET05FJyB2YXJpYWJsZSwgaWYgc28gc2F2ZSByZXN1bHQgYW5kIHJldHVybjtcbiAgICAgIGNvbnN0IGlzX3Bhc3MgPSBodC5nZXRfcnVudGltZV9tYW5hZ2VyKCkuZ2V0X2dsb2JhbF92YXJpYWJsZSh2X2RvbmUuaWQpID09PSAxO1xuICAgICAgaWYgKGlzX3Bhc3MpIHtcbiAgICAgICAgdGVzdF9yZXN1bHQgPSB7XG4gICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiAnJyxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpc19wYXNzO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHRlc3QgZG9uZSB3aXRoICdUZXN0IGlzIGRvbmUnIGJsb2NrLCBpZiBzbywgc2F2ZSByZXN1bHQgYW5kIHJldHVybjtcbiAgICBpZiAodGVzdF9kb25lKSB7XG4gICAgICB0ZXN0X3Jlc3VsdCA9IGdldF90ZXN0X3Jlc3VsdCgpO1xuICAgIH1cblxuICAgIHJldHVybiB0ZXN0X2RvbmU7XG4gIH07XG5cbiAgKHdpbmRvdyBhcyBhbnkpLmFjY2VwdGFuY2VfdGVzdF9nZXRfcmVzdWx0ID0gZnVuY3Rpb24oKTphc3NlcnRfdG9vbC5Bc3NlcnRpb25Ub29sUmVzdWx0IHtcbiAgICByZXR1cm4gdGVzdF9yZXN1bHQ7XG4gIH07XG5cbiAgKHdpbmRvdyBhcyBhbnkpLmFjY2VwdGFuY2VfdGVzdF9yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgIHRlc3RfcmVzdWx0ID0ge1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBtZXNzYWdlOiAnJyxcbiAgICB9O1xuICAgIHRlc3RfZG9uZSA9IGZhbHNlO1xuICAgIHJlc2V0X2Fzc2VydF90b29sKCk7XG4gIH07XG5cbiAgdGVzdF9zZXRfY2hhbmdlX2JjbSgpO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0X3NldF9jaGFuZ2VfYmNtKCkge1xuICAod2luZG93IGFzIGFueSkuY2hlY2tfbG9hZF9pc19kb25lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN0b3JlX21hbmFnZXIuZ2V0X3N0YXRlKCkuY2xvdWRfc3RhdGVzLmxvYWRpbmdfc3RhdGUgPT09ICdsb2FkX2RvbmUnO1xuICB9O1xufVxuXG5sZXQgX2Fzc2VydF90b29sOmFzc2VydF90b29sLlRlc3RBc3NlcnRpb25Ub29sO1xuY29uc3QgX3Rlc3RfZmluaXNoZWRfbGlzdGVuZXJzOkZ1bmN0aW9uW10gPSBbXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldF9hc3NlcnRfdG9vbCgpIHtcbiAgaWYgKF9hc3NlcnRfdG9vbCA9PSB1bmRlZmluZWQpIHtcbiAgICBfYXNzZXJ0X3Rvb2wgPSBhc3NlcnRfdG9vbC5jcmVhdGUoKTtcbiAgfVxuICByZXR1cm4gX2Fzc2VydF90b29sO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGlzdGVuX3Rlc3RfZmluaXNoZWQoY2I6KCkgPT4gdm9pZCkge1xuICBfdGVzdF9maW5pc2hlZF9saXN0ZW5lcnMucHVzaChjYik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3Rlcl90ZXN0X2Jsb2NrX2RvbWFpbl9mdW5jdGlvbihyZWdpc3RyeTpSZWdpc3RyeSkge1xuICBjb25zdCB7IHN1YnNjcmliZV90ZXN0X2RvbmUgfSA9IHRlc3RfYmxvY2tzLnJlZ2lzdGVyX2RvbWFpbl9mdW5jdGlvbnMoXG4gICAgcmVnaXN0cnksXG4gICAgZ2V0X2Fzc2VydF90b29sKCksXG4gICk7XG4gIHN1YnNjcmliZV90ZXN0X2RvbmUoKCkgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgX3Rlc3RfZmluaXNoZWRfbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBfdGVzdF9maW5pc2hlZF9saXN0ZW5lcnNbaV0oKTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJfdGVzdF9ibG9ja3MocmVnaXN0cnk6UmVnaXN0cnkpIHtcbiAgdGVzdF9ibG9ja3MucmVnaXN0ZXJfYmxvY2tzKHJlZ2lzdHJ5KTtcbiAgcmVnaXN0ZXJfdGVzdF9ibG9ja19kb21haW5fZnVuY3Rpb24ocmVnaXN0cnkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0X3Rlc3RfcmVzdWx0KCkge1xuICByZXR1cm4gZ2V0X2Fzc2VydF90b29sKCkuZ2V0X3Jlc3VsdCgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRfYXNzZXJ0X3Rvb2woKSB7XG4gIHJldHVybiBnZXRfYXNzZXJ0X3Rvb2woKS5yZXNldCgpO1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOzs7Ozs7OztBQXZHQTtBQUNBO0FBMkRBO0FBQ0E7QUFLQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFNQTtBQUNBO0FBR0E7QUFDQTtBQVdBO0FBQ0E7QUFJQTtBQUNBO0FBR0E7Ozs7Ozs7QSIsInNvdXJjZVJvb3QiOiIifQ==