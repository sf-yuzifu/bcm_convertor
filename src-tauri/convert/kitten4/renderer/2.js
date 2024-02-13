(this["webpackJsonp"] = this["webpackJsonp"] || []).push([[2],{

/***/ "./node_modules/@crc/heart/build/dev_tool/assert_tool/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@crc/heart/build/dev_tool/assert_tool/index.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var type_1 = __webpack_require__(/*! ./type */ "./node_modules/@crc/heart/build/dev_tool/assert_tool/type.js");
exports.AssertType = type_1.AssertType;
function create() {
    return new TestAssertionToolImpl();
}
exports.create = create;
var TestAssertionToolImpl = /** @class */ (function () {
    function TestAssertionToolImpl() {
        this.passed = [];
        this.failed = [];
    }
    TestAssertionToolImpl.prototype.plan = function (n_tests) {
        this.planned = n_tests;
    };
    TestAssertionToolImpl.prototype.fail = function (message) {
        this.failed.push({
            type: type_1.AssertType.fail,
            message: message || 'TestBlock[fail]',
        });
    };
    TestAssertionToolImpl.prototype.pass = function (message) {
        this.passed.push({
            type: type_1.AssertType.pass,
            message: message || 'TestBlock[pass]',
        });
    };
    TestAssertionToolImpl.prototype.truthy = function (obj, message) {
        var assert = {
            type: type_1.AssertType.truthy,
            params: {
                value: obj,
            },
            message: message || '',
        };
        if (!!obj) {
            this.passed.push(assert);
        }
        else {
            assert.message = message || "TestBlock[truthy] Value is not truthy: " + obj;
            this.failed.push(assert);
        }
    };
    TestAssertionToolImpl.prototype.falsy = function (obj, message) {
        var assert = {
            type: type_1.AssertType.falsy,
            params: {
                value: obj,
            },
            message: '',
        };
        if (!obj) {
            this.passed.push(assert);
        }
        else {
            assert.message = message || "TestBlock[falsy] Value is not falsy: " + obj;
            this.failed.push(assert);
        }
    };
    TestAssertionToolImpl.prototype.is = function (value, expected, message) {
        var assert = {
            type: type_1.AssertType.is,
            params: {
                value: value,
                expected: expected,
            },
            message: message || '',
        };
        if (value === expected) {
            this.passed.push(assert);
        }
        else {
            assert.message = message || "TestBlock[is] Expected [" + expected + "] but got [" + value + "]";
            this.failed.push(assert);
        }
    };
    TestAssertionToolImpl.prototype.not = function (value, expected, message) {
        var assert = {
            type: type_1.AssertType.not,
            params: {
                value: value,
                expected: expected,
            },
            message: message || '',
        };
        if (value !== expected) {
            this.passed.push(assert);
        }
        else {
            assert.message = message || "TestBlock[not] Value is the same as: " + value;
            this.failed.push(assert);
        }
    };
    TestAssertionToolImpl.prototype.get_result = function () {
        this.update_planned_result();
        if (this.failed.length > 0) {
            return {
                success: false,
                message: this.failed.map(function (failure) { return failure.message; }).join('\n'),
            };
        }
        if (this.planned != 0 && this.passed.length === 0) {
            return {
                success: false,
                message: "Test finished with no assertion.",
            };
        }
        return {
            success: true,
            message: "Passed " + this.passed.length + " assertion" + this.get_plural_by_amt(this.passed.length) + ".",
        };
    };
    TestAssertionToolImpl.prototype.reset = function () {
        this.failed = [];
        this.passed = [];
        this.planned = undefined;
    };
    TestAssertionToolImpl.prototype.get_plural_by_amt = function (amt) {
        return (amt === 1) ? '' : 's';
    };
    TestAssertionToolImpl.prototype.update_planned_result = function () {
        if (this.planned === undefined) {
            return;
        }
        var num_of_assertion = this.failed.length + this.passed.length;
        this.is(num_of_assertion, this.planned, "Planned for " + this.planned + " assertion" + this.get_plural_by_amt(this.planned) + " but got " + num_of_assertion + ".");
    };
    return TestAssertionToolImpl;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGV2X3Rvb2wvYXNzZXJ0X3Rvb2wvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFNZ0I7QUFJZCxxQkFSQSxpQkFBVSxDQVFBO0FBTVosU0FBZ0IsTUFBTTtJQUNwQixPQUFPLElBQUkscUJBQXFCLEVBQUUsQ0FBQztBQUNyQyxDQUFDO0FBRkQsd0JBRUM7QUFFRDtJQUFBO1FBRVUsV0FBTSxHQUFZLEVBQUUsQ0FBQztRQUNyQixXQUFNLEdBQVksRUFBRSxDQUFDO0lBbUkvQixDQUFDO0lBaElRLG9DQUFJLEdBQVgsVUFBWSxPQUFjO1FBQ3hCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3pCLENBQUM7SUFFTSxvQ0FBSSxHQUFYLFVBQVksT0FBZTtRQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNmLElBQUksRUFBRSxpQkFBVSxDQUFDLElBQUk7WUFDckIsT0FBTyxFQUFFLE9BQU8sSUFBSSxpQkFBaUI7U0FDdEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLG9DQUFJLEdBQVgsVUFBWSxPQUFlO1FBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2YsSUFBSSxFQUFFLGlCQUFVLENBQUMsSUFBSTtZQUNyQixPQUFPLEVBQUUsT0FBTyxJQUFJLGlCQUFpQjtTQUN0QyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sc0NBQU0sR0FBYixVQUFjLEdBQU8sRUFBRSxPQUFlO1FBQ3BDLElBQU0sTUFBTSxHQUFHO1lBQ2IsSUFBSSxFQUFFLGlCQUFVLENBQUMsTUFBTTtZQUN2QixNQUFNLEVBQUU7Z0JBQ04sS0FBSyxFQUFFLEdBQUc7YUFDWDtZQUNELE9BQU8sRUFBRSxPQUFPLElBQUksRUFBRTtTQUN2QixDQUFDO1FBQ0YsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFO1lBQ1QsSUFBSSxDQUFD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

/***/ }),

/***/ "./node_modules/@crc/heart/build/dev_tool/assert_tool/type.js":
/*!********************************************************************!*\
  !*** ./node_modules/@crc/heart/build/dev_tool/assert_tool/type.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AssertType;
(function (AssertType) {
    AssertType[AssertType["pass"] = 0] = "pass";
    AssertType[AssertType["fail"] = 1] = "fail";
    AssertType[AssertType["truthy"] = 2] = "truthy";
    AssertType[AssertType["falsy"] = 3] = "falsy";
    AssertType[AssertType["is"] = 4] = "is";
    AssertType[AssertType["not"] = 5] = "not";
})(AssertType = exports.AssertType || (exports.AssertType = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZXZfdG9vbC9hc3NlcnRfdG9vbC90eXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsSUFBWSxVQU9YO0FBUEQsV0FBWSxVQUFVO0lBQ3BCLDJDQUFJLENBQUE7SUFDSiwyQ0FBSSxDQUFBO0lBQ0osK0NBQU0sQ0FBQTtJQUNOLDZDQUFLLENBQUE7SUFDTCx1Q0FBRSxDQUFBO0lBQ0YseUNBQUcsQ0FBQTtBQUNMLENBQUMsRUFQVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQU9yQiJ9

/***/ }),

/***/ "./node_modules/@crc/heart/build/dev_tool/test_blocks/block_config.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@crc/heart/build/dev_tool/test_blocks/block_config.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var namespace_1 = __webpack_require__(/*! ./namespace */ "./node_modules/@crc/heart/build/dev_tool/test_blocks/namespace.js");
var test_color = '#505050';
var message = {
    type: 'input_value',
    name: 'message',
    check: 'String',
    align: 'CENTRE',
};
exports.block_config = {
    plan: {
        message0: 'Plan %1 assertions',
        args0: [
            {
                type: 'input_value',
                name: 'n_planned_assertions',
                check: 'Number',
                align: 'CENTRE',
            },
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: '',
        colour: test_color,
        inputsInline: true,
    },
    fail: {
        message0: 'Fail (%1)',
        args0: [
            message,
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: '',
        colour: '#661515',
        inputsInline: true,
    },
    pass: {
        message0: 'Pass (%1)',
        args0: [
            message,
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: '',
        colour: '#156615',
        inputsInline: true,
    },
    truthy: {
        message0: 'Is truthy: %1 (%2)',
        args0: [
            {
                type: 'input_value',
                name: 'value',
            },
            message,
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: '',
        colour: test_color,
        inputsInline: true,
    },
    falsy: {
        message0: 'Is falsy: %1 (%2)',
        args0: [
            {
                type: 'input_value',
                name: 'value',
            },
            message,
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: '',
        colour: test_color,
        inputsInline: true,
    },
    is: {
        message0: 'Expect %1 to be %2 (%3)',
        args0: [
            {
                type: 'input_value',
                name: 'value',
            },
            {
                type: 'input_value',
                name: 'expected',
            },
            message,
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: '',
        colour: test_color,
        inputsInline: true,
    },
    not: {
        message0: 'Expect %1 to NOT be %2 (%3)',
        args0: [
            {
                type: 'input_value',
                name: 'value',
            },
            {
                type: 'input_value',
                name: 'expected',
            },
            message,
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: '',
        colour: test_color,
        inputsInline: true,
    },
    done: {
        message0: 'Test is done',
        args0: [],
        previousStatement: null,
        nextStatement: undefined,
        tooltip: '',
        colour: test_color,
        inputsInline: true,
    },
    bad_promise: {
        message0: 'Promise: Fail with message %1',
        args0: [
            message,
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: '',
        colour: '%{BKY_SENSING_HUE}',
        inputsInline: true,
    },
    good_promise: {
        message0: 'Promise: Return %1 in %2 milliseconds',
        args0: [
            {
                type: 'input_value',
                name: 'returns',
            },
            {
                type: 'input_value',
                name: 'milliseconds',
                check: 'Number',
                align: 'CENTRE',
            },
        ],
        previousStatement: undefined,
        nextStatement: undefined,
        tooltip: '',
        colour: '%{BKY_SENSING_HUE}',
        output: ['String'],
        inputsInline: true,
    },
    call_user_procedure: {
        message0: 'Call user procedure %1 arg one is %2',
        args0: [
            {
                type: 'input_value',
                name: 'function_id',
            },
            {
                type: 'input_value',
                name: 'argone',
            },
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: '',
        colour: '%{BKY_PROCEDURES_HUE}',
        inputsInline: true,
    },
    send_test_action: {
        message0: 'Send test action with parameter %1',
        args0: [
            {
                type: 'input_value',
                name: 'parameter_value',
            },
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: '',
        colour: '%{BKY_EVENTS_HUE}',
        inputsInline: true,
    },
    get_test_action_parameter: {
        message0: 'test action parameter',
        args0: [],
        previousStatement: undefined,
        nextStatement: undefined,
        tooltip: '',
        colour: '%{BKY_EVENTS_HUE}',
        output: ['String'],
        inputsInline: true,
    },
    on_test_action: {
        message0: 'On test action %1 %2',
        args0: [
            {
                type: 'input_dummy',
                align: 'CENTRE',
            },
            {
                type: 'input_statement',
                name: 'DO',
            },
        ],
        tooltip: '',
        colour: '%{BKY_EVENTS_HUE}',
        inputsInline: true,
    },
    create_entity_instance: {
        message0: 'Create entity instance %1',
        args0: [
            {
                type: 'input_value',
                name: 'typeclass_id',
                check: 'String',
                align: 'CENTRE',
            },
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: '',
        colour: '#156615',
        inputsInline: true,
    },
    console_log: {
        message0: 'Console log %1',
        args0: [
            message,
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: '',
        colour: '#156615',
        inputsInline: true,
    },
    pull_event_test: {
        message0: 'Pull event test %1 %2',
        args0: [
            {
                type: 'input_dummy',
                align: 'CENTRE',
            },
            {
                type: 'input_statement',
                name: 'DO',
            },
        ],
        colour: '%{BKY_EVENTS_HUE}',
        inputsInline: true,
    },
    throw_error: {
        message0: 'Throw error',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        tooltip: '',
        colour: '#661515',
        inputsInline: true,
    },
    set_test_state: {
        message0: 'Send test state %1',
        args0: [
            {
                type: 'field_dropdown',
                name: 'state',
                options: [
                    ['true', 'true'],
                    ['false', 'false'],
                ],
            },
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: '',
        colour: '%{BKY_CONTROL_HUE}',
        inputsInline: true,
    },
    get_test_state: {
        message0: 'Get test state',
        args0: [],
        tooltip: '',
        colour: '%{BKY_CONTROL_HUE}',
        output: ['Boolean'],
        inputsInline: true,
    },
    controls_if_dropdown: {
        message0: 'If %1 %2 %3 else if %4 %5 %6 else %7 %8',
        args0: [
            {
                type: 'field_dropdown',
                name: 'IF0',
                options: [
                    ['state_is_true', namespace_1.ns_id('test_state_true')],
                    ['state_is_false', namespace_1.ns_id('test_state_false')],
                ],
            },
            {
                type: 'input_dummy',
                align: 'CENTRE',
            },
            {
                type: 'input_statement',
                name: 'DO0',
            },
            {
                type: 'field_dropdown',
                name: 'IF1',
                options: [
                    ['state_is_not_true', namespace_1.ns_id('test_state_false')],
                    ['state_is_not_false', namespace_1.ns_id('test_state_true')],
                ],
            },
            {
                type: 'input_dummy',
                align: 'CENTRE',
            },
            {
                type: 'input_statement',
                name: 'DO1',
            },
            {
                type: 'input_dummy',
                align: 'CENTRE',
            },
            {
                type: 'input_statement',
                name: 'ELSE',
            },
        ],
        tooltip: '',
        previousStatement: null,
        nextStatement: null,
        colour: '%{BKY_CONTROL_HUE}',
        inputsInline: true,
    },
    controls_if_dropdown_simple: {
        message0: 'If %1 %2 %3',
        args0: [
            {
                type: 'field_dropdown',
                name: 'IF0',
                options: [
                    ['state_is_true', namespace_1.ns_id('test_state_true')],
                    ['state_is_false', namespace_1.ns_id('test_state_false')],
                ],
            },
            {
                type: 'input_dummy',
                align: 'CENTRE',
            },
            {
                type: 'input_statement',
                name: 'DO0',
            },
        ],
        tooltip: '',
        previousStatement: null,
        nextStatement: null,
        colour: '%{BKY_CONTROL_HUE}',
        inputsInline: true,
    },
    controls_if_dropdown_promise: {
        message0: 'If (promise) %1 %2 %3',
        args0: [
            {
                type: 'field_dropdown',
                name: 'IF0',
                options: [
                    ['state_is_true', namespace_1.ns_id('test_state_true_promise')],
                    ['state_is_false', namespace_1.ns_id('test_state_false_promise')],
                ],
            },
            {
                type: 'input_dummy',
                align: 'CENTRE',
            },
            {
                type: 'input_statement',
                name: 'DO0',
            },
        ],
        tooltip: '',
        previousStatement: null,
        nextStatement: null,
        colour: '%{BKY_CONTROL_HUE}',
        inputsInline: true,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvY2tfY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2Rldl90b29sL3Rlc3RfYmxvY2tzL2Jsb2NrX2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHlDQUFvQztBQUlwQyxJQUFNLFVBQVUsR0FBRyxTQUFTLENBQUM7QUFFN0IsSUFBTSxPQUFPLEdBQWtCO0lBQzdCLElBQUksRUFBRSxhQUFhO0lBQ25CLElBQUksRUFBRSxTQUFTO0lBQ2YsS0FBSyxFQUFFLFFBQVE7SUFDZixLQUFLLEVBQUUsUUFBUTtDQUNoQixDQUFDO0FBRVcsUUFBQSxZQUFZLEdBQW1CO0lBQzFDLElBQUksRUFBRTtRQUNKLFFBQVEsRUFBRSxvQkFBb0I7UUFDOUIsS0FBSyxFQUFFO1lBQ0w7Z0JBQ0UsSUFBSSxFQUFFLGFBQWE7Z0JBQ25CLElBQUksRUFBRSxzQkFBc0I7Z0JBQzVCLEtBQUssRUFBRSxRQUFRO2dCQUNmLEtBQUssRUFBRSxRQUFRO2FBQ2hCO1NBQ0Y7UUFDRCxpQkFBaUIsRUFBRSxJQUFJO1FBQ3ZCLGFBQWEsRUFBRSxJQUFJO1FBQ25CLE9BQU8sRUFBRSxFQUFFO1FBQ1gsTUFBTSxFQUFFLFVBQVU7UUFDbEIsWUFBWSxFQUFFLElBQUk7S0FDbkI7SUFFRCxJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUUsV0FBVztRQUNyQixLQUFLLEVBQUU7WUFDTCxPQUFPO1NBQ1I7UUFDRCxpQkFBaUIsRUFBRSxJQUFJO1FBQ3ZCLGFBQWEsRUFBRSxJQUFJO1FBQ25CLE9BQU8sRUFBRSxFQUFFO1FBQ1gsTUFBTSxFQUFFLFNBQVM7UUFDakIsWUFBWSxFQUFFLElBQUk7S0FDbkI7SUFFRCxJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUUsV0FBVztRQUNyQixLQUFLLEVBQUU7WUFDTCxPQUFPO1NBQ1I7UUFDRCxpQkFBaUIsRUFBRSxJQUFJO1FBQ3ZCLGFBQWEsRUFBRSxJQUFJO1FBQ25CLE9BQU8sRUFBRSxFQUFFO1FB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

/***/ }),

/***/ "./node_modules/@crc/heart/build/dev_tool/test_blocks/block_xml.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@crc/heart/build/dev_tool/test_blocks/block_xml.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var message = "\n  <value name=\"message\">\n    <shadow type=\"text\">\n      <field name=\"TEXT\"></field>\n    </shadow>\n  </value>\n";
exports.plan = "\n  <value name=\"n_planned_assertions\">\n    <shadow type=\"math_number\">\n      <field name=\"NUM\">1</field>\n    </shadow>\n  </value>\n";
exports.fail = message;
exports.pass = message;
exports.truthy = message;
exports.falsy = message;
exports.is = message;
exports.not = message;
exports.good_promise = "\n  <value name=\"returns\">\n    <shadow type=\"text\">\n      <field name=\"TEXT\">success</field>\n    </shadow>\n  </value>\n  <value name=\"milliseconds\">\n    <shadow type=\"math_number\">\n      <field name=\"NUM\">40</field>\n    </shadow>\n  </value>\n";
exports.bad_promise = message;
exports.send_test_action = "\n  <value name=\"parameter_value\">\n    <shadow type=\"text\">\n      <field name=\"TEXT\">hello</field>\n    </shadow>\n  </value>\n";
exports.console_log = message;
exports.create_entity_instance = "\n  <value name=\"typeclass_id\">\n    <shadow type=\"text\">\n      <field name=\"TEXT\">typeclassid</field>\n    </shadow>\n  </value>\n";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvY2tfeG1sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2Rldl90b29sL3Rlc3RfYmxvY2tzL2Jsb2NrX3htbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQU0sT0FBTyxHQUFHLDRIQU1mLENBQUM7QUFFVyxRQUFBLElBQUksR0FBRyxnSkFNbkIsQ0FBQztBQUVXLFFBQUEsSUFBSSxHQUFHLE9BQU8sQ0FBQztBQUNmLFFBQUEsSUFBSSxHQUFHLE9BQU8sQ0FBQztBQUNmLFFBQUEsTUFBTSxHQUFHLE9BQU8sQ0FBQztBQUNqQixRQUFBLEtBQUssR0FBRyxPQUFPLENBQUM7QUFDaEIsUUFBQSxFQUFFLEdBQUcsT0FBTyxDQUFDO0FBQ2IsUUFBQSxHQUFHLEdBQUcsT0FBTyxDQUFDO0FBRWQsUUFBQSxZQUFZLEdBQUcsd1FBVzNCLENBQUM7QUFFVyxRQUFBLFdBQVcsR0FBRyxPQUFPLENBQUM7QUFFdEIsUUFBQSxnQkFBZ0IsR0FBRyx5SUFNL0IsQ0FBQztBQUVXLFFBQUEsV0FBVyxHQUFHLE9BQU8sQ0FBQztBQUN0QixRQUFBLHNCQUFzQixHQUFHLDRJQU1yQyxDQUFDIn0=

/***/ }),

/***/ "./node_modules/@crc/heart/build/dev_tool/test_blocks/domain_functions.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@crc/heart/build/dev_tool/test_blocks/domain_functions.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var NAMESPACE = 'AUTOMATEDTESTS';
function get_domain_functions(assertion_tool, test_done_callback) {
    var n_created_entities = 0;
    var if_dropdown_state = false;
    var t = assertion_tool;
    var domain_functions = {
        plan: function (args, interpreter_id, entity_id, internals) {
            var _a;
            (_a = t) === null || _a === void 0 ? void 0 : _a.plan(args.n_planned_assertions);
        },
        fail: function (args, interpreter_id, entity_id, internals) {
            var _a;
            (_a = t) === null || _a === void 0 ? void 0 : _a.fail(args.message);
        },
        pass: function (args, interpreter_id, entity_id, internals) {
            var _a;
            (_a = t) === null || _a === void 0 ? void 0 : _a.pass(args.message);
        },
        truthy: function (args, interpreter_id, entity_id, internals) {
            var _a;
            (_a = t) === null || _a === void 0 ? void 0 : _a.truthy(args.value, args.message);
        },
        falsy: function (args, interpreter_id, entity_id, internals) {
            var _a;
            (_a = t) === null || _a === void 0 ? void 0 : _a.falsy(args.value, args.message);
        },
        is: function (args, interpreter_id, entity_id, internals) {
            var _a;
            (_a = t) === null || _a === void 0 ? void 0 : _a.is(args.value, args.expected, args.message);
        },
        not: function (args, interpreter_id, entity_id, internals) {
            var _a;
            (_a = t) === null || _a === void 0 ? void 0 : _a.not(args.value, args.expected, args.message);
        },
        done: function (args, interpreter_id, entity_id, internals) {
            test_done_callback();
        },
        bad_promise: function (args, interpreter_id, entity_id, internals) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    throw internals.create_domain_function_error({
                        native_error: new Error('Threw error on purpose.'),
                        id: 'Annotation: Threw error in bad_promise on purpose.',
                        namespace: NAMESPACE,
                    });
                });
            });
        },
        good_promise: function (args, interpreter_id, entity_id, internals) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            setTimeout(function () { return resolve(args.returns); }, args.milliseconds);
                        })];
                });
            });
        },
        call_user_procedure: function (args, interpreter_id, entity_id, internals) {
            internals.add_user_procedure_call_to_stack(args.function_id, entity_id, {
                argone: args.argone,
            });
        },
        send_test_action: function (args, interpreter_id, entity_id, internals) {
            internals.runtime_manager.send_action({
                id: 'testaction',
                namespace: 'AUTOMATEDTESTS',
                parameters: {
                    test_parameter: args.parameter_value,
                },
            });
        },
        get_test_action_parameter: function (args, interpreter_id, entity_id, internals) {
            // if accessing undefined action parameters, error would be handled by get_action_parameter()
            var param_value = internals.get_action_parameter('test_parameter');
            return param_value;
        },
        create_entity_instance: function (args, interpreter_id, entity_id, internals) {
            var typeclass_id = args.typeclass_id;
            var rm = internals.runtime_manager;
            var new_entity_id = "test_createentityinstance_" + n_created_entities;
            n_created_entities += 1;
            var res = rm.create_entity_instance(typeclass_id, new_entity_id);
            for (var i = 0; i < res.length; i++) {
                var r = res[i];
                if (r.kind == 'error') {
                    console.error(r);
                    throw new Error("Error creating entity instance.");
                }
            }
        },
        console_log: function (args, interpreter_id, entity_id, internals) {
            console.log("log: " + args.message);
        },
        pull_event_test: function (args, interpreter_id, entity_id, internals) {
            return true;
        },
        throw_error: function (args, interpreter_id, entity_id, internals) {
            throw internals.create_domain_function_error({
                native_error: new Error('Threw error on purpose.'),
                id: 'Annotation: Threw error in throw_error on purpose.',
                namespace: NAMESPACE,
            });
        },
        set_test_state: function (args, interpreter_id, entity_id, internals) {
            if_dropdown_state = args.state === 'true';
        },
        get_test_state: function (args, interpreter_id, entity_id, internals) {
            return if_dropdown_state;
        },
        test_state_true: function (args, interpreter_id, entity_id, internals) {
            return if_dropdown_state;
        },
        test_state_false: function (args, interpreter_id, entity_id, internals) {
            return !if_dropdown_state;
        },
        test_state_true_promise: function (args, interpreter_id, entity_id, internals) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, wait(66)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, if_dropdown_state];
                    }
                });
            });
        },
        test_state_false_promise: function (args, interpreter_id, entity_id, internals) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, wait(66)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, !if_dropdown_state];
                    }
                });
            });
        },
    };
    return function () { return domain_functions; };
}
exports.get_domain_functions = get_domain_functions;
function wait(ms) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    setTimeout(function () { return resolve(); }, ms);
                })];
        });
    });
}
exports.wait = wait;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluX2Z1bmN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZXZfdG9vbC90ZXN0X2Jsb2Nrcy9kb21haW5fZnVuY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLElBQU0sU0FBUyxHQUFHLGdCQUFnQixDQUFDO0FBQ25DLFNBQWdCLG9CQUFvQixDQUNoQyxjQUEwRCxFQUMxRCxrQkFBNkI7SUFHL0IsSUFBSSxrQkFBa0IsR0FBRyxDQUFDLENBQUM7SUFDM0IsSUFBSSxpQkFBaUIsR0FBRyxLQUFLLENBQUM7SUFFOUIsSUFBTSxDQUFDLEdBQUcsY0FBYyxDQUFDO0lBQ3pCLElBQU0sZ0JBQWdCLEdBQWdCO1FBQ3BDLElBQUksWUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxTQUFTOztZQUM3QyxNQUFBLENBQUMsMENBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtRQUNyQyxDQUFDO1FBRUQsSUFBSSxZQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFNBQVM7O1lBQzdDLE1BQUEsQ0FBQywwQ0FBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtRQUN4QixDQUFDO1FBRUQsSUFBSSxZQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFNBQVM7O1lBQzdDLE1BQUEsQ0FBQywwQ0FBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtRQUN4QixDQUFDO1FBRUQsTUFBTSxZQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFNBQVM7O1lBQy9DLE1BQUEsQ0FBQywwQ0FBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ3RDLENBQUM7UUFFRCxLQUFLLFlBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsU0FBUzs7WUFDOUMsTUFBQSxDQUFDLDBDQUFF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

/***/ }),

/***/ "./node_modules/@crc/heart/build/dev_tool/test_blocks/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@crc/heart/build/dev_tool/test_blocks/index.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var block_provider_1 = __webpack_require__(/*! ../../block_provider */ "./node_modules/@crc/heart/build/block_provider.js");
var xml = __webpack_require__(/*! ./block_xml */ "./node_modules/@crc/heart/build/dev_tool/test_blocks/block_xml.js");
exports.xml = xml;
var namespace_1 = __webpack_require__(/*! ./namespace */ "./node_modules/@crc/heart/build/dev_tool/test_blocks/namespace.js");
exports.NAMESPACE = namespace_1.NAMESPACE;
var domain_functions_1 = __webpack_require__(/*! ./domain_functions */ "./node_modules/@crc/heart/build/dev_tool/test_blocks/domain_functions.js");
var block_config_1 = __webpack_require__(/*! ./block_config */ "./node_modules/@crc/heart/build/dev_tool/test_blocks/block_config.js");
exports.block_config = block_config_1.block_config;
function register_compile_dependencies(registry) {
    var namespace = namespace_1.NAMESPACE;
    registry.register_action_type({
        namespace: namespace,
        id: 'testaction',
    });
    registry.register({
        namespace: namespace,
        id: 'pull_event_test',
        metadata: {
            restart_when_finished: true,
        },
    });
    registry.register({
        namespace: namespace,
        id: 'on_test_action',
        respond: {
            to_action: {
                namespace: namespace,
                id: 'testaction',
            },
            type: block_provider_1.ResponderType.Action,
            async: true,
            entity_specific: false,
        },
    });
    var if_dropdowns = [
        'controls_if_dropdown',
        'controls_if_dropdown_simple',
        'controls_if_dropdown_promise',
    ];
    if_dropdowns.forEach(function (id) {
        registry.register({
            namespace: namespace,
            id: id,
            metadata: {
                is_if_dropdown: true,
            },
        });
    });
}
exports.register_compile_dependencies = register_compile_dependencies;
function load_domain_functions(registry, ava_like_test_object) {
    register_compile_dependencies(registry);
    var namespace = namespace_1.NAMESPACE;
    var _test_done_listeners = [];
    var on_test_done = function () {
        for (var i = 0; i < _test_done_listeners.length; i++) {
            _test_done_listeners[i]();
        }
    };
    var subscribe_test_done = function (listener) {
        _test_done_listeners.push(listener);
    };
    var df = domain_functions_1.get_domain_functions(ava_like_test_object, on_test_done)();
    for (var df_id in df) {
        var fun = df[df_id];
        registry.register({
            namespace: namespace,
            id: df_id,
            domain_function: fun,
        });
    }
    return {
        subscribe_test_done: subscribe_test_done,
    };
}
exports.load_domain_functions = load_domain_functions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGV2X3Rvb2wvdGVzdF9ibG9ja3MvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSx1REFBcUQ7QUFDckQsaUNBQW1DO0FBUWYsa0JBQUc7QUFQdkIseUNBQXdDO0FBTy9CLG9CQVBBLHFCQUFTLENBT0E7QUFMbEIsdURBQTBEO0FBSTFELCtDQUE4QztBQUFyQyxzQ0FBQSxZQUFZLENBQUE7QUFHckIsU0FBZ0IsNkJBQTZCLENBQUMsUUFBbUI7SUFDL0QsSUFBTSxTQUFTLEdBQUcscUJBQVMsQ0FBQztJQUU1QixRQUFRLENBQUMsb0JBQW9CLENBQUM7UUFDNUIsU0FBUyxXQUFBO1FBQ1QsRUFBRSxFQUFFLFlBQVk7S0FDakIsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUNoQixTQUFTLFdBQUE7UUFDVCxFQUFFLEVBQUUsaUJBQWlCO1FBQ3JCLFFBQVEsRUFBRTtZQUNSLHFCQUFxQixFQUFFLElBQUk7U0FDNUI7S0FDRixDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsUUFBUSxDQUFDO1FBQ2hCLFNBQVMsV0FBQTtRQUNULEVBQUUsRUFBRSxnQkFBZ0I7UUFDcEIsT0FBTyxFQUFFO1lBQ1AsU0FBUyxFQUFFO2dCQUNULFNBQVMsV0FBQTtnQkFDVCxFQUFFLEVBQUUsWUFBWTthQUNqQjtZQUNELElBQUksRUFBRSw4QkFBYSxDQUFDLE1BQU07WUFDMUIsS0FBSyxFQUFFLElBQUk7WUFDWCxlQUFlLEVBQUUsS0FBSztTQUN2QjtLQUNGLENBQUMsQ0FBQztJQUVILElBQU0sWUFBWSxHQUFHO1FBQ25CLHNCQUFzQjtRQUN0Qiw2QkFBNkI7UUFDN0IsOEJBQThCO0tBQy9CLENBQUM7SUFDRixZQUFZLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBRTtRQUN0QixRQUFRLENBQUMsUUFBUSxDQUFDO1lBQ2hCLFNBQVMsV0FBQTtZQUNULEVBQUUsSUFBQTtZQUNGLFFBQVEsRUFBRTtnQkFDUixjQUFjLEVBQUUsSUFBSTthQUNyQjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUwsQ0FBQztBQTdDRCxzRUE2Q0M7QUFFRCxTQUFnQixxQkFBcUIsQ0FDakMsUUFBbUIsRUFDbkIsb0JBQWlDO0lBRW5DLDZCQUE2QixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3hDLElBQU0sU0FBUyxHQUFHLHFCQUFTLENBQUM7SUFFNUIsSUFBTSxvQkFBb0IsR0FBYyxFQUFFLENBQUM7SUFDM0MsSUFBTSxZQUFZLEdBQUc7UUFDbkIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNwRCxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1NBQzNCO0lBQ0gsQ0FBQyxDQUFDO0lBQ0YsSUFBTSxtQkFBbUIsR0FBcUIsVUFBQyxRQUFtQjtRQUNoRSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDO0lBRUYsSUFBTSxFQUFFLEdBQUcsdUNBQW9CLENBQzdCLG9CQUFvQixFQUNwQixZQUFZLENBQ2IsRUFBRSxDQUFDO0lBRUosS0FBSyxJQUFNLEtBQUssSUFBSSxFQUFFLEVBQUU7UUFDdEIsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RCLFFBQVEsQ0FBQyxRQUFRLENBQUM7WUFDaEIsU0FBUyxXQUFBO1lBQ1QsRUFBRSxFQUFFLEtBQUs7WUFDVCxlQUFlLEVBQUUsR0FBRztTQUNyQixDQUFDLENBQUM7S0FDSjtJQUVELE9BQU87UUFDTCxtQkFBbUIscUJBQUE7S0FDcEIsQ0FBQztBQUNKLENBQUM7QUFsQ0Qsc0RBa0NDIn0=

/***/ }),

/***/ "./node_modules/@crc/heart/build/dev_tool/test_blocks/namespace.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@crc/heart/build/dev_tool/test_blocks/namespace.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var block_provider_1 = __webpack_require__(/*! ../../block_provider */ "./node_modules/@crc/heart/build/block_provider.js");
// Clients would get this function from Util
exports.NAMESPACE = 'AUTOMATEDTESTS';
function ns_id(id) {
    return block_provider_1.namespaced_id(exports.NAMESPACE, id);
}
exports.ns_id = ns_id;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmFtZXNwYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2Rldl90b29sL3Rlc3RfYmxvY2tzL25hbWVzcGFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVEQUFxRDtBQUNyRCw0Q0FBNEM7QUFFL0IsUUFBQSxTQUFTLEdBQUcsZ0JBQWdCLENBQUM7QUFFMUMsU0FBZ0IsS0FBSyxDQUFDLEVBQVM7SUFDN0IsT0FBTyw4QkFBYSxDQUFDLGlCQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDdEMsQ0FBQztBQUZELHNCQUVDIn0=

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AY3JjL2hlYXJ0L2J1aWxkL2Rldl90b29sL2Fzc2VydF90b29sL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AY3JjL2hlYXJ0L2J1aWxkL2Rldl90b29sL2Fzc2VydF90b29sL3R5cGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BjcmMvaGVhcnQvYnVpbGQvZGV2X3Rvb2wvdGVzdF9ibG9ja3MvYmxvY2tfY29uZmlnLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AY3JjL2hlYXJ0L2J1aWxkL2Rldl90b29sL3Rlc3RfYmxvY2tzL2Jsb2NrX3htbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGNyYy9oZWFydC9idWlsZC9kZXZfdG9vbC90ZXN0X2Jsb2Nrcy9kb21haW5fZnVuY3Rpb25zLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AY3JjL2hlYXJ0L2J1aWxkL2Rldl90b29sL3Rlc3RfYmxvY2tzL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AY3JjL2hlYXJ0L2J1aWxkL2Rldl90b29sL3Rlc3RfYmxvY2tzL25hbWVzcGFjZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciB0eXBlXzEgPSByZXF1aXJlKFwiLi90eXBlXCIpO1xuZXhwb3J0cy5Bc3NlcnRUeXBlID0gdHlwZV8xLkFzc2VydFR5cGU7XG5mdW5jdGlvbiBjcmVhdGUoKSB7XG4gICAgcmV0dXJuIG5ldyBUZXN0QXNzZXJ0aW9uVG9vbEltcGwoKTtcbn1cbmV4cG9ydHMuY3JlYXRlID0gY3JlYXRlO1xudmFyIFRlc3RBc3NlcnRpb25Ub29sSW1wbCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBUZXN0QXNzZXJ0aW9uVG9vbEltcGwoKSB7XG4gICAgICAgIHRoaXMucGFzc2VkID0gW107XG4gICAgICAgIHRoaXMuZmFpbGVkID0gW107XG4gICAgfVxuICAgIFRlc3RBc3NlcnRpb25Ub29sSW1wbC5wcm90b3R5cGUucGxhbiA9IGZ1bmN0aW9uIChuX3Rlc3RzKSB7XG4gICAgICAgIHRoaXMucGxhbm5lZCA9IG5fdGVzdHM7XG4gICAgfTtcbiAgICBUZXN0QXNzZXJ0aW9uVG9vbEltcGwucHJvdG90eXBlLmZhaWwgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICB0aGlzLmZhaWxlZC5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6IHR5cGVfMS5Bc3NlcnRUeXBlLmZhaWwsXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlIHx8ICdUZXN0QmxvY2tbZmFpbF0nLFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFRlc3RBc3NlcnRpb25Ub29sSW1wbC5wcm90b3R5cGUucGFzcyA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgIHRoaXMucGFzc2VkLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogdHlwZV8xLkFzc2VydFR5cGUucGFzcyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UgfHwgJ1Rlc3RCbG9ja1twYXNzXScsXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgVGVzdEFzc2VydGlvblRvb2xJbXBsLnByb3RvdHlwZS50cnV0aHkgPSBmdW5jdGlvbiAob2JqLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciBhc3NlcnQgPSB7XG4gICAgICAgICAgICB0eXBlOiB0eXBlXzEuQXNzZXJ0VHlwZS50cnV0aHksXG4gICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogb2JqLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UgfHwgJycsXG4gICAgICAgIH07XG4gICAgICAgIGlmICghIW9iaikge1xuICAgICAgICAgICAgdGhpcy5wYXNzZWQucHVzaChhc3NlcnQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXNzZXJ0Lm1lc3NhZ2UgPSBtZXNzYWdlIHx8IFwiVGVzdEJsb2NrW3RydXRoeV0gVmFsdWUgaXMgbm90IHRydXRoeTogXCIgKyBvYmo7XG4gICAgICAgICAgICB0aGlzLmZhaWxlZC5wdXNoKGFzc2VydCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFRlc3RBc3NlcnRpb25Ub29sSW1wbC5wcm90b3R5cGUuZmFsc3kgPSBmdW5jdGlvbiAob2JqLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciBhc3NlcnQgPSB7XG4gICAgICAgICAgICB0eXBlOiB0eXBlXzEuQXNzZXJ0VHlwZS5mYWxzeSxcbiAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBvYmosXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWVzc2FnZTogJycsXG4gICAgICAgIH07XG4gICAgICAgIGlmICghb2JqKSB7XG4gICAgICAgICAgICB0aGlzLnBhc3NlZC5wdXNoKGFzc2VydCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhc3NlcnQubWVzc2FnZSA9IG1lc3NhZ2UgfHwgXCJUZXN0QmxvY2tbZmFsc3ldIFZhbHVlIGlzIG5vdCBmYWxzeTogXCIgKyBvYmo7XG4gICAgICAgICAgICB0aGlzLmZhaWxlZC5wdXNoKGFzc2VydCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFRlc3RBc3NlcnRpb25Ub29sSW1wbC5wcm90b3R5cGUuaXMgPSBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciBhc3NlcnQgPSB7XG4gICAgICAgICAgICB0eXBlOiB0eXBlXzEuQXNzZXJ0VHlwZS5pcyxcbiAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogZXhwZWN0ZWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSB8fCAnJyxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHZhbHVlID09PSBleHBlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5wYXNzZWQucHVzaChhc3NlcnQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXNzZXJ0Lm1lc3NhZ2UgPSBtZXNzYWdlIHx8IFwiVGVzdEJsb2NrW2lzXSBFeHBlY3RlZCBbXCIgKyBleHBlY3RlZCArIFwiXSBidXQgZ290IFtcIiArIHZhbHVlICsgXCJdXCI7XG4gICAgICAgICAgICB0aGlzLmZhaWxlZC5wdXNoKGFzc2VydCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFRlc3RBc3NlcnRpb25Ub29sSW1wbC5wcm90b3R5cGUubm90ID0gZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICAgICAgICB2YXIgYXNzZXJ0ID0ge1xuICAgICAgICAgICAgdHlwZTogdHlwZV8xLkFzc2VydFR5cGUubm90LFxuICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBleHBlY3RlZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlIHx8ICcnLFxuICAgICAgICB9O1xuICAgICAgICBpZiAodmFsdWUgIT09IGV4cGVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLnBhc3NlZC5wdXNoKGFzc2VydCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhc3NlcnQubWVzc2FnZSA9IG1lc3NhZ2UgfHwgXCJUZXN0QmxvY2tbbm90XSBWYWx1ZSBpcyB0aGUgc2FtZSBhczogXCIgKyB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuZmFpbGVkLnB1c2goYXNzZXJ0KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVGVzdEFzc2VydGlvblRvb2xJbXBsLnByb3RvdHlwZS5nZXRfcmVzdWx0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZV9wbGFubmVkX3Jlc3VsdCgpO1xuICAgICAgICBpZiAodGhpcy5mYWlsZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmZhaWxlZC5tYXAoZnVuY3Rpb24gKGZhaWx1cmUpIHsgcmV0dXJuIGZhaWx1cmUubWVzc2FnZTsgfSkuam9pbignXFxuJyksXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBsYW5uZWQgIT0gMCAmJiB0aGlzLnBhc3NlZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJUZXN0IGZpbmlzaGVkIHdpdGggbm8gYXNzZXJ0aW9uLlwiLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiUGFzc2VkIFwiICsgdGhpcy5wYXNzZWQubGVuZ3RoICsgXCIgYXNzZXJ0aW9uXCIgKyB0aGlzLmdldF9wbHVyYWxfYnlfYW10KHRoaXMucGFzc2VkLmxlbmd0aCkgKyBcIi5cIixcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIFRlc3RBc3NlcnRpb25Ub29sSW1wbC5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZmFpbGVkID0gW107XG4gICAgICAgIHRoaXMucGFzc2VkID0gW107XG4gICAgICAgIHRoaXMucGxhbm5lZCA9IHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIFRlc3RBc3NlcnRpb25Ub29sSW1wbC5wcm90b3R5cGUuZ2V0X3BsdXJhbF9ieV9hbXQgPSBmdW5jdGlvbiAoYW10KSB7XG4gICAgICAgIHJldHVybiAoYW10ID09PSAxKSA/ICcnIDogJ3MnO1xuICAgIH07XG4gICAgVGVzdEFzc2VydGlvblRvb2xJbXBsLnByb3RvdHlwZS51cGRhdGVfcGxhbm5lZF9yZXN1bHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnBsYW5uZWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBudW1fb2ZfYXNzZXJ0aW9uID0gdGhpcy5mYWlsZWQubGVuZ3RoICsgdGhpcy5wYXNzZWQubGVuZ3RoO1xuICAgICAgICB0aGlzLmlzKG51bV9vZl9hc3NlcnRpb24sIHRoaXMucGxhbm5lZCwgXCJQbGFubmVkIGZvciBcIiArIHRoaXMucGxhbm5lZCArIFwiIGFzc2VydGlvblwiICsgdGhpcy5nZXRfcGx1cmFsX2J5X2FtdCh0aGlzLnBsYW5uZWQpICsgXCIgYnV0IGdvdCBcIiArIG51bV9vZl9hc3NlcnRpb24gKyBcIi5cIik7XG4gICAgfTtcbiAgICByZXR1cm4gVGVzdEFzc2VydGlvblRvb2xJbXBsO1xufSgpKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWFXNWtaWGd1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sY3lJNld5SXVMaTh1TGk4dUxpOXpjbU12WkdWMlgzUnZiMnd2WVhOelpYSjBYM1J2YjJ3dmFXNWtaWGd1ZEhNaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN1FVRkJRU3dyUWtGTlowSTdRVUZKWkN4eFFrRlNRU3hwUWtGQlZTeERRVkZCTzBGQlRWb3NVMEZCWjBJc1RVRkJUVHRKUVVOd1FpeFBRVUZQTEVsQlFVa3NjVUpCUVhGQ0xFVkJRVVVzUTBGQlF6dEJRVU55UXl4RFFVRkRPMEZCUmtRc2QwSkJSVU03UVVGRlJEdEpRVUZCTzFGQlJWVXNWMEZCVFN4SFFVRlpMRVZCUVVVc1EwRkJRenRSUVVOeVFpeFhRVUZOTEVkQlFWa3NSVUZCUlN4RFFVRkRPMGxCYlVrdlFpeERRVUZETzBsQmFFbFJMRzlEUVVGSkxFZEJRVmdzVlVGQldTeFBRVUZqTzFGQlEzaENMRWxCUVVrc1EwRkJReXhQUVVGUExFZEJRVWNzVDBGQlR5eERRVUZETzBsQlEzcENMRU5CUVVNN1NVRkZUU3h2UTBGQlNTeEhRVUZZTEZWQlFWa3NUMEZCWlR0UlFVTjZRaXhKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXp0WlFVTm1MRWxCUVVrc1JVRkJSU3hwUWtGQlZTeERRVUZETEVsQlFVazdXVUZEY2tJc1QwRkJUeXhGUVVGRkxFOUJRVThzU1VGQlNTeHBRa0ZCYVVJN1UwRkRkRU1zUTBGQlF5eERRVUZETzBsQlEwd3NRMEZCUXp0SlFVVk5MRzlEUVVGSkxFZEJRVmdzVlVGQldTeFBRVUZsTzFGQlEzcENMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETzFsQlEyWXNTVUZCU1N4RlFVRkZMR2xDUVVGVkxFTkJRVU1zU1VGQlNUdFpRVU55UWl4UFFVRlBMRVZCUVVVc1QwRkJUeXhKUVVGSkxHbENRVUZwUWp0VFFVTjBReXhEUVVGRExFTkJRVU03U1VGRFRDeERRVUZETzBsQlJVMHNjME5CUVUwc1IwRkJZaXhWUVVGakxFZEJRVThzUlVGQlJTeFBRVUZsTzFGQlEzQkRMRWxCUVUwc1RVRkJUU3hIUVVGSE8xbEJRMklzU1VGQlNTeEZRVUZGTEdsQ1FVRlZMRU5CUVVNc1RVRkJUVHRaUVVOMlFpeE5RVUZOTEVWQlFVVTdaMEpCUTA0c1MwRkJTeXhGUVVGRkxFZEJRVWM3WVVGRFdEdFpRVU5FTEU5QlFVOHNSVUZCUlN4UFFVRlBMRWxCUVVrc1JVRkJSVHRUUVVOMlFpeERRVUZETzFGQlEwWXNTVUZCU1N4RFFVRkRMRU5CUVVNc1IwRkJSeXhGUVVGRk8xbEJRMVFzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03VTBGRE1VSTdZVUZCVFR0WlFVTk1MRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzVDBGQlR5eEpRVUZKTERSRFFVRXdReXhIUVVGTExFTkJRVU03V1VGRE5VVXNTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdVMEZETVVJN1NVRkRTQ3hEUVVGRE8wbEJSVTBzY1VOQlFVc3NSMEZCV2l4VlFVRmhMRWRCUVU4c1JVRkJSU3hQUVVGbE8xRkJRMjVETEVsQlFVMHNUVUZCVFN4SFFVRkhPMWxCUTJJc1NVRkJTU3hGUVVGRkxHbENRVUZWTEVOQlFVTXNTMEZCU3p0WlFVTjBRaXhOUVVGTkxFVkJRVVU3WjBKQlEwNHNTMEZCU3l4RlFVRkZMRWRCUVVjN1lVRkRXRHRaUVVORUxFOUJRVThzUlVGQlJTeEZRVUZGTzFOQlExb3NRMEZCUXp0UlFVTkdMRWxCUVVrc1EwRkJReXhIUVVGSExFVkJRVVU3V1VGRFVpeEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dFRRVU14UWp0aFFVRk5PMWxCUTB3c1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFBRVUZQTEVsQlFVa3NNRU5CUVhkRExFZEJRVXNzUTBGQlF6dFpRVU14UlN4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0VFFVTXhRanRKUVVOSUxFTkJRVU03U1VGRlRTeHJRMEZCUlN4SFFVRlVMRlZCUVZVc1MwRkJVeXhGUVVGRkxGRkJRVmtzUlVGQlJTeFBRVUZsTzFGQlEyaEVMRWxCUVUwc1RVRkJUU3hIUVVGSE8xbEJRMklzU1VGQlNTeEZRVUZGTEdsQ1FVRlZMRU5CUVVNc1JVRkJSVHRaUVVOdVFpeE5RVUZOTEVWQlFVVTdaMEpCUTA0c1MwRkJTeXhQUVVGQk8yZENRVU5NTEZGQlFWRXNWVUZCUVR0aFFVTlVPMWxCUTBRc1QwRkJUeXhGUVVGRkxFOUJRVThzU1VGQlNTeEZRVUZGTzFOQlEzWkNMRU5CUVVNN1VVRkRSaXhKUVVGSkxFdEJRVXNzUzBGQlN5eFJRVUZSTEVWQlFVVTdXVUZEZEVJc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1UwRkRNVUk3WVVGQlRUdFpRVU5NTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1QwRkJUeXhKUVVGSkxEWkNRVUV5UWl4UlFVRlJMRzFDUVVGakxFdEJRVXNzVFVGQlJ5eERRVUZETzFsQlEzUkdMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMU5CUXpGQ08wbEJRMGdzUTBGQlF6dEpRVVZOTEcxRFFVRkhMRWRCUVZZc1ZVRkJWeXhMUVVGVExFVkJRVVVzVVVGQldTeEZRVUZGTEU5QlFXVTdVVUZEYWtRc1NVRkJUU3hOUVVGTkxFZEJRVWM3V1VGRFlpeEpRVUZKTEVWQlFVVXNhVUpCUVZVc1EwRkJReXhIUVVGSE8xbEJRM0JDTEUxQlFVMHNSVUZCUlR0blFrRkRUaXhMUVVGTExFOUJRVUU3WjBKQlEwd3NVVUZCVVN4VlFVRkJPMkZCUTFRN1dVRkRSQ3hQUVVGUExFVkJRVVVzVDBGQlR5eEpRVUZKTEVWQlFVVTdVMEZEZGtJc1EwRkJRenRSUVVOR0xFbEJRVWtzUzBGQlN5eExRVUZMTEZGQlFWRXNSVUZCUlR0WlFVTjBRaXhKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenRUUVVNeFFqdGhRVUZOTzFsQlEwd3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhQUVVGUExFbEJRVWtzTUVOQlFYZERMRXRCUVU4c1EwRkJRenRaUVVNMVJTeEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dFRRVU14UWp0SlFVTklMRU5CUVVNN1NVRkZUU3d3UTBGQlZTeEhRVUZxUWp0UlFVTkZMRWxCUVVrc1EwRkJReXh4UWtGQmNVSXNSVUZCUlN4RFFVRkRPMUZCUlRkQ0xFbEJRVWtzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4TlFVRk5MRWRCUVVjc1EwRkJReXhGUVVGRk8xbEJRekZDTEU5QlFVODdaMEpCUTB3c1QwRkJUeXhGUVVGRkxFdEJRVXM3WjBKQlEyUXNUMEZCVHl4RlFVRkZMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFVTXNUMEZCVHl4SlFVRkxMRTlCUVVFc1QwRkJUeXhEUVVGRExFOUJRVThzUlVGQlppeERRVUZsTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRE8yRkJRMnhGTEVOQlFVTTdVMEZEU0R0UlFVVkVMRWxCUVVrc1NVRkJTU3hEUVVGRExFOUJRVThzU1VGQlNTeERRVUZETEVsQlFVa3NTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhOUVVGTkxFdEJRVXNzUTBGQlF5eEZRVUZITzFsQlEyeEVMRTlCUVU4N1owSkJRMHdzVDBGQlR5eEZRVUZGTEV0QlFVczdaMEpCUTJRc1QwRkJUeXhGUVVGRkxHdERRVUZyUXp0aFFVTTFReXhEUVVGRE8xTkJRMGc3VVVGRlJDeFBRVUZQTzFsQlEwd3NUMEZCVHl4RlFVRkZMRWxCUVVrN1dVRkRZaXhQUVVGUExFVkJRVVVzV1VGQlZTeEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRTFCUVUwc2EwSkJRV0VzU1VGQlNTeERRVUZETEdsQ1FVRnBRaXhEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNUVUZCVFN4RFFVRkRMRTFCUVVjN1UwRkRhRWNzUTBGQlF6dEpRVU5LTEVOQlFVTTdTVUZGVFN4eFEwRkJTeXhIUVVGYU8xRkJRMFVzU1VGQlNTeERRVUZETEUxQlFVMHNSMEZCUnl4RlFVRkZMRU5CUVVNN1VVRkRha0lzU1VGQlNTeERRVUZETEUxQlFVMHNSMEZCUnl4RlFVRkZMRU5CUVVNN1VVRkRha0lzU1VGQlNTeERRVUZETEU5QlFVOHNSMEZCUnl4VFFVRlRMRU5CUVVNN1NVRkRNMElzUTBGQlF6dEpRVVZQTEdsRVFVRnBRaXhIUVVGNlFpeFZRVUV3UWl4SFFVRlZPMUZCUTJ4RExFOUJRVThzUTBGQlF5eEhRVUZITEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTXNSMEZCUnl4RFFVRkRPMGxCUTJoRExFTkJRVU03U1VGRlR5eHhSRUZCY1VJc1IwRkJOMEk3VVVGRFJTeEpRVUZKTEVsQlFVa3NRMEZCUXl4UFFVRlBMRXRCUVVzc1UwRkJVeXhGUVVGRk8xbEJRemxDTEU5QlFVODdVMEZEVWp0UlFVTkVMRWxCUVUwc1owSkJRV2RDTEVkQlFVY3NTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhOUVVGTkxFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNN1VVRkRha1VzU1VGQlNTeERRVUZETEVWQlFVVXNRMEZEVEN4blFrRkJaMElzUlVGRGFFSXNTVUZCU1N4RFFVRkRMRTlCUVU4c1JVRkRXaXhwUWtGQlpTeEpRVUZKTEVOQlFVTXNUMEZCVHl4clFrRkJZU3hKUVVGSkxFTkJRVU1zYVVKQlFXbENMRU5CUVVNc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eHBRa0ZCV1N4blFrRkJaMElzVFVGQlJ5eERRVU0xUnl4RFFVRkRPMGxCUTBvc1EwRkJRenRKUVVOSUxEUkNRVUZETzBGQlFVUXNRMEZCUXl4QlFYUkpSQ3hKUVhOSlF5SjkiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBBc3NlcnRUeXBlO1xuKGZ1bmN0aW9uIChBc3NlcnRUeXBlKSB7XG4gICAgQXNzZXJ0VHlwZVtBc3NlcnRUeXBlW1wicGFzc1wiXSA9IDBdID0gXCJwYXNzXCI7XG4gICAgQXNzZXJ0VHlwZVtBc3NlcnRUeXBlW1wiZmFpbFwiXSA9IDFdID0gXCJmYWlsXCI7XG4gICAgQXNzZXJ0VHlwZVtBc3NlcnRUeXBlW1widHJ1dGh5XCJdID0gMl0gPSBcInRydXRoeVwiO1xuICAgIEFzc2VydFR5cGVbQXNzZXJ0VHlwZVtcImZhbHN5XCJdID0gM10gPSBcImZhbHN5XCI7XG4gICAgQXNzZXJ0VHlwZVtBc3NlcnRUeXBlW1wiaXNcIl0gPSA0XSA9IFwiaXNcIjtcbiAgICBBc3NlcnRUeXBlW0Fzc2VydFR5cGVbXCJub3RcIl0gPSA1XSA9IFwibm90XCI7XG59KShBc3NlcnRUeXBlID0gZXhwb3J0cy5Bc3NlcnRUeXBlIHx8IChleHBvcnRzLkFzc2VydFR5cGUgPSB7fSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhsd1pTNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMeTR1TDNOeVl5OWtaWFpmZEc5dmJDOWhjM05sY25SZmRHOXZiQzkwZVhCbExuUnpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPMEZCUlVFc1NVRkJXU3hWUVU5WU8wRkJVRVFzVjBGQldTeFZRVUZWTzBsQlEzQkNMREpEUVVGSkxFTkJRVUU3U1VGRFNpd3lRMEZCU1N4RFFVRkJPMGxCUTBvc0swTkJRVTBzUTBGQlFUdEpRVU5PTERaRFFVRkxMRU5CUVVFN1NVRkRUQ3gxUTBGQlJTeERRVUZCTzBsQlEwWXNlVU5CUVVjc1EwRkJRVHRCUVVOTUxFTkJRVU1zUlVGUVZ5eFZRVUZWTEVkQlFWWXNhMEpCUVZVc1MwRkJWaXhyUWtGQlZTeFJRVTl5UWlKOSIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIG5hbWVzcGFjZV8xID0gcmVxdWlyZShcIi4vbmFtZXNwYWNlXCIpO1xudmFyIHRlc3RfY29sb3IgPSAnIzUwNTA1MCc7XG52YXIgbWVzc2FnZSA9IHtcbiAgICB0eXBlOiAnaW5wdXRfdmFsdWUnLFxuICAgIG5hbWU6ICdtZXNzYWdlJyxcbiAgICBjaGVjazogJ1N0cmluZycsXG4gICAgYWxpZ246ICdDRU5UUkUnLFxufTtcbmV4cG9ydHMuYmxvY2tfY29uZmlnID0ge1xuICAgIHBsYW46IHtcbiAgICAgICAgbWVzc2FnZTA6ICdQbGFuICUxIGFzc2VydGlvbnMnLFxuICAgICAgICBhcmdzMDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdpbnB1dF92YWx1ZScsXG4gICAgICAgICAgICAgICAgbmFtZTogJ25fcGxhbm5lZF9hc3NlcnRpb25zJyxcbiAgICAgICAgICAgICAgICBjaGVjazogJ051bWJlcicsXG4gICAgICAgICAgICAgICAgYWxpZ246ICdDRU5UUkUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgcHJldmlvdXNTdGF0ZW1lbnQ6IG51bGwsXG4gICAgICAgIG5leHRTdGF0ZW1lbnQ6IG51bGwsXG4gICAgICAgIHRvb2x0aXA6ICcnLFxuICAgICAgICBjb2xvdXI6IHRlc3RfY29sb3IsXG4gICAgICAgIGlucHV0c0lubGluZTogdHJ1ZSxcbiAgICB9LFxuICAgIGZhaWw6IHtcbiAgICAgICAgbWVzc2FnZTA6ICdGYWlsICglMSknLFxuICAgICAgICBhcmdzMDogW1xuICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgXSxcbiAgICAgICAgcHJldmlvdXNTdGF0ZW1lbnQ6IG51bGwsXG4gICAgICAgIG5leHRTdGF0ZW1lbnQ6IG51bGwsXG4gICAgICAgIHRvb2x0aXA6ICcnLFxuICAgICAgICBjb2xvdXI6ICcjNjYxNTE1JyxcbiAgICAgICAgaW5wdXRzSW5saW5lOiB0cnVlLFxuICAgIH0sXG4gICAgcGFzczoge1xuICAgICAgICBtZXNzYWdlMDogJ1Bhc3MgKCUxKScsXG4gICAgICAgIGFyZ3MwOiBbXG4gICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICBdLFxuICAgICAgICBwcmV2aW91c1N0YXRlbWVudDogbnVsbCxcbiAgICAgICAgbmV4dFN0YXRlbWVudDogbnVsbCxcbiAgICAgICAgdG9vbHRpcDogJycsXG4gICAgICAgIGNvbG91cjogJyMxNTY2MTUnLFxuICAgICAgICBpbnB1dHNJbmxpbmU6IHRydWUsXG4gICAgfSxcbiAgICB0cnV0aHk6IHtcbiAgICAgICAgbWVzc2FnZTA6ICdJcyB0cnV0aHk6ICUxICglMiknLFxuICAgICAgICBhcmdzMDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdpbnB1dF92YWx1ZScsXG4gICAgICAgICAgICAgICAgbmFtZTogJ3ZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICBdLFxuICAgICAgICBwcmV2aW91c1N0YXRlbWVudDogbnVsbCxcbiAgICAgICAgbmV4dFN0YXRlbWVudDogbnVsbCxcbiAgICAgICAgdG9vbHRpcDogJycsXG4gICAgICAgIGNvbG91cjogdGVzdF9jb2xvcixcbiAgICAgICAgaW5wdXRzSW5saW5lOiB0cnVlLFxuICAgIH0sXG4gICAgZmFsc3k6IHtcbiAgICAgICAgbWVzc2FnZTA6ICdJcyBmYWxzeTogJTEgKCUyKScsXG4gICAgICAgIGFyZ3MwOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2lucHV0X3ZhbHVlJyxcbiAgICAgICAgICAgICAgICBuYW1lOiAndmFsdWUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIF0sXG4gICAgICAgIHByZXZpb3VzU3RhdGVtZW50OiBudWxsLFxuICAgICAgICBuZXh0U3RhdGVtZW50OiBudWxsLFxuICAgICAgICB0b29sdGlwOiAnJyxcbiAgICAgICAgY29sb3VyOiB0ZXN0X2NvbG9yLFxuICAgICAgICBpbnB1dHNJbmxpbmU6IHRydWUsXG4gICAgfSxcbiAgICBpczoge1xuICAgICAgICBtZXNzYWdlMDogJ0V4cGVjdCAlMSB0byBiZSAlMiAoJTMpJyxcbiAgICAgICAgYXJnczA6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnaW5wdXRfdmFsdWUnLFxuICAgICAgICAgICAgICAgIG5hbWU6ICd2YWx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdpbnB1dF92YWx1ZScsXG4gICAgICAgICAgICAgICAgbmFtZTogJ2V4cGVjdGVkJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICBdLFxuICAgICAgICBwcmV2aW91c1N0YXRlbWVudDogbnVsbCxcbiAgICAgICAgbmV4dFN0YXRlbWVudDogbnVsbCxcbiAgICAgICAgdG9vbHRpcDogJycsXG4gICAgICAgIGNvbG91cjogdGVzdF9jb2xvcixcbiAgICAgICAgaW5wdXRzSW5saW5lOiB0cnVlLFxuICAgIH0sXG4gICAgbm90OiB7XG4gICAgICAgIG1lc3NhZ2UwOiAnRXhwZWN0ICUxIHRvIE5PVCBiZSAlMiAoJTMpJyxcbiAgICAgICAgYXJnczA6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnaW5wdXRfdmFsdWUnLFxuICAgICAgICAgICAgICAgIG5hbWU6ICd2YWx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdpbnB1dF92YWx1ZScsXG4gICAgICAgICAgICAgICAgbmFtZTogJ2V4cGVjdGVkJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICBdLFxuICAgICAgICBwcmV2aW91c1N0YXRlbWVudDogbnVsbCxcbiAgICAgICAgbmV4dFN0YXRlbWVudDogbnVsbCxcbiAgICAgICAgdG9vbHRpcDogJycsXG4gICAgICAgIGNvbG91cjogdGVzdF9jb2xvcixcbiAgICAgICAgaW5wdXRzSW5saW5lOiB0cnVlLFxuICAgIH0sXG4gICAgZG9uZToge1xuICAgICAgICBtZXNzYWdlMDogJ1Rlc3QgaXMgZG9uZScsXG4gICAgICAgIGFyZ3MwOiBbXSxcbiAgICAgICAgcHJldmlvdXNTdGF0ZW1lbnQ6IG51bGwsXG4gICAgICAgIG5leHRTdGF0ZW1lbnQ6IHVuZGVmaW5lZCxcbiAgICAgICAgdG9vbHRpcDogJycsXG4gICAgICAgIGNvbG91cjogdGVzdF9jb2xvcixcbiAgICAgICAgaW5wdXRzSW5saW5lOiB0cnVlLFxuICAgIH0sXG4gICAgYmFkX3Byb21pc2U6IHtcbiAgICAgICAgbWVzc2FnZTA6ICdQcm9taXNlOiBGYWlsIHdpdGggbWVzc2FnZSAlMScsXG4gICAgICAgIGFyZ3MwOiBbXG4gICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICBdLFxuICAgICAgICBwcmV2aW91c1N0YXRlbWVudDogbnVsbCxcbiAgICAgICAgbmV4dFN0YXRlbWVudDogbnVsbCxcbiAgICAgICAgdG9vbHRpcDogJycsXG4gICAgICAgIGNvbG91cjogJyV7QktZX1NFTlNJTkdfSFVFfScsXG4gICAgICAgIGlucHV0c0lubGluZTogdHJ1ZSxcbiAgICB9LFxuICAgIGdvb2RfcHJvbWlzZToge1xuICAgICAgICBtZXNzYWdlMDogJ1Byb21pc2U6IFJldHVybiAlMSBpbiAlMiBtaWxsaXNlY29uZHMnLFxuICAgICAgICBhcmdzMDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdpbnB1dF92YWx1ZScsXG4gICAgICAgICAgICAgICAgbmFtZTogJ3JldHVybnMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnaW5wdXRfdmFsdWUnLFxuICAgICAgICAgICAgICAgIG5hbWU6ICdtaWxsaXNlY29uZHMnLFxuICAgICAgICAgICAgICAgIGNoZWNrOiAnTnVtYmVyJyxcbiAgICAgICAgICAgICAgICBhbGlnbjogJ0NFTlRSRScsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBwcmV2aW91c1N0YXRlbWVudDogdW5kZWZpbmVkLFxuICAgICAgICBuZXh0U3RhdGVtZW50OiB1bmRlZmluZWQsXG4gICAgICAgIHRvb2x0aXA6ICcnLFxuICAgICAgICBjb2xvdXI6ICcle0JLWV9TRU5TSU5HX0hVRX0nLFxuICAgICAgICBvdXRwdXQ6IFsnU3RyaW5nJ10sXG4gICAgICAgIGlucHV0c0lubGluZTogdHJ1ZSxcbiAgICB9LFxuICAgIGNhbGxfdXNlcl9wcm9jZWR1cmU6IHtcbiAgICAgICAgbWVzc2FnZTA6ICdDYWxsIHVzZXIgcHJvY2VkdXJlICUxIGFyZyBvbmUgaXMgJTInLFxuICAgICAgICBhcmdzMDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdpbnB1dF92YWx1ZScsXG4gICAgICAgICAgICAgICAgbmFtZTogJ2Z1bmN0aW9uX2lkJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2lucHV0X3ZhbHVlJyxcbiAgICAgICAgICAgICAgICBuYW1lOiAnYXJnb25lJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHByZXZpb3VzU3RhdGVtZW50OiBudWxsLFxuICAgICAgICBuZXh0U3RhdGVtZW50OiBudWxsLFxuICAgICAgICB0b29sdGlwOiAnJyxcbiAgICAgICAgY29sb3VyOiAnJXtCS1lfUFJPQ0VEVVJFU19IVUV9JyxcbiAgICAgICAgaW5wdXRzSW5saW5lOiB0cnVlLFxuICAgIH0sXG4gICAgc2VuZF90ZXN0X2FjdGlvbjoge1xuICAgICAgICBtZXNzYWdlMDogJ1NlbmQgdGVzdCBhY3Rpb24gd2l0aCBwYXJhbWV0ZXIgJTEnLFxuICAgICAgICBhcmdzMDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdpbnB1dF92YWx1ZScsXG4gICAgICAgICAgICAgICAgbmFtZTogJ3BhcmFtZXRlcl92YWx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBwcmV2aW91c1N0YXRlbWVudDogbnVsbCxcbiAgICAgICAgbmV4dFN0YXRlbWVudDogbnVsbCxcbiAgICAgICAgdG9vbHRpcDogJycsXG4gICAgICAgIGNvbG91cjogJyV7QktZX0VWRU5UU19IVUV9JyxcbiAgICAgICAgaW5wdXRzSW5saW5lOiB0cnVlLFxuICAgIH0sXG4gICAgZ2V0X3Rlc3RfYWN0aW9uX3BhcmFtZXRlcjoge1xuICAgICAgICBtZXNzYWdlMDogJ3Rlc3QgYWN0aW9uIHBhcmFtZXRlcicsXG4gICAgICAgIGFyZ3MwOiBbXSxcbiAgICAgICAgcHJldmlvdXNTdGF0ZW1lbnQ6IHVuZGVmaW5lZCxcbiAgICAgICAgbmV4dFN0YXRlbWVudDogdW5kZWZpbmVkLFxuICAgICAgICB0b29sdGlwOiAnJyxcbiAgICAgICAgY29sb3VyOiAnJXtCS1lfRVZFTlRTX0hVRX0nLFxuICAgICAgICBvdXRwdXQ6IFsnU3RyaW5nJ10sXG4gICAgICAgIGlucHV0c0lubGluZTogdHJ1ZSxcbiAgICB9LFxuICAgIG9uX3Rlc3RfYWN0aW9uOiB7XG4gICAgICAgIG1lc3NhZ2UwOiAnT24gdGVzdCBhY3Rpb24gJTEgJTInLFxuICAgICAgICBhcmdzMDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdpbnB1dF9kdW1teScsXG4gICAgICAgICAgICAgICAgYWxpZ246ICdDRU5UUkUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnaW5wdXRfc3RhdGVtZW50JyxcbiAgICAgICAgICAgICAgICBuYW1lOiAnRE8nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgdG9vbHRpcDogJycsXG4gICAgICAgIGNvbG91cjogJyV7QktZX0VWRU5UU19IVUV9JyxcbiAgICAgICAgaW5wdXRzSW5saW5lOiB0cnVlLFxuICAgIH0sXG4gICAgY3JlYXRlX2VudGl0eV9pbnN0YW5jZToge1xuICAgICAgICBtZXNzYWdlMDogJ0NyZWF0ZSBlbnRpdHkgaW5zdGFuY2UgJTEnLFxuICAgICAgICBhcmdzMDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdpbnB1dF92YWx1ZScsXG4gICAgICAgICAgICAgICAgbmFtZTogJ3R5cGVjbGFzc19pZCcsXG4gICAgICAgICAgICAgICAgY2hlY2s6ICdTdHJpbmcnLFxuICAgICAgICAgICAgICAgIGFsaWduOiAnQ0VOVFJFJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHByZXZpb3VzU3RhdGVtZW50OiBudWxsLFxuICAgICAgICBuZXh0U3RhdGVtZW50OiBudWxsLFxuICAgICAgICB0b29sdGlwOiAnJyxcbiAgICAgICAgY29sb3VyOiAnIzE1NjYxNScsXG4gICAgICAgIGlucHV0c0lubGluZTogdHJ1ZSxcbiAgICB9LFxuICAgIGNvbnNvbGVfbG9nOiB7XG4gICAgICAgIG1lc3NhZ2UwOiAnQ29uc29sZSBsb2cgJTEnLFxuICAgICAgICBhcmdzMDogW1xuICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgXSxcbiAgICAgICAgcHJldmlvdXNTdGF0ZW1lbnQ6IG51bGwsXG4gICAgICAgIG5leHRTdGF0ZW1lbnQ6IG51bGwsXG4gICAgICAgIHRvb2x0aXA6ICcnLFxuICAgICAgICBjb2xvdXI6ICcjMTU2NjE1JyxcbiAgICAgICAgaW5wdXRzSW5saW5lOiB0cnVlLFxuICAgIH0sXG4gICAgcHVsbF9ldmVudF90ZXN0OiB7XG4gICAgICAgIG1lc3NhZ2UwOiAnUHVsbCBldmVudCB0ZXN0ICUxICUyJyxcbiAgICAgICAgYXJnczA6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnaW5wdXRfZHVtbXknLFxuICAgICAgICAgICAgICAgIGFsaWduOiAnQ0VOVFJFJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2lucHV0X3N0YXRlbWVudCcsXG4gICAgICAgICAgICAgICAgbmFtZTogJ0RPJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbG91cjogJyV7QktZX0VWRU5UU19IVUV9JyxcbiAgICAgICAgaW5wdXRzSW5saW5lOiB0cnVlLFxuICAgIH0sXG4gICAgdGhyb3dfZXJyb3I6IHtcbiAgICAgICAgbWVzc2FnZTA6ICdUaHJvdyBlcnJvcicsXG4gICAgICAgIGFyZ3MwOiBbXSxcbiAgICAgICAgcHJldmlvdXNTdGF0ZW1lbnQ6IG51bGwsXG4gICAgICAgIG5leHRTdGF0ZW1lbnQ6IG51bGwsXG4gICAgICAgIHRvb2x0aXA6ICcnLFxuICAgICAgICBjb2xvdXI6ICcjNjYxNTE1JyxcbiAgICAgICAgaW5wdXRzSW5saW5lOiB0cnVlLFxuICAgIH0sXG4gICAgc2V0X3Rlc3Rfc3RhdGU6IHtcbiAgICAgICAgbWVzc2FnZTA6ICdTZW5kIHRlc3Qgc3RhdGUgJTEnLFxuICAgICAgICBhcmdzMDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdmaWVsZF9kcm9wZG93bicsXG4gICAgICAgICAgICAgICAgbmFtZTogJ3N0YXRlJyxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBbXG4gICAgICAgICAgICAgICAgICAgIFsndHJ1ZScsICd0cnVlJ10sXG4gICAgICAgICAgICAgICAgICAgIFsnZmFsc2UnLCAnZmFsc2UnXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgcHJldmlvdXNTdGF0ZW1lbnQ6IG51bGwsXG4gICAgICAgIG5leHRTdGF0ZW1lbnQ6IG51bGwsXG4gICAgICAgIHRvb2x0aXA6ICcnLFxuICAgICAgICBjb2xvdXI6ICcle0JLWV9DT05UUk9MX0hVRX0nLFxuICAgICAgICBpbnB1dHNJbmxpbmU6IHRydWUsXG4gICAgfSxcbiAgICBnZXRfdGVzdF9zdGF0ZToge1xuICAgICAgICBtZXNzYWdlMDogJ0dldCB0ZXN0IHN0YXRlJyxcbiAgICAgICAgYXJnczA6IFtdLFxuICAgICAgICB0b29sdGlwOiAnJyxcbiAgICAgICAgY29sb3VyOiAnJXtCS1lfQ09OVFJPTF9IVUV9JyxcbiAgICAgICAgb3V0cHV0OiBbJ0Jvb2xlYW4nXSxcbiAgICAgICAgaW5wdXRzSW5saW5lOiB0cnVlLFxuICAgIH0sXG4gICAgY29udHJvbHNfaWZfZHJvcGRvd246IHtcbiAgICAgICAgbWVzc2FnZTA6ICdJZiAlMSAlMiAlMyBlbHNlIGlmICU0ICU1ICU2IGVsc2UgJTcgJTgnLFxuICAgICAgICBhcmdzMDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdmaWVsZF9kcm9wZG93bicsXG4gICAgICAgICAgICAgICAgbmFtZTogJ0lGMCcsXG4gICAgICAgICAgICAgICAgb3B0aW9uczogW1xuICAgICAgICAgICAgICAgICAgICBbJ3N0YXRlX2lzX3RydWUnLCBuYW1lc3BhY2VfMS5uc19pZCgndGVzdF9zdGF0ZV90cnVlJyldLFxuICAgICAgICAgICAgICAgICAgICBbJ3N0YXRlX2lzX2ZhbHNlJywgbmFtZXNwYWNlXzEubnNfaWQoJ3Rlc3Rfc3RhdGVfZmFsc2UnKV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2lucHV0X2R1bW15JyxcbiAgICAgICAgICAgICAgICBhbGlnbjogJ0NFTlRSRScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdpbnB1dF9zdGF0ZW1lbnQnLFxuICAgICAgICAgICAgICAgIG5hbWU6ICdETzAnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnZmllbGRfZHJvcGRvd24nLFxuICAgICAgICAgICAgICAgIG5hbWU6ICdJRjEnLFxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IFtcbiAgICAgICAgICAgICAgICAgICAgWydzdGF0ZV9pc19ub3RfdHJ1ZScsIG5hbWVzcGFjZV8xLm5zX2lkKCd0ZXN0X3N0YXRlX2ZhbHNlJyldLFxuICAgICAgICAgICAgICAgICAgICBbJ3N0YXRlX2lzX25vdF9mYWxzZScsIG5hbWVzcGFjZV8xLm5zX2lkKCd0ZXN0X3N0YXRlX3RydWUnKV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2lucHV0X2R1bW15JyxcbiAgICAgICAgICAgICAgICBhbGlnbjogJ0NFTlRSRScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdpbnB1dF9zdGF0ZW1lbnQnLFxuICAgICAgICAgICAgICAgIG5hbWU6ICdETzEnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnaW5wdXRfZHVtbXknLFxuICAgICAgICAgICAgICAgIGFsaWduOiAnQ0VOVFJFJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2lucHV0X3N0YXRlbWVudCcsXG4gICAgICAgICAgICAgICAgbmFtZTogJ0VMU0UnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgdG9vbHRpcDogJycsXG4gICAgICAgIHByZXZpb3VzU3RhdGVtZW50OiBudWxsLFxuICAgICAgICBuZXh0U3RhdGVtZW50OiBudWxsLFxuICAgICAgICBjb2xvdXI6ICcle0JLWV9DT05UUk9MX0hVRX0nLFxuICAgICAgICBpbnB1dHNJbmxpbmU6IHRydWUsXG4gICAgfSxcbiAgICBjb250cm9sc19pZl9kcm9wZG93bl9zaW1wbGU6IHtcbiAgICAgICAgbWVzc2FnZTA6ICdJZiAlMSAlMiAlMycsXG4gICAgICAgIGFyZ3MwOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2ZpZWxkX2Ryb3Bkb3duJyxcbiAgICAgICAgICAgICAgICBuYW1lOiAnSUYwJyxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBbXG4gICAgICAgICAgICAgICAgICAgIFsnc3RhdGVfaXNfdHJ1ZScsIG5hbWVzcGFjZV8xLm5zX2lkKCd0ZXN0X3N0YXRlX3RydWUnKV0sXG4gICAgICAgICAgICAgICAgICAgIFsnc3RhdGVfaXNfZmFsc2UnLCBuYW1lc3BhY2VfMS5uc19pZCgndGVzdF9zdGF0ZV9mYWxzZScpXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnaW5wdXRfZHVtbXknLFxuICAgICAgICAgICAgICAgIGFsaWduOiAnQ0VOVFJFJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2lucHV0X3N0YXRlbWVudCcsXG4gICAgICAgICAgICAgICAgbmFtZTogJ0RPMCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0b29sdGlwOiAnJyxcbiAgICAgICAgcHJldmlvdXNTdGF0ZW1lbnQ6IG51bGwsXG4gICAgICAgIG5leHRTdGF0ZW1lbnQ6IG51bGwsXG4gICAgICAgIGNvbG91cjogJyV7QktZX0NPTlRST0xfSFVFfScsXG4gICAgICAgIGlucHV0c0lubGluZTogdHJ1ZSxcbiAgICB9LFxuICAgIGNvbnRyb2xzX2lmX2Ryb3Bkb3duX3Byb21pc2U6IHtcbiAgICAgICAgbWVzc2FnZTA6ICdJZiAocHJvbWlzZSkgJTEgJTIgJTMnLFxuICAgICAgICBhcmdzMDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdmaWVsZF9kcm9wZG93bicsXG4gICAgICAgICAgICAgICAgbmFtZTogJ0lGMCcsXG4gICAgICAgICAgICAgICAgb3B0aW9uczogW1xuICAgICAgICAgICAgICAgICAgICBbJ3N0YXRlX2lzX3RydWUnLCBuYW1lc3BhY2VfMS5uc19pZCgndGVzdF9zdGF0ZV90cnVlX3Byb21pc2UnKV0sXG4gICAgICAgICAgICAgICAgICAgIFsnc3RhdGVfaXNfZmFsc2UnLCBuYW1lc3BhY2VfMS5uc19pZCgndGVzdF9zdGF0ZV9mYWxzZV9wcm9taXNlJyldLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdpbnB1dF9kdW1teScsXG4gICAgICAgICAgICAgICAgYWxpZ246ICdDRU5UUkUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnaW5wdXRfc3RhdGVtZW50JyxcbiAgICAgICAgICAgICAgICBuYW1lOiAnRE8wJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRvb2x0aXA6ICcnLFxuICAgICAgICBwcmV2aW91c1N0YXRlbWVudDogbnVsbCxcbiAgICAgICAgbmV4dFN0YXRlbWVudDogbnVsbCxcbiAgICAgICAgY29sb3VyOiAnJXtCS1lfQ09OVFJPTF9IVUV9JyxcbiAgICAgICAgaW5wdXRzSW5saW5lOiB0cnVlLFxuICAgIH0sXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pWW14dlkydGZZMjl1Wm1sbkxtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTGk0dkxpNHZMaTR2YzNKakwyUmxkbDkwYjI5c0wzUmxjM1JmWW14dlkydHpMMkpzYjJOclgyTnZibVpwWnk1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96dEJRVVZCTEhsRFFVRnZRenRCUVVsd1F5eEpRVUZOTEZWQlFWVXNSMEZCUnl4VFFVRlRMRU5CUVVNN1FVRkZOMElzU1VGQlRTeFBRVUZQTEVkQlFXdENPMGxCUXpkQ0xFbEJRVWtzUlVGQlJTeGhRVUZoTzBsQlEyNUNMRWxCUVVrc1JVRkJSU3hUUVVGVE8wbEJRMllzUzBGQlN5eEZRVUZGTEZGQlFWRTdTVUZEWml4TFFVRkxMRVZCUVVVc1VVRkJVVHREUVVOb1FpeERRVUZETzBGQlJWY3NVVUZCUVN4WlFVRlpMRWRCUVcxQ08wbEJRekZETEVsQlFVa3NSVUZCUlR0UlFVTktMRkZCUVZFc1JVRkJSU3h2UWtGQmIwSTdVVUZET1VJc1MwRkJTeXhGUVVGRk8xbEJRMHc3WjBKQlEwVXNTVUZCU1N4RlFVRkZMR0ZCUVdFN1owSkJRMjVDTEVsQlFVa3NSVUZCUlN4elFrRkJjMEk3WjBKQlF6VkNMRXRCUVVzc1JVRkJSU3hSUVVGUk8yZENRVU5tTEV0QlFVc3NSVUZCUlN4UlFVRlJPMkZCUTJoQ08xTkJRMFk3VVVGRFJDeHBRa0ZCYVVJc1JVRkJSU3hKUVVGSk8xRkJRM1pDTEdGQlFXRXNSVUZCUlN4SlFVRkpPMUZCUTI1Q0xFOUJRVThzUlVGQlJTeEZRVUZGTzFGQlExZ3NUVUZCVFN4RlFVRkZMRlZCUVZVN1VVRkRiRUlzV1VGQldTeEZRVUZGTEVsQlFVazdTMEZEYmtJN1NVRkZSQ3hKUVVGSkxFVkJRVVU3VVVGRFNpeFJRVUZSTEVWQlFVVXNWMEZCVnp0UlFVTnlRaXhMUVVGTExFVkJRVVU3V1VGRFRDeFBRVUZQTzFOQlExSTdVVUZEUkN4cFFrRkJhVUlzUlVGQlJTeEpRVUZKTzFGQlEzWkNMR0ZCUVdFc1JVRkJSU3hKUVVGSk8xRkJRMjVDTEU5QlFVOHNSVUZCUlN4RlFVRkZPMUZCUTFnc1RVRkJUU3hGUVVGRkxGTkJRVk03VVVGRGFrSXNXVUZCV1N4RlFVRkZMRWxCUVVrN1MwRkRia0k3U1VGRlJDeEpRVUZKTEVWQlFVVTdVVUZEU2l4UlFVRlJMRVZCUVVVc1YwRkJWenRSUVVOeVFpeExRVUZMTEVWQlFVVTdXVUZEVEN4UFFVRlBPMU5CUTFJN1VVRkRSQ3hwUWtGQmFVSXNSVUZCUlN4SlFVRkpPMUZCUTNaQ0xHRkJRV0VzUlVGQlJTeEpRVUZKTzFGQlEyNUNMRTlCUVU4c1JVRkJSU3hGUVVGRk8xRkJRMWdzVFVGQlRTeEZRVUZGTEZOQlFWTTdVVUZEYWtJc1dVRkJXU3hGUVVGRkxFbEJRVWs3UzBGRGJrSTdTVUZGUkN4TlFVRk5MRVZCUVVVN1VVRkRUaXhSUVVGUkxFVkJRVVVzYjBKQlFXOUNPMUZCUXpsQ0xFdEJRVXNzUlVGQlJUdFpRVU5NTzJkQ1FVTkZMRWxCUVVrc1JVRkJSU3hoUVVGaE8yZENRVU51UWl4SlFVRkpMRVZCUVVVc1QwRkJUenRoUVVOa08xbEJRMFFzVDBGQlR6dFRRVU5TTzFGQlEwUXNhVUpCUVdsQ0xFVkJRVVVzU1VGQlNUdFJRVU4yUWl4aFFVRmhMRVZCUVVVc1NVRkJTVHRSUVVOdVFpeFBRVUZQTEVWQlFVVXNSVUZCUlR0UlFVTllMRTFCUVUwc1JVRkJSU3hWUVVGVk8xRkJRMnhDTEZsQlFWa3NSVUZCUlN4SlFVRkpPMHRCUTI1Q08wbEJSVVFzUzBGQlN5eEZRVUZGTzFGQlEwd3NVVUZCVVN4RlFVRkZMRzFDUVVGdFFqdFJRVU0zUWl4TFFVRkxMRVZCUVVVN1dVRkRURHRuUWtGRFJTeEpRVUZKTEVWQlFVVXNZVUZCWVR0blFrRkRia0lzU1VGQlNTeEZRVUZGTEU5QlFVODdZVUZEWkR0WlFVTkVMRTlCUVU4N1UwRkRVanRSUVVORUxHbENRVUZwUWl4RlFVRkZMRWxCUVVrN1VVRkRka0lzWVVGQllTeEZRVUZGTEVsQlFVazdVVUZEYmtJc1QwRkJUeXhGUVVGRkxFVkJRVVU3VVVGRFdDeE5RVUZOTEVWQlFVVXNWVUZCVlR0UlFVTnNRaXhaUVVGWkxFVkJRVVVzU1VGQlNUdExRVU51UWp0SlFVVkVMRVZCUVVVc1JVRkJSVHRSUVVOR0xGRkJRVkVzUlVGQlJTeDVRa0ZCZVVJN1VVRkRia01zUzBGQlN5eEZRVUZGTzFsQlEwdzdaMEpCUTBVc1NVRkJTU3hGUVVGRkxHRkJRV0U3WjBKQlEyNUNMRWxCUVVrc1JVRkJSU3hQUVVGUE8yRkJRMlE3V1VGRFJEdG5Ra0ZEUlN4SlFVRkpMRVZCUVVVc1lVRkJZVHRuUWtGRGJrSXNTVUZCU1N4RlFVRkZMRlZCUVZVN1lVRkRha0k3V1VGRFJDeFBRVUZQTzFOQlExSTdVVUZEUkN4cFFrRkJhVUlzUlVGQlJTeEpRVUZKTzFGQlEzWkNMR0ZCUVdFc1JVRkJSU3hKUVVGSk8xRkJRMjVDTEU5QlFVOHNSVUZCUlN4RlFVRkZPMUZCUTFnc1RVRkJUU3hGUVVGRkxGVkJRVlU3VVVGRGJFSXNXVUZCV1N4RlFVRkZMRWxCUVVrN1MwRkRia0k3U1VGRlJDeEhRVUZITEVWQlFVVTdVVUZEU0N4UlFVRlJMRVZCUVVVc05rSkJRVFpDTzFGQlEzWkRMRXRCUVVzc1JVRkJSVHRaUVVOTU8yZENRVU5GTEVsQlFVa3NSVUZCUlN4aFFVRmhPMmRDUVVOdVFpeEpRVUZKTEVWQlFVVXNUMEZCVHp0aFFVTmtPMWxCUTBRN1owSkJRMFVzU1VGQlNTeEZRVUZGTEdGQlFXRTdaMEpCUTI1Q0xFbEJRVWtzUlVGQlJTeFZRVUZWTzJGQlEycENPMWxCUTBRc1QwRkJUenRUUVVOU08xRkJRMFFzYVVKQlFXbENMRVZCUVVVc1NVRkJTVHRSUVVOMlFpeGhRVUZoTEVWQlFVVXNTVUZCU1R0UlFVTnVRaXhQUVVGUExFVkJRVVVzUlVGQlJUdFJRVU5ZTEUxQlFVMHNSVUZCUlN4VlFVRlZPMUZCUTJ4Q0xGbEJRVmtzUlVGQlJTeEpRVUZKTzB0QlEyNUNPMGxCUlVRc1NVRkJTU3hGUVVGRk8xRkJRMG9zVVVGQlVTeEZRVUZGTEdOQlFXTTdVVUZEZUVJc1MwRkJTeXhGUVVGRkxFVkJRVVU3VVVGRFZDeHBRa0ZCYVVJc1JVRkJSU3hKUVVGSk8xRkJRM1pDTEdGQlFXRXNSVUZCUlN4VFFVRlRPMUZCUTNoQ0xFOUJRVThzUlVGQlJTeEZRVUZGTzFGQlExZ3NUVUZCVFN4RlFVRkZMRlZCUVZVN1VVRkRiRUlzV1VGQldTeEZRVUZGTEVsQlFVazdTMEZEYmtJN1NVRkZSQ3hYUVVGWExFVkJRVVU3VVVGRFdDeFJRVUZSTEVWQlFVVXNLMEpCUVN0Q08xRkJRM3BETEV0QlFVc3NSVUZCUlR0WlFVTk1MRTlCUVU4N1UwRkRVanRSUVVORUxHbENRVUZwUWl4RlFVRkZMRWxCUVVrN1VVRkRka0lzWVVGQllTeEZRVUZGTEVsQlFVazdVVUZEYmtJc1QwRkJUeXhGUVVGRkxFVkJRVVU3VVVGRFdDeE5RVUZOTEVWQlFVVXNiMEpCUVc5Q08xRkJRelZDTEZsQlFWa3NSVUZCUlN4SlFVRkpPMHRCUTI1Q08wbEJSVVFzV1VGQldTeEZRVUZGTzFGQlExb3NVVUZCVVN4RlFVRkZMSFZEUVVGMVF6dFJRVU5xUkN4TFFVRkxMRVZCUVVVN1dVRkRURHRuUWtGRFJTeEpRVUZKTEVWQlFVVXNZVUZCWVR0blFrRkRia0lzU1VGQlNTeEZRVUZGTEZOQlFWTTdZVUZEYUVJN1dVRkRSRHRuUWtGRFJTeEpRVUZKTEVWQlFVVXNZVUZCWVR0blFrRkRia0lzU1VGQlNTeEZRVUZGTEdOQlFXTTdaMEpCUTNCQ0xFdEJRVXNzUlVGQlJTeFJRVUZSTzJkQ1FVTm1MRXRCUVVzc1JVRkJSU3hSUVVGUk8yRkJRMmhDTzFOQlEwWTdVVUZEUkN4cFFrRkJhVUlzUlVGQlJTeFRRVUZUTzFGQlF6VkNMR0ZCUVdFc1JVRkJSU3hUUVVGVE8xRkJRM2hDTEU5QlFVOHNSVUZCUlN4RlFVRkZPMUZCUTFnc1RVRkJUU3hGUVVGRkxHOUNRVUZ2UWp0UlFVTTFRaXhOUVVGTkxFVkJRVVVzUTBGQlF5eFJRVUZSTEVOQlFVTTdVVUZEYkVJc1dVRkJXU3hGUVVGRkxFbEJRVWs3UzBGRGJrSTdTVUZGUkN4dFFrRkJiVUlzUlVGQlJUdFJRVU51UWl4UlFVRlJMRVZCUVVVc2MwTkJRWE5ETzFGQlEyaEVMRXRCUVVzc1JVRkJSVHRaUVVOTU8yZENRVU5GTEVsQlFVa3NSVUZCUlN4aFFVRmhPMmRDUVVOdVFpeEpRVUZKTEVWQlFVVXNZVUZCWVR0aFFVTndRanRaUVVORU8yZENRVU5GTEVsQlFVa3NSVUZCUlN4aFFVRmhPMmRDUVVOdVFpeEpRVUZKTEVWQlFVVXNVVUZCVVR0aFFVTm1PMU5CUTBZN1VVRkRSQ3hwUWtGQmFVSXNSVUZCUlN4SlFVRkpPMUZCUTNaQ0xHRkJRV0VzUlVGQlJTeEpRVUZKTzFGQlEyNUNMRTlCUVU4c1JVRkJSU3hGUVVGRk8xRkJRMWdzVFVGQlRTeEZRVUZGTEhWQ1FVRjFRanRSUVVNdlFpeFpRVUZaTEVWQlFVVXNTVUZCU1R0TFFVTnVRanRKUVVWRUxHZENRVUZuUWl4RlFVRkZPMUZCUTJoQ0xGRkJRVkVzUlVGQlJTeHZRMEZCYjBNN1VVRkRPVU1zUzBGQlN5eEZRVUZGTzFsQlEwdzdaMEpCUTBVc1NVRkJTU3hGUVVGRkxHRkJRV0U3WjBKQlEyNUNMRWxCUVVrc1JVRkJSU3hwUWtGQmFVSTdZVUZEZUVJN1UwRkRSanRSUVVORUxHbENRVUZwUWl4RlFVRkZMRWxCUVVrN1VVRkRka0lzWVVGQllTeEZRVUZGTEVsQlFVazdVVUZEYmtJc1QwRkJUeXhGUVVGRkxFVkJRVVU3VVVGRFdDeE5RVUZOTEVWQlFVVXNiVUpCUVcxQ08xRkJRek5DTEZsQlFWa3NSVUZCUlN4SlFVRkpPMHRCUTI1Q08wbEJSVVFzZVVKQlFYbENMRVZCUVVVN1VVRkRla0lzVVVGQlVTeEZRVUZGTEhWQ1FVRjFRanRSUVVOcVF5eExRVUZMTEVWQlFVVXNSVUZCUlR0UlFVTlVMR2xDUVVGcFFpeEZRVUZGTEZOQlFWTTdVVUZETlVJc1lVRkJZU3hGUVVGRkxGTkJRVk03VVVGRGVFSXNUMEZCVHl4RlFVRkZMRVZCUVVVN1VVRkRXQ3hOUVVGTkxFVkJRVVVzYlVKQlFXMUNPMUZCUXpOQ0xFMUJRVTBzUlVGQlJTeERRVUZETEZGQlFWRXNRMEZCUXp0UlFVTnNRaXhaUVVGWkxFVkJRVVVzU1VGQlNUdExRVU51UWp0SlFVVkVMR05CUVdNc1JVRkJSVHRSUVVOa0xGRkJRVkVzUlVGQlJTeHpRa0ZCYzBJN1VVRkRhRU1zUzBGQlN5eEZRVUZGTzFsQlEwdzdaMEpCUTBVc1NVRkJTU3hGUVVGRkxHRkJRV0U3WjBKQlEyNUNMRXRCUVVzc1JVRkJSU3hSUVVGUk8yRkJRMmhDTzFsQlEwUTdaMEpCUTBVc1NVRkJTU3hGUVVGRkxHbENRVUZwUWp0blFrRkRka0lzU1VGQlNTeEZRVUZGTEVsQlFVazdZVUZEV0R0VFFVTkdPMUZCUTBRc1QwRkJUeXhGUVVGRkxFVkJRVVU3VVVGRFdDeE5RVUZOTEVWQlFVVXNiVUpCUVcxQ08xRkJRek5DTEZsQlFWa3NSVUZCUlN4SlFVRkpPMHRCUTI1Q08wbEJSVVFzYzBKQlFYTkNMRVZCUVVVN1VVRkRkRUlzVVVGQlVTeEZRVUZGTERKQ1FVRXlRanRSUVVOeVF5eExRVUZMTEVWQlFVVTdXVUZEVER0blFrRkRSU3hKUVVGSkxFVkJRVVVzWVVGQllUdG5Ra0ZEYmtJc1NVRkJTU3hGUVVGRkxHTkJRV003WjBKQlEzQkNMRXRCUVVzc1JVRkJSU3hSUVVGUk8yZENRVU5tTEV0QlFVc3NSVUZCUlN4UlFVRlJPMkZCUTJoQ08xTkJRMFk3VVVGRFJDeHBRa0ZCYVVJc1JVRkJSU3hKUVVGSk8xRkJRM1pDTEdGQlFXRXNSVUZCUlN4SlFVRkpPMUZCUTI1Q0xFOUJRVThzUlVGQlJTeEZRVUZGTzFGQlExZ3NUVUZCVFN4RlFVRkZMRk5CUVZNN1VVRkRha0lzV1VGQldTeEZRVUZGTEVsQlFVazdTMEZEYmtJN1NVRkZSQ3hYUVVGWExFVkJRVVU3VVVGRFdDeFJRVUZSTEVWQlFVVXNaMEpCUVdkQ08xRkJRekZDTEV0QlFVc3NSVUZCUlR0WlFVTk1MRTlCUVU4N1UwRkRVanRSUVVORUxHbENRVUZwUWl4RlFVRkZMRWxCUVVrN1VVRkRka0lzWVVGQllTeEZRVUZGTEVsQlFVazdVVUZEYmtJc1QwRkJUeXhGUVVGRkxFVkJRVVU3VVVGRFdDeE5RVUZOTEVWQlFVVXNVMEZCVXp0UlFVTnFRaXhaUVVGWkxFVkJRVVVzU1VGQlNUdExRVU51UWp0SlFVVkVMR1ZCUVdVc1JVRkJSVHRSUVVObUxGRkJRVkVzUlVGQlJTeDFRa0ZCZFVJN1VVRkRha01zUzBGQlN5eEZRVUZGTzFsQlEwdzdaMEpCUTBVc1NVRkJTU3hGUVVGRkxHRkJRV0U3WjBKQlEyNUNMRXRCUVVzc1JVRkJSU3hSUVVGUk8yRkJRMmhDTzFsQlEwUTdaMEpCUTBVc1NVRkJTU3hGUVVGRkxHbENRVUZwUWp0blFrRkRka0lzU1VGQlNTeEZRVUZGTEVsQlFVazdZVUZEV0R0VFFVTkdPMUZCUTBRc1RVRkJUU3hGUVVGRkxHMUNRVUZ0UWp0UlFVTXpRaXhaUVVGWkxFVkJRVVVzU1VGQlNUdExRVU51UWp0SlFVVkVMRmRCUVZjc1JVRkJSVHRSUVVOWUxGRkJRVkVzUlVGQlJTeGhRVUZoTzFGQlEzWkNMRXRCUVVzc1JVRkJSU3hGUVVGRk8xRkJRMVFzYVVKQlFXbENMRVZCUVVVc1NVRkJTVHRSUVVOMlFpeGhRVUZoTEVWQlFVVXNTVUZCU1R0UlFVTnVRaXhQUVVGUExFVkJRVVVzUlVGQlJUdFJRVU5ZTEUxQlFVMHNSVUZCUlN4VFFVRlRPMUZCUTJwQ0xGbEJRVmtzUlVGQlJTeEpRVUZKTzB0QlEyNUNPMGxCUlVRc1kwRkJZeXhGUVVGRk8xRkJRMlFzVVVGQlVTeEZRVUZGTEc5Q1FVRnZRanRSUVVNNVFpeExRVUZMTEVWQlFVVTdXVUZEVER0blFrRkRSU3hKUVVGSkxFVkJRVVVzWjBKQlFXZENPMmRDUVVOMFFpeEpRVUZKTEVWQlFVVXNUMEZCVHp0blFrRkRZaXhQUVVGUExFVkJRVVU3YjBKQlExQXNRMEZCUXl4TlFVRk5MRVZCUVVVc1RVRkJUU3hEUVVGRE8yOUNRVU5vUWl4RFFVRkRMRTlCUVU4c1JVRkJSU3hQUVVGUExFTkJRVU03YVVKQlEyNUNPMkZCUTBZN1UwRkRSanRSUVVORUxHbENRVUZwUWl4RlFVRkZMRWxCUVVrN1VVRkRka0lzWVVGQllTeEZRVUZGTEVsQlFVazdVVUZEYmtJc1QwRkJUeXhGUVVGRkxFVkJRVVU3VVVGRFdDeE5RVUZOTEVWQlFVVXNiMEpCUVc5Q08xRkJRelZDTEZsQlFWa3NSVUZCUlN4SlFVRkpPMHRCUTI1Q08wbEJSVVFzWTBGQll5eEZRVUZGTzFGQlEyUXNVVUZCVVN4RlFVRkZMR2RDUVVGblFqdFJRVU14UWl4TFFVRkxMRVZCUVVVc1JVRkJSVHRSUVVOVUxFOUJRVThzUlVGQlJTeEZRVUZGTzFGQlExZ3NUVUZCVFN4RlFVRkZMRzlDUVVGdlFqdFJRVU0xUWl4TlFVRk5MRVZCUVVVc1EwRkJReXhUUVVGVExFTkJRVU03VVVGRGJrSXNXVUZCV1N4RlFVRkZMRWxCUVVrN1MwRkRia0k3U1VGRlJDeHZRa0ZCYjBJc1JVRkJSVHRSUVVOd1FpeFJRVUZSTEVWQlFVVXNlVU5CUVhsRE8xRkJRMjVFTEV0QlFVc3NSVUZCUlR0WlFVTk1PMmRDUVVORkxFbEJRVWtzUlVGQlJTeG5Ra0ZCWjBJN1owSkJRM1JDTEVsQlFVa3NSVUZCUlN4TFFVRkxPMmRDUVVOWUxFOUJRVThzUlVGQlJUdHZRa0ZEVUN4RFFVRkRMR1ZCUVdVc1JVRkJSU3hwUWtGQlN5eERRVUZETEdsQ1FVRnBRaXhEUVVGRExFTkJRVU03YjBKQlF6TkRMRU5CUVVNc1owSkJRV2RDTEVWQlFVVXNhVUpCUVVzc1EwRkJReXhyUWtGQmEwSXNRMEZCUXl4RFFVRkRPMmxDUVVNNVF6dGhRVU5HTzFsQlEwUTdaMEpCUTBVc1NVRkJTU3hGUVVGRkxHRkJRV0U3WjBKQlEyNUNMRXRCUVVzc1JVRkJSU3hSUVVGUk8yRkJRMmhDTzFsQlEwUTdaMEpCUTBVc1NVRkJTU3hGUVVGRkxHbENRVUZwUWp0blFrRkRka0lzU1VGQlNTeEZRVUZGTEV0QlFVczdZVUZEV2p0WlFVTkVPMmRDUVVORkxFbEJRVWtzUlVGQlJTeG5Ra0ZCWjBJN1owSkJRM1JDTEVsQlFVa3NSVUZCUlN4TFFVRkxPMmRDUVVOWUxFOUJRVThzUlVGQlJUdHZRa0ZEVUN4RFFVRkRMRzFDUVVGdFFpeEZRVUZGTEdsQ1FVRkxMRU5CUVVNc2EwSkJRV3RDTEVOQlFVTXNRMEZCUXp0dlFrRkRhRVFzUTBGQlF5eHZRa0ZCYjBJc1JVRkJSU3hwUWtGQlN5eERRVUZETEdsQ1FVRnBRaXhEUVVGRExFTkJRVU03YVVKQlEycEVPMkZCUTBZN1dVRkRSRHRuUWtGRFJTeEpRVUZKTEVWQlFVVXNZVUZCWVR0blFrRkRia0lzUzBGQlN5eEZRVUZGTEZGQlFWRTdZVUZEYUVJN1dVRkRSRHRuUWtGRFJTeEpRVUZKTEVWQlFVVXNhVUpCUVdsQ08yZENRVU4yUWl4SlFVRkpMRVZCUVVVc1MwRkJTenRoUVVOYU8xbEJRMFE3WjBKQlEwVXNTVUZCU1N4RlFVRkZMR0ZCUVdFN1owSkJRMjVDTEV0QlFVc3NSVUZCUlN4UlFVRlJPMkZCUTJoQ08xbEJRMFE3WjBKQlEwVXNTVUZCU1N4RlFVRkZMR2xDUVVGcFFqdG5Ra0ZEZGtJc1NVRkJTU3hGUVVGRkxFMUJRVTA3WVVGRFlqdFRRVU5HTzFGQlEwUXNUMEZCVHl4RlFVRkZMRVZCUVVVN1VVRkRXQ3hwUWtGQmFVSXNSVUZCUlN4SlFVRkpPMUZCUTNaQ0xHRkJRV0VzUlVGQlJTeEpRVUZKTzFGQlEyNUNMRTFCUVUwc1JVRkJSU3h2UWtGQmIwSTdVVUZETlVJc1dVRkJXU3hGUVVGRkxFbEJRVWs3UzBGRGJrSTdTVUZGUkN3eVFrRkJNa0lzUlVGQlJUdFJRVU16UWl4UlFVRlJMRVZCUVVVc1lVRkJZVHRSUVVOMlFpeExRVUZMTEVWQlFVVTdXVUZEVER0blFrRkRSU3hKUVVGSkxFVkJRVVVzWjBKQlFXZENPMmRDUVVOMFFpeEpRVUZKTEVWQlFVVXNTMEZCU3p0blFrRkRXQ3hQUVVGUExFVkJRVVU3YjBKQlExQXNRMEZCUXl4bFFVRmxMRVZCUVVVc2FVSkJRVXNzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhEUVVGRE8yOUNRVU16UXl4RFFVRkRMR2RDUVVGblFpeEZRVUZGTEdsQ1FVRkxMRU5CUVVNc2EwSkJRV3RDTEVOQlFVTXNRMEZCUXp0cFFrRkRPVU03WVVGRFJqdFpRVU5FTzJkQ1FVTkZMRWxCUVVrc1JVRkJSU3hoUVVGaE8yZENRVU51UWl4TFFVRkxMRVZCUVVVc1VVRkJVVHRoUVVOb1FqdFpRVU5FTzJkQ1FVTkZMRWxCUVVrc1JVRkJSU3hwUWtGQmFVSTdaMEpCUTNaQ0xFbEJRVWtzUlVGQlJTeExRVUZMTzJGQlExbzdVMEZEUmp0UlFVTkVMRTlCUVU4c1JVRkJSU3hGUVVGRk8xRkJRMWdzYVVKQlFXbENMRVZCUVVVc1NVRkJTVHRSUVVOMlFpeGhRVUZoTEVWQlFVVXNTVUZCU1R0UlFVTnVRaXhOUVVGTkxFVkJRVVVzYjBKQlFXOUNPMUZCUXpWQ0xGbEJRVmtzUlVGQlJTeEpRVUZKTzB0QlEyNUNPMGxCUlVRc05FSkJRVFJDTEVWQlFVVTdVVUZETlVJc1VVRkJVU3hGUVVGRkxIVkNRVUYxUWp0UlFVTnFReXhMUVVGTExFVkJRVVU3V1VGRFREdG5Ra0ZEUlN4SlFVRkpMRVZCUVVVc1owSkJRV2RDTzJkQ1FVTjBRaXhKUVVGSkxFVkJRVVVzUzBGQlN6dG5Ra0ZEV0N4UFFVRlBMRVZCUVVVN2IwSkJRMUFzUTBGQlF5eGxRVUZsTEVWQlFVVXNhVUpCUVVzc1EwRkJReXg1UWtGQmVVSXNRMEZCUXl4RFFVRkRPMjlDUVVOdVJDeERRVUZETEdkQ1FVRm5RaXhGUVVGRkxHbENRVUZMTEVOQlFVTXNNRUpCUVRCQ0xFTkJRVU1zUTBGQlF6dHBRa0ZEZEVRN1lVRkRSanRaUVVORU8yZENRVU5GTEVsQlFVa3NSVUZCUlN4aFFVRmhPMmRDUVVOdVFpeExRVUZMTEVWQlFVVXNVVUZCVVR0aFFVTm9RanRaUVVORU8yZENRVU5GTEVsQlFVa3NSVUZCUlN4cFFrRkJhVUk3WjBKQlEzWkNMRWxCUVVrc1JVRkJSU3hMUVVGTE8yRkJRMW83VTBGRFJqdFJRVU5FTEU5QlFVOHNSVUZCUlN4RlFVRkZPMUZCUTFnc2FVSkJRV2xDTEVWQlFVVXNTVUZCU1R0UlFVTjJRaXhoUVVGaExFVkJRVVVzU1VGQlNUdFJRVU51UWl4TlFVRk5MRVZCUVVVc2IwSkJRVzlDTzFGQlF6VkNMRmxCUVZrc1JVRkJSU3hKUVVGSk8wdEJRMjVDTzBOQlJVWXNRMEZCUXlKOSIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIG1lc3NhZ2UgPSBcIlxcbiAgPHZhbHVlIG5hbWU9XFxcIm1lc3NhZ2VcXFwiPlxcbiAgICA8c2hhZG93IHR5cGU9XFxcInRleHRcXFwiPlxcbiAgICAgIDxmaWVsZCBuYW1lPVxcXCJURVhUXFxcIj48L2ZpZWxkPlxcbiAgICA8L3NoYWRvdz5cXG4gIDwvdmFsdWU+XFxuXCI7XG5leHBvcnRzLnBsYW4gPSBcIlxcbiAgPHZhbHVlIG5hbWU9XFxcIm5fcGxhbm5lZF9hc3NlcnRpb25zXFxcIj5cXG4gICAgPHNoYWRvdyB0eXBlPVxcXCJtYXRoX251bWJlclxcXCI+XFxuICAgICAgPGZpZWxkIG5hbWU9XFxcIk5VTVxcXCI+MTwvZmllbGQ+XFxuICAgIDwvc2hhZG93PlxcbiAgPC92YWx1ZT5cXG5cIjtcbmV4cG9ydHMuZmFpbCA9IG1lc3NhZ2U7XG5leHBvcnRzLnBhc3MgPSBtZXNzYWdlO1xuZXhwb3J0cy50cnV0aHkgPSBtZXNzYWdlO1xuZXhwb3J0cy5mYWxzeSA9IG1lc3NhZ2U7XG5leHBvcnRzLmlzID0gbWVzc2FnZTtcbmV4cG9ydHMubm90ID0gbWVzc2FnZTtcbmV4cG9ydHMuZ29vZF9wcm9taXNlID0gXCJcXG4gIDx2YWx1ZSBuYW1lPVxcXCJyZXR1cm5zXFxcIj5cXG4gICAgPHNoYWRvdyB0eXBlPVxcXCJ0ZXh0XFxcIj5cXG4gICAgICA8ZmllbGQgbmFtZT1cXFwiVEVYVFxcXCI+c3VjY2VzczwvZmllbGQ+XFxuICAgIDwvc2hhZG93PlxcbiAgPC92YWx1ZT5cXG4gIDx2YWx1ZSBuYW1lPVxcXCJtaWxsaXNlY29uZHNcXFwiPlxcbiAgICA8c2hhZG93IHR5cGU9XFxcIm1hdGhfbnVtYmVyXFxcIj5cXG4gICAgICA8ZmllbGQgbmFtZT1cXFwiTlVNXFxcIj40MDwvZmllbGQ+XFxuICAgIDwvc2hhZG93PlxcbiAgPC92YWx1ZT5cXG5cIjtcbmV4cG9ydHMuYmFkX3Byb21pc2UgPSBtZXNzYWdlO1xuZXhwb3J0cy5zZW5kX3Rlc3RfYWN0aW9uID0gXCJcXG4gIDx2YWx1ZSBuYW1lPVxcXCJwYXJhbWV0ZXJfdmFsdWVcXFwiPlxcbiAgICA8c2hhZG93IHR5cGU9XFxcInRleHRcXFwiPlxcbiAgICAgIDxmaWVsZCBuYW1lPVxcXCJURVhUXFxcIj5oZWxsbzwvZmllbGQ+XFxuICAgIDwvc2hhZG93PlxcbiAgPC92YWx1ZT5cXG5cIjtcbmV4cG9ydHMuY29uc29sZV9sb2cgPSBtZXNzYWdlO1xuZXhwb3J0cy5jcmVhdGVfZW50aXR5X2luc3RhbmNlID0gXCJcXG4gIDx2YWx1ZSBuYW1lPVxcXCJ0eXBlY2xhc3NfaWRcXFwiPlxcbiAgICA8c2hhZG93IHR5cGU9XFxcInRleHRcXFwiPlxcbiAgICAgIDxmaWVsZCBuYW1lPVxcXCJURVhUXFxcIj50eXBlY2xhc3NpZDwvZmllbGQ+XFxuICAgIDwvc2hhZG93PlxcbiAgPC92YWx1ZT5cXG5cIjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaVlteHZZMnRmZUcxc0xtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTGk0dkxpNHZMaTR2YzNKakwyUmxkbDkwYjI5c0wzUmxjM1JmWW14dlkydHpMMkpzYjJOclgzaHRiQzUwY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3p0QlFVRkJMRWxCUVUwc1QwRkJUeXhIUVVGSExEUklRVTFtTEVOQlFVTTdRVUZGVnl4UlFVRkJMRWxCUVVrc1IwRkJSeXhuU2tGTmJrSXNRMEZCUXp0QlFVVlhMRkZCUVVFc1NVRkJTU3hIUVVGSExFOUJRVThzUTBGQlF6dEJRVU5tTEZGQlFVRXNTVUZCU1N4SFFVRkhMRTlCUVU4c1EwRkJRenRCUVVObUxGRkJRVUVzVFVGQlRTeEhRVUZITEU5QlFVOHNRMEZCUXp0QlFVTnFRaXhSUVVGQkxFdEJRVXNzUjBGQlJ5eFBRVUZQTEVOQlFVTTdRVUZEYUVJc1VVRkJRU3hGUVVGRkxFZEJRVWNzVDBGQlR5eERRVUZETzBGQlEySXNVVUZCUVN4SFFVRkhMRWRCUVVjc1QwRkJUeXhEUVVGRE8wRkJSV1FzVVVGQlFTeFpRVUZaTEVkQlFVY3NkMUZCVnpOQ0xFTkJRVU03UVVGRlZ5eFJRVUZCTEZkQlFWY3NSMEZCUnl4UFFVRlBMRU5CUVVNN1FVRkZkRUlzVVVGQlFTeG5Ra0ZCWjBJc1IwRkJSeXg1U1VGTkwwSXNRMEZCUXp0QlFVVlhMRkZCUVVFc1YwRkJWeXhIUVVGSExFOUJRVThzUTBGQlF6dEJRVU4wUWl4UlFVRkJMSE5DUVVGelFpeEhRVUZITERSSlFVMXlReXhEUVVGREluMD0iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xudmFyIE5BTUVTUEFDRSA9ICdBVVRPTUFURURURVNUUyc7XG5mdW5jdGlvbiBnZXRfZG9tYWluX2Z1bmN0aW9ucyhhc3NlcnRpb25fdG9vbCwgdGVzdF9kb25lX2NhbGxiYWNrKSB7XG4gICAgdmFyIG5fY3JlYXRlZF9lbnRpdGllcyA9IDA7XG4gICAgdmFyIGlmX2Ryb3Bkb3duX3N0YXRlID0gZmFsc2U7XG4gICAgdmFyIHQgPSBhc3NlcnRpb25fdG9vbDtcbiAgICB2YXIgZG9tYWluX2Z1bmN0aW9ucyA9IHtcbiAgICAgICAgcGxhbjogZnVuY3Rpb24gKGFyZ3MsIGludGVycHJldGVyX2lkLCBlbnRpdHlfaWQsIGludGVybmFscykge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgKF9hID0gdCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnBsYW4oYXJncy5uX3BsYW5uZWRfYXNzZXJ0aW9ucyk7XG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uIChhcmdzLCBpbnRlcnByZXRlcl9pZCwgZW50aXR5X2lkLCBpbnRlcm5hbHMpIHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIChfYSA9IHQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5mYWlsKGFyZ3MubWVzc2FnZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHBhc3M6IGZ1bmN0aW9uIChhcmdzLCBpbnRlcnByZXRlcl9pZCwgZW50aXR5X2lkLCBpbnRlcm5hbHMpIHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIChfYSA9IHQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5wYXNzKGFyZ3MubWVzc2FnZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHRydXRoeTogZnVuY3Rpb24gKGFyZ3MsIGludGVycHJldGVyX2lkLCBlbnRpdHlfaWQsIGludGVybmFscykge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgKF9hID0gdCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnRydXRoeShhcmdzLnZhbHVlLCBhcmdzLm1lc3NhZ2UpO1xuICAgICAgICB9LFxuICAgICAgICBmYWxzeTogZnVuY3Rpb24gKGFyZ3MsIGludGVycHJldGVyX2lkLCBlbnRpdHlfaWQsIGludGVybmFscykge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgKF9hID0gdCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmZhbHN5KGFyZ3MudmFsdWUsIGFyZ3MubWVzc2FnZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGlzOiBmdW5jdGlvbiAoYXJncywgaW50ZXJwcmV0ZXJfaWQsIGVudGl0eV9pZCwgaW50ZXJuYWxzKSB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAoX2EgPSB0KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuaXMoYXJncy52YWx1ZSwgYXJncy5leHBlY3RlZCwgYXJncy5tZXNzYWdlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbm90OiBmdW5jdGlvbiAoYXJncywgaW50ZXJwcmV0ZXJfaWQsIGVudGl0eV9pZCwgaW50ZXJuYWxzKSB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAoX2EgPSB0KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Eubm90KGFyZ3MudmFsdWUsIGFyZ3MuZXhwZWN0ZWQsIGFyZ3MubWVzc2FnZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGRvbmU6IGZ1bmN0aW9uIChhcmdzLCBpbnRlcnByZXRlcl9pZCwgZW50aXR5X2lkLCBpbnRlcm5hbHMpIHtcbiAgICAgICAgICAgIHRlc3RfZG9uZV9jYWxsYmFjaygpO1xuICAgICAgICB9LFxuICAgICAgICBiYWRfcHJvbWlzZTogZnVuY3Rpb24gKGFyZ3MsIGludGVycHJldGVyX2lkLCBlbnRpdHlfaWQsIGludGVybmFscykge1xuICAgICAgICAgICAgcmV0dXJuIHRzbGliXzEuX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRzbGliXzEuX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGludGVybmFscy5jcmVhdGVfZG9tYWluX2Z1bmN0aW9uX2Vycm9yKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdGl2ZV9lcnJvcjogbmV3IEVycm9yKCdUaHJldyBlcnJvciBvbiBwdXJwb3NlLicpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdBbm5vdGF0aW9uOiBUaHJldyBlcnJvciBpbiBiYWRfcHJvbWlzZSBvbiBwdXJwb3NlLicsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IE5BTUVTUEFDRSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZ29vZF9wcm9taXNlOiBmdW5jdGlvbiAoYXJncywgaW50ZXJwcmV0ZXJfaWQsIGVudGl0eV9pZCwgaW50ZXJuYWxzKSB7XG4gICAgICAgICAgICByZXR1cm4gdHNsaWJfMS5fX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHNsaWJfMS5fX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlc29sdmUoYXJncy5yZXR1cm5zKTsgfSwgYXJncy5taWxsaXNlY29uZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNhbGxfdXNlcl9wcm9jZWR1cmU6IGZ1bmN0aW9uIChhcmdzLCBpbnRlcnByZXRlcl9pZCwgZW50aXR5X2lkLCBpbnRlcm5hbHMpIHtcbiAgICAgICAgICAgIGludGVybmFscy5hZGRfdXNlcl9wcm9jZWR1cmVfY2FsbF90b19zdGFjayhhcmdzLmZ1bmN0aW9uX2lkLCBlbnRpdHlfaWQsIHtcbiAgICAgICAgICAgICAgICBhcmdvbmU6IGFyZ3MuYXJnb25lLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHNlbmRfdGVzdF9hY3Rpb246IGZ1bmN0aW9uIChhcmdzLCBpbnRlcnByZXRlcl9pZCwgZW50aXR5X2lkLCBpbnRlcm5hbHMpIHtcbiAgICAgICAgICAgIGludGVybmFscy5ydW50aW1lX21hbmFnZXIuc2VuZF9hY3Rpb24oe1xuICAgICAgICAgICAgICAgIGlkOiAndGVzdGFjdGlvbicsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiAnQVVUT01BVEVEVEVTVFMnLFxuICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVzdF9wYXJhbWV0ZXI6IGFyZ3MucGFyYW1ldGVyX3ZhbHVlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0X3Rlc3RfYWN0aW9uX3BhcmFtZXRlcjogZnVuY3Rpb24gKGFyZ3MsIGludGVycHJldGVyX2lkLCBlbnRpdHlfaWQsIGludGVybmFscykge1xuICAgICAgICAgICAgLy8gaWYgYWNjZXNzaW5nIHVuZGVmaW5lZCBhY3Rpb24gcGFyYW1ldGVycywgZXJyb3Igd291bGQgYmUgaGFuZGxlZCBieSBnZXRfYWN0aW9uX3BhcmFtZXRlcigpXG4gICAgICAgICAgICB2YXIgcGFyYW1fdmFsdWUgPSBpbnRlcm5hbHMuZ2V0X2FjdGlvbl9wYXJhbWV0ZXIoJ3Rlc3RfcGFyYW1ldGVyJyk7XG4gICAgICAgICAgICByZXR1cm4gcGFyYW1fdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGNyZWF0ZV9lbnRpdHlfaW5zdGFuY2U6IGZ1bmN0aW9uIChhcmdzLCBpbnRlcnByZXRlcl9pZCwgZW50aXR5X2lkLCBpbnRlcm5hbHMpIHtcbiAgICAgICAgICAgIHZhciB0eXBlY2xhc3NfaWQgPSBhcmdzLnR5cGVjbGFzc19pZDtcbiAgICAgICAgICAgIHZhciBybSA9IGludGVybmFscy5ydW50aW1lX21hbmFnZXI7XG4gICAgICAgICAgICB2YXIgbmV3X2VudGl0eV9pZCA9IFwidGVzdF9jcmVhdGVlbnRpdHlpbnN0YW5jZV9cIiArIG5fY3JlYXRlZF9lbnRpdGllcztcbiAgICAgICAgICAgIG5fY3JlYXRlZF9lbnRpdGllcyArPSAxO1xuICAgICAgICAgICAgdmFyIHJlcyA9IHJtLmNyZWF0ZV9lbnRpdHlfaW5zdGFuY2UodHlwZWNsYXNzX2lkLCBuZXdfZW50aXR5X2lkKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHIgPSByZXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHIua2luZCA9PSAnZXJyb3InKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Iocik7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVycm9yIGNyZWF0aW5nIGVudGl0eSBpbnN0YW5jZS5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjb25zb2xlX2xvZzogZnVuY3Rpb24gKGFyZ3MsIGludGVycHJldGVyX2lkLCBlbnRpdHlfaWQsIGludGVybmFscykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2c6IFwiICsgYXJncy5tZXNzYWdlKTtcbiAgICAgICAgfSxcbiAgICAgICAgcHVsbF9ldmVudF90ZXN0OiBmdW5jdGlvbiAoYXJncywgaW50ZXJwcmV0ZXJfaWQsIGVudGl0eV9pZCwgaW50ZXJuYWxzKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgdGhyb3dfZXJyb3I6IGZ1bmN0aW9uIChhcmdzLCBpbnRlcnByZXRlcl9pZCwgZW50aXR5X2lkLCBpbnRlcm5hbHMpIHtcbiAgICAgICAgICAgIHRocm93IGludGVybmFscy5jcmVhdGVfZG9tYWluX2Z1bmN0aW9uX2Vycm9yKHtcbiAgICAgICAgICAgICAgICBuYXRpdmVfZXJyb3I6IG5ldyBFcnJvcignVGhyZXcgZXJyb3Igb24gcHVycG9zZS4nKSxcbiAgICAgICAgICAgICAgICBpZDogJ0Fubm90YXRpb246IFRocmV3IGVycm9yIGluIHRocm93X2Vycm9yIG9uIHB1cnBvc2UuJyxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IE5BTUVTUEFDRSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBzZXRfdGVzdF9zdGF0ZTogZnVuY3Rpb24gKGFyZ3MsIGludGVycHJldGVyX2lkLCBlbnRpdHlfaWQsIGludGVybmFscykge1xuICAgICAgICAgICAgaWZfZHJvcGRvd25fc3RhdGUgPSBhcmdzLnN0YXRlID09PSAndHJ1ZSc7XG4gICAgICAgIH0sXG4gICAgICAgIGdldF90ZXN0X3N0YXRlOiBmdW5jdGlvbiAoYXJncywgaW50ZXJwcmV0ZXJfaWQsIGVudGl0eV9pZCwgaW50ZXJuYWxzKSB7XG4gICAgICAgICAgICByZXR1cm4gaWZfZHJvcGRvd25fc3RhdGU7XG4gICAgICAgIH0sXG4gICAgICAgIHRlc3Rfc3RhdGVfdHJ1ZTogZnVuY3Rpb24gKGFyZ3MsIGludGVycHJldGVyX2lkLCBlbnRpdHlfaWQsIGludGVybmFscykge1xuICAgICAgICAgICAgcmV0dXJuIGlmX2Ryb3Bkb3duX3N0YXRlO1xuICAgICAgICB9LFxuICAgICAgICB0ZXN0X3N0YXRlX2ZhbHNlOiBmdW5jdGlvbiAoYXJncywgaW50ZXJwcmV0ZXJfaWQsIGVudGl0eV9pZCwgaW50ZXJuYWxzKSB7XG4gICAgICAgICAgICByZXR1cm4gIWlmX2Ryb3Bkb3duX3N0YXRlO1xuICAgICAgICB9LFxuICAgICAgICB0ZXN0X3N0YXRlX3RydWVfcHJvbWlzZTogZnVuY3Rpb24gKGFyZ3MsIGludGVycHJldGVyX2lkLCBlbnRpdHlfaWQsIGludGVybmFscykge1xuICAgICAgICAgICAgcmV0dXJuIHRzbGliXzEuX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRzbGliXzEuX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0IC8qeWllbGQqLywgd2FpdCg2NildO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgaWZfZHJvcGRvd25fc3RhdGVdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVzdF9zdGF0ZV9mYWxzZV9wcm9taXNlOiBmdW5jdGlvbiAoYXJncywgaW50ZXJwcmV0ZXJfaWQsIGVudGl0eV9pZCwgaW50ZXJuYWxzKSB7XG4gICAgICAgICAgICByZXR1cm4gdHNsaWJfMS5fX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHNsaWJfMS5fX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCB3YWl0KDY2KV07XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCAhaWZfZHJvcGRvd25fc3RhdGVdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7IHJldHVybiBkb21haW5fZnVuY3Rpb25zOyB9O1xufVxuZXhwb3J0cy5nZXRfZG9tYWluX2Z1bmN0aW9ucyA9IGdldF9kb21haW5fZnVuY3Rpb25zO1xuZnVuY3Rpb24gd2FpdChtcykge1xuICAgIHJldHVybiB0c2xpYl8xLl9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdHNsaWJfMS5fX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyByZXR1cm4gcmVzb2x2ZSgpOyB9LCBtcyk7XG4gICAgICAgICAgICAgICAgfSldO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmV4cG9ydHMud2FpdCA9IHdhaXQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2laRzl0WVdsdVgyWjFibU4wYVc5dWN5NXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMeTR1TDNOeVl5OWtaWFpmZEc5dmJDOTBaWE4wWDJKc2IyTnJjeTlrYjIxaGFXNWZablZ1WTNScGIyNXpMblJ6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3p0QlFVZEJMRWxCUVUwc1UwRkJVeXhIUVVGSExHZENRVUZuUWl4RFFVRkRPMEZCUTI1RExGTkJRV2RDTEc5Q1FVRnZRaXhEUVVOb1F5eGpRVUV3UkN4RlFVTXhSQ3hyUWtGQk5rSTdTVUZITDBJc1NVRkJTU3hyUWtGQmEwSXNSMEZCUnl4RFFVRkRMRU5CUVVNN1NVRkRNMElzU1VGQlNTeHBRa0ZCYVVJc1IwRkJSeXhMUVVGTExFTkJRVU03U1VGRk9VSXNTVUZCVFN4RFFVRkRMRWRCUVVjc1kwRkJZeXhEUVVGRE8wbEJRM3BDTEVsQlFVMHNaMEpCUVdkQ0xFZEJRV2RDTzFGQlEzQkRMRWxCUVVrc1dVRkJReXhKUVVGSkxFVkJRVVVzWTBGQll5eEZRVUZGTEZOQlFWTXNSVUZCUlN4VFFVRlRPenRaUVVNM1F5eE5RVUZCTEVOQlFVTXNNRU5CUVVVc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eHZRa0ZCYjBJc1JVRkJSVHRSUVVOeVF5eERRVUZETzFGQlJVUXNTVUZCU1N4WlFVRkRMRWxCUVVrc1JVRkJSU3hqUVVGakxFVkJRVVVzVTBGQlV5eEZRVUZGTEZOQlFWTTdPMWxCUXpkRExFMUJRVUVzUTBGQlF5d3dRMEZCUlN4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFOUJRVThzUlVGQlJUdFJRVU40UWl4RFFVRkRPMUZCUlVRc1NVRkJTU3haUVVGRExFbEJRVWtzUlVGQlJTeGpRVUZqTEVWQlFVVXNVMEZCVXl4RlFVRkZMRk5CUVZNN08xbEJRemRETEUxQlFVRXNRMEZCUXl3d1EwRkJSU3hKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEU5QlFVOHNSVUZCUlR0UlFVTjRRaXhEUVVGRE8xRkJSVVFzVFVGQlRTeFpRVUZETEVsQlFVa3NSVUZCUlN4alFVRmpMRVZCUVVVc1UwRkJVeXhGUVVGRkxGTkJRVk03TzFsQlF5OURMRTFCUVVFc1EwRkJReXd3UTBGQlJTeE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1JVRkJSU3hKUVVGSkxFTkJRVU1zVDBGQlR5eEZRVUZGTzFGQlEzUkRMRU5CUVVNN1VVRkZSQ3hMUVVGTExGbEJRVU1zU1VGQlNTeEZRVUZGTEdOQlFXTXNSVUZCUlN4VFFVRlRMRVZCUVVVc1UwRkJVenM3V1VGRE9VTXNUVUZCUVN4RFFVRkRMREJEUVVGRkxFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RlFVRkZMRWxCUVVrc1EwRkJReXhQUVVGUExFVkJRVVU3VVVGRGNrTXNRMEZCUXp0UlFVVkVMRVZCUVVVc1dVRkJReXhKUVVGSkxFVkJRVVVzWTBGQll5eEZRVUZGTEZOQlFWTXNSVUZCUlN4VFFVRlRPenRaUVVNelF5eE5RVUZCTEVOQlFVTXNNRU5CUVVVc1JVRkJSU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVWQlFVVXNTVUZCU1N4RFFVRkRMRkZCUVZFc1JVRkJSU3hKUVVGSkxFTkJRVU1zVDBGQlR5eEZRVUZGTzFGQlEycEVMRU5CUVVNN1VVRkZSQ3hIUVVGSExGbEJRVU1zU1VGQlNTeEZRVUZGTEdOQlFXTXNSVUZCUlN4VFFVRlRMRVZCUVVVc1UwRkJVenM3V1VGRE5VTXNUVUZCUVN4RFFVRkRMREJEUVVGRkxFZEJRVWNzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RlFVRkZMRWxCUVVrc1EwRkJReXhSUVVGUkxFVkJRVVVzU1VGQlNTeERRVUZETEU5QlFVOHNSVUZCUlR0UlFVTnNSQ3hEUVVGRE8xRkJSVVFzU1VGQlNTeFpRVUZETEVsQlFVa3NSVUZCUlN4alFVRmpMRVZCUVVVc1UwRkJVeXhGUVVGRkxGTkJRVk03V1VGRE4wTXNhMEpCUVd0Q0xFVkJRVVVzUTBGQlF6dFJRVU4yUWl4RFFVRkRPMUZCUlVzc1YwRkJWeXhaUVVGRExFbEJRVWtzUlVGQlJTeGpRVUZqTEVWQlFVVXNVMEZCVXl4RlFVRkZMRk5CUVZNN096dHZRa0ZETVVRc1RVRkJUU3hUUVVGVExFTkJRVU1zTkVKQlFUUkNMRU5CUVVNN2QwSkJRek5ETEZsQlFWa3NSVUZCUlN4SlFVRkpMRXRCUVVzc1EwRkJReXg1UWtGQmVVSXNRMEZCUXp0M1FrRkRiRVFzUlVGQlJTeEZRVUZGTEc5RVFVRnZSRHQzUWtGRGVFUXNVMEZCVXl4RlFVRkZMRk5CUVZNN2NVSkJRM0pDTEVOQlFVTXNRMEZCUXpzN08xTkJRMG83VVVGRlN5eFpRVUZaTEVWQlFXeENMRlZCUVcxQ0xFbEJRVWtzUlVGQlJTeGpRVUZqTEVWQlFVVXNVMEZCVXl4RlFVRkZMRk5CUVZNN096dHZRa0ZETTBRc2MwSkJRVThzU1VGQlNTeFBRVUZQTEVOQlFWTXNWVUZCUXl4UFFVRlBMRVZCUVVVc1RVRkJUVHMwUWtGRGVrTXNWVUZCVlN4RFFVRkRMR05CUVUwc1QwRkJRU3hQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4RlFVRnlRaXhEUVVGeFFpeEZRVUZGTEVsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJRenQzUWtGRE4wUXNRMEZCUXl4RFFVRkRMRVZCUVVNN096dFRRVU5LTzFGQlJVUXNiVUpCUVcxQ0xGbEJRVU1zU1VGQlNTeEZRVUZGTEdOQlFXTXNSVUZCUlN4VFFVRlRMRVZCUVVVc1UwRkJVenRaUVVNMVJDeFRRVUZUTEVOQlFVTXNaME5CUVdkRExFTkJRM2hETEVsQlFVa3NRMEZCUXl4WFFVRlhMRVZCUTJoQ0xGTkJRVk1zUlVGRFZEdG5Ra0ZEUlN4TlFVRk5MRVZCUVVVc1NVRkJTU3hEUVVGRExFMUJRVTA3WVVGRGNFSXNRMEZEUml4RFFVRkRPMUZCUTBvc1EwRkJRenRSUVVWRUxHZENRVUZuUWl4WlFVRkRMRWxCUVVrc1JVRkJSU3hqUVVGakxFVkJRVVVzVTBGQlV5eEZRVUZGTEZOQlFWTTdXVUZEZWtRc1UwRkJVeXhEUVVGRExHVkJRV1VzUTBGQlF5eFhRVUZYTEVOQlFVTTdaMEpCUTNCRExFVkJRVVVzUlVGQlJTeFpRVUZaTzJkQ1FVTm9RaXhUUVVGVExFVkJRVVVzWjBKQlFXZENPMmRDUVVNelFpeFZRVUZWTEVWQlFVVTdiMEpCUTFZc1kwRkJZeXhGUVVGRkxFbEJRVWtzUTBGQlF5eGxRVUZsTzJsQ1FVTnlRenRoUVVOR0xFTkJRVU1zUTBGQlF6dFJRVU5NTEVOQlFVTTdVVUZGUkN4NVFrRkJlVUlzV1VGQlF5eEpRVUZKTEVWQlFVVXNZMEZCWXl4RlFVRkZMRk5CUVZNc1JVRkJSU3hUUVVGVE8xbEJRMnhGTERaR1FVRTJSanRaUVVNM1JpeEpRVUZOTEZkQlFWY3NSMEZCUnl4VFFVRlRMRU5CUVVNc2IwSkJRVzlDTEVOQlFVTXNaMEpCUVdkQ0xFTkJRVU1zUTBGQlF6dFpRVU55UlN4UFFVRlBMRmRCUVZjc1EwRkJRenRSUVVOeVFpeERRVUZETzFGQlJVUXNjMEpCUVhOQ0xGbEJRVU1zU1VGQlNTeEZRVUZGTEdOQlFXTXNSVUZCUlN4VFFVRlRMRVZCUVVVc1UwRkJVenRaUVVNdlJDeEpRVUZOTEZsQlFWa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRE8xbEJRM1pETEVsQlFVMHNSVUZCUlN4SFFVRkhMRk5CUVZNc1EwRkJReXhsUVVGbExFTkJRVU03V1VGRGNrTXNTVUZCVFN4aFFVRmhMRWRCUVVjc0swSkJRVFpDTEd0Q1FVRnZRaXhEUVVGRE8xbEJRM2hGTEd0Q1FVRnJRaXhKUVVGSkxFTkJRVU1zUTBGQlF6dFpRVU40UWl4SlFVRk5MRWRCUVVjc1IwRkJSeXhGUVVGRkxFTkJRVU1zYzBKQlFYTkNMRU5CUVVNc1dVRkJXU3hGUVVGRkxHRkJRV0VzUTBGQlF5eERRVUZETzFsQlEyNUZMRXRCUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4SFFVRkhMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUlVGQlJTeEZRVUZGTzJkQ1FVTnVReXhKUVVGTkxFTkJRVU1zUjBGQlJ5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1owSkJRMnBDTEVsQlFVa3NRMEZCUXl4RFFVRkRMRWxCUVVrc1NVRkJTU3hQUVVGUExFVkJRVVU3YjBKQlEzSkNMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdiMEpCUTJwQ0xFMUJRVTBzU1VGQlNTeExRVUZMTEVOQlFVTXNhVU5CUVdsRExFTkJRVU1zUTBGQlF6dHBRa0ZEY0VRN1lVRkRSanRSUVVOSUxFTkJRVU03VVVGRlJDeFhRVUZYTEZsQlFVTXNTVUZCU1N4RlFVRkZMR05CUVdNc1JVRkJSU3hUUVVGVExFVkJRVVVzVTBGQlV6dFpRVU53UkN4UFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVkVzU1VGQlNTeERRVUZETEU5QlFWTXNRMEZCUXl4RFFVRkRPMUZCUTNSRExFTkJRVU03VVVGRlJDeGxRVUZsTEZsQlFVTXNTVUZCU1N4RlFVRkZMR05CUVdNc1JVRkJSU3hUUVVGVExFVkJRVVVzVTBGQlV6dFpRVU40UkN4UFFVRlBMRWxCUVVrc1EwRkJRenRSUVVOa0xFTkJRVU03VVVGRlJDeFhRVUZYTEZsQlFVTXNTVUZCU1N4RlFVRkZMR05CUVdNc1JVRkJSU3hUUVVGVExFVkJRVVVzVTBGQlV6dFpRVU53UkN4TlFVRk5MRk5CUVZNc1EwRkJReXcwUWtGQk5FSXNRMEZCUXp0blFrRkRNME1zV1VGQldTeEZRVUZGTEVsQlFVa3NTMEZCU3l4RFFVRkRMSGxDUVVGNVFpeERRVUZETzJkQ1FVTnNSQ3hGUVVGRkxFVkJRVVVzYjBSQlFXOUVPMmRDUVVONFJDeFRRVUZUTEVWQlFVVXNVMEZCVXp0aFFVTnlRaXhEUVVGRExFTkJRVU03VVVGRFRDeERRVUZETzFGQlJVUXNZMEZCWXl4WlFVRkRMRWxCUVVrc1JVRkJSU3hqUVVGakxFVkJRVVVzVTBGQlV5eEZRVUZGTEZOQlFWTTdXVUZEZGtRc2FVSkJRV2xDTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1MwRkJTeXhOUVVGTkxFTkJRVU03VVVGRE5VTXNRMEZCUXp0UlFVVkVMR05CUVdNc1dVRkJReXhKUVVGSkxFVkJRVVVzWTBGQll5eEZRVUZGTEZOQlFWTXNSVUZCUlN4VFFVRlRPMWxCUTNaRUxFOUJRVThzYVVKQlFXbENMRU5CUVVNN1VVRkRNMElzUTBGQlF6dFJRVVZFTEdWQlFXVXNXVUZCUXl4SlFVRkpMRVZCUVVVc1kwRkJZeXhGUVVGRkxGTkJRVk1zUlVGQlJTeFRRVUZUTzFsQlEzaEVMRTlCUVU4c2FVSkJRV2xDTEVOQlFVTTdVVUZETTBJc1EwRkJRenRSUVVWRUxHZENRVUZuUWl4WlFVRkRMRWxCUVVrc1JVRkJSU3hqUVVGakxFVkJRVVVzVTBGQlV5eEZRVUZGTEZOQlFWTTdXVUZEZWtRc1QwRkJUeXhEUVVGRExHbENRVUZwUWl4RFFVRkRPMUZCUXpWQ0xFTkJRVU03VVVGRlN5eDFRa0ZCZFVJc1dVRkJReXhKUVVGSkxFVkJRVVVzWTBGQll5eEZRVUZGTEZOQlFWTXNSVUZCUlN4VFFVRlRPenM3TzJkRFFVTjBSU3h4UWtGQlRTeEpRVUZKTEVOQlFVTXNSVUZCUlN4RFFVRkRMRVZCUVVFN096UkNRVUZrTEZOQlFXTXNRMEZCUXpzMFFrRkRaaXh6UWtGQlR5eHBRa0ZCYVVJc1JVRkJRenM3T3p0VFFVTXhRanRSUVVWTExIZENRVUYzUWl4WlFVRkRMRWxCUVVrc1JVRkJSU3hqUVVGakxFVkJRVVVzVTBGQlV5eEZRVUZGTEZOQlFWTTdPenM3WjBOQlEzWkZMSEZDUVVGTkxFbEJRVWtzUTBGQlF5eEZRVUZGTEVOQlFVTXNSVUZCUVRzN05FSkJRV1FzVTBGQll5eERRVUZET3pSQ1FVTm1MSE5DUVVGUExFTkJRVU1zYVVKQlFXbENMRVZCUVVNN096czdVMEZETTBJN1MwRkZSaXhEUVVGRE8wbEJSVVlzVDBGQlR5eGpRVUZOTEU5QlFVRXNaMEpCUVdkQ0xFVkJRV2hDTEVOQlFXZENMRU5CUVVNN1FVRkRhRU1zUTBGQlF6dEJRVGxKUkN4dlJFRTRTVU03UVVGRlJDeFRRVUZ6UWl4SlFVRkpMRU5CUVVNc1JVRkJVenM3TzFsQlEyeERMSE5DUVVGUExFbEJRVWtzVDBGQlR5eERRVUZETEZWQlFVTXNUMEZCVHl4RlFVRkZMRTFCUVUwN2IwSkJRMnBETEZWQlFWVXNRMEZCUXl4alFVRk5MRTlCUVVFc1QwRkJUeXhGUVVGRkxFVkJRVlFzUTBGQlV5eEZRVUZGTEVWQlFVVXNRMEZCUXl4RFFVRkRPMmRDUVVOc1F5eERRVUZETEVOQlFVTXNSVUZCUXpzN08wTkJRMG83UVVGS1JDeHZRa0ZKUXlKOSIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGJsb2NrX3Byb3ZpZGVyXzEgPSByZXF1aXJlKFwiLi4vLi4vYmxvY2tfcHJvdmlkZXJcIik7XG52YXIgeG1sID0gcmVxdWlyZShcIi4vYmxvY2tfeG1sXCIpO1xuZXhwb3J0cy54bWwgPSB4bWw7XG52YXIgbmFtZXNwYWNlXzEgPSByZXF1aXJlKFwiLi9uYW1lc3BhY2VcIik7XG5leHBvcnRzLk5BTUVTUEFDRSA9IG5hbWVzcGFjZV8xLk5BTUVTUEFDRTtcbnZhciBkb21haW5fZnVuY3Rpb25zXzEgPSByZXF1aXJlKFwiLi9kb21haW5fZnVuY3Rpb25zXCIpO1xudmFyIGJsb2NrX2NvbmZpZ18xID0gcmVxdWlyZShcIi4vYmxvY2tfY29uZmlnXCIpO1xuZXhwb3J0cy5ibG9ja19jb25maWcgPSBibG9ja19jb25maWdfMS5ibG9ja19jb25maWc7XG5mdW5jdGlvbiByZWdpc3Rlcl9jb21waWxlX2RlcGVuZGVuY2llcyhyZWdpc3RyeSkge1xuICAgIHZhciBuYW1lc3BhY2UgPSBuYW1lc3BhY2VfMS5OQU1FU1BBQ0U7XG4gICAgcmVnaXN0cnkucmVnaXN0ZXJfYWN0aW9uX3R5cGUoe1xuICAgICAgICBuYW1lc3BhY2U6IG5hbWVzcGFjZSxcbiAgICAgICAgaWQ6ICd0ZXN0YWN0aW9uJyxcbiAgICB9KTtcbiAgICByZWdpc3RyeS5yZWdpc3Rlcih7XG4gICAgICAgIG5hbWVzcGFjZTogbmFtZXNwYWNlLFxuICAgICAgICBpZDogJ3B1bGxfZXZlbnRfdGVzdCcsXG4gICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgICByZXN0YXJ0X3doZW5fZmluaXNoZWQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgfSk7XG4gICAgcmVnaXN0cnkucmVnaXN0ZXIoe1xuICAgICAgICBuYW1lc3BhY2U6IG5hbWVzcGFjZSxcbiAgICAgICAgaWQ6ICdvbl90ZXN0X2FjdGlvbicsXG4gICAgICAgIHJlc3BvbmQ6IHtcbiAgICAgICAgICAgIHRvX2FjdGlvbjoge1xuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogbmFtZXNwYWNlLFxuICAgICAgICAgICAgICAgIGlkOiAndGVzdGFjdGlvbicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogYmxvY2tfcHJvdmlkZXJfMS5SZXNwb25kZXJUeXBlLkFjdGlvbixcbiAgICAgICAgICAgIGFzeW5jOiB0cnVlLFxuICAgICAgICAgICAgZW50aXR5X3NwZWNpZmljOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICB9KTtcbiAgICB2YXIgaWZfZHJvcGRvd25zID0gW1xuICAgICAgICAnY29udHJvbHNfaWZfZHJvcGRvd24nLFxuICAgICAgICAnY29udHJvbHNfaWZfZHJvcGRvd25fc2ltcGxlJyxcbiAgICAgICAgJ2NvbnRyb2xzX2lmX2Ryb3Bkb3duX3Byb21pc2UnLFxuICAgIF07XG4gICAgaWZfZHJvcGRvd25zLmZvckVhY2goZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJlZ2lzdHJ5LnJlZ2lzdGVyKHtcbiAgICAgICAgICAgIG5hbWVzcGFjZTogbmFtZXNwYWNlLFxuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgICAgICBpc19pZl9kcm9wZG93bjogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZXhwb3J0cy5yZWdpc3Rlcl9jb21waWxlX2RlcGVuZGVuY2llcyA9IHJlZ2lzdGVyX2NvbXBpbGVfZGVwZW5kZW5jaWVzO1xuZnVuY3Rpb24gbG9hZF9kb21haW5fZnVuY3Rpb25zKHJlZ2lzdHJ5LCBhdmFfbGlrZV90ZXN0X29iamVjdCkge1xuICAgIHJlZ2lzdGVyX2NvbXBpbGVfZGVwZW5kZW5jaWVzKHJlZ2lzdHJ5KTtcbiAgICB2YXIgbmFtZXNwYWNlID0gbmFtZXNwYWNlXzEuTkFNRVNQQUNFO1xuICAgIHZhciBfdGVzdF9kb25lX2xpc3RlbmVycyA9IFtdO1xuICAgIHZhciBvbl90ZXN0X2RvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX3Rlc3RfZG9uZV9saXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIF90ZXN0X2RvbmVfbGlzdGVuZXJzW2ldKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZhciBzdWJzY3JpYmVfdGVzdF9kb25lID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIF90ZXN0X2RvbmVfbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgIH07XG4gICAgdmFyIGRmID0gZG9tYWluX2Z1bmN0aW9uc18xLmdldF9kb21haW5fZnVuY3Rpb25zKGF2YV9saWtlX3Rlc3Rfb2JqZWN0LCBvbl90ZXN0X2RvbmUpKCk7XG4gICAgZm9yICh2YXIgZGZfaWQgaW4gZGYpIHtcbiAgICAgICAgdmFyIGZ1biA9IGRmW2RmX2lkXTtcbiAgICAgICAgcmVnaXN0cnkucmVnaXN0ZXIoe1xuICAgICAgICAgICAgbmFtZXNwYWNlOiBuYW1lc3BhY2UsXG4gICAgICAgICAgICBpZDogZGZfaWQsXG4gICAgICAgICAgICBkb21haW5fZnVuY3Rpb246IGZ1bixcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHN1YnNjcmliZV90ZXN0X2RvbmU6IHN1YnNjcmliZV90ZXN0X2RvbmUsXG4gICAgfTtcbn1cbmV4cG9ydHMubG9hZF9kb21haW5fZnVuY3Rpb25zID0gbG9hZF9kb21haW5fZnVuY3Rpb25zO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pYVc1a1pYZ3Vhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdUxpOHVMaTh1TGk5emNtTXZaR1YyWDNSdmIyd3ZkR1Z6ZEY5aWJHOWphM012YVc1a1pYZ3VkSE1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3UVVGRlFTeDFSRUZCY1VRN1FVRkRja1FzYVVOQlFXMURPMEZCVVdZc2EwSkJRVWM3UVVGUWRrSXNlVU5CUVhkRE8wRkJUeTlDTEc5Q1FWQkJMSEZDUVVGVExFTkJUMEU3UVVGTWJFSXNkVVJCUVRCRU8wRkJTVEZFTEN0RFFVRTRRenRCUVVGeVF5eHpRMEZCUVN4WlFVRlpMRU5CUVVFN1FVRkhja0lzVTBGQlowSXNOa0pCUVRaQ0xFTkJRVU1zVVVGQmJVSTdTVUZETDBRc1NVRkJUU3hUUVVGVExFZEJRVWNzY1VKQlFWTXNRMEZCUXp0SlFVVTFRaXhSUVVGUkxFTkJRVU1zYjBKQlFXOUNMRU5CUVVNN1VVRkROVUlzVTBGQlV5eFhRVUZCTzFGQlExUXNSVUZCUlN4RlFVRkZMRmxCUVZrN1MwRkRha0lzUTBGQlF5eERRVUZETzBsQlJVZ3NVVUZCVVN4RFFVRkRMRkZCUVZFc1EwRkJRenRSUVVOb1FpeFRRVUZUTEZkQlFVRTdVVUZEVkN4RlFVRkZMRVZCUVVVc2FVSkJRV2xDTzFGQlEzSkNMRkZCUVZFc1JVRkJSVHRaUVVOU0xIRkNRVUZ4UWl4RlFVRkZMRWxCUVVrN1UwRkROVUk3UzBGRFJpeERRVUZETEVOQlFVTTdTVUZGU0N4UlFVRlJMRU5CUVVNc1VVRkJVU3hEUVVGRE8xRkJRMmhDTEZOQlFWTXNWMEZCUVR0UlFVTlVMRVZCUVVVc1JVRkJSU3huUWtGQlowSTdVVUZEY0VJc1QwRkJUeXhGUVVGRk8xbEJRMUFzVTBGQlV5eEZRVUZGTzJkQ1FVTlVMRk5CUVZNc1YwRkJRVHRuUWtGRFZDeEZRVUZGTEVWQlFVVXNXVUZCV1R0aFFVTnFRanRaUVVORUxFbEJRVWtzUlVGQlJTdzRRa0ZCWVN4RFFVRkRMRTFCUVUwN1dVRkRNVUlzUzBGQlN5eEZRVUZGTEVsQlFVazdXVUZEV0N4bFFVRmxMRVZCUVVVc1MwRkJTenRUUVVOMlFqdExRVU5HTEVOQlFVTXNRMEZCUXp0SlFVVklMRWxCUVUwc1dVRkJXU3hIUVVGSE8xRkJRMjVDTEhOQ1FVRnpRanRSUVVOMFFpdzJRa0ZCTmtJN1VVRkROMElzT0VKQlFUaENPMHRCUXk5Q0xFTkJRVU03U1VGRFJpeFpRVUZaTEVOQlFVTXNUMEZCVHl4RFFVRkRMRlZCUVVNc1JVRkJSVHRSUVVOMFFpeFJRVUZSTEVOQlFVTXNVVUZCVVN4RFFVRkRPMWxCUTJoQ0xGTkJRVk1zVjBGQlFUdFpRVU5VTEVWQlFVVXNTVUZCUVR0WlFVTkdMRkZCUVZFc1JVRkJSVHRuUWtGRFVpeGpRVUZqTEVWQlFVVXNTVUZCU1R0aFFVTnlRanRUUVVOR0xFTkJRVU1zUTBGQlF6dEpRVU5NTEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUlV3c1EwRkJRenRCUVRkRFJDeHpSVUUyUTBNN1FVRkZSQ3hUUVVGblFpeHhRa0ZCY1VJc1EwRkRha01zVVVGQmJVSXNSVUZEYmtJc2IwSkJRV2xETzBsQlJXNURMRFpDUVVFMlFpeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMGxCUTNoRExFbEJRVTBzVTBGQlV5eEhRVUZITEhGQ1FVRlRMRU5CUVVNN1NVRkZOVUlzU1VGQlRTeHZRa0ZCYjBJc1IwRkJZeXhGUVVGRkxFTkJRVU03U1VGRE0wTXNTVUZCVFN4WlFVRlpMRWRCUVVjN1VVRkRia0lzUzBGQlN5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVVc1EwRkJReXhIUVVGSExHOUNRVUZ2UWl4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJUdFpRVU53UkN4dlFrRkJiMElzUTBGQlF5eERRVUZETEVOQlFVTXNSVUZCUlN4RFFVRkRPMU5CUXpOQ08wbEJRMGdzUTBGQlF5eERRVUZETzBsQlEwWXNTVUZCVFN4dFFrRkJiVUlzUjBGQmNVSXNWVUZCUXl4UlFVRnRRanRSUVVOb1JTeHZRa0ZCYjBJc1EwRkJReXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdTVUZEZEVNc1EwRkJReXhEUVVGRE8wbEJSVVlzU1VGQlRTeEZRVUZGTEVkQlFVY3NkVU5CUVc5Q0xFTkJRemRDTEc5Q1FVRnZRaXhGUVVOd1FpeFpRVUZaTEVOQlEySXNSVUZCUlN4RFFVRkRPMGxCUlVvc1MwRkJTeXhKUVVGTkxFdEJRVXNzU1VGQlNTeEZRVUZGTEVWQlFVVTdVVUZEZEVJc1NVRkJUU3hIUVVGSExFZEJRVWNzUlVGQlJTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMUZCUTNSQ0xGRkJRVkVzUTBGQlF5eFJRVUZSTEVOQlFVTTdXVUZEYUVJc1UwRkJVeXhYUVVGQk8xbEJRMVFzUlVGQlJTeEZRVUZGTEV0QlFVczdXVUZEVkN4bFFVRmxMRVZCUVVVc1IwRkJSenRUUVVOeVFpeERRVUZETEVOQlFVTTdTMEZEU2p0SlFVVkVMRTlCUVU4N1VVRkRUQ3h0UWtGQmJVSXNjVUpCUVVFN1MwRkRjRUlzUTBGQlF6dEJRVU5LTEVOQlFVTTdRVUZzUTBRc2MwUkJhME5ESW4wPSIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGJsb2NrX3Byb3ZpZGVyXzEgPSByZXF1aXJlKFwiLi4vLi4vYmxvY2tfcHJvdmlkZXJcIik7XG4vLyBDbGllbnRzIHdvdWxkIGdldCB0aGlzIGZ1bmN0aW9uIGZyb20gVXRpbFxuZXhwb3J0cy5OQU1FU1BBQ0UgPSAnQVVUT01BVEVEVEVTVFMnO1xuZnVuY3Rpb24gbnNfaWQoaWQpIHtcbiAgICByZXR1cm4gYmxvY2tfcHJvdmlkZXJfMS5uYW1lc3BhY2VkX2lkKGV4cG9ydHMuTkFNRVNQQUNFLCBpZCk7XG59XG5leHBvcnRzLm5zX2lkID0gbnNfaWQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2libUZ0WlhOd1lXTmxMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUxpNHZMaTR2TGk0dmMzSmpMMlJsZGw5MGIyOXNMM1JsYzNSZllteHZZMnR6TDI1aGJXVnpjR0ZqWlM1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96dEJRVUZCTEhWRVFVRnhSRHRCUVVOeVJDdzBRMEZCTkVNN1FVRkZMMElzVVVGQlFTeFRRVUZUTEVkQlFVY3NaMEpCUVdkQ0xFTkJRVU03UVVGRk1VTXNVMEZCWjBJc1MwRkJTeXhEUVVGRExFVkJRVk03U1VGRE4wSXNUMEZCVHl3NFFrRkJZU3hEUVVGRExHbENRVUZUTEVWQlFVVXNSVUZCUlN4RFFVRkRMRU5CUVVNN1FVRkRkRU1zUTBGQlF6dEJRVVpFTEhOQ1FVVkRJbjA9Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzVZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzVKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0EiLCJzb3VyY2VSb290IjoiIn0=