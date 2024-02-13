(this["webpackJsonp"] = this["webpackJsonp"] || []).push([[12],{

/***/ "./node_modules/@cmao/iris/dist/es/iris.js":
/*!*************************************************!*\
  !*** ./node_modules/@cmao/iris/dist/es/iris.js ***!
  \*************************************************/
/*! exports provided: CodemaoApi, CodemaoError, CodemaoRequest, ERROR, U, auth, captcha, config, init, initParams */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CodemaoApi", function() { return api; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CodemaoError", function() { return CodemaoError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CodemaoRequest", function() { return CodemaoRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ERROR", function() { return ERROR_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "U", function() { return utils; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "auth", function() { return auth; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "captcha", function() { return captcha; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "config", function() { return config$1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init$1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initParams", function() { return initParams; });
var configs = {
    'dev': {
        env: 'dev',
        host: {
            tiger: 'https://backend-dev.codemao.cn',
            platform: 'https://dev-open-service.codemao.cn',
        },
        domain: '.codemao.cn',
    },
    'staging': {
        env: 'staging',
        host: {
            tiger: 'https://backend-test.codemao.cn',
            platform: 'https://staging-open-service.codemao.cn',
        },
        domain: '.codemao.cn',
    },
    'prod': {
        env: 'prod',
        host: {
            tiger: 'https://api.codemao.cn',
            platform: 'https://open-service.codemao.cn',
        },
        domain: '.codemao.cn',
    },
    'api-test': {
        env: 'api-test',
        host: {
            tiger: 'https://test-api.codemao.cn',
            platform: 'https://test-open-service.codemao.cn',
        },
        domain: '.codemao.cn',
    },
    'test': {
        env: 'test',
        host: {
            tiger: 'https://test-api.codemao.cn',
            platform: 'https://test-open-service.codemao.cn',
        },
        domain: '.codemao.cn',
    },
    'press': {
        env: 'press',
        host: {
            tiger: 'https://press-api.codemao.cn',
            platform: 'https://press-open-service.codemao.cn',
        },
        domain: '.codemao.cn',
    },
};

/**
 * 业务逻辑错误信息集合。
 * 可以在接口的catch通过err.error_code获取到。
 */
var ERROR_TYPE;
(function (ERROR_TYPE) {
    /**
     * Invalid phone number.
     * 不符合要求的电话号码。
     */
    ERROR_TYPE[ERROR_TYPE["INVALID_PHONE_NUMBER"] = 0] = "INVALID_PHONE_NUMBER";
    /**
     * Invalid captcha.
     * 不符合要求的短信验证码。
     */
    ERROR_TYPE[ERROR_TYPE["INVALID_CAPTCHA"] = 1] = "INVALID_CAPTCHA";
    /**
     * Invalid password.
     * 不符合要求的密码。
     */
    ERROR_TYPE[ERROR_TYPE["INVALID_PASSWORD"] = 2] = "INVALID_PASSWORD";
    /**
     * Invalid username.
     * 不符合要求的用户名。
     */
    ERROR_TYPE[ERROR_TYPE["INVALID_USERNAME"] = 3] = "INVALID_USERNAME";
    /**
     * Invalid nickname.
     * 不符合要求的昵称。
     */
    ERROR_TYPE[ERROR_TYPE["INVALID_NICKNAME"] = 4] = "INVALID_NICKNAME";
    /**
     * Invalid fullname.
     * 不符合要求的全名。
     */
    ERROR_TYPE[ERROR_TYPE["INVALID_FULLNAME"] = 5] = "INVALID_FULLNAME";
    /**
     * Invalid qq.
     * 不符合要求的qq号码。
     */
    ERROR_TYPE[ERROR_TYPE["INVALID_QQ"] = 6] = "INVALID_QQ";
    /**
     * Invalid description.
     * 不符合要求的个人描述。
     */
    ERROR_TYPE[ERROR_TYPE["INVALID_DESCRIPTION"] = 7] = "INVALID_DESCRIPTION";
    /**
     * Invalid sex.
     * 不符合要求的性别。
     */
    ERROR_TYPE[ERROR_TYPE["INVALID_SEX"] = 8] = "INVALID_SEX";
    /**
     * Invalid birthday.
     * 不符合要求的生日时间戳。
     * 格林威治时间1970年01月01日00时00分00秒(北京时间1970年01月01日08时00分00秒)起至现在的
     * 总秒数, 如2018年1月1日，即birthday值为:1514736000
     */
    ERROR_TYPE[ERROR_TYPE["INVALID_BIRTHDAY"] = 9] = "INVALID_BIRTHDAY";
    /**
     * Password not equals confirm password.
     * 密码与确认密码不一致。
     */
    ERROR_TYPE[ERROR_TYPE["PWD_IS_NOT_EQUAL_TO_CONFIRMED_PWD"] = 10] = "PWD_IS_NOT_EQUAL_TO_CONFIRMED_PWD";
    /**
     * No access token when request authorized api.
     * Token 已过期或者没有 token
     * 通常需要重新登录。
     */
    ERROR_TYPE[ERROR_TYPE["NO_TOKEN"] = 11] = "NO_TOKEN";
    /**
     * An error code only appears when the request timeout.
     * 当请求超时会出现的错误码。
     */
    ERROR_TYPE[ERROR_TYPE["REQUEST_TIMEOUT"] = 12] = "REQUEST_TIMEOUT";
    /**
     * An error code only appears when request.onerror ran.
     * 当request.onerror方法被触发时捕获到的错误。
     */
    ERROR_TYPE[ERROR_TYPE["REQUEST_ERROR"] = 13] = "REQUEST_ERROR";
    /**
     * 手机号已注册
     */
    ERROR_TYPE[ERROR_TYPE["PHONE_REGISTERED"] = 14] = "PHONE_REGISTERED";
    /**
     * 手机号暂未注册
     */
    ERROR_TYPE[ERROR_TYPE["PHONE_UNREGISTERED"] = 15] = "PHONE_UNREGISTERED";
    /**
     * 用户不存在或者密码错误
     */
    ERROR_TYPE[ERROR_TYPE["USER_NOT_EXIST_OR_PWD_WRONG"] = 16] = "USER_NOT_EXIST_OR_PWD_WRONG";
    /**
     * 用户不存在
     */
    ERROR_TYPE[ERROR_TYPE["USER_NOT_EXIST"] = 17] = "USER_NOT_EXIST";
    /**
     * 不能设置未来的日期
     */
    ERROR_TYPE[ERROR_TYPE["CANNOT_SET_FUTURE_DATE"] = 18] = "CANNOT_SET_FUTURE_DATE";
    /**
     * 不能重复设置用户名
     */
    ERROR_TYPE[ERROR_TYPE["CANNOT_SET_USERNAME_REPEATEDLY"] = 19] = "CANNOT_SET_USERNAME_REPEATEDLY";
    /**
     * 该用户名已经存在
     */
    ERROR_TYPE[ERROR_TYPE["USERNAME_EXIST"] = 20] = "USERNAME_EXIST";
    /**
     * 用户需要绑定手机
     */
    ERROR_TYPE[ERROR_TYPE["NEED_TO_BIND_PHONE"] = 21] = "NEED_TO_BIND_PHONE";
    /**
     * 需要用当前绑定手机发验证码
     */
    ERROR_TYPE[ERROR_TYPE["USE_BOUND_PHONE_TO_RECEIVE_CAPTCHA"] = 22] = "USE_BOUND_PHONE_TO_RECEIVE_CAPTCHA";
    /**
     * 错误的旧密码
     */
    ERROR_TYPE[ERROR_TYPE["WRONG_OLD_PWD"] = 23] = "WRONG_OLD_PWD";
    /**
     * 密码不一致
     */
    ERROR_TYPE[ERROR_TYPE["PWDS_DO_NOT_MATCH"] = 24] = "PWDS_DO_NOT_MATCH";
    /**
     * 初始密码只能设置一次
     */
    ERROR_TYPE[ERROR_TYPE["INIT_PWD_CAN_SET_ONLY_ONCE"] = 25] = "INIT_PWD_CAN_SET_ONLY_ONCE";
    /**
     * 需存在主账号(至少包含邮箱、用户名、手机其一)
     */
    ERROR_TYPE[ERROR_TYPE["NEED_PRIMARY_ACCOUNT"] = 26] = "NEED_PRIMARY_ACCOUNT";
    /**
     * 校验码验证失败
     */
    ERROR_TYPE[ERROR_TYPE["VERIFY_CAPTCHA_FAIL"] = 27] = "VERIFY_CAPTCHA_FAIL";
    /**
     * 用户已经绑定过手机
     */
    ERROR_TYPE[ERROR_TYPE["USER_PHONE_BOUND"] = 28] = "USER_PHONE_BOUND";
    /**
     * 原手机号不正确
     */
    ERROR_TYPE[ERROR_TYPE["OLD_PHONE_WRONG"] = 29] = "OLD_PHONE_WRONG";
    /**
     * 非法操作
     */
    ERROR_TYPE[ERROR_TYPE["ILLEGAL_OPERATION"] = 30] = "ILLEGAL_OPERATION";
    /**
     * 不能绑定原手机号
     */
    ERROR_TYPE[ERROR_TYPE["CANNOT_BIND_OLD_PHONE"] = 31] = "CANNOT_BIND_OLD_PHONE";
    /**
     * 不合法的oauth_ticket
     */
    ERROR_TYPE[ERROR_TYPE["ILLEGAL_OAUTH_TICKET"] = 32] = "ILLEGAL_OAUTH_TICKET";
    /**
     * 不合法的授权类别
     */
    ERROR_TYPE[ERROR_TYPE["ILLEGAL_AUTHORIZATION_CATEGORY"] = 33] = "ILLEGAL_AUTHORIZATION_CATEGORY";
    /**
     * 第三方授权账号已被绑定
     */
    ERROR_TYPE[ERROR_TYPE["THIRD_PARTY_ACCOUNT_BOUND"] = 34] = "THIRD_PARTY_ACCOUNT_BOUND";
    /**
     * 账号已经绑定同类型授权账号
     */
    ERROR_TYPE[ERROR_TYPE["AUTHORIZATION_ACCOUNT_BOUND"] = 35] = "AUTHORIZATION_ACCOUNT_BOUND";
    /**
     * 请先绑定手机或者设置用户名及密码
     */
    ERROR_TYPE[ERROR_TYPE["BIND_PHONE_OR_SET_USERNAME_AND_PWD"] = 36] = "BIND_PHONE_OR_SET_USERNAME_AND_PWD";
    /**
     * 发送验证码过于频繁
     */
    ERROR_TYPE[ERROR_TYPE["SEND_CAPTCHA_TOO_FRUQUENTLY"] = 37] = "SEND_CAPTCHA_TOO_FRUQUENTLY";
    /**
     * 不合法的pid
     */
    ERROR_TYPE[ERROR_TYPE["ILLEGAL_PID"] = 38] = "ILLEGAL_PID";
    /**
     * 已经存在相同的昵称
     */
    ERROR_TYPE[ERROR_TYPE["NICKNAME_EXIST"] = 39] = "NICKNAME_EXIST";
    /**
     * 该手机号已被其他帐号绑定
     */
    ERROR_TYPE[ERROR_TYPE["PHONE_BOUND_BY_OTHER_ACCOUNT"] = 40] = "PHONE_BOUND_BY_OTHER_ACCOUNT";
    /**
     * QQ登录错误
     */
    ERROR_TYPE[ERROR_TYPE["QQ_ERROR_RECEIVED"] = 41] = "QQ_ERROR_RECEIVED";
    /**
     * 微信登录错误
     */
    ERROR_TYPE[ERROR_TYPE["WECHAR_ERROR_RECEIVED"] = 42] = "WECHAR_ERROR_RECEIVED";
    /**
     * access token 不合法
     */
    ERROR_TYPE[ERROR_TYPE["TOKEN_INVALID"] = 43] = "TOKEN_INVALID";
    /**
     * refresh token 不合法
     */
    ERROR_TYPE[ERROR_TYPE["REFRESH_TOKEN_INVALID"] = 44] = "REFRESH_TOKEN_INVALID";
    /**
     * 错误的 ticket
     */
    ERROR_TYPE[ERROR_TYPE["WRONG_TICKET"] = 45] = "WRONG_TICKET";
    /**
     * 利用旧登录态的 cookie 去获取新登录态的 token的接口
     * 可能会出现的错误。
     */
    ERROR_TYPE[ERROR_TYPE["COOKIE_INVALID"] = 46] = "COOKIE_INVALID";
    ERROR_TYPE[ERROR_TYPE["Appid_NotFound"] = 47] = "Appid_NotFound";
    ERROR_TYPE[ERROR_TYPE["Default_CaptchaRule_NotFound"] = 48] = "Default_CaptchaRule_NotFound";
    ERROR_TYPE[ERROR_TYPE["TencentCaptcha_Exception"] = 49] = "TencentCaptcha_Exception";
    ERROR_TYPE[ERROR_TYPE["GeetestCaptcha_Exception"] = 50] = "GeetestCaptcha_Exception";
})(ERROR_TYPE || (ERROR_TYPE = {}));

var version = "0.7.6";

// All Account 3.0 apis for web.
var Api = {
    REGISTER_SEND_CAPTCHA: '/tiger/v3/web/accounts/captcha/register/phone',
    REGISTER: '/tiger/v3/web/accounts/register/phone',
    LOGIN_CAPTCHA: '/tiger/v3/web/accounts/captcha/login',
    LOGIN_PHONE: '/tiger/v3/web/accounts/phone/login',
    LOGIN_ACCOUNT: '/tiger/v3/web/accounts/login',
    LOGIN_WECHAT: '/tiger/v3/web/accounts/oauth/wechat',
    LOGIN_QQ: '/tiger/v3/web/accounts/oauth/qq',
    BIND_PHONE_FOR_THIRD_PARTY: '/tiger/v3/web/accounts/captcha/oauth',
    CREATE_USER_FOR_THIRD_PARTY: '/tiger/v3/web/accounts/oauth/third-party',
    SET_USERNAME: '/tiger/v3/web/accounts/username',
    BIND_PHONE_CAPTCHA: '/tiger/v3/web/accounts/captcha/phone/bind',
    BIND_PHONE: '/tiger/v3/web/accounts/phone/bind',
    BIND_PHONE_CHECK: '/tiger/v3/web/accounts/phone/check',
    REBIND_PHONE_CAPTCHA: '/tiger/v3/web/accounts/captcha/phone/change',
    REBIND_PHONE: '/tiger/v3/web/accounts/phone/change',
    CHANGE_PWD_BY_OLD: '/tiger/v3/web/accounts/password',
    CHNAGE_PWD_BY_PHONE_CAPTCHA: '/tiger/v3/web/accounts/captcha/password/update',
    CHANGE_PWD_BY_PHONE: '/tiger/v3/web/accounts/password/phone',
    INIT_PASSWORD: '/tiger/v3/web/accounts/password/setting',
    RESET_PWD_CAPTCHA: '/tiger/v3/web/accounts/captcha/password/reset',
    RESET_PWD_TOKEN: '/tiger/v3/web/accounts/captcha/password/check',
    RESET_PWD: '/tiger/v3/web/accounts/password/reset',
    SET_PROFILE: '/tiger/v3/web/accounts/info',
    CHECK_BIND_FOR_THIRD_PARTY: '/tiger/v3/web/accounts/oauths',
    BIND_WECHAT: '/tiger/v3/web/accounts/oauth/wechat/bind',
    UNBIND_WECHAT: '/tiger/v3/web/accounts/oauth/wechat/unbind',
    BIND_QQ: '/tiger/v3/web/accounts/oauth/qq/bind',
    UNBIND_QQ: '/tiger/v3/web/accounts/oauth/qq/unbind',
    GET_PROFILE: '/tiger/v3/web/accounts/profile',
    GET_AUTH: '/tiger/v3/web/accounts/privacy',
    LOGOUT: '/tiger/v3/web/accounts/logout',
    SEND_UNIVERSAL_CAPTCHA: '/tiger/v3/web/accounts/captcha/common',
    VERIFY_UNIVERSAL_CAPTCHA: '/tiger/v3/web/accounts/captcha/common/check',
    LOGIN_CAPTCHA_SILENCE: '/tiger/v3/web/accounts/captcha/login/silence',
    LOGIN_PHONE_SILENCE: '/tiger/v3/web/accounts/phone/login/silence',
    LOGIN_ACCOUNT_TICKET: '/tiger/v3/web/accounts/login/security',
};
var TIGER_CAPTCHA_API = {
    GET_RULE: '/tiger/captcha/graph/rule',
    GET_GEETEST_PARAMS: '/tiger/captcha/graph/geetest/register_slide',
    CHECK_AND_GET_GEETEST_TICKET: '/tiger/captcha/graph/tickets/geetest',
    CHECK_AND_GET_WATERPROOFWALL_TICKET: '/tiger/captcha/graph/tickets/waterproof-wall',
};
var PLATFORM_CAPTCHA_API = {
    GET_RULE: '/captcha/rule',
    GET_GEETEST_PARAMS: '/captcha/geetest/register',
    CHECK_AND_GET_GEETEST_TICKET: '/captcha/geetest/verify',
    CHECK_AND_GET_TENCENT_TICKET: '/captcha/tencent',
};
var TIGER_TOKEN_API = {
    REFRESH_TOKEN: '/tiger/v3/web/accounts/tokens/refresh',
    DELETE_TOKEN: '/tiger/v3/web/accounts/tokens',
    GET_TOKEN_FROM_OLD_COOKIE: '/tiger/v3/web/accounts/tokens/convert',
};
var PUBLIC_HEADERS = {
    'Net': navigator.connection ? navigator.connection.effectiveType : '',
    'SDK-Account-Version': version,
};

var api = /*#__PURE__*/Object.freeze({
__proto__: null,
Api: Api,
TIGER_CAPTCHA_API: TIGER_CAPTCHA_API,
PLATFORM_CAPTCHA_API: PLATFORM_CAPTCHA_API,
TIGER_TOKEN_API: TIGER_TOKEN_API,
PUBLIC_HEADERS: PUBLIC_HEADERS
});

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

/**
 * This file is used to integrate error message.
 */
/**
 * Creates an instance of CodemaoError.
 *
 * @param {number} error_code Unique error code.
 * @param {string} error_msg Error message.
 */
var CodemaoError = /** @class */ (function (_super) {
    __extends(CodemaoError, _super);
    function CodemaoError(options) {
        var _this = _super.call(this, options.message) || this;
        if (options.error_code != undefined) {
            _this.error_code = options.error_code;
        }
        if (options.error_body) {
            _this.error_body = options.error_body;
        }
        return _this;
    }
    return CodemaoError;
}(Error));
// Map the back-end error to iris error.
var BackendError = {
    'AC3_0': {
        error_code: ERROR_TYPE.PHONE_REGISTERED,
        message: 'Phone number is registered.',
    },
    'AC3_1': {
        error_code: ERROR_TYPE.PHONE_UNREGISTERED,
        message: 'Phone number is unregistered.',
    },
    'AC3_2': {
        error_code: ERROR_TYPE.USER_NOT_EXIST_OR_PWD_WRONG,
        message: 'User doesn\'t exist or password is wrong.',
    },
    'AC3_3': {
        error_code: ERROR_TYPE.USER_NOT_EXIST,
        message: 'User doesn\'t exist.',
    },
    'AC3_4': {
        error_code: ERROR_TYPE.CANNOT_SET_FUTURE_DATE,
        message: 'Cannot set a future date.',
    },
    'AC3_5': {
        error_code: ERROR_TYPE.CANNOT_SET_USERNAME_REPEATEDLY,
        message: 'Cannot set the username repeatedly.',
    },
    'AC3_6': {
        error_code: ERROR_TYPE.USERNAME_EXIST,
        message: 'Username is already existed.',
    },
    'AC3_7': {
        error_code: ERROR_TYPE.NEED_TO_BIND_PHONE,
        message: 'User need to bind a phone.',
    },
    'AC3_8': {
        error_code: ERROR_TYPE.USE_BOUND_PHONE_TO_RECEIVE_CAPTCHA,
        message: 'Need to use the bound phone to receive the captcha.',
    },
    'AC3_9': {
        error_code: ERROR_TYPE.WRONG_OLD_PWD,
        message: 'Wrong old password.',
    },
    'AC3_10': {
        error_code: ERROR_TYPE.PWDS_DO_NOT_MATCH,
        message: 'Passwords do not match.',
    },
    'AC3_11': {
        error_code: ERROR_TYPE.INIT_PWD_CAN_SET_ONLY_ONCE,
        message: 'Init-password can be set only once.',
    },
    'AC3_12': {
        error_code: ERROR_TYPE.NEED_PRIMARY_ACCOUNT,
        message: 'Primary account should exist.(one of email, username and phone number).',
    },
    'AC3_13': {
        error_code: ERROR_TYPE.VERIFY_CAPTCHA_FAIL,
        message: 'Fail when verifying the captcha.',
    },
    'AC3_14': {
        error_code: ERROR_TYPE.USER_PHONE_BOUND,
        message: 'User has bound a phone.',
    },
    'AC3_15': {
        error_code: ERROR_TYPE.OLD_PHONE_WRONG,
        message: 'Old phone number is wrong.',
    },
    'AC3_16': {
        error_code: ERROR_TYPE.ILLEGAL_OPERATION,
        message: 'Operation is illegal.',
    },
    'AC3_17': {
        error_code: ERROR_TYPE.CANNOT_BIND_OLD_PHONE,
        message: 'Cannot bind phone with a old phone number.',
    },
    'AC3_18': {
        error_code: ERROR_TYPE.ILLEGAL_OAUTH_TICKET,
        message: 'Oauth_ticket is illegal.',
    },
    'AC3_19': {
        error_code: ERROR_TYPE.ILLEGAL_AUTHORIZATION_CATEGORY,
        message: 'Authorization category is illegal.',
    },
    'AC3_20': {
        error_code: ERROR_TYPE.THIRD_PARTY_ACCOUNT_BOUND,
        message: 'Third-party account has been bound.',
    },
    'AC3_21': {
        error_code: ERROR_TYPE.AUTHORIZATION_ACCOUNT_BOUND,
        message: 'Account has been bound with the the same authorization account.',
    },
    'AC3_22': {
        error_code: ERROR_TYPE.BIND_PHONE_OR_SET_USERNAME_AND_PWD,
        message: 'Please bind a phone or set the username.',
    },
    'AC3_23': {
        error_code: ERROR_TYPE.SEND_CAPTCHA_TOO_FRUQUENTLY,
        message: 'Request captchas too fruquently.',
    },
    'AC3_24': {
        error_code: ERROR_TYPE.ILLEGAL_PID,
        message: 'Pid is illegal.',
    },
    'AC3_25': {
        error_code: ERROR_TYPE.NICKNAME_EXIST,
        message: 'Nickname is already existed.',
    },
    'AC3_26': {
        error_code: ERROR_TYPE.PHONE_BOUND_BY_OTHER_ACCOUNT,
        message: 'Phone has been bound by other account.',
    },
    'AC3_27': {
        error_code: ERROR_TYPE.WRONG_TICKET,
        message: 'Ticket is wrong.',
    },
    'C_1': {
        error_code: ERROR_TYPE.QQ_ERROR_RECEIVED,
        message: 'Receive error from QQ when login with it.',
    },
    'C_2': {
        error_code: ERROR_TYPE.WECHAR_ERROR_RECEIVED,
        message: 'Receive error from WeChat when login with it.',
    },
    '10000000': {
        error_code: ERROR_TYPE.TOKEN_INVALID,
        message: 'Access token is invalid.',
    },
    '10000001': {
        error_code: ERROR_TYPE.REFRESH_TOKEN_INVALID,
        message: 'Refresh token is invalid.',
    },
    '10000002': {
        error_code: ERROR_TYPE.COOKIE_INVALID,
        message: 'Fail to convert cookie to token.',
    },
    '10017001': {
        error_code: ERROR_TYPE.Appid_NotFound,
        message: 'AppidNotFoundException',
    },
    '10017002': {
        error_code: ERROR_TYPE.Default_CaptchaRule_NotFound,
        message: 'DefaultCaptchaRuleNotFoundException',
    },
    '10017003': {
        error_code: ERROR_TYPE.TencentCaptcha_Exception,
        message: 'TencentCaptchaException',
    },
    '10017004': {
        error_code: ERROR_TYPE.GeetestCaptcha_Exception,
        message: 'GeetestCaptchaException',
    },
};

/**
 * Request module to send request.
 */
var CodemaoRequest = /** @class */ (function () {
    function CodemaoRequest(config) {
        this.hostType = (config && config.hostType) || 'tiger';
        this.timeout = (config && config.timeout) || 20000;
        this.public_headers = config && config.public_headers;
    }
    CodemaoRequest.prototype.get_complete_url = function (url, params) {
        var params_str = Object.keys(params)
            .filter(function (key) { return params[key]; })
            .map(function (key) { return key + "=" + params[key]; })
            .join('&');
        return Object.keys(params).length === 0
            ? "" + config$1.host[this.hostType] + url
            : "" + config$1.host[this.hostType] + url + "?" + params_str;
    };
    CodemaoRequest.prototype.dispatch_request = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var url, method, data, without_base_url, params, compatibleHeaders, headers, request_url, auth_version, request;
                        return __generator(this, function (_a) {
                            url = options.url, method = options.method, data = options.data, without_base_url = options.without_base_url;
                            params = options.params || {};
                            compatibleHeaders = {};
                            if (initParams.auth_version) {
                                compatibleHeaders['Auth-Version'] = initParams.auth_version;
                            }
                            if (initParams.client_id) {
                                compatibleHeaders['Client-ID'] = initParams.client_id;
                            }
                            headers = __assign(__assign(__assign({}, this.public_headers), options.headers), compatibleHeaders);
                            request_url = without_base_url ? url : this.get_complete_url(url, params);
                            if (options.is_new_token && initParams.auth_version) {
                                auth_version = initParams.auth_version;
                                Object.assign(data, {
                                    auth_version: auth_version,
                                });
                            }
                            request = new XMLHttpRequest();
                            request.open(method.toUpperCase(), request_url, true);
                            // Data will be sent with json Content-Type
                            data && request.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
                            request.timeout = initParams.requestTimeout || this.timeout;
                            request.withCredentials = true;
                            request.onreadystatechange = function handle_loaded() {
                                var _a;
                                if (!request || request.readyState !== 4) {
                                    return;
                                }
                                // The request errored out and we didn't get a response, this will be
                                // handled by onerror instead
                                // With one exception: request that using file: protocol, most browsers
                                // will return status as 0 even though it's a successful request
                                if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
                                    return;
                                }
                                if (request.status >= 200 && request.status <= 300) {
                                    var response = request.response;
                                    if (response) {
                                        // status
                                        resolve({
                                            status: request.status,
                                            statusText: request.statusText,
                                            data: JSON.parse(response),
                                        });
                                    }
                                    else {
                                        resolve({
                                            status: request.status,
                                            statusText: request.statusText,
                                            data: null,
                                        });
                                    }
                                }
                                else {
                                    try {
                                        var response = JSON.parse(request.response);
                                        // contains iris's error & request_with_token() back-end error.
                                        var error = BackendError[response.error_code];
                                        if (error) {
                                            reject(new CodemaoError(error));
                                        }
                                        else {
                                            reject(new CodemaoError({
                                                error_code: response.error_code,
                                                error_body: ((_a = response.catastrophe) === null || _a === void 0 ? void 0 : _a.error) || response,
                                                message: "Get error from " + request_url + ".",
                                            }));
                                        }
                                    }
                                    catch (error) {
                                        console.log('error is', error);
                                        reject(error);
                                    }
                                }
                                // Clean up request.
                                // request = null;
                            };
                            // Handle low level network errors
                            request.onerror = function () {
                                // Real errors are hidden from us by the browser
                                // onerror should only fire if it's a network error
                                reject(new CodemaoError({
                                    error_code: ERROR_TYPE.REQUEST_ERROR,
                                    message: 'Network error.',
                                }));
                                // Clean up request.
                                // request = null;
                            };
                            // Handle timeout
                            request.ontimeout = function () {
                                reject(new CodemaoError({
                                    error_code: ERROR_TYPE.REQUEST_TIMEOUT,
                                    message: "ECONNABORTED:timeout of " + request.timeout + " ms exceeded.",
                                }));
                                // Clean up request.
                                // request = null;
                            };
                            if ('setRequestHeader' in request) {
                                Object.keys(headers).forEach(function (val) {
                                    request.setRequestHeader(val, headers[val]);
                                });
                            }
                            if (data) {
                                request.send(JSON.stringify(data));
                            }
                            else {
                                request.send();
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    return CodemaoRequest;
}());
var TigerApi = new CodemaoRequest();
var PlatformApi = new CodemaoRequest({
    hostType: 'platform',
});

// Function to check if input params' properties are valid.
function check_input_params(obj, check_properties) {
    if (obj) {
        Object.keys(obj).map(function (property) {
            if (check_properties.indexOf(property) === -1) {
                throw new CodemaoError({
                    message: "Invalid param \"" + property + "\"",
                });
            }
        });
    }
}
// All RegExp for validation
var phone_number_pattern = /^1[3456789]\d{9}$/;
var captcha_pattern = /^\d{6}$/;
var password_pattern = /^[a-zA-Z0-9\_\-@#?!~$^&\*\(\)\/%<>,\.;:"+=|\\{}\[\]]{6,20}$/;
var username_pattern = /^[a-zA-Z]{1}\w{5,29}$/;
var nickname_pattern = /^[^\s☀☁☂ϟ☉☼☾☽♁♨❄❅❆☃☁✉℡℻☎☏✂✄✆✎✏✐✑✒✇℗©®🅏🆏⚐⚑⚆⚇⚈⚉⚞⚟⚠⚬⚭⚮⚯☊㋀㋁㋂㋃㋄㋅㋆㋇㋈㋉㋊㋋㏠㏡㏢㏣㏤㏥㏦㏧㏨㏩ ㏪㏫㏬㏭㏮㏯㏰㏱㏲㏳㏴㏵㏶㏷㏸㏹㏺㏻㏼㏽㏾㍘㍙㍚㍛㍜㍝㍞㍟㍠㍡㍢㍣㍤㍥㍦㍧㍨㍩㍪㍫㍬㍭㍮㍯㍰㏂㏘♳♴♵♶♷♸♹♺♲♻♼♽⚀⚁⚂⚃⚄⚅]{1,20}$/;
var fullname_pattern = /^([\u4e00-\u9fa5]{2,20}|[a-zA-Z](\s?[a-zA-Z]){3,29})$/;
var qq_pattern = /^\d{5,20}$/;
function check(property_name, pattern, error_code) {
    return function (property_value) {
        if (!pattern.test(property_value)) {
            throw new CodemaoError({
                error_code: error_code,
                message: "Invalid " + property_name + " \"" + property_value + "\", it should match the RegExp " + pattern + ".",
            });
        }
    };
}
// Function to check phone number
var check_phone_number = check('phone_number', phone_number_pattern, ERROR_TYPE.INVALID_PHONE_NUMBER);
// Function to check captcha
var check_captcha = check('captcha', captcha_pattern, ERROR_TYPE.INVALID_CAPTCHA);
// Function to check password
var check_password = check('password', password_pattern, ERROR_TYPE.INVALID_PASSWORD);
// Function to check username
var check_username = check('username', username_pattern, ERROR_TYPE.INVALID_USERNAME);
// Function to check nickname
var check_nickname = check('nickname', nickname_pattern, ERROR_TYPE.INVALID_NICKNAME);
// Function to check fullname
var check_fullname = check('fullname', fullname_pattern, ERROR_TYPE.INVALID_FULLNAME);
// Function to check qq
var check_qq = check('qq', qq_pattern, ERROR_TYPE.INVALID_QQ);
// Function to check description
function check_description(description) {
    if (description.length > 50) {
        throw new CodemaoError({
            error_code: ERROR_TYPE.INVALID_DESCRIPTION,
            message: 'Invalid description, it should contains only 0 - 50 characters.',
        });
    }
}
// Function to check sex
function check_sex(sex) {
    if (sex !== 0 && sex !== 1) {
        throw new CodemaoError({
            error_code: ERROR_TYPE.INVALID_SEX,
            message: "Invalid sex \"" + sex + "\", it should be 0 or 1.",
        });
    }
}
// Function to check birthday
function check_birthday(birthday) {
    if (!Number.isInteger(birthday)) {
        throw new CodemaoError({
            error_code: ERROR_TYPE.INVALID_BIRTHDAY,
            message: "Invalid birthday \"" + birthday + "\", it should be a integer number.",
        });
    }
}
/**
 * Function to check register options.
 *
 * @export
 * @param {RegisterOptions} options
 */
function check_register_options(options) {
    var phone_number = options.phone_number, password = options.password, captcha = options.captcha;
    check_phone_number(phone_number);
    check_password(password);
    check_captcha(captcha);
}
/**
 * Function to check user profilr for set_profile.
 *
 * @export
 * @param {UserProfile} profile
 */
function check_profile(profile) {
    var birthday = profile.birthday, sex = profile.sex, fullname = profile.fullname, nickname = profile.nickname, qq = profile.qq, description = profile.description;
    if (birthday) {
        check_birthday(birthday);
    }
    if (sex) {
        check_sex(sex);
    }
    if (fullname) {
        check_fullname(fullname);
    }
    if (nickname) {
        check_nickname(nickname);
    }
    if (qq) {
        check_qq(qq);
    }
    if (description) {
        check_description(description);
    }
}
/**
 * Functio to check if password equals confirm password.
 *
 * @export
 * @param {string} pwd
 * @param {string} pwd_confirm
 */
function check_if_pwd_equals_confirmed_pwd(pwd, pwd_confirm) {
    if (pwd !== pwd_confirm) {
        throw new CodemaoError({
            error_code: ERROR_TYPE.PWD_IS_NOT_EQUAL_TO_CONFIRMED_PWD,
            message: 'Password is not equal to confirmed password.',
        });
    }
}
/**
 * Function to retry a promise for retries times.
 *
 * @export
 * @param {number} retries
 * @param {Function} fn
 * @returns {Promise<any>}
 */
function retry(retries, fn) {
    return __awaiter(this, void 0, void 0, function () {
        var result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fn()];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 2:
                    err_1 = _a.sent();
                    if (retries > 1) {
                        return [2 /*return*/, retry(retries - 1, fn)];
                    }
                    else {
                        throw new CodemaoError({
                            message: 'Get geetest init params fail, please reload the page or try again later.',
                        });
                    }
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to set cookie with options.
function set_cookie(options) {
    var name = options.name, value = options.value, domain = options.domain, max_age = options.max_age;
    var cookieString = name + "=" + value + "; domain=" + domain + "; max-age=" + max_age + "; path=/;";
    var sameSiteCookie = cookieString + ' samesite=none; secure';
    document.cookie = cookieString;
    document.cookie = sameSiteCookie;
}
// Function to get cookie by name.
function get_cookie(name) {
    var cookies = {};
    document.cookie.split(';').forEach(function (cookie) {
        var first_equal_mark_position = cookie.indexOf('=');
        var key = cookie.slice(0, first_equal_mark_position);
        var value = cookie.slice(first_equal_mark_position + 1);
        cookies[key.trim()] = value;
    });
    return cookies[name];
}
// Function to clear cookie by setting max-age to negative number.
function clear_cookie(name, domain) {
    set_cookie({
        name: name,
        value: '',
        domain: domain,
        max_age: -999999,
    });
}
// Function to generate the cookie name according to the env.
function get_cookie_name(type) {
    var env = config$1.env;
    var prefix = env === 'prod' ? '' : env + "-";
    if (type === 'token_type') {
        /**
         * All possible result
         * 1. prod -- token-type
         * 2. dev -- dev-token-type
         * 3. staging -- staging-token-type
         * 4. api-test -- api-test-token-type
         */
        return prefix + "token-type";
    }
    /**
     * All possible result
     * 1. prod -- ${type}-token
     * 2. dev -- dev-${type}-token
     * 3. staging -- staging-${type}-token
     * 4. api-test -- api-test-${type}-token
     */
    return "" + prefix + type + "-token";
}
function is_cookie_exist(cookie) {
    return (cookie &&
        cookie !== 'undefined' &&
        cookie !== '') ? true : false;
}
function load_script(url, id, timeout) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (!document.getElementById(id)) {
                        var timer_1;
                        if (timeout) {
                            timer_1 = setTimeout(function () { resolve(); clearTimeout(timer_1); }, timeout * 1000);
                        }
                        var script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.onload = function () {
                            resolve();
                            if (timer_1) {
                                clearTimeout(timer_1);
                            }
                        };
                        script.id = id;
                        script.src = url;
                        document.getElementsByTagName('head')[0].appendChild(script);
                    }
                    else {
                        resolve();
                    }
                })];
        });
    });
}

var utils = /*#__PURE__*/Object.freeze({
__proto__: null,
check_input_params: check_input_params,
check_phone_number: check_phone_number,
check_captcha: check_captcha,
check_password: check_password,
check_username: check_username,
check_nickname: check_nickname,
check_fullname: check_fullname,
check_qq: check_qq,
check_description: check_description,
check_sex: check_sex,
check_birthday: check_birthday,
check_register_options: check_register_options,
check_profile: check_profile,
check_if_pwd_equals_confirmed_pwd: check_if_pwd_equals_confirmed_pwd,
retry: retry,
set_cookie: set_cookie,
get_cookie: get_cookie,
clear_cookie: clear_cookie,
get_cookie_name: get_cookie_name,
is_cookie_exist: is_cookie_exist,
load_script: load_script
});

// A class to manage token for CodemaoAuth and business parties.
var CodemaoToken = /** @class */ (function () {
    function CodemaoToken() {
        this.request = new CodemaoRequest({
            public_headers: __assign({ 'Product-Code': config.product_code, 'Platform': config.platform }, PUBLIC_HEADERS),
        });
    }
    CodemaoToken.prototype.dispatch_request = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request.dispatch_request(options)];
            });
        });
    };
    // Get the full access token -- 'type access-token'
    CodemaoToken.prototype.get_complete_access_token = function () {
        var token_type = get_cookie(get_cookie_name('token_type'));
        var access_token = get_cookie(get_cookie_name('access'));
        if (is_cookie_exist(token_type) &&
            is_cookie_exist(access_token)) {
            return token_type + " " + access_token;
        }
        else {
            // Clear the previous access & type cookie.
            var domain = config$1.domain;
            clear_cookie(get_cookie_name('access'), domain);
            clear_cookie(get_cookie_name('token_type'), domain);
            throw new CodemaoError({
                error_code: ERROR_TYPE.NO_TOKEN,
                message: 'NO Token(cookie might have been expired). Please login.',
            });
        }
    };
    // Get local access token which stored in cookie.
    CodemaoToken.prototype.get_access = function (authorization) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, res, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.check();
                        switch (_a) {
                            case 'ACCESS_EXIST': return [3 /*break*/, 1];
                            case 'REFRESH_EXIST': return [3 /*break*/, 2];
                            case 'NO_TOKEN': return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 7];
                    case 1: 
                    // Get the access token directly.
                    return [2 /*return*/, this.get_complete_access_token()];
                    case 2: 
                    // Refresh firstly, then get access token.
                    return [4 /*yield*/, this.refresh()];
                    case 3:
                        // Refresh firstly, then get access token.
                        _b.sent();
                        return [2 /*return*/, this.get_complete_access_token()];
                    case 4:
                        _b.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.convert_cookie_to_token(authorization)];
                    case 5:
                        res = _b.sent();
                        this.set(res.data);
                        return [2 /*return*/, this.get_complete_access_token()];
                    case 6:
                        err_1 = _b.sent();
                        // Case 2: no token and no cookie or get cookie_invalid
                        this.clear();
                        throw new CodemaoError({
                            error_code: ERROR_TYPE.NO_TOKEN,
                            message: 'NO Token. Please login.',
                        });
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    CodemaoToken.prototype.convert_cookie_to_token = function (authorization) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dispatch_request({
                        url: TIGER_TOKEN_API.GET_TOKEN_FROM_OLD_COOKIE,
                        method: 'post',
                        headers: authorization ? {
                            Authorization: "Bearer " + authorization,
                        } : {},
                    })];
            });
        });
    };
    // Get local refresh token which stored in cookie.
    CodemaoToken.prototype.get_refresh = function () {
        if (initParams.auth_version) {
            if (this.check() === 'NO_TOKEN') {
                throw new CodemaoError({
                    error_code: ERROR_TYPE.NO_TOKEN,
                    message: 'NO Token. Please login.',
                });
            }
        }
        return get_cookie(get_cookie_name('refresh'));
    };
    // Pass the token to cookie.
    // Every time after auth.login_xxx() & refresh().
    CodemaoToken.prototype.set = function (token) {
        var access = token.access, refresh = token.refresh;
        var domain = config$1.domain;
        // Set access token to cookie.
        if (access &&
            access.token &&
            access.type &&
            access.expires_in) {
            set_cookie({
                name: get_cookie_name('access'),
                value: access.token,
                domain: domain,
                max_age: access.expires_in,
            });
            // Set token type to cookie.
            set_cookie({
                name: get_cookie_name('token_type'),
                value: access.type,
                domain: domain,
                max_age: access.expires_in,
            });
        }
        else {
            console.warn('Unexpected access token response from back-end: ', access);
        }
        // Check if refresh_token exists.
        // Set it to cookie if it exists.
        if (refresh) {
            if (!refresh.token || !refresh.expires_in) {
                console.warn('Unexpected refresh token response from back-end: ', refresh);
            }
            set_cookie({
                name: get_cookie_name('refresh'),
                value: refresh.token,
                domain: domain,
                max_age: refresh.expires_in,
            });
        }
    };
    // Refresh token from back-end.
    CodemaoToken.prototype.refresh_token = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dispatch_request({
                        method: 'put',
                        url: TIGER_TOKEN_API.REFRESH_TOKEN,
                        data: {
                            refresh_token: this.get_refresh(),
                        },
                    })];
            });
        });
    };
    // Refresh token from back-end and pass it to cookie.
    CodemaoToken.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            var token_res, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.refresh_token()];
                    case 1:
                        token_res = _a.sent();
                        this.set(token_res.data);
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        // Clear cookie when refresh_token is invalid.
                        if (err_2.error_code === ERROR_TYPE.REFRESH_TOKEN_INVALID) {
                            this.clear();
                        }
                        throw err_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Check if it's necessary to refresh token.
    CodemaoToken.prototype.check = function () {
        // access_token is not expired
        if (is_cookie_exist(get_cookie(get_cookie_name('access'))) &&
            is_cookie_exist(get_cookie(get_cookie_name('token_type')))) {
            return 'ACCESS_EXIST';
        }
        // access_token expired, refresh_token is not expired.
        if (is_cookie_exist(get_cookie(get_cookie_name('refresh')))) {
            return 'REFRESH_EXIST';
        }
        // both of them are expired.
        // or,
        // someone tries to request the api without login.
        return 'NO_TOKEN';
    };
    // Clear local token through setting cookie.
    CodemaoToken.prototype.clear = function () {
        var domain = config$1.domain;
        clear_cookie(get_cookie_name('access'), domain);
        clear_cookie(get_cookie_name('token_type'), domain);
        clear_cookie(get_cookie_name('refresh'), domain);
    };
    return CodemaoToken;
}());
function retry_when_token_err(retries, fn) {
    return __awaiter(this, void 0, void 0, function () {
        var result, err_3, error_code, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 5]);
                    return [4 /*yield*/, fn()];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 2:
                    err_3 = _a.sent();
                    error_code = err_3.error_code;
                    if (!(error_code === ERROR_TYPE.TOKEN_INVALID && retries > 1)) return [3 /*break*/, 4];
                    token = new CodemaoToken();
                    return [4 /*yield*/, token.refresh()];
                case 3:
                    _a.sent();
                    return [2 /*return*/, retry_when_token_err(retries - 1, fn)];
                case 4: throw err_3;
                case 5: return [2 /*return*/];
            }
        });
    });
}

var _instance;
var config;
function init(params) {
    config = params;
    if (config.pid && config.platform && config.product_code) {
        _instance = new CodemaoAuth();
        return _instance;
    }
    else {
        throw new CodemaoError({
            message: 'Auth init fail.Check init params.',
        });
    }
}
/**
 * Returns the CodemaoAuth object. You must initialize the CodemaoAuth object
 * with iris.auth.init() before calling this method.
 *
 * @export
 * @returns
 */
function get_auth_instance() {
    if (!_instance) {
        throw new CodemaoError({
            message: 'Please run init() before get_auth_instance().',
        });
    }
    return _instance;
}
var retries_when_got_token_err = 2;
var CodemaoAuth = /** @class */ (function () {
    function CodemaoAuth() {
        this.request = new CodemaoRequest({
            public_headers: __assign({ 'Product-Code': config.product_code, 'Platform': config.platform }, PUBLIC_HEADERS),
        });
        this.token = new CodemaoToken();
    }
    /**
     * Dispatch a request with options.
     *
     * @param options
     * @returns {Promise<{}>}
     */
    CodemaoAuth.prototype.dispatch_request = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(options.with_token && initParams.auth_version)) return [3 /*break*/, 2];
                        options.headers = options.headers || {};
                        _a = options.headers;
                        _b = 'Authorization';
                        return [4 /*yield*/, this.token.get_access()];
                    case 1:
                        _a[_b] = _c.sent();
                        return [2 /*return*/, retry_when_token_err(retries_when_got_token_err, function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, this.request.dispatch_request(options)];
                            }); }); })];
                    case 2: return [2 /*return*/, this.request.dispatch_request(options)];
                }
            });
        });
    };
    /**
     * 发送注册验证码
     *
     * @param phone_number
     * @param ticket
     * @param pid
     */
    CodemaoAuth.prototype.register_send_captcha = function (phone_number, ticket, pid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                check_phone_number(phone_number);
                return [2 /*return*/, this.dispatch_request({
                        url: Api.REGISTER_SEND_CAPTCHA,
                        method: 'post',
                        data: {
                            phone_number: phone_number,
                            pid: pid,
                        },
                        headers: {
                            'X-Captcha-Ticket': ticket,
                        },
                    })];
            });
        });
    };
    /**
     * 用户注册
     *
     * @param options
     * @param specific_pid 可选参数，以特定的pid进行这次请求
     */
    CodemaoAuth.prototype.register = function (options, specific_pid) {
        return __awaiter(this, void 0, void 0, function () {
            var pid, register_res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        check_input_params(options, ['phone_number', 'captcha', 'password']);
                        check_register_options(options);
                        pid = specific_pid || config.pid;
                        return [4 /*yield*/, this.dispatch_request({
                                url: Api.REGISTER,
                                method: 'post',
                                data: __assign(__assign({}, options), { pid: pid }),
                                is_new_token: true,
                            })];
                    case 1:
                        register_res = _a.sent();
                        if (register_res.status === 200) {
                            this.token.set(register_res.data.auth.token);
                        }
                        return [2 /*return*/, register_res];
                }
            });
        });
    };
    /**
     * 发送登录验证码
     *
     * @param phone_number
     * @param ticket
     * @param pid
     */
    CodemaoAuth.prototype.login_captcha = function (phone_number, ticket, pid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                check_phone_number(phone_number);
                return [2 /*return*/, this.dispatch_request({
                        url: Api.LOGIN_CAPTCHA,
                        method: 'post',
                        data: {
                            phone_number: phone_number,
                            pid: pid,
                        },
                        headers: {
                            'X-Captcha-Ticket': ticket,
                        },
                    })];
            });
        });
    };
    /**
     * 手机登录
     *
     * @param phone_number
     * @param captcha
     * @param specific_pid 可选参数，以特定的pid进行这次请求
     */
    CodemaoAuth.prototype.login_phone = function (phone_number, captcha, specific_pid) {
        return __awaiter(this, void 0, void 0, function () {
            var pid, login_res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        check_phone_number(phone_number);
                        check_captcha(captcha);
                        pid = specific_pid || config.pid;
                        return [4 /*yield*/, this.dispatch_request({
                                url: Api.LOGIN_PHONE,
                                method: 'post',
                                data: {
                                    phone_number: phone_number,
                                    captcha: captcha,
                                    pid: pid,
                                },
                                is_new_token: true,
                            })];
                    case 1:
                        login_res = _a.sent();
                        if (login_res.status === 200) {
                            this.token.set(login_res.data.auth.token);
                        }
                        return [2 /*return*/, login_res];
                }
            });
        });
    };
    /**
     * 账号登录
     *
     * @param identity
     * @param password
     * @param specific_pid 可选参数，以特定的pid进行这次请求
     */
    CodemaoAuth.prototype.login_account = function (identity, password, specific_pid) {
        return __awaiter(this, void 0, void 0, function () {
            var pid, login_res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pid = specific_pid || config.pid;
                        return [4 /*yield*/, this.dispatch_request({
                                url: Api.LOGIN_ACCOUNT,
                                method: 'post',
                                data: {
                                    identity: identity,
                                    password: password,
                                    pid: pid,
                                },
                                is_new_token: true,
                            })];
                    case 1:
                        login_res = _a.sent();
                        if (login_res.status === 200) {
                            this.token.set(login_res.data.auth.token);
                        }
                        return [2 /*return*/, login_res];
                }
            });
        });
    };
    /**
     * 微信网页端登录
     *
     * @param code
     * @param specific_pid 可选参数，以特定的pid进行这次请求
     * @param appid 可选,不传默认开放平台网页应用登录, 也可传编程猫下各公众号appid，需联系后端账号负责人配置
     */
    CodemaoAuth.prototype.login_wechat = function (code, specific_pid, appid) {
        return __awaiter(this, void 0, void 0, function () {
            var pid, login_res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pid = specific_pid || config.pid;
                        return [4 /*yield*/, this.dispatch_request({
                                url: Api.LOGIN_WECHAT,
                                method: 'post',
                                data: {
                                    code: code,
                                    pid: pid,
                                    appid: appid,
                                },
                                is_new_token: true,
                            })];
                    case 1:
                        login_res = _a.sent();
                        if (login_res.status === 200 && login_res.data.auth) {
                            this.token.set(login_res.data.auth.token);
                        }
                        return [2 /*return*/, login_res];
                }
            });
        });
    };
    /**
     * QQ网页端登录
     *
     * @param code
     * @param specific_pid 可选参数，以特定的pid进行这次请求
     */
    CodemaoAuth.prototype.login_qq = function (code, specific_pid) {
        return __awaiter(this, void 0, void 0, function () {
            var pid, login_res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pid = specific_pid || config.pid;
                        return [4 /*yield*/, this.dispatch_request({
                                url: Api.LOGIN_QQ,
                                method: 'post',
                                data: {
                                    code: code,
                                    pid: pid,
                                },
                                is_new_token: true,
                            })];
                    case 1:
                        login_res = _a.sent();
                        if (login_res.status === 200 && login_res.data.auth) {
                            this.token.set(login_res.data.auth.token);
                        }
                        return [2 /*return*/, login_res];
                }
            });
        });
    };
    /**
     * 发送第三方绑定手机验证码
     *
     * @param phone_number
     * @param oauth_ticket
     */
    CodemaoAuth.prototype.bind_phone_for_third_party = function (phone_number, oauth_ticket) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                check_phone_number(phone_number);
                return [2 /*return*/, this.dispatch_request({
                        url: Api.BIND_PHONE_FOR_THIRD_PARTY,
                        method: 'post',
                        data: {
                            phone_number: phone_number,
                            oauth_ticket: oauth_ticket,
                        },
                    })];
            });
        });
    };
    /**
     * 第三方登录（激活）
     *
     * @param ticket
     * @param captcha
     */
    CodemaoAuth.prototype.create_user_for_third_party = function (oauth_ticket, captcha) {
        return __awaiter(this, void 0, void 0, function () {
            var login_res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (captcha) {
                            check_captcha(captcha);
                        }
                        return [4 /*yield*/, this.dispatch_request({
                                url: Api.CREATE_USER_FOR_THIRD_PARTY,
                                method: 'post',
                                data: captcha
                                    ? {
                                        oauth_ticket: oauth_ticket,
                                        captcha: captcha,
                                    }
                                    : {
                                        oauth_ticket: oauth_ticket,
                                    },
                                is_new_token: true,
                            })];
                    case 1:
                        login_res = _a.sent();
                        if (login_res.status === 200) {
                            this.token.set(login_res.data.auth.token);
                        }
                        return [2 /*return*/, login_res];
                }
            });
        });
    };
    /**
     * 退出登录
     *
     */
    CodemaoAuth.prototype.logout = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dispatch_request({
                            url: Api.LOGOUT,
                            method: 'post',
                            data: {
                                refresh_token: this.token.get_refresh(),
                            },
                            with_token: true,
                        })];
                    case 1:
                        res = _a.sent();
                        if (res) {
                            this.token.clear();
                        }
                        return [2 /*return*/, res];
                }
            });
        });
    };
    /**
     * 发送绑定手机验证码
     *
     * @param phone_number
     * @param pid
     */
    CodemaoAuth.prototype.bind_phone_captcha = function (phone_number, ticket, pid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                check_phone_number(phone_number);
                return [2 /*return*/, this.dispatch_request({
                        url: Api.BIND_PHONE_CAPTCHA,
                        method: 'post',
                        data: {
                            phone_number: phone_number,
                            pid: pid,
                        },
                        headers: {
                            'X-Captcha-Ticket': ticket,
                        },
                        with_token: true,
                    })];
            });
        });
    };
    /**
     * 绑定手机
     *
     * @param phone_number
     * @param captcha
     */
    CodemaoAuth.prototype.bind_phone = function (phone_number, captcha) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                check_phone_number(phone_number);
                check_captcha(captcha);
                return [2 /*return*/, this.dispatch_request({
                        url: Api.BIND_PHONE,
                        method: 'patch',
                        data: {
                            phone_number: phone_number,
                            captcha: captcha,
                        },
                        with_token: true,
                    })];
            });
        });
    };
    /**
     * 检测输入手机是否当前绑定手机
     *
     * @param phone_number
     */
    CodemaoAuth.prototype.bind_phone_check = function (phone_number) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                check_phone_number(phone_number);
                return [2 /*return*/, this.dispatch_request({
                        url: Api.BIND_PHONE_CHECK,
                        method: 'get',
                        params: {
                            phone_number: phone_number,
                        },
                        with_token: true,
                    })];
            });
        });
    };
    /**
     * 发送更新绑定手机的验证码
     *
     * @param phone_number
     * @param old_phone_number
     * @param pid
     */
    CodemaoAuth.prototype.rebind_phone_captcha = function (phone_number, old_phone_number, pid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                check_phone_number(phone_number);
                check_phone_number(old_phone_number);
                return [2 /*return*/, this.dispatch_request({
                        url: Api.REBIND_PHONE_CAPTCHA,
                        method: 'post',
                        data: {
                            phone_number: phone_number,
                            old_phone_number: old_phone_number,
                            pid: pid,
                        },
                        with_token: true,
                    })];
            });
        });
    };
    /**
     * 更新绑定手机
     *
     * @param phone_number
     * @param captcha
     */
    CodemaoAuth.prototype.rebind_phone = function (phone_number, captcha) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                check_phone_number(phone_number);
                check_captcha(captcha);
                return [2 /*return*/, this.dispatch_request({
                        url: Api.REBIND_PHONE,
                        method: 'patch',
                        data: {
                            phone_number: phone_number,
                            captcha: captcha,
                        },
                        with_token: true,
                    })];
            });
        });
    };
    /**
     * 发送重置密码的验证码
     *
     * @param phone_number
     * @param ticket
     * @param pid
     */
    CodemaoAuth.prototype.reset_pwd_captcha = function (phone_number, ticket, pid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                check_phone_number(phone_number);
                return [2 /*return*/, this.dispatch_request({
                        url: Api.RESET_PWD_CAPTCHA,
                        method: 'post',
                        data: {
                            phone_number: phone_number,
                            pid: pid,
                        },
                        headers: {
                            'X-Captcha-Ticket': ticket,
                        },
                    })];
            });
        });
    };
    /**
     * 检测并重置密码ticket
     *
     * @param phone_number
     * @param captcha
     */
    CodemaoAuth.prototype.reset_pwd_token = function (phone_number, captcha) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                check_phone_number(phone_number);
                check_captcha(captcha);
                return [2 /*return*/, this.dispatch_request({
                        url: Api.RESET_PWD_TOKEN,
                        method: 'post',
                        data: {
                            phone_number: phone_number,
                            captcha: captcha,
                        },
                    })];
            });
        });
    };
    /**
     * 重置密码
     *
     * @param ticket
     * @param pwd
     * @param pwd_confirm
     */
    CodemaoAuth.prototype.reset_pwd = function (ticket, pwd, pwd_confirm) {
        return __awaiter(this, void 0, void 0, function () {
            var request_options, token, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        check_password(pwd);
                        check_password(pwd_confirm);
                        check_if_pwd_equals_confirmed_pwd(pwd, pwd_confirm);
                        request_options = {
                            url: Api.RESET_PWD,
                            method: 'patch',
                            data: {
                                ticket: ticket,
                                password: pwd,
                                confirm_password: pwd_confirm,
                            },
                            is_new_token: true,
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.token.get_access()];
                    case 2:
                        token = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        token = '';
                        return [3 /*break*/, 4];
                    case 4:
                        token !== '' && Object.assign(request_options, {
                            with_token: true,
                        });
                        return [2 /*return*/, this.dispatch_request(request_options)];
                }
            });
        });
    };
    /**
     * 通用验证码之发送验证码
     *
     * @param {string} phone_number
     * @param {string} ticket
     * @param {string} pid
     */
    CodemaoAuth.prototype.send_universal_captcha = function (phone_number, ticket, pid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                check_phone_number(phone_number);
                return [2 /*return*/, this.dispatch_request({
                        url: Api.SEND_UNIVERSAL_CAPTCHA,
                        method: 'post',
                        data: {
                            phone_number: phone_number,
                            pid: pid,
                        },
                        headers: {
                            'X-Captcha-Ticket': ticket,
                        },
                    })];
            });
        });
    };
    /**
     * 通用验证码之校验验证码
     *
     * @param {string} phone_number
     * @param {string} captcha
     */
    CodemaoAuth.prototype.verify_universal_captcha = function (phone_number, captcha) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                check_phone_number(phone_number);
                check_captcha(captcha);
                return [2 /*return*/, this.dispatch_request({
                        url: Api.VERIFY_UNIVERSAL_CAPTCHA,
                        method: 'post',
                        data: {
                            phone_number: phone_number,
                            captcha: captcha,
                        },
                    })];
            });
        });
    };
    /**
     * 发送登录验证码(静默注册版本)
     *
     * @param {string} phone_number
     * @param {string} ticket
     * @param {string} pid
     */
    CodemaoAuth.prototype.login_captcha_silence = function (phone_number, ticket, pid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                check_phone_number(phone_number);
                return [2 /*return*/, this.dispatch_request({
                        url: Api.LOGIN_CAPTCHA_SILENCE,
                        method: 'post',
                        data: {
                            phone_number: phone_number,
                            pid: pid,
                        },
                        headers: {
                            'X-Captcha-Ticket': ticket,
                        },
                    })];
            });
        });
    };
    /**
     * 手机登录(静默注册版)
     *
     * @param {string} phone_number
     * @param {string} captcha
     * @param {string} specific_pid 特定的pid
     */
    CodemaoAuth.prototype.login_phone_silence = function (phone_number, captcha, specific_pid) {
        return __awaiter(this, void 0, void 0, function () {
            var pid, login_res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        check_phone_number(phone_number);
                        check_captcha(captcha);
                        pid = specific_pid || config.pid;
                        return [4 /*yield*/, this.dispatch_request({
                                url: Api.LOGIN_PHONE_SILENCE,
                                method: 'post',
                                data: {
                                    phone_number: phone_number,
                                    captcha: captcha,
                                    pid: pid,
                                },
                            })];
                    case 1:
                        login_res = _a.sent();
                        if (login_res.status === 200) {
                            this.token.set(login_res.data.auth.token);
                        }
                        return [2 /*return*/, login_res];
                }
            });
        });
    };
    CodemaoAuth.prototype.get_access_token = function (authorization) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.token.get_access(authorization)];
            });
        });
    };
    CodemaoAuth.prototype.request_with_token = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var token_options;
            return __generator(this, function (_a) {
                token_options = {
                    with_token: true,
                    without_base_url: true,
                };
                return [2 /*return*/, this.dispatch_request(Object.assign(options, token_options))];
            });
        });
    };
    /**
     * 设置用户名
     *
     * @param username
     */
    CodemaoAuth.prototype.set_username = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                check_username(username);
                return [2 /*return*/, this.dispatch_request({
                        url: Api.SET_USERNAME,
                        method: 'patch',
                        data: {
                            username: username,
                        },
                        with_token: true,
                    })];
            });
        });
    };
    /**
     * 设置初始密码
     *
     * @param pwd
     * @param pwd_confirm
     */
    CodemaoAuth.prototype.init_password = function (pwd, pwd_confirm) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                check_password(pwd);
                check_password(pwd_confirm);
                check_if_pwd_equals_confirmed_pwd(pwd, pwd_confirm);
                return [2 /*return*/, this.dispatch_request({
                        url: Api.INIT_PASSWORD,
                        method: 'patch',
                        data: {
                            password: pwd,
                            confirm_password: pwd_confirm,
                        },
                        with_token: true,
                    })];
            });
        });
    };
    /**
     * 更新密码（通过提供旧密码）
     *
     * @param old_pwd
     * @param new_pwd
     * @param new_pwd_confirm
     */
    CodemaoAuth.prototype.change_pwd_by_old = function (old_pwd, new_pwd, new_pwd_confirm) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // U.check_password(old_pwd);
                        check_password(new_pwd);
                        check_password(new_pwd_confirm);
                        check_if_pwd_equals_confirmed_pwd(new_pwd, new_pwd_confirm);
                        return [4 /*yield*/, this.dispatch_request({
                                url: Api.CHANGE_PWD_BY_OLD,
                                method: 'patch',
                                data: {
                                    old_password: old_pwd,
                                    password: new_pwd,
                                    confirm_password: new_pwd_confirm,
                                },
                                with_token: true,
                            })];
                    case 1:
                        res = _a.sent();
                        if (res) {
                            this.token.clear();
                        }
                        return [2 /*return*/, res];
                }
            });
        });
    };
    /**
     * 发送更新密码的验证码
     *
     * @param phone_number
     * @param pid
     */
    CodemaoAuth.prototype.change_pwd_by_phone_captcha = function (phone_number, pid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                check_phone_number(phone_number);
                return [2 /*return*/, this.dispatch_request({
                        url: Api.CHNAGE_PWD_BY_PHONE_CAPTCHA,
                        method: 'post',
                        data: {
                            phone_number: phone_number,
                            pid: pid,
                        },
                        with_token: true,
                    })];
            });
        });
    };
    /**
     * 更新密码（通过手机）
     *
     * @param phone_number
     * @param captcha
     * @param pwd
     */
    CodemaoAuth.prototype.change_pwd_by_phone = function (phone_number, captcha, pwd) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        check_phone_number(phone_number);
                        check_captcha(captcha);
                        check_password(pwd);
                        return [4 /*yield*/, this.dispatch_request({
                                url: Api.CHANGE_PWD_BY_PHONE,
                                method: 'patch',
                                data: {
                                    phone_number: phone_number,
                                    captcha: captcha,
                                    password: pwd,
                                },
                                with_token: true,
                            })];
                    case 1:
                        res = _a.sent();
                        if (res) {
                            this.token.clear();
                        }
                        return [2 /*return*/, res];
                }
            });
        });
    };
    /**
     * 更新用户信息
     *
     * @param profile
     */
    CodemaoAuth.prototype.set_profile = function (profile) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (profile) {
                    check_input_params(profile, [
                        'nickname',
                        'avatar_url',
                        'fullname',
                        'birthday',
                        'sex',
                        'qq',
                        'description',
                    ]);
                    check_profile(profile);
                }
                return [2 /*return*/, this.dispatch_request({
                        url: Api.SET_PROFILE,
                        method: 'patch',
                        data: __assign({}, profile),
                        with_token: true,
                    })];
            });
        });
    };
    /**
     * 第三方服务绑定状态
     *
     */
    CodemaoAuth.prototype.check_bind_for_third_party = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dispatch_request({
                        url: Api.CHECK_BIND_FOR_THIRD_PARTY,
                        method: 'get',
                        with_token: true,
                    })];
            });
        });
    };
    /**
     * 绑定微信
     *
     * @param code 第三方授权后会在回调地址携带code的参数
     * @param appid 可选,不传默认开放平台网页应用登录, 也可传编程猫下各公众号appid，需联系后端账号负责人配置
     */
    CodemaoAuth.prototype.bind_wechat = function (code, appid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dispatch_request({
                        url: Api.BIND_WECHAT,
                        method: 'post',
                        data: {
                            code: code,
                            appid: appid,
                        },
                        with_token: true,
                    })];
            });
        });
    };
    /**
     * 解绑微信
     *
     */
    CodemaoAuth.prototype.unbind_wechat = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dispatch_request({
                        url: Api.UNBIND_WECHAT,
                        method: 'patch',
                        with_token: true,
                    })];
            });
        });
    };
    /**
     * 绑定QQ
     *
     */
    CodemaoAuth.prototype.bind_qq = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dispatch_request({
                        url: Api.BIND_QQ,
                        method: 'post',
                        data: {
                            code: code,
                        },
                        with_token: true,
                    })];
            });
        });
    };
    /**
     * 解绑QQ
     *
     */
    CodemaoAuth.prototype.unbind_qq = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dispatch_request({
                        url: Api.UNBIND_QQ,
                        method: 'patch',
                        with_token: true,
                    })];
            });
        });
    };
    /**
     * 获取基本用户信息
     *
     */
    CodemaoAuth.prototype.get_profile = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dispatch_request({
                        url: Api.GET_PROFILE,
                        method: 'get',
                        with_token: true,
                    })];
            });
        });
    };
    /**
     * 获取主账号信息（私密信息）
     */
    CodemaoAuth.prototype.get_auth = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dispatch_request({
                        url: Api.GET_AUTH,
                        method: 'get',
                        with_token: true,
                    })];
            });
        });
    };
    /**
     * 极验账号登录
     *
     * @param {string} identity 用户的标识，支持传用户名，手机号，email
     * @param {string} password 登录密码
     * @param {string} pid 产品对外id
     * @param {string} auth_version Auth版本的标识，用于兼容
     * @param {string} ticket
     */
    CodemaoAuth.prototype.login_account_ticket = function (identity, password, pid, ticket) {
        return __awaiter(this, void 0, void 0, function () {
            var login_res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dispatch_request({
                            url: Api.LOGIN_ACCOUNT_TICKET,
                            method: 'post',
                            data: {
                                identity: identity,
                                password: password,
                                pid: pid,
                            },
                            is_new_token: true,
                            headers: {
                                'X-Captcha-Ticket': ticket,
                            },
                        })];
                    case 1:
                        login_res = _a.sent();
                        if (login_res.status === 200) {
                            this.token.set(login_res.data.auth.token);
                        }
                        return [2 /*return*/, login_res];
                }
            });
        });
    };
    return CodemaoAuth;
}());

var auth = /*#__PURE__*/Object.freeze({
__proto__: null,
get config () { return config; },
init: init,
get_auth_instance: get_auth_instance,
CodemaoAuth: CodemaoAuth
});

var getFingerPrint = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve) {
                var getHash = function () {
                    if (typeof Fingerprint2 !== 'undefined') {
                        Fingerprint2.get(function (components) {
                            var values = components.map(function (component) { return component.value; });
                            resolve(Fingerprint2.x64hash128(values.join(''), 31));
                        });
                    }
                    else {
                        resolve('');
                    }
                };
                if (window.requestIdleCallback) {
                    window.requestIdleCallback(getHash);
                }
                else {
                    setTimeout(getHash, 500);
                }
            })];
    });
}); };

var FINGER_PRINT_2 = 'https://static.codemao.cn/iris/fingerprint2.min.js';
var GEETEST_GT = 'https://static.codemao.cn/arch/gt.js';
var TENCENT_GT = 'https://ssl.captcha.qq.com/TCaptcha.js';
// TODO 错误处理
var CodemaoCaptcha = /** @class */ (function () {
    function CodemaoCaptcha(options) {
        this.pid = options.pid;
    }
    // 从服务端确定用哪个验证码服务商
    CodemaoCaptcha.prototype.get_rule_from_server = function (identity) {
        return __awaiter(this, void 0, void 0, function () {
            var deviceId, timestamp, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, load_script(FINGER_PRINT_2, 'finger-print', 10)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, getFingerPrint()];
                    case 2:
                        deviceId = _a.sent();
                        timestamp = "" + new Date().getTime() / 1000;
                        return [4 /*yield*/, PlatformApi.dispatch_request({
                                url: PLATFORM_CAPTCHA_API.GET_RULE,
                                method: 'post',
                                data: {
                                    identity: identity,
                                    pid: initParams.pid || this.pid,
                                    deviceId: deviceId,
                                    timestamp: parseInt(timestamp, 10),
                                },
                            })];
                    case 3:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    CodemaoCaptcha.prototype.get_captcha = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var res, rule, appid, ticket, dom_id, success_callback, fail_callback, close_callback, geetest_init_options, disableCaptcha;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get_rule_from_server(options.identity)];
                    case 1:
                        res = _a.sent();
                        if (res) {
                            rule = res.rule, appid = res.appid, ticket = res.ticket;
                            dom_id = options.dom_id, success_callback = options.success_callback, fail_callback = options.fail_callback, close_callback = options.close_callback, geetest_init_options = options.geetest_init_options;
                            switch (rule) {
                                case 'GEETEST':
                                    // Get ticket with Geetest.
                                    // geetest 滑动
                                    if (appid) {
                                        return [2 /*return*/, new GeetestCaptcha({
                                                product_id: appid,
                                                dom_id: dom_id,
                                                success_callback: success_callback,
                                                fail_callback: fail_callback,
                                                close_callback: close_callback,
                                                init_options: geetest_init_options,
                                            })];
                                    }
                                    break;
                                case 'TENCENT':
                                    // Get ticket with tencent.
                                    if (appid) {
                                        return [2 /*return*/, new CmTencentCaptcha({
                                                product_id: appid,
                                                dom_id: dom_id,
                                                success_callback: success_callback,
                                                fail_callback: fail_callback,
                                                close_callback: close_callback,
                                            })];
                                    }
                                    break;
                                case 'DEFAULT':
                                    disableCaptcha = new DisableCaptcha(ticket, success_callback, fail_callback);
                                    return [2 /*return*/, disableCaptcha];
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return CodemaoCaptcha;
}());
var GeetestCaptcha = /** @class */ (function () {
    function GeetestCaptcha(options) {
        this.default_init_options = {
            product: 'bind',
            width: '300px',
        };
        this.product_id = options.product_id;
        this.dom_id = options.dom_id;
        this.success_callback = options.success_callback;
        this.init_options = options.init_options;
        this.fail_callback = options.fail_callback;
        this.close_callback = options.close_callback;
    }
    GeetestCaptcha.prototype.get_init_params = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, PlatformApi.dispatch_request({
                        url: PLATFORM_CAPTCHA_API.GET_GEETEST_PARAMS,
                        method: 'post',
                        data: {
                            appid: this.product_id,
                        },
                    })];
            });
        });
    };
    GeetestCaptcha.prototype.init_geetest = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, retry(3, function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, this.get_init_params()];
                        }); }); })];
                    case 1:
                        params = _a.sent();
                        data = params.data;
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                initGeetest(__assign({ gt: data.gt, challenge: data.challenge, offline: !data.success, new_captcha: data.new_captcha }, options), function (captcha_obj) {
                                    captcha_obj
                                        .onReady(function () {
                                        resolve(captcha_obj);
                                    })
                                        .onSuccess(function () { return __awaiter(_this, void 0, void 0, function () {
                                        var ticket_res, error_1;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 2, , 3]);
                                                    return [4 /*yield*/, this.get_ticket()];
                                                case 1:
                                                    ticket_res = _a.sent();
                                                    this.success_callback(ticket_res.data.ticket, this.product_id);
                                                    return [3 /*break*/, 3];
                                                case 2:
                                                    error_1 = _a.sent();
                                                    this.fail_callback && this.fail_callback(error_1);
                                                    return [3 /*break*/, 3];
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    }); })
                                        .onError(function () {
                                        if (_this.fail_callback) {
                                            _this.fail_callback();
                                        }
                                        throw new Error('Got error in Geetest captcha.');
                                    }).onClose(function () {
                                        if (!_this.captcha_obj.getValidate() && _this.close_callback) {
                                            _this.close_callback();
                                        }
                                    });
                                });
                            })];
                }
            });
        });
    };
    GeetestCaptcha.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var init_options, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        init_options = this.init_options || this.default_init_options;
                        return [4 /*yield*/, load_script(GEETEST_GT, 'geetest-captcha')];
                    case 1:
                        _b.sent();
                        _a = this;
                        return [4 /*yield*/, this.init_geetest(init_options)];
                    case 2:
                        _a.captcha_obj = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GeetestCaptcha.prototype.show = function () {
        // Show the captcha.
        if (this.init_options && this.init_options.product !== 'bind') {
            this.captcha_obj.appendTo("#" + this.dom_id);
            // When product is 'bind', it need to use verify() to show the captcha.
            return;
        }
        else {
            this.captcha_obj.verify();
        }
    };
    GeetestCaptcha.prototype.get_ticket = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                result = this.captcha_obj.getValidate();
                return [2 /*return*/, PlatformApi.dispatch_request({
                        url: PLATFORM_CAPTCHA_API.CHECK_AND_GET_GEETEST_TICKET,
                        method: 'post',
                        data: {
                            geetest_challenge: result.geetest_challenge,
                            geetest_validate: result.geetest_validate,
                            geetest_seccode: result.geetest_seccode,
                            appid: this.product_id,
                        },
                    })];
            });
        });
    };
    return GeetestCaptcha;
}());
var CmTencentCaptcha = /** @class */ (function () {
    function CmTencentCaptcha(options) {
        this.product_id = options.product_id;
        this.dom_id = options.dom_id;
        this.success_callback = options.success_callback;
        this.fail_callback = options.fail_callback;
        this.close_callback = options.close_callback;
        this.request = new CodemaoRequest();
    }
    CmTencentCaptcha.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof TencentCaptcha === 'undefined')) return [3 /*break*/, 2];
                        return [4 /*yield*/, load_script(TENCENT_GT, 'TENCENT_GT')];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.initTencentCaptcha(this.dom_id)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CmTencentCaptcha.prototype.initTencentCaptcha = function (dom_id) {
        return __awaiter(this, void 0, void 0, function () {
            var tencentCaptchaCallback;
            var _this = this;
            return __generator(this, function (_a) {
                tencentCaptchaCallback = function (res) { return __awaiter(_this, void 0, void 0, function () {
                    var ticket_res, error_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (res == null) {
                                    return [2 /*return*/];
                                }
                                if (!(res.ret === 0)) return [3 /*break*/, 5];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, this.get_ticket(res.ticket, res.randstr)];
                            case 2:
                                ticket_res = _a.sent();
                                this.success_callback(ticket_res.data.ticket, this.product_id);
                                return [3 /*break*/, 4];
                            case 3:
                                error_2 = _a.sent();
                                this.fail_callback && this.fail_callback(error_2);
                                return [3 /*break*/, 4];
                            case 4: return [3 /*break*/, 6];
                            case 5:
                                if (res.ret === 1) {
                                    if (this.fail_callback) {
                                        this.fail_callback();
                                    }
                                }
                                else if (res.ret === 2) {
                                    if (this.close_callback) {
                                        this.close_callback();
                                    }
                                }
                                _a.label = 6;
                            case 6: return [2 /*return*/];
                        }
                    });
                }); };
                if (dom_id) {
                    this.captcha_obj = new TencentCaptcha(document.getElementById(dom_id), this.product_id, tencentCaptchaCallback, {});
                }
                else {
                    this.captcha_obj = new TencentCaptcha(this.product_id, tencentCaptchaCallback, {});
                }
                return [2 /*return*/];
            });
        });
    };
    CmTencentCaptcha.prototype.show = function () {
        this.captcha_obj.show();
    };
    CmTencentCaptcha.prototype.get_ticket = function (ticket, randstr) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, PlatformApi.dispatch_request({
                        url: PLATFORM_CAPTCHA_API.CHECK_AND_GET_TENCENT_TICKET,
                        method: 'post',
                        data: {
                            appid: this.product_id,
                            tencentTicket: ticket,
                            randomStr: randstr,
                        },
                    })];
            });
        });
    };
    return CmTencentCaptcha;
}());
var DisableCaptcha = /** @class */ (function () {
    function DisableCaptcha(ticket, success_callback, fail_callback) {
        this.ticket = ticket;
        this.success_callback = success_callback;
        this.fail_callback = fail_callback;
    }
    DisableCaptcha.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('DisableCaptcha init');
                return [2 /*return*/];
            });
        });
    };
    DisableCaptcha.prototype.show = function () {
        if (this.ticket) {
            this.success_callback(this.ticket, '');
        }
        else {
            if (this.fail_callback) {
                this.fail_callback();
            }
        }
    };
    return DisableCaptcha;
}());

var captcha = /*#__PURE__*/Object.freeze({
__proto__: null,
CodemaoCaptcha: CodemaoCaptcha,
GeetestCaptcha: GeetestCaptcha,
CmTencentCaptcha: CmTencentCaptcha,
DisableCaptcha: DisableCaptcha
});

var config$1;
var initParams = {};
config$1 = configs['prod'];
function init$1(options) {
    var env = options.env, domain = options.domain, _a = options.auth_version, auth_version = _a === void 0 ? '' : _a, _b = options.pid, pid = _b === void 0 ? '' : _b, _c = options.client_id, client_id = _c === void 0 ? '' : _c, requestTimeout = options.requestTimeout;
    if (env) {
        if (configs[env]) {
            config$1 = configs[env];
        }
        else {
            console.warn("Unknown env \"" + env + "\", config has been set to default value.");
        }
    }
    if (domain !== undefined) {
        config$1.domain = domain;
    }
    initParams.auth_version = auth_version;
    initParams.client_id = client_id;
    initParams.pid = pid;
    initParams.requestTimeout = requestTimeout;
}




/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTIuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGNtYW8vaXJpcy9kaXN0L2VzL2lyaXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIGNvbmZpZ3MgPSB7XHJcbiAgICAnZGV2Jzoge1xyXG4gICAgICAgIGVudjogJ2RldicsXHJcbiAgICAgICAgaG9zdDoge1xyXG4gICAgICAgICAgICB0aWdlcjogJ2h0dHBzOi8vYmFja2VuZC1kZXYuY29kZW1hby5jbicsXHJcbiAgICAgICAgICAgIHBsYXRmb3JtOiAnaHR0cHM6Ly9kZXYtb3Blbi1zZXJ2aWNlLmNvZGVtYW8uY24nLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZG9tYWluOiAnLmNvZGVtYW8uY24nLFxyXG4gICAgfSxcclxuICAgICdzdGFnaW5nJzoge1xyXG4gICAgICAgIGVudjogJ3N0YWdpbmcnLFxyXG4gICAgICAgIGhvc3Q6IHtcclxuICAgICAgICAgICAgdGlnZXI6ICdodHRwczovL2JhY2tlbmQtdGVzdC5jb2RlbWFvLmNuJyxcclxuICAgICAgICAgICAgcGxhdGZvcm06ICdodHRwczovL3N0YWdpbmctb3Blbi1zZXJ2aWNlLmNvZGVtYW8uY24nLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZG9tYWluOiAnLmNvZGVtYW8uY24nLFxyXG4gICAgfSxcclxuICAgICdwcm9kJzoge1xyXG4gICAgICAgIGVudjogJ3Byb2QnLFxyXG4gICAgICAgIGhvc3Q6IHtcclxuICAgICAgICAgICAgdGlnZXI6ICdodHRwczovL2FwaS5jb2RlbWFvLmNuJyxcclxuICAgICAgICAgICAgcGxhdGZvcm06ICdodHRwczovL29wZW4tc2VydmljZS5jb2RlbWFvLmNuJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRvbWFpbjogJy5jb2RlbWFvLmNuJyxcclxuICAgIH0sXHJcbiAgICAnYXBpLXRlc3QnOiB7XHJcbiAgICAgICAgZW52OiAnYXBpLXRlc3QnLFxyXG4gICAgICAgIGhvc3Q6IHtcclxuICAgICAgICAgICAgdGlnZXI6ICdodHRwczovL3Rlc3QtYXBpLmNvZGVtYW8uY24nLFxyXG4gICAgICAgICAgICBwbGF0Zm9ybTogJ2h0dHBzOi8vdGVzdC1vcGVuLXNlcnZpY2UuY29kZW1hby5jbicsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkb21haW46ICcuY29kZW1hby5jbicsXHJcbiAgICB9LFxyXG4gICAgJ3Rlc3QnOiB7XHJcbiAgICAgICAgZW52OiAndGVzdCcsXHJcbiAgICAgICAgaG9zdDoge1xyXG4gICAgICAgICAgICB0aWdlcjogJ2h0dHBzOi8vdGVzdC1hcGkuY29kZW1hby5jbicsXHJcbiAgICAgICAgICAgIHBsYXRmb3JtOiAnaHR0cHM6Ly90ZXN0LW9wZW4tc2VydmljZS5jb2RlbWFvLmNuJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRvbWFpbjogJy5jb2RlbWFvLmNuJyxcclxuICAgIH0sXHJcbiAgICAncHJlc3MnOiB7XHJcbiAgICAgICAgZW52OiAncHJlc3MnLFxyXG4gICAgICAgIGhvc3Q6IHtcclxuICAgICAgICAgICAgdGlnZXI6ICdodHRwczovL3ByZXNzLWFwaS5jb2RlbWFvLmNuJyxcclxuICAgICAgICAgICAgcGxhdGZvcm06ICdodHRwczovL3ByZXNzLW9wZW4tc2VydmljZS5jb2RlbWFvLmNuJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRvbWFpbjogJy5jb2RlbWFvLmNuJyxcclxuICAgIH0sXHJcbn07XG5cbi8qKlxyXG4gKiDkuJrliqHpgLvovpHplJnor6/kv6Hmga/pm4blkIjjgIJcclxuICog5Y+v5Lul5Zyo5o6l5Y+j55qEY2F0Y2jpgJrov4dlcnIuZXJyb3JfY29kZeiOt+WPluWIsOOAglxyXG4gKi9cclxudmFyIEVSUk9SX1RZUEU7XHJcbihmdW5jdGlvbiAoRVJST1JfVFlQRSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbnZhbGlkIHBob25lIG51bWJlci5cclxuICAgICAqIOS4jeespuWQiOimgeaxgueahOeUteivneWPt+eggeOAglxyXG4gICAgICovXHJcbiAgICBFUlJPUl9UWVBFW0VSUk9SX1RZUEVbXCJJTlZBTElEX1BIT05FX05VTUJFUlwiXSA9IDBdID0gXCJJTlZBTElEX1BIT05FX05VTUJFUlwiO1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbnZhbGlkIGNhcHRjaGEuXHJcbiAgICAgKiDkuI3nrKblkIjopoHmsYLnmoTnn63kv6Hpqozor4HnoIHjgIJcclxuICAgICAqL1xyXG4gICAgRVJST1JfVFlQRVtFUlJPUl9UWVBFW1wiSU5WQUxJRF9DQVBUQ0hBXCJdID0gMV0gPSBcIklOVkFMSURfQ0FQVENIQVwiO1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbnZhbGlkIHBhc3N3b3JkLlxyXG4gICAgICog5LiN56ym5ZCI6KaB5rGC55qE5a+G56CB44CCXHJcbiAgICAgKi9cclxuICAgIEVSUk9SX1RZUEVbRVJST1JfVFlQRVtcIklOVkFMSURfUEFTU1dPUkRcIl0gPSAyXSA9IFwiSU5WQUxJRF9QQVNTV09SRFwiO1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbnZhbGlkIHVzZXJuYW1lLlxyXG4gICAgICog5LiN56ym5ZCI6KaB5rGC55qE55So5oi35ZCN44CCXHJcbiAgICAgKi9cclxuICAgIEVSUk9SX1RZUEVbRVJST1JfVFlQRVtcIklOVkFMSURfVVNFUk5BTUVcIl0gPSAzXSA9IFwiSU5WQUxJRF9VU0VSTkFNRVwiO1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbnZhbGlkIG5pY2tuYW1lLlxyXG4gICAgICog5LiN56ym5ZCI6KaB5rGC55qE5pi156ew44CCXHJcbiAgICAgKi9cclxuICAgIEVSUk9SX1RZUEVbRVJST1JfVFlQRVtcIklOVkFMSURfTklDS05BTUVcIl0gPSA0XSA9IFwiSU5WQUxJRF9OSUNLTkFNRVwiO1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbnZhbGlkIGZ1bGxuYW1lLlxyXG4gICAgICog5LiN56ym5ZCI6KaB5rGC55qE5YWo5ZCN44CCXHJcbiAgICAgKi9cclxuICAgIEVSUk9SX1RZUEVbRVJST1JfVFlQRVtcIklOVkFMSURfRlVMTE5BTUVcIl0gPSA1XSA9IFwiSU5WQUxJRF9GVUxMTkFNRVwiO1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbnZhbGlkIHFxLlxyXG4gICAgICog5LiN56ym5ZCI6KaB5rGC55qEcXHlj7fnoIHjgIJcclxuICAgICAqL1xyXG4gICAgRVJST1JfVFlQRVtFUlJPUl9UWVBFW1wiSU5WQUxJRF9RUVwiXSA9IDZdID0gXCJJTlZBTElEX1FRXCI7XHJcbiAgICAvKipcclxuICAgICAqIEludmFsaWQgZGVzY3JpcHRpb24uXHJcbiAgICAgKiDkuI3nrKblkIjopoHmsYLnmoTkuKrkurrmj4/ov7DjgIJcclxuICAgICAqL1xyXG4gICAgRVJST1JfVFlQRVtFUlJPUl9UWVBFW1wiSU5WQUxJRF9ERVNDUklQVElPTlwiXSA9IDddID0gXCJJTlZBTElEX0RFU0NSSVBUSU9OXCI7XHJcbiAgICAvKipcclxuICAgICAqIEludmFsaWQgc2V4LlxyXG4gICAgICog5LiN56ym5ZCI6KaB5rGC55qE5oCn5Yir44CCXHJcbiAgICAgKi9cclxuICAgIEVSUk9SX1RZUEVbRVJST1JfVFlQRVtcIklOVkFMSURfU0VYXCJdID0gOF0gPSBcIklOVkFMSURfU0VYXCI7XHJcbiAgICAvKipcclxuICAgICAqIEludmFsaWQgYmlydGhkYXkuXHJcbiAgICAgKiDkuI3nrKblkIjopoHmsYLnmoTnlJ/ml6Xml7bpl7TmiLPjgIJcclxuICAgICAqIOagvOael+Wogeayu+aXtumXtDE5NzDlubQwMeaciDAx5pelMDDml7YwMOWIhjAw56eSKOWMl+S6rOaXtumXtDE5NzDlubQwMeaciDAx5pelMDjml7YwMOWIhjAw56eSKei1t+iHs+eOsOWcqOeahFxyXG4gICAgICog5oC756eS5pWwLCDlpoIyMDE45bm0MeaciDHml6XvvIzljbNiaXJ0aGRheeWAvOS4ujoxNTE0NzM2MDAwXHJcbiAgICAgKi9cclxuICAgIEVSUk9SX1RZUEVbRVJST1JfVFlQRVtcIklOVkFMSURfQklSVEhEQVlcIl0gPSA5XSA9IFwiSU5WQUxJRF9CSVJUSERBWVwiO1xyXG4gICAgLyoqXHJcbiAgICAgKiBQYXNzd29yZCBub3QgZXF1YWxzIGNvbmZpcm0gcGFzc3dvcmQuXHJcbiAgICAgKiDlr4bnoIHkuI7noa7orqTlr4bnoIHkuI3kuIDoh7TjgIJcclxuICAgICAqL1xyXG4gICAgRVJST1JfVFlQRVtFUlJPUl9UWVBFW1wiUFdEX0lTX05PVF9FUVVBTF9UT19DT05GSVJNRURfUFdEXCJdID0gMTBdID0gXCJQV0RfSVNfTk9UX0VRVUFMX1RPX0NPTkZJUk1FRF9QV0RcIjtcclxuICAgIC8qKlxyXG4gICAgICogTm8gYWNjZXNzIHRva2VuIHdoZW4gcmVxdWVzdCBhdXRob3JpemVkIGFwaS5cclxuICAgICAqIFRva2VuIOW3sui/h+acn+aIluiAheayoeaciSB0b2tlblxyXG4gICAgICog6YCa5bi46ZyA6KaB6YeN5paw55m75b2V44CCXHJcbiAgICAgKi9cclxuICAgIEVSUk9SX1RZUEVbRVJST1JfVFlQRVtcIk5PX1RPS0VOXCJdID0gMTFdID0gXCJOT19UT0tFTlwiO1xyXG4gICAgLyoqXHJcbiAgICAgKiBBbiBlcnJvciBjb2RlIG9ubHkgYXBwZWFycyB3aGVuIHRoZSByZXF1ZXN0IHRpbWVvdXQuXHJcbiAgICAgKiDlvZPor7fmsYLotoXml7bkvJrlh7rnjrDnmoTplJnor6/noIHjgIJcclxuICAgICAqL1xyXG4gICAgRVJST1JfVFlQRVtFUlJPUl9UWVBFW1wiUkVRVUVTVF9USU1FT1VUXCJdID0gMTJdID0gXCJSRVFVRVNUX1RJTUVPVVRcIjtcclxuICAgIC8qKlxyXG4gICAgICogQW4gZXJyb3IgY29kZSBvbmx5IGFwcGVhcnMgd2hlbiByZXF1ZXN0Lm9uZXJyb3IgcmFuLlxyXG4gICAgICog5b2TcmVxdWVzdC5vbmVycm9y5pa55rOV6KKr6Kem5Y+R5pe25o2V6I635Yiw55qE6ZSZ6K+v44CCXHJcbiAgICAgKi9cclxuICAgIEVSUk9SX1RZUEVbRVJST1JfVFlQRVtcIlJFUVVFU1RfRVJST1JcIl0gPSAxM10gPSBcIlJFUVVFU1RfRVJST1JcIjtcclxuICAgIC8qKlxyXG4gICAgICog5omL5py65Y+35bey5rOo5YaMXHJcbiAgICAgKi9cclxuICAgIEVSUk9SX1RZUEVbRVJST1JfVFlQRVtcIlBIT05FX1JFR0lTVEVSRURcIl0gPSAxNF0gPSBcIlBIT05FX1JFR0lTVEVSRURcIjtcclxuICAgIC8qKlxyXG4gICAgICog5omL5py65Y+35pqC5pyq5rOo5YaMXHJcbiAgICAgKi9cclxuICAgIEVSUk9SX1RZUEVbRVJST1JfVFlQRVtcIlBIT05FX1VOUkVHSVNURVJFRFwiXSA9IDE1XSA9IFwiUEhPTkVfVU5SRUdJU1RFUkVEXCI7XHJcbiAgICAvKipcclxuICAgICAqIOeUqOaIt+S4jeWtmOWcqOaIluiAheWvhueggemUmeivr1xyXG4gICAgICovXHJcbiAgICBFUlJPUl9UWVBFW0VSUk9SX1RZUEVbXCJVU0VSX05PVF9FWElTVF9PUl9QV0RfV1JPTkdcIl0gPSAxNl0gPSBcIlVTRVJfTk9UX0VYSVNUX09SX1BXRF9XUk9OR1wiO1xyXG4gICAgLyoqXHJcbiAgICAgKiDnlKjmiLfkuI3lrZjlnKhcclxuICAgICAqL1xyXG4gICAgRVJST1JfVFlQRVtFUlJPUl9UWVBFW1wiVVNFUl9OT1RfRVhJU1RcIl0gPSAxN10gPSBcIlVTRVJfTk9UX0VYSVNUXCI7XHJcbiAgICAvKipcclxuICAgICAqIOS4jeiDveiuvue9ruacquadpeeahOaXpeacn1xyXG4gICAgICovXHJcbiAgICBFUlJPUl9UWVBFW0VSUk9SX1RZUEVbXCJDQU5OT1RfU0VUX0ZVVFVSRV9EQVRFXCJdID0gMThdID0gXCJDQU5OT1RfU0VUX0ZVVFVSRV9EQVRFXCI7XHJcbiAgICAvKipcclxuICAgICAqIOS4jeiDvemHjeWkjeiuvue9rueUqOaIt+WQjVxyXG4gICAgICovXHJcbiAgICBFUlJPUl9UWVBFW0VSUk9SX1RZUEVbXCJDQU5OT1RfU0VUX1VTRVJOQU1FX1JFUEVBVEVETFlcIl0gPSAxOV0gPSBcIkNBTk5PVF9TRVRfVVNFUk5BTUVfUkVQRUFURURMWVwiO1xyXG4gICAgLyoqXHJcbiAgICAgKiDor6XnlKjmiLflkI3lt7Lnu4/lrZjlnKhcclxuICAgICAqL1xyXG4gICAgRVJST1JfVFlQRVtFUlJPUl9UWVBFW1wiVVNFUk5BTUVfRVhJU1RcIl0gPSAyMF0gPSBcIlVTRVJOQU1FX0VYSVNUXCI7XHJcbiAgICAvKipcclxuICAgICAqIOeUqOaIt+mcgOimgee7keWumuaJi+aculxyXG4gICAgICovXHJcbiAgICBFUlJPUl9UWVBFW0VSUk9SX1RZUEVbXCJORUVEX1RPX0JJTkRfUEhPTkVcIl0gPSAyMV0gPSBcIk5FRURfVE9fQklORF9QSE9ORVwiO1xyXG4gICAgLyoqXHJcbiAgICAgKiDpnIDopoHnlKjlvZPliY3nu5HlrprmiYvmnLrlj5Hpqozor4HnoIFcclxuICAgICAqL1xyXG4gICAgRVJST1JfVFlQRVtFUlJPUl9UWVBFW1wiVVNFX0JPVU5EX1BIT05FX1RPX1JFQ0VJVkVfQ0FQVENIQVwiXSA9IDIyXSA9IFwiVVNFX0JPVU5EX1BIT05FX1RPX1JFQ0VJVkVfQ0FQVENIQVwiO1xyXG4gICAgLyoqXHJcbiAgICAgKiDplJnor6/nmoTml6flr4bnoIFcclxuICAgICAqL1xyXG4gICAgRVJST1JfVFlQRVtFUlJPUl9UWVBFW1wiV1JPTkdfT0xEX1BXRFwiXSA9IDIzXSA9IFwiV1JPTkdfT0xEX1BXRFwiO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlr4bnoIHkuI3kuIDoh7RcclxuICAgICAqL1xyXG4gICAgRVJST1JfVFlQRVtFUlJPUl9UWVBFW1wiUFdEU19ET19OT1RfTUFUQ0hcIl0gPSAyNF0gPSBcIlBXRFNfRE9fTk9UX01BVENIXCI7XHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WvhueggeWPquiDveiuvue9ruS4gOasoVxyXG4gICAgICovXHJcbiAgICBFUlJPUl9UWVBFW0VSUk9SX1RZUEVbXCJJTklUX1BXRF9DQU5fU0VUX09OTFlfT05DRVwiXSA9IDI1XSA9IFwiSU5JVF9QV0RfQ0FOX1NFVF9PTkxZX09OQ0VcIjtcclxuICAgIC8qKlxyXG4gICAgICog6ZyA5a2Y5Zyo5Li76LSm5Y+3KOiHs+WwkeWMheWQq+mCrueuseOAgeeUqOaIt+WQjeOAgeaJi+acuuWFtuS4gClcclxuICAgICAqL1xyXG4gICAgRVJST1JfVFlQRVtFUlJPUl9UWVBFW1wiTkVFRF9QUklNQVJZX0FDQ09VTlRcIl0gPSAyNl0gPSBcIk5FRURfUFJJTUFSWV9BQ0NPVU5UXCI7XHJcbiAgICAvKipcclxuICAgICAqIOagoemqjOeggemqjOivgeWksei0pVxyXG4gICAgICovXHJcbiAgICBFUlJPUl9UWVBFW0VSUk9SX1RZUEVbXCJWRVJJRllfQ0FQVENIQV9GQUlMXCJdID0gMjddID0gXCJWRVJJRllfQ0FQVENIQV9GQUlMXCI7XHJcbiAgICAvKipcclxuICAgICAqIOeUqOaIt+W3sue7j+e7keWumui/h+aJi+aculxyXG4gICAgICovXHJcbiAgICBFUlJPUl9UWVBFW0VSUk9SX1RZUEVbXCJVU0VSX1BIT05FX0JPVU5EXCJdID0gMjhdID0gXCJVU0VSX1BIT05FX0JPVU5EXCI7XHJcbiAgICAvKipcclxuICAgICAqIOWOn+aJi+acuuWPt+S4jeato+ehrlxyXG4gICAgICovXHJcbiAgICBFUlJPUl9UWVBFW0VSUk9SX1RZUEVbXCJPTERfUEhPTkVfV1JPTkdcIl0gPSAyOV0gPSBcIk9MRF9QSE9ORV9XUk9OR1wiO1xyXG4gICAgLyoqXHJcbiAgICAgKiDpnZ7ms5Xmk43kvZxcclxuICAgICAqL1xyXG4gICAgRVJST1JfVFlQRVtFUlJPUl9UWVBFW1wiSUxMRUdBTF9PUEVSQVRJT05cIl0gPSAzMF0gPSBcIklMTEVHQUxfT1BFUkFUSU9OXCI7XHJcbiAgICAvKipcclxuICAgICAqIOS4jeiDvee7keWumuWOn+aJi+acuuWPt1xyXG4gICAgICovXHJcbiAgICBFUlJPUl9UWVBFW0VSUk9SX1RZUEVbXCJDQU5OT1RfQklORF9PTERfUEhPTkVcIl0gPSAzMV0gPSBcIkNBTk5PVF9CSU5EX09MRF9QSE9ORVwiO1xyXG4gICAgLyoqXHJcbiAgICAgKiDkuI3lkIjms5XnmoRvYXV0aF90aWNrZXRcclxuICAgICAqL1xyXG4gICAgRVJST1JfVFlQRVtFUlJPUl9UWVBFW1wiSUxMRUdBTF9PQVVUSF9USUNLRVRcIl0gPSAzMl0gPSBcIklMTEVHQUxfT0FVVEhfVElDS0VUXCI7XHJcbiAgICAvKipcclxuICAgICAqIOS4jeWQiOazleeahOaOiOadg+exu+WIq1xyXG4gICAgICovXHJcbiAgICBFUlJPUl9UWVBFW0VSUk9SX1RZUEVbXCJJTExFR0FMX0FVVEhPUklaQVRJT05fQ0FURUdPUllcIl0gPSAzM10gPSBcIklMTEVHQUxfQVVUSE9SSVpBVElPTl9DQVRFR09SWVwiO1xyXG4gICAgLyoqXHJcbiAgICAgKiDnrKzkuInmlrnmjojmnYPotKblj7flt7Looqvnu5HlrppcclxuICAgICAqL1xyXG4gICAgRVJST1JfVFlQRVtFUlJPUl9UWVBFW1wiVEhJUkRfUEFSVFlfQUNDT1VOVF9CT1VORFwiXSA9IDM0XSA9IFwiVEhJUkRfUEFSVFlfQUNDT1VOVF9CT1VORFwiO1xyXG4gICAgLyoqXHJcbiAgICAgKiDotKblj7flt7Lnu4/nu5HlrprlkIznsbvlnovmjojmnYPotKblj7dcclxuICAgICAqL1xyXG4gICAgRVJST1JfVFlQRVtFUlJPUl9UWVBFW1wiQVVUSE9SSVpBVElPTl9BQ0NPVU5UX0JPVU5EXCJdID0gMzVdID0gXCJBVVRIT1JJWkFUSU9OX0FDQ09VTlRfQk9VTkRcIjtcclxuICAgIC8qKlxyXG4gICAgICog6K+35YWI57uR5a6a5omL5py65oiW6ICF6K6+572u55So5oi35ZCN5Y+K5a+G56CBXHJcbiAgICAgKi9cclxuICAgIEVSUk9SX1RZUEVbRVJST1JfVFlQRVtcIkJJTkRfUEhPTkVfT1JfU0VUX1VTRVJOQU1FX0FORF9QV0RcIl0gPSAzNl0gPSBcIkJJTkRfUEhPTkVfT1JfU0VUX1VTRVJOQU1FX0FORF9QV0RcIjtcclxuICAgIC8qKlxyXG4gICAgICog5Y+R6YCB6aqM6K+B56CB6L+H5LqO6aKR57mBXHJcbiAgICAgKi9cclxuICAgIEVSUk9SX1RZUEVbRVJST1JfVFlQRVtcIlNFTkRfQ0FQVENIQV9UT09fRlJVUVVFTlRMWVwiXSA9IDM3XSA9IFwiU0VORF9DQVBUQ0hBX1RPT19GUlVRVUVOVExZXCI7XHJcbiAgICAvKipcclxuICAgICAqIOS4jeWQiOazleeahHBpZFxyXG4gICAgICovXHJcbiAgICBFUlJPUl9UWVBFW0VSUk9SX1RZUEVbXCJJTExFR0FMX1BJRFwiXSA9IDM4XSA9IFwiSUxMRUdBTF9QSURcIjtcclxuICAgIC8qKlxyXG4gICAgICog5bey57uP5a2Y5Zyo55u45ZCM55qE5pi156ewXHJcbiAgICAgKi9cclxuICAgIEVSUk9SX1RZUEVbRVJST1JfVFlQRVtcIk5JQ0tOQU1FX0VYSVNUXCJdID0gMzldID0gXCJOSUNLTkFNRV9FWElTVFwiO1xyXG4gICAgLyoqXHJcbiAgICAgKiDor6XmiYvmnLrlj7flt7Looqvlhbbku5bluJDlj7fnu5HlrppcclxuICAgICAqL1xyXG4gICAgRVJST1JfVFlQRVtFUlJPUl9UWVBFW1wiUEhPTkVfQk9VTkRfQllfT1RIRVJfQUNDT1VOVFwiXSA9IDQwXSA9IFwiUEhPTkVfQk9VTkRfQllfT1RIRVJfQUNDT1VOVFwiO1xyXG4gICAgLyoqXHJcbiAgICAgKiBRUeeZu+W9lemUmeivr1xyXG4gICAgICovXHJcbiAgICBFUlJPUl9UWVBFW0VSUk9SX1RZUEVbXCJRUV9FUlJPUl9SRUNFSVZFRFwiXSA9IDQxXSA9IFwiUVFfRVJST1JfUkVDRUlWRURcIjtcclxuICAgIC8qKlxyXG4gICAgICog5b6u5L+h55m75b2V6ZSZ6K+vXHJcbiAgICAgKi9cclxuICAgIEVSUk9SX1RZUEVbRVJST1JfVFlQRVtcIldFQ0hBUl9FUlJPUl9SRUNFSVZFRFwiXSA9IDQyXSA9IFwiV0VDSEFSX0VSUk9SX1JFQ0VJVkVEXCI7XHJcbiAgICAvKipcclxuICAgICAqIGFjY2VzcyB0b2tlbiDkuI3lkIjms5VcclxuICAgICAqL1xyXG4gICAgRVJST1JfVFlQRVtFUlJPUl9UWVBFW1wiVE9LRU5fSU5WQUxJRFwiXSA9IDQzXSA9IFwiVE9LRU5fSU5WQUxJRFwiO1xyXG4gICAgLyoqXHJcbiAgICAgKiByZWZyZXNoIHRva2VuIOS4jeWQiOazlVxyXG4gICAgICovXHJcbiAgICBFUlJPUl9UWVBFW0VSUk9SX1RZUEVbXCJSRUZSRVNIX1RPS0VOX0lOVkFMSURcIl0gPSA0NF0gPSBcIlJFRlJFU0hfVE9LRU5fSU5WQUxJRFwiO1xyXG4gICAgLyoqXHJcbiAgICAgKiDplJnor6/nmoQgdGlja2V0XHJcbiAgICAgKi9cclxuICAgIEVSUk9SX1RZUEVbRVJST1JfVFlQRVtcIldST05HX1RJQ0tFVFwiXSA9IDQ1XSA9IFwiV1JPTkdfVElDS0VUXCI7XHJcbiAgICAvKipcclxuICAgICAqIOWIqeeUqOaXp+eZu+W9leaAgeeahCBjb29raWUg5Y676I635Y+W5paw55m75b2V5oCB55qEIHRva2Vu55qE5o6l5Y+jXHJcbiAgICAgKiDlj6/og73kvJrlh7rnjrDnmoTplJnor6/jgIJcclxuICAgICAqL1xyXG4gICAgRVJST1JfVFlQRVtFUlJPUl9UWVBFW1wiQ09PS0lFX0lOVkFMSURcIl0gPSA0Nl0gPSBcIkNPT0tJRV9JTlZBTElEXCI7XHJcbiAgICBFUlJPUl9UWVBFW0VSUk9SX1RZUEVbXCJBcHBpZF9Ob3RGb3VuZFwiXSA9IDQ3XSA9IFwiQXBwaWRfTm90Rm91bmRcIjtcclxuICAgIEVSUk9SX1RZUEVbRVJST1JfVFlQRVtcIkRlZmF1bHRfQ2FwdGNoYVJ1bGVfTm90Rm91bmRcIl0gPSA0OF0gPSBcIkRlZmF1bHRfQ2FwdGNoYVJ1bGVfTm90Rm91bmRcIjtcclxuICAgIEVSUk9SX1RZUEVbRVJST1JfVFlQRVtcIlRlbmNlbnRDYXB0Y2hhX0V4Y2VwdGlvblwiXSA9IDQ5XSA9IFwiVGVuY2VudENhcHRjaGFfRXhjZXB0aW9uXCI7XHJcbiAgICBFUlJPUl9UWVBFW0VSUk9SX1RZUEVbXCJHZWV0ZXN0Q2FwdGNoYV9FeGNlcHRpb25cIl0gPSA1MF0gPSBcIkdlZXRlc3RDYXB0Y2hhX0V4Y2VwdGlvblwiO1xyXG59KShFUlJPUl9UWVBFIHx8IChFUlJPUl9UWVBFID0ge30pKTtcblxudmFyIHZlcnNpb24gPSBcIjAuNy42XCI7XG5cbi8vIEFsbCBBY2NvdW50IDMuMCBhcGlzIGZvciB3ZWIuXHJcbnZhciBBcGkgPSB7XHJcbiAgICBSRUdJU1RFUl9TRU5EX0NBUFRDSEE6ICcvdGlnZXIvdjMvd2ViL2FjY291bnRzL2NhcHRjaGEvcmVnaXN0ZXIvcGhvbmUnLFxyXG4gICAgUkVHSVNURVI6ICcvdGlnZXIvdjMvd2ViL2FjY291bnRzL3JlZ2lzdGVyL3Bob25lJyxcclxuICAgIExPR0lOX0NBUFRDSEE6ICcvdGlnZXIvdjMvd2ViL2FjY291bnRzL2NhcHRjaGEvbG9naW4nLFxyXG4gICAgTE9HSU5fUEhPTkU6ICcvdGlnZXIvdjMvd2ViL2FjY291bnRzL3Bob25lL2xvZ2luJyxcclxuICAgIExPR0lOX0FDQ09VTlQ6ICcvdGlnZXIvdjMvd2ViL2FjY291bnRzL2xvZ2luJyxcclxuICAgIExPR0lOX1dFQ0hBVDogJy90aWdlci92My93ZWIvYWNjb3VudHMvb2F1dGgvd2VjaGF0JyxcclxuICAgIExPR0lOX1FROiAnL3RpZ2VyL3YzL3dlYi9hY2NvdW50cy9vYXV0aC9xcScsXHJcbiAgICBCSU5EX1BIT05FX0ZPUl9USElSRF9QQVJUWTogJy90aWdlci92My93ZWIvYWNjb3VudHMvY2FwdGNoYS9vYXV0aCcsXHJcbiAgICBDUkVBVEVfVVNFUl9GT1JfVEhJUkRfUEFSVFk6ICcvdGlnZXIvdjMvd2ViL2FjY291bnRzL29hdXRoL3RoaXJkLXBhcnR5JyxcclxuICAgIFNFVF9VU0VSTkFNRTogJy90aWdlci92My93ZWIvYWNjb3VudHMvdXNlcm5hbWUnLFxyXG4gICAgQklORF9QSE9ORV9DQVBUQ0hBOiAnL3RpZ2VyL3YzL3dlYi9hY2NvdW50cy9jYXB0Y2hhL3Bob25lL2JpbmQnLFxyXG4gICAgQklORF9QSE9ORTogJy90aWdlci92My93ZWIvYWNjb3VudHMvcGhvbmUvYmluZCcsXHJcbiAgICBCSU5EX1BIT05FX0NIRUNLOiAnL3RpZ2VyL3YzL3dlYi9hY2NvdW50cy9waG9uZS9jaGVjaycsXHJcbiAgICBSRUJJTkRfUEhPTkVfQ0FQVENIQTogJy90aWdlci92My93ZWIvYWNjb3VudHMvY2FwdGNoYS9waG9uZS9jaGFuZ2UnLFxyXG4gICAgUkVCSU5EX1BIT05FOiAnL3RpZ2VyL3YzL3dlYi9hY2NvdW50cy9waG9uZS9jaGFuZ2UnLFxyXG4gICAgQ0hBTkdFX1BXRF9CWV9PTEQ6ICcvdGlnZXIvdjMvd2ViL2FjY291bnRzL3Bhc3N3b3JkJyxcclxuICAgIENITkFHRV9QV0RfQllfUEhPTkVfQ0FQVENIQTogJy90aWdlci92My93ZWIvYWNjb3VudHMvY2FwdGNoYS9wYXNzd29yZC91cGRhdGUnLFxyXG4gICAgQ0hBTkdFX1BXRF9CWV9QSE9ORTogJy90aWdlci92My93ZWIvYWNjb3VudHMvcGFzc3dvcmQvcGhvbmUnLFxyXG4gICAgSU5JVF9QQVNTV09SRDogJy90aWdlci92My93ZWIvYWNjb3VudHMvcGFzc3dvcmQvc2V0dGluZycsXHJcbiAgICBSRVNFVF9QV0RfQ0FQVENIQTogJy90aWdlci92My93ZWIvYWNjb3VudHMvY2FwdGNoYS9wYXNzd29yZC9yZXNldCcsXHJcbiAgICBSRVNFVF9QV0RfVE9LRU46ICcvdGlnZXIvdjMvd2ViL2FjY291bnRzL2NhcHRjaGEvcGFzc3dvcmQvY2hlY2snLFxyXG4gICAgUkVTRVRfUFdEOiAnL3RpZ2VyL3YzL3dlYi9hY2NvdW50cy9wYXNzd29yZC9yZXNldCcsXHJcbiAgICBTRVRfUFJPRklMRTogJy90aWdlci92My93ZWIvYWNjb3VudHMvaW5mbycsXHJcbiAgICBDSEVDS19CSU5EX0ZPUl9USElSRF9QQVJUWTogJy90aWdlci92My93ZWIvYWNjb3VudHMvb2F1dGhzJyxcclxuICAgIEJJTkRfV0VDSEFUOiAnL3RpZ2VyL3YzL3dlYi9hY2NvdW50cy9vYXV0aC93ZWNoYXQvYmluZCcsXHJcbiAgICBVTkJJTkRfV0VDSEFUOiAnL3RpZ2VyL3YzL3dlYi9hY2NvdW50cy9vYXV0aC93ZWNoYXQvdW5iaW5kJyxcclxuICAgIEJJTkRfUVE6ICcvdGlnZXIvdjMvd2ViL2FjY291bnRzL29hdXRoL3FxL2JpbmQnLFxyXG4gICAgVU5CSU5EX1FROiAnL3RpZ2VyL3YzL3dlYi9hY2NvdW50cy9vYXV0aC9xcS91bmJpbmQnLFxyXG4gICAgR0VUX1BST0ZJTEU6ICcvdGlnZXIvdjMvd2ViL2FjY291bnRzL3Byb2ZpbGUnLFxyXG4gICAgR0VUX0FVVEg6ICcvdGlnZXIvdjMvd2ViL2FjY291bnRzL3ByaXZhY3knLFxyXG4gICAgTE9HT1VUOiAnL3RpZ2VyL3YzL3dlYi9hY2NvdW50cy9sb2dvdXQnLFxyXG4gICAgU0VORF9VTklWRVJTQUxfQ0FQVENIQTogJy90aWdlci92My93ZWIvYWNjb3VudHMvY2FwdGNoYS9jb21tb24nLFxyXG4gICAgVkVSSUZZX1VOSVZFUlNBTF9DQVBUQ0hBOiAnL3RpZ2VyL3YzL3dlYi9hY2NvdW50cy9jYXB0Y2hhL2NvbW1vbi9jaGVjaycsXHJcbiAgICBMT0dJTl9DQVBUQ0hBX1NJTEVOQ0U6ICcvdGlnZXIvdjMvd2ViL2FjY291bnRzL2NhcHRjaGEvbG9naW4vc2lsZW5jZScsXHJcbiAgICBMT0dJTl9QSE9ORV9TSUxFTkNFOiAnL3RpZ2VyL3YzL3dlYi9hY2NvdW50cy9waG9uZS9sb2dpbi9zaWxlbmNlJyxcclxuICAgIExPR0lOX0FDQ09VTlRfVElDS0VUOiAnL3RpZ2VyL3YzL3dlYi9hY2NvdW50cy9sb2dpbi9zZWN1cml0eScsXHJcbn07XHJcbnZhciBUSUdFUl9DQVBUQ0hBX0FQSSA9IHtcclxuICAgIEdFVF9SVUxFOiAnL3RpZ2VyL2NhcHRjaGEvZ3JhcGgvcnVsZScsXHJcbiAgICBHRVRfR0VFVEVTVF9QQVJBTVM6ICcvdGlnZXIvY2FwdGNoYS9ncmFwaC9nZWV0ZXN0L3JlZ2lzdGVyX3NsaWRlJyxcclxuICAgIENIRUNLX0FORF9HRVRfR0VFVEVTVF9USUNLRVQ6ICcvdGlnZXIvY2FwdGNoYS9ncmFwaC90aWNrZXRzL2dlZXRlc3QnLFxyXG4gICAgQ0hFQ0tfQU5EX0dFVF9XQVRFUlBST09GV0FMTF9USUNLRVQ6ICcvdGlnZXIvY2FwdGNoYS9ncmFwaC90aWNrZXRzL3dhdGVycHJvb2Ytd2FsbCcsXHJcbn07XHJcbnZhciBQTEFURk9STV9DQVBUQ0hBX0FQSSA9IHtcclxuICAgIEdFVF9SVUxFOiAnL2NhcHRjaGEvcnVsZScsXHJcbiAgICBHRVRfR0VFVEVTVF9QQVJBTVM6ICcvY2FwdGNoYS9nZWV0ZXN0L3JlZ2lzdGVyJyxcclxuICAgIENIRUNLX0FORF9HRVRfR0VFVEVTVF9USUNLRVQ6ICcvY2FwdGNoYS9nZWV0ZXN0L3ZlcmlmeScsXHJcbiAgICBDSEVDS19BTkRfR0VUX1RFTkNFTlRfVElDS0VUOiAnL2NhcHRjaGEvdGVuY2VudCcsXHJcbn07XHJcbnZhciBUSUdFUl9UT0tFTl9BUEkgPSB7XHJcbiAgICBSRUZSRVNIX1RPS0VOOiAnL3RpZ2VyL3YzL3dlYi9hY2NvdW50cy90b2tlbnMvcmVmcmVzaCcsXHJcbiAgICBERUxFVEVfVE9LRU46ICcvdGlnZXIvdjMvd2ViL2FjY291bnRzL3Rva2VucycsXHJcbiAgICBHRVRfVE9LRU5fRlJPTV9PTERfQ09PS0lFOiAnL3RpZ2VyL3YzL3dlYi9hY2NvdW50cy90b2tlbnMvY29udmVydCcsXHJcbn07XHJcbnZhciBQVUJMSUNfSEVBREVSUyA9IHtcclxuICAgICdOZXQnOiBuYXZpZ2F0b3IuY29ubmVjdGlvbiA/IG5hdmlnYXRvci5jb25uZWN0aW9uLmVmZmVjdGl2ZVR5cGUgOiAnJyxcclxuICAgICdTREstQWNjb3VudC1WZXJzaW9uJzogdmVyc2lvbixcclxufTtcblxudmFyIGFwaSA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbl9fcHJvdG9fXzogbnVsbCxcbkFwaTogQXBpLFxuVElHRVJfQ0FQVENIQV9BUEk6IFRJR0VSX0NBUFRDSEFfQVBJLFxuUExBVEZPUk1fQ0FQVENIQV9BUEk6IFBMQVRGT1JNX0NBUFRDSEFfQVBJLFxuVElHRVJfVE9LRU5fQVBJOiBUSUdFUl9UT0tFTl9BUEksXG5QVUJMSUNfSEVBREVSUzogUFVCTElDX0hFQURFUlNcbn0pO1xuXG4vKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG5cclxuZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxudmFyIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufTtcclxuXHJcbmZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IHlbb3BbMF0gJiAyID8gXCJyZXR1cm5cIiA6IG9wWzBdID8gXCJ0aHJvd1wiIDogXCJuZXh0XCJdKSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFswLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIFRoaXMgZmlsZSBpcyB1c2VkIHRvIGludGVncmF0ZSBlcnJvciBtZXNzYWdlLlxyXG4gKi9cclxuLyoqXHJcbiAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgQ29kZW1hb0Vycm9yLlxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gZXJyb3JfY29kZSBVbmlxdWUgZXJyb3IgY29kZS5cclxuICogQHBhcmFtIHtzdHJpbmd9IGVycm9yX21zZyBFcnJvciBtZXNzYWdlLlxyXG4gKi9cclxudmFyIENvZGVtYW9FcnJvciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhDb2RlbWFvRXJyb3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBDb2RlbWFvRXJyb3Iob3B0aW9ucykge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG9wdGlvbnMubWVzc2FnZSkgfHwgdGhpcztcclxuICAgICAgICBpZiAob3B0aW9ucy5lcnJvcl9jb2RlICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBfdGhpcy5lcnJvcl9jb2RlID0gb3B0aW9ucy5lcnJvcl9jb2RlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0aW9ucy5lcnJvcl9ib2R5KSB7XHJcbiAgICAgICAgICAgIF90aGlzLmVycm9yX2JvZHkgPSBvcHRpb25zLmVycm9yX2JvZHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIHJldHVybiBDb2RlbWFvRXJyb3I7XHJcbn0oRXJyb3IpKTtcclxuLy8gTWFwIHRoZSBiYWNrLWVuZCBlcnJvciB0byBpcmlzIGVycm9yLlxyXG52YXIgQmFja2VuZEVycm9yID0ge1xyXG4gICAgJ0FDM18wJzoge1xyXG4gICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuUEhPTkVfUkVHSVNURVJFRCxcclxuICAgICAgICBtZXNzYWdlOiAnUGhvbmUgbnVtYmVyIGlzIHJlZ2lzdGVyZWQuJyxcclxuICAgIH0sXHJcbiAgICAnQUMzXzEnOiB7XHJcbiAgICAgICAgZXJyb3JfY29kZTogRVJST1JfVFlQRS5QSE9ORV9VTlJFR0lTVEVSRUQsXHJcbiAgICAgICAgbWVzc2FnZTogJ1Bob25lIG51bWJlciBpcyB1bnJlZ2lzdGVyZWQuJyxcclxuICAgIH0sXHJcbiAgICAnQUMzXzInOiB7XHJcbiAgICAgICAgZXJyb3JfY29kZTogRVJST1JfVFlQRS5VU0VSX05PVF9FWElTVF9PUl9QV0RfV1JPTkcsXHJcbiAgICAgICAgbWVzc2FnZTogJ1VzZXIgZG9lc25cXCd0IGV4aXN0IG9yIHBhc3N3b3JkIGlzIHdyb25nLicsXHJcbiAgICB9LFxyXG4gICAgJ0FDM18zJzoge1xyXG4gICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuVVNFUl9OT1RfRVhJU1QsXHJcbiAgICAgICAgbWVzc2FnZTogJ1VzZXIgZG9lc25cXCd0IGV4aXN0LicsXHJcbiAgICB9LFxyXG4gICAgJ0FDM180Jzoge1xyXG4gICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuQ0FOTk9UX1NFVF9GVVRVUkVfREFURSxcclxuICAgICAgICBtZXNzYWdlOiAnQ2Fubm90IHNldCBhIGZ1dHVyZSBkYXRlLicsXHJcbiAgICB9LFxyXG4gICAgJ0FDM181Jzoge1xyXG4gICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuQ0FOTk9UX1NFVF9VU0VSTkFNRV9SRVBFQVRFRExZLFxyXG4gICAgICAgIG1lc3NhZ2U6ICdDYW5ub3Qgc2V0IHRoZSB1c2VybmFtZSByZXBlYXRlZGx5LicsXHJcbiAgICB9LFxyXG4gICAgJ0FDM182Jzoge1xyXG4gICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuVVNFUk5BTUVfRVhJU1QsXHJcbiAgICAgICAgbWVzc2FnZTogJ1VzZXJuYW1lIGlzIGFscmVhZHkgZXhpc3RlZC4nLFxyXG4gICAgfSxcclxuICAgICdBQzNfNyc6IHtcclxuICAgICAgICBlcnJvcl9jb2RlOiBFUlJPUl9UWVBFLk5FRURfVE9fQklORF9QSE9ORSxcclxuICAgICAgICBtZXNzYWdlOiAnVXNlciBuZWVkIHRvIGJpbmQgYSBwaG9uZS4nLFxyXG4gICAgfSxcclxuICAgICdBQzNfOCc6IHtcclxuICAgICAgICBlcnJvcl9jb2RlOiBFUlJPUl9UWVBFLlVTRV9CT1VORF9QSE9ORV9UT19SRUNFSVZFX0NBUFRDSEEsXHJcbiAgICAgICAgbWVzc2FnZTogJ05lZWQgdG8gdXNlIHRoZSBib3VuZCBwaG9uZSB0byByZWNlaXZlIHRoZSBjYXB0Y2hhLicsXHJcbiAgICB9LFxyXG4gICAgJ0FDM185Jzoge1xyXG4gICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuV1JPTkdfT0xEX1BXRCxcclxuICAgICAgICBtZXNzYWdlOiAnV3Jvbmcgb2xkIHBhc3N3b3JkLicsXHJcbiAgICB9LFxyXG4gICAgJ0FDM18xMCc6IHtcclxuICAgICAgICBlcnJvcl9jb2RlOiBFUlJPUl9UWVBFLlBXRFNfRE9fTk9UX01BVENILFxyXG4gICAgICAgIG1lc3NhZ2U6ICdQYXNzd29yZHMgZG8gbm90IG1hdGNoLicsXHJcbiAgICB9LFxyXG4gICAgJ0FDM18xMSc6IHtcclxuICAgICAgICBlcnJvcl9jb2RlOiBFUlJPUl9UWVBFLklOSVRfUFdEX0NBTl9TRVRfT05MWV9PTkNFLFxyXG4gICAgICAgIG1lc3NhZ2U6ICdJbml0LXBhc3N3b3JkIGNhbiBiZSBzZXQgb25seSBvbmNlLicsXHJcbiAgICB9LFxyXG4gICAgJ0FDM18xMic6IHtcclxuICAgICAgICBlcnJvcl9jb2RlOiBFUlJPUl9UWVBFLk5FRURfUFJJTUFSWV9BQ0NPVU5ULFxyXG4gICAgICAgIG1lc3NhZ2U6ICdQcmltYXJ5IGFjY291bnQgc2hvdWxkIGV4aXN0LihvbmUgb2YgZW1haWwsIHVzZXJuYW1lIGFuZCBwaG9uZSBudW1iZXIpLicsXHJcbiAgICB9LFxyXG4gICAgJ0FDM18xMyc6IHtcclxuICAgICAgICBlcnJvcl9jb2RlOiBFUlJPUl9UWVBFLlZFUklGWV9DQVBUQ0hBX0ZBSUwsXHJcbiAgICAgICAgbWVzc2FnZTogJ0ZhaWwgd2hlbiB2ZXJpZnlpbmcgdGhlIGNhcHRjaGEuJyxcclxuICAgIH0sXHJcbiAgICAnQUMzXzE0Jzoge1xyXG4gICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuVVNFUl9QSE9ORV9CT1VORCxcclxuICAgICAgICBtZXNzYWdlOiAnVXNlciBoYXMgYm91bmQgYSBwaG9uZS4nLFxyXG4gICAgfSxcclxuICAgICdBQzNfMTUnOiB7XHJcbiAgICAgICAgZXJyb3JfY29kZTogRVJST1JfVFlQRS5PTERfUEhPTkVfV1JPTkcsXHJcbiAgICAgICAgbWVzc2FnZTogJ09sZCBwaG9uZSBudW1iZXIgaXMgd3JvbmcuJyxcclxuICAgIH0sXHJcbiAgICAnQUMzXzE2Jzoge1xyXG4gICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuSUxMRUdBTF9PUEVSQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogJ09wZXJhdGlvbiBpcyBpbGxlZ2FsLicsXHJcbiAgICB9LFxyXG4gICAgJ0FDM18xNyc6IHtcclxuICAgICAgICBlcnJvcl9jb2RlOiBFUlJPUl9UWVBFLkNBTk5PVF9CSU5EX09MRF9QSE9ORSxcclxuICAgICAgICBtZXNzYWdlOiAnQ2Fubm90IGJpbmQgcGhvbmUgd2l0aCBhIG9sZCBwaG9uZSBudW1iZXIuJyxcclxuICAgIH0sXHJcbiAgICAnQUMzXzE4Jzoge1xyXG4gICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuSUxMRUdBTF9PQVVUSF9USUNLRVQsXHJcbiAgICAgICAgbWVzc2FnZTogJ09hdXRoX3RpY2tldCBpcyBpbGxlZ2FsLicsXHJcbiAgICB9LFxyXG4gICAgJ0FDM18xOSc6IHtcclxuICAgICAgICBlcnJvcl9jb2RlOiBFUlJPUl9UWVBFLklMTEVHQUxfQVVUSE9SSVpBVElPTl9DQVRFR09SWSxcclxuICAgICAgICBtZXNzYWdlOiAnQXV0aG9yaXphdGlvbiBjYXRlZ29yeSBpcyBpbGxlZ2FsLicsXHJcbiAgICB9LFxyXG4gICAgJ0FDM18yMCc6IHtcclxuICAgICAgICBlcnJvcl9jb2RlOiBFUlJPUl9UWVBFLlRISVJEX1BBUlRZX0FDQ09VTlRfQk9VTkQsXHJcbiAgICAgICAgbWVzc2FnZTogJ1RoaXJkLXBhcnR5IGFjY291bnQgaGFzIGJlZW4gYm91bmQuJyxcclxuICAgIH0sXHJcbiAgICAnQUMzXzIxJzoge1xyXG4gICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuQVVUSE9SSVpBVElPTl9BQ0NPVU5UX0JPVU5ELFxyXG4gICAgICAgIG1lc3NhZ2U6ICdBY2NvdW50IGhhcyBiZWVuIGJvdW5kIHdpdGggdGhlIHRoZSBzYW1lIGF1dGhvcml6YXRpb24gYWNjb3VudC4nLFxyXG4gICAgfSxcclxuICAgICdBQzNfMjInOiB7XHJcbiAgICAgICAgZXJyb3JfY29kZTogRVJST1JfVFlQRS5CSU5EX1BIT05FX09SX1NFVF9VU0VSTkFNRV9BTkRfUFdELFxyXG4gICAgICAgIG1lc3NhZ2U6ICdQbGVhc2UgYmluZCBhIHBob25lIG9yIHNldCB0aGUgdXNlcm5hbWUuJyxcclxuICAgIH0sXHJcbiAgICAnQUMzXzIzJzoge1xyXG4gICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuU0VORF9DQVBUQ0hBX1RPT19GUlVRVUVOVExZLFxyXG4gICAgICAgIG1lc3NhZ2U6ICdSZXF1ZXN0IGNhcHRjaGFzIHRvbyBmcnVxdWVudGx5LicsXHJcbiAgICB9LFxyXG4gICAgJ0FDM18yNCc6IHtcclxuICAgICAgICBlcnJvcl9jb2RlOiBFUlJPUl9UWVBFLklMTEVHQUxfUElELFxyXG4gICAgICAgIG1lc3NhZ2U6ICdQaWQgaXMgaWxsZWdhbC4nLFxyXG4gICAgfSxcclxuICAgICdBQzNfMjUnOiB7XHJcbiAgICAgICAgZXJyb3JfY29kZTogRVJST1JfVFlQRS5OSUNLTkFNRV9FWElTVCxcclxuICAgICAgICBtZXNzYWdlOiAnTmlja25hbWUgaXMgYWxyZWFkeSBleGlzdGVkLicsXHJcbiAgICB9LFxyXG4gICAgJ0FDM18yNic6IHtcclxuICAgICAgICBlcnJvcl9jb2RlOiBFUlJPUl9UWVBFLlBIT05FX0JPVU5EX0JZX09USEVSX0FDQ09VTlQsXHJcbiAgICAgICAgbWVzc2FnZTogJ1Bob25lIGhhcyBiZWVuIGJvdW5kIGJ5IG90aGVyIGFjY291bnQuJyxcclxuICAgIH0sXHJcbiAgICAnQUMzXzI3Jzoge1xyXG4gICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuV1JPTkdfVElDS0VULFxyXG4gICAgICAgIG1lc3NhZ2U6ICdUaWNrZXQgaXMgd3JvbmcuJyxcclxuICAgIH0sXHJcbiAgICAnQ18xJzoge1xyXG4gICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuUVFfRVJST1JfUkVDRUlWRUQsXHJcbiAgICAgICAgbWVzc2FnZTogJ1JlY2VpdmUgZXJyb3IgZnJvbSBRUSB3aGVuIGxvZ2luIHdpdGggaXQuJyxcclxuICAgIH0sXHJcbiAgICAnQ18yJzoge1xyXG4gICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuV0VDSEFSX0VSUk9SX1JFQ0VJVkVELFxyXG4gICAgICAgIG1lc3NhZ2U6ICdSZWNlaXZlIGVycm9yIGZyb20gV2VDaGF0IHdoZW4gbG9naW4gd2l0aCBpdC4nLFxyXG4gICAgfSxcclxuICAgICcxMDAwMDAwMCc6IHtcclxuICAgICAgICBlcnJvcl9jb2RlOiBFUlJPUl9UWVBFLlRPS0VOX0lOVkFMSUQsXHJcbiAgICAgICAgbWVzc2FnZTogJ0FjY2VzcyB0b2tlbiBpcyBpbnZhbGlkLicsXHJcbiAgICB9LFxyXG4gICAgJzEwMDAwMDAxJzoge1xyXG4gICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuUkVGUkVTSF9UT0tFTl9JTlZBTElELFxyXG4gICAgICAgIG1lc3NhZ2U6ICdSZWZyZXNoIHRva2VuIGlzIGludmFsaWQuJyxcclxuICAgIH0sXHJcbiAgICAnMTAwMDAwMDInOiB7XHJcbiAgICAgICAgZXJyb3JfY29kZTogRVJST1JfVFlQRS5DT09LSUVfSU5WQUxJRCxcclxuICAgICAgICBtZXNzYWdlOiAnRmFpbCB0byBjb252ZXJ0IGNvb2tpZSB0byB0b2tlbi4nLFxyXG4gICAgfSxcclxuICAgICcxMDAxNzAwMSc6IHtcclxuICAgICAgICBlcnJvcl9jb2RlOiBFUlJPUl9UWVBFLkFwcGlkX05vdEZvdW5kLFxyXG4gICAgICAgIG1lc3NhZ2U6ICdBcHBpZE5vdEZvdW5kRXhjZXB0aW9uJyxcclxuICAgIH0sXHJcbiAgICAnMTAwMTcwMDInOiB7XHJcbiAgICAgICAgZXJyb3JfY29kZTogRVJST1JfVFlQRS5EZWZhdWx0X0NhcHRjaGFSdWxlX05vdEZvdW5kLFxyXG4gICAgICAgIG1lc3NhZ2U6ICdEZWZhdWx0Q2FwdGNoYVJ1bGVOb3RGb3VuZEV4Y2VwdGlvbicsXHJcbiAgICB9LFxyXG4gICAgJzEwMDE3MDAzJzoge1xyXG4gICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuVGVuY2VudENhcHRjaGFfRXhjZXB0aW9uLFxyXG4gICAgICAgIG1lc3NhZ2U6ICdUZW5jZW50Q2FwdGNoYUV4Y2VwdGlvbicsXHJcbiAgICB9LFxyXG4gICAgJzEwMDE3MDA0Jzoge1xyXG4gICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuR2VldGVzdENhcHRjaGFfRXhjZXB0aW9uLFxyXG4gICAgICAgIG1lc3NhZ2U6ICdHZWV0ZXN0Q2FwdGNoYUV4Y2VwdGlvbicsXHJcbiAgICB9LFxyXG59O1xuXG4vKipcclxuICogUmVxdWVzdCBtb2R1bGUgdG8gc2VuZCByZXF1ZXN0LlxyXG4gKi9cclxudmFyIENvZGVtYW9SZXF1ZXN0ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gQ29kZW1hb1JlcXVlc3QoY29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5ob3N0VHlwZSA9IChjb25maWcgJiYgY29uZmlnLmhvc3RUeXBlKSB8fCAndGlnZXInO1xyXG4gICAgICAgIHRoaXMudGltZW91dCA9IChjb25maWcgJiYgY29uZmlnLnRpbWVvdXQpIHx8IDIwMDAwO1xyXG4gICAgICAgIHRoaXMucHVibGljX2hlYWRlcnMgPSBjb25maWcgJiYgY29uZmlnLnB1YmxpY19oZWFkZXJzO1xyXG4gICAgfVxyXG4gICAgQ29kZW1hb1JlcXVlc3QucHJvdG90eXBlLmdldF9jb21wbGV0ZV91cmwgPSBmdW5jdGlvbiAodXJsLCBwYXJhbXMpIHtcclxuICAgICAgICB2YXIgcGFyYW1zX3N0ciA9IE9iamVjdC5rZXlzKHBhcmFtcylcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBwYXJhbXNba2V5XTsgfSlcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBrZXkgKyBcIj1cIiArIHBhcmFtc1trZXldOyB9KVxyXG4gICAgICAgICAgICAuam9pbignJicpO1xyXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhwYXJhbXMpLmxlbmd0aCA9PT0gMFxyXG4gICAgICAgICAgICA/IFwiXCIgKyBjb25maWckMS5ob3N0W3RoaXMuaG9zdFR5cGVdICsgdXJsXHJcbiAgICAgICAgICAgIDogXCJcIiArIGNvbmZpZyQxLmhvc3RbdGhpcy5ob3N0VHlwZV0gKyB1cmwgKyBcIj9cIiArIHBhcmFtc19zdHI7XHJcbiAgICB9O1xyXG4gICAgQ29kZW1hb1JlcXVlc3QucHJvdG90eXBlLmRpc3BhdGNoX3JlcXVlc3QgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgcmV0dXJuIF9fYXdhaXRlcihfdGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVybCwgbWV0aG9kLCBkYXRhLCB3aXRob3V0X2Jhc2VfdXJsLCBwYXJhbXMsIGNvbXBhdGlibGVIZWFkZXJzLCBoZWFkZXJzLCByZXF1ZXN0X3VybCwgYXV0aF92ZXJzaW9uLCByZXF1ZXN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmwgPSBvcHRpb25zLnVybCwgbWV0aG9kID0gb3B0aW9ucy5tZXRob2QsIGRhdGEgPSBvcHRpb25zLmRhdGEsIHdpdGhvdXRfYmFzZV91cmwgPSBvcHRpb25zLndpdGhvdXRfYmFzZV91cmw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSBvcHRpb25zLnBhcmFtcyB8fCB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBhdGlibGVIZWFkZXJzID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdFBhcmFtcy5hdXRoX3ZlcnNpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wYXRpYmxlSGVhZGVyc1snQXV0aC1WZXJzaW9uJ10gPSBpbml0UGFyYW1zLmF1dGhfdmVyc2lvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbml0UGFyYW1zLmNsaWVudF9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBhdGlibGVIZWFkZXJzWydDbGllbnQtSUQnXSA9IGluaXRQYXJhbXMuY2xpZW50X2lkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVycyA9IF9fYXNzaWduKF9fYXNzaWduKF9fYXNzaWduKHt9LCB0aGlzLnB1YmxpY19oZWFkZXJzKSwgb3B0aW9ucy5oZWFkZXJzKSwgY29tcGF0aWJsZUhlYWRlcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdF91cmwgPSB3aXRob3V0X2Jhc2VfdXJsID8gdXJsIDogdGhpcy5nZXRfY29tcGxldGVfdXJsKHVybCwgcGFyYW1zKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmlzX25ld190b2tlbiAmJiBpbml0UGFyYW1zLmF1dGhfdmVyc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhfdmVyc2lvbiA9IGluaXRQYXJhbXMuYXV0aF92ZXJzaW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oZGF0YSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRoX3ZlcnNpb246IGF1dGhfdmVyc2lvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3Qub3BlbihtZXRob2QudG9VcHBlckNhc2UoKSwgcmVxdWVzdF91cmwsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGF0YSB3aWxsIGJlIHNlbnQgd2l0aCBqc29uIENvbnRlbnQtVHlwZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSAmJiByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3QudGltZW91dCA9IGluaXRQYXJhbXMucmVxdWVzdFRpbWVvdXQgfHwgdGhpcy50aW1lb3V0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiBoYW5kbGVfbG9hZGVkKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfYTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlcXVlc3QgfHwgcmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIHJlcXVlc3QgZXJyb3JlZCBvdXQgYW5kIHdlIGRpZG4ndCBnZXQgYSByZXNwb25zZSwgdGhpcyB3aWxsIGJlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaGFuZGxlZCBieSBvbmVycm9yIGluc3RlYWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXaXRoIG9uZSBleGNlcHRpb246IHJlcXVlc3QgdGhhdCB1c2luZyBmaWxlOiBwcm90b2NvbCwgbW9zdCBicm93c2Vyc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdpbGwgcmV0dXJuIHN0YXR1cyBhcyAwIGV2ZW4gdGhvdWdoIGl0J3MgYSBzdWNjZXNzZnVsIHJlcXVlc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDAgJiYgIShyZXF1ZXN0LnJlc3BvbnNlVVJMICYmIHJlcXVlc3QucmVzcG9uc2VVUkwuaW5kZXhPZignZmlsZTonKSA9PT0gMCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPj0gMjAwICYmIHJlcXVlc3Quc3RhdHVzIDw9IDMwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSByZXF1ZXN0LnJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN0YXR1c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiByZXF1ZXN0LnN0YXR1cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1c1RleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogSlNPTi5wYXJzZShyZXNwb25zZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogcmVxdWVzdC5zdGF0dXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzVGV4dDogcmVxdWVzdC5zdGF0dXNUZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyBpcmlzJ3MgZXJyb3IgJiByZXF1ZXN0X3dpdGhfdG9rZW4oKSBiYWNrLWVuZCBlcnJvci5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IEJhY2tlbmRFcnJvcltyZXNwb25zZS5lcnJvcl9jb2RlXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgQ29kZW1hb0Vycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IENvZGVtYW9FcnJvcih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yX2NvZGU6IHJlc3BvbnNlLmVycm9yX2NvZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yX2JvZHk6ICgoX2EgPSByZXNwb25zZS5jYXRhc3Ryb3BoZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmVycm9yKSB8fCByZXNwb25zZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJHZXQgZXJyb3IgZnJvbSBcIiArIHJlcXVlc3RfdXJsICsgXCIuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yIGlzJywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlcXVlc3QgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBsb3cgbGV2ZWwgbmV0d29yayBlcnJvcnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSZWFsIGVycm9ycyBhcmUgaGlkZGVuIGZyb20gdXMgYnkgdGhlIGJyb3dzZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvbmVycm9yIHNob3VsZCBvbmx5IGZpcmUgaWYgaXQncyBhIG5ldHdvcmsgZXJyb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IENvZGVtYW9FcnJvcih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuUkVRVUVTVF9FUlJPUixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ05ldHdvcmsgZXJyb3IuJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXF1ZXN0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIYW5kbGUgdGltZW91dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBDb2RlbWFvRXJyb3Ioe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcl9jb2RlOiBFUlJPUl9UWVBFLlJFUVVFU1RfVElNRU9VVCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJFQ09OTkFCT1JURUQ6dGltZW91dCBvZiBcIiArIHJlcXVlc3QudGltZW91dCArIFwiIG1zIGV4Y2VlZGVkLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlcXVlc3QgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgnc2V0UmVxdWVzdEhlYWRlcicgaW4gcmVxdWVzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIodmFsLCBoZWFkZXJzW3ZhbF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pOyB9KV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBDb2RlbWFvUmVxdWVzdDtcclxufSgpKTtcclxudmFyIFRpZ2VyQXBpID0gbmV3IENvZGVtYW9SZXF1ZXN0KCk7XHJcbnZhciBQbGF0Zm9ybUFwaSA9IG5ldyBDb2RlbWFvUmVxdWVzdCh7XHJcbiAgICBob3N0VHlwZTogJ3BsYXRmb3JtJyxcclxufSk7XG5cbi8vIEZ1bmN0aW9uIHRvIGNoZWNrIGlmIGlucHV0IHBhcmFtcycgcHJvcGVydGllcyBhcmUgdmFsaWQuXHJcbmZ1bmN0aW9uIGNoZWNrX2lucHV0X3BhcmFtcyhvYmosIGNoZWNrX3Byb3BlcnRpZXMpIHtcclxuICAgIGlmIChvYmopIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhvYmopLm1hcChmdW5jdGlvbiAocHJvcGVydHkpIHtcclxuICAgICAgICAgICAgaWYgKGNoZWNrX3Byb3BlcnRpZXMuaW5kZXhPZihwcm9wZXJ0eSkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29kZW1hb0Vycm9yKHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkludmFsaWQgcGFyYW0gXFxcIlwiICsgcHJvcGVydHkgKyBcIlxcXCJcIixcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuLy8gQWxsIFJlZ0V4cCBmb3IgdmFsaWRhdGlvblxyXG52YXIgcGhvbmVfbnVtYmVyX3BhdHRlcm4gPSAvXjFbMzQ1Njc4OV1cXGR7OX0kLztcclxudmFyIGNhcHRjaGFfcGF0dGVybiA9IC9eXFxkezZ9JC87XHJcbnZhciBwYXNzd29yZF9wYXR0ZXJuID0gL15bYS16QS1aMC05XFxfXFwtQCM/IX4kXiZcXCpcXChcXClcXC8lPD4sXFwuOzpcIis9fFxcXFx7fVxcW1xcXV17NiwyMH0kLztcclxudmFyIHVzZXJuYW1lX3BhdHRlcm4gPSAvXlthLXpBLVpdezF9XFx3ezUsMjl9JC87XHJcbnZhciBuaWNrbmFtZV9wYXR0ZXJuID0gL15bXlxcc+KYgOKYgeKYgs+f4piJ4pi84pi+4pi94pmB4pmo4p2E4p2F4p2G4piD4piB4pyJ4oSh4oS74piO4piP4pyC4pyE4pyG4pyO4pyP4pyQ4pyR4pyS4pyH4oSXwqnCrvCfhY/wn4aP4pqQ4pqR4pqG4pqH4pqI4pqJ4pqe4pqf4pqg4pqs4pqt4pqu4pqv4piK44uA44uB44uC44uD44uE44uF44uG44uH44uI44uJ44uK44uL44+g44+h44+i44+j44+k44+l44+m44+n44+o44+pIOOPquOPq+OPrOOPreOPruOPr+OPsOOPseOPsuOPs+OPtOOPteOPtuOPt+OPuOOPueOPuuOPu+OPvOOPveOPvuONmOONmeONmuONm+ONnOONneONnuONn+ONoOONoeONouONo+ONpOONpeONpuONp+ONqOONqeONquONq+ONrOONreONruONr+ONsOOPguOPmOKZs+KZtOKZteKZtuKZt+KZuOKZueKZuuKZsuKZu+KZvOKZveKagOKageKaguKag+KahOKahV17MSwyMH0kLztcclxudmFyIGZ1bGxuYW1lX3BhdHRlcm4gPSAvXihbXFx1NGUwMC1cXHU5ZmE1XXsyLDIwfXxbYS16QS1aXShcXHM/W2EtekEtWl0pezMsMjl9KSQvO1xyXG52YXIgcXFfcGF0dGVybiA9IC9eXFxkezUsMjB9JC87XHJcbmZ1bmN0aW9uIGNoZWNrKHByb3BlcnR5X25hbWUsIHBhdHRlcm4sIGVycm9yX2NvZGUpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAocHJvcGVydHlfdmFsdWUpIHtcclxuICAgICAgICBpZiAoIXBhdHRlcm4udGVzdChwcm9wZXJ0eV92YWx1ZSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvZGVtYW9FcnJvcih7XHJcbiAgICAgICAgICAgICAgICBlcnJvcl9jb2RlOiBlcnJvcl9jb2RlLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJJbnZhbGlkIFwiICsgcHJvcGVydHlfbmFtZSArIFwiIFxcXCJcIiArIHByb3BlcnR5X3ZhbHVlICsgXCJcXFwiLCBpdCBzaG91bGQgbWF0Y2ggdGhlIFJlZ0V4cCBcIiArIHBhdHRlcm4gKyBcIi5cIixcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG4vLyBGdW5jdGlvbiB0byBjaGVjayBwaG9uZSBudW1iZXJcclxudmFyIGNoZWNrX3Bob25lX251bWJlciA9IGNoZWNrKCdwaG9uZV9udW1iZXInLCBwaG9uZV9udW1iZXJfcGF0dGVybiwgRVJST1JfVFlQRS5JTlZBTElEX1BIT05FX05VTUJFUik7XHJcbi8vIEZ1bmN0aW9uIHRvIGNoZWNrIGNhcHRjaGFcclxudmFyIGNoZWNrX2NhcHRjaGEgPSBjaGVjaygnY2FwdGNoYScsIGNhcHRjaGFfcGF0dGVybiwgRVJST1JfVFlQRS5JTlZBTElEX0NBUFRDSEEpO1xyXG4vLyBGdW5jdGlvbiB0byBjaGVjayBwYXNzd29yZFxyXG52YXIgY2hlY2tfcGFzc3dvcmQgPSBjaGVjaygncGFzc3dvcmQnLCBwYXNzd29yZF9wYXR0ZXJuLCBFUlJPUl9UWVBFLklOVkFMSURfUEFTU1dPUkQpO1xyXG4vLyBGdW5jdGlvbiB0byBjaGVjayB1c2VybmFtZVxyXG52YXIgY2hlY2tfdXNlcm5hbWUgPSBjaGVjaygndXNlcm5hbWUnLCB1c2VybmFtZV9wYXR0ZXJuLCBFUlJPUl9UWVBFLklOVkFMSURfVVNFUk5BTUUpO1xyXG4vLyBGdW5jdGlvbiB0byBjaGVjayBuaWNrbmFtZVxyXG52YXIgY2hlY2tfbmlja25hbWUgPSBjaGVjaygnbmlja25hbWUnLCBuaWNrbmFtZV9wYXR0ZXJuLCBFUlJPUl9UWVBFLklOVkFMSURfTklDS05BTUUpO1xyXG4vLyBGdW5jdGlvbiB0byBjaGVjayBmdWxsbmFtZVxyXG52YXIgY2hlY2tfZnVsbG5hbWUgPSBjaGVjaygnZnVsbG5hbWUnLCBmdWxsbmFtZV9wYXR0ZXJuLCBFUlJPUl9UWVBFLklOVkFMSURfRlVMTE5BTUUpO1xyXG4vLyBGdW5jdGlvbiB0byBjaGVjayBxcVxyXG52YXIgY2hlY2tfcXEgPSBjaGVjaygncXEnLCBxcV9wYXR0ZXJuLCBFUlJPUl9UWVBFLklOVkFMSURfUVEpO1xyXG4vLyBGdW5jdGlvbiB0byBjaGVjayBkZXNjcmlwdGlvblxyXG5mdW5jdGlvbiBjaGVja19kZXNjcmlwdGlvbihkZXNjcmlwdGlvbikge1xyXG4gICAgaWYgKGRlc2NyaXB0aW9uLmxlbmd0aCA+IDUwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IENvZGVtYW9FcnJvcih7XHJcbiAgICAgICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuSU5WQUxJRF9ERVNDUklQVElPTixcclxuICAgICAgICAgICAgbWVzc2FnZTogJ0ludmFsaWQgZGVzY3JpcHRpb24sIGl0IHNob3VsZCBjb250YWlucyBvbmx5IDAgLSA1MCBjaGFyYWN0ZXJzLicsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuLy8gRnVuY3Rpb24gdG8gY2hlY2sgc2V4XHJcbmZ1bmN0aW9uIGNoZWNrX3NleChzZXgpIHtcclxuICAgIGlmIChzZXggIT09IDAgJiYgc2V4ICE9PSAxKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IENvZGVtYW9FcnJvcih7XHJcbiAgICAgICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuSU5WQUxJRF9TRVgsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiSW52YWxpZCBzZXggXFxcIlwiICsgc2V4ICsgXCJcXFwiLCBpdCBzaG91bGQgYmUgMCBvciAxLlwiLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbi8vIEZ1bmN0aW9uIHRvIGNoZWNrIGJpcnRoZGF5XHJcbmZ1bmN0aW9uIGNoZWNrX2JpcnRoZGF5KGJpcnRoZGF5KSB7XHJcbiAgICBpZiAoIU51bWJlci5pc0ludGVnZXIoYmlydGhkYXkpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IENvZGVtYW9FcnJvcih7XHJcbiAgICAgICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuSU5WQUxJRF9CSVJUSERBWSxcclxuICAgICAgICAgICAgbWVzc2FnZTogXCJJbnZhbGlkIGJpcnRoZGF5IFxcXCJcIiArIGJpcnRoZGF5ICsgXCJcXFwiLCBpdCBzaG91bGQgYmUgYSBpbnRlZ2VyIG51bWJlci5cIixcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogRnVuY3Rpb24gdG8gY2hlY2sgcmVnaXN0ZXIgb3B0aW9ucy5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge1JlZ2lzdGVyT3B0aW9uc30gb3B0aW9uc1xyXG4gKi9cclxuZnVuY3Rpb24gY2hlY2tfcmVnaXN0ZXJfb3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICB2YXIgcGhvbmVfbnVtYmVyID0gb3B0aW9ucy5waG9uZV9udW1iZXIsIHBhc3N3b3JkID0gb3B0aW9ucy5wYXNzd29yZCwgY2FwdGNoYSA9IG9wdGlvbnMuY2FwdGNoYTtcclxuICAgIGNoZWNrX3Bob25lX251bWJlcihwaG9uZV9udW1iZXIpO1xyXG4gICAgY2hlY2tfcGFzc3dvcmQocGFzc3dvcmQpO1xyXG4gICAgY2hlY2tfY2FwdGNoYShjYXB0Y2hhKTtcclxufVxyXG4vKipcclxuICogRnVuY3Rpb24gdG8gY2hlY2sgdXNlciBwcm9maWxyIGZvciBzZXRfcHJvZmlsZS5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge1VzZXJQcm9maWxlfSBwcm9maWxlXHJcbiAqL1xyXG5mdW5jdGlvbiBjaGVja19wcm9maWxlKHByb2ZpbGUpIHtcclxuICAgIHZhciBiaXJ0aGRheSA9IHByb2ZpbGUuYmlydGhkYXksIHNleCA9IHByb2ZpbGUuc2V4LCBmdWxsbmFtZSA9IHByb2ZpbGUuZnVsbG5hbWUsIG5pY2tuYW1lID0gcHJvZmlsZS5uaWNrbmFtZSwgcXEgPSBwcm9maWxlLnFxLCBkZXNjcmlwdGlvbiA9IHByb2ZpbGUuZGVzY3JpcHRpb247XHJcbiAgICBpZiAoYmlydGhkYXkpIHtcclxuICAgICAgICBjaGVja19iaXJ0aGRheShiaXJ0aGRheSk7XHJcbiAgICB9XHJcbiAgICBpZiAoc2V4KSB7XHJcbiAgICAgICAgY2hlY2tfc2V4KHNleCk7XHJcbiAgICB9XHJcbiAgICBpZiAoZnVsbG5hbWUpIHtcclxuICAgICAgICBjaGVja19mdWxsbmFtZShmdWxsbmFtZSk7XHJcbiAgICB9XHJcbiAgICBpZiAobmlja25hbWUpIHtcclxuICAgICAgICBjaGVja19uaWNrbmFtZShuaWNrbmFtZSk7XHJcbiAgICB9XHJcbiAgICBpZiAocXEpIHtcclxuICAgICAgICBjaGVja19xcShxcSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZGVzY3JpcHRpb24pIHtcclxuICAgICAgICBjaGVja19kZXNjcmlwdGlvbihkZXNjcmlwdGlvbik7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIEZ1bmN0aW8gdG8gY2hlY2sgaWYgcGFzc3dvcmQgZXF1YWxzIGNvbmZpcm0gcGFzc3dvcmQuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHtzdHJpbmd9IHB3ZFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gcHdkX2NvbmZpcm1cclxuICovXHJcbmZ1bmN0aW9uIGNoZWNrX2lmX3B3ZF9lcXVhbHNfY29uZmlybWVkX3B3ZChwd2QsIHB3ZF9jb25maXJtKSB7XHJcbiAgICBpZiAocHdkICE9PSBwd2RfY29uZmlybSkge1xyXG4gICAgICAgIHRocm93IG5ldyBDb2RlbWFvRXJyb3Ioe1xyXG4gICAgICAgICAgICBlcnJvcl9jb2RlOiBFUlJPUl9UWVBFLlBXRF9JU19OT1RfRVFVQUxfVE9fQ09ORklSTUVEX1BXRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogJ1Bhc3N3b3JkIGlzIG5vdCBlcXVhbCB0byBjb25maXJtZWQgcGFzc3dvcmQuJyxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogRnVuY3Rpb24gdG8gcmV0cnkgYSBwcm9taXNlIGZvciByZXRyaWVzIHRpbWVzLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSByZXRyaWVzXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlPGFueT59XHJcbiAqL1xyXG5mdW5jdGlvbiByZXRyeShyZXRyaWVzLCBmbikge1xyXG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciByZXN1bHQsIGVycl8xO1xyXG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMCwgMiwgLCAzXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgZm4oKV07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Euc2VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXN1bHRdO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIGVycl8xID0gX2Euc2VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXRyaWVzID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmV0cnkocmV0cmllcyAtIDEsIGZuKV07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29kZW1hb0Vycm9yKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdHZXQgZ2VldGVzdCBpbml0IHBhcmFtcyBmYWlsLCBwbGVhc2UgcmVsb2FkIHRoZSBwYWdlIG9yIHRyeSBhZ2FpbiBsYXRlci4nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM6IHJldHVybiBbMiAvKnJldHVybiovXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuLy8gRnVuY3Rpb24gdG8gc2V0IGNvb2tpZSB3aXRoIG9wdGlvbnMuXHJcbmZ1bmN0aW9uIHNldF9jb29raWUob3B0aW9ucykge1xyXG4gICAgdmFyIG5hbWUgPSBvcHRpb25zLm5hbWUsIHZhbHVlID0gb3B0aW9ucy52YWx1ZSwgZG9tYWluID0gb3B0aW9ucy5kb21haW4sIG1heF9hZ2UgPSBvcHRpb25zLm1heF9hZ2U7XHJcbiAgICB2YXIgY29va2llU3RyaW5nID0gbmFtZSArIFwiPVwiICsgdmFsdWUgKyBcIjsgZG9tYWluPVwiICsgZG9tYWluICsgXCI7IG1heC1hZ2U9XCIgKyBtYXhfYWdlICsgXCI7IHBhdGg9LztcIjtcclxuICAgIHZhciBzYW1lU2l0ZUNvb2tpZSA9IGNvb2tpZVN0cmluZyArICcgc2FtZXNpdGU9bm9uZTsgc2VjdXJlJztcclxuICAgIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZVN0cmluZztcclxuICAgIGRvY3VtZW50LmNvb2tpZSA9IHNhbWVTaXRlQ29va2llO1xyXG59XHJcbi8vIEZ1bmN0aW9uIHRvIGdldCBjb29raWUgYnkgbmFtZS5cclxuZnVuY3Rpb24gZ2V0X2Nvb2tpZShuYW1lKSB7XHJcbiAgICB2YXIgY29va2llcyA9IHt9O1xyXG4gICAgZG9jdW1lbnQuY29va2llLnNwbGl0KCc7JykuZm9yRWFjaChmdW5jdGlvbiAoY29va2llKSB7XHJcbiAgICAgICAgdmFyIGZpcnN0X2VxdWFsX21hcmtfcG9zaXRpb24gPSBjb29raWUuaW5kZXhPZignPScpO1xyXG4gICAgICAgIHZhciBrZXkgPSBjb29raWUuc2xpY2UoMCwgZmlyc3RfZXF1YWxfbWFya19wb3NpdGlvbik7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gY29va2llLnNsaWNlKGZpcnN0X2VxdWFsX21hcmtfcG9zaXRpb24gKyAxKTtcclxuICAgICAgICBjb29raWVzW2tleS50cmltKCldID0gdmFsdWU7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBjb29raWVzW25hbWVdO1xyXG59XHJcbi8vIEZ1bmN0aW9uIHRvIGNsZWFyIGNvb2tpZSBieSBzZXR0aW5nIG1heC1hZ2UgdG8gbmVnYXRpdmUgbnVtYmVyLlxyXG5mdW5jdGlvbiBjbGVhcl9jb29raWUobmFtZSwgZG9tYWluKSB7XHJcbiAgICBzZXRfY29va2llKHtcclxuICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgIHZhbHVlOiAnJyxcclxuICAgICAgICBkb21haW46IGRvbWFpbixcclxuICAgICAgICBtYXhfYWdlOiAtOTk5OTk5LFxyXG4gICAgfSk7XHJcbn1cclxuLy8gRnVuY3Rpb24gdG8gZ2VuZXJhdGUgdGhlIGNvb2tpZSBuYW1lIGFjY29yZGluZyB0byB0aGUgZW52LlxyXG5mdW5jdGlvbiBnZXRfY29va2llX25hbWUodHlwZSkge1xyXG4gICAgdmFyIGVudiA9IGNvbmZpZyQxLmVudjtcclxuICAgIHZhciBwcmVmaXggPSBlbnYgPT09ICdwcm9kJyA/ICcnIDogZW52ICsgXCItXCI7XHJcbiAgICBpZiAodHlwZSA9PT0gJ3Rva2VuX3R5cGUnKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQWxsIHBvc3NpYmxlIHJlc3VsdFxyXG4gICAgICAgICAqIDEuIHByb2QgLS0gdG9rZW4tdHlwZVxyXG4gICAgICAgICAqIDIuIGRldiAtLSBkZXYtdG9rZW4tdHlwZVxyXG4gICAgICAgICAqIDMuIHN0YWdpbmcgLS0gc3RhZ2luZy10b2tlbi10eXBlXHJcbiAgICAgICAgICogNC4gYXBpLXRlc3QgLS0gYXBpLXRlc3QtdG9rZW4tdHlwZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJldHVybiBwcmVmaXggKyBcInRva2VuLXR5cGVcIjtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQWxsIHBvc3NpYmxlIHJlc3VsdFxyXG4gICAgICogMS4gcHJvZCAtLSAke3R5cGV9LXRva2VuXHJcbiAgICAgKiAyLiBkZXYgLS0gZGV2LSR7dHlwZX0tdG9rZW5cclxuICAgICAqIDMuIHN0YWdpbmcgLS0gc3RhZ2luZy0ke3R5cGV9LXRva2VuXHJcbiAgICAgKiA0LiBhcGktdGVzdCAtLSBhcGktdGVzdC0ke3R5cGV9LXRva2VuXHJcbiAgICAgKi9cclxuICAgIHJldHVybiBcIlwiICsgcHJlZml4ICsgdHlwZSArIFwiLXRva2VuXCI7XHJcbn1cclxuZnVuY3Rpb24gaXNfY29va2llX2V4aXN0KGNvb2tpZSkge1xyXG4gICAgcmV0dXJuIChjb29raWUgJiZcclxuICAgICAgICBjb29raWUgIT09ICd1bmRlZmluZWQnICYmXHJcbiAgICAgICAgY29va2llICE9PSAnJykgPyB0cnVlIDogZmFsc2U7XHJcbn1cclxuZnVuY3Rpb24gbG9hZF9zY3JpcHQodXJsLCBpZCwgdGltZW91dCkge1xyXG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGltZXJfMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRpbWVvdXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVyXzEgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgcmVzb2x2ZSgpOyBjbGVhclRpbWVvdXQodGltZXJfMSk7IH0sIHRpbWVvdXQgKiAxMDAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGltZXJfMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcl8xKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0LmlkID0gaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdC5zcmMgPSB1cmw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KV07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxuXG52YXIgdXRpbHMgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG5fX3Byb3RvX186IG51bGwsXG5jaGVja19pbnB1dF9wYXJhbXM6IGNoZWNrX2lucHV0X3BhcmFtcyxcbmNoZWNrX3Bob25lX251bWJlcjogY2hlY2tfcGhvbmVfbnVtYmVyLFxuY2hlY2tfY2FwdGNoYTogY2hlY2tfY2FwdGNoYSxcbmNoZWNrX3Bhc3N3b3JkOiBjaGVja19wYXNzd29yZCxcbmNoZWNrX3VzZXJuYW1lOiBjaGVja191c2VybmFtZSxcbmNoZWNrX25pY2tuYW1lOiBjaGVja19uaWNrbmFtZSxcbmNoZWNrX2Z1bGxuYW1lOiBjaGVja19mdWxsbmFtZSxcbmNoZWNrX3FxOiBjaGVja19xcSxcbmNoZWNrX2Rlc2NyaXB0aW9uOiBjaGVja19kZXNjcmlwdGlvbixcbmNoZWNrX3NleDogY2hlY2tfc2V4LFxuY2hlY2tfYmlydGhkYXk6IGNoZWNrX2JpcnRoZGF5LFxuY2hlY2tfcmVnaXN0ZXJfb3B0aW9uczogY2hlY2tfcmVnaXN0ZXJfb3B0aW9ucyxcbmNoZWNrX3Byb2ZpbGU6IGNoZWNrX3Byb2ZpbGUsXG5jaGVja19pZl9wd2RfZXF1YWxzX2NvbmZpcm1lZF9wd2Q6IGNoZWNrX2lmX3B3ZF9lcXVhbHNfY29uZmlybWVkX3B3ZCxcbnJldHJ5OiByZXRyeSxcbnNldF9jb29raWU6IHNldF9jb29raWUsXG5nZXRfY29va2llOiBnZXRfY29va2llLFxuY2xlYXJfY29va2llOiBjbGVhcl9jb29raWUsXG5nZXRfY29va2llX25hbWU6IGdldF9jb29raWVfbmFtZSxcbmlzX2Nvb2tpZV9leGlzdDogaXNfY29va2llX2V4aXN0LFxubG9hZF9zY3JpcHQ6IGxvYWRfc2NyaXB0XG59KTtcblxuLy8gQSBjbGFzcyB0byBtYW5hZ2UgdG9rZW4gZm9yIENvZGVtYW9BdXRoIGFuZCBidXNpbmVzcyBwYXJ0aWVzLlxyXG52YXIgQ29kZW1hb1Rva2VuID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gQ29kZW1hb1Rva2VuKCkge1xyXG4gICAgICAgIHRoaXMucmVxdWVzdCA9IG5ldyBDb2RlbWFvUmVxdWVzdCh7XHJcbiAgICAgICAgICAgIHB1YmxpY19oZWFkZXJzOiBfX2Fzc2lnbih7ICdQcm9kdWN0LUNvZGUnOiBjb25maWcucHJvZHVjdF9jb2RlLCAnUGxhdGZvcm0nOiBjb25maWcucGxhdGZvcm0gfSwgUFVCTElDX0hFQURFUlMpLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgQ29kZW1hb1Rva2VuLnByb3RvdHlwZS5kaXNwYXRjaF9yZXF1ZXN0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCB0aGlzLnJlcXVlc3QuZGlzcGF0Y2hfcmVxdWVzdChvcHRpb25zKV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8vIEdldCB0aGUgZnVsbCBhY2Nlc3MgdG9rZW4gLS0gJ3R5cGUgYWNjZXNzLXRva2VuJ1xyXG4gICAgQ29kZW1hb1Rva2VuLnByb3RvdHlwZS5nZXRfY29tcGxldGVfYWNjZXNzX3Rva2VuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB0b2tlbl90eXBlID0gZ2V0X2Nvb2tpZShnZXRfY29va2llX25hbWUoJ3Rva2VuX3R5cGUnKSk7XHJcbiAgICAgICAgdmFyIGFjY2Vzc190b2tlbiA9IGdldF9jb29raWUoZ2V0X2Nvb2tpZV9uYW1lKCdhY2Nlc3MnKSk7XHJcbiAgICAgICAgaWYgKGlzX2Nvb2tpZV9leGlzdCh0b2tlbl90eXBlKSAmJlxyXG4gICAgICAgICAgICBpc19jb29raWVfZXhpc3QoYWNjZXNzX3Rva2VuKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdG9rZW5fdHlwZSArIFwiIFwiICsgYWNjZXNzX3Rva2VuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gQ2xlYXIgdGhlIHByZXZpb3VzIGFjY2VzcyAmIHR5cGUgY29va2llLlxyXG4gICAgICAgICAgICB2YXIgZG9tYWluID0gY29uZmlnJDEuZG9tYWluO1xyXG4gICAgICAgICAgICBjbGVhcl9jb29raWUoZ2V0X2Nvb2tpZV9uYW1lKCdhY2Nlc3MnKSwgZG9tYWluKTtcclxuICAgICAgICAgICAgY2xlYXJfY29va2llKGdldF9jb29raWVfbmFtZSgndG9rZW5fdHlwZScpLCBkb21haW4pO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29kZW1hb0Vycm9yKHtcclxuICAgICAgICAgICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuTk9fVE9LRU4sXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTk8gVG9rZW4oY29va2llIG1pZ2h0IGhhdmUgYmVlbiBleHBpcmVkKS4gUGxlYXNlIGxvZ2luLicsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvLyBHZXQgbG9jYWwgYWNjZXNzIHRva2VuIHdoaWNoIHN0b3JlZCBpbiBjb29raWUuXHJcbiAgICBDb2RlbWFvVG9rZW4ucHJvdG90eXBlLmdldF9hY2Nlc3MgPSBmdW5jdGlvbiAoYXV0aG9yaXphdGlvbikge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIF9hLCByZXMsIGVycl8xO1xyXG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9iKSB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9iLmxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYSA9IHRoaXMuY2hlY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChfYSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnQUNDRVNTX0VYSVNUJzogcmV0dXJuIFszIC8qYnJlYWsqLywgMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdSRUZSRVNIX0VYSVNUJzogcmV0dXJuIFszIC8qYnJlYWsqLywgMl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdOT19UT0tFTic6IHJldHVybiBbMyAvKmJyZWFrKi8sIDRdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDddO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTogXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBhY2Nlc3MgdG9rZW4gZGlyZWN0bHkuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHRoaXMuZ2V0X2NvbXBsZXRlX2FjY2Vzc190b2tlbigpXTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6IFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlZnJlc2ggZmlyc3RseSwgdGhlbiBnZXQgYWNjZXNzIHRva2VuLlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucmVmcmVzaCgpXTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlZnJlc2ggZmlyc3RseSwgdGhlbiBnZXQgYWNjZXNzIHRva2VuLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYi5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCB0aGlzLmdldF9jb21wbGV0ZV9hY2Nlc3NfdG9rZW4oKV07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYi50cnlzLnB1c2goWzQsIDYsICwgN10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmNvbnZlcnRfY29va2llX3RvX3Rva2VuKGF1dGhvcml6YXRpb24pXTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyA9IF9iLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQocmVzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgdGhpcy5nZXRfY29tcGxldGVfYWNjZXNzX3Rva2VuKCldO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyXzEgPSBfYi5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENhc2UgMjogbm8gdG9rZW4gYW5kIG5vIGNvb2tpZSBvciBnZXQgY29va2llX2ludmFsaWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29kZW1hb0Vycm9yKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yX2NvZGU6IEVSUk9SX1RZUEUuTk9fVE9LRU4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTk8gVG9rZW4uIFBsZWFzZSBsb2dpbi4nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDc6IHJldHVybiBbMiAvKnJldHVybiovXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgQ29kZW1hb1Rva2VuLnByb3RvdHlwZS5jb252ZXJ0X2Nvb2tpZV90b190b2tlbiA9IGZ1bmN0aW9uIChhdXRob3JpemF0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgdGhpcy5kaXNwYXRjaF9yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBUSUdFUl9UT0tFTl9BUEkuR0VUX1RPS0VOX0ZST01fT0xEX0NPT0tJRSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IGF1dGhvcml6YXRpb24gPyB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBdXRob3JpemF0aW9uOiBcIkJlYXJlciBcIiArIGF1dGhvcml6YXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gOiB7fSxcclxuICAgICAgICAgICAgICAgICAgICB9KV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8vIEdldCBsb2NhbCByZWZyZXNoIHRva2VuIHdoaWNoIHN0b3JlZCBpbiBjb29raWUuXHJcbiAgICBDb2RlbWFvVG9rZW4ucHJvdG90eXBlLmdldF9yZWZyZXNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChpbml0UGFyYW1zLmF1dGhfdmVyc2lvbikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVjaygpID09PSAnTk9fVE9LRU4nKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29kZW1hb0Vycm9yKHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcl9jb2RlOiBFUlJPUl9UWVBFLk5PX1RPS0VOLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdOTyBUb2tlbi4gUGxlYXNlIGxvZ2luLicsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZ2V0X2Nvb2tpZShnZXRfY29va2llX25hbWUoJ3JlZnJlc2gnKSk7XHJcbiAgICB9O1xyXG4gICAgLy8gUGFzcyB0aGUgdG9rZW4gdG8gY29va2llLlxyXG4gICAgLy8gRXZlcnkgdGltZSBhZnRlciBhdXRoLmxvZ2luX3h4eCgpICYgcmVmcmVzaCgpLlxyXG4gICAgQ29kZW1hb1Rva2VuLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAodG9rZW4pIHtcclxuICAgICAgICB2YXIgYWNjZXNzID0gdG9rZW4uYWNjZXNzLCByZWZyZXNoID0gdG9rZW4ucmVmcmVzaDtcclxuICAgICAgICB2YXIgZG9tYWluID0gY29uZmlnJDEuZG9tYWluO1xyXG4gICAgICAgIC8vIFNldCBhY2Nlc3MgdG9rZW4gdG8gY29va2llLlxyXG4gICAgICAgIGlmIChhY2Nlc3MgJiZcclxuICAgICAgICAgICAgYWNjZXNzLnRva2VuICYmXHJcbiAgICAgICAgICAgIGFjY2Vzcy50eXBlICYmXHJcbiAgICAgICAgICAgIGFjY2Vzcy5leHBpcmVzX2luKSB7XHJcbiAgICAgICAgICAgIHNldF9jb29raWUoe1xyXG4gICAgICAgICAgICAgICAgbmFtZTogZ2V0X2Nvb2tpZV9uYW1lKCdhY2Nlc3MnKSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBhY2Nlc3MudG9rZW4sXHJcbiAgICAgICAgICAgICAgICBkb21haW46IGRvbWFpbixcclxuICAgICAgICAgICAgICAgIG1heF9hZ2U6IGFjY2Vzcy5leHBpcmVzX2luLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gU2V0IHRva2VuIHR5cGUgdG8gY29va2llLlxyXG4gICAgICAgICAgICBzZXRfY29va2llKHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IGdldF9jb29raWVfbmFtZSgndG9rZW5fdHlwZScpLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IGFjY2Vzcy50eXBlLFxyXG4gICAgICAgICAgICAgICAgZG9tYWluOiBkb21haW4sXHJcbiAgICAgICAgICAgICAgICBtYXhfYWdlOiBhY2Nlc3MuZXhwaXJlc19pbixcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1VuZXhwZWN0ZWQgYWNjZXNzIHRva2VuIHJlc3BvbnNlIGZyb20gYmFjay1lbmQ6ICcsIGFjY2Vzcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIENoZWNrIGlmIHJlZnJlc2hfdG9rZW4gZXhpc3RzLlxyXG4gICAgICAgIC8vIFNldCBpdCB0byBjb29raWUgaWYgaXQgZXhpc3RzLlxyXG4gICAgICAgIGlmIChyZWZyZXNoKSB7XHJcbiAgICAgICAgICAgIGlmICghcmVmcmVzaC50b2tlbiB8fCAhcmVmcmVzaC5leHBpcmVzX2luKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1VuZXhwZWN0ZWQgcmVmcmVzaCB0b2tlbiByZXNwb25zZSBmcm9tIGJhY2stZW5kOiAnLCByZWZyZXNoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRfY29va2llKHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IGdldF9jb29raWVfbmFtZSgncmVmcmVzaCcpLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlZnJlc2gudG9rZW4sXHJcbiAgICAgICAgICAgICAgICBkb21haW46IGRvbWFpbixcclxuICAgICAgICAgICAgICAgIG1heF9hZ2U6IHJlZnJlc2guZXhwaXJlc19pbixcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8vIFJlZnJlc2ggdG9rZW4gZnJvbSBiYWNrLWVuZC5cclxuICAgIENvZGVtYW9Ub2tlbi5wcm90b3R5cGUucmVmcmVzaF90b2tlbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCB0aGlzLmRpc3BhdGNoX3JlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdwdXQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IFRJR0VSX1RPS0VOX0FQSS5SRUZSRVNIX1RPS0VOLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWZyZXNoX3Rva2VuOiB0aGlzLmdldF9yZWZyZXNoKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSldO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvLyBSZWZyZXNoIHRva2VuIGZyb20gYmFjay1lbmQgYW5kIHBhc3MgaXQgdG8gY29va2llLlxyXG4gICAgQ29kZW1hb1Rva2VuLnByb3RvdHlwZS5yZWZyZXNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRva2VuX3JlcywgZXJyXzI7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMCwgMiwgLCAzXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucmVmcmVzaF90b2tlbigpXTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuX3JlcyA9IF9hLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQodG9rZW5fcmVzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCAzXTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycl8yID0gX2Euc2VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDbGVhciBjb29raWUgd2hlbiByZWZyZXNoX3Rva2VuIGlzIGludmFsaWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJfMi5lcnJvcl9jb2RlID09PSBFUlJPUl9UWVBFLlJFRlJFU0hfVE9LRU5fSU5WQUxJRCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycl8yO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvLyBDaGVjayBpZiBpdCdzIG5lY2Vzc2FyeSB0byByZWZyZXNoIHRva2VuLlxyXG4gICAgQ29kZW1hb1Rva2VuLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBhY2Nlc3NfdG9rZW4gaXMgbm90IGV4cGlyZWRcclxuICAgICAgICBpZiAoaXNfY29va2llX2V4aXN0KGdldF9jb29raWUoZ2V0X2Nvb2tpZV9uYW1lKCdhY2Nlc3MnKSkpICYmXHJcbiAgICAgICAgICAgIGlzX2Nvb2tpZV9leGlzdChnZXRfY29va2llKGdldF9jb29raWVfbmFtZSgndG9rZW5fdHlwZScpKSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdBQ0NFU1NfRVhJU1QnO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBhY2Nlc3NfdG9rZW4gZXhwaXJlZCwgcmVmcmVzaF90b2tlbiBpcyBub3QgZXhwaXJlZC5cclxuICAgICAgICBpZiAoaXNfY29va2llX2V4aXN0KGdldF9jb29raWUoZ2V0X2Nvb2tpZV9uYW1lKCdyZWZyZXNoJykpKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ1JFRlJFU0hfRVhJU1QnO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBib3RoIG9mIHRoZW0gYXJlIGV4cGlyZWQuXHJcbiAgICAgICAgLy8gb3IsXHJcbiAgICAgICAgLy8gc29tZW9uZSB0cmllcyB0byByZXF1ZXN0IHRoZSBhcGkgd2l0aG91dCBsb2dpbi5cclxuICAgICAgICByZXR1cm4gJ05PX1RPS0VOJztcclxuICAgIH07XHJcbiAgICAvLyBDbGVhciBsb2NhbCB0b2tlbiB0aHJvdWdoIHNldHRpbmcgY29va2llLlxyXG4gICAgQ29kZW1hb1Rva2VuLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZG9tYWluID0gY29uZmlnJDEuZG9tYWluO1xyXG4gICAgICAgIGNsZWFyX2Nvb2tpZShnZXRfY29va2llX25hbWUoJ2FjY2VzcycpLCBkb21haW4pO1xyXG4gICAgICAgIGNsZWFyX2Nvb2tpZShnZXRfY29va2llX25hbWUoJ3Rva2VuX3R5cGUnKSwgZG9tYWluKTtcclxuICAgICAgICBjbGVhcl9jb29raWUoZ2V0X2Nvb2tpZV9uYW1lKCdyZWZyZXNoJyksIGRvbWFpbik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIENvZGVtYW9Ub2tlbjtcclxufSgpKTtcclxuZnVuY3Rpb24gcmV0cnlfd2hlbl90b2tlbl9lcnIocmV0cmllcywgZm4pIHtcclxuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmVzdWx0LCBlcnJfMywgZXJyb3JfY29kZSwgdG9rZW47XHJcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFswLCAyLCAsIDVdKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBmbigpXTtcclxuICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3VsdF07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyXzMgPSBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JfY29kZSA9IGVycl8zLmVycm9yX2NvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoZXJyb3JfY29kZSA9PT0gRVJST1JfVFlQRS5UT0tFTl9JTlZBTElEICYmIHJldHJpZXMgPiAxKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XHJcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSBuZXcgQ29kZW1hb1Rva2VuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdG9rZW4ucmVmcmVzaCgpXTtcclxuICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJldHJ5X3doZW5fdG9rZW5fZXJyKHJldHJpZXMgLSAxLCBmbildO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiB0aHJvdyBlcnJfMztcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxuXG52YXIgX2luc3RhbmNlO1xyXG52YXIgY29uZmlnO1xyXG5mdW5jdGlvbiBpbml0KHBhcmFtcykge1xyXG4gICAgY29uZmlnID0gcGFyYW1zO1xyXG4gICAgaWYgKGNvbmZpZy5waWQgJiYgY29uZmlnLnBsYXRmb3JtICYmIGNvbmZpZy5wcm9kdWN0X2NvZGUpIHtcclxuICAgICAgICBfaW5zdGFuY2UgPSBuZXcgQ29kZW1hb0F1dGgoKTtcclxuICAgICAgICByZXR1cm4gX2luc3RhbmNlO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IENvZGVtYW9FcnJvcih7XHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdBdXRoIGluaXQgZmFpbC5DaGVjayBpbml0IHBhcmFtcy4nLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBDb2RlbWFvQXV0aCBvYmplY3QuIFlvdSBtdXN0IGluaXRpYWxpemUgdGhlIENvZGVtYW9BdXRoIG9iamVjdFxyXG4gKiB3aXRoIGlyaXMuYXV0aC5pbml0KCkgYmVmb3JlIGNhbGxpbmcgdGhpcyBtZXRob2QuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHJldHVybnNcclxuICovXHJcbmZ1bmN0aW9uIGdldF9hdXRoX2luc3RhbmNlKCkge1xyXG4gICAgaWYgKCFfaW5zdGFuY2UpIHtcclxuICAgICAgICB0aHJvdyBuZXcgQ29kZW1hb0Vycm9yKHtcclxuICAgICAgICAgICAgbWVzc2FnZTogJ1BsZWFzZSBydW4gaW5pdCgpIGJlZm9yZSBnZXRfYXV0aF9pbnN0YW5jZSgpLicsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX2luc3RhbmNlO1xyXG59XHJcbnZhciByZXRyaWVzX3doZW5fZ290X3Rva2VuX2VyciA9IDI7XHJcbnZhciBDb2RlbWFvQXV0aCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIENvZGVtYW9BdXRoKCkge1xyXG4gICAgICAgIHRoaXMucmVxdWVzdCA9IG5ldyBDb2RlbWFvUmVxdWVzdCh7XHJcbiAgICAgICAgICAgIHB1YmxpY19oZWFkZXJzOiBfX2Fzc2lnbih7ICdQcm9kdWN0LUNvZGUnOiBjb25maWcucHJvZHVjdF9jb2RlLCAnUGxhdGZvcm0nOiBjb25maWcucGxhdGZvcm0gfSwgUFVCTElDX0hFQURFUlMpLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudG9rZW4gPSBuZXcgQ29kZW1hb1Rva2VuKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIERpc3BhdGNoIGEgcmVxdWVzdCB3aXRoIG9wdGlvbnMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG9wdGlvbnNcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHt9Pn1cclxuICAgICAqL1xyXG4gICAgQ29kZW1hb0F1dGgucHJvdG90eXBlLmRpc3BhdGNoX3JlcXVlc3QgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIF9hLCBfYjtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEob3B0aW9ucy53aXRoX3Rva2VuICYmIGluaXRQYXJhbXMuYXV0aF92ZXJzaW9uKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgMl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuaGVhZGVycyA9IG9wdGlvbnMuaGVhZGVycyB8fCB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2EgPSBvcHRpb25zLmhlYWRlcnM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iID0gJ0F1dGhvcml6YXRpb24nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnRva2VuLmdldF9hY2Nlc3MoKV07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYVtfYl0gPSBfYy5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXRyeV93aGVuX3Rva2VuX2VycihyZXRyaWVzX3doZW5fZ290X3Rva2VuX2VyciwgZnVuY3Rpb24gKCkgeyByZXR1cm4gX19hd2FpdGVyKF90aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkgeyByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHRoaXMucmVxdWVzdC5kaXNwYXRjaF9yZXF1ZXN0KG9wdGlvbnMpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pOyB9KTsgfSldO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHRoaXMucmVxdWVzdC5kaXNwYXRjaF9yZXF1ZXN0KG9wdGlvbnMpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiDlj5HpgIHms6jlhozpqozor4HnoIFcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcGhvbmVfbnVtYmVyXHJcbiAgICAgKiBAcGFyYW0gdGlja2V0XHJcbiAgICAgKiBAcGFyYW0gcGlkXHJcbiAgICAgKi9cclxuICAgIENvZGVtYW9BdXRoLnByb3RvdHlwZS5yZWdpc3Rlcl9zZW5kX2NhcHRjaGEgPSBmdW5jdGlvbiAocGhvbmVfbnVtYmVyLCB0aWNrZXQsIHBpZCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgICAgICAgICAgY2hlY2tfcGhvbmVfbnVtYmVyKHBob25lX251bWJlcik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgdGhpcy5kaXNwYXRjaF9yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBBcGkuUkVHSVNURVJfU0VORF9DQVBUQ0hBLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGhvbmVfbnVtYmVyOiBwaG9uZV9udW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHBpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1gtQ2FwdGNoYS1UaWNrZXQnOiB0aWNrZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSldO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIOeUqOaIt+azqOWGjFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBvcHRpb25zXHJcbiAgICAgKiBAcGFyYW0gc3BlY2lmaWNfcGlkIOWPr+mAieWPguaVsO+8jOS7peeJueWumueahHBpZOi/m+ihjOi/measoeivt+axglxyXG4gICAgICovXHJcbiAgICBDb2RlbWFvQXV0aC5wcm90b3R5cGUucmVnaXN0ZXIgPSBmdW5jdGlvbiAob3B0aW9ucywgc3BlY2lmaWNfcGlkKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcGlkLCByZWdpc3Rlcl9yZXM7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrX2lucHV0X3BhcmFtcyhvcHRpb25zLCBbJ3Bob25lX251bWJlcicsICdjYXB0Y2hhJywgJ3Bhc3N3b3JkJ10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja19yZWdpc3Rlcl9vcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQgPSBzcGVjaWZpY19waWQgfHwgY29uZmlnLnBpZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5kaXNwYXRjaF9yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IEFwaS5SRUdJU1RFUixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgb3B0aW9ucyksIHsgcGlkOiBwaWQgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNfbmV3X3Rva2VuOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSldO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJfcmVzID0gX2Euc2VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVnaXN0ZXJfcmVzLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRva2VuLnNldChyZWdpc3Rlcl9yZXMuZGF0YS5hdXRoLnRva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVnaXN0ZXJfcmVzXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiDlj5HpgIHnmbvlvZXpqozor4HnoIFcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcGhvbmVfbnVtYmVyXHJcbiAgICAgKiBAcGFyYW0gdGlja2V0XHJcbiAgICAgKiBAcGFyYW0gcGlkXHJcbiAgICAgKi9cclxuICAgIENvZGVtYW9BdXRoLnByb3RvdHlwZS5sb2dpbl9jYXB0Y2hhID0gZnVuY3Rpb24gKHBob25lX251bWJlciwgdGlja2V0LCBwaWQpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIGNoZWNrX3Bob25lX251bWJlcihwaG9uZV9udW1iZXIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHRoaXMuZGlzcGF0Y2hfcmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogQXBpLkxPR0lOX0NBUFRDSEEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaG9uZV9udW1iZXI6IHBob25lX251bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogcGlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnWC1DYXB0Y2hhLVRpY2tldCc6IHRpY2tldCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB9KV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICog5omL5py655m75b2VXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHBob25lX251bWJlclxyXG4gICAgICogQHBhcmFtIGNhcHRjaGFcclxuICAgICAqIEBwYXJhbSBzcGVjaWZpY19waWQg5Y+v6YCJ5Y+C5pWw77yM5Lul54m55a6a55qEcGlk6L+b6KGM6L+Z5qyh6K+35rGCXHJcbiAgICAgKi9cclxuICAgIENvZGVtYW9BdXRoLnByb3RvdHlwZS5sb2dpbl9waG9uZSA9IGZ1bmN0aW9uIChwaG9uZV9udW1iZXIsIGNhcHRjaGEsIHNwZWNpZmljX3BpZCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHBpZCwgbG9naW5fcmVzO1xyXG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja19waG9uZV9udW1iZXIocGhvbmVfbnVtYmVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfY2FwdGNoYShjYXB0Y2hhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGlkID0gc3BlY2lmaWNfcGlkIHx8IGNvbmZpZy5waWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuZGlzcGF0Y2hfcmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBBcGkuTE9HSU5fUEhPTkUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaG9uZV9udW1iZXI6IHBob25lX251bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FwdGNoYTogY2FwdGNoYSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBwaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc19uZXdfdG9rZW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KV07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dpbl9yZXMgPSBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2dpbl9yZXMuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9rZW4uc2V0KGxvZ2luX3Jlcy5kYXRhLmF1dGgudG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBsb2dpbl9yZXNdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIOi0puWPt+eZu+W9lVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBpZGVudGl0eVxyXG4gICAgICogQHBhcmFtIHBhc3N3b3JkXHJcbiAgICAgKiBAcGFyYW0gc3BlY2lmaWNfcGlkIOWPr+mAieWPguaVsO+8jOS7peeJueWumueahHBpZOi/m+ihjOi/measoeivt+axglxyXG4gICAgICovXHJcbiAgICBDb2RlbWFvQXV0aC5wcm90b3R5cGUubG9naW5fYWNjb3VudCA9IGZ1bmN0aW9uIChpZGVudGl0eSwgcGFzc3dvcmQsIHNwZWNpZmljX3BpZCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHBpZCwgbG9naW5fcmVzO1xyXG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQgPSBzcGVjaWZpY19waWQgfHwgY29uZmlnLnBpZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5kaXNwYXRjaF9yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IEFwaS5MT0dJTl9BQ0NPVU5ULFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRlbnRpdHk6IGlkZW50aXR5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogcGlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNfbmV3X3Rva2VuOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSldO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5fcmVzID0gX2Euc2VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9naW5fcmVzLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRva2VuLnNldChsb2dpbl9yZXMuZGF0YS5hdXRoLnRva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgbG9naW5fcmVzXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiDlvq7kv6HnvZHpobXnq6/nmbvlvZVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY29kZVxyXG4gICAgICogQHBhcmFtIHNwZWNpZmljX3BpZCDlj6/pgInlj4LmlbDvvIzku6XnibnlrprnmoRwaWTov5vooYzov5nmrKHor7fmsYJcclxuICAgICAqIEBwYXJhbSBhcHBpZCDlj6/pgIks5LiN5Lyg6buY6K6k5byA5pS+5bmz5Y+w572R6aG15bqU55So55m75b2VLCDkuZ/lj6/kvKDnvJbnqIvnjKvkuIvlkITlhazkvJflj7dhcHBpZO+8jOmcgOiBlOezu+WQjuerr+i0puWPt+i0n+i0o+S6uumFjee9rlxyXG4gICAgICovXHJcbiAgICBDb2RlbWFvQXV0aC5wcm90b3R5cGUubG9naW5fd2VjaGF0ID0gZnVuY3Rpb24gKGNvZGUsIHNwZWNpZmljX3BpZCwgYXBwaWQpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwaWQsIGxvZ2luX3JlcztcclxuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGlkID0gc3BlY2lmaWNfcGlkIHx8IGNvbmZpZy5waWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuZGlzcGF0Y2hfcmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBBcGkuTE9HSU5fV0VDSEFULFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogY29kZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBwaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcGlkOiBhcHBpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzX25ld190b2tlbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luX3JlcyA9IF9hLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvZ2luX3Jlcy5zdGF0dXMgPT09IDIwMCAmJiBsb2dpbl9yZXMuZGF0YS5hdXRoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRva2VuLnNldChsb2dpbl9yZXMuZGF0YS5hdXRoLnRva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgbG9naW5fcmVzXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBRUee9kemhteerr+eZu+W9lVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjb2RlXHJcbiAgICAgKiBAcGFyYW0gc3BlY2lmaWNfcGlkIOWPr+mAieWPguaVsO+8jOS7peeJueWumueahHBpZOi/m+ihjOi/measoeivt+axglxyXG4gICAgICovXHJcbiAgICBDb2RlbWFvQXV0aC5wcm90b3R5cGUubG9naW5fcXEgPSBmdW5jdGlvbiAoY29kZSwgc3BlY2lmaWNfcGlkKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcGlkLCBsb2dpbl9yZXM7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZCA9IHNwZWNpZmljX3BpZCB8fCBjb25maWcucGlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmRpc3BhdGNoX3JlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogQXBpLkxPR0lOX1FRLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogY29kZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBwaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc19uZXdfdG9rZW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KV07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dpbl9yZXMgPSBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2dpbl9yZXMuc3RhdHVzID09PSAyMDAgJiYgbG9naW5fcmVzLmRhdGEuYXV0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b2tlbi5zZXQobG9naW5fcmVzLmRhdGEuYXV0aC50b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGxvZ2luX3Jlc107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICog5Y+R6YCB56ys5LiJ5pa557uR5a6a5omL5py66aqM6K+B56CBXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHBob25lX251bWJlclxyXG4gICAgICogQHBhcmFtIG9hdXRoX3RpY2tldFxyXG4gICAgICovXHJcbiAgICBDb2RlbWFvQXV0aC5wcm90b3R5cGUuYmluZF9waG9uZV9mb3JfdGhpcmRfcGFydHkgPSBmdW5jdGlvbiAocGhvbmVfbnVtYmVyLCBvYXV0aF90aWNrZXQpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIGNoZWNrX3Bob25lX251bWJlcihwaG9uZV9udW1iZXIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHRoaXMuZGlzcGF0Y2hfcmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogQXBpLkJJTkRfUEhPTkVfRk9SX1RISVJEX1BBUlRZLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGhvbmVfbnVtYmVyOiBwaG9uZV9udW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYXV0aF90aWNrZXQ6IG9hdXRoX3RpY2tldCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB9KV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICog56ys5LiJ5pa555m75b2V77yI5r+A5rS777yJXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHRpY2tldFxyXG4gICAgICogQHBhcmFtIGNhcHRjaGFcclxuICAgICAqL1xyXG4gICAgQ29kZW1hb0F1dGgucHJvdG90eXBlLmNyZWF0ZV91c2VyX2Zvcl90aGlyZF9wYXJ0eSA9IGZ1bmN0aW9uIChvYXV0aF90aWNrZXQsIGNhcHRjaGEpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBsb2dpbl9yZXM7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYXB0Y2hhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja19jYXB0Y2hhKGNhcHRjaGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuZGlzcGF0Y2hfcmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBBcGkuQ1JFQVRFX1VTRVJfRk9SX1RISVJEX1BBUlRZLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGNhcHRjaGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYXV0aF90aWNrZXQ6IG9hdXRoX3RpY2tldCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhcHRjaGE6IGNhcHRjaGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYXV0aF90aWNrZXQ6IG9hdXRoX3RpY2tldCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc19uZXdfdG9rZW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KV07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dpbl9yZXMgPSBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2dpbl9yZXMuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9rZW4uc2V0KGxvZ2luX3Jlcy5kYXRhLmF1dGgudG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBsb2dpbl9yZXNdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIOmAgOWHuueZu+W9lVxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgQ29kZW1hb0F1dGgucHJvdG90eXBlLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciByZXM7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuZGlzcGF0Y2hfcmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IEFwaS5MT0dPVVQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWZyZXNoX3Rva2VuOiB0aGlzLnRva2VuLmdldF9yZWZyZXNoKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2l0aF90b2tlbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSldO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gX2Euc2VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRva2VuLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICog5Y+R6YCB57uR5a6a5omL5py66aqM6K+B56CBXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHBob25lX251bWJlclxyXG4gICAgICogQHBhcmFtIHBpZFxyXG4gICAgICovXHJcbiAgICBDb2RlbWFvQXV0aC5wcm90b3R5cGUuYmluZF9waG9uZV9jYXB0Y2hhID0gZnVuY3Rpb24gKHBob25lX251bWJlciwgdGlja2V0LCBwaWQpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIGNoZWNrX3Bob25lX251bWJlcihwaG9uZV9udW1iZXIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHRoaXMuZGlzcGF0Y2hfcmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogQXBpLkJJTkRfUEhPTkVfQ0FQVENIQSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBob25lX251bWJlcjogcGhvbmVfbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBwaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdYLUNhcHRjaGEtVGlja2V0JzogdGlja2V0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aXRoX3Rva2VuOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiDnu5HlrprmiYvmnLpcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcGhvbmVfbnVtYmVyXHJcbiAgICAgKiBAcGFyYW0gY2FwdGNoYVxyXG4gICAgICovXHJcbiAgICBDb2RlbWFvQXV0aC5wcm90b3R5cGUuYmluZF9waG9uZSA9IGZ1bmN0aW9uIChwaG9uZV9udW1iZXIsIGNhcHRjaGEpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIGNoZWNrX3Bob25lX251bWJlcihwaG9uZV9udW1iZXIpO1xyXG4gICAgICAgICAgICAgICAgY2hlY2tfY2FwdGNoYShjYXB0Y2hhKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCB0aGlzLmRpc3BhdGNoX3JlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IEFwaS5CSU5EX1BIT05FLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdwYXRjaCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBob25lX251bWJlcjogcGhvbmVfbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FwdGNoYTogY2FwdGNoYSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2l0aF90b2tlbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB9KV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICog5qOA5rWL6L6T5YWl5omL5py65piv5ZCm5b2T5YmN57uR5a6a5omL5py6XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHBob25lX251bWJlclxyXG4gICAgICovXHJcbiAgICBDb2RlbWFvQXV0aC5wcm90b3R5cGUuYmluZF9waG9uZV9jaGVjayA9IGZ1bmN0aW9uIChwaG9uZV9udW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIGNoZWNrX3Bob25lX251bWJlcihwaG9uZV9udW1iZXIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHRoaXMuZGlzcGF0Y2hfcmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogQXBpLkJJTkRfUEhPTkVfQ0hFQ0ssXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ2dldCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGhvbmVfbnVtYmVyOiBwaG9uZV9udW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpdGhfdG9rZW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgfSldO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIOWPkemAgeabtOaWsOe7keWumuaJi+acuueahOmqjOivgeeggVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBwaG9uZV9udW1iZXJcclxuICAgICAqIEBwYXJhbSBvbGRfcGhvbmVfbnVtYmVyXHJcbiAgICAgKiBAcGFyYW0gcGlkXHJcbiAgICAgKi9cclxuICAgIENvZGVtYW9BdXRoLnByb3RvdHlwZS5yZWJpbmRfcGhvbmVfY2FwdGNoYSA9IGZ1bmN0aW9uIChwaG9uZV9udW1iZXIsIG9sZF9waG9uZV9udW1iZXIsIHBpZCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgICAgICAgICAgY2hlY2tfcGhvbmVfbnVtYmVyKHBob25lX251bWJlcik7XHJcbiAgICAgICAgICAgICAgICBjaGVja19waG9uZV9udW1iZXIob2xkX3Bob25lX251bWJlcik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgdGhpcy5kaXNwYXRjaF9yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBBcGkuUkVCSU5EX1BIT05FX0NBUFRDSEEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaG9uZV9udW1iZXI6IHBob25lX251bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZF9waG9uZV9udW1iZXI6IG9sZF9waG9uZV9udW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHBpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2l0aF90b2tlbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB9KV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICog5pu05paw57uR5a6a5omL5py6XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHBob25lX251bWJlclxyXG4gICAgICogQHBhcmFtIGNhcHRjaGFcclxuICAgICAqL1xyXG4gICAgQ29kZW1hb0F1dGgucHJvdG90eXBlLnJlYmluZF9waG9uZSA9IGZ1bmN0aW9uIChwaG9uZV9udW1iZXIsIGNhcHRjaGEpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIGNoZWNrX3Bob25lX251bWJlcihwaG9uZV9udW1iZXIpO1xyXG4gICAgICAgICAgICAgICAgY2hlY2tfY2FwdGNoYShjYXB0Y2hhKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCB0aGlzLmRpc3BhdGNoX3JlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IEFwaS5SRUJJTkRfUEhPTkUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ3BhdGNoJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGhvbmVfbnVtYmVyOiBwaG9uZV9udW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXB0Y2hhOiBjYXB0Y2hhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aXRoX3Rva2VuOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiDlj5HpgIHph43nva7lr4bnoIHnmoTpqozor4HnoIFcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcGhvbmVfbnVtYmVyXHJcbiAgICAgKiBAcGFyYW0gdGlja2V0XHJcbiAgICAgKiBAcGFyYW0gcGlkXHJcbiAgICAgKi9cclxuICAgIENvZGVtYW9BdXRoLnByb3RvdHlwZS5yZXNldF9wd2RfY2FwdGNoYSA9IGZ1bmN0aW9uIChwaG9uZV9udW1iZXIsIHRpY2tldCwgcGlkKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICBjaGVja19waG9uZV9udW1iZXIocGhvbmVfbnVtYmVyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCB0aGlzLmRpc3BhdGNoX3JlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IEFwaS5SRVNFVF9QV0RfQ0FQVENIQSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBob25lX251bWJlcjogcGhvbmVfbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBwaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdYLUNhcHRjaGEtVGlja2V0JzogdGlja2V0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiDmo4DmtYvlubbph43nva7lr4bnoIF0aWNrZXRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcGhvbmVfbnVtYmVyXHJcbiAgICAgKiBAcGFyYW0gY2FwdGNoYVxyXG4gICAgICovXHJcbiAgICBDb2RlbWFvQXV0aC5wcm90b3R5cGUucmVzZXRfcHdkX3Rva2VuID0gZnVuY3Rpb24gKHBob25lX251bWJlciwgY2FwdGNoYSkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgICAgICAgICAgY2hlY2tfcGhvbmVfbnVtYmVyKHBob25lX251bWJlcik7XHJcbiAgICAgICAgICAgICAgICBjaGVja19jYXB0Y2hhKGNhcHRjaGEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHRoaXMuZGlzcGF0Y2hfcmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogQXBpLlJFU0VUX1BXRF9UT0tFTixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBob25lX251bWJlcjogcGhvbmVfbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FwdGNoYTogY2FwdGNoYSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB9KV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICog6YeN572u5a+G56CBXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHRpY2tldFxyXG4gICAgICogQHBhcmFtIHB3ZFxyXG4gICAgICogQHBhcmFtIHB3ZF9jb25maXJtXHJcbiAgICAgKi9cclxuICAgIENvZGVtYW9BdXRoLnByb3RvdHlwZS5yZXNldF9wd2QgPSBmdW5jdGlvbiAodGlja2V0LCBwd2QsIHB3ZF9jb25maXJtKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdF9vcHRpb25zLCB0b2tlbiwgZXJyXzE7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrX3Bhc3N3b3JkKHB3ZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrX3Bhc3N3b3JkKHB3ZF9jb25maXJtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfaWZfcHdkX2VxdWFsc19jb25maXJtZWRfcHdkKHB3ZCwgcHdkX2NvbmZpcm0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0X29wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IEFwaS5SRVNFVF9QV0QsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdwYXRjaCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlja2V0OiB0aWNrZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHB3ZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maXJtX3Bhc3N3b3JkOiBwd2RfY29uZmlybSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc19uZXdfdG9rZW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMSwgMywgLCA0XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMudG9rZW4uZ2V0X2FjY2VzcygpXTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuID0gX2Euc2VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA0XTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycl8xID0gX2Euc2VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbiA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA0XTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuICE9PSAnJyAmJiBPYmplY3QuYXNzaWduKHJlcXVlc3Rfb3B0aW9ucywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2l0aF90b2tlbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCB0aGlzLmRpc3BhdGNoX3JlcXVlc3QocmVxdWVzdF9vcHRpb25zKV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICog6YCa55So6aqM6K+B56CB5LmL5Y+R6YCB6aqM6K+B56CBXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBob25lX251bWJlclxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRpY2tldFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBpZFxyXG4gICAgICovXHJcbiAgICBDb2RlbWFvQXV0aC5wcm90b3R5cGUuc2VuZF91bml2ZXJzYWxfY2FwdGNoYSA9IGZ1bmN0aW9uIChwaG9uZV9udW1iZXIsIHRpY2tldCwgcGlkKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICBjaGVja19waG9uZV9udW1iZXIocGhvbmVfbnVtYmVyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCB0aGlzLmRpc3BhdGNoX3JlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IEFwaS5TRU5EX1VOSVZFUlNBTF9DQVBUQ0hBLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGhvbmVfbnVtYmVyOiBwaG9uZV9udW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHBpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1gtQ2FwdGNoYS1UaWNrZXQnOiB0aWNrZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSldO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIOmAmueUqOmqjOivgeeggeS5i+agoemqjOmqjOivgeeggVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwaG9uZV9udW1iZXJcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjYXB0Y2hhXHJcbiAgICAgKi9cclxuICAgIENvZGVtYW9BdXRoLnByb3RvdHlwZS52ZXJpZnlfdW5pdmVyc2FsX2NhcHRjaGEgPSBmdW5jdGlvbiAocGhvbmVfbnVtYmVyLCBjYXB0Y2hhKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICBjaGVja19waG9uZV9udW1iZXIocGhvbmVfbnVtYmVyKTtcclxuICAgICAgICAgICAgICAgIGNoZWNrX2NhcHRjaGEoY2FwdGNoYSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgdGhpcy5kaXNwYXRjaF9yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBBcGkuVkVSSUZZX1VOSVZFUlNBTF9DQVBUQ0hBLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGhvbmVfbnVtYmVyOiBwaG9uZV9udW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXB0Y2hhOiBjYXB0Y2hhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiDlj5HpgIHnmbvlvZXpqozor4HnoIEo6Z2Z6buY5rOo5YaM54mI5pysKVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwaG9uZV9udW1iZXJcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0aWNrZXRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwaWRcclxuICAgICAqL1xyXG4gICAgQ29kZW1hb0F1dGgucHJvdG90eXBlLmxvZ2luX2NhcHRjaGFfc2lsZW5jZSA9IGZ1bmN0aW9uIChwaG9uZV9udW1iZXIsIHRpY2tldCwgcGlkKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICBjaGVja19waG9uZV9udW1iZXIocGhvbmVfbnVtYmVyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCB0aGlzLmRpc3BhdGNoX3JlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IEFwaS5MT0dJTl9DQVBUQ0hBX1NJTEVOQ0UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaG9uZV9udW1iZXI6IHBob25lX251bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogcGlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnWC1DYXB0Y2hhLVRpY2tldCc6IHRpY2tldCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB9KV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICog5omL5py655m75b2VKOmdmem7mOazqOWGjOeJiClcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGhvbmVfbnVtYmVyXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2FwdGNoYVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNwZWNpZmljX3BpZCDnibnlrprnmoRwaWRcclxuICAgICAqL1xyXG4gICAgQ29kZW1hb0F1dGgucHJvdG90eXBlLmxvZ2luX3Bob25lX3NpbGVuY2UgPSBmdW5jdGlvbiAocGhvbmVfbnVtYmVyLCBjYXB0Y2hhLCBzcGVjaWZpY19waWQpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwaWQsIGxvZ2luX3JlcztcclxuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfcGhvbmVfbnVtYmVyKHBob25lX251bWJlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrX2NhcHRjaGEoY2FwdGNoYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZCA9IHNwZWNpZmljX3BpZCB8fCBjb25maWcucGlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmRpc3BhdGNoX3JlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogQXBpLkxPR0lOX1BIT05FX1NJTEVOQ0UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaG9uZV9udW1iZXI6IHBob25lX251bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FwdGNoYTogY2FwdGNoYSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBwaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luX3JlcyA9IF9hLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvZ2luX3Jlcy5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b2tlbi5zZXQobG9naW5fcmVzLmRhdGEuYXV0aC50b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGxvZ2luX3Jlc107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIENvZGVtYW9BdXRoLnByb3RvdHlwZS5nZXRfYWNjZXNzX3Rva2VuID0gZnVuY3Rpb24gKGF1dGhvcml6YXRpb24pIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCB0aGlzLnRva2VuLmdldF9hY2Nlc3MoYXV0aG9yaXphdGlvbildO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBDb2RlbWFvQXV0aC5wcm90b3R5cGUucmVxdWVzdF93aXRoX3Rva2VuID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB0b2tlbl9vcHRpb25zO1xyXG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbl9vcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpdGhfdG9rZW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgd2l0aG91dF9iYXNlX3VybDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgdGhpcy5kaXNwYXRjaF9yZXF1ZXN0KE9iamVjdC5hc3NpZ24ob3B0aW9ucywgdG9rZW5fb3B0aW9ucykpXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiDorr7nva7nlKjmiLflkI1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdXNlcm5hbWVcclxuICAgICAqL1xyXG4gICAgQ29kZW1hb0F1dGgucHJvdG90eXBlLnNldF91c2VybmFtZSA9IGZ1bmN0aW9uICh1c2VybmFtZSkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgICAgICAgICAgY2hlY2tfdXNlcm5hbWUodXNlcm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHRoaXMuZGlzcGF0Y2hfcmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogQXBpLlNFVF9VU0VSTkFNRSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAncGF0Y2gnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpdGhfdG9rZW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgfSldO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIOiuvue9ruWIneWni+WvhueggVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBwd2RcclxuICAgICAqIEBwYXJhbSBwd2RfY29uZmlybVxyXG4gICAgICovXHJcbiAgICBDb2RlbWFvQXV0aC5wcm90b3R5cGUuaW5pdF9wYXNzd29yZCA9IGZ1bmN0aW9uIChwd2QsIHB3ZF9jb25maXJtKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICBjaGVja19wYXNzd29yZChwd2QpO1xyXG4gICAgICAgICAgICAgICAgY2hlY2tfcGFzc3dvcmQocHdkX2NvbmZpcm0pO1xyXG4gICAgICAgICAgICAgICAgY2hlY2tfaWZfcHdkX2VxdWFsc19jb25maXJtZWRfcHdkKHB3ZCwgcHdkX2NvbmZpcm0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHRoaXMuZGlzcGF0Y2hfcmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogQXBpLklOSVRfUEFTU1dPUkQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ3BhdGNoJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHB3ZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpcm1fcGFzc3dvcmQ6IHB3ZF9jb25maXJtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aXRoX3Rva2VuOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiDmm7TmlrDlr4bnoIHvvIjpgJrov4fmj5Dkvpvml6flr4bnoIHvvIlcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gb2xkX3B3ZFxyXG4gICAgICogQHBhcmFtIG5ld19wd2RcclxuICAgICAqIEBwYXJhbSBuZXdfcHdkX2NvbmZpcm1cclxuICAgICAqL1xyXG4gICAgQ29kZW1hb0F1dGgucHJvdG90eXBlLmNoYW5nZV9wd2RfYnlfb2xkID0gZnVuY3Rpb24gKG9sZF9wd2QsIG5ld19wd2QsIG5ld19wd2RfY29uZmlybSkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHJlcztcclxuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVS5jaGVja19wYXNzd29yZChvbGRfcHdkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfcGFzc3dvcmQobmV3X3B3ZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrX3Bhc3N3b3JkKG5ld19wd2RfY29uZmlybSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrX2lmX3B3ZF9lcXVhbHNfY29uZmlybWVkX3B3ZChuZXdfcHdkLCBuZXdfcHdkX2NvbmZpcm0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmRpc3BhdGNoX3JlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogQXBpLkNIQU5HRV9QV0RfQllfT0xELFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ3BhdGNoJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZF9wYXNzd29yZDogb2xkX3B3ZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IG5ld19wd2QsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpcm1fcGFzc3dvcmQ6IG5ld19wd2RfY29uZmlybSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGhfdG9rZW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KV07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXMgPSBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9rZW4uY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiDlj5HpgIHmm7TmlrDlr4bnoIHnmoTpqozor4HnoIFcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcGhvbmVfbnVtYmVyXHJcbiAgICAgKiBAcGFyYW0gcGlkXHJcbiAgICAgKi9cclxuICAgIENvZGVtYW9BdXRoLnByb3RvdHlwZS5jaGFuZ2VfcHdkX2J5X3Bob25lX2NhcHRjaGEgPSBmdW5jdGlvbiAocGhvbmVfbnVtYmVyLCBwaWQpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIGNoZWNrX3Bob25lX251bWJlcihwaG9uZV9udW1iZXIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHRoaXMuZGlzcGF0Y2hfcmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogQXBpLkNITkFHRV9QV0RfQllfUEhPTkVfQ0FQVENIQSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBob25lX251bWJlcjogcGhvbmVfbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBwaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpdGhfdG9rZW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgfSldO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIOabtOaWsOWvhuegge+8iOmAmui/h+aJi+acuu+8iVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBwaG9uZV9udW1iZXJcclxuICAgICAqIEBwYXJhbSBjYXB0Y2hhXHJcbiAgICAgKiBAcGFyYW0gcHdkXHJcbiAgICAgKi9cclxuICAgIENvZGVtYW9BdXRoLnByb3RvdHlwZS5jaGFuZ2VfcHdkX2J5X3Bob25lID0gZnVuY3Rpb24gKHBob25lX251bWJlciwgY2FwdGNoYSwgcHdkKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzO1xyXG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja19waG9uZV9udW1iZXIocGhvbmVfbnVtYmVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfY2FwdGNoYShjYXB0Y2hhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfcGFzc3dvcmQocHdkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5kaXNwYXRjaF9yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IEFwaS5DSEFOR0VfUFdEX0JZX1BIT05FLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ3BhdGNoJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBob25lX251bWJlcjogcGhvbmVfbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXB0Y2hhOiBjYXB0Y2hhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogcHdkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2l0aF90b2tlbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyA9IF9hLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b2tlbi5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIOabtOaWsOeUqOaIt+S/oeaBr1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBwcm9maWxlXHJcbiAgICAgKi9cclxuICAgIENvZGVtYW9BdXRoLnByb3RvdHlwZS5zZXRfcHJvZmlsZSA9IGZ1bmN0aW9uIChwcm9maWxlKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrX2lucHV0X3BhcmFtcyhwcm9maWxlLCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICduaWNrbmFtZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhdmF0YXJfdXJsJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Z1bGxuYW1lJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2JpcnRoZGF5JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3NleCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdxcScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tfcHJvZmlsZShwcm9maWxlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCB0aGlzLmRpc3BhdGNoX3JlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IEFwaS5TRVRfUFJPRklMRSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAncGF0Y2gnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBfX2Fzc2lnbih7fSwgcHJvZmlsZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpdGhfdG9rZW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgfSldO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIOesrOS4ieaWueacjeWKoee7keWumueKtuaAgVxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgQ29kZW1hb0F1dGgucHJvdG90eXBlLmNoZWNrX2JpbmRfZm9yX3RoaXJkX3BhcnR5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHRoaXMuZGlzcGF0Y2hfcmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogQXBpLkNIRUNLX0JJTkRfRk9SX1RISVJEX1BBUlRZLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aXRoX3Rva2VuOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiDnu5Hlrprlvq7kv6FcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY29kZSDnrKzkuInmlrnmjojmnYPlkI7kvJrlnKjlm57osIPlnLDlnYDmkLrluKZjb2Rl55qE5Y+C5pWwXHJcbiAgICAgKiBAcGFyYW0gYXBwaWQg5Y+v6YCJLOS4jeS8oOm7mOiupOW8gOaUvuW5s+WPsOe9kemhteW6lOeUqOeZu+W9lSwg5Lmf5Y+v5Lyg57yW56iL54yr5LiL5ZCE5YWs5LyX5Y+3YXBwaWTvvIzpnIDogZTns7vlkI7nq6/otKblj7fotJ/otKPkurrphY3nva5cclxuICAgICAqL1xyXG4gICAgQ29kZW1hb0F1dGgucHJvdG90eXBlLmJpbmRfd2VjaGF0ID0gZnVuY3Rpb24gKGNvZGUsIGFwcGlkKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgdGhpcy5kaXNwYXRjaF9yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBBcGkuQklORF9XRUNIQVQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBjb2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwaWQ6IGFwcGlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aXRoX3Rva2VuOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiDop6Pnu5Hlvq7kv6FcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIENvZGVtYW9BdXRoLnByb3RvdHlwZS51bmJpbmRfd2VjaGF0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHRoaXMuZGlzcGF0Y2hfcmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogQXBpLlVOQklORF9XRUNIQVQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ3BhdGNoJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2l0aF90b2tlbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB9KV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICog57uR5a6aUVFcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIENvZGVtYW9BdXRoLnByb3RvdHlwZS5iaW5kX3FxID0gZnVuY3Rpb24gKGNvZGUpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCB0aGlzLmRpc3BhdGNoX3JlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IEFwaS5CSU5EX1FRLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogY29kZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2l0aF90b2tlbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB9KV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICog6Kej57uRUVFcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIENvZGVtYW9BdXRoLnByb3RvdHlwZS51bmJpbmRfcXEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgdGhpcy5kaXNwYXRjaF9yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBBcGkuVU5CSU5EX1FRLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdwYXRjaCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpdGhfdG9rZW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgfSldO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluWfuuacrOeUqOaIt+S/oeaBr1xyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgQ29kZW1hb0F1dGgucHJvdG90eXBlLmdldF9wcm9maWxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHRoaXMuZGlzcGF0Y2hfcmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogQXBpLkdFVF9QUk9GSUxFLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aXRoX3Rva2VuOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bkuLvotKblj7fkv6Hmga/vvIjnp4Hlr4bkv6Hmga/vvIlcclxuICAgICAqL1xyXG4gICAgQ29kZW1hb0F1dGgucHJvdG90eXBlLmdldF9hdXRoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHRoaXMuZGlzcGF0Y2hfcmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogQXBpLkdFVF9BVVRILFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aXRoX3Rva2VuOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiDmnoHpqozotKblj7fnmbvlvZVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWRlbnRpdHkg55So5oi355qE5qCH6K+G77yM5pSv5oyB5Lyg55So5oi35ZCN77yM5omL5py65Y+377yMZW1haWxcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZCDnmbvlvZXlr4bnoIFcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwaWQg5Lqn5ZOB5a+55aSWaWRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhdXRoX3ZlcnNpb24gQXV0aOeJiOacrOeahOagh+ivhu+8jOeUqOS6juWFvOWuuVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRpY2tldFxyXG4gICAgICovXHJcbiAgICBDb2RlbWFvQXV0aC5wcm90b3R5cGUubG9naW5fYWNjb3VudF90aWNrZXQgPSBmdW5jdGlvbiAoaWRlbnRpdHksIHBhc3N3b3JkLCBwaWQsIHRpY2tldCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGxvZ2luX3JlcztcclxuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5kaXNwYXRjaF9yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogQXBpLkxPR0lOX0FDQ09VTlRfVElDS0VULFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRlbnRpdHk6IGlkZW50aXR5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHBpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc19uZXdfdG9rZW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1gtQ2FwdGNoYS1UaWNrZXQnOiB0aWNrZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KV07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dpbl9yZXMgPSBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2dpbl9yZXMuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9rZW4uc2V0KGxvZ2luX3Jlcy5kYXRhLmF1dGgudG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBsb2dpbl9yZXNdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gQ29kZW1hb0F1dGg7XHJcbn0oKSk7XG5cbnZhciBhdXRoID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuX19wcm90b19fOiBudWxsLFxuZ2V0IGNvbmZpZyAoKSB7IHJldHVybiBjb25maWc7IH0sXG5pbml0OiBpbml0LFxuZ2V0X2F1dGhfaW5zdGFuY2U6IGdldF9hdXRoX2luc3RhbmNlLFxuQ29kZW1hb0F1dGg6IENvZGVtYW9BdXRoXG59KTtcblxudmFyIGdldEZpbmdlclByaW50ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBnZXRIYXNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgRmluZ2VycHJpbnQyICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBGaW5nZXJwcmludDIuZ2V0KGZ1bmN0aW9uIChjb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVzID0gY29tcG9uZW50cy5tYXAoZnVuY3Rpb24gKGNvbXBvbmVudCkgeyByZXR1cm4gY29tcG9uZW50LnZhbHVlOyB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoRmluZ2VycHJpbnQyLng2NGhhc2gxMjgodmFsdWVzLmpvaW4oJycpLCAzMSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBpZiAod2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjayhnZXRIYXNoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZ2V0SGFzaCwgNTAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSldO1xyXG4gICAgfSk7XHJcbn0pOyB9O1xuXG52YXIgRklOR0VSX1BSSU5UXzIgPSAnaHR0cHM6Ly9zdGF0aWMuY29kZW1hby5jbi9pcmlzL2ZpbmdlcnByaW50Mi5taW4uanMnO1xyXG52YXIgR0VFVEVTVF9HVCA9ICdodHRwczovL3N0YXRpYy5jb2RlbWFvLmNuL2FyY2gvZ3QuanMnO1xyXG52YXIgVEVOQ0VOVF9HVCA9ICdodHRwczovL3NzbC5jYXB0Y2hhLnFxLmNvbS9UQ2FwdGNoYS5qcyc7XHJcbi8vIFRPRE8g6ZSZ6K+v5aSE55CGXHJcbnZhciBDb2RlbWFvQ2FwdGNoYSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIENvZGVtYW9DYXB0Y2hhKG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLnBpZCA9IG9wdGlvbnMucGlkO1xyXG4gICAgfVxyXG4gICAgLy8g5LuO5pyN5Yqh56uv56Gu5a6a55So5ZOq5Liq6aqM6K+B56CB5pyN5Yqh5ZWGXHJcbiAgICBDb2RlbWFvQ2FwdGNoYS5wcm90b3R5cGUuZ2V0X3J1bGVfZnJvbV9zZXJ2ZXIgPSBmdW5jdGlvbiAoaWRlbnRpdHkpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBkZXZpY2VJZCwgdGltZXN0YW1wLCByZXM7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sIGxvYWRfc2NyaXB0KEZJTkdFUl9QUklOVF8yLCAnZmluZ2VyLXByaW50JywgMTApXTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgZ2V0RmluZ2VyUHJpbnQoKV07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VJZCA9IF9hLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wID0gXCJcIiArIG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgUGxhdGZvcm1BcGkuZGlzcGF0Y2hfcmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBQTEFURk9STV9DQVBUQ0hBX0FQSS5HRVRfUlVMRSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkZW50aXR5OiBpZGVudGl0eSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBpbml0UGFyYW1zLnBpZCB8fCB0aGlzLnBpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlSWQ6IGRldmljZUlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IHBhcnNlSW50KHRpbWVzdGFtcCwgMTApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KV07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXMgPSBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXMuZGF0YV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIENvZGVtYW9DYXB0Y2hhLnByb3RvdHlwZS5nZXRfY2FwdGNoYSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzLCBydWxlLCBhcHBpZCwgdGlja2V0LCBkb21faWQsIHN1Y2Nlc3NfY2FsbGJhY2ssIGZhaWxfY2FsbGJhY2ssIGNsb3NlX2NhbGxiYWNrLCBnZWV0ZXN0X2luaXRfb3B0aW9ucywgZGlzYWJsZUNhcHRjaGE7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuZ2V0X3J1bGVfZnJvbV9zZXJ2ZXIob3B0aW9ucy5pZGVudGl0eSldO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gX2Euc2VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBydWxlID0gcmVzLnJ1bGUsIGFwcGlkID0gcmVzLmFwcGlkLCB0aWNrZXQgPSByZXMudGlja2V0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9tX2lkID0gb3B0aW9ucy5kb21faWQsIHN1Y2Nlc3NfY2FsbGJhY2sgPSBvcHRpb25zLnN1Y2Nlc3NfY2FsbGJhY2ssIGZhaWxfY2FsbGJhY2sgPSBvcHRpb25zLmZhaWxfY2FsbGJhY2ssIGNsb3NlX2NhbGxiYWNrID0gb3B0aW9ucy5jbG9zZV9jYWxsYmFjaywgZ2VldGVzdF9pbml0X29wdGlvbnMgPSBvcHRpb25zLmdlZXRlc3RfaW5pdF9vcHRpb25zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChydWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnR0VFVEVTVCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdldCB0aWNrZXQgd2l0aCBHZWV0ZXN0LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnZWV0ZXN0IOa7keWKqFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXBwaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBuZXcgR2VldGVzdENhcHRjaGEoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBhcHBpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9tX2lkOiBkb21faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NfY2FsbGJhY2s6IHN1Y2Nlc3NfY2FsbGJhY2ssXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWxfY2FsbGJhY2s6IGZhaWxfY2FsbGJhY2ssXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlX2NhbGxiYWNrOiBjbG9zZV9jYWxsYmFjayxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdF9vcHRpb25zOiBnZWV0ZXN0X2luaXRfb3B0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnVEVOQ0VOVCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdldCB0aWNrZXQgd2l0aCB0ZW5jZW50LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXBwaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBuZXcgQ21UZW5jZW50Q2FwdGNoYSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3RfaWQ6IGFwcGlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb21faWQ6IGRvbV9pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc19jYWxsYmFjazogc3VjY2Vzc19jYWxsYmFjayxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFpbF9jYWxsYmFjazogZmFpbF9jYWxsYmFjayxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VfY2FsbGJhY2s6IGNsb3NlX2NhbGxiYWNrLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdERUZBVUxUJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZUNhcHRjaGEgPSBuZXcgRGlzYWJsZUNhcHRjaGEodGlja2V0LCBzdWNjZXNzX2NhbGxiYWNrLCBmYWlsX2NhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGRpc2FibGVDYXB0Y2hhXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBDb2RlbWFvQ2FwdGNoYTtcclxufSgpKTtcclxudmFyIEdlZXRlc3RDYXB0Y2hhID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gR2VldGVzdENhcHRjaGEob3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdF9pbml0X29wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHByb2R1Y3Q6ICdiaW5kJyxcclxuICAgICAgICAgICAgd2lkdGg6ICczMDBweCcsXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnByb2R1Y3RfaWQgPSBvcHRpb25zLnByb2R1Y3RfaWQ7XHJcbiAgICAgICAgdGhpcy5kb21faWQgPSBvcHRpb25zLmRvbV9pZDtcclxuICAgICAgICB0aGlzLnN1Y2Nlc3NfY2FsbGJhY2sgPSBvcHRpb25zLnN1Y2Nlc3NfY2FsbGJhY2s7XHJcbiAgICAgICAgdGhpcy5pbml0X29wdGlvbnMgPSBvcHRpb25zLmluaXRfb3B0aW9ucztcclxuICAgICAgICB0aGlzLmZhaWxfY2FsbGJhY2sgPSBvcHRpb25zLmZhaWxfY2FsbGJhY2s7XHJcbiAgICAgICAgdGhpcy5jbG9zZV9jYWxsYmFjayA9IG9wdGlvbnMuY2xvc2VfY2FsbGJhY2s7XHJcbiAgICB9XHJcbiAgICBHZWV0ZXN0Q2FwdGNoYS5wcm90b3R5cGUuZ2V0X2luaXRfcGFyYW1zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIFBsYXRmb3JtQXBpLmRpc3BhdGNoX3JlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IFBMQVRGT1JNX0NBUFRDSEFfQVBJLkdFVF9HRUVURVNUX1BBUkFNUyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcGlkOiB0aGlzLnByb2R1Y3RfaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSldO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBHZWV0ZXN0Q2FwdGNoYS5wcm90b3R5cGUuaW5pdF9nZWV0ZXN0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbXMsIGRhdGE7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sIHJldHJ5KDMsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIF9fYXdhaXRlcihfdGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHRoaXMuZ2V0X2luaXRfcGFyYW1zKCldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTsgfSk7IH0pXTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcyA9IF9hLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHBhcmFtcy5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRHZWV0ZXN0KF9fYXNzaWduKHsgZ3Q6IGRhdGEuZ3QsIGNoYWxsZW5nZTogZGF0YS5jaGFsbGVuZ2UsIG9mZmxpbmU6ICFkYXRhLnN1Y2Nlc3MsIG5ld19jYXB0Y2hhOiBkYXRhLm5ld19jYXB0Y2hhIH0sIG9wdGlvbnMpLCBmdW5jdGlvbiAoY2FwdGNoYV9vYmopIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FwdGNoYV9vYmpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vblJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY2FwdGNoYV9vYmopO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uU3VjY2VzcyhmdW5jdGlvbiAoKSB7IHJldHVybiBfX2F3YWl0ZXIoX3RoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGlja2V0X3JlcywgZXJyb3JfMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMCwgMiwgLCAzXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmdldF90aWNrZXQoKV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpY2tldF9yZXMgPSBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN1Y2Nlc3NfY2FsbGJhY2sodGlja2V0X3Jlcy5kYXRhLnRpY2tldCwgdGhpcy5wcm9kdWN0X2lkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDNdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcl8xID0gX2Euc2VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWlsX2NhbGxiYWNrICYmIHRoaXMuZmFpbF9jYWxsYmFjayhlcnJvcl8xKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDNdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDM6IHJldHVybiBbMiAvKnJldHVybiovXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7IH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25FcnJvcihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX3RoaXMuZmFpbF9jYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmZhaWxfY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignR290IGVycm9yIGluIEdlZXRlc3QgY2FwdGNoYS4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkub25DbG9zZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIV90aGlzLmNhcHRjaGFfb2JqLmdldFZhbGlkYXRlKCkgJiYgX3RoaXMuY2xvc2VfY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5jbG9zZV9jYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgR2VldGVzdENhcHRjaGEucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgaW5pdF9vcHRpb25zLCBfYTtcclxuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYikge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYi5sYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdF9vcHRpb25zID0gdGhpcy5pbml0X29wdGlvbnMgfHwgdGhpcy5kZWZhdWx0X2luaXRfb3B0aW9ucztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbG9hZF9zY3JpcHQoR0VFVEVTVF9HVCwgJ2dlZXRlc3QtY2FwdGNoYScpXTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2EgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmluaXRfZ2VldGVzdChpbml0X29wdGlvbnMpXTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmNhcHRjaGFfb2JqID0gX2Iuc2VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIEdlZXRlc3RDYXB0Y2hhLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIFNob3cgdGhlIGNhcHRjaGEuXHJcbiAgICAgICAgaWYgKHRoaXMuaW5pdF9vcHRpb25zICYmIHRoaXMuaW5pdF9vcHRpb25zLnByb2R1Y3QgIT09ICdiaW5kJykge1xyXG4gICAgICAgICAgICB0aGlzLmNhcHRjaGFfb2JqLmFwcGVuZFRvKFwiI1wiICsgdGhpcy5kb21faWQpO1xyXG4gICAgICAgICAgICAvLyBXaGVuIHByb2R1Y3QgaXMgJ2JpbmQnLCBpdCBuZWVkIHRvIHVzZSB2ZXJpZnkoKSB0byBzaG93IHRoZSBjYXB0Y2hhLlxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNhcHRjaGFfb2JqLnZlcmlmeSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBHZWV0ZXN0Q2FwdGNoYS5wcm90b3R5cGUuZ2V0X3RpY2tldCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQ7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuY2FwdGNoYV9vYmouZ2V0VmFsaWRhdGUoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBQbGF0Zm9ybUFwaS5kaXNwYXRjaF9yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBQTEFURk9STV9DQVBUQ0hBX0FQSS5DSEVDS19BTkRfR0VUX0dFRVRFU1RfVElDS0VULFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VldGVzdF9jaGFsbGVuZ2U6IHJlc3VsdC5nZWV0ZXN0X2NoYWxsZW5nZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlZXRlc3RfdmFsaWRhdGU6IHJlc3VsdC5nZWV0ZXN0X3ZhbGlkYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VldGVzdF9zZWNjb2RlOiByZXN1bHQuZ2VldGVzdF9zZWNjb2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwaWQ6IHRoaXMucHJvZHVjdF9pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB9KV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBHZWV0ZXN0Q2FwdGNoYTtcclxufSgpKTtcclxudmFyIENtVGVuY2VudENhcHRjaGEgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBDbVRlbmNlbnRDYXB0Y2hhKG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLnByb2R1Y3RfaWQgPSBvcHRpb25zLnByb2R1Y3RfaWQ7XHJcbiAgICAgICAgdGhpcy5kb21faWQgPSBvcHRpb25zLmRvbV9pZDtcclxuICAgICAgICB0aGlzLnN1Y2Nlc3NfY2FsbGJhY2sgPSBvcHRpb25zLnN1Y2Nlc3NfY2FsbGJhY2s7XHJcbiAgICAgICAgdGhpcy5mYWlsX2NhbGxiYWNrID0gb3B0aW9ucy5mYWlsX2NhbGxiYWNrO1xyXG4gICAgICAgIHRoaXMuY2xvc2VfY2FsbGJhY2sgPSBvcHRpb25zLmNsb3NlX2NhbGxiYWNrO1xyXG4gICAgICAgIHRoaXMucmVxdWVzdCA9IG5ldyBDb2RlbWFvUmVxdWVzdCgpO1xyXG4gICAgfVxyXG4gICAgQ21UZW5jZW50Q2FwdGNoYS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHR5cGVvZiBUZW5jZW50Q2FwdGNoYSA9PT0gJ3VuZGVmaW5lZCcpKSByZXR1cm4gWzMgLypicmVhayovLCAyXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbG9hZF9zY3JpcHQoVEVOQ0VOVF9HVCwgJ1RFTkNFTlRfR1QnKV07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMjtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6IHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuaW5pdFRlbmNlbnRDYXB0Y2hhKHRoaXMuZG9tX2lkKV07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgQ21UZW5jZW50Q2FwdGNoYS5wcm90b3R5cGUuaW5pdFRlbmNlbnRDYXB0Y2hhID0gZnVuY3Rpb24gKGRvbV9pZCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRlbmNlbnRDYXB0Y2hhQ2FsbGJhY2s7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIHRlbmNlbnRDYXB0Y2hhQ2FsbGJhY2sgPSBmdW5jdGlvbiAocmVzKSB7IHJldHVybiBfX2F3YWl0ZXIoX3RoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpY2tldF9yZXMsIGVycm9yXzI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEocmVzLnJldCA9PT0gMCkpIHJldHVybiBbMyAvKmJyZWFrKi8sIDVdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzEsIDMsICwgNF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuZ2V0X3RpY2tldChyZXMudGlja2V0LCByZXMucmFuZHN0cildO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpY2tldF9yZXMgPSBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWNjZXNzX2NhbGxiYWNrKHRpY2tldF9yZXMuZGF0YS50aWNrZXQsIHRoaXMucHJvZHVjdF9pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JfMiA9IF9hLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZhaWxfY2FsbGJhY2sgJiYgdGhpcy5mYWlsX2NhbGxiYWNrKGVycm9yXzIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDRdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzMgLypicmVhayovLCA2XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnJldCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5mYWlsX2NhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZhaWxfY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChyZXMucmV0ID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3NlX2NhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlX2NhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSA2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2OiByZXR1cm4gWzIgLypyZXR1cm4qL107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pOyB9O1xyXG4gICAgICAgICAgICAgICAgaWYgKGRvbV9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FwdGNoYV9vYmogPSBuZXcgVGVuY2VudENhcHRjaGEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tX2lkKSwgdGhpcy5wcm9kdWN0X2lkLCB0ZW5jZW50Q2FwdGNoYUNhbGxiYWNrLCB7fSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhcHRjaGFfb2JqID0gbmV3IFRlbmNlbnRDYXB0Y2hhKHRoaXMucHJvZHVjdF9pZCwgdGVuY2VudENhcHRjaGFDYWxsYmFjaywge30pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBDbVRlbmNlbnRDYXB0Y2hhLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY2FwdGNoYV9vYmouc2hvdygpO1xyXG4gICAgfTtcclxuICAgIENtVGVuY2VudENhcHRjaGEucHJvdG90eXBlLmdldF90aWNrZXQgPSBmdW5jdGlvbiAodGlja2V0LCByYW5kc3RyKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgUGxhdGZvcm1BcGkuZGlzcGF0Y2hfcmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogUExBVEZPUk1fQ0FQVENIQV9BUEkuQ0hFQ0tfQU5EX0dFVF9URU5DRU5UX1RJQ0tFVCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcGlkOiB0aGlzLnByb2R1Y3RfaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5jZW50VGlja2V0OiB0aWNrZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYW5kb21TdHI6IHJhbmRzdHIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSldO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gQ21UZW5jZW50Q2FwdGNoYTtcclxufSgpKTtcclxudmFyIERpc2FibGVDYXB0Y2hhID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gRGlzYWJsZUNhcHRjaGEodGlja2V0LCBzdWNjZXNzX2NhbGxiYWNrLCBmYWlsX2NhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy50aWNrZXQgPSB0aWNrZXQ7XHJcbiAgICAgICAgdGhpcy5zdWNjZXNzX2NhbGxiYWNrID0gc3VjY2Vzc19jYWxsYmFjaztcclxuICAgICAgICB0aGlzLmZhaWxfY2FsbGJhY2sgPSBmYWlsX2NhbGxiYWNrO1xyXG4gICAgfVxyXG4gICAgRGlzYWJsZUNhcHRjaGEucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRGlzYWJsZUNhcHRjaGEgaW5pdCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBEaXNhYmxlQ2FwdGNoYS5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy50aWNrZXQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdWNjZXNzX2NhbGxiYWNrKHRoaXMudGlja2V0LCAnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5mYWlsX2NhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZhaWxfY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gRGlzYWJsZUNhcHRjaGE7XHJcbn0oKSk7XG5cbnZhciBjYXB0Y2hhID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuX19wcm90b19fOiBudWxsLFxuQ29kZW1hb0NhcHRjaGE6IENvZGVtYW9DYXB0Y2hhLFxuR2VldGVzdENhcHRjaGE6IEdlZXRlc3RDYXB0Y2hhLFxuQ21UZW5jZW50Q2FwdGNoYTogQ21UZW5jZW50Q2FwdGNoYSxcbkRpc2FibGVDYXB0Y2hhOiBEaXNhYmxlQ2FwdGNoYVxufSk7XG5cbnZhciBjb25maWckMTtcclxudmFyIGluaXRQYXJhbXMgPSB7fTtcclxuY29uZmlnJDEgPSBjb25maWdzWydwcm9kJ107XHJcbmZ1bmN0aW9uIGluaXQkMShvcHRpb25zKSB7XHJcbiAgICB2YXIgZW52ID0gb3B0aW9ucy5lbnYsIGRvbWFpbiA9IG9wdGlvbnMuZG9tYWluLCBfYSA9IG9wdGlvbnMuYXV0aF92ZXJzaW9uLCBhdXRoX3ZlcnNpb24gPSBfYSA9PT0gdm9pZCAwID8gJycgOiBfYSwgX2IgPSBvcHRpb25zLnBpZCwgcGlkID0gX2IgPT09IHZvaWQgMCA/ICcnIDogX2IsIF9jID0gb3B0aW9ucy5jbGllbnRfaWQsIGNsaWVudF9pZCA9IF9jID09PSB2b2lkIDAgPyAnJyA6IF9jLCByZXF1ZXN0VGltZW91dCA9IG9wdGlvbnMucmVxdWVzdFRpbWVvdXQ7XHJcbiAgICBpZiAoZW52KSB7XHJcbiAgICAgICAgaWYgKGNvbmZpZ3NbZW52XSkge1xyXG4gICAgICAgICAgICBjb25maWckMSA9IGNvbmZpZ3NbZW52XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlVua25vd24gZW52IFxcXCJcIiArIGVudiArIFwiXFxcIiwgY29uZmlnIGhhcyBiZWVuIHNldCB0byBkZWZhdWx0IHZhbHVlLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoZG9tYWluICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjb25maWckMS5kb21haW4gPSBkb21haW47XHJcbiAgICB9XHJcbiAgICBpbml0UGFyYW1zLmF1dGhfdmVyc2lvbiA9IGF1dGhfdmVyc2lvbjtcclxuICAgIGluaXRQYXJhbXMuY2xpZW50X2lkID0gY2xpZW50X2lkO1xyXG4gICAgaW5pdFBhcmFtcy5waWQgPSBwaWQ7XHJcbiAgICBpbml0UGFyYW1zLnJlcXVlc3RUaW1lb3V0ID0gcmVxdWVzdFRpbWVvdXQ7XHJcbn1cblxuZXhwb3J0IHsgYXBpIGFzIENvZGVtYW9BcGksIENvZGVtYW9FcnJvciwgQ29kZW1hb1JlcXVlc3QsIEVSUk9SX1RZUEUgYXMgRVJST1IsIHV0aWxzIGFzIFUsIGF1dGgsIGNhcHRjaGEsIGNvbmZpZyQxIGFzIGNvbmZpZywgaW5pdCQxIGFzIGluaXQsIGluaXRQYXJhbXMgfTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0EiLCJzb3VyY2VSb290IjoiIn0=