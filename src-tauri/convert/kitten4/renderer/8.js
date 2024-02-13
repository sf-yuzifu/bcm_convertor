(this["webpackJsonp"] = this["webpackJsonp"] || []).push([[8],{

/***/ "./node_modules/css-loader/index.js!./src/ai/classify_ai/diagram/heatmap/style.css":
/*!********************************************************************************!*\
  !*** ./node_modules/css-loader!./src/ai/classify_ai/diagram/heatmap/style.css ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".axis .domain {\n  stroke: #E8E8E8;\n}\n\n.axis .tick line{\n  color: #E8E8E8;\n}\n\n.axis .tick text{\n  color: #9A9A9A;\n}", ""]);

// exports


/***/ }),

/***/ "./src/ai/classify_ai/diagram/heatmap/index.ts":
/*!*****************************************************!*\
  !*** ./src/ai/classify_ai/diagram/heatmap/index.ts ***!
  \*****************************************************/
/*! exports provided: CLASS_COLORS, HeatMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CLASS_COLORS", function() { return CLASS_COLORS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeatMap", function() { return HeatMap; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var d3_array__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! d3-array */ "./node_modules/d3-array/src/index.js");
/* harmony import */ var d3_axis__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! d3-axis */ "./node_modules/d3-axis/src/index.js");
/* harmony import */ var d3_color__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! d3-color */ "./node_modules/d3-color/src/index.js");
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! d3-selection */ "./node_modules/d3-selection/src/index.js");
/* harmony import */ var d3_scale__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! d3-scale */ "./node_modules/d3-scale/src/index.js");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./style.css */ "./src/ai/classify_ai/diagram/heatmap/style.css");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_style_css__WEBPACK_IMPORTED_MODULE_7__);



/* https://github.com/tensorflow/playground/blob/master/src/heatmap.ts

Copyright 2016 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

==============================================================================
CHANGELOG

2019.4
1. Update d3 from 3.5.16 to 5.9.2 (latest version), use TypeScript 3.3.3, fix syntax errors and reduce implicitly types.
2. Remove unused parameters and elements here (test data layer, discretize mode, noSvg mode).
3. Change data structures to handle multi classifications.
4. Modify constructor, add 'updateRange', 'resetPoints'.
5. Add 'replaceMode'.
*/






/**
 * Colors for drawing preview diagram, indexed by classification.
 */

var CLASS_COLORS = ['#0057FF', '#FF9948', '#3DD1AE', '#FF4B4B'];

/** Number of different shades (colors) when drawing a gradient heatmap */
var NUM_SHADES = 30;
var AXES_PADDING = 20;
/**
 * Draws a heatmap using canvas. Used for showing the learned decision
 * boundary of the classification algorithm. Can also draw data points
 * using an svg overlayed on top of the canvas heatmap.
 */

var HeatMap = /*#__PURE__*/function () {
  function HeatMap(width, numSamples, containerSelector) {
    var replaceMode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var userSettings = arguments.length > 4 ? arguments[4] : undefined;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, HeatMap);

    this.settings = {
      showAxes: true,
      noSvg: false
    };
    this.xScale = void 0;
    this.yScale = void 0;
    this.numSamples = void 0;
    this.color_arr = void 0;
    this.canvas = void 0;
    this.svg = void 0;
    this.width = void 0;
    this.padding = void 0;
    // overwrite the defaults with the user-specified settings.
    userSettings && Object.assign(this.settings, userSettings);
    this.numSamples = numSamples;
    this.width = width;
    this.padding = this.settings.showAxes ? AXES_PADDING : 0; // Get a range of colors.

    this.color_arr = CLASS_COLORS.map(function (color) {
      var tmp_scale = Object(d3_scale__WEBPACK_IMPORTED_MODULE_6__["scaleLinear"])().domain([0, 1]).range(['#ffffff', color]).clamp(true); // Due to numerical error, we need to specify
      // d3.range(0, end + small_epsilon, step)
      // in order to guarantee that we will have end/step entries with
      // the last element being equal to end.

      var color_range = Object(d3_array__WEBPACK_IMPORTED_MODULE_2__["range"])(0, 1 + 1E-9, 1 / NUM_SHADES).map(function (a) {
        return tmp_scale(a);
      });
      return Object(d3_scale__WEBPACK_IMPORTED_MODULE_6__["scaleQuantize"])().domain([0, 1]).range(color_range);
    });

    if (replaceMode) {
      // Clear all data in the selected container before init a new heatmap.
      Object(d3_selection__WEBPACK_IMPORTED_MODULE_5__["select"])(containerSelector).selectAll('*').remove();
    }

    var container = Object(d3_selection__WEBPACK_IMPORTED_MODULE_5__["select"])(containerSelector).append('div').style('width', this.width + 'px').style('height', this.width + 'px').style('position', 'relative');
    this.canvas = container.append('canvas').attr('width', numSamples).attr('height', numSamples).style('width', this.width - 2 * this.padding + 'px').style('height', this.width - 2 * this.padding + 'px').style('position', 'absolute').style('top', "".concat(this.padding, "px")).style('left', "".concat(this.padding, "px"));

    if (this.settings.noSvg) {
      return;
    }

    this.svg = container.append('svg').attr('width', this.width).attr('height', this.width).style('position', 'absolute').style('top', '0').style('left', '0').append('g').attr('transform', "translate(".concat(this.padding, ",").concat(this.padding, ")")); // Append heatmap after axes so that dots are always upper the coordinates

    this.svg.append('g').attr('class', 'train');
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(HeatMap, [{
    key: "updateBackground",
    value: function updateBackground(data) {
      var discretize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var dx = data[0].length;
      var dy = data.length;

      if (dx !== this.numSamples || dy !== this.numSamples) {
        throw new Error('The provided data matrix must be of size ' + 'numSamples X numSamples');
      } // Compute the pixel colors; scaled by CSS.


      var context = this.canvas.node().getContext('2d');

      if (!context) {
        return;
      }

      var image = context.createImageData(dx, dy);

      for (var y = 0, p = -1; y < dy; ++y) {
        for (var x = 0; x < dx; ++x) {
          var value = data[x][y];

          if (discretize) {
            value.density = value.density >= 0 ? 1 : -1;
          }

          var c = Object(d3_color__WEBPACK_IMPORTED_MODULE_4__["rgb"])(this.color_arr[value.class_index](value.density));
          image.data[++p] = c.r;
          image.data[++p] = c.g;
          image.data[++p] = c.b;
          image.data[++p] = 160;
        }
      }

      context.putImageData(image, 0, 0);
    }
  }, {
    key: "resetPoints",
    value: function resetPoints(xDomain, yDomain, points) {
      this.resetRange(xDomain, yDomain);
      this.svg.select('g.train').selectAll('circle').remove();
      this.updatePoints(points);
    }
  }, {
    key: "updatePoints",
    value: function updatePoints(points) {
      if (this.settings.noSvg) {
        throw Error('Can\'t add points since noSvg=true');
      }

      this.updateCircles(this.svg.select('g.train'), points);
    }
  }, {
    key: "resetRange",
    value: function resetRange(xDomain, yDomain) {
      // d3.scaleLinear: projection from domain to range
      this.xScale = Object(d3_scale__WEBPACK_IMPORTED_MODULE_6__["scaleLinear"])().domain(xDomain).range([0, this.width - 2 * this.padding]);
      this.yScale = Object(d3_scale__WEBPACK_IMPORTED_MODULE_6__["scaleLinear"])().domain(yDomain).range([this.width - 2 * this.padding, 0]);

      if (this.settings.showAxes) {
        var xAxis = Object(d3_axis__WEBPACK_IMPORTED_MODULE_3__["axisBottom"])(this.xScale);
        var yAxis = Object(d3_axis__WEBPACK_IMPORTED_MODULE_3__["axisLeft"])(this.yScale); // Clear existing axes and set new ones

        this.svg.selectAll('.axis').remove();
        this.svg.append('g').attr('class', 'x axis').attr('transform', "translate(0,".concat(this.width - 2 * this.padding, ")")).call(xAxis);
        this.svg.append('g').attr('class', 'y axis').call(yAxis);
      }
    }
  }, {
    key: "updateCircles",
    value: function updateCircles(container, points) {
      var _this = this;

      // Keep only points that are inside the bounds.
      var xDomain = this.xScale.domain();
      var yDomain = this.yScale.domain();
      points = points.filter(function (p) {
        return p.x >= xDomain[0] && p.x <= xDomain[1] && p.y >= yDomain[0] && p.y <= yDomain[1];
      }); // Attach data to initially empty selection.

      var selection = container.selectAll('circle').data(points); // Insert elements to match length of points array
      // and update points to be in the correct position.

      selection.enter().append('circle').attr('r', 3).style('stroke', '#fff').style('stroke-width', 0.7).attr('cx', function (d) {
        return _this.xScale(d.x);
      }).attr('cy', function (d) {
        return _this.yScale(d.y);
      }).style('fill', function (d) {
        return _this.color_arr[d.label](1);
      }); // Remove points if the length has gone down.

      selection.exit().remove();
    }
  }]);

  return HeatMap;
}(); // Close class HeatMap.

;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(CLASS_COLORS, "CLASS_COLORS", "/Applications/project/kitten-player/src/ai/classify_ai/diagram/heatmap/index.ts");

  __REACT_HOT_LOADER__.register(NUM_SHADES, "NUM_SHADES", "/Applications/project/kitten-player/src/ai/classify_ai/diagram/heatmap/index.ts");

  __REACT_HOT_LOADER__.register(AXES_PADDING, "AXES_PADDING", "/Applications/project/kitten-player/src/ai/classify_ai/diagram/heatmap/index.ts");

  __REACT_HOT_LOADER__.register(HeatMap, "HeatMap", "/Applications/project/kitten-player/src/ai/classify_ai/diagram/heatmap/index.ts");
}();

;

/***/ }),

/***/ "./src/ai/classify_ai/diagram/heatmap/style.css":
/*!******************************************************!*\
  !*** ./src/ai/classify_ai/diagram/heatmap/style.css ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../node_modules/css-loader!./style.css */ "./node_modules/css-loader/index.js!./src/ai/classify_ai/diagram/heatmap/style.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(/*! !../../../../../node_modules/css-loader!./style.css */ "./node_modules/css-loader/index.js!./src/ai/classify_ai/diagram/heatmap/style.css", function() {
		var newContent = __webpack_require__(/*! !../../../../../node_modules/css-loader!./style.css */ "./node_modules/css-loader/index.js!./src/ai/classify_ai/diagram/heatmap/style.css");

		if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiOC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9haS9jbGFzc2lmeV9haS9kaWFncmFtL2hlYXRtYXAvc3R5bGUuY3NzIiwid2VicGFjazovLy8uL3NyYy9haS9jbGFzc2lmeV9haS9kaWFncmFtL2hlYXRtYXAvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FpL2NsYXNzaWZ5X2FpL2RpYWdyYW0vaGVhdG1hcC9zdHlsZS5jc3M/MGY0ZiJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuYXhpcyAuZG9tYWluIHtcXG4gIHN0cm9rZTogI0U4RThFODtcXG59XFxuXFxuLmF4aXMgLnRpY2sgbGluZXtcXG4gIGNvbG9yOiAjRThFOEU4O1xcbn1cXG5cXG4uYXhpcyAudGljayB0ZXh0e1xcbiAgY29sb3I6ICM5QTlBOUE7XFxufVwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcbiIsIi8qIGh0dHBzOi8vZ2l0aHViLmNvbS90ZW5zb3JmbG93L3BsYXlncm91bmQvYmxvYi9tYXN0ZXIvc3JjL2hlYXRtYXAudHNcblxuQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbnlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQ0hBTkdFTE9HXG5cbjIwMTkuNFxuMS4gVXBkYXRlIGQzIGZyb20gMy41LjE2IHRvIDUuOS4yIChsYXRlc3QgdmVyc2lvbiksIHVzZSBUeXBlU2NyaXB0IDMuMy4zLCBmaXggc3ludGF4IGVycm9ycyBhbmQgcmVkdWNlIGltcGxpY2l0bHkgdHlwZXMuXG4yLiBSZW1vdmUgdW51c2VkIHBhcmFtZXRlcnMgYW5kIGVsZW1lbnRzIGhlcmUgKHRlc3QgZGF0YSBsYXllciwgZGlzY3JldGl6ZSBtb2RlLCBub1N2ZyBtb2RlKS5cbjMuIENoYW5nZSBkYXRhIHN0cnVjdHVyZXMgdG8gaGFuZGxlIG11bHRpIGNsYXNzaWZpY2F0aW9ucy5cbjQuIE1vZGlmeSBjb25zdHJ1Y3RvciwgYWRkICd1cGRhdGVSYW5nZScsICdyZXNldFBvaW50cycuXG41LiBBZGQgJ3JlcGxhY2VNb2RlJy5cbiovXG5cbmltcG9ydCB7IHJhbmdlIH0gZnJvbSAnZDMtYXJyYXknO1xuaW1wb3J0IHsgYXhpc0JvdHRvbSwgYXhpc0xlZnQgfSBmcm9tICdkMy1heGlzJztcbmltcG9ydCB7IHJnYiB9IGZyb20gJ2QzLWNvbG9yJztcbmltcG9ydCB7IHNlbGVjdCB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQgeyBzY2FsZUxpbmVhciwgc2NhbGVRdWFudGl6ZSB9IGZyb20gJ2QzLXNjYWxlJztcblxuaW1wb3J0IHsgRXhhbXBsZTJELCBEcmF3RGF0YSB9IGZyb20gJy4uLy4uL21vZGVscy9kZWZzJztcblxuaW1wb3J0ICcuL3N0eWxlLmNzcyc7XG5cbi8qKlxuICogQ29sb3JzIGZvciBkcmF3aW5nIHByZXZpZXcgZGlhZ3JhbSwgaW5kZXhlZCBieSBjbGFzc2lmaWNhdGlvbi5cbiAqL1xuZXhwb3J0IGNvbnN0IENMQVNTX0NPTE9SUyA9IFtcbiAgJyMwMDU3RkYnLFxuICAnI0ZGOTk0OCcsXG4gICcjM0REMUFFJyxcbiAgJyNGRjRCNEInLFxuXTtcblxuZXhwb3J0IGludGVyZmFjZSBIZWF0TWFwU2V0dGluZ3Mge1xuICBzaG93QXhlcz86Ym9vbGVhbjtcbiAgbm9Tdmc/OmJvb2xlYW47XG59XG5cbi8qKiBOdW1iZXIgb2YgZGlmZmVyZW50IHNoYWRlcyAoY29sb3JzKSB3aGVuIGRyYXdpbmcgYSBncmFkaWVudCBoZWF0bWFwICovXG5jb25zdCBOVU1fU0hBREVTID0gMzA7XG5cbmNvbnN0IEFYRVNfUEFERElORyA9IDIwO1xuXG4vKipcbiAqIERyYXdzIGEgaGVhdG1hcCB1c2luZyBjYW52YXMuIFVzZWQgZm9yIHNob3dpbmcgdGhlIGxlYXJuZWQgZGVjaXNpb25cbiAqIGJvdW5kYXJ5IG9mIHRoZSBjbGFzc2lmaWNhdGlvbiBhbGdvcml0aG0uIENhbiBhbHNvIGRyYXcgZGF0YSBwb2ludHNcbiAqIHVzaW5nIGFuIHN2ZyBvdmVybGF5ZWQgb24gdG9wIG9mIHRoZSBjYW52YXMgaGVhdG1hcC5cbiAqL1xuZXhwb3J0IGNsYXNzIEhlYXRNYXAge1xuICBwcml2YXRlIHNldHRpbmdzOkhlYXRNYXBTZXR0aW5ncyA9IHtcbiAgICBzaG93QXhlczogdHJ1ZSxcbiAgICBub1N2ZzogZmFsc2UsXG4gIH07XG4gIHByaXZhdGUgeFNjYWxlOmQzLlNjYWxlTGluZWFyPG51bWJlciwgbnVtYmVyPjtcbiAgcHJpdmF0ZSB5U2NhbGU6ZDMuU2NhbGVMaW5lYXI8bnVtYmVyLCBudW1iZXI+O1xuICBwcml2YXRlIG51bVNhbXBsZXM6bnVtYmVyO1xuICBwcml2YXRlIGNvbG9yX2FycjpkMy5TY2FsZVF1YW50aXplPHN0cmluZz5bXTtcbiAgcHJpdmF0ZSBjYW52YXM6ZDMuU2VsZWN0aW9uPEhUTUxDYW52YXNFbGVtZW50LCB7fSwgSFRNTEVsZW1lbnQsIGFueT47XG4gIHByaXZhdGUgc3ZnOmQzLlNlbGVjdGlvbjxTVkdFbGVtZW50LCB7fSwgSFRNTEVsZW1lbnQsIGFueT47XG5cbiAgcHJpdmF0ZSB3aWR0aDpudW1iZXI7XG4gIHByaXZhdGUgcGFkZGluZzpudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgd2lkdGg6bnVtYmVyLCBudW1TYW1wbGVzOm51bWJlciwgY29udGFpbmVyU2VsZWN0b3I6c3RyaW5nLCByZXBsYWNlTW9kZTpib29sZWFuID0gZmFsc2UsXG4gICAgdXNlclNldHRpbmdzPzpIZWF0TWFwU2V0dGluZ3MpIHtcbiAgICAvLyBvdmVyd3JpdGUgdGhlIGRlZmF1bHRzIHdpdGggdGhlIHVzZXItc3BlY2lmaWVkIHNldHRpbmdzLlxuICAgIHVzZXJTZXR0aW5ncyAmJiBPYmplY3QuYXNzaWduKHRoaXMuc2V0dGluZ3MsIHVzZXJTZXR0aW5ncyk7XG5cbiAgICB0aGlzLm51bVNhbXBsZXMgPSBudW1TYW1wbGVzO1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLnBhZGRpbmcgPSB0aGlzLnNldHRpbmdzLnNob3dBeGVzID8gQVhFU19QQURESU5HIDogMDtcblxuICAgIC8vIEdldCBhIHJhbmdlIG9mIGNvbG9ycy5cbiAgICB0aGlzLmNvbG9yX2FyciA9IENMQVNTX0NPTE9SUy5tYXAoKGNvbG9yKSA9PiB7XG4gICAgICBjb25zdCB0bXBfc2NhbGUgPSBzY2FsZUxpbmVhcjxzdHJpbmc+KClcbiAgICAgICAgLmRvbWFpbihbMCwgMV0pXG4gICAgICAgIC5yYW5nZShbJyNmZmZmZmYnLCBjb2xvcl0pXG4gICAgICAgIC5jbGFtcCh0cnVlKTtcbiAgICAgIC8vIER1ZSB0byBudW1lcmljYWwgZXJyb3IsIHdlIG5lZWQgdG8gc3BlY2lmeVxuICAgICAgLy8gZDMucmFuZ2UoMCwgZW5kICsgc21hbGxfZXBzaWxvbiwgc3RlcClcbiAgICAgIC8vIGluIG9yZGVyIHRvIGd1YXJhbnRlZSB0aGF0IHdlIHdpbGwgaGF2ZSBlbmQvc3RlcCBlbnRyaWVzIHdpdGhcbiAgICAgIC8vIHRoZSBsYXN0IGVsZW1lbnQgYmVpbmcgZXF1YWwgdG8gZW5kLlxuICAgICAgY29uc3QgY29sb3JfcmFuZ2UgPSByYW5nZSgwLCAxICsgMUUtOSwgMSAvIE5VTV9TSEFERVMpLm1hcCgoYSkgPT4gdG1wX3NjYWxlKGEpKTtcbiAgICAgIHJldHVybiBzY2FsZVF1YW50aXplPHN0cmluZz4oKVxuICAgICAgICAuZG9tYWluKFswLCAxXSlcbiAgICAgICAgLnJhbmdlKGNvbG9yX3JhbmdlKTtcbiAgICB9KTtcblxuICAgIGlmIChyZXBsYWNlTW9kZSkge1xuICAgICAgLy8gQ2xlYXIgYWxsIGRhdGEgaW4gdGhlIHNlbGVjdGVkIGNvbnRhaW5lciBiZWZvcmUgaW5pdCBhIG5ldyBoZWF0bWFwLlxuICAgICAgc2VsZWN0KGNvbnRhaW5lclNlbGVjdG9yKS5zZWxlY3RBbGwoJyonKS5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb250YWluZXIgPSBzZWxlY3QoY29udGFpbmVyU2VsZWN0b3IpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5zdHlsZSgnd2lkdGgnLCB0aGlzLndpZHRoICsgJ3B4JylcbiAgICAgIC5zdHlsZSgnaGVpZ2h0JywgdGhpcy53aWR0aCArICdweCcpXG4gICAgICAuc3R5bGUoJ3Bvc2l0aW9uJywgJ3JlbGF0aXZlJyk7XG5cbiAgICB0aGlzLmNhbnZhcyA9IGNvbnRhaW5lci5hcHBlbmQoJ2NhbnZhcycpXG4gICAgICAuYXR0cignd2lkdGgnLCBudW1TYW1wbGVzKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIG51bVNhbXBsZXMpXG4gICAgICAuc3R5bGUoJ3dpZHRoJywgKHRoaXMud2lkdGggLSAyICogdGhpcy5wYWRkaW5nKSArICdweCcpXG4gICAgICAuc3R5bGUoJ2hlaWdodCcsICh0aGlzLndpZHRoIC0gMiAqIHRoaXMucGFkZGluZykgKyAncHgnKVxuICAgICAgLnN0eWxlKCdwb3NpdGlvbicsICdhYnNvbHV0ZScpXG4gICAgICAuc3R5bGUoJ3RvcCcsIGAke3RoaXMucGFkZGluZ31weGApXG4gICAgICAuc3R5bGUoJ2xlZnQnLCBgJHt0aGlzLnBhZGRpbmd9cHhgKTtcblxuICAgIGlmICh0aGlzLnNldHRpbmdzLm5vU3ZnKSB7IHJldHVybjsgfVxuICAgIHRoaXMuc3ZnID0gY29udGFpbmVyLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMud2lkdGgpXG4gICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy53aWR0aClcbiAgICAgIC5zdHlsZSgncG9zaXRpb24nLCAnYWJzb2x1dGUnKVxuICAgICAgLnN0eWxlKCd0b3AnLCAnMCcpXG4gICAgICAuc3R5bGUoJ2xlZnQnLCAnMCcpXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7dGhpcy5wYWRkaW5nfSwke3RoaXMucGFkZGluZ30pYCk7XG5cbiAgICAvLyBBcHBlbmQgaGVhdG1hcCBhZnRlciBheGVzIHNvIHRoYXQgZG90cyBhcmUgYWx3YXlzIHVwcGVyIHRoZSBjb29yZGluYXRlc1xuICAgIHRoaXMuc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3RyYWluJyk7XG4gIH1cblxuICB1cGRhdGVCYWNrZ3JvdW5kKGRhdGE6RHJhd0RhdGFbXVtdLCBkaXNjcmV0aXplOmJvb2xlYW4gPSBmYWxzZSk6dm9pZCB7XG4gICAgY29uc3QgZHggPSBkYXRhWzBdLmxlbmd0aDtcbiAgICBjb25zdCBkeSA9IGRhdGEubGVuZ3RoO1xuXG4gICAgaWYgKGR4ICE9PSB0aGlzLm51bVNhbXBsZXMgfHwgZHkgIT09IHRoaXMubnVtU2FtcGxlcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIHByb3ZpZGVkIGRhdGEgbWF0cml4IG11c3QgYmUgb2Ygc2l6ZSAnICtcbiAgICAgICAgJ251bVNhbXBsZXMgWCBudW1TYW1wbGVzJyk7XG4gICAgfVxuXG4gICAgLy8gQ29tcHV0ZSB0aGUgcGl4ZWwgY29sb3JzOyBzY2FsZWQgYnkgQ1NTLlxuICAgIGNvbnN0IGNvbnRleHQgPSAodGhpcy5jYW52YXMubm9kZSgpIGFzIEhUTUxDYW52YXNFbGVtZW50KS5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmICghY29udGV4dCkgeyByZXR1cm47IH1cbiAgICBjb25zdCBpbWFnZSA9IGNvbnRleHQuY3JlYXRlSW1hZ2VEYXRhKGR4LCBkeSk7XG5cbiAgICBmb3IgKGxldCB5ID0gMCwgcCA9IC0xOyB5IDwgZHk7ICsreSkge1xuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBkeDsgKyt4KSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gZGF0YVt4XVt5XTtcbiAgICAgICAgaWYgKGRpc2NyZXRpemUpIHtcbiAgICAgICAgICB2YWx1ZS5kZW5zaXR5ID0gKHZhbHVlLmRlbnNpdHkgPj0gMCA/IDEgOiAtMSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYyA9IHJnYih0aGlzLmNvbG9yX2Fyclt2YWx1ZS5jbGFzc19pbmRleF0odmFsdWUuZGVuc2l0eSkpO1xuICAgICAgICBpbWFnZS5kYXRhWysrcF0gPSBjLnI7XG4gICAgICAgIGltYWdlLmRhdGFbKytwXSA9IGMuZztcbiAgICAgICAgaW1hZ2UuZGF0YVsrK3BdID0gYy5iO1xuICAgICAgICBpbWFnZS5kYXRhWysrcF0gPSAxNjA7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnRleHQucHV0SW1hZ2VEYXRhKGltYWdlLCAwLCAwKTtcbiAgfVxuXG4gIHJlc2V0UG9pbnRzKHhEb21haW46W251bWJlciwgbnVtYmVyXSwgeURvbWFpbjpbbnVtYmVyLCBudW1iZXJdLCBwb2ludHM6RXhhbXBsZTJEW10pIHtcbiAgICB0aGlzLnJlc2V0UmFuZ2UoeERvbWFpbiwgeURvbWFpbik7XG4gICAgdGhpcy5zdmcuc2VsZWN0KCdnLnRyYWluJykuc2VsZWN0QWxsKCdjaXJjbGUnKS5yZW1vdmUoKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50cyhwb2ludHMpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVQb2ludHMocG9pbnRzOkV4YW1wbGUyRFtdKTp2b2lkIHtcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5ub1N2Zykge1xuICAgICAgdGhyb3cgRXJyb3IoJ0NhblxcJ3QgYWRkIHBvaW50cyBzaW5jZSBub1N2Zz10cnVlJyk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlQ2lyY2xlcyh0aGlzLnN2Zy5zZWxlY3QoJ2cudHJhaW4nKSwgcG9pbnRzKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVzZXRSYW5nZSh4RG9tYWluOltudW1iZXIsIG51bWJlcl0sIHlEb21haW46W251bWJlciwgbnVtYmVyXSkge1xuICAgIC8vIGQzLnNjYWxlTGluZWFyOiBwcm9qZWN0aW9uIGZyb20gZG9tYWluIHRvIHJhbmdlXG4gICAgdGhpcy54U2NhbGUgPSBzY2FsZUxpbmVhcigpXG4gICAgICAuZG9tYWluKHhEb21haW4pXG4gICAgICAucmFuZ2UoWzAsIHRoaXMud2lkdGggLSAyICogdGhpcy5wYWRkaW5nXSk7XG5cbiAgICB0aGlzLnlTY2FsZSA9IHNjYWxlTGluZWFyKClcbiAgICAgIC5kb21haW4oeURvbWFpbilcbiAgICAgIC5yYW5nZShbdGhpcy53aWR0aCAtIDIgKiB0aGlzLnBhZGRpbmcsIDBdKTtcblxuICAgIGlmICh0aGlzLnNldHRpbmdzLnNob3dBeGVzKSB7XG4gICAgICBjb25zdCB4QXhpcyA9IGF4aXNCb3R0b20odGhpcy54U2NhbGUpO1xuICAgICAgY29uc3QgeUF4aXMgPSBheGlzTGVmdCh0aGlzLnlTY2FsZSk7XG5cbiAgICAgIC8vIENsZWFyIGV4aXN0aW5nIGF4ZXMgYW5kIHNldCBuZXcgb25lc1xuICAgICAgdGhpcy5zdmcuc2VsZWN0QWxsKCcuYXhpcycpLnJlbW92ZSgpO1xuICAgICAgdGhpcy5zdmcuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3ggYXhpcycpXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsJHt0aGlzLndpZHRoIC0gMiAqIHRoaXMucGFkZGluZ30pYClcbiAgICAgICAgLmNhbGwoeEF4aXMpO1xuXG4gICAgICB0aGlzLnN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAneSBheGlzJylcbiAgICAgICAgLmNhbGwoeUF4aXMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlQ2lyY2xlcyhjb250YWluZXI6ZDMuU2VsZWN0aW9uPFNWR0VsZW1lbnQsIHt9LCBIVE1MRWxlbWVudCwgYW55PiwgcG9pbnRzOkV4YW1wbGUyRFtdKSB7XG4gICAgLy8gS2VlcCBvbmx5IHBvaW50cyB0aGF0IGFyZSBpbnNpZGUgdGhlIGJvdW5kcy5cbiAgICBjb25zdCB4RG9tYWluID0gdGhpcy54U2NhbGUuZG9tYWluKCk7XG4gICAgY29uc3QgeURvbWFpbiA9IHRoaXMueVNjYWxlLmRvbWFpbigpO1xuICAgIHBvaW50cyA9IHBvaW50cy5maWx0ZXIoKHApID0+IHAueCA+PSB4RG9tYWluWzBdICYmIHAueCA8PSB4RG9tYWluWzFdICYmXG4gICAgICAgIHAueSA+PSB5RG9tYWluWzBdICYmIHAueSA8PSB5RG9tYWluWzFdKTtcblxuICAgIC8vIEF0dGFjaCBkYXRhIHRvIGluaXRpYWxseSBlbXB0eSBzZWxlY3Rpb24uXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gY29udGFpbmVyLnNlbGVjdEFsbCgnY2lyY2xlJykuZGF0YShwb2ludHMpO1xuXG4gICAgLy8gSW5zZXJ0IGVsZW1lbnRzIHRvIG1hdGNoIGxlbmd0aCBvZiBwb2ludHMgYXJyYXlcbiAgICAvLyBhbmQgdXBkYXRlIHBvaW50cyB0byBiZSBpbiB0aGUgY29ycmVjdCBwb3NpdGlvbi5cbiAgICBzZWxlY3Rpb24uZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAuYXR0cigncicsIDMpXG4gICAgICAuc3R5bGUoJ3N0cm9rZScsICcjZmZmJylcbiAgICAgIC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywgMC43KVxuICAgICAgLmF0dHIoJ2N4JywgKGQ6RXhhbXBsZTJEKSA9PiB0aGlzLnhTY2FsZShkLngpKVxuICAgICAgLmF0dHIoJ2N5JywgKGQ6RXhhbXBsZTJEKSA9PiB0aGlzLnlTY2FsZShkLnkpKVxuICAgICAgLnN0eWxlKCdmaWxsJywgKGQ6RXhhbXBsZTJEKSA9PiB0aGlzLmNvbG9yX2FycltkLmxhYmVsXSgxKSk7XG5cbiAgICAvLyBSZW1vdmUgcG9pbnRzIGlmIHRoZSBsZW5ndGggaGFzIGdvbmUgZG93bi5cbiAgICBzZWxlY3Rpb24uZXhpdCgpLnJlbW92ZSgpO1xuICB9XG59IC8vIENsb3NlIGNsYXNzIEhlYXRNYXAuIiwiXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vc3R5bGUuY3NzXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxuXG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxub3B0aW9ucy5pbnNlcnRJbnRvID0gdW5kZWZpbmVkO1xuXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5cbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL3N0eWxlLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vc3R5bGUuY3NzXCIpO1xuXG5cdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cblx0XHR2YXIgbG9jYWxzID0gKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdHZhciBrZXksIGlkeCA9IDA7XG5cblx0XHRcdGZvcihrZXkgaW4gYSkge1xuXHRcdFx0XHRpZighYiB8fCBhW2tleV0gIT09IGJba2V5XSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZHgrKztcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGtleSBpbiBiKSBpZHgtLTtcblxuXHRcdFx0cmV0dXJuIGlkeCA9PT0gMDtcblx0XHR9KGNvbnRlbnQubG9jYWxzLCBuZXdDb250ZW50LmxvY2FscykpO1xuXG5cdFx0aWYoIWxvY2FscykgdGhyb3cgbmV3IEVycm9yKCdBYm9ydGluZyBDU1MgSE1SIGR1ZSB0byBjaGFuZ2VkIGNzcy1tb2R1bGVzIGxvY2Fscy4nKTtcblxuXHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0fSk7XG5cblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBV0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFlQTtBQUVBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFEQTtBQWZBO0FBQ0E7QUFGQTtBQWdCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBS0E7QUFDQTtBQVFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQVNBO0FBQ0E7QUFDQTtBQXpFQTtBQUFBO0FBQUE7QUEwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQXZHQTtBQUFBO0FBQUE7QUEwR0E7QUFDQTtBQUNBO0FBQ0E7QUE3R0E7QUFBQTtBQUFBO0FBZ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQXBIQTtBQUFBO0FBQUE7QUF1SEE7QUFDQTtBQUlBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFLQTtBQUdBO0FBQ0E7QUEvSUE7QUFBQTtBQUFBO0FBaUpBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUdBO0FBR0E7QUFDQTtBQUFBO0FBSUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBdktBO0FBQ0E7QUFEQTtBQUFBO0FBQ0E7Ozs7Ozs7O0FBdkJBO0FBQ0E7QUFZQTtBQUNBO0FBQ0E7QUFDQTtBQU1BOzs7Ozs7Ozs7Ozs7OztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QSIsInNvdXJjZVJvb3QiOiIifQ==