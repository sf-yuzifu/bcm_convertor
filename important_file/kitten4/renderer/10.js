(this["webpackJsonp"] = this["webpackJsonp"] || []).push([[10],{

/***/ "./node_modules/@cmao/gsap/CustomEase.js":
/*!***********************************************!*\
  !*** ./node_modules/@cmao/gsap/CustomEase.js ***!
  \***********************************************/
/*! exports provided: CustomEase, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomEase", function() { return CustomEase; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return CustomEase; });
/* harmony import */ var _utils_paths_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/paths.js */ "./node_modules/@cmao/gsap/utils/paths.js");
/*!
 * CustomEase 3.3.4
 * https://greensock.com
 *
 * @license Copyright 2008-2020, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */


var gsap,
    _coreInitted,
    _getGSAP = function _getGSAP() {
  return gsap || typeof window !== "undefined" && (gsap = window.gsap) && gsap.registerPlugin && gsap;
},
    _initCore = function _initCore() {
  gsap = _getGSAP();

  if (gsap) {
    gsap.registerEase("_CE", CustomEase.create);
    _coreInitted = 1;
  } else {
    console.warn("Please gsap.registerPlugin(CustomEase)");
  }
},
    _bigNum = 1e20,
    _round = function _round(value) {
  return ~~(value * 1000 + (value < 0 ? -.5 : .5)) / 1000;
},
    _bonusValidated = 1,
    //<name>CustomEase</name>
_numExp = /[-+=\.]*\d+[\.e\-\+]*\d*[e\-\+]*\d*/gi,
    //finds any numbers, including ones that start with += or -=, negative numbers, and ones in scientific notation like 1e-8.
_needsParsingExp = /[cLlsSaAhHvVtTqQ]/g,
    _findMinimum = function _findMinimum(values) {
  var l = values.length,
      min = _bigNum,
      i;

  for (i = 1; i < l; i += 6) {
    if (+values[i] < min) {
      min = +values[i];
    }
  }

  return min;
},
    //takes all the points and translates/scales them so that the x starts at 0 and ends at 1.
_normalize = function _normalize(values, height, originY) {
  if (!originY && originY !== 0) {
    originY = Math.max(+values[values.length - 1], +values[1]);
  }

  var tx = +values[0] * -1,
      ty = -originY,
      l = values.length,
      sx = 1 / (+values[l - 2] + tx),
      sy = -height || (Math.abs(+values[l - 1] - +values[1]) < 0.01 * (+values[l - 2] - +values[0]) ? _findMinimum(values) + ty : +values[l - 1] + ty),
      i;

  if (sy) {
    //typically y ends at 1 (so that the end values are reached)
    sy = 1 / sy;
  } else {
    //in case the ease returns to its beginning value, scale everything proportionally
    sy = -sx;
  }

  for (i = 0; i < l; i += 2) {
    values[i] = (+values[i] + tx) * sx;
    values[i + 1] = (+values[i + 1] + ty) * sy;
  }
},
    //note that this function returns point objects like {x, y} rather than working with segments which are arrays with alternating x, y values as in the similar function in paths.js
_bezierToPoints = function _bezierToPoints(x1, y1, x2, y2, x3, y3, x4, y4, threshold, points, index) {
  var x12 = (x1 + x2) / 2,
      y12 = (y1 + y2) / 2,
      x23 = (x2 + x3) / 2,
      y23 = (y2 + y3) / 2,
      x34 = (x3 + x4) / 2,
      y34 = (y3 + y4) / 2,
      x123 = (x12 + x23) / 2,
      y123 = (y12 + y23) / 2,
      x234 = (x23 + x34) / 2,
      y234 = (y23 + y34) / 2,
      x1234 = (x123 + x234) / 2,
      y1234 = (y123 + y234) / 2,
      dx = x4 - x1,
      dy = y4 - y1,
      d2 = Math.abs((x2 - x4) * dy - (y2 - y4) * dx),
      d3 = Math.abs((x3 - x4) * dy - (y3 - y4) * dx),
      length;

  if (!points) {
    points = [{
      x: x1,
      y: y1
    }, {
      x: x4,
      y: y4
    }];
    index = 1;
  }

  points.splice(index || points.length - 1, 0, {
    x: x1234,
    y: y1234
  });

  if ((d2 + d3) * (d2 + d3) > threshold * (dx * dx + dy * dy)) {
    length = points.length;

    _bezierToPoints(x1, y1, x12, y12, x123, y123, x1234, y1234, threshold, points, index);

    _bezierToPoints(x1234, y1234, x234, y234, x34, y34, x4, y4, threshold, points, index + 1 + (points.length - length));
  }

  return points;
};

var CustomEase = /*#__PURE__*/function () {
  function CustomEase(id, data, config) {
    if (!_coreInitted) {
      _initCore();
    }

    this.id = id;

    if (_bonusValidated) {
      this.setData(data, config);
    }
  }

  var _proto = CustomEase.prototype;

  _proto.setData = function setData(data, config) {
    config = config || {};
    data = data || "0,0,1,1";
    var values = data.match(_numExp),
        closest = 1,
        points = [],
        lookup = [],
        precision = config.precision || 1,
        fast = precision <= 1,
        l,
        a1,
        a2,
        i,
        inc,
        j,
        point,
        prevPoint,
        p;
    this.data = data;

    if (_needsParsingExp.test(data) || ~data.indexOf("M") && data.indexOf("C") < 0) {
      values = Object(_utils_paths_js__WEBPACK_IMPORTED_MODULE_0__["stringToRawPath"])(data)[0];
    }

    l = values.length;

    if (l === 4) {
      values.unshift(0, 0);
      values.push(1, 1);
      l = 8;
    } else if ((l - 2) % 6) {
      throw "Invalid CustomEase";
    }

    if (+values[0] !== 0 || +values[l - 2] !== 1) {
      _normalize(values, config.height, config.originY);
    }

    this.segment = values;

    for (i = 2; i < l; i += 6) {
      a1 = {
        x: +values[i - 2],
        y: +values[i - 1]
      };
      a2 = {
        x: +values[i + 4],
        y: +values[i + 5]
      };
      points.push(a1, a2);

      _bezierToPoints(a1.x, a1.y, +values[i], +values[i + 1], +values[i + 2], +values[i + 3], a2.x, a2.y, 1 / (precision * 200000), points, points.length - 1);
    }

    l = points.length;

    for (i = 0; i < l; i++) {
      point = points[i];
      prevPoint = points[i - 1] || point;

      if (point.x > prevPoint.x || prevPoint.y !== point.y && prevPoint.x === point.x || point === prevPoint) {
        //if a point goes BACKWARD in time or is a duplicate, just drop it.
        prevPoint.cx = point.x - prevPoint.x; //change in x between this point and the next point (performance optimization)

        prevPoint.cy = point.y - prevPoint.y;
        prevPoint.n = point;
        prevPoint.nx = point.x; //next point's x value (performance optimization, making lookups faster in getRatio()). Remember, the lookup will always land on a spot where it's either this point or the very next one (never beyond that)

        if (fast && i > 1 && Math.abs(prevPoint.cy / prevPoint.cx - points[i - 2].cy / points[i - 2].cx) > 2) {
          //if there's a sudden change in direction, prioritize accuracy over speed. Like a bounce ease - you don't want to risk the sampling chunks landing on each side of the bounce anchor and having it clipped off.
          fast = 0;
        }

        if (prevPoint.cx < closest) {
          if (!prevPoint.cx) {
            prevPoint.cx = 0.001; //avoids math problems in getRatio() (dividing by zero)

            if (i === l - 1) {
              //in case the final segment goes vertical RIGHT at the end, make sure we end at the end.
              prevPoint.x -= 0.001;
              closest = Math.min(closest, 0.001);
              fast = 0;
            }
          } else {
            closest = prevPoint.cx;
          }
        }
      } else {
        points.splice(i--, 1);
        l--;
      }
    }

    l = 1 / closest + 1 | 0;
    inc = 1 / l;
    j = 0;
    point = points[0];

    if (fast) {
      for (i = 0; i < l; i++) {
        //for fastest lookups, we just sample along the path at equal x (time) distance. Uses more memory and is slightly less accurate for anchors that don't land on the sampling points, but for the vast majority of eases it's excellent (and fast).
        p = i * inc;

        if (point.nx < p) {
          point = points[++j];
        }

        a1 = point.y + (p - point.x) / point.cx * point.cy;
        lookup[i] = {
          x: p,
          cx: inc,
          y: a1,
          cy: 0,
          nx: 9
        };

        if (i) {
          lookup[i - 1].cy = a1 - lookup[i - 1].y;
        }
      }

      lookup[l - 1].cy = points[points.length - 1].y - a1;
    } else {
      //this option is more accurate, ensuring that EVERY anchor is hit perfectly. Clipping across a bounce, for example, would never happen.
      for (i = 0; i < l; i++) {
        //build a lookup table based on the smallest distance so that we can instantly find the appropriate point (well, it'll either be that point or the very next one). We'll look up based on the linear progress. So it's it's 0.5 and the lookup table has 100 elements, it'd be like lookup[Math.floor(0.5 * 100)]
        if (point.nx < i * inc) {
          point = points[++j];
        }

        lookup[i] = point;
      }

      if (j < points.length - 1) {
        lookup[i - 1] = points[points.length - 2];
      }
    } //this._calcEnd = (points[points.length-1].y !== 1 || points[0].y !== 0); //ensures that we don't run into floating point errors. As long as we're starting at 0 and ending at 1, tell GSAP to skip the final calculation and use 0/1 as the factor.


    this.ease = function (p) {
      var point = lookup[p * l | 0] || lookup[l - 1];

      if (point.nx < p) {
        point = point.n;
      }

      return point.y + (p - point.x) / point.cx * point.cy;
    };

    this.ease.custom = this;

    if (this.id) {
      gsap.registerEase(this.id, this.ease);
    }

    return this;
  };

  _proto.getSVGData = function getSVGData(config) {
    return CustomEase.getSVGData(this, config);
  };

  CustomEase.create = function create(id, data, config) {
    return new CustomEase(id, data, config).ease;
  };

  CustomEase.register = function register(core) {
    gsap = core;

    _initCore();
  };

  CustomEase.get = function get(id) {
    return gsap.parseEase(id);
  };

  CustomEase.getSVGData = function getSVGData(ease, config) {
    config = config || {};
    var width = config.width || 100,
        height = config.height || 100,
        x = config.x || 0,
        y = (config.y || 0) + height,
        e = gsap.utils.toArray(config.path)[0],
        a,
        slope,
        i,
        inc,
        tx,
        ty,
        precision,
        threshold,
        prevX,
        prevY;

    if (config.invert) {
      height = -height;
      y = 0;
    }

    if (typeof ease === "string") {
      ease = gsap.parseEase(ease);
    }

    if (ease.custom) {
      ease = ease.custom;
    }

    if (ease instanceof CustomEase) {
      a = Object(_utils_paths_js__WEBPACK_IMPORTED_MODULE_0__["rawPathToString"])(Object(_utils_paths_js__WEBPACK_IMPORTED_MODULE_0__["transformRawPath"])([ease.segment], width, 0, 0, -height, x, y));
    } else {
      a = [x, y];
      precision = Math.max(5, (config.precision || 1) * 200);
      inc = 1 / precision;
      precision += 2;
      threshold = 5 / precision;
      prevX = _round(x + inc * width);
      prevY = _round(y + ease(inc) * -height);
      slope = (prevY - y) / (prevX - x);

      for (i = 2; i < precision; i++) {
        tx = _round(x + i * inc * width);
        ty = _round(y + ease(i * inc) * -height);

        if (Math.abs((ty - prevY) / (tx - prevX) - slope) > threshold || i === precision - 1) {
          //only add points when the slope changes beyond the threshold
          a.push(prevX, prevY);
          slope = (ty - prevY) / (tx - prevX);
        }

        prevX = tx;
        prevY = ty;
      }

      a = "M" + a.join(",");
    }

    if (e) {
      e.setAttribute("d", a);
    }

    return a;
  };

  return CustomEase;
}();
_getGSAP() && gsap.registerPlugin(CustomEase);
CustomEase.version = "3.3.4";


/***/ }),

/***/ "./node_modules/@cmao/gsap/utils/paths.js":
/*!************************************************!*\
  !*** ./node_modules/@cmao/gsap/utils/paths.js ***!
  \************************************************/
/*! exports provided: getRawPath, copyRawPath, reverseSegment, convertToPath, getRotationAtProgress, sliceRawPath, cacheRawPathMeasurements, subdivideSegment, getPositionOnPath, transformRawPath, stringToRawPath, bezierToPoints, flatPointsToSegment, pointsToSegment, simplifyPoints, getClosestData, subdivideSegmentNear, rawPathToString */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRawPath", function() { return getRawPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "copyRawPath", function() { return copyRawPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reverseSegment", function() { return reverseSegment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "convertToPath", function() { return convertToPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRotationAtProgress", function() { return getRotationAtProgress; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sliceRawPath", function() { return sliceRawPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cacheRawPathMeasurements", function() { return cacheRawPathMeasurements; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "subdivideSegment", function() { return subdivideSegment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPositionOnPath", function() { return getPositionOnPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transformRawPath", function() { return transformRawPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stringToRawPath", function() { return stringToRawPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bezierToPoints", function() { return bezierToPoints; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flatPointsToSegment", function() { return flatPointsToSegment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pointsToSegment", function() { return pointsToSegment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "simplifyPoints", function() { return simplifyPoints; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getClosestData", function() { return getClosestData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "subdivideSegmentNear", function() { return subdivideSegmentNear; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rawPathToString", function() { return rawPathToString; });
/*!
 * paths 3.3.4
 * https://greensock.com
 *
 * Copyright 2008-2020, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */
var _svgPathExp = /[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig,
    _numbersExp = /(?:(-)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig,
    _scientific = /[\+\-]?\d*\.?\d+e[\+\-]?\d+/ig,
    _selectorExp = /(^[#\.][a-z]|[a-y][a-z])/i,
    _DEG2RAD = Math.PI / 180,
    _RAD2DEG = 180 / Math.PI,
    _sin = Math.sin,
    _cos = Math.cos,
    _abs = Math.abs,
    _sqrt = Math.sqrt,
    _atan2 = Math.atan2,
    _largeNum = 1e8,
    _isString = function _isString(value) {
  return typeof value === "string";
},
    _isNumber = function _isNumber(value) {
  return typeof value === "number";
},
    _isUndefined = function _isUndefined(value) {
  return typeof value === "undefined";
},
    _temp = {},
    _temp2 = {},
    _roundingNum = 1e5,
    _wrapProgress = function _wrapProgress(progress) {
  return Math.round((progress + _largeNum) % 1 * _roundingNum) / _roundingNum || (progress < 0 ? 0 : 1);
},
    //if progress lands on 1, the % will make it 0 which is why we || 1, but not if it's negative because it makes more sense for motion to end at 0 in that case.
_round = function _round(value) {
  return Math.round(value * _roundingNum) / _roundingNum || 0;
},
    _splitSegment = function _splitSegment(rawPath, segIndex, i, t) {
  var segment = rawPath[segIndex],
      shift = t === 1 ? 6 : subdivideSegment(segment, i, t);

  if (shift && shift + i + 2 < segment.length) {
    rawPath.splice(segIndex, 0, segment.slice(0, i + shift + 2));
    segment.splice(0, i + shift);
    return 1;
  }
},
    _reverseRawPath = function _reverseRawPath(rawPath, skipOuter) {
  var i = rawPath.length;

  if (!skipOuter) {
    rawPath.reverse();
  }

  while (i--) {
    if (!rawPath[i].reversed) {
      reverseSegment(rawPath[i]);
    }
  }
},
    _copyMetaData = function _copyMetaData(source, copy) {
  copy.totalLength = source.totalLength;

  if (source.samples) {
    //segment
    copy.samples = source.samples.slice(0);
    copy.lookup = source.lookup.slice(0);
    copy.minLength = source.minLength;
    copy.resolution = source.resolution;
  } else {
    //rawPath
    copy.totalPoints = source.totalPoints;
  }

  return copy;
},
    //pushes a new segment into a rawPath, but if its starting values match the ending values of the last segment, it'll merge it into that same segment (to reduce the number of segments)
_appendOrMerge = function _appendOrMerge(rawPath, segment) {
  var index = rawPath.length,
      prevSeg = rawPath[index - 1] || [],
      l = prevSeg.length;

  if (segment[0] === prevSeg[l - 2] && segment[1] === prevSeg[l - 1]) {
    segment = prevSeg.concat(segment.slice(2));
    index--;
  }

  rawPath[index] = segment;
},
    _bestDistance;
/* TERMINOLOGY
 - RawPath - an array of arrays, one for each Segment. A single RawPath could have multiple "M" commands, defining Segments (paths aren't always connected).
 - Segment - an array containing a sequence of Cubic Bezier coordinates in alternating x, y, x, y format. Starting anchor, then control point 1, control point 2, and ending anchor, then the next control point 1, control point 2, anchor, etc. Uses less memory than an array with a bunch of {x, y} points.
 - Bezier - a single cubic Bezier with a starting anchor, two control points, and an ending anchor.
 - the variable "t" is typically the position along an individual Bezier path (time) and it's NOT linear, meaning it could accelerate/decelerate based on the control points whereas the "p" or "progress" value is linearly mapped to the whole path, so it shouldn't really accelerate/decelerate based on control points. So a progress of 0.2 would be almost exactly 20% along the path. "t" is ONLY in an individual Bezier piece.
 */
//accepts basic selector text, a path instance, a RawPath instance, or a Segment and returns a RawPath (makes it easy to homogenize things). If an element or selector text is passed in, it'll also cache the value so that if it's queried again, it'll just take the path data from there instead of parsing it all over again (as long as the path data itself hasn't changed - it'll check).


function getRawPath(value) {
  value = _isString(value) && _selectorExp.test(value) ? document.querySelector(value) || value : value;
  var e = value.getAttribute ? value : 0,
      rawPath;

  if (e && (value = value.getAttribute("d"))) {
    //implements caching
    if (!e._gsPath) {
      e._gsPath = {};
    }

    rawPath = e._gsPath[value];
    return rawPath && !rawPath._dirty ? rawPath : e._gsPath[value] = stringToRawPath(value);
  }

  return !value ? console.warn("Expecting a <path> element or an SVG path data string") : _isString(value) ? stringToRawPath(value) : _isNumber(value[0]) ? [value] : value;
} //copies a RawPath WITHOUT the length meta data (for speed)

function copyRawPath(rawPath) {
  var a = [],
      i = 0;

  for (; i < rawPath.length; i++) {
    a[i] = _copyMetaData(rawPath[i], rawPath[i].slice(0));
  }

  return _copyMetaData(rawPath, a);
}
function reverseSegment(segment) {
  var i = 0,
      y;
  segment.reverse(); //this will invert the order y, x, y, x so we must flip it back.

  for (; i < segment.length; i += 2) {
    y = segment[i];
    segment[i] = segment[i + 1];
    segment[i + 1] = y;
  }

  segment.reversed = !segment.reversed;
}

var _createPath = function _createPath(e, ignore) {
  var path = document.createElementNS("http://www.w3.org/2000/svg", "path"),
      attr = [].slice.call(e.attributes),
      i = attr.length,
      name;
  ignore = "," + ignore + ",";

  while (--i > -1) {
    name = attr[i].nodeName.toLowerCase(); //in Microsoft Edge, if you don't set the attribute with a lowercase name, it doesn't render correctly! Super weird.

    if (ignore.indexOf("," + name + ",") < 0) {
      path.setAttributeNS(null, name, attr[i].nodeValue);
    }
  }

  return path;
},
    _typeAttrs = {
  rect: "rx,ry,x,y,width,height",
  circle: "r,cx,cy",
  ellipse: "rx,ry,cx,cy",
  line: "x1,x2,y1,y2"
},
    _attrToObj = function _attrToObj(e, attrs) {
  var props = attrs ? attrs.split(",") : [],
      obj = {},
      i = props.length;

  while (--i > -1) {
    obj[props[i]] = +e.getAttribute(props[i]) || 0;
  }

  return obj;
}; //converts an SVG shape like <circle>, <rect>, <polygon>, <polyline>, <ellipse>, etc. to a <path>, swapping it in and copying the attributes to match.


function convertToPath(element, swap) {
  var type = element.tagName.toLowerCase(),
      circ = 0.552284749831,
      data,
      x,
      y,
      r,
      ry,
      path,
      rcirc,
      rycirc,
      points,
      w,
      h,
      x2,
      x3,
      x4,
      x5,
      x6,
      y2,
      y3,
      y4,
      y5,
      y6,
      attr;

  if (type === "path" || !element.getBBox) {
    return element;
  }

  path = _createPath(element, "x,y,width,height,cx,cy,rx,ry,r,x1,x2,y1,y2,points");
  attr = _attrToObj(element, _typeAttrs[type]);

  if (type === "rect") {
    r = attr.rx;
    ry = attr.ry || r;
    x = attr.x;
    y = attr.y;
    w = attr.width - r * 2;
    h = attr.height - ry * 2;

    if (r || ry) {
      //if there are rounded corners, render cubic beziers
      x2 = x + r * (1 - circ);
      x3 = x + r;
      x4 = x3 + w;
      x5 = x4 + r * circ;
      x6 = x4 + r;
      y2 = y + ry * (1 - circ);
      y3 = y + ry;
      y4 = y3 + h;
      y5 = y4 + ry * circ;
      y6 = y4 + ry;
      data = "M" + x6 + "," + y3 + " V" + y4 + " C" + [x6, y5, x5, y6, x4, y6, x4 - (x4 - x3) / 3, y6, x3 + (x4 - x3) / 3, y6, x3, y6, x2, y6, x, y5, x, y4, x, y4 - (y4 - y3) / 3, x, y3 + (y4 - y3) / 3, x, y3, x, y2, x2, y, x3, y, x3 + (x4 - x3) / 3, y, x4 - (x4 - x3) / 3, y, x4, y, x5, y, x6, y2, x6, y3].join(",") + "z";
    } else {
      data = "M" + (x + w) + "," + y + " v" + h + " h" + -w + " v" + -h + " h" + w + "z";
    }
  } else if (type === "circle" || type === "ellipse") {
    if (type === "circle") {
      r = ry = attr.r;
      rycirc = r * circ;
    } else {
      r = attr.rx;
      ry = attr.ry;
      rycirc = ry * circ;
    }

    x = attr.cx;
    y = attr.cy;
    rcirc = r * circ;
    data = "M" + (x + r) + "," + y + " C" + [x + r, y + rycirc, x + rcirc, y + ry, x, y + ry, x - rcirc, y + ry, x - r, y + rycirc, x - r, y, x - r, y - rycirc, x - rcirc, y - ry, x, y - ry, x + rcirc, y - ry, x + r, y - rycirc, x + r, y].join(",") + "z";
  } else if (type === "line") {
    data = "M" + attr.x1 + "," + attr.y1 + " L" + attr.x2 + "," + attr.y2; //previously, we just converted to "Mx,y Lx,y" but Safari has bugs that cause that not to render properly when using a stroke-dasharray that's not fully visible! Using a cubic bezier fixes that issue.
  } else if (type === "polyline" || type === "polygon") {
    points = (element.getAttribute("points") + "").match(_numbersExp) || [];
    x = points.shift();
    y = points.shift();
    data = "M" + x + "," + y + " L" + points.join(",");

    if (type === "polygon") {
      data += "," + x + "," + y + "z";
    }
  }

  path.setAttribute("d", rawPathToString(path._gsRawPath = stringToRawPath(data)));

  if (swap && element.parentNode) {
    element.parentNode.insertBefore(path, element);
    element.parentNode.removeChild(element);
  }

  return path;
} //returns the rotation (in degrees) at a particular progress on a rawPath (the slope of the tangent)

function getRotationAtProgress(rawPath, progress) {
  var d = getProgressData(rawPath, progress >= 1 ? 1 - 1e-9 : progress ? progress : 1e-9);
  return getRotationAtBezierT(d.segment, d.i, d.t);
}

function getRotationAtBezierT(segment, i, t) {
  var a = segment[i],
      b = segment[i + 2],
      c = segment[i + 4],
      x;
  a += (b - a) * t;
  b += (c - b) * t;
  a += (b - a) * t;
  x = b + (c + (segment[i + 6] - c) * t - b) * t - a;
  a = segment[i + 1];
  b = segment[i + 3];
  c = segment[i + 5];
  a += (b - a) * t;
  b += (c - b) * t;
  a += (b - a) * t;
  return _round(_atan2(b + (c + (segment[i + 7] - c) * t - b) * t - a, x) * _RAD2DEG);
}

function sliceRawPath(rawPath, start, end) {
  if (_isUndefined(end)) {
    end = 1;
  }

  start = start || 0;
  var reverse = start > end,
      loops = Math.max(0, ~~(_abs(end - start) - 1e-8));

  if (reverse) {
    reverse = end;
    end = start;
    start = reverse;
    reverse = 1;
    loops -= loops ? 1 : 0;
  }

  if (start < 0 || end < 0) {
    var offset = ~~Math.min(start, end) + 1;
    start += offset;
    end += offset;
  }

  var path = copyRawPath(rawPath.totalLength ? rawPath : cacheRawPathMeasurements(rawPath)),
      wrap = end > 1,
      s = getProgressData(path, start, _temp, true),
      e = getProgressData(path, end, _temp2),
      eSeg = e.segment,
      sSeg = s.segment,
      eSegIndex = e.segIndex,
      sSegIndex = s.segIndex,
      ei = e.i,
      si = s.i,
      sameSegment = sSegIndex === eSegIndex,
      sameBezier = ei === si && sameSegment,
      invertedOrder = sameSegment && si > ei || sameBezier && s.t > e.t,
      sShift,
      eShift,
      i,
      copy,
      totalSegments,
      l,
      j;

  if (wrap || loops) {
    if (_splitSegment(path, sSegIndex, si, s.t)) {
      sShift = 1;
      sSegIndex++;

      if (sameBezier) {
        if (invertedOrder) {
          e.t /= s.t;
        } else {
          e.t = (e.t - s.t) / (1 - s.t);
          eSegIndex++;
          ei = 0;
        }
      } else if (sSegIndex <= eSegIndex + 1 && !invertedOrder) {
        eSegIndex++;

        if (sameSegment) {
          ei -= si;
        }
      }
    }

    if (!e.t) {
      eSegIndex--;

      if (reverse) {
        sSegIndex--;
      }
    } else if (_splitSegment(path, eSegIndex, ei, e.t)) {
      if (invertedOrder && sShift) {
        sSegIndex++;
      }

      if (reverse) {
        eSegIndex++;
      }
    }

    copy = [];
    totalSegments = path.length;
    l = 1 + totalSegments * loops;
    j = sSegIndex;

    if (reverse) {
      eSegIndex = (eSegIndex || totalSegments) - 1;
      l += (totalSegments - eSegIndex + sSegIndex) % totalSegments;

      for (i = 0; i < l; i++) {
        _appendOrMerge(copy, path[j]);

        j = (j || totalSegments) - 1;
      }
    } else {
      l += (totalSegments - sSegIndex + eSegIndex) % totalSegments;

      for (i = 0; i < l; i++) {
        _appendOrMerge(copy, path[j++ % totalSegments]);
      }
    }

    path = copy;
  } else {
    eShift = e.t === 1 ? 6 : subdivideSegment(eSeg, ei, e.t);

    if (start !== end) {
      sShift = subdivideSegment(sSeg, si, sameBezier ? s.t / e.t : s.t);

      if (sameSegment) {
        eShift += sShift;
      }

      eSeg.splice(ei + eShift + 2);

      if (sShift || si) {
        sSeg.splice(0, si + sShift);
      }

      i = path.length;

      while (i--) {
        //chop off any extra segments
        if (i < sSegIndex || i > eSegIndex) {
          path.splice(i, 1);
        }
      }
    } else {
      eSeg.angle = getRotationAtBezierT(eSeg, ei + eShift, 0); //record the value before we chop because it'll be impossible to determine the angle after its length is 0!

      ei += eShift;
      s = eSeg[ei];
      e = eSeg[ei + 1];
      eSeg.length = eSeg.totalLength = 0;
      eSeg.totalPoints = path.totalPoints = 8;
      eSeg.push(s, e, s, e, s, e, s, e);
    }
  }

  if (reverse) {
    _reverseRawPath(path, wrap || loops);
  }

  path.totalLength = 0;
  return path;
} //measures a Segment according to its resolution (so if segment.resolution is 6, for example, it'll take 6 samples equally across each Bezier) and create/populate a "samples" array that has the length up to each of those sample points (always increasing from the start) as well as a "lookup" array that's broken up according to the smallest distance between 2 samples. This gives us a very fast way of looking up a progress position rather than looping through all the points/Beziers. You can optionally have it only measure a subset, starting at startIndex and going for a specific number of beziers (remember, there are 3 x/y pairs each, for a total of 6 elements for each Bezier). It will also populate a "totalLength" property, but that's not generally super accurate because by default it'll only take 6 samples per Bezier. But for performance reasons, it's perfectly adequate for measuring progress values along the path. If you need a more accurate totalLength, either increase the resolution or use the more advanced bezierToPoints() method which keeps adding points until they don't deviate by more than a certain precision value.

function measureSegment(segment, startIndex, bezierQty) {
  startIndex = startIndex || 0;

  if (!segment.samples) {
    segment.samples = [];
    segment.lookup = [];
  }

  var resolution = ~~segment.resolution || 12,
      inc = 1 / resolution,
      endIndex = bezierQty ? startIndex + bezierQty * 6 + 1 : segment.length,
      x1 = segment[startIndex],
      y1 = segment[startIndex + 1],
      samplesIndex = startIndex ? startIndex / 6 * resolution : 0,
      samples = segment.samples,
      lookup = segment.lookup,
      min = (startIndex ? segment.minLength : _largeNum) || _largeNum,
      prevLength = samples[samplesIndex + bezierQty * resolution - 1],
      length = startIndex ? samples[samplesIndex - 1] : 0,
      i,
      j,
      x4,
      x3,
      x2,
      xd,
      xd1,
      y4,
      y3,
      y2,
      yd,
      yd1,
      inv,
      t,
      lengthIndex,
      l,
      segLength;
  samples.length = lookup.length = 0;

  for (j = startIndex + 2; j < endIndex; j += 6) {
    x4 = segment[j + 4] - x1;
    x3 = segment[j + 2] - x1;
    x2 = segment[j] - x1;
    y4 = segment[j + 5] - y1;
    y3 = segment[j + 3] - y1;
    y2 = segment[j + 1] - y1;
    xd = xd1 = yd = yd1 = 0;

    if (_abs(x4) < 1e-5 && _abs(y4) < 1e-5 && _abs(x2) + _abs(y2) < 1e-5) {
      //dump points that are sufficiently close (basically right on top of each other, making a bezier super tiny or 0 length)
      if (segment.length > 8) {
        segment.splice(j, 6);
        j -= 6;
        endIndex -= 6;
      }
    } else {
      for (i = 1; i <= resolution; i++) {
        t = inc * i;
        inv = 1 - t;
        xd = xd1 - (xd1 = (t * t * x4 + 3 * inv * (t * x3 + inv * x2)) * t);
        yd = yd1 - (yd1 = (t * t * y4 + 3 * inv * (t * y3 + inv * y2)) * t);
        l = _sqrt(yd * yd + xd * xd);

        if (l < min) {
          min = l;
        }

        length += l;
        samples[samplesIndex++] = length;
      }
    }

    x1 += x4;
    y1 += y4;
  }

  if (prevLength) {
    prevLength -= length;

    for (; samplesIndex < samples.length; samplesIndex++) {
      samples[samplesIndex] += prevLength;
    }
  }

  if (samples.length && min) {
    segment.totalLength = segLength = samples[samples.length - 1] || 0;
    segment.minLength = min;
    l = lengthIndex = 0;

    for (i = 0; i < segLength; i += min) {
      lookup[l++] = samples[lengthIndex] < i ? ++lengthIndex : lengthIndex;
    }
  } else {
    segment.totalLength = samples[0] = 0;
  }

  return startIndex ? length - samples[startIndex / 2 - 1] : length;
}

function cacheRawPathMeasurements(rawPath, resolution) {
  var pathLength, points, i;

  for (i = pathLength = points = 0; i < rawPath.length; i++) {
    rawPath[i].resolution = ~~resolution || 12; //steps per Bezier curve (anchor, 2 control points, to anchor)

    points += rawPath[i].length;
    pathLength += measureSegment(rawPath[i]);
  }

  rawPath.totalPoints = points;
  rawPath.totalLength = pathLength;
  return rawPath;
} //divide segment[i] at position t (value between 0 and 1, progress along that particular cubic bezier segment that starts at segment[i]). Returns how many elements were spliced into the segment array (either 0 or 6)

function subdivideSegment(segment, i, t) {
  if (t <= 0 || t >= 1) {
    return 0;
  }

  var ax = segment[i],
      ay = segment[i + 1],
      cp1x = segment[i + 2],
      cp1y = segment[i + 3],
      cp2x = segment[i + 4],
      cp2y = segment[i + 5],
      bx = segment[i + 6],
      by = segment[i + 7],
      x1a = ax + (cp1x - ax) * t,
      x2 = cp1x + (cp2x - cp1x) * t,
      y1a = ay + (cp1y - ay) * t,
      y2 = cp1y + (cp2y - cp1y) * t,
      x1 = x1a + (x2 - x1a) * t,
      y1 = y1a + (y2 - y1a) * t,
      x2a = cp2x + (bx - cp2x) * t,
      y2a = cp2y + (by - cp2y) * t;
  x2 += (x2a - x2) * t;
  y2 += (y2a - y2) * t;
  segment.splice(i + 2, 4, _round(x1a), //first control point
  _round(y1a), _round(x1), //second control point
  _round(y1), _round(x1 + (x2 - x1) * t), //new fabricated anchor on line
  _round(y1 + (y2 - y1) * t), _round(x2), //third control point
  _round(y2), _round(x2a), //fourth control point
  _round(y2a));
  segment.samples && segment.samples.splice(i / 6 * segment.resolution | 0, 0, 0, 0, 0, 0, 0, 0);
  return 6;
} // returns an object {path, segment, segIndex, i, t}

function getProgressData(rawPath, progress, decoratee, pushToNextIfAtEnd) {
  decoratee = decoratee || {};
  rawPath.totalLength || cacheRawPathMeasurements(rawPath);

  if (progress < 0 || progress > 1) {
    progress = _wrapProgress(progress);
  }

  var segIndex = 0,
      segment = rawPath[0],
      samples,
      resolution,
      length,
      min,
      max,
      i,
      t;

  if (rawPath.length > 1) {
    //speed optimization: most of the time, there's only one segment so skip the recursion.
    length = rawPath.totalLength * progress;
    max = i = 0;

    while ((max += rawPath[i++].totalLength) < length) {
      segIndex = i;
    }

    segment = rawPath[segIndex];
    min = max - segment.totalLength;
    progress = (length - min) / (max - min) || 0;
  }

  samples = segment.samples;
  resolution = segment.resolution; //how many samples per cubic bezier chunk

  length = segment.totalLength * progress;
  i = segment.lookup[~~(length / segment.minLength)] || 0;
  min = i ? samples[i - 1] : 0;
  max = samples[i];

  if (max < length) {
    min = max;
    max = samples[++i];
  }

  t = 1 / resolution * ((length - min) / (max - min) + i % resolution);
  i = ~~(i / resolution) * 6;

  if (pushToNextIfAtEnd && t === 1) {
    if (i + 6 < segment.length) {
      i += 6;
      t = 0;
    } else if (segIndex + 1 < rawPath.length) {
      i = t = 0;
      segment = rawPath[++segIndex];
    }
  }

  decoratee.t = t;
  decoratee.i = i;
  decoratee.path = rawPath;
  decoratee.segment = segment;
  decoratee.segIndex = segIndex;
  return decoratee;
}

function getPositionOnPath(rawPath, progress, includeAngle, point) {
  var segment = rawPath[0],
      result = point || {},
      samples,
      resolution,
      length,
      min,
      max,
      i,
      t,
      a,
      inv;

  if (progress < 0 || progress > 1) {
    progress = _wrapProgress(progress);
  }

  if (rawPath.length > 1) {
    //speed optimization: most of the time, there's only one segment so skip the recursion.
    length = rawPath.totalLength * progress;
    max = i = 0;

    while ((max += rawPath[i++].totalLength) < length) {
      segment = rawPath[i];
    }

    min = max - segment.totalLength;
    progress = (length - min) / (max - min) || 0;
  }

  samples = segment.samples;
  resolution = segment.resolution;
  length = segment.totalLength * progress;
  i = segment.lookup[~~(length / segment.minLength)] || 0;
  min = i ? samples[i - 1] : 0;
  max = samples[i];

  if (max < length) {
    min = max;
    max = samples[++i];
  }

  t = 1 / resolution * ((length - min) / (max - min) + i % resolution) || 0;
  inv = 1 - t;
  i = ~~(i / resolution) * 6;
  a = segment[i];
  result.x = _round((t * t * (segment[i + 6] - a) + 3 * inv * (t * (segment[i + 4] - a) + inv * (segment[i + 2] - a))) * t + a);
  result.y = _round((t * t * (segment[i + 7] - (a = segment[i + 1])) + 3 * inv * (t * (segment[i + 5] - a) + inv * (segment[i + 3] - a))) * t + a);

  if (includeAngle) {
    result.angle = segment.totalLength ? getRotationAtBezierT(segment, i, t >= 1 ? 1 - 1e-9 : t ? t : 1e-9) : segment.angle || 0;
  }

  return result;
} //applies a matrix transform to RawPath (or a segment in a RawPath) and returns whatever was passed in (it transforms the values in the array(s), not a copy).

function transformRawPath(rawPath, a, b, c, d, tx, ty) {
  var j = rawPath.length,
      segment,
      l,
      i,
      x,
      y;

  while (--j > -1) {
    segment = rawPath[j];
    l = segment.length;

    for (i = 0; i < l; i += 2) {
      x = segment[i];
      y = segment[i + 1];
      segment[i] = x * a + y * c + tx;
      segment[i + 1] = x * b + y * d + ty;
    }
  }

  rawPath._dirty = 1;
  return rawPath;
} // translates SVG arc data into a segment (cubic beziers). Angle is in degrees.

function arcToSegment(lastX, lastY, rx, ry, angle, largeArcFlag, sweepFlag, x, y) {
  if (lastX === x && lastY === y) {
    return;
  }

  rx = _abs(rx);
  ry = _abs(ry);

  var angleRad = angle % 360 * _DEG2RAD,
      cosAngle = _cos(angleRad),
      sinAngle = _sin(angleRad),
      PI = Math.PI,
      TWOPI = PI * 2,
      dx2 = (lastX - x) / 2,
      dy2 = (lastY - y) / 2,
      x1 = cosAngle * dx2 + sinAngle * dy2,
      y1 = -sinAngle * dx2 + cosAngle * dy2,
      x1_sq = x1 * x1,
      y1_sq = y1 * y1,
      radiiCheck = x1_sq / (rx * rx) + y1_sq / (ry * ry);

  if (radiiCheck > 1) {
    rx = _sqrt(radiiCheck) * rx;
    ry = _sqrt(radiiCheck) * ry;
  }

  var rx_sq = rx * rx,
      ry_sq = ry * ry,
      sq = (rx_sq * ry_sq - rx_sq * y1_sq - ry_sq * x1_sq) / (rx_sq * y1_sq + ry_sq * x1_sq);

  if (sq < 0) {
    sq = 0;
  }

  var coef = (largeArcFlag === sweepFlag ? -1 : 1) * _sqrt(sq),
      cx1 = coef * (rx * y1 / ry),
      cy1 = coef * -(ry * x1 / rx),
      sx2 = (lastX + x) / 2,
      sy2 = (lastY + y) / 2,
      cx = sx2 + (cosAngle * cx1 - sinAngle * cy1),
      cy = sy2 + (sinAngle * cx1 + cosAngle * cy1),
      ux = (x1 - cx1) / rx,
      uy = (y1 - cy1) / ry,
      vx = (-x1 - cx1) / rx,
      vy = (-y1 - cy1) / ry,
      temp = ux * ux + uy * uy,
      angleStart = (uy < 0 ? -1 : 1) * Math.acos(ux / _sqrt(temp)),
      angleExtent = (ux * vy - uy * vx < 0 ? -1 : 1) * Math.acos((ux * vx + uy * vy) / _sqrt(temp * (vx * vx + vy * vy)));

  isNaN(angleExtent) && (angleExtent = PI); //rare edge case. Math.cos(-1) is NaN.

  if (!sweepFlag && angleExtent > 0) {
    angleExtent -= TWOPI;
  } else if (sweepFlag && angleExtent < 0) {
    angleExtent += TWOPI;
  }

  angleStart %= TWOPI;
  angleExtent %= TWOPI;

  var segments = Math.ceil(_abs(angleExtent) / (TWOPI / 4)),
      rawPath = [],
      angleIncrement = angleExtent / segments,
      controlLength = 4 / 3 * _sin(angleIncrement / 2) / (1 + _cos(angleIncrement / 2)),
      ma = cosAngle * rx,
      mb = sinAngle * rx,
      mc = sinAngle * -ry,
      md = cosAngle * ry,
      i;

  for (i = 0; i < segments; i++) {
    angle = angleStart + i * angleIncrement;
    x1 = _cos(angle);
    y1 = _sin(angle);
    ux = _cos(angle += angleIncrement);
    uy = _sin(angle);
    rawPath.push(x1 - controlLength * y1, y1 + controlLength * x1, ux + controlLength * uy, uy - controlLength * ux, ux, uy);
  } //now transform according to the actual size of the ellipse/arc (the beziers were noramlized, between 0 and 1 on a circle).


  for (i = 0; i < rawPath.length; i += 2) {
    x1 = rawPath[i];
    y1 = rawPath[i + 1];
    rawPath[i] = x1 * ma + y1 * mc + cx;
    rawPath[i + 1] = x1 * mb + y1 * md + cy;
  }

  rawPath[i - 2] = x; //always set the end to exactly where it's supposed to be

  rawPath[i - 1] = y;
  return rawPath;
} //Spits back a RawPath with absolute coordinates. Each segment starts with a "moveTo" command (x coordinate, then y) and then 2 control points (x, y, x, y), then anchor. The goal is to minimize memory and maximize speed.


function stringToRawPath(d) {
  var a = (d + "").replace(_scientific, function (m) {
    var n = +m;
    return n < 0.0001 && n > -0.0001 ? 0 : n;
  }).match(_svgPathExp) || [],
      //some authoring programs spit out very small numbers in scientific notation like "1e-5", so make sure we round that down to 0 first.
  path = [],
      relativeX = 0,
      relativeY = 0,
      twoThirds = 2 / 3,
      elements = a.length,
      points = 0,
      errorMessage = "ERROR: malformed path: " + d,
      i,
      j,
      x,
      y,
      command,
      isRelative,
      segment,
      startX,
      startY,
      difX,
      difY,
      beziers,
      prevCommand,
      flag1,
      flag2,
      line = function line(sx, sy, ex, ey) {
    difX = (ex - sx) / 3;
    difY = (ey - sy) / 3;
    segment.push(sx + difX, sy + difY, ex - difX, ey - difY, ex, ey);
  };

  if (!d || !isNaN(a[0]) || isNaN(a[1])) {
    console.log(errorMessage);
    return path;
  }

  for (i = 0; i < elements; i++) {
    prevCommand = command;

    if (isNaN(a[i])) {
      command = a[i].toUpperCase();
      isRelative = command !== a[i]; //lower case means relative
    } else {
      //commands like "C" can be strung together without any new command characters between.
      i--;
    }

    x = +a[i + 1];
    y = +a[i + 2];

    if (isRelative) {
      x += relativeX;
      y += relativeY;
    }

    if (!i) {
      startX = x;
      startY = y;
    } // "M" (move)


    if (command === "M") {
      if (segment) {
        if (segment.length < 8) {
          //if the path data was funky and just had a M with no actual drawing anywhere, skip it.
          path.length -= 1;
        } else {
          points += segment.length;
        }
      }

      relativeX = startX = x;
      relativeY = startY = y;
      segment = [x, y];
      path.push(segment);
      i += 2;
      command = "L"; //an "M" with more than 2 values gets interpreted as "lineTo" commands ("L").
      // "C" (cubic bezier)
    } else if (command === "C") {
      if (!segment) {
        segment = [0, 0];
      }

      if (!isRelative) {
        relativeX = relativeY = 0;
      } //note: "*1" is just a fast/short way to cast the value as a Number. WAAAY faster in Chrome, slightly slower in Firefox.


      segment.push(x, y, relativeX + a[i + 3] * 1, relativeY + a[i + 4] * 1, relativeX += a[i + 5] * 1, relativeY += a[i + 6] * 1);
      i += 6; // "S" (continuation of cubic bezier)
    } else if (command === "S") {
      difX = relativeX;
      difY = relativeY;

      if (prevCommand === "C" || prevCommand === "S") {
        difX += relativeX - segment[segment.length - 4];
        difY += relativeY - segment[segment.length - 3];
      }

      if (!isRelative) {
        relativeX = relativeY = 0;
      }

      segment.push(difX, difY, x, y, relativeX += a[i + 3] * 1, relativeY += a[i + 4] * 1);
      i += 4; // "Q" (quadratic bezier)
    } else if (command === "Q") {
      difX = relativeX + (x - relativeX) * twoThirds;
      difY = relativeY + (y - relativeY) * twoThirds;

      if (!isRelative) {
        relativeX = relativeY = 0;
      }

      relativeX += a[i + 3] * 1;
      relativeY += a[i + 4] * 1;
      segment.push(difX, difY, relativeX + (x - relativeX) * twoThirds, relativeY + (y - relativeY) * twoThirds, relativeX, relativeY);
      i += 4; // "T" (continuation of quadratic bezier)
    } else if (command === "T") {
      difX = relativeX - segment[segment.length - 4];
      difY = relativeY - segment[segment.length - 3];
      segment.push(relativeX + difX, relativeY + difY, x + (relativeX + difX * 1.5 - x) * twoThirds, y + (relativeY + difY * 1.5 - y) * twoThirds, relativeX = x, relativeY = y);
      i += 2; // "H" (horizontal line)
    } else if (command === "H") {
      line(relativeX, relativeY, relativeX = x, relativeY);
      i += 1; // "V" (vertical line)
    } else if (command === "V") {
      //adjust values because the first (and only one) isn't x in this case, it's y.
      line(relativeX, relativeY, relativeX, relativeY = x + (isRelative ? relativeY - relativeX : 0));
      i += 1; // "L" (line) or "Z" (close)
    } else if (command === "L" || command === "Z") {
      if (command === "Z") {
        x = startX;
        y = startY;
        segment.closed = true;
      }

      if (command === "L" || _abs(relativeX - x) > 0.5 || _abs(relativeY - y) > 0.5) {
        line(relativeX, relativeY, x, y);

        if (command === "L") {
          i += 2;
        }
      }

      relativeX = x;
      relativeY = y; // "A" (arc)
    } else if (command === "A") {
      flag1 = a[i + 4];
      flag2 = a[i + 5];
      difX = a[i + 6];
      difY = a[i + 7];
      j = 7;

      if (flag1.length > 1) {
        // for cases when the flags are merged, like "a8 8 0 018 8" (the 0 and 1 flags are WITH the x value of 8, but it could also be "a8 8 0 01-8 8" so it may include x or not)
        if (flag1.length < 3) {
          difY = difX;
          difX = flag2;
          j--;
        } else {
          difY = flag2;
          difX = flag1.substr(2);
          j -= 2;
        }

        flag2 = flag1.charAt(1);
        flag1 = flag1.charAt(0);
      }

      beziers = arcToSegment(relativeX, relativeY, +a[i + 1], +a[i + 2], +a[i + 3], +flag1, +flag2, (isRelative ? relativeX : 0) + difX * 1, (isRelative ? relativeY : 0) + difY * 1);
      i += j;

      if (beziers) {
        for (j = 0; j < beziers.length; j++) {
          segment.push(beziers[j]);
        }
      }

      relativeX = segment[segment.length - 2];
      relativeY = segment[segment.length - 1];
    } else {
      console.log(errorMessage);
    }
  }

  i = segment.length;

  if (i < 6) {
    //in case there's odd SVG like a M0,0 command at the very end.
    path.pop();
    i = 0;
  } else if (segment[0] === segment[i - 2] && segment[1] === segment[i - 1]) {
    segment.closed = true;
  }

  path.totalPoints = points + i;
  return path;
} //populates the points array in alternating x/y values (like [x, y, x, y...] instead of individual point objects [{x, y}, {x, y}...] to conserve memory and stay in line with how we're handling segment arrays

function bezierToPoints(x1, y1, x2, y2, x3, y3, x4, y4, threshold, points, index) {
  var x12 = (x1 + x2) / 2,
      y12 = (y1 + y2) / 2,
      x23 = (x2 + x3) / 2,
      y23 = (y2 + y3) / 2,
      x34 = (x3 + x4) / 2,
      y34 = (y3 + y4) / 2,
      x123 = (x12 + x23) / 2,
      y123 = (y12 + y23) / 2,
      x234 = (x23 + x34) / 2,
      y234 = (y23 + y34) / 2,
      x1234 = (x123 + x234) / 2,
      y1234 = (y123 + y234) / 2,
      dx = x4 - x1,
      dy = y4 - y1,
      d2 = _abs((x2 - x4) * dy - (y2 - y4) * dx),
      d3 = _abs((x3 - x4) * dy - (y3 - y4) * dx),
      length;

  if (!points) {
    points = [x1, y1, x4, y4];
    index = 2;
  }

  points.splice(index || points.length - 2, 0, x1234, y1234);

  if ((d2 + d3) * (d2 + d3) > threshold * (dx * dx + dy * dy)) {
    length = points.length;
    bezierToPoints(x1, y1, x12, y12, x123, y123, x1234, y1234, threshold, points, index);
    bezierToPoints(x1234, y1234, x234, y234, x34, y34, x4, y4, threshold, points, index + 2 + (points.length - length));
  }

  return points;
}
/*
function getAngleBetweenPoints(x0, y0, x1, y1, x2, y2) { //angle between 3 points in radians
	var dx1 = x1 - x0,
		dy1 = y1 - y0,
		dx2 = x2 - x1,
		dy2 = y2 - y1,
		dx3 = x2 - x0,
		dy3 = y2 - y0,
		a = dx1 * dx1 + dy1 * dy1,
		b = dx2 * dx2 + dy2 * dy2,
		c = dx3 * dx3 + dy3 * dy3;
	return Math.acos( (a + b - c) / _sqrt(4 * a * b) );
},
*/
//pointsToSegment() doesn't handle flat coordinates (where y is always 0) the way we need (the resulting control points are always right on top of the anchors), so this function basically makes the control points go directly up and down, varying in length based on the curviness (more curvy, further control points)

function flatPointsToSegment(points, curviness) {
  if (curviness === void 0) {
    curviness = 1;
  }

  var x = points[0],
      y = 0,
      segment = [x, y],
      i = 2;

  for (; i < points.length; i += 2) {
    segment.push(x, y, points[i], y = (points[i] - x) * curviness / 2, x = points[i], -y);
  }

  return segment;
} //points is an array of x/y points, like [x, y, x, y, x, y]

function pointsToSegment(points, curviness, cornerThreshold) {
  //points = simplifyPoints(points, tolerance);
  var l = points.length - 2,
      x = +points[0],
      y = +points[1],
      nextX = +points[2],
      nextY = +points[3],
      segment = [x, y, x, y],
      dx2 = nextX - x,
      dy2 = nextY - y,
      closed = Math.abs(points[l] - x) < 0.001 && Math.abs(points[l + 1] - y) < 0.001,
      prevX,
      prevY,
      angle,
      slope,
      i,
      dx1,
      dx3,
      dy1,
      dy3,
      d1,
      d2,
      a,
      b,
      c;

  if (isNaN(cornerThreshold)) {
    cornerThreshold = Math.PI / 10;
  }

  if (closed) {
    // if the start and end points are basically on top of each other, close the segment by adding the 2nd point to the end, and the 2nd-to-last point to the beginning (we'll remove them at the end, but this allows the curvature to look perfect)
    points.push(nextX, nextY);
    nextX = x;
    nextY = y;
    x = points[l - 2];
    y = points[l - 1];
    points.unshift(x, y);
    l += 4;
  }

  curviness = curviness || curviness === 0 ? +curviness : 1;

  for (i = 2; i < l; i += 2) {
    prevX = x;
    prevY = y;
    x = nextX;
    y = nextY;
    nextX = +points[i + 2];
    nextY = +points[i + 3];
    dx1 = dx2;
    dy1 = dy2;
    dx2 = nextX - x;
    dy2 = nextY - y;
    dx3 = nextX - prevX;
    dy3 = nextY - prevY;
    a = dx1 * dx1 + dy1 * dy1;
    b = dx2 * dx2 + dy2 * dy2;
    c = dx3 * dx3 + dy3 * dy3;
    angle = Math.acos((a + b - c) / _sqrt(4 * a * b)); //angle between the 3 points

    d2 = angle / Math.PI * curviness; //temporary precalculation for speed (reusing d2 variable)

    d1 = _sqrt(a) * d2; //the tighter the angle, the shorter we make the handles in proportion.

    d2 *= _sqrt(b);

    if (x !== prevX || y !== prevY) {
      if (angle > cornerThreshold) {
        slope = _atan2(dy3, dx3);
        segment.push(_round(x - _cos(slope) * d1), //first control point
        _round(y - _sin(slope) * d1), _round(x), //anchor
        _round(y), _round(x + _cos(slope) * d2), //second control point
        _round(y + _sin(slope) * d2));
      } else {
        slope = _atan2(dy1, dx1);
        segment.push(_round(x - _cos(slope) * d1), //first control point
        _round(y - _sin(slope) * d1));
        slope = _atan2(dy2, dx2);
        segment.push(_round(x), //anchor
        _round(y), _round(x + _cos(slope) * d2), //second control point
        _round(y + _sin(slope) * d2));
      }
    }
  }

  segment.push(_round(nextX), _round(nextY), _round(nextX), _round(nextY));

  if (closed) {
    segment.splice(0, 6);
    segment.length = segment.length - 6;
  }

  return segment;
} //returns the squared distance between an x/y coordinate and a segment between x1/y1 and x2/y2

function pointToSegDist(x, y, x1, y1, x2, y2) {
  var dx = x2 - x1,
      dy = y2 - y1,
      t;

  if (dx || dy) {
    t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);

    if (t > 1) {
      x1 = x2;
      y1 = y2;
    } else if (t > 0) {
      x1 += dx * t;
      y1 += dy * t;
    }
  }

  return Math.pow(x - x1, 2) + Math.pow(y - y1, 2);
}

function simplifyStep(points, first, last, tolerance, simplified) {
  var maxSqDist = tolerance,
      firstX = points[first],
      firstY = points[first + 1],
      lastX = points[last],
      lastY = points[last + 1],
      index,
      i,
      d;

  for (i = first + 2; i < last; i += 2) {
    d = pointToSegDist(points[i], points[i + 1], firstX, firstY, lastX, lastY);

    if (d > maxSqDist) {
      index = i;
      maxSqDist = d;
    }
  }

  if (maxSqDist > tolerance) {
    if (index - first > 2) {
      simplifyStep(points, first, index, tolerance, simplified);
    }

    simplified.push(points[index], points[index + 1]);

    if (last - index > 2) {
      simplifyStep(points, index, last, tolerance, simplified);
    }
  }
} //points is an array of x/y values like [x, y, x, y, x, y]


function simplifyPoints(points, tolerance) {
  var prevX = parseFloat(points[0]),
      prevY = parseFloat(points[1]),
      temp = [prevX, prevY],
      l = points.length - 2,
      i,
      x,
      y,
      dx,
      dy,
      result,
      last;
  tolerance = Math.pow(tolerance || 1, 2);

  for (i = 2; i < l; i += 2) {
    x = parseFloat(points[i]);
    y = parseFloat(points[i + 1]);
    dx = prevX - x;
    dy = prevY - y;

    if (dx * dx + dy * dy > tolerance) {
      temp.push(x, y);
      prevX = x;
      prevY = y;
    }
  }

  temp.push(parseFloat(points[l]), parseFloat(points[l + 1]));
  last = temp.length - 2;
  result = [temp[0], temp[1]];
  simplifyStep(temp, 0, last, tolerance, result);
  result.push(temp[last], temp[last + 1]);
  return result;
}

function getClosestProgressOnBezier(iterations, px, py, start, end, slices, x0, y0, x1, y1, x2, y2, x3, y3) {
  var inc = (end - start) / slices,
      best = 0,
      t = start,
      x,
      y,
      d,
      dx,
      dy,
      inv;
  _bestDistance = _largeNum;

  while (t <= end) {
    inv = 1 - t;
    x = inv * inv * inv * x0 + 3 * inv * inv * t * x1 + 3 * inv * t * t * x2 + t * t * t * x3;
    y = inv * inv * inv * y0 + 3 * inv * inv * t * y1 + 3 * inv * t * t * y2 + t * t * t * y3;
    dx = x - px;
    dy = y - py;
    d = dx * dx + dy * dy;

    if (d < _bestDistance) {
      _bestDistance = d;
      best = t;
    }

    t += inc;
  }

  return iterations > 1 ? getClosestProgressOnBezier(iterations - 1, px, py, Math.max(best - inc, 0), Math.min(best + inc, 1), slices, x0, y0, x1, y1, x2, y2, x3, y3) : best;
}

function getClosestData(rawPath, x, y, slices) {
  //returns an object with the closest j, i, and t (j is the segment index, i is the index of the point in that segment, and t is the time/progress along that bezier)
  var closest = {
    j: 0,
    i: 0,
    t: 0
  },
      bestDistance = _largeNum,
      i,
      j,
      t,
      segment;

  for (j = 0; j < rawPath.length; j++) {
    segment = rawPath[j];

    for (i = 0; i < segment.length; i += 6) {
      t = getClosestProgressOnBezier(1, x, y, 0, 1, slices || 20, segment[i], segment[i + 1], segment[i + 2], segment[i + 3], segment[i + 4], segment[i + 5], segment[i + 6], segment[i + 7]);

      if (bestDistance > _bestDistance) {
        bestDistance = _bestDistance;
        closest.j = j;
        closest.i = i;
        closest.t = t;
      }
    }
  }

  return closest;
} //subdivide a Segment closest to a specific x,y coordinate

function subdivideSegmentNear(x, y, segment, slices, iterations) {
  var l = segment.length,
      bestDistance = _largeNum,
      bestT = 0,
      bestSegmentIndex = 0,
      t,
      i;
  slices = slices || 20;
  iterations = iterations || 3;

  for (i = 0; i < l; i += 6) {
    t = getClosestProgressOnBezier(1, x, y, 0, 1, slices, segment[i], segment[i + 1], segment[i + 2], segment[i + 3], segment[i + 4], segment[i + 5], segment[i + 6], segment[i + 7]);

    if (bestDistance > _bestDistance) {
      bestDistance = _bestDistance;
      bestT = t;
      bestSegmentIndex = i;
    }
  }

  t = getClosestProgressOnBezier(iterations, x, y, bestT - 0.05, bestT + 0.05, slices, segment[bestSegmentIndex], segment[bestSegmentIndex + 1], segment[bestSegmentIndex + 2], segment[bestSegmentIndex + 3], segment[bestSegmentIndex + 4], segment[bestSegmentIndex + 5], segment[bestSegmentIndex + 6], segment[bestSegmentIndex + 7]);
  subdivideSegment(segment, bestSegmentIndex, t);
  return bestSegmentIndex + 6;
}
/*
Takes any of the following and converts it to an all Cubic Bezier SVG data string:
- A <path> data string like "M0,0 L2,4 v20,15 H100"
- A RawPath, like [[x, y, x, y, x, y, x, y][[x, y, x, y, x, y, x, y]]
- A Segment, like [x, y, x, y, x, y, x, y]

Note: all numbers are rounded down to the closest 0.001 to minimize memory, maximize speed, and avoid odd numbers like 1e-13
*/

function rawPathToString(rawPath) {
  if (_isNumber(rawPath[0])) {
    //in case a segment is passed in instead
    rawPath = [rawPath];
  }

  var result = "",
      l = rawPath.length,
      sl,
      s,
      i,
      segment;

  for (s = 0; s < l; s++) {
    segment = rawPath[s];
    result += "M" + _round(segment[0]) + "," + _round(segment[1]) + " C";
    sl = segment.length;

    for (i = 2; i < sl; i++) {
      result += _round(segment[i++]) + "," + _round(segment[i++]) + " " + _round(segment[i++]) + "," + _round(segment[i++]) + " " + _round(segment[i++]) + "," + _round(segment[i]) + " ";
    }

    if (segment.closed) {
      result += "z";
    }
  }

  return result;
}
/*
// takes a segment with coordinates [x, y, x, y, ...] and converts the control points into angles and lengths [x, y, angle, length, angle, length, x, y, angle, length, ...] so that it animates more cleanly and avoids odd breaks/kinks. For example, if you animate from 1 o'clock to 6 o'clock, it'd just go directly/linearly rather than around. So the length would be very short in the middle of the tween.
export function cpCoordsToAngles(segment, copy) {
	var result = copy ? segment.slice(0) : segment,
		x, y, i;
	for (i = 0; i < segment.length; i+=6) {
		x = segment[i+2] - segment[i];
		y = segment[i+3] - segment[i+1];
		result[i+2] = Math.atan2(y, x);
		result[i+3] = Math.sqrt(x * x + y * y);
		x = segment[i+6] - segment[i+4];
		y = segment[i+7] - segment[i+5];
		result[i+4] = Math.atan2(y, x);
		result[i+5] = Math.sqrt(x * x + y * y);
	}
	return result;
}

// takes a segment that was converted with cpCoordsToAngles() to have angles and lengths instead of coordinates for the control points, and converts it BACK into coordinates.
export function cpAnglesToCoords(segment, copy) {
	var result = copy ? segment.slice(0) : segment,
		length = segment.length,
		rnd = 1000,
		angle, l, i, j;
	for (i = 0; i < length; i+=6) {
		angle = segment[i+2];
		l = segment[i+3]; //length
		result[i+2] = (((segment[i] + Math.cos(angle) * l) * rnd) | 0) / rnd;
		result[i+3] = (((segment[i+1] + Math.sin(angle) * l) * rnd) | 0) / rnd;
		angle = segment[i+4];
		l = segment[i+5]; //length
		result[i+4] = (((segment[i+6] - Math.cos(angle) * l) * rnd) | 0) / rnd;
		result[i+5] = (((segment[i+7] - Math.sin(angle) * l) * rnd) | 0) / rnd;
	}
	return result;
}

//adds an "isSmooth" array to each segment and populates it with a boolean value indicating whether or not it's smooth (the control points have basically the same slope). For any smooth control points, it converts the coordinates into angle (x, in radians) and length (y) and puts them into the same index value in a smoothData array.
export function populateSmoothData(rawPath) {
	let j = rawPath.length,
		smooth, segment, x, y, x2, y2, i, l, a, a2, isSmooth, smoothData;
	while (--j > -1) {
		segment = rawPath[j];
		isSmooth = segment.isSmooth = segment.isSmooth || [0, 0, 0, 0];
		smoothData = segment.smoothData = segment.smoothData || [0, 0, 0, 0];
		isSmooth.length = 4;
		l = segment.length - 2;
		for (i = 6; i < l; i += 6) {
			x = segment[i] - segment[i - 2];
			y = segment[i + 1] - segment[i - 1];
			x2 = segment[i + 2] - segment[i];
			y2 = segment[i + 3] - segment[i + 1];
			a = _atan2(y, x);
			a2 = _atan2(y2, x2);
			smooth = (Math.abs(a - a2) < 0.09);
			if (smooth) {
				smoothData[i - 2] = a;
				smoothData[i + 2] = a2;
				smoothData[i - 1] = _sqrt(x * x + y * y);
				smoothData[i + 3] = _sqrt(x2 * x2 + y2 * y2);
			}
			isSmooth.push(smooth, smooth, 0, 0, smooth, smooth);
		}
		//if the first and last points are identical, check to see if there's a smooth transition. We must handle this a bit differently due to their positions in the array.
		if (segment[l] === segment[0] && segment[l+1] === segment[1]) {
			x = segment[0] - segment[l-2];
			y = segment[1] - segment[l-1];
			x2 = segment[2] - segment[0];
			y2 = segment[3] - segment[1];
			a = _atan2(y, x);
			a2 = _atan2(y2, x2);
			if (Math.abs(a - a2) < 0.09) {
				smoothData[l-2] = a;
				smoothData[2] = a2;
				smoothData[l-1] = _sqrt(x * x + y * y);
				smoothData[3] = _sqrt(x2 * x2 + y2 * y2);
				isSmooth[l-2] = isSmooth[l-1] = true; //don't change indexes 2 and 3 because we'll trigger everything from the END, and this will optimize file size a bit.
			}
		}
	}
	return rawPath;
}
export function pointToScreen(svgElement, point) {
	if (arguments.length < 2) { //by default, take the first set of coordinates in the path as the point
		let rawPath = getRawPath(svgElement);
		point = svgElement.ownerSVGElement.createSVGPoint();
		point.x = rawPath[0][0];
		point.y = rawPath[0][1];
	}
	return point.matrixTransform(svgElement.getScreenCTM());
}

*/

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTAuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGNtYW8vZ3NhcC9DdXN0b21FYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AY21hby9nc2FwL3V0aWxzL3BhdGhzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQ3VzdG9tRWFzZSAzLjMuNFxuICogaHR0cHM6Ly9ncmVlbnNvY2suY29tXG4gKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IDIwMDgtMjAyMCwgR3JlZW5Tb2NrLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogU3ViamVjdCB0byB0aGUgdGVybXMgYXQgaHR0cHM6Ly9ncmVlbnNvY2suY29tL3N0YW5kYXJkLWxpY2Vuc2Ugb3IgZm9yXG4gKiBDbHViIEdyZWVuU29jayBtZW1iZXJzLCB0aGUgYWdyZWVtZW50IGlzc3VlZCB3aXRoIHRoYXQgbWVtYmVyc2hpcC5cbiAqIEBhdXRob3I6IEphY2sgRG95bGUsIGphY2tAZ3JlZW5zb2NrLmNvbVxuKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cbmltcG9ydCB7IHN0cmluZ1RvUmF3UGF0aCwgcmF3UGF0aFRvU3RyaW5nLCB0cmFuc2Zvcm1SYXdQYXRoIH0gZnJvbSBcIi4vdXRpbHMvcGF0aHMuanNcIjtcblxudmFyIGdzYXAsXG4gICAgX2NvcmVJbml0dGVkLFxuICAgIF9nZXRHU0FQID0gZnVuY3Rpb24gX2dldEdTQVAoKSB7XG4gIHJldHVybiBnc2FwIHx8IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgKGdzYXAgPSB3aW5kb3cuZ3NhcCkgJiYgZ3NhcC5yZWdpc3RlclBsdWdpbiAmJiBnc2FwO1xufSxcbiAgICBfaW5pdENvcmUgPSBmdW5jdGlvbiBfaW5pdENvcmUoKSB7XG4gIGdzYXAgPSBfZ2V0R1NBUCgpO1xuXG4gIGlmIChnc2FwKSB7XG4gICAgZ3NhcC5yZWdpc3RlckVhc2UoXCJfQ0VcIiwgQ3VzdG9tRWFzZS5jcmVhdGUpO1xuICAgIF9jb3JlSW5pdHRlZCA9IDE7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS53YXJuKFwiUGxlYXNlIGdzYXAucmVnaXN0ZXJQbHVnaW4oQ3VzdG9tRWFzZSlcIik7XG4gIH1cbn0sXG4gICAgX2JpZ051bSA9IDFlMjAsXG4gICAgX3JvdW5kID0gZnVuY3Rpb24gX3JvdW5kKHZhbHVlKSB7XG4gIHJldHVybiB+fih2YWx1ZSAqIDEwMDAgKyAodmFsdWUgPCAwID8gLS41IDogLjUpKSAvIDEwMDA7XG59LFxuICAgIF9ib251c1ZhbGlkYXRlZCA9IDEsXG4gICAgLy88bmFtZT5DdXN0b21FYXNlPC9uYW1lPlxuX251bUV4cCA9IC9bLSs9XFwuXSpcXGQrW1xcLmVcXC1cXCtdKlxcZCpbZVxcLVxcK10qXFxkKi9naSxcbiAgICAvL2ZpbmRzIGFueSBudW1iZXJzLCBpbmNsdWRpbmcgb25lcyB0aGF0IHN0YXJ0IHdpdGggKz0gb3IgLT0sIG5lZ2F0aXZlIG51bWJlcnMsIGFuZCBvbmVzIGluIHNjaWVudGlmaWMgbm90YXRpb24gbGlrZSAxZS04LlxuX25lZWRzUGFyc2luZ0V4cCA9IC9bY0xsc1NhQWhIdlZ0VHFRXS9nLFxuICAgIF9maW5kTWluaW11bSA9IGZ1bmN0aW9uIF9maW5kTWluaW11bSh2YWx1ZXMpIHtcbiAgdmFyIGwgPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgbWluID0gX2JpZ051bSxcbiAgICAgIGk7XG5cbiAgZm9yIChpID0gMTsgaSA8IGw7IGkgKz0gNikge1xuICAgIGlmICgrdmFsdWVzW2ldIDwgbWluKSB7XG4gICAgICBtaW4gPSArdmFsdWVzW2ldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtaW47XG59LFxuICAgIC8vdGFrZXMgYWxsIHRoZSBwb2ludHMgYW5kIHRyYW5zbGF0ZXMvc2NhbGVzIHRoZW0gc28gdGhhdCB0aGUgeCBzdGFydHMgYXQgMCBhbmQgZW5kcyBhdCAxLlxuX25vcm1hbGl6ZSA9IGZ1bmN0aW9uIF9ub3JtYWxpemUodmFsdWVzLCBoZWlnaHQsIG9yaWdpblkpIHtcbiAgaWYgKCFvcmlnaW5ZICYmIG9yaWdpblkgIT09IDApIHtcbiAgICBvcmlnaW5ZID0gTWF0aC5tYXgoK3ZhbHVlc1t2YWx1ZXMubGVuZ3RoIC0gMV0sICt2YWx1ZXNbMV0pO1xuICB9XG5cbiAgdmFyIHR4ID0gK3ZhbHVlc1swXSAqIC0xLFxuICAgICAgdHkgPSAtb3JpZ2luWSxcbiAgICAgIGwgPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgc3ggPSAxIC8gKCt2YWx1ZXNbbCAtIDJdICsgdHgpLFxuICAgICAgc3kgPSAtaGVpZ2h0IHx8IChNYXRoLmFicygrdmFsdWVzW2wgLSAxXSAtICt2YWx1ZXNbMV0pIDwgMC4wMSAqICgrdmFsdWVzW2wgLSAyXSAtICt2YWx1ZXNbMF0pID8gX2ZpbmRNaW5pbXVtKHZhbHVlcykgKyB0eSA6ICt2YWx1ZXNbbCAtIDFdICsgdHkpLFxuICAgICAgaTtcblxuICBpZiAoc3kpIHtcbiAgICAvL3R5cGljYWxseSB5IGVuZHMgYXQgMSAoc28gdGhhdCB0aGUgZW5kIHZhbHVlcyBhcmUgcmVhY2hlZClcbiAgICBzeSA9IDEgLyBzeTtcbiAgfSBlbHNlIHtcbiAgICAvL2luIGNhc2UgdGhlIGVhc2UgcmV0dXJucyB0byBpdHMgYmVnaW5uaW5nIHZhbHVlLCBzY2FsZSBldmVyeXRoaW5nIHByb3BvcnRpb25hbGx5XG4gICAgc3kgPSAtc3g7XG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAyKSB7XG4gICAgdmFsdWVzW2ldID0gKCt2YWx1ZXNbaV0gKyB0eCkgKiBzeDtcbiAgICB2YWx1ZXNbaSArIDFdID0gKCt2YWx1ZXNbaSArIDFdICsgdHkpICogc3k7XG4gIH1cbn0sXG4gICAgLy9ub3RlIHRoYXQgdGhpcyBmdW5jdGlvbiByZXR1cm5zIHBvaW50IG9iamVjdHMgbGlrZSB7eCwgeX0gcmF0aGVyIHRoYW4gd29ya2luZyB3aXRoIHNlZ21lbnRzIHdoaWNoIGFyZSBhcnJheXMgd2l0aCBhbHRlcm5hdGluZyB4LCB5IHZhbHVlcyBhcyBpbiB0aGUgc2ltaWxhciBmdW5jdGlvbiBpbiBwYXRocy5qc1xuX2JlemllclRvUG9pbnRzID0gZnVuY3Rpb24gX2JlemllclRvUG9pbnRzKHgxLCB5MSwgeDIsIHkyLCB4MywgeTMsIHg0LCB5NCwgdGhyZXNob2xkLCBwb2ludHMsIGluZGV4KSB7XG4gIHZhciB4MTIgPSAoeDEgKyB4MikgLyAyLFxuICAgICAgeTEyID0gKHkxICsgeTIpIC8gMixcbiAgICAgIHgyMyA9ICh4MiArIHgzKSAvIDIsXG4gICAgICB5MjMgPSAoeTIgKyB5MykgLyAyLFxuICAgICAgeDM0ID0gKHgzICsgeDQpIC8gMixcbiAgICAgIHkzNCA9ICh5MyArIHk0KSAvIDIsXG4gICAgICB4MTIzID0gKHgxMiArIHgyMykgLyAyLFxuICAgICAgeTEyMyA9ICh5MTIgKyB5MjMpIC8gMixcbiAgICAgIHgyMzQgPSAoeDIzICsgeDM0KSAvIDIsXG4gICAgICB5MjM0ID0gKHkyMyArIHkzNCkgLyAyLFxuICAgICAgeDEyMzQgPSAoeDEyMyArIHgyMzQpIC8gMixcbiAgICAgIHkxMjM0ID0gKHkxMjMgKyB5MjM0KSAvIDIsXG4gICAgICBkeCA9IHg0IC0geDEsXG4gICAgICBkeSA9IHk0IC0geTEsXG4gICAgICBkMiA9IE1hdGguYWJzKCh4MiAtIHg0KSAqIGR5IC0gKHkyIC0geTQpICogZHgpLFxuICAgICAgZDMgPSBNYXRoLmFicygoeDMgLSB4NCkgKiBkeSAtICh5MyAtIHk0KSAqIGR4KSxcbiAgICAgIGxlbmd0aDtcblxuICBpZiAoIXBvaW50cykge1xuICAgIHBvaW50cyA9IFt7XG4gICAgICB4OiB4MSxcbiAgICAgIHk6IHkxXG4gICAgfSwge1xuICAgICAgeDogeDQsXG4gICAgICB5OiB5NFxuICAgIH1dO1xuICAgIGluZGV4ID0gMTtcbiAgfVxuXG4gIHBvaW50cy5zcGxpY2UoaW5kZXggfHwgcG9pbnRzLmxlbmd0aCAtIDEsIDAsIHtcbiAgICB4OiB4MTIzNCxcbiAgICB5OiB5MTIzNFxuICB9KTtcblxuICBpZiAoKGQyICsgZDMpICogKGQyICsgZDMpID4gdGhyZXNob2xkICogKGR4ICogZHggKyBkeSAqIGR5KSkge1xuICAgIGxlbmd0aCA9IHBvaW50cy5sZW5ndGg7XG5cbiAgICBfYmV6aWVyVG9Qb2ludHMoeDEsIHkxLCB4MTIsIHkxMiwgeDEyMywgeTEyMywgeDEyMzQsIHkxMjM0LCB0aHJlc2hvbGQsIHBvaW50cywgaW5kZXgpO1xuXG4gICAgX2JlemllclRvUG9pbnRzKHgxMjM0LCB5MTIzNCwgeDIzNCwgeTIzNCwgeDM0LCB5MzQsIHg0LCB5NCwgdGhyZXNob2xkLCBwb2ludHMsIGluZGV4ICsgMSArIChwb2ludHMubGVuZ3RoIC0gbGVuZ3RoKSk7XG4gIH1cblxuICByZXR1cm4gcG9pbnRzO1xufTtcblxuZXhwb3J0IHZhciBDdXN0b21FYXNlID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQ3VzdG9tRWFzZShpZCwgZGF0YSwgY29uZmlnKSB7XG4gICAgaWYgKCFfY29yZUluaXR0ZWQpIHtcbiAgICAgIF9pbml0Q29yZSgpO1xuICAgIH1cblxuICAgIHRoaXMuaWQgPSBpZDtcblxuICAgIGlmIChfYm9udXNWYWxpZGF0ZWQpIHtcbiAgICAgIHRoaXMuc2V0RGF0YShkYXRhLCBjb25maWcpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBDdXN0b21FYXNlLnByb3RvdHlwZTtcblxuICBfcHJvdG8uc2V0RGF0YSA9IGZ1bmN0aW9uIHNldERhdGEoZGF0YSwgY29uZmlnKSB7XG4gICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICAgIGRhdGEgPSBkYXRhIHx8IFwiMCwwLDEsMVwiO1xuICAgIHZhciB2YWx1ZXMgPSBkYXRhLm1hdGNoKF9udW1FeHApLFxuICAgICAgICBjbG9zZXN0ID0gMSxcbiAgICAgICAgcG9pbnRzID0gW10sXG4gICAgICAgIGxvb2t1cCA9IFtdLFxuICAgICAgICBwcmVjaXNpb24gPSBjb25maWcucHJlY2lzaW9uIHx8IDEsXG4gICAgICAgIGZhc3QgPSBwcmVjaXNpb24gPD0gMSxcbiAgICAgICAgbCxcbiAgICAgICAgYTEsXG4gICAgICAgIGEyLFxuICAgICAgICBpLFxuICAgICAgICBpbmMsXG4gICAgICAgIGosXG4gICAgICAgIHBvaW50LFxuICAgICAgICBwcmV2UG9pbnQsXG4gICAgICAgIHA7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcblxuICAgIGlmIChfbmVlZHNQYXJzaW5nRXhwLnRlc3QoZGF0YSkgfHwgfmRhdGEuaW5kZXhPZihcIk1cIikgJiYgZGF0YS5pbmRleE9mKFwiQ1wiKSA8IDApIHtcbiAgICAgIHZhbHVlcyA9IHN0cmluZ1RvUmF3UGF0aChkYXRhKVswXTtcbiAgICB9XG5cbiAgICBsID0gdmFsdWVzLmxlbmd0aDtcblxuICAgIGlmIChsID09PSA0KSB7XG4gICAgICB2YWx1ZXMudW5zaGlmdCgwLCAwKTtcbiAgICAgIHZhbHVlcy5wdXNoKDEsIDEpO1xuICAgICAgbCA9IDg7XG4gICAgfSBlbHNlIGlmICgobCAtIDIpICUgNikge1xuICAgICAgdGhyb3cgXCJJbnZhbGlkIEN1c3RvbUVhc2VcIjtcbiAgICB9XG5cbiAgICBpZiAoK3ZhbHVlc1swXSAhPT0gMCB8fCArdmFsdWVzW2wgLSAyXSAhPT0gMSkge1xuICAgICAgX25vcm1hbGl6ZSh2YWx1ZXMsIGNvbmZpZy5oZWlnaHQsIGNvbmZpZy5vcmlnaW5ZKTtcbiAgICB9XG5cbiAgICB0aGlzLnNlZ21lbnQgPSB2YWx1ZXM7XG5cbiAgICBmb3IgKGkgPSAyOyBpIDwgbDsgaSArPSA2KSB7XG4gICAgICBhMSA9IHtcbiAgICAgICAgeDogK3ZhbHVlc1tpIC0gMl0sXG4gICAgICAgIHk6ICt2YWx1ZXNbaSAtIDFdXG4gICAgICB9O1xuICAgICAgYTIgPSB7XG4gICAgICAgIHg6ICt2YWx1ZXNbaSArIDRdLFxuICAgICAgICB5OiArdmFsdWVzW2kgKyA1XVxuICAgICAgfTtcbiAgICAgIHBvaW50cy5wdXNoKGExLCBhMik7XG5cbiAgICAgIF9iZXppZXJUb1BvaW50cyhhMS54LCBhMS55LCArdmFsdWVzW2ldLCArdmFsdWVzW2kgKyAxXSwgK3ZhbHVlc1tpICsgMl0sICt2YWx1ZXNbaSArIDNdLCBhMi54LCBhMi55LCAxIC8gKHByZWNpc2lvbiAqIDIwMDAwMCksIHBvaW50cywgcG9pbnRzLmxlbmd0aCAtIDEpO1xuICAgIH1cblxuICAgIGwgPSBwb2ludHMubGVuZ3RoO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgcG9pbnQgPSBwb2ludHNbaV07XG4gICAgICBwcmV2UG9pbnQgPSBwb2ludHNbaSAtIDFdIHx8IHBvaW50O1xuXG4gICAgICBpZiAocG9pbnQueCA+IHByZXZQb2ludC54IHx8IHByZXZQb2ludC55ICE9PSBwb2ludC55ICYmIHByZXZQb2ludC54ID09PSBwb2ludC54IHx8IHBvaW50ID09PSBwcmV2UG9pbnQpIHtcbiAgICAgICAgLy9pZiBhIHBvaW50IGdvZXMgQkFDS1dBUkQgaW4gdGltZSBvciBpcyBhIGR1cGxpY2F0ZSwganVzdCBkcm9wIGl0LlxuICAgICAgICBwcmV2UG9pbnQuY3ggPSBwb2ludC54IC0gcHJldlBvaW50Lng7IC8vY2hhbmdlIGluIHggYmV0d2VlbiB0aGlzIHBvaW50IGFuZCB0aGUgbmV4dCBwb2ludCAocGVyZm9ybWFuY2Ugb3B0aW1pemF0aW9uKVxuXG4gICAgICAgIHByZXZQb2ludC5jeSA9IHBvaW50LnkgLSBwcmV2UG9pbnQueTtcbiAgICAgICAgcHJldlBvaW50Lm4gPSBwb2ludDtcbiAgICAgICAgcHJldlBvaW50Lm54ID0gcG9pbnQueDsgLy9uZXh0IHBvaW50J3MgeCB2YWx1ZSAocGVyZm9ybWFuY2Ugb3B0aW1pemF0aW9uLCBtYWtpbmcgbG9va3VwcyBmYXN0ZXIgaW4gZ2V0UmF0aW8oKSkuIFJlbWVtYmVyLCB0aGUgbG9va3VwIHdpbGwgYWx3YXlzIGxhbmQgb24gYSBzcG90IHdoZXJlIGl0J3MgZWl0aGVyIHRoaXMgcG9pbnQgb3IgdGhlIHZlcnkgbmV4dCBvbmUgKG5ldmVyIGJleW9uZCB0aGF0KVxuXG4gICAgICAgIGlmIChmYXN0ICYmIGkgPiAxICYmIE1hdGguYWJzKHByZXZQb2ludC5jeSAvIHByZXZQb2ludC5jeCAtIHBvaW50c1tpIC0gMl0uY3kgLyBwb2ludHNbaSAtIDJdLmN4KSA+IDIpIHtcbiAgICAgICAgICAvL2lmIHRoZXJlJ3MgYSBzdWRkZW4gY2hhbmdlIGluIGRpcmVjdGlvbiwgcHJpb3JpdGl6ZSBhY2N1cmFjeSBvdmVyIHNwZWVkLiBMaWtlIGEgYm91bmNlIGVhc2UgLSB5b3UgZG9uJ3Qgd2FudCB0byByaXNrIHRoZSBzYW1wbGluZyBjaHVua3MgbGFuZGluZyBvbiBlYWNoIHNpZGUgb2YgdGhlIGJvdW5jZSBhbmNob3IgYW5kIGhhdmluZyBpdCBjbGlwcGVkIG9mZi5cbiAgICAgICAgICBmYXN0ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcmV2UG9pbnQuY3ggPCBjbG9zZXN0KSB7XG4gICAgICAgICAgaWYgKCFwcmV2UG9pbnQuY3gpIHtcbiAgICAgICAgICAgIHByZXZQb2ludC5jeCA9IDAuMDAxOyAvL2F2b2lkcyBtYXRoIHByb2JsZW1zIGluIGdldFJhdGlvKCkgKGRpdmlkaW5nIGJ5IHplcm8pXG5cbiAgICAgICAgICAgIGlmIChpID09PSBsIC0gMSkge1xuICAgICAgICAgICAgICAvL2luIGNhc2UgdGhlIGZpbmFsIHNlZ21lbnQgZ29lcyB2ZXJ0aWNhbCBSSUdIVCBhdCB0aGUgZW5kLCBtYWtlIHN1cmUgd2UgZW5kIGF0IHRoZSBlbmQuXG4gICAgICAgICAgICAgIHByZXZQb2ludC54IC09IDAuMDAxO1xuICAgICAgICAgICAgICBjbG9zZXN0ID0gTWF0aC5taW4oY2xvc2VzdCwgMC4wMDEpO1xuICAgICAgICAgICAgICBmYXN0ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2xvc2VzdCA9IHByZXZQb2ludC5jeDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBvaW50cy5zcGxpY2UoaS0tLCAxKTtcbiAgICAgICAgbC0tO1xuICAgICAgfVxuICAgIH1cblxuICAgIGwgPSAxIC8gY2xvc2VzdCArIDEgfCAwO1xuICAgIGluYyA9IDEgLyBsO1xuICAgIGogPSAwO1xuICAgIHBvaW50ID0gcG9pbnRzWzBdO1xuXG4gICAgaWYgKGZhc3QpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgLy9mb3IgZmFzdGVzdCBsb29rdXBzLCB3ZSBqdXN0IHNhbXBsZSBhbG9uZyB0aGUgcGF0aCBhdCBlcXVhbCB4ICh0aW1lKSBkaXN0YW5jZS4gVXNlcyBtb3JlIG1lbW9yeSBhbmQgaXMgc2xpZ2h0bHkgbGVzcyBhY2N1cmF0ZSBmb3IgYW5jaG9ycyB0aGF0IGRvbid0IGxhbmQgb24gdGhlIHNhbXBsaW5nIHBvaW50cywgYnV0IGZvciB0aGUgdmFzdCBtYWpvcml0eSBvZiBlYXNlcyBpdCdzIGV4Y2VsbGVudCAoYW5kIGZhc3QpLlxuICAgICAgICBwID0gaSAqIGluYztcblxuICAgICAgICBpZiAocG9pbnQubnggPCBwKSB7XG4gICAgICAgICAgcG9pbnQgPSBwb2ludHNbKytqXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGExID0gcG9pbnQueSArIChwIC0gcG9pbnQueCkgLyBwb2ludC5jeCAqIHBvaW50LmN5O1xuICAgICAgICBsb29rdXBbaV0gPSB7XG4gICAgICAgICAgeDogcCxcbiAgICAgICAgICBjeDogaW5jLFxuICAgICAgICAgIHk6IGExLFxuICAgICAgICAgIGN5OiAwLFxuICAgICAgICAgIG54OiA5XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICBsb29rdXBbaSAtIDFdLmN5ID0gYTEgLSBsb29rdXBbaSAtIDFdLnk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbG9va3VwW2wgLSAxXS5jeSA9IHBvaW50c1twb2ludHMubGVuZ3RoIC0gMV0ueSAtIGExO1xuICAgIH0gZWxzZSB7XG4gICAgICAvL3RoaXMgb3B0aW9uIGlzIG1vcmUgYWNjdXJhdGUsIGVuc3VyaW5nIHRoYXQgRVZFUlkgYW5jaG9yIGlzIGhpdCBwZXJmZWN0bHkuIENsaXBwaW5nIGFjcm9zcyBhIGJvdW5jZSwgZm9yIGV4YW1wbGUsIHdvdWxkIG5ldmVyIGhhcHBlbi5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgLy9idWlsZCBhIGxvb2t1cCB0YWJsZSBiYXNlZCBvbiB0aGUgc21hbGxlc3QgZGlzdGFuY2Ugc28gdGhhdCB3ZSBjYW4gaW5zdGFudGx5IGZpbmQgdGhlIGFwcHJvcHJpYXRlIHBvaW50ICh3ZWxsLCBpdCdsbCBlaXRoZXIgYmUgdGhhdCBwb2ludCBvciB0aGUgdmVyeSBuZXh0IG9uZSkuIFdlJ2xsIGxvb2sgdXAgYmFzZWQgb24gdGhlIGxpbmVhciBwcm9ncmVzcy4gU28gaXQncyBpdCdzIDAuNSBhbmQgdGhlIGxvb2t1cCB0YWJsZSBoYXMgMTAwIGVsZW1lbnRzLCBpdCdkIGJlIGxpa2UgbG9va3VwW01hdGguZmxvb3IoMC41ICogMTAwKV1cbiAgICAgICAgaWYgKHBvaW50Lm54IDwgaSAqIGluYykge1xuICAgICAgICAgIHBvaW50ID0gcG9pbnRzWysral07XG4gICAgICAgIH1cblxuICAgICAgICBsb29rdXBbaV0gPSBwb2ludDtcbiAgICAgIH1cblxuICAgICAgaWYgKGogPCBwb2ludHMubGVuZ3RoIC0gMSkge1xuICAgICAgICBsb29rdXBbaSAtIDFdID0gcG9pbnRzW3BvaW50cy5sZW5ndGggLSAyXTtcbiAgICAgIH1cbiAgICB9IC8vdGhpcy5fY2FsY0VuZCA9IChwb2ludHNbcG9pbnRzLmxlbmd0aC0xXS55ICE9PSAxIHx8IHBvaW50c1swXS55ICE9PSAwKTsgLy9lbnN1cmVzIHRoYXQgd2UgZG9uJ3QgcnVuIGludG8gZmxvYXRpbmcgcG9pbnQgZXJyb3JzLiBBcyBsb25nIGFzIHdlJ3JlIHN0YXJ0aW5nIGF0IDAgYW5kIGVuZGluZyBhdCAxLCB0ZWxsIEdTQVAgdG8gc2tpcCB0aGUgZmluYWwgY2FsY3VsYXRpb24gYW5kIHVzZSAwLzEgYXMgdGhlIGZhY3Rvci5cblxuXG4gICAgdGhpcy5lYXNlID0gZnVuY3Rpb24gKHApIHtcbiAgICAgIHZhciBwb2ludCA9IGxvb2t1cFtwICogbCB8IDBdIHx8IGxvb2t1cFtsIC0gMV07XG5cbiAgICAgIGlmIChwb2ludC5ueCA8IHApIHtcbiAgICAgICAgcG9pbnQgPSBwb2ludC5uO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcG9pbnQueSArIChwIC0gcG9pbnQueCkgLyBwb2ludC5jeCAqIHBvaW50LmN5O1xuICAgIH07XG5cbiAgICB0aGlzLmVhc2UuY3VzdG9tID0gdGhpcztcblxuICAgIGlmICh0aGlzLmlkKSB7XG4gICAgICBnc2FwLnJlZ2lzdGVyRWFzZSh0aGlzLmlkLCB0aGlzLmVhc2UpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIF9wcm90by5nZXRTVkdEYXRhID0gZnVuY3Rpb24gZ2V0U1ZHRGF0YShjb25maWcpIHtcbiAgICByZXR1cm4gQ3VzdG9tRWFzZS5nZXRTVkdEYXRhKHRoaXMsIGNvbmZpZyk7XG4gIH07XG5cbiAgQ3VzdG9tRWFzZS5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaWQsIGRhdGEsIGNvbmZpZykge1xuICAgIHJldHVybiBuZXcgQ3VzdG9tRWFzZShpZCwgZGF0YSwgY29uZmlnKS5lYXNlO1xuICB9O1xuXG4gIEN1c3RvbUVhc2UucmVnaXN0ZXIgPSBmdW5jdGlvbiByZWdpc3Rlcihjb3JlKSB7XG4gICAgZ3NhcCA9IGNvcmU7XG5cbiAgICBfaW5pdENvcmUoKTtcbiAgfTtcblxuICBDdXN0b21FYXNlLmdldCA9IGZ1bmN0aW9uIGdldChpZCkge1xuICAgIHJldHVybiBnc2FwLnBhcnNlRWFzZShpZCk7XG4gIH07XG5cbiAgQ3VzdG9tRWFzZS5nZXRTVkdEYXRhID0gZnVuY3Rpb24gZ2V0U1ZHRGF0YShlYXNlLCBjb25maWcpIHtcbiAgICBjb25maWcgPSBjb25maWcgfHwge307XG4gICAgdmFyIHdpZHRoID0gY29uZmlnLndpZHRoIHx8IDEwMCxcbiAgICAgICAgaGVpZ2h0ID0gY29uZmlnLmhlaWdodCB8fCAxMDAsXG4gICAgICAgIHggPSBjb25maWcueCB8fCAwLFxuICAgICAgICB5ID0gKGNvbmZpZy55IHx8IDApICsgaGVpZ2h0LFxuICAgICAgICBlID0gZ3NhcC51dGlscy50b0FycmF5KGNvbmZpZy5wYXRoKVswXSxcbiAgICAgICAgYSxcbiAgICAgICAgc2xvcGUsXG4gICAgICAgIGksXG4gICAgICAgIGluYyxcbiAgICAgICAgdHgsXG4gICAgICAgIHR5LFxuICAgICAgICBwcmVjaXNpb24sXG4gICAgICAgIHRocmVzaG9sZCxcbiAgICAgICAgcHJldlgsXG4gICAgICAgIHByZXZZO1xuXG4gICAgaWYgKGNvbmZpZy5pbnZlcnQpIHtcbiAgICAgIGhlaWdodCA9IC1oZWlnaHQ7XG4gICAgICB5ID0gMDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGVhc2UgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGVhc2UgPSBnc2FwLnBhcnNlRWFzZShlYXNlKTtcbiAgICB9XG5cbiAgICBpZiAoZWFzZS5jdXN0b20pIHtcbiAgICAgIGVhc2UgPSBlYXNlLmN1c3RvbTtcbiAgICB9XG5cbiAgICBpZiAoZWFzZSBpbnN0YW5jZW9mIEN1c3RvbUVhc2UpIHtcbiAgICAgIGEgPSByYXdQYXRoVG9TdHJpbmcodHJhbnNmb3JtUmF3UGF0aChbZWFzZS5zZWdtZW50XSwgd2lkdGgsIDAsIDAsIC1oZWlnaHQsIHgsIHkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYSA9IFt4LCB5XTtcbiAgICAgIHByZWNpc2lvbiA9IE1hdGgubWF4KDUsIChjb25maWcucHJlY2lzaW9uIHx8IDEpICogMjAwKTtcbiAgICAgIGluYyA9IDEgLyBwcmVjaXNpb247XG4gICAgICBwcmVjaXNpb24gKz0gMjtcbiAgICAgIHRocmVzaG9sZCA9IDUgLyBwcmVjaXNpb247XG4gICAgICBwcmV2WCA9IF9yb3VuZCh4ICsgaW5jICogd2lkdGgpO1xuICAgICAgcHJldlkgPSBfcm91bmQoeSArIGVhc2UoaW5jKSAqIC1oZWlnaHQpO1xuICAgICAgc2xvcGUgPSAocHJldlkgLSB5KSAvIChwcmV2WCAtIHgpO1xuXG4gICAgICBmb3IgKGkgPSAyOyBpIDwgcHJlY2lzaW9uOyBpKyspIHtcbiAgICAgICAgdHggPSBfcm91bmQoeCArIGkgKiBpbmMgKiB3aWR0aCk7XG4gICAgICAgIHR5ID0gX3JvdW5kKHkgKyBlYXNlKGkgKiBpbmMpICogLWhlaWdodCk7XG5cbiAgICAgICAgaWYgKE1hdGguYWJzKCh0eSAtIHByZXZZKSAvICh0eCAtIHByZXZYKSAtIHNsb3BlKSA+IHRocmVzaG9sZCB8fCBpID09PSBwcmVjaXNpb24gLSAxKSB7XG4gICAgICAgICAgLy9vbmx5IGFkZCBwb2ludHMgd2hlbiB0aGUgc2xvcGUgY2hhbmdlcyBiZXlvbmQgdGhlIHRocmVzaG9sZFxuICAgICAgICAgIGEucHVzaChwcmV2WCwgcHJldlkpO1xuICAgICAgICAgIHNsb3BlID0gKHR5IC0gcHJldlkpIC8gKHR4IC0gcHJldlgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldlggPSB0eDtcbiAgICAgICAgcHJldlkgPSB0eTtcbiAgICAgIH1cblxuICAgICAgYSA9IFwiTVwiICsgYS5qb2luKFwiLFwiKTtcbiAgICB9XG5cbiAgICBpZiAoZSkge1xuICAgICAgZS5zZXRBdHRyaWJ1dGUoXCJkXCIsIGEpO1xuICAgIH1cblxuICAgIHJldHVybiBhO1xuICB9O1xuXG4gIHJldHVybiBDdXN0b21FYXNlO1xufSgpO1xuX2dldEdTQVAoKSAmJiBnc2FwLnJlZ2lzdGVyUGx1Z2luKEN1c3RvbUVhc2UpO1xuQ3VzdG9tRWFzZS52ZXJzaW9uID0gXCIzLjMuNFwiO1xuZXhwb3J0IHsgQ3VzdG9tRWFzZSBhcyBkZWZhdWx0IH07IiwiLyohXG4gKiBwYXRocyAzLjMuNFxuICogaHR0cHM6Ly9ncmVlbnNvY2suY29tXG4gKlxuICogQ29weXJpZ2h0IDIwMDgtMjAyMCwgR3JlZW5Tb2NrLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogU3ViamVjdCB0byB0aGUgdGVybXMgYXQgaHR0cHM6Ly9ncmVlbnNvY2suY29tL3N0YW5kYXJkLWxpY2Vuc2Ugb3IgZm9yXG4gKiBDbHViIEdyZWVuU29jayBtZW1iZXJzLCB0aGUgYWdyZWVtZW50IGlzc3VlZCB3aXRoIHRoYXQgbWVtYmVyc2hpcC5cbiAqIEBhdXRob3I6IEphY2sgRG95bGUsIGphY2tAZ3JlZW5zb2NrLmNvbVxuKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cbnZhciBfc3ZnUGF0aEV4cCA9IC9bYWNobG1xc3R2el18KC0/XFxkKlxcLj9cXGQqKD86ZVtcXC0rXT9cXGQrKT8pWzAtOV0vaWcsXG4gICAgX251bWJlcnNFeHAgPSAvKD86KC0pP1xcZCpcXC4/XFxkKig/OmVbXFwtK10/XFxkKyk/KVswLTldL2lnLFxuICAgIF9zY2llbnRpZmljID0gL1tcXCtcXC1dP1xcZCpcXC4/XFxkK2VbXFwrXFwtXT9cXGQrL2lnLFxuICAgIF9zZWxlY3RvckV4cCA9IC8oXlsjXFwuXVthLXpdfFthLXldW2Etel0pL2ksXG4gICAgX0RFRzJSQUQgPSBNYXRoLlBJIC8gMTgwLFxuICAgIF9SQUQyREVHID0gMTgwIC8gTWF0aC5QSSxcbiAgICBfc2luID0gTWF0aC5zaW4sXG4gICAgX2NvcyA9IE1hdGguY29zLFxuICAgIF9hYnMgPSBNYXRoLmFicyxcbiAgICBfc3FydCA9IE1hdGguc3FydCxcbiAgICBfYXRhbjIgPSBNYXRoLmF0YW4yLFxuICAgIF9sYXJnZU51bSA9IDFlOCxcbiAgICBfaXNTdHJpbmcgPSBmdW5jdGlvbiBfaXNTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIjtcbn0sXG4gICAgX2lzTnVtYmVyID0gZnVuY3Rpb24gX2lzTnVtYmVyKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCI7XG59LFxuICAgIF9pc1VuZGVmaW5lZCA9IGZ1bmN0aW9uIF9pc1VuZGVmaW5lZCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcInVuZGVmaW5lZFwiO1xufSxcbiAgICBfdGVtcCA9IHt9LFxuICAgIF90ZW1wMiA9IHt9LFxuICAgIF9yb3VuZGluZ051bSA9IDFlNSxcbiAgICBfd3JhcFByb2dyZXNzID0gZnVuY3Rpb24gX3dyYXBQcm9ncmVzcyhwcm9ncmVzcykge1xuICByZXR1cm4gTWF0aC5yb3VuZCgocHJvZ3Jlc3MgKyBfbGFyZ2VOdW0pICUgMSAqIF9yb3VuZGluZ051bSkgLyBfcm91bmRpbmdOdW0gfHwgKHByb2dyZXNzIDwgMCA/IDAgOiAxKTtcbn0sXG4gICAgLy9pZiBwcm9ncmVzcyBsYW5kcyBvbiAxLCB0aGUgJSB3aWxsIG1ha2UgaXQgMCB3aGljaCBpcyB3aHkgd2UgfHwgMSwgYnV0IG5vdCBpZiBpdCdzIG5lZ2F0aXZlIGJlY2F1c2UgaXQgbWFrZXMgbW9yZSBzZW5zZSBmb3IgbW90aW9uIHRvIGVuZCBhdCAwIGluIHRoYXQgY2FzZS5cbl9yb3VuZCA9IGZ1bmN0aW9uIF9yb3VuZCh2YWx1ZSkge1xuICByZXR1cm4gTWF0aC5yb3VuZCh2YWx1ZSAqIF9yb3VuZGluZ051bSkgLyBfcm91bmRpbmdOdW0gfHwgMDtcbn0sXG4gICAgX3NwbGl0U2VnbWVudCA9IGZ1bmN0aW9uIF9zcGxpdFNlZ21lbnQocmF3UGF0aCwgc2VnSW5kZXgsIGksIHQpIHtcbiAgdmFyIHNlZ21lbnQgPSByYXdQYXRoW3NlZ0luZGV4XSxcbiAgICAgIHNoaWZ0ID0gdCA9PT0gMSA/IDYgOiBzdWJkaXZpZGVTZWdtZW50KHNlZ21lbnQsIGksIHQpO1xuXG4gIGlmIChzaGlmdCAmJiBzaGlmdCArIGkgKyAyIDwgc2VnbWVudC5sZW5ndGgpIHtcbiAgICByYXdQYXRoLnNwbGljZShzZWdJbmRleCwgMCwgc2VnbWVudC5zbGljZSgwLCBpICsgc2hpZnQgKyAyKSk7XG4gICAgc2VnbWVudC5zcGxpY2UoMCwgaSArIHNoaWZ0KTtcbiAgICByZXR1cm4gMTtcbiAgfVxufSxcbiAgICBfcmV2ZXJzZVJhd1BhdGggPSBmdW5jdGlvbiBfcmV2ZXJzZVJhd1BhdGgocmF3UGF0aCwgc2tpcE91dGVyKSB7XG4gIHZhciBpID0gcmF3UGF0aC5sZW5ndGg7XG5cbiAgaWYgKCFza2lwT3V0ZXIpIHtcbiAgICByYXdQYXRoLnJldmVyc2UoKTtcbiAgfVxuXG4gIHdoaWxlIChpLS0pIHtcbiAgICBpZiAoIXJhd1BhdGhbaV0ucmV2ZXJzZWQpIHtcbiAgICAgIHJldmVyc2VTZWdtZW50KHJhd1BhdGhbaV0pO1xuICAgIH1cbiAgfVxufSxcbiAgICBfY29weU1ldGFEYXRhID0gZnVuY3Rpb24gX2NvcHlNZXRhRGF0YShzb3VyY2UsIGNvcHkpIHtcbiAgY29weS50b3RhbExlbmd0aCA9IHNvdXJjZS50b3RhbExlbmd0aDtcblxuICBpZiAoc291cmNlLnNhbXBsZXMpIHtcbiAgICAvL3NlZ21lbnRcbiAgICBjb3B5LnNhbXBsZXMgPSBzb3VyY2Uuc2FtcGxlcy5zbGljZSgwKTtcbiAgICBjb3B5Lmxvb2t1cCA9IHNvdXJjZS5sb29rdXAuc2xpY2UoMCk7XG4gICAgY29weS5taW5MZW5ndGggPSBzb3VyY2UubWluTGVuZ3RoO1xuICAgIGNvcHkucmVzb2x1dGlvbiA9IHNvdXJjZS5yZXNvbHV0aW9uO1xuICB9IGVsc2Uge1xuICAgIC8vcmF3UGF0aFxuICAgIGNvcHkudG90YWxQb2ludHMgPSBzb3VyY2UudG90YWxQb2ludHM7XG4gIH1cblxuICByZXR1cm4gY29weTtcbn0sXG4gICAgLy9wdXNoZXMgYSBuZXcgc2VnbWVudCBpbnRvIGEgcmF3UGF0aCwgYnV0IGlmIGl0cyBzdGFydGluZyB2YWx1ZXMgbWF0Y2ggdGhlIGVuZGluZyB2YWx1ZXMgb2YgdGhlIGxhc3Qgc2VnbWVudCwgaXQnbGwgbWVyZ2UgaXQgaW50byB0aGF0IHNhbWUgc2VnbWVudCAodG8gcmVkdWNlIHRoZSBudW1iZXIgb2Ygc2VnbWVudHMpXG5fYXBwZW5kT3JNZXJnZSA9IGZ1bmN0aW9uIF9hcHBlbmRPck1lcmdlKHJhd1BhdGgsIHNlZ21lbnQpIHtcbiAgdmFyIGluZGV4ID0gcmF3UGF0aC5sZW5ndGgsXG4gICAgICBwcmV2U2VnID0gcmF3UGF0aFtpbmRleCAtIDFdIHx8IFtdLFxuICAgICAgbCA9IHByZXZTZWcubGVuZ3RoO1xuXG4gIGlmIChzZWdtZW50WzBdID09PSBwcmV2U2VnW2wgLSAyXSAmJiBzZWdtZW50WzFdID09PSBwcmV2U2VnW2wgLSAxXSkge1xuICAgIHNlZ21lbnQgPSBwcmV2U2VnLmNvbmNhdChzZWdtZW50LnNsaWNlKDIpKTtcbiAgICBpbmRleC0tO1xuICB9XG5cbiAgcmF3UGF0aFtpbmRleF0gPSBzZWdtZW50O1xufSxcbiAgICBfYmVzdERpc3RhbmNlO1xuLyogVEVSTUlOT0xPR1lcbiAtIFJhd1BhdGggLSBhbiBhcnJheSBvZiBhcnJheXMsIG9uZSBmb3IgZWFjaCBTZWdtZW50LiBBIHNpbmdsZSBSYXdQYXRoIGNvdWxkIGhhdmUgbXVsdGlwbGUgXCJNXCIgY29tbWFuZHMsIGRlZmluaW5nIFNlZ21lbnRzIChwYXRocyBhcmVuJ3QgYWx3YXlzIGNvbm5lY3RlZCkuXG4gLSBTZWdtZW50IC0gYW4gYXJyYXkgY29udGFpbmluZyBhIHNlcXVlbmNlIG9mIEN1YmljIEJlemllciBjb29yZGluYXRlcyBpbiBhbHRlcm5hdGluZyB4LCB5LCB4LCB5IGZvcm1hdC4gU3RhcnRpbmcgYW5jaG9yLCB0aGVuIGNvbnRyb2wgcG9pbnQgMSwgY29udHJvbCBwb2ludCAyLCBhbmQgZW5kaW5nIGFuY2hvciwgdGhlbiB0aGUgbmV4dCBjb250cm9sIHBvaW50IDEsIGNvbnRyb2wgcG9pbnQgMiwgYW5jaG9yLCBldGMuIFVzZXMgbGVzcyBtZW1vcnkgdGhhbiBhbiBhcnJheSB3aXRoIGEgYnVuY2ggb2Yge3gsIHl9IHBvaW50cy5cbiAtIEJlemllciAtIGEgc2luZ2xlIGN1YmljIEJlemllciB3aXRoIGEgc3RhcnRpbmcgYW5jaG9yLCB0d28gY29udHJvbCBwb2ludHMsIGFuZCBhbiBlbmRpbmcgYW5jaG9yLlxuIC0gdGhlIHZhcmlhYmxlIFwidFwiIGlzIHR5cGljYWxseSB0aGUgcG9zaXRpb24gYWxvbmcgYW4gaW5kaXZpZHVhbCBCZXppZXIgcGF0aCAodGltZSkgYW5kIGl0J3MgTk9UIGxpbmVhciwgbWVhbmluZyBpdCBjb3VsZCBhY2NlbGVyYXRlL2RlY2VsZXJhdGUgYmFzZWQgb24gdGhlIGNvbnRyb2wgcG9pbnRzIHdoZXJlYXMgdGhlIFwicFwiIG9yIFwicHJvZ3Jlc3NcIiB2YWx1ZSBpcyBsaW5lYXJseSBtYXBwZWQgdG8gdGhlIHdob2xlIHBhdGgsIHNvIGl0IHNob3VsZG4ndCByZWFsbHkgYWNjZWxlcmF0ZS9kZWNlbGVyYXRlIGJhc2VkIG9uIGNvbnRyb2wgcG9pbnRzLiBTbyBhIHByb2dyZXNzIG9mIDAuMiB3b3VsZCBiZSBhbG1vc3QgZXhhY3RseSAyMCUgYWxvbmcgdGhlIHBhdGguIFwidFwiIGlzIE9OTFkgaW4gYW4gaW5kaXZpZHVhbCBCZXppZXIgcGllY2UuXG4gKi9cbi8vYWNjZXB0cyBiYXNpYyBzZWxlY3RvciB0ZXh0LCBhIHBhdGggaW5zdGFuY2UsIGEgUmF3UGF0aCBpbnN0YW5jZSwgb3IgYSBTZWdtZW50IGFuZCByZXR1cm5zIGEgUmF3UGF0aCAobWFrZXMgaXQgZWFzeSB0byBob21vZ2VuaXplIHRoaW5ncykuIElmIGFuIGVsZW1lbnQgb3Igc2VsZWN0b3IgdGV4dCBpcyBwYXNzZWQgaW4sIGl0J2xsIGFsc28gY2FjaGUgdGhlIHZhbHVlIHNvIHRoYXQgaWYgaXQncyBxdWVyaWVkIGFnYWluLCBpdCdsbCBqdXN0IHRha2UgdGhlIHBhdGggZGF0YSBmcm9tIHRoZXJlIGluc3RlYWQgb2YgcGFyc2luZyBpdCBhbGwgb3ZlciBhZ2FpbiAoYXMgbG9uZyBhcyB0aGUgcGF0aCBkYXRhIGl0c2VsZiBoYXNuJ3QgY2hhbmdlZCAtIGl0J2xsIGNoZWNrKS5cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmF3UGF0aCh2YWx1ZSkge1xuICB2YWx1ZSA9IF9pc1N0cmluZyh2YWx1ZSkgJiYgX3NlbGVjdG9yRXhwLnRlc3QodmFsdWUpID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih2YWx1ZSkgfHwgdmFsdWUgOiB2YWx1ZTtcbiAgdmFyIGUgPSB2YWx1ZS5nZXRBdHRyaWJ1dGUgPyB2YWx1ZSA6IDAsXG4gICAgICByYXdQYXRoO1xuXG4gIGlmIChlICYmICh2YWx1ZSA9IHZhbHVlLmdldEF0dHJpYnV0ZShcImRcIikpKSB7XG4gICAgLy9pbXBsZW1lbnRzIGNhY2hpbmdcbiAgICBpZiAoIWUuX2dzUGF0aCkge1xuICAgICAgZS5fZ3NQYXRoID0ge307XG4gICAgfVxuXG4gICAgcmF3UGF0aCA9IGUuX2dzUGF0aFt2YWx1ZV07XG4gICAgcmV0dXJuIHJhd1BhdGggJiYgIXJhd1BhdGguX2RpcnR5ID8gcmF3UGF0aCA6IGUuX2dzUGF0aFt2YWx1ZV0gPSBzdHJpbmdUb1Jhd1BhdGgodmFsdWUpO1xuICB9XG5cbiAgcmV0dXJuICF2YWx1ZSA/IGNvbnNvbGUud2FybihcIkV4cGVjdGluZyBhIDxwYXRoPiBlbGVtZW50IG9yIGFuIFNWRyBwYXRoIGRhdGEgc3RyaW5nXCIpIDogX2lzU3RyaW5nKHZhbHVlKSA/IHN0cmluZ1RvUmF3UGF0aCh2YWx1ZSkgOiBfaXNOdW1iZXIodmFsdWVbMF0pID8gW3ZhbHVlXSA6IHZhbHVlO1xufSAvL2NvcGllcyBhIFJhd1BhdGggV0lUSE9VVCB0aGUgbGVuZ3RoIG1ldGEgZGF0YSAoZm9yIHNwZWVkKVxuXG5leHBvcnQgZnVuY3Rpb24gY29weVJhd1BhdGgocmF3UGF0aCkge1xuICB2YXIgYSA9IFtdLFxuICAgICAgaSA9IDA7XG5cbiAgZm9yICg7IGkgPCByYXdQYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgYVtpXSA9IF9jb3B5TWV0YURhdGEocmF3UGF0aFtpXSwgcmF3UGF0aFtpXS5zbGljZSgwKSk7XG4gIH1cblxuICByZXR1cm4gX2NvcHlNZXRhRGF0YShyYXdQYXRoLCBhKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZXZlcnNlU2VnbWVudChzZWdtZW50KSB7XG4gIHZhciBpID0gMCxcbiAgICAgIHk7XG4gIHNlZ21lbnQucmV2ZXJzZSgpOyAvL3RoaXMgd2lsbCBpbnZlcnQgdGhlIG9yZGVyIHksIHgsIHksIHggc28gd2UgbXVzdCBmbGlwIGl0IGJhY2suXG5cbiAgZm9yICg7IGkgPCBzZWdtZW50Lmxlbmd0aDsgaSArPSAyKSB7XG4gICAgeSA9IHNlZ21lbnRbaV07XG4gICAgc2VnbWVudFtpXSA9IHNlZ21lbnRbaSArIDFdO1xuICAgIHNlZ21lbnRbaSArIDFdID0geTtcbiAgfVxuXG4gIHNlZ21lbnQucmV2ZXJzZWQgPSAhc2VnbWVudC5yZXZlcnNlZDtcbn1cblxudmFyIF9jcmVhdGVQYXRoID0gZnVuY3Rpb24gX2NyZWF0ZVBhdGgoZSwgaWdub3JlKSB7XG4gIHZhciBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJwYXRoXCIpLFxuICAgICAgYXR0ciA9IFtdLnNsaWNlLmNhbGwoZS5hdHRyaWJ1dGVzKSxcbiAgICAgIGkgPSBhdHRyLmxlbmd0aCxcbiAgICAgIG5hbWU7XG4gIGlnbm9yZSA9IFwiLFwiICsgaWdub3JlICsgXCIsXCI7XG5cbiAgd2hpbGUgKC0taSA+IC0xKSB7XG4gICAgbmFtZSA9IGF0dHJbaV0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKTsgLy9pbiBNaWNyb3NvZnQgRWRnZSwgaWYgeW91IGRvbid0IHNldCB0aGUgYXR0cmlidXRlIHdpdGggYSBsb3dlcmNhc2UgbmFtZSwgaXQgZG9lc24ndCByZW5kZXIgY29ycmVjdGx5ISBTdXBlciB3ZWlyZC5cblxuICAgIGlmIChpZ25vcmUuaW5kZXhPZihcIixcIiArIG5hbWUgKyBcIixcIikgPCAwKSB7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsIG5hbWUsIGF0dHJbaV0ubm9kZVZhbHVlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGF0aDtcbn0sXG4gICAgX3R5cGVBdHRycyA9IHtcbiAgcmVjdDogXCJyeCxyeSx4LHksd2lkdGgsaGVpZ2h0XCIsXG4gIGNpcmNsZTogXCJyLGN4LGN5XCIsXG4gIGVsbGlwc2U6IFwicngscnksY3gsY3lcIixcbiAgbGluZTogXCJ4MSx4Mix5MSx5MlwiXG59LFxuICAgIF9hdHRyVG9PYmogPSBmdW5jdGlvbiBfYXR0clRvT2JqKGUsIGF0dHJzKSB7XG4gIHZhciBwcm9wcyA9IGF0dHJzID8gYXR0cnMuc3BsaXQoXCIsXCIpIDogW10sXG4gICAgICBvYmogPSB7fSxcbiAgICAgIGkgPSBwcm9wcy5sZW5ndGg7XG5cbiAgd2hpbGUgKC0taSA+IC0xKSB7XG4gICAgb2JqW3Byb3BzW2ldXSA9ICtlLmdldEF0dHJpYnV0ZShwcm9wc1tpXSkgfHwgMDtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59OyAvL2NvbnZlcnRzIGFuIFNWRyBzaGFwZSBsaWtlIDxjaXJjbGU+LCA8cmVjdD4sIDxwb2x5Z29uPiwgPHBvbHlsaW5lPiwgPGVsbGlwc2U+LCBldGMuIHRvIGEgPHBhdGg+LCBzd2FwcGluZyBpdCBpbiBhbmQgY29weWluZyB0aGUgYXR0cmlidXRlcyB0byBtYXRjaC5cblxuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFRvUGF0aChlbGVtZW50LCBzd2FwKSB7XG4gIHZhciB0eXBlID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICBjaXJjID0gMC41NTIyODQ3NDk4MzEsXG4gICAgICBkYXRhLFxuICAgICAgeCxcbiAgICAgIHksXG4gICAgICByLFxuICAgICAgcnksXG4gICAgICBwYXRoLFxuICAgICAgcmNpcmMsXG4gICAgICByeWNpcmMsXG4gICAgICBwb2ludHMsXG4gICAgICB3LFxuICAgICAgaCxcbiAgICAgIHgyLFxuICAgICAgeDMsXG4gICAgICB4NCxcbiAgICAgIHg1LFxuICAgICAgeDYsXG4gICAgICB5MixcbiAgICAgIHkzLFxuICAgICAgeTQsXG4gICAgICB5NSxcbiAgICAgIHk2LFxuICAgICAgYXR0cjtcblxuICBpZiAodHlwZSA9PT0gXCJwYXRoXCIgfHwgIWVsZW1lbnQuZ2V0QkJveCkge1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgcGF0aCA9IF9jcmVhdGVQYXRoKGVsZW1lbnQsIFwieCx5LHdpZHRoLGhlaWdodCxjeCxjeSxyeCxyeSxyLHgxLHgyLHkxLHkyLHBvaW50c1wiKTtcbiAgYXR0ciA9IF9hdHRyVG9PYmooZWxlbWVudCwgX3R5cGVBdHRyc1t0eXBlXSk7XG5cbiAgaWYgKHR5cGUgPT09IFwicmVjdFwiKSB7XG4gICAgciA9IGF0dHIucng7XG4gICAgcnkgPSBhdHRyLnJ5IHx8IHI7XG4gICAgeCA9IGF0dHIueDtcbiAgICB5ID0gYXR0ci55O1xuICAgIHcgPSBhdHRyLndpZHRoIC0gciAqIDI7XG4gICAgaCA9IGF0dHIuaGVpZ2h0IC0gcnkgKiAyO1xuXG4gICAgaWYgKHIgfHwgcnkpIHtcbiAgICAgIC8vaWYgdGhlcmUgYXJlIHJvdW5kZWQgY29ybmVycywgcmVuZGVyIGN1YmljIGJlemllcnNcbiAgICAgIHgyID0geCArIHIgKiAoMSAtIGNpcmMpO1xuICAgICAgeDMgPSB4ICsgcjtcbiAgICAgIHg0ID0geDMgKyB3O1xuICAgICAgeDUgPSB4NCArIHIgKiBjaXJjO1xuICAgICAgeDYgPSB4NCArIHI7XG4gICAgICB5MiA9IHkgKyByeSAqICgxIC0gY2lyYyk7XG4gICAgICB5MyA9IHkgKyByeTtcbiAgICAgIHk0ID0geTMgKyBoO1xuICAgICAgeTUgPSB5NCArIHJ5ICogY2lyYztcbiAgICAgIHk2ID0geTQgKyByeTtcbiAgICAgIGRhdGEgPSBcIk1cIiArIHg2ICsgXCIsXCIgKyB5MyArIFwiIFZcIiArIHk0ICsgXCIgQ1wiICsgW3g2LCB5NSwgeDUsIHk2LCB4NCwgeTYsIHg0IC0gKHg0IC0geDMpIC8gMywgeTYsIHgzICsgKHg0IC0geDMpIC8gMywgeTYsIHgzLCB5NiwgeDIsIHk2LCB4LCB5NSwgeCwgeTQsIHgsIHk0IC0gKHk0IC0geTMpIC8gMywgeCwgeTMgKyAoeTQgLSB5MykgLyAzLCB4LCB5MywgeCwgeTIsIHgyLCB5LCB4MywgeSwgeDMgKyAoeDQgLSB4MykgLyAzLCB5LCB4NCAtICh4NCAtIHgzKSAvIDMsIHksIHg0LCB5LCB4NSwgeSwgeDYsIHkyLCB4NiwgeTNdLmpvaW4oXCIsXCIpICsgXCJ6XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSBcIk1cIiArICh4ICsgdykgKyBcIixcIiArIHkgKyBcIiB2XCIgKyBoICsgXCIgaFwiICsgLXcgKyBcIiB2XCIgKyAtaCArIFwiIGhcIiArIHcgKyBcInpcIjtcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJjaXJjbGVcIiB8fCB0eXBlID09PSBcImVsbGlwc2VcIikge1xuICAgIGlmICh0eXBlID09PSBcImNpcmNsZVwiKSB7XG4gICAgICByID0gcnkgPSBhdHRyLnI7XG4gICAgICByeWNpcmMgPSByICogY2lyYztcbiAgICB9IGVsc2Uge1xuICAgICAgciA9IGF0dHIucng7XG4gICAgICByeSA9IGF0dHIucnk7XG4gICAgICByeWNpcmMgPSByeSAqIGNpcmM7XG4gICAgfVxuXG4gICAgeCA9IGF0dHIuY3g7XG4gICAgeSA9IGF0dHIuY3k7XG4gICAgcmNpcmMgPSByICogY2lyYztcbiAgICBkYXRhID0gXCJNXCIgKyAoeCArIHIpICsgXCIsXCIgKyB5ICsgXCIgQ1wiICsgW3ggKyByLCB5ICsgcnljaXJjLCB4ICsgcmNpcmMsIHkgKyByeSwgeCwgeSArIHJ5LCB4IC0gcmNpcmMsIHkgKyByeSwgeCAtIHIsIHkgKyByeWNpcmMsIHggLSByLCB5LCB4IC0gciwgeSAtIHJ5Y2lyYywgeCAtIHJjaXJjLCB5IC0gcnksIHgsIHkgLSByeSwgeCArIHJjaXJjLCB5IC0gcnksIHggKyByLCB5IC0gcnljaXJjLCB4ICsgciwgeV0uam9pbihcIixcIikgKyBcInpcIjtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImxpbmVcIikge1xuICAgIGRhdGEgPSBcIk1cIiArIGF0dHIueDEgKyBcIixcIiArIGF0dHIueTEgKyBcIiBMXCIgKyBhdHRyLngyICsgXCIsXCIgKyBhdHRyLnkyOyAvL3ByZXZpb3VzbHksIHdlIGp1c3QgY29udmVydGVkIHRvIFwiTXgseSBMeCx5XCIgYnV0IFNhZmFyaSBoYXMgYnVncyB0aGF0IGNhdXNlIHRoYXQgbm90IHRvIHJlbmRlciBwcm9wZXJseSB3aGVuIHVzaW5nIGEgc3Ryb2tlLWRhc2hhcnJheSB0aGF0J3Mgbm90IGZ1bGx5IHZpc2libGUhIFVzaW5nIGEgY3ViaWMgYmV6aWVyIGZpeGVzIHRoYXQgaXNzdWUuXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJwb2x5bGluZVwiIHx8IHR5cGUgPT09IFwicG9seWdvblwiKSB7XG4gICAgcG9pbnRzID0gKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwicG9pbnRzXCIpICsgXCJcIikubWF0Y2goX251bWJlcnNFeHApIHx8IFtdO1xuICAgIHggPSBwb2ludHMuc2hpZnQoKTtcbiAgICB5ID0gcG9pbnRzLnNoaWZ0KCk7XG4gICAgZGF0YSA9IFwiTVwiICsgeCArIFwiLFwiICsgeSArIFwiIExcIiArIHBvaW50cy5qb2luKFwiLFwiKTtcblxuICAgIGlmICh0eXBlID09PSBcInBvbHlnb25cIikge1xuICAgICAgZGF0YSArPSBcIixcIiArIHggKyBcIixcIiArIHkgKyBcInpcIjtcbiAgICB9XG4gIH1cblxuICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgcmF3UGF0aFRvU3RyaW5nKHBhdGguX2dzUmF3UGF0aCA9IHN0cmluZ1RvUmF3UGF0aChkYXRhKSkpO1xuXG4gIGlmIChzd2FwICYmIGVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgIGVsZW1lbnQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocGF0aCwgZWxlbWVudCk7XG4gICAgZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICB9XG5cbiAgcmV0dXJuIHBhdGg7XG59IC8vcmV0dXJucyB0aGUgcm90YXRpb24gKGluIGRlZ3JlZXMpIGF0IGEgcGFydGljdWxhciBwcm9ncmVzcyBvbiBhIHJhd1BhdGggKHRoZSBzbG9wZSBvZiB0aGUgdGFuZ2VudClcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJvdGF0aW9uQXRQcm9ncmVzcyhyYXdQYXRoLCBwcm9ncmVzcykge1xuICB2YXIgZCA9IGdldFByb2dyZXNzRGF0YShyYXdQYXRoLCBwcm9ncmVzcyA+PSAxID8gMSAtIDFlLTkgOiBwcm9ncmVzcyA/IHByb2dyZXNzIDogMWUtOSk7XG4gIHJldHVybiBnZXRSb3RhdGlvbkF0QmV6aWVyVChkLnNlZ21lbnQsIGQuaSwgZC50KTtcbn1cblxuZnVuY3Rpb24gZ2V0Um90YXRpb25BdEJlemllclQoc2VnbWVudCwgaSwgdCkge1xuICB2YXIgYSA9IHNlZ21lbnRbaV0sXG4gICAgICBiID0gc2VnbWVudFtpICsgMl0sXG4gICAgICBjID0gc2VnbWVudFtpICsgNF0sXG4gICAgICB4O1xuICBhICs9IChiIC0gYSkgKiB0O1xuICBiICs9IChjIC0gYikgKiB0O1xuICBhICs9IChiIC0gYSkgKiB0O1xuICB4ID0gYiArIChjICsgKHNlZ21lbnRbaSArIDZdIC0gYykgKiB0IC0gYikgKiB0IC0gYTtcbiAgYSA9IHNlZ21lbnRbaSArIDFdO1xuICBiID0gc2VnbWVudFtpICsgM107XG4gIGMgPSBzZWdtZW50W2kgKyA1XTtcbiAgYSArPSAoYiAtIGEpICogdDtcbiAgYiArPSAoYyAtIGIpICogdDtcbiAgYSArPSAoYiAtIGEpICogdDtcbiAgcmV0dXJuIF9yb3VuZChfYXRhbjIoYiArIChjICsgKHNlZ21lbnRbaSArIDddIC0gYykgKiB0IC0gYikgKiB0IC0gYSwgeCkgKiBfUkFEMkRFRyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzbGljZVJhd1BhdGgocmF3UGF0aCwgc3RhcnQsIGVuZCkge1xuICBpZiAoX2lzVW5kZWZpbmVkKGVuZCkpIHtcbiAgICBlbmQgPSAxO1xuICB9XG5cbiAgc3RhcnQgPSBzdGFydCB8fCAwO1xuICB2YXIgcmV2ZXJzZSA9IHN0YXJ0ID4gZW5kLFxuICAgICAgbG9vcHMgPSBNYXRoLm1heCgwLCB+fihfYWJzKGVuZCAtIHN0YXJ0KSAtIDFlLTgpKTtcblxuICBpZiAocmV2ZXJzZSkge1xuICAgIHJldmVyc2UgPSBlbmQ7XG4gICAgZW5kID0gc3RhcnQ7XG4gICAgc3RhcnQgPSByZXZlcnNlO1xuICAgIHJldmVyc2UgPSAxO1xuICAgIGxvb3BzIC09IGxvb3BzID8gMSA6IDA7XG4gIH1cblxuICBpZiAoc3RhcnQgPCAwIHx8IGVuZCA8IDApIHtcbiAgICB2YXIgb2Zmc2V0ID0gfn5NYXRoLm1pbihzdGFydCwgZW5kKSArIDE7XG4gICAgc3RhcnQgKz0gb2Zmc2V0O1xuICAgIGVuZCArPSBvZmZzZXQ7XG4gIH1cblxuICB2YXIgcGF0aCA9IGNvcHlSYXdQYXRoKHJhd1BhdGgudG90YWxMZW5ndGggPyByYXdQYXRoIDogY2FjaGVSYXdQYXRoTWVhc3VyZW1lbnRzKHJhd1BhdGgpKSxcbiAgICAgIHdyYXAgPSBlbmQgPiAxLFxuICAgICAgcyA9IGdldFByb2dyZXNzRGF0YShwYXRoLCBzdGFydCwgX3RlbXAsIHRydWUpLFxuICAgICAgZSA9IGdldFByb2dyZXNzRGF0YShwYXRoLCBlbmQsIF90ZW1wMiksXG4gICAgICBlU2VnID0gZS5zZWdtZW50LFxuICAgICAgc1NlZyA9IHMuc2VnbWVudCxcbiAgICAgIGVTZWdJbmRleCA9IGUuc2VnSW5kZXgsXG4gICAgICBzU2VnSW5kZXggPSBzLnNlZ0luZGV4LFxuICAgICAgZWkgPSBlLmksXG4gICAgICBzaSA9IHMuaSxcbiAgICAgIHNhbWVTZWdtZW50ID0gc1NlZ0luZGV4ID09PSBlU2VnSW5kZXgsXG4gICAgICBzYW1lQmV6aWVyID0gZWkgPT09IHNpICYmIHNhbWVTZWdtZW50LFxuICAgICAgaW52ZXJ0ZWRPcmRlciA9IHNhbWVTZWdtZW50ICYmIHNpID4gZWkgfHwgc2FtZUJlemllciAmJiBzLnQgPiBlLnQsXG4gICAgICBzU2hpZnQsXG4gICAgICBlU2hpZnQsXG4gICAgICBpLFxuICAgICAgY29weSxcbiAgICAgIHRvdGFsU2VnbWVudHMsXG4gICAgICBsLFxuICAgICAgajtcblxuICBpZiAod3JhcCB8fCBsb29wcykge1xuICAgIGlmIChfc3BsaXRTZWdtZW50KHBhdGgsIHNTZWdJbmRleCwgc2ksIHMudCkpIHtcbiAgICAgIHNTaGlmdCA9IDE7XG4gICAgICBzU2VnSW5kZXgrKztcblxuICAgICAgaWYgKHNhbWVCZXppZXIpIHtcbiAgICAgICAgaWYgKGludmVydGVkT3JkZXIpIHtcbiAgICAgICAgICBlLnQgLz0gcy50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGUudCA9IChlLnQgLSBzLnQpIC8gKDEgLSBzLnQpO1xuICAgICAgICAgIGVTZWdJbmRleCsrO1xuICAgICAgICAgIGVpID0gMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzU2VnSW5kZXggPD0gZVNlZ0luZGV4ICsgMSAmJiAhaW52ZXJ0ZWRPcmRlcikge1xuICAgICAgICBlU2VnSW5kZXgrKztcblxuICAgICAgICBpZiAoc2FtZVNlZ21lbnQpIHtcbiAgICAgICAgICBlaSAtPSBzaTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZS50KSB7XG4gICAgICBlU2VnSW5kZXgtLTtcblxuICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgc1NlZ0luZGV4LS07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfc3BsaXRTZWdtZW50KHBhdGgsIGVTZWdJbmRleCwgZWksIGUudCkpIHtcbiAgICAgIGlmIChpbnZlcnRlZE9yZGVyICYmIHNTaGlmdCkge1xuICAgICAgICBzU2VnSW5kZXgrKztcbiAgICAgIH1cblxuICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgZVNlZ0luZGV4Kys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29weSA9IFtdO1xuICAgIHRvdGFsU2VnbWVudHMgPSBwYXRoLmxlbmd0aDtcbiAgICBsID0gMSArIHRvdGFsU2VnbWVudHMgKiBsb29wcztcbiAgICBqID0gc1NlZ0luZGV4O1xuXG4gICAgaWYgKHJldmVyc2UpIHtcbiAgICAgIGVTZWdJbmRleCA9IChlU2VnSW5kZXggfHwgdG90YWxTZWdtZW50cykgLSAxO1xuICAgICAgbCArPSAodG90YWxTZWdtZW50cyAtIGVTZWdJbmRleCArIHNTZWdJbmRleCkgJSB0b3RhbFNlZ21lbnRzO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIF9hcHBlbmRPck1lcmdlKGNvcHksIHBhdGhbal0pO1xuXG4gICAgICAgIGogPSAoaiB8fCB0b3RhbFNlZ21lbnRzKSAtIDE7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGwgKz0gKHRvdGFsU2VnbWVudHMgLSBzU2VnSW5kZXggKyBlU2VnSW5kZXgpICUgdG90YWxTZWdtZW50cztcblxuICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICBfYXBwZW5kT3JNZXJnZShjb3B5LCBwYXRoW2orKyAlIHRvdGFsU2VnbWVudHNdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXRoID0gY29weTtcbiAgfSBlbHNlIHtcbiAgICBlU2hpZnQgPSBlLnQgPT09IDEgPyA2IDogc3ViZGl2aWRlU2VnbWVudChlU2VnLCBlaSwgZS50KTtcblxuICAgIGlmIChzdGFydCAhPT0gZW5kKSB7XG4gICAgICBzU2hpZnQgPSBzdWJkaXZpZGVTZWdtZW50KHNTZWcsIHNpLCBzYW1lQmV6aWVyID8gcy50IC8gZS50IDogcy50KTtcblxuICAgICAgaWYgKHNhbWVTZWdtZW50KSB7XG4gICAgICAgIGVTaGlmdCArPSBzU2hpZnQ7XG4gICAgICB9XG5cbiAgICAgIGVTZWcuc3BsaWNlKGVpICsgZVNoaWZ0ICsgMik7XG5cbiAgICAgIGlmIChzU2hpZnQgfHwgc2kpIHtcbiAgICAgICAgc1NlZy5zcGxpY2UoMCwgc2kgKyBzU2hpZnQpO1xuICAgICAgfVxuXG4gICAgICBpID0gcGF0aC5sZW5ndGg7XG5cbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgLy9jaG9wIG9mZiBhbnkgZXh0cmEgc2VnbWVudHNcbiAgICAgICAgaWYgKGkgPCBzU2VnSW5kZXggfHwgaSA+IGVTZWdJbmRleCkge1xuICAgICAgICAgIHBhdGguc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVTZWcuYW5nbGUgPSBnZXRSb3RhdGlvbkF0QmV6aWVyVChlU2VnLCBlaSArIGVTaGlmdCwgMCk7IC8vcmVjb3JkIHRoZSB2YWx1ZSBiZWZvcmUgd2UgY2hvcCBiZWNhdXNlIGl0J2xsIGJlIGltcG9zc2libGUgdG8gZGV0ZXJtaW5lIHRoZSBhbmdsZSBhZnRlciBpdHMgbGVuZ3RoIGlzIDAhXG5cbiAgICAgIGVpICs9IGVTaGlmdDtcbiAgICAgIHMgPSBlU2VnW2VpXTtcbiAgICAgIGUgPSBlU2VnW2VpICsgMV07XG4gICAgICBlU2VnLmxlbmd0aCA9IGVTZWcudG90YWxMZW5ndGggPSAwO1xuICAgICAgZVNlZy50b3RhbFBvaW50cyA9IHBhdGgudG90YWxQb2ludHMgPSA4O1xuICAgICAgZVNlZy5wdXNoKHMsIGUsIHMsIGUsIHMsIGUsIHMsIGUpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChyZXZlcnNlKSB7XG4gICAgX3JldmVyc2VSYXdQYXRoKHBhdGgsIHdyYXAgfHwgbG9vcHMpO1xuICB9XG5cbiAgcGF0aC50b3RhbExlbmd0aCA9IDA7XG4gIHJldHVybiBwYXRoO1xufSAvL21lYXN1cmVzIGEgU2VnbWVudCBhY2NvcmRpbmcgdG8gaXRzIHJlc29sdXRpb24gKHNvIGlmIHNlZ21lbnQucmVzb2x1dGlvbiBpcyA2LCBmb3IgZXhhbXBsZSwgaXQnbGwgdGFrZSA2IHNhbXBsZXMgZXF1YWxseSBhY3Jvc3MgZWFjaCBCZXppZXIpIGFuZCBjcmVhdGUvcG9wdWxhdGUgYSBcInNhbXBsZXNcIiBhcnJheSB0aGF0IGhhcyB0aGUgbGVuZ3RoIHVwIHRvIGVhY2ggb2YgdGhvc2Ugc2FtcGxlIHBvaW50cyAoYWx3YXlzIGluY3JlYXNpbmcgZnJvbSB0aGUgc3RhcnQpIGFzIHdlbGwgYXMgYSBcImxvb2t1cFwiIGFycmF5IHRoYXQncyBicm9rZW4gdXAgYWNjb3JkaW5nIHRvIHRoZSBzbWFsbGVzdCBkaXN0YW5jZSBiZXR3ZWVuIDIgc2FtcGxlcy4gVGhpcyBnaXZlcyB1cyBhIHZlcnkgZmFzdCB3YXkgb2YgbG9va2luZyB1cCBhIHByb2dyZXNzIHBvc2l0aW9uIHJhdGhlciB0aGFuIGxvb3BpbmcgdGhyb3VnaCBhbGwgdGhlIHBvaW50cy9CZXppZXJzLiBZb3UgY2FuIG9wdGlvbmFsbHkgaGF2ZSBpdCBvbmx5IG1lYXN1cmUgYSBzdWJzZXQsIHN0YXJ0aW5nIGF0IHN0YXJ0SW5kZXggYW5kIGdvaW5nIGZvciBhIHNwZWNpZmljIG51bWJlciBvZiBiZXppZXJzIChyZW1lbWJlciwgdGhlcmUgYXJlIDMgeC95IHBhaXJzIGVhY2gsIGZvciBhIHRvdGFsIG9mIDYgZWxlbWVudHMgZm9yIGVhY2ggQmV6aWVyKS4gSXQgd2lsbCBhbHNvIHBvcHVsYXRlIGEgXCJ0b3RhbExlbmd0aFwiIHByb3BlcnR5LCBidXQgdGhhdCdzIG5vdCBnZW5lcmFsbHkgc3VwZXIgYWNjdXJhdGUgYmVjYXVzZSBieSBkZWZhdWx0IGl0J2xsIG9ubHkgdGFrZSA2IHNhbXBsZXMgcGVyIEJlemllci4gQnV0IGZvciBwZXJmb3JtYW5jZSByZWFzb25zLCBpdCdzIHBlcmZlY3RseSBhZGVxdWF0ZSBmb3IgbWVhc3VyaW5nIHByb2dyZXNzIHZhbHVlcyBhbG9uZyB0aGUgcGF0aC4gSWYgeW91IG5lZWQgYSBtb3JlIGFjY3VyYXRlIHRvdGFsTGVuZ3RoLCBlaXRoZXIgaW5jcmVhc2UgdGhlIHJlc29sdXRpb24gb3IgdXNlIHRoZSBtb3JlIGFkdmFuY2VkIGJlemllclRvUG9pbnRzKCkgbWV0aG9kIHdoaWNoIGtlZXBzIGFkZGluZyBwb2ludHMgdW50aWwgdGhleSBkb24ndCBkZXZpYXRlIGJ5IG1vcmUgdGhhbiBhIGNlcnRhaW4gcHJlY2lzaW9uIHZhbHVlLlxuXG5mdW5jdGlvbiBtZWFzdXJlU2VnbWVudChzZWdtZW50LCBzdGFydEluZGV4LCBiZXppZXJRdHkpIHtcbiAgc3RhcnRJbmRleCA9IHN0YXJ0SW5kZXggfHwgMDtcblxuICBpZiAoIXNlZ21lbnQuc2FtcGxlcykge1xuICAgIHNlZ21lbnQuc2FtcGxlcyA9IFtdO1xuICAgIHNlZ21lbnQubG9va3VwID0gW107XG4gIH1cblxuICB2YXIgcmVzb2x1dGlvbiA9IH5+c2VnbWVudC5yZXNvbHV0aW9uIHx8IDEyLFxuICAgICAgaW5jID0gMSAvIHJlc29sdXRpb24sXG4gICAgICBlbmRJbmRleCA9IGJlemllclF0eSA/IHN0YXJ0SW5kZXggKyBiZXppZXJRdHkgKiA2ICsgMSA6IHNlZ21lbnQubGVuZ3RoLFxuICAgICAgeDEgPSBzZWdtZW50W3N0YXJ0SW5kZXhdLFxuICAgICAgeTEgPSBzZWdtZW50W3N0YXJ0SW5kZXggKyAxXSxcbiAgICAgIHNhbXBsZXNJbmRleCA9IHN0YXJ0SW5kZXggPyBzdGFydEluZGV4IC8gNiAqIHJlc29sdXRpb24gOiAwLFxuICAgICAgc2FtcGxlcyA9IHNlZ21lbnQuc2FtcGxlcyxcbiAgICAgIGxvb2t1cCA9IHNlZ21lbnQubG9va3VwLFxuICAgICAgbWluID0gKHN0YXJ0SW5kZXggPyBzZWdtZW50Lm1pbkxlbmd0aCA6IF9sYXJnZU51bSkgfHwgX2xhcmdlTnVtLFxuICAgICAgcHJldkxlbmd0aCA9IHNhbXBsZXNbc2FtcGxlc0luZGV4ICsgYmV6aWVyUXR5ICogcmVzb2x1dGlvbiAtIDFdLFxuICAgICAgbGVuZ3RoID0gc3RhcnRJbmRleCA/IHNhbXBsZXNbc2FtcGxlc0luZGV4IC0gMV0gOiAwLFxuICAgICAgaSxcbiAgICAgIGosXG4gICAgICB4NCxcbiAgICAgIHgzLFxuICAgICAgeDIsXG4gICAgICB4ZCxcbiAgICAgIHhkMSxcbiAgICAgIHk0LFxuICAgICAgeTMsXG4gICAgICB5MixcbiAgICAgIHlkLFxuICAgICAgeWQxLFxuICAgICAgaW52LFxuICAgICAgdCxcbiAgICAgIGxlbmd0aEluZGV4LFxuICAgICAgbCxcbiAgICAgIHNlZ0xlbmd0aDtcbiAgc2FtcGxlcy5sZW5ndGggPSBsb29rdXAubGVuZ3RoID0gMDtcblxuICBmb3IgKGogPSBzdGFydEluZGV4ICsgMjsgaiA8IGVuZEluZGV4OyBqICs9IDYpIHtcbiAgICB4NCA9IHNlZ21lbnRbaiArIDRdIC0geDE7XG4gICAgeDMgPSBzZWdtZW50W2ogKyAyXSAtIHgxO1xuICAgIHgyID0gc2VnbWVudFtqXSAtIHgxO1xuICAgIHk0ID0gc2VnbWVudFtqICsgNV0gLSB5MTtcbiAgICB5MyA9IHNlZ21lbnRbaiArIDNdIC0geTE7XG4gICAgeTIgPSBzZWdtZW50W2ogKyAxXSAtIHkxO1xuICAgIHhkID0geGQxID0geWQgPSB5ZDEgPSAwO1xuXG4gICAgaWYgKF9hYnMoeDQpIDwgMWUtNSAmJiBfYWJzKHk0KSA8IDFlLTUgJiYgX2Ficyh4MikgKyBfYWJzKHkyKSA8IDFlLTUpIHtcbiAgICAgIC8vZHVtcCBwb2ludHMgdGhhdCBhcmUgc3VmZmljaWVudGx5IGNsb3NlIChiYXNpY2FsbHkgcmlnaHQgb24gdG9wIG9mIGVhY2ggb3RoZXIsIG1ha2luZyBhIGJlemllciBzdXBlciB0aW55IG9yIDAgbGVuZ3RoKVxuICAgICAgaWYgKHNlZ21lbnQubGVuZ3RoID4gOCkge1xuICAgICAgICBzZWdtZW50LnNwbGljZShqLCA2KTtcbiAgICAgICAgaiAtPSA2O1xuICAgICAgICBlbmRJbmRleCAtPSA2O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGkgPSAxOyBpIDw9IHJlc29sdXRpb247IGkrKykge1xuICAgICAgICB0ID0gaW5jICogaTtcbiAgICAgICAgaW52ID0gMSAtIHQ7XG4gICAgICAgIHhkID0geGQxIC0gKHhkMSA9ICh0ICogdCAqIHg0ICsgMyAqIGludiAqICh0ICogeDMgKyBpbnYgKiB4MikpICogdCk7XG4gICAgICAgIHlkID0geWQxIC0gKHlkMSA9ICh0ICogdCAqIHk0ICsgMyAqIGludiAqICh0ICogeTMgKyBpbnYgKiB5MikpICogdCk7XG4gICAgICAgIGwgPSBfc3FydCh5ZCAqIHlkICsgeGQgKiB4ZCk7XG5cbiAgICAgICAgaWYgKGwgPCBtaW4pIHtcbiAgICAgICAgICBtaW4gPSBsO1xuICAgICAgICB9XG5cbiAgICAgICAgbGVuZ3RoICs9IGw7XG4gICAgICAgIHNhbXBsZXNbc2FtcGxlc0luZGV4KytdID0gbGVuZ3RoO1xuICAgICAgfVxuICAgIH1cblxuICAgIHgxICs9IHg0O1xuICAgIHkxICs9IHk0O1xuICB9XG5cbiAgaWYgKHByZXZMZW5ndGgpIHtcbiAgICBwcmV2TGVuZ3RoIC09IGxlbmd0aDtcblxuICAgIGZvciAoOyBzYW1wbGVzSW5kZXggPCBzYW1wbGVzLmxlbmd0aDsgc2FtcGxlc0luZGV4KyspIHtcbiAgICAgIHNhbXBsZXNbc2FtcGxlc0luZGV4XSArPSBwcmV2TGVuZ3RoO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzYW1wbGVzLmxlbmd0aCAmJiBtaW4pIHtcbiAgICBzZWdtZW50LnRvdGFsTGVuZ3RoID0gc2VnTGVuZ3RoID0gc2FtcGxlc1tzYW1wbGVzLmxlbmd0aCAtIDFdIHx8IDA7XG4gICAgc2VnbWVudC5taW5MZW5ndGggPSBtaW47XG4gICAgbCA9IGxlbmd0aEluZGV4ID0gMDtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBzZWdMZW5ndGg7IGkgKz0gbWluKSB7XG4gICAgICBsb29rdXBbbCsrXSA9IHNhbXBsZXNbbGVuZ3RoSW5kZXhdIDwgaSA/ICsrbGVuZ3RoSW5kZXggOiBsZW5ndGhJbmRleDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc2VnbWVudC50b3RhbExlbmd0aCA9IHNhbXBsZXNbMF0gPSAwO1xuICB9XG5cbiAgcmV0dXJuIHN0YXJ0SW5kZXggPyBsZW5ndGggLSBzYW1wbGVzW3N0YXJ0SW5kZXggLyAyIC0gMV0gOiBsZW5ndGg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYWNoZVJhd1BhdGhNZWFzdXJlbWVudHMocmF3UGF0aCwgcmVzb2x1dGlvbikge1xuICB2YXIgcGF0aExlbmd0aCwgcG9pbnRzLCBpO1xuXG4gIGZvciAoaSA9IHBhdGhMZW5ndGggPSBwb2ludHMgPSAwOyBpIDwgcmF3UGF0aC5sZW5ndGg7IGkrKykge1xuICAgIHJhd1BhdGhbaV0ucmVzb2x1dGlvbiA9IH5+cmVzb2x1dGlvbiB8fCAxMjsgLy9zdGVwcyBwZXIgQmV6aWVyIGN1cnZlIChhbmNob3IsIDIgY29udHJvbCBwb2ludHMsIHRvIGFuY2hvcilcblxuICAgIHBvaW50cyArPSByYXdQYXRoW2ldLmxlbmd0aDtcbiAgICBwYXRoTGVuZ3RoICs9IG1lYXN1cmVTZWdtZW50KHJhd1BhdGhbaV0pO1xuICB9XG5cbiAgcmF3UGF0aC50b3RhbFBvaW50cyA9IHBvaW50cztcbiAgcmF3UGF0aC50b3RhbExlbmd0aCA9IHBhdGhMZW5ndGg7XG4gIHJldHVybiByYXdQYXRoO1xufSAvL2RpdmlkZSBzZWdtZW50W2ldIGF0IHBvc2l0aW9uIHQgKHZhbHVlIGJldHdlZW4gMCBhbmQgMSwgcHJvZ3Jlc3MgYWxvbmcgdGhhdCBwYXJ0aWN1bGFyIGN1YmljIGJlemllciBzZWdtZW50IHRoYXQgc3RhcnRzIGF0IHNlZ21lbnRbaV0pLiBSZXR1cm5zIGhvdyBtYW55IGVsZW1lbnRzIHdlcmUgc3BsaWNlZCBpbnRvIHRoZSBzZWdtZW50IGFycmF5IChlaXRoZXIgMCBvciA2KVxuXG5leHBvcnQgZnVuY3Rpb24gc3ViZGl2aWRlU2VnbWVudChzZWdtZW50LCBpLCB0KSB7XG4gIGlmICh0IDw9IDAgfHwgdCA+PSAxKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICB2YXIgYXggPSBzZWdtZW50W2ldLFxuICAgICAgYXkgPSBzZWdtZW50W2kgKyAxXSxcbiAgICAgIGNwMXggPSBzZWdtZW50W2kgKyAyXSxcbiAgICAgIGNwMXkgPSBzZWdtZW50W2kgKyAzXSxcbiAgICAgIGNwMnggPSBzZWdtZW50W2kgKyA0XSxcbiAgICAgIGNwMnkgPSBzZWdtZW50W2kgKyA1XSxcbiAgICAgIGJ4ID0gc2VnbWVudFtpICsgNl0sXG4gICAgICBieSA9IHNlZ21lbnRbaSArIDddLFxuICAgICAgeDFhID0gYXggKyAoY3AxeCAtIGF4KSAqIHQsXG4gICAgICB4MiA9IGNwMXggKyAoY3AyeCAtIGNwMXgpICogdCxcbiAgICAgIHkxYSA9IGF5ICsgKGNwMXkgLSBheSkgKiB0LFxuICAgICAgeTIgPSBjcDF5ICsgKGNwMnkgLSBjcDF5KSAqIHQsXG4gICAgICB4MSA9IHgxYSArICh4MiAtIHgxYSkgKiB0LFxuICAgICAgeTEgPSB5MWEgKyAoeTIgLSB5MWEpICogdCxcbiAgICAgIHgyYSA9IGNwMnggKyAoYnggLSBjcDJ4KSAqIHQsXG4gICAgICB5MmEgPSBjcDJ5ICsgKGJ5IC0gY3AyeSkgKiB0O1xuICB4MiArPSAoeDJhIC0geDIpICogdDtcbiAgeTIgKz0gKHkyYSAtIHkyKSAqIHQ7XG4gIHNlZ21lbnQuc3BsaWNlKGkgKyAyLCA0LCBfcm91bmQoeDFhKSwgLy9maXJzdCBjb250cm9sIHBvaW50XG4gIF9yb3VuZCh5MWEpLCBfcm91bmQoeDEpLCAvL3NlY29uZCBjb250cm9sIHBvaW50XG4gIF9yb3VuZCh5MSksIF9yb3VuZCh4MSArICh4MiAtIHgxKSAqIHQpLCAvL25ldyBmYWJyaWNhdGVkIGFuY2hvciBvbiBsaW5lXG4gIF9yb3VuZCh5MSArICh5MiAtIHkxKSAqIHQpLCBfcm91bmQoeDIpLCAvL3RoaXJkIGNvbnRyb2wgcG9pbnRcbiAgX3JvdW5kKHkyKSwgX3JvdW5kKHgyYSksIC8vZm91cnRoIGNvbnRyb2wgcG9pbnRcbiAgX3JvdW5kKHkyYSkpO1xuICBzZWdtZW50LnNhbXBsZXMgJiYgc2VnbWVudC5zYW1wbGVzLnNwbGljZShpIC8gNiAqIHNlZ21lbnQucmVzb2x1dGlvbiB8IDAsIDAsIDAsIDAsIDAsIDAsIDAsIDApO1xuICByZXR1cm4gNjtcbn0gLy8gcmV0dXJucyBhbiBvYmplY3Qge3BhdGgsIHNlZ21lbnQsIHNlZ0luZGV4LCBpLCB0fVxuXG5mdW5jdGlvbiBnZXRQcm9ncmVzc0RhdGEocmF3UGF0aCwgcHJvZ3Jlc3MsIGRlY29yYXRlZSwgcHVzaFRvTmV4dElmQXRFbmQpIHtcbiAgZGVjb3JhdGVlID0gZGVjb3JhdGVlIHx8IHt9O1xuICByYXdQYXRoLnRvdGFsTGVuZ3RoIHx8IGNhY2hlUmF3UGF0aE1lYXN1cmVtZW50cyhyYXdQYXRoKTtcblxuICBpZiAocHJvZ3Jlc3MgPCAwIHx8IHByb2dyZXNzID4gMSkge1xuICAgIHByb2dyZXNzID0gX3dyYXBQcm9ncmVzcyhwcm9ncmVzcyk7XG4gIH1cblxuICB2YXIgc2VnSW5kZXggPSAwLFxuICAgICAgc2VnbWVudCA9IHJhd1BhdGhbMF0sXG4gICAgICBzYW1wbGVzLFxuICAgICAgcmVzb2x1dGlvbixcbiAgICAgIGxlbmd0aCxcbiAgICAgIG1pbixcbiAgICAgIG1heCxcbiAgICAgIGksXG4gICAgICB0O1xuXG4gIGlmIChyYXdQYXRoLmxlbmd0aCA+IDEpIHtcbiAgICAvL3NwZWVkIG9wdGltaXphdGlvbjogbW9zdCBvZiB0aGUgdGltZSwgdGhlcmUncyBvbmx5IG9uZSBzZWdtZW50IHNvIHNraXAgdGhlIHJlY3Vyc2lvbi5cbiAgICBsZW5ndGggPSByYXdQYXRoLnRvdGFsTGVuZ3RoICogcHJvZ3Jlc3M7XG4gICAgbWF4ID0gaSA9IDA7XG5cbiAgICB3aGlsZSAoKG1heCArPSByYXdQYXRoW2krK10udG90YWxMZW5ndGgpIDwgbGVuZ3RoKSB7XG4gICAgICBzZWdJbmRleCA9IGk7XG4gICAgfVxuXG4gICAgc2VnbWVudCA9IHJhd1BhdGhbc2VnSW5kZXhdO1xuICAgIG1pbiA9IG1heCAtIHNlZ21lbnQudG90YWxMZW5ndGg7XG4gICAgcHJvZ3Jlc3MgPSAobGVuZ3RoIC0gbWluKSAvIChtYXggLSBtaW4pIHx8IDA7XG4gIH1cblxuICBzYW1wbGVzID0gc2VnbWVudC5zYW1wbGVzO1xuICByZXNvbHV0aW9uID0gc2VnbWVudC5yZXNvbHV0aW9uOyAvL2hvdyBtYW55IHNhbXBsZXMgcGVyIGN1YmljIGJlemllciBjaHVua1xuXG4gIGxlbmd0aCA9IHNlZ21lbnQudG90YWxMZW5ndGggKiBwcm9ncmVzcztcbiAgaSA9IHNlZ21lbnQubG9va3VwW35+KGxlbmd0aCAvIHNlZ21lbnQubWluTGVuZ3RoKV0gfHwgMDtcbiAgbWluID0gaSA/IHNhbXBsZXNbaSAtIDFdIDogMDtcbiAgbWF4ID0gc2FtcGxlc1tpXTtcblxuICBpZiAobWF4IDwgbGVuZ3RoKSB7XG4gICAgbWluID0gbWF4O1xuICAgIG1heCA9IHNhbXBsZXNbKytpXTtcbiAgfVxuXG4gIHQgPSAxIC8gcmVzb2x1dGlvbiAqICgobGVuZ3RoIC0gbWluKSAvIChtYXggLSBtaW4pICsgaSAlIHJlc29sdXRpb24pO1xuICBpID0gfn4oaSAvIHJlc29sdXRpb24pICogNjtcblxuICBpZiAocHVzaFRvTmV4dElmQXRFbmQgJiYgdCA9PT0gMSkge1xuICAgIGlmIChpICsgNiA8IHNlZ21lbnQubGVuZ3RoKSB7XG4gICAgICBpICs9IDY7XG4gICAgICB0ID0gMDtcbiAgICB9IGVsc2UgaWYgKHNlZ0luZGV4ICsgMSA8IHJhd1BhdGgubGVuZ3RoKSB7XG4gICAgICBpID0gdCA9IDA7XG4gICAgICBzZWdtZW50ID0gcmF3UGF0aFsrK3NlZ0luZGV4XTtcbiAgICB9XG4gIH1cblxuICBkZWNvcmF0ZWUudCA9IHQ7XG4gIGRlY29yYXRlZS5pID0gaTtcbiAgZGVjb3JhdGVlLnBhdGggPSByYXdQYXRoO1xuICBkZWNvcmF0ZWUuc2VnbWVudCA9IHNlZ21lbnQ7XG4gIGRlY29yYXRlZS5zZWdJbmRleCA9IHNlZ0luZGV4O1xuICByZXR1cm4gZGVjb3JhdGVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UG9zaXRpb25PblBhdGgocmF3UGF0aCwgcHJvZ3Jlc3MsIGluY2x1ZGVBbmdsZSwgcG9pbnQpIHtcbiAgdmFyIHNlZ21lbnQgPSByYXdQYXRoWzBdLFxuICAgICAgcmVzdWx0ID0gcG9pbnQgfHwge30sXG4gICAgICBzYW1wbGVzLFxuICAgICAgcmVzb2x1dGlvbixcbiAgICAgIGxlbmd0aCxcbiAgICAgIG1pbixcbiAgICAgIG1heCxcbiAgICAgIGksXG4gICAgICB0LFxuICAgICAgYSxcbiAgICAgIGludjtcblxuICBpZiAocHJvZ3Jlc3MgPCAwIHx8IHByb2dyZXNzID4gMSkge1xuICAgIHByb2dyZXNzID0gX3dyYXBQcm9ncmVzcyhwcm9ncmVzcyk7XG4gIH1cblxuICBpZiAocmF3UGF0aC5sZW5ndGggPiAxKSB7XG4gICAgLy9zcGVlZCBvcHRpbWl6YXRpb246IG1vc3Qgb2YgdGhlIHRpbWUsIHRoZXJlJ3Mgb25seSBvbmUgc2VnbWVudCBzbyBza2lwIHRoZSByZWN1cnNpb24uXG4gICAgbGVuZ3RoID0gcmF3UGF0aC50b3RhbExlbmd0aCAqIHByb2dyZXNzO1xuICAgIG1heCA9IGkgPSAwO1xuXG4gICAgd2hpbGUgKChtYXggKz0gcmF3UGF0aFtpKytdLnRvdGFsTGVuZ3RoKSA8IGxlbmd0aCkge1xuICAgICAgc2VnbWVudCA9IHJhd1BhdGhbaV07XG4gICAgfVxuXG4gICAgbWluID0gbWF4IC0gc2VnbWVudC50b3RhbExlbmd0aDtcbiAgICBwcm9ncmVzcyA9IChsZW5ndGggLSBtaW4pIC8gKG1heCAtIG1pbikgfHwgMDtcbiAgfVxuXG4gIHNhbXBsZXMgPSBzZWdtZW50LnNhbXBsZXM7XG4gIHJlc29sdXRpb24gPSBzZWdtZW50LnJlc29sdXRpb247XG4gIGxlbmd0aCA9IHNlZ21lbnQudG90YWxMZW5ndGggKiBwcm9ncmVzcztcbiAgaSA9IHNlZ21lbnQubG9va3VwW35+KGxlbmd0aCAvIHNlZ21lbnQubWluTGVuZ3RoKV0gfHwgMDtcbiAgbWluID0gaSA/IHNhbXBsZXNbaSAtIDFdIDogMDtcbiAgbWF4ID0gc2FtcGxlc1tpXTtcblxuICBpZiAobWF4IDwgbGVuZ3RoKSB7XG4gICAgbWluID0gbWF4O1xuICAgIG1heCA9IHNhbXBsZXNbKytpXTtcbiAgfVxuXG4gIHQgPSAxIC8gcmVzb2x1dGlvbiAqICgobGVuZ3RoIC0gbWluKSAvIChtYXggLSBtaW4pICsgaSAlIHJlc29sdXRpb24pIHx8IDA7XG4gIGludiA9IDEgLSB0O1xuICBpID0gfn4oaSAvIHJlc29sdXRpb24pICogNjtcbiAgYSA9IHNlZ21lbnRbaV07XG4gIHJlc3VsdC54ID0gX3JvdW5kKCh0ICogdCAqIChzZWdtZW50W2kgKyA2XSAtIGEpICsgMyAqIGludiAqICh0ICogKHNlZ21lbnRbaSArIDRdIC0gYSkgKyBpbnYgKiAoc2VnbWVudFtpICsgMl0gLSBhKSkpICogdCArIGEpO1xuICByZXN1bHQueSA9IF9yb3VuZCgodCAqIHQgKiAoc2VnbWVudFtpICsgN10gLSAoYSA9IHNlZ21lbnRbaSArIDFdKSkgKyAzICogaW52ICogKHQgKiAoc2VnbWVudFtpICsgNV0gLSBhKSArIGludiAqIChzZWdtZW50W2kgKyAzXSAtIGEpKSkgKiB0ICsgYSk7XG5cbiAgaWYgKGluY2x1ZGVBbmdsZSkge1xuICAgIHJlc3VsdC5hbmdsZSA9IHNlZ21lbnQudG90YWxMZW5ndGggPyBnZXRSb3RhdGlvbkF0QmV6aWVyVChzZWdtZW50LCBpLCB0ID49IDEgPyAxIC0gMWUtOSA6IHQgPyB0IDogMWUtOSkgOiBzZWdtZW50LmFuZ2xlIHx8IDA7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufSAvL2FwcGxpZXMgYSBtYXRyaXggdHJhbnNmb3JtIHRvIFJhd1BhdGggKG9yIGEgc2VnbWVudCBpbiBhIFJhd1BhdGgpIGFuZCByZXR1cm5zIHdoYXRldmVyIHdhcyBwYXNzZWQgaW4gKGl0IHRyYW5zZm9ybXMgdGhlIHZhbHVlcyBpbiB0aGUgYXJyYXkocyksIG5vdCBhIGNvcHkpLlxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNmb3JtUmF3UGF0aChyYXdQYXRoLCBhLCBiLCBjLCBkLCB0eCwgdHkpIHtcbiAgdmFyIGogPSByYXdQYXRoLmxlbmd0aCxcbiAgICAgIHNlZ21lbnQsXG4gICAgICBsLFxuICAgICAgaSxcbiAgICAgIHgsXG4gICAgICB5O1xuXG4gIHdoaWxlICgtLWogPiAtMSkge1xuICAgIHNlZ21lbnQgPSByYXdQYXRoW2pdO1xuICAgIGwgPSBzZWdtZW50Lmxlbmd0aDtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDIpIHtcbiAgICAgIHggPSBzZWdtZW50W2ldO1xuICAgICAgeSA9IHNlZ21lbnRbaSArIDFdO1xuICAgICAgc2VnbWVudFtpXSA9IHggKiBhICsgeSAqIGMgKyB0eDtcbiAgICAgIHNlZ21lbnRbaSArIDFdID0geCAqIGIgKyB5ICogZCArIHR5O1xuICAgIH1cbiAgfVxuXG4gIHJhd1BhdGguX2RpcnR5ID0gMTtcbiAgcmV0dXJuIHJhd1BhdGg7XG59IC8vIHRyYW5zbGF0ZXMgU1ZHIGFyYyBkYXRhIGludG8gYSBzZWdtZW50IChjdWJpYyBiZXppZXJzKS4gQW5nbGUgaXMgaW4gZGVncmVlcy5cblxuZnVuY3Rpb24gYXJjVG9TZWdtZW50KGxhc3RYLCBsYXN0WSwgcngsIHJ5LCBhbmdsZSwgbGFyZ2VBcmNGbGFnLCBzd2VlcEZsYWcsIHgsIHkpIHtcbiAgaWYgKGxhc3RYID09PSB4ICYmIGxhc3RZID09PSB5KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcnggPSBfYWJzKHJ4KTtcbiAgcnkgPSBfYWJzKHJ5KTtcblxuICB2YXIgYW5nbGVSYWQgPSBhbmdsZSAlIDM2MCAqIF9ERUcyUkFELFxuICAgICAgY29zQW5nbGUgPSBfY29zKGFuZ2xlUmFkKSxcbiAgICAgIHNpbkFuZ2xlID0gX3NpbihhbmdsZVJhZCksXG4gICAgICBQSSA9IE1hdGguUEksXG4gICAgICBUV09QSSA9IFBJICogMixcbiAgICAgIGR4MiA9IChsYXN0WCAtIHgpIC8gMixcbiAgICAgIGR5MiA9IChsYXN0WSAtIHkpIC8gMixcbiAgICAgIHgxID0gY29zQW5nbGUgKiBkeDIgKyBzaW5BbmdsZSAqIGR5MixcbiAgICAgIHkxID0gLXNpbkFuZ2xlICogZHgyICsgY29zQW5nbGUgKiBkeTIsXG4gICAgICB4MV9zcSA9IHgxICogeDEsXG4gICAgICB5MV9zcSA9IHkxICogeTEsXG4gICAgICByYWRpaUNoZWNrID0geDFfc3EgLyAocnggKiByeCkgKyB5MV9zcSAvIChyeSAqIHJ5KTtcblxuICBpZiAocmFkaWlDaGVjayA+IDEpIHtcbiAgICByeCA9IF9zcXJ0KHJhZGlpQ2hlY2spICogcng7XG4gICAgcnkgPSBfc3FydChyYWRpaUNoZWNrKSAqIHJ5O1xuICB9XG5cbiAgdmFyIHJ4X3NxID0gcnggKiByeCxcbiAgICAgIHJ5X3NxID0gcnkgKiByeSxcbiAgICAgIHNxID0gKHJ4X3NxICogcnlfc3EgLSByeF9zcSAqIHkxX3NxIC0gcnlfc3EgKiB4MV9zcSkgLyAocnhfc3EgKiB5MV9zcSArIHJ5X3NxICogeDFfc3EpO1xuXG4gIGlmIChzcSA8IDApIHtcbiAgICBzcSA9IDA7XG4gIH1cblxuICB2YXIgY29lZiA9IChsYXJnZUFyY0ZsYWcgPT09IHN3ZWVwRmxhZyA/IC0xIDogMSkgKiBfc3FydChzcSksXG4gICAgICBjeDEgPSBjb2VmICogKHJ4ICogeTEgLyByeSksXG4gICAgICBjeTEgPSBjb2VmICogLShyeSAqIHgxIC8gcngpLFxuICAgICAgc3gyID0gKGxhc3RYICsgeCkgLyAyLFxuICAgICAgc3kyID0gKGxhc3RZICsgeSkgLyAyLFxuICAgICAgY3ggPSBzeDIgKyAoY29zQW5nbGUgKiBjeDEgLSBzaW5BbmdsZSAqIGN5MSksXG4gICAgICBjeSA9IHN5MiArIChzaW5BbmdsZSAqIGN4MSArIGNvc0FuZ2xlICogY3kxKSxcbiAgICAgIHV4ID0gKHgxIC0gY3gxKSAvIHJ4LFxuICAgICAgdXkgPSAoeTEgLSBjeTEpIC8gcnksXG4gICAgICB2eCA9ICgteDEgLSBjeDEpIC8gcngsXG4gICAgICB2eSA9ICgteTEgLSBjeTEpIC8gcnksXG4gICAgICB0ZW1wID0gdXggKiB1eCArIHV5ICogdXksXG4gICAgICBhbmdsZVN0YXJ0ID0gKHV5IDwgMCA/IC0xIDogMSkgKiBNYXRoLmFjb3ModXggLyBfc3FydCh0ZW1wKSksXG4gICAgICBhbmdsZUV4dGVudCA9ICh1eCAqIHZ5IC0gdXkgKiB2eCA8IDAgPyAtMSA6IDEpICogTWF0aC5hY29zKCh1eCAqIHZ4ICsgdXkgKiB2eSkgLyBfc3FydCh0ZW1wICogKHZ4ICogdnggKyB2eSAqIHZ5KSkpO1xuXG4gIGlzTmFOKGFuZ2xlRXh0ZW50KSAmJiAoYW5nbGVFeHRlbnQgPSBQSSk7IC8vcmFyZSBlZGdlIGNhc2UuIE1hdGguY29zKC0xKSBpcyBOYU4uXG5cbiAgaWYgKCFzd2VlcEZsYWcgJiYgYW5nbGVFeHRlbnQgPiAwKSB7XG4gICAgYW5nbGVFeHRlbnQgLT0gVFdPUEk7XG4gIH0gZWxzZSBpZiAoc3dlZXBGbGFnICYmIGFuZ2xlRXh0ZW50IDwgMCkge1xuICAgIGFuZ2xlRXh0ZW50ICs9IFRXT1BJO1xuICB9XG5cbiAgYW5nbGVTdGFydCAlPSBUV09QSTtcbiAgYW5nbGVFeHRlbnQgJT0gVFdPUEk7XG5cbiAgdmFyIHNlZ21lbnRzID0gTWF0aC5jZWlsKF9hYnMoYW5nbGVFeHRlbnQpIC8gKFRXT1BJIC8gNCkpLFxuICAgICAgcmF3UGF0aCA9IFtdLFxuICAgICAgYW5nbGVJbmNyZW1lbnQgPSBhbmdsZUV4dGVudCAvIHNlZ21lbnRzLFxuICAgICAgY29udHJvbExlbmd0aCA9IDQgLyAzICogX3NpbihhbmdsZUluY3JlbWVudCAvIDIpIC8gKDEgKyBfY29zKGFuZ2xlSW5jcmVtZW50IC8gMikpLFxuICAgICAgbWEgPSBjb3NBbmdsZSAqIHJ4LFxuICAgICAgbWIgPSBzaW5BbmdsZSAqIHJ4LFxuICAgICAgbWMgPSBzaW5BbmdsZSAqIC1yeSxcbiAgICAgIG1kID0gY29zQW5nbGUgKiByeSxcbiAgICAgIGk7XG5cbiAgZm9yIChpID0gMDsgaSA8IHNlZ21lbnRzOyBpKyspIHtcbiAgICBhbmdsZSA9IGFuZ2xlU3RhcnQgKyBpICogYW5nbGVJbmNyZW1lbnQ7XG4gICAgeDEgPSBfY29zKGFuZ2xlKTtcbiAgICB5MSA9IF9zaW4oYW5nbGUpO1xuICAgIHV4ID0gX2NvcyhhbmdsZSArPSBhbmdsZUluY3JlbWVudCk7XG4gICAgdXkgPSBfc2luKGFuZ2xlKTtcbiAgICByYXdQYXRoLnB1c2goeDEgLSBjb250cm9sTGVuZ3RoICogeTEsIHkxICsgY29udHJvbExlbmd0aCAqIHgxLCB1eCArIGNvbnRyb2xMZW5ndGggKiB1eSwgdXkgLSBjb250cm9sTGVuZ3RoICogdXgsIHV4LCB1eSk7XG4gIH0gLy9ub3cgdHJhbnNmb3JtIGFjY29yZGluZyB0byB0aGUgYWN0dWFsIHNpemUgb2YgdGhlIGVsbGlwc2UvYXJjICh0aGUgYmV6aWVycyB3ZXJlIG5vcmFtbGl6ZWQsIGJldHdlZW4gMCBhbmQgMSBvbiBhIGNpcmNsZSkuXG5cblxuICBmb3IgKGkgPSAwOyBpIDwgcmF3UGF0aC5sZW5ndGg7IGkgKz0gMikge1xuICAgIHgxID0gcmF3UGF0aFtpXTtcbiAgICB5MSA9IHJhd1BhdGhbaSArIDFdO1xuICAgIHJhd1BhdGhbaV0gPSB4MSAqIG1hICsgeTEgKiBtYyArIGN4O1xuICAgIHJhd1BhdGhbaSArIDFdID0geDEgKiBtYiArIHkxICogbWQgKyBjeTtcbiAgfVxuXG4gIHJhd1BhdGhbaSAtIDJdID0geDsgLy9hbHdheXMgc2V0IHRoZSBlbmQgdG8gZXhhY3RseSB3aGVyZSBpdCdzIHN1cHBvc2VkIHRvIGJlXG5cbiAgcmF3UGF0aFtpIC0gMV0gPSB5O1xuICByZXR1cm4gcmF3UGF0aDtcbn0gLy9TcGl0cyBiYWNrIGEgUmF3UGF0aCB3aXRoIGFic29sdXRlIGNvb3JkaW5hdGVzLiBFYWNoIHNlZ21lbnQgc3RhcnRzIHdpdGggYSBcIm1vdmVUb1wiIGNvbW1hbmQgKHggY29vcmRpbmF0ZSwgdGhlbiB5KSBhbmQgdGhlbiAyIGNvbnRyb2wgcG9pbnRzICh4LCB5LCB4LCB5KSwgdGhlbiBhbmNob3IuIFRoZSBnb2FsIGlzIHRvIG1pbmltaXplIG1lbW9yeSBhbmQgbWF4aW1pemUgc3BlZWQuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ1RvUmF3UGF0aChkKSB7XG4gIHZhciBhID0gKGQgKyBcIlwiKS5yZXBsYWNlKF9zY2llbnRpZmljLCBmdW5jdGlvbiAobSkge1xuICAgIHZhciBuID0gK207XG4gICAgcmV0dXJuIG4gPCAwLjAwMDEgJiYgbiA+IC0wLjAwMDEgPyAwIDogbjtcbiAgfSkubWF0Y2goX3N2Z1BhdGhFeHApIHx8IFtdLFxuICAgICAgLy9zb21lIGF1dGhvcmluZyBwcm9ncmFtcyBzcGl0IG91dCB2ZXJ5IHNtYWxsIG51bWJlcnMgaW4gc2NpZW50aWZpYyBub3RhdGlvbiBsaWtlIFwiMWUtNVwiLCBzbyBtYWtlIHN1cmUgd2Ugcm91bmQgdGhhdCBkb3duIHRvIDAgZmlyc3QuXG4gIHBhdGggPSBbXSxcbiAgICAgIHJlbGF0aXZlWCA9IDAsXG4gICAgICByZWxhdGl2ZVkgPSAwLFxuICAgICAgdHdvVGhpcmRzID0gMiAvIDMsXG4gICAgICBlbGVtZW50cyA9IGEubGVuZ3RoLFxuICAgICAgcG9pbnRzID0gMCxcbiAgICAgIGVycm9yTWVzc2FnZSA9IFwiRVJST1I6IG1hbGZvcm1lZCBwYXRoOiBcIiArIGQsXG4gICAgICBpLFxuICAgICAgaixcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAgY29tbWFuZCxcbiAgICAgIGlzUmVsYXRpdmUsXG4gICAgICBzZWdtZW50LFxuICAgICAgc3RhcnRYLFxuICAgICAgc3RhcnRZLFxuICAgICAgZGlmWCxcbiAgICAgIGRpZlksXG4gICAgICBiZXppZXJzLFxuICAgICAgcHJldkNvbW1hbmQsXG4gICAgICBmbGFnMSxcbiAgICAgIGZsYWcyLFxuICAgICAgbGluZSA9IGZ1bmN0aW9uIGxpbmUoc3gsIHN5LCBleCwgZXkpIHtcbiAgICBkaWZYID0gKGV4IC0gc3gpIC8gMztcbiAgICBkaWZZID0gKGV5IC0gc3kpIC8gMztcbiAgICBzZWdtZW50LnB1c2goc3ggKyBkaWZYLCBzeSArIGRpZlksIGV4IC0gZGlmWCwgZXkgLSBkaWZZLCBleCwgZXkpO1xuICB9O1xuXG4gIGlmICghZCB8fCAhaXNOYU4oYVswXSkgfHwgaXNOYU4oYVsxXSkpIHtcbiAgICBjb25zb2xlLmxvZyhlcnJvck1lc3NhZ2UpO1xuICAgIHJldHVybiBwYXRoO1xuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IGVsZW1lbnRzOyBpKyspIHtcbiAgICBwcmV2Q29tbWFuZCA9IGNvbW1hbmQ7XG5cbiAgICBpZiAoaXNOYU4oYVtpXSkpIHtcbiAgICAgIGNvbW1hbmQgPSBhW2ldLnRvVXBwZXJDYXNlKCk7XG4gICAgICBpc1JlbGF0aXZlID0gY29tbWFuZCAhPT0gYVtpXTsgLy9sb3dlciBjYXNlIG1lYW5zIHJlbGF0aXZlXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vY29tbWFuZHMgbGlrZSBcIkNcIiBjYW4gYmUgc3RydW5nIHRvZ2V0aGVyIHdpdGhvdXQgYW55IG5ldyBjb21tYW5kIGNoYXJhY3RlcnMgYmV0d2Vlbi5cbiAgICAgIGktLTtcbiAgICB9XG5cbiAgICB4ID0gK2FbaSArIDFdO1xuICAgIHkgPSArYVtpICsgMl07XG5cbiAgICBpZiAoaXNSZWxhdGl2ZSkge1xuICAgICAgeCArPSByZWxhdGl2ZVg7XG4gICAgICB5ICs9IHJlbGF0aXZlWTtcbiAgICB9XG5cbiAgICBpZiAoIWkpIHtcbiAgICAgIHN0YXJ0WCA9IHg7XG4gICAgICBzdGFydFkgPSB5O1xuICAgIH0gLy8gXCJNXCIgKG1vdmUpXG5cblxuICAgIGlmIChjb21tYW5kID09PSBcIk1cIikge1xuICAgICAgaWYgKHNlZ21lbnQpIHtcbiAgICAgICAgaWYgKHNlZ21lbnQubGVuZ3RoIDwgOCkge1xuICAgICAgICAgIC8vaWYgdGhlIHBhdGggZGF0YSB3YXMgZnVua3kgYW5kIGp1c3QgaGFkIGEgTSB3aXRoIG5vIGFjdHVhbCBkcmF3aW5nIGFueXdoZXJlLCBza2lwIGl0LlxuICAgICAgICAgIHBhdGgubGVuZ3RoIC09IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcG9pbnRzICs9IHNlZ21lbnQubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJlbGF0aXZlWCA9IHN0YXJ0WCA9IHg7XG4gICAgICByZWxhdGl2ZVkgPSBzdGFydFkgPSB5O1xuICAgICAgc2VnbWVudCA9IFt4LCB5XTtcbiAgICAgIHBhdGgucHVzaChzZWdtZW50KTtcbiAgICAgIGkgKz0gMjtcbiAgICAgIGNvbW1hbmQgPSBcIkxcIjsgLy9hbiBcIk1cIiB3aXRoIG1vcmUgdGhhbiAyIHZhbHVlcyBnZXRzIGludGVycHJldGVkIGFzIFwibGluZVRvXCIgY29tbWFuZHMgKFwiTFwiKS5cbiAgICAgIC8vIFwiQ1wiIChjdWJpYyBiZXppZXIpXG4gICAgfSBlbHNlIGlmIChjb21tYW5kID09PSBcIkNcIikge1xuICAgICAgaWYgKCFzZWdtZW50KSB7XG4gICAgICAgIHNlZ21lbnQgPSBbMCwgMF07XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNSZWxhdGl2ZSkge1xuICAgICAgICByZWxhdGl2ZVggPSByZWxhdGl2ZVkgPSAwO1xuICAgICAgfSAvL25vdGU6IFwiKjFcIiBpcyBqdXN0IGEgZmFzdC9zaG9ydCB3YXkgdG8gY2FzdCB0aGUgdmFsdWUgYXMgYSBOdW1iZXIuIFdBQUFZIGZhc3RlciBpbiBDaHJvbWUsIHNsaWdodGx5IHNsb3dlciBpbiBGaXJlZm94LlxuXG5cbiAgICAgIHNlZ21lbnQucHVzaCh4LCB5LCByZWxhdGl2ZVggKyBhW2kgKyAzXSAqIDEsIHJlbGF0aXZlWSArIGFbaSArIDRdICogMSwgcmVsYXRpdmVYICs9IGFbaSArIDVdICogMSwgcmVsYXRpdmVZICs9IGFbaSArIDZdICogMSk7XG4gICAgICBpICs9IDY7IC8vIFwiU1wiIChjb250aW51YXRpb24gb2YgY3ViaWMgYmV6aWVyKVxuICAgIH0gZWxzZSBpZiAoY29tbWFuZCA9PT0gXCJTXCIpIHtcbiAgICAgIGRpZlggPSByZWxhdGl2ZVg7XG4gICAgICBkaWZZID0gcmVsYXRpdmVZO1xuXG4gICAgICBpZiAocHJldkNvbW1hbmQgPT09IFwiQ1wiIHx8IHByZXZDb21tYW5kID09PSBcIlNcIikge1xuICAgICAgICBkaWZYICs9IHJlbGF0aXZlWCAtIHNlZ21lbnRbc2VnbWVudC5sZW5ndGggLSA0XTtcbiAgICAgICAgZGlmWSArPSByZWxhdGl2ZVkgLSBzZWdtZW50W3NlZ21lbnQubGVuZ3RoIC0gM107XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNSZWxhdGl2ZSkge1xuICAgICAgICByZWxhdGl2ZVggPSByZWxhdGl2ZVkgPSAwO1xuICAgICAgfVxuXG4gICAgICBzZWdtZW50LnB1c2goZGlmWCwgZGlmWSwgeCwgeSwgcmVsYXRpdmVYICs9IGFbaSArIDNdICogMSwgcmVsYXRpdmVZICs9IGFbaSArIDRdICogMSk7XG4gICAgICBpICs9IDQ7IC8vIFwiUVwiIChxdWFkcmF0aWMgYmV6aWVyKVxuICAgIH0gZWxzZSBpZiAoY29tbWFuZCA9PT0gXCJRXCIpIHtcbiAgICAgIGRpZlggPSByZWxhdGl2ZVggKyAoeCAtIHJlbGF0aXZlWCkgKiB0d29UaGlyZHM7XG4gICAgICBkaWZZID0gcmVsYXRpdmVZICsgKHkgLSByZWxhdGl2ZVkpICogdHdvVGhpcmRzO1xuXG4gICAgICBpZiAoIWlzUmVsYXRpdmUpIHtcbiAgICAgICAgcmVsYXRpdmVYID0gcmVsYXRpdmVZID0gMDtcbiAgICAgIH1cblxuICAgICAgcmVsYXRpdmVYICs9IGFbaSArIDNdICogMTtcbiAgICAgIHJlbGF0aXZlWSArPSBhW2kgKyA0XSAqIDE7XG4gICAgICBzZWdtZW50LnB1c2goZGlmWCwgZGlmWSwgcmVsYXRpdmVYICsgKHggLSByZWxhdGl2ZVgpICogdHdvVGhpcmRzLCByZWxhdGl2ZVkgKyAoeSAtIHJlbGF0aXZlWSkgKiB0d29UaGlyZHMsIHJlbGF0aXZlWCwgcmVsYXRpdmVZKTtcbiAgICAgIGkgKz0gNDsgLy8gXCJUXCIgKGNvbnRpbnVhdGlvbiBvZiBxdWFkcmF0aWMgYmV6aWVyKVxuICAgIH0gZWxzZSBpZiAoY29tbWFuZCA9PT0gXCJUXCIpIHtcbiAgICAgIGRpZlggPSByZWxhdGl2ZVggLSBzZWdtZW50W3NlZ21lbnQubGVuZ3RoIC0gNF07XG4gICAgICBkaWZZID0gcmVsYXRpdmVZIC0gc2VnbWVudFtzZWdtZW50Lmxlbmd0aCAtIDNdO1xuICAgICAgc2VnbWVudC5wdXNoKHJlbGF0aXZlWCArIGRpZlgsIHJlbGF0aXZlWSArIGRpZlksIHggKyAocmVsYXRpdmVYICsgZGlmWCAqIDEuNSAtIHgpICogdHdvVGhpcmRzLCB5ICsgKHJlbGF0aXZlWSArIGRpZlkgKiAxLjUgLSB5KSAqIHR3b1RoaXJkcywgcmVsYXRpdmVYID0geCwgcmVsYXRpdmVZID0geSk7XG4gICAgICBpICs9IDI7IC8vIFwiSFwiIChob3Jpem9udGFsIGxpbmUpXG4gICAgfSBlbHNlIGlmIChjb21tYW5kID09PSBcIkhcIikge1xuICAgICAgbGluZShyZWxhdGl2ZVgsIHJlbGF0aXZlWSwgcmVsYXRpdmVYID0geCwgcmVsYXRpdmVZKTtcbiAgICAgIGkgKz0gMTsgLy8gXCJWXCIgKHZlcnRpY2FsIGxpbmUpXG4gICAgfSBlbHNlIGlmIChjb21tYW5kID09PSBcIlZcIikge1xuICAgICAgLy9hZGp1c3QgdmFsdWVzIGJlY2F1c2UgdGhlIGZpcnN0IChhbmQgb25seSBvbmUpIGlzbid0IHggaW4gdGhpcyBjYXNlLCBpdCdzIHkuXG4gICAgICBsaW5lKHJlbGF0aXZlWCwgcmVsYXRpdmVZLCByZWxhdGl2ZVgsIHJlbGF0aXZlWSA9IHggKyAoaXNSZWxhdGl2ZSA/IHJlbGF0aXZlWSAtIHJlbGF0aXZlWCA6IDApKTtcbiAgICAgIGkgKz0gMTsgLy8gXCJMXCIgKGxpbmUpIG9yIFwiWlwiIChjbG9zZSlcbiAgICB9IGVsc2UgaWYgKGNvbW1hbmQgPT09IFwiTFwiIHx8IGNvbW1hbmQgPT09IFwiWlwiKSB7XG4gICAgICBpZiAoY29tbWFuZCA9PT0gXCJaXCIpIHtcbiAgICAgICAgeCA9IHN0YXJ0WDtcbiAgICAgICAgeSA9IHN0YXJ0WTtcbiAgICAgICAgc2VnbWVudC5jbG9zZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29tbWFuZCA9PT0gXCJMXCIgfHwgX2FicyhyZWxhdGl2ZVggLSB4KSA+IDAuNSB8fCBfYWJzKHJlbGF0aXZlWSAtIHkpID4gMC41KSB7XG4gICAgICAgIGxpbmUocmVsYXRpdmVYLCByZWxhdGl2ZVksIHgsIHkpO1xuXG4gICAgICAgIGlmIChjb21tYW5kID09PSBcIkxcIikge1xuICAgICAgICAgIGkgKz0gMjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZWxhdGl2ZVggPSB4O1xuICAgICAgcmVsYXRpdmVZID0geTsgLy8gXCJBXCIgKGFyYylcbiAgICB9IGVsc2UgaWYgKGNvbW1hbmQgPT09IFwiQVwiKSB7XG4gICAgICBmbGFnMSA9IGFbaSArIDRdO1xuICAgICAgZmxhZzIgPSBhW2kgKyA1XTtcbiAgICAgIGRpZlggPSBhW2kgKyA2XTtcbiAgICAgIGRpZlkgPSBhW2kgKyA3XTtcbiAgICAgIGogPSA3O1xuXG4gICAgICBpZiAoZmxhZzEubGVuZ3RoID4gMSkge1xuICAgICAgICAvLyBmb3IgY2FzZXMgd2hlbiB0aGUgZmxhZ3MgYXJlIG1lcmdlZCwgbGlrZSBcImE4IDggMCAwMTggOFwiICh0aGUgMCBhbmQgMSBmbGFncyBhcmUgV0lUSCB0aGUgeCB2YWx1ZSBvZiA4LCBidXQgaXQgY291bGQgYWxzbyBiZSBcImE4IDggMCAwMS04IDhcIiBzbyBpdCBtYXkgaW5jbHVkZSB4IG9yIG5vdClcbiAgICAgICAgaWYgKGZsYWcxLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgICBkaWZZID0gZGlmWDtcbiAgICAgICAgICBkaWZYID0gZmxhZzI7XG4gICAgICAgICAgai0tO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpZlkgPSBmbGFnMjtcbiAgICAgICAgICBkaWZYID0gZmxhZzEuc3Vic3RyKDIpO1xuICAgICAgICAgIGogLT0gMjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZsYWcyID0gZmxhZzEuY2hhckF0KDEpO1xuICAgICAgICBmbGFnMSA9IGZsYWcxLmNoYXJBdCgwKTtcbiAgICAgIH1cblxuICAgICAgYmV6aWVycyA9IGFyY1RvU2VnbWVudChyZWxhdGl2ZVgsIHJlbGF0aXZlWSwgK2FbaSArIDFdLCArYVtpICsgMl0sICthW2kgKyAzXSwgK2ZsYWcxLCArZmxhZzIsIChpc1JlbGF0aXZlID8gcmVsYXRpdmVYIDogMCkgKyBkaWZYICogMSwgKGlzUmVsYXRpdmUgPyByZWxhdGl2ZVkgOiAwKSArIGRpZlkgKiAxKTtcbiAgICAgIGkgKz0gajtcblxuICAgICAgaWYgKGJlemllcnMpIHtcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IGJlemllcnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBzZWdtZW50LnB1c2goYmV6aWVyc1tqXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmVsYXRpdmVYID0gc2VnbWVudFtzZWdtZW50Lmxlbmd0aCAtIDJdO1xuICAgICAgcmVsYXRpdmVZID0gc2VnbWVudFtzZWdtZW50Lmxlbmd0aCAtIDFdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvck1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIGkgPSBzZWdtZW50Lmxlbmd0aDtcblxuICBpZiAoaSA8IDYpIHtcbiAgICAvL2luIGNhc2UgdGhlcmUncyBvZGQgU1ZHIGxpa2UgYSBNMCwwIGNvbW1hbmQgYXQgdGhlIHZlcnkgZW5kLlxuICAgIHBhdGgucG9wKCk7XG4gICAgaSA9IDA7XG4gIH0gZWxzZSBpZiAoc2VnbWVudFswXSA9PT0gc2VnbWVudFtpIC0gMl0gJiYgc2VnbWVudFsxXSA9PT0gc2VnbWVudFtpIC0gMV0pIHtcbiAgICBzZWdtZW50LmNsb3NlZCA9IHRydWU7XG4gIH1cblxuICBwYXRoLnRvdGFsUG9pbnRzID0gcG9pbnRzICsgaTtcbiAgcmV0dXJuIHBhdGg7XG59IC8vcG9wdWxhdGVzIHRoZSBwb2ludHMgYXJyYXkgaW4gYWx0ZXJuYXRpbmcgeC95IHZhbHVlcyAobGlrZSBbeCwgeSwgeCwgeS4uLl0gaW5zdGVhZCBvZiBpbmRpdmlkdWFsIHBvaW50IG9iamVjdHMgW3t4LCB5fSwge3gsIHl9Li4uXSB0byBjb25zZXJ2ZSBtZW1vcnkgYW5kIHN0YXkgaW4gbGluZSB3aXRoIGhvdyB3ZSdyZSBoYW5kbGluZyBzZWdtZW50IGFycmF5c1xuXG5leHBvcnQgZnVuY3Rpb24gYmV6aWVyVG9Qb2ludHMoeDEsIHkxLCB4MiwgeTIsIHgzLCB5MywgeDQsIHk0LCB0aHJlc2hvbGQsIHBvaW50cywgaW5kZXgpIHtcbiAgdmFyIHgxMiA9ICh4MSArIHgyKSAvIDIsXG4gICAgICB5MTIgPSAoeTEgKyB5MikgLyAyLFxuICAgICAgeDIzID0gKHgyICsgeDMpIC8gMixcbiAgICAgIHkyMyA9ICh5MiArIHkzKSAvIDIsXG4gICAgICB4MzQgPSAoeDMgKyB4NCkgLyAyLFxuICAgICAgeTM0ID0gKHkzICsgeTQpIC8gMixcbiAgICAgIHgxMjMgPSAoeDEyICsgeDIzKSAvIDIsXG4gICAgICB5MTIzID0gKHkxMiArIHkyMykgLyAyLFxuICAgICAgeDIzNCA9ICh4MjMgKyB4MzQpIC8gMixcbiAgICAgIHkyMzQgPSAoeTIzICsgeTM0KSAvIDIsXG4gICAgICB4MTIzNCA9ICh4MTIzICsgeDIzNCkgLyAyLFxuICAgICAgeTEyMzQgPSAoeTEyMyArIHkyMzQpIC8gMixcbiAgICAgIGR4ID0geDQgLSB4MSxcbiAgICAgIGR5ID0geTQgLSB5MSxcbiAgICAgIGQyID0gX2FicygoeDIgLSB4NCkgKiBkeSAtICh5MiAtIHk0KSAqIGR4KSxcbiAgICAgIGQzID0gX2FicygoeDMgLSB4NCkgKiBkeSAtICh5MyAtIHk0KSAqIGR4KSxcbiAgICAgIGxlbmd0aDtcblxuICBpZiAoIXBvaW50cykge1xuICAgIHBvaW50cyA9IFt4MSwgeTEsIHg0LCB5NF07XG4gICAgaW5kZXggPSAyO1xuICB9XG5cbiAgcG9pbnRzLnNwbGljZShpbmRleCB8fCBwb2ludHMubGVuZ3RoIC0gMiwgMCwgeDEyMzQsIHkxMjM0KTtcblxuICBpZiAoKGQyICsgZDMpICogKGQyICsgZDMpID4gdGhyZXNob2xkICogKGR4ICogZHggKyBkeSAqIGR5KSkge1xuICAgIGxlbmd0aCA9IHBvaW50cy5sZW5ndGg7XG4gICAgYmV6aWVyVG9Qb2ludHMoeDEsIHkxLCB4MTIsIHkxMiwgeDEyMywgeTEyMywgeDEyMzQsIHkxMjM0LCB0aHJlc2hvbGQsIHBvaW50cywgaW5kZXgpO1xuICAgIGJlemllclRvUG9pbnRzKHgxMjM0LCB5MTIzNCwgeDIzNCwgeTIzNCwgeDM0LCB5MzQsIHg0LCB5NCwgdGhyZXNob2xkLCBwb2ludHMsIGluZGV4ICsgMiArIChwb2ludHMubGVuZ3RoIC0gbGVuZ3RoKSk7XG4gIH1cblxuICByZXR1cm4gcG9pbnRzO1xufVxuLypcbmZ1bmN0aW9uIGdldEFuZ2xlQmV0d2VlblBvaW50cyh4MCwgeTAsIHgxLCB5MSwgeDIsIHkyKSB7IC8vYW5nbGUgYmV0d2VlbiAzIHBvaW50cyBpbiByYWRpYW5zXG5cdHZhciBkeDEgPSB4MSAtIHgwLFxuXHRcdGR5MSA9IHkxIC0geTAsXG5cdFx0ZHgyID0geDIgLSB4MSxcblx0XHRkeTIgPSB5MiAtIHkxLFxuXHRcdGR4MyA9IHgyIC0geDAsXG5cdFx0ZHkzID0geTIgLSB5MCxcblx0XHRhID0gZHgxICogZHgxICsgZHkxICogZHkxLFxuXHRcdGIgPSBkeDIgKiBkeDIgKyBkeTIgKiBkeTIsXG5cdFx0YyA9IGR4MyAqIGR4MyArIGR5MyAqIGR5Mztcblx0cmV0dXJuIE1hdGguYWNvcyggKGEgKyBiIC0gYykgLyBfc3FydCg0ICogYSAqIGIpICk7XG59LFxuKi9cbi8vcG9pbnRzVG9TZWdtZW50KCkgZG9lc24ndCBoYW5kbGUgZmxhdCBjb29yZGluYXRlcyAod2hlcmUgeSBpcyBhbHdheXMgMCkgdGhlIHdheSB3ZSBuZWVkICh0aGUgcmVzdWx0aW5nIGNvbnRyb2wgcG9pbnRzIGFyZSBhbHdheXMgcmlnaHQgb24gdG9wIG9mIHRoZSBhbmNob3JzKSwgc28gdGhpcyBmdW5jdGlvbiBiYXNpY2FsbHkgbWFrZXMgdGhlIGNvbnRyb2wgcG9pbnRzIGdvIGRpcmVjdGx5IHVwIGFuZCBkb3duLCB2YXJ5aW5nIGluIGxlbmd0aCBiYXNlZCBvbiB0aGUgY3VydmluZXNzIChtb3JlIGN1cnZ5LCBmdXJ0aGVyIGNvbnRyb2wgcG9pbnRzKVxuXG5leHBvcnQgZnVuY3Rpb24gZmxhdFBvaW50c1RvU2VnbWVudChwb2ludHMsIGN1cnZpbmVzcykge1xuICBpZiAoY3VydmluZXNzID09PSB2b2lkIDApIHtcbiAgICBjdXJ2aW5lc3MgPSAxO1xuICB9XG5cbiAgdmFyIHggPSBwb2ludHNbMF0sXG4gICAgICB5ID0gMCxcbiAgICAgIHNlZ21lbnQgPSBbeCwgeV0sXG4gICAgICBpID0gMjtcblxuICBmb3IgKDsgaSA8IHBvaW50cy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHNlZ21lbnQucHVzaCh4LCB5LCBwb2ludHNbaV0sIHkgPSAocG9pbnRzW2ldIC0geCkgKiBjdXJ2aW5lc3MgLyAyLCB4ID0gcG9pbnRzW2ldLCAteSk7XG4gIH1cblxuICByZXR1cm4gc2VnbWVudDtcbn0gLy9wb2ludHMgaXMgYW4gYXJyYXkgb2YgeC95IHBvaW50cywgbGlrZSBbeCwgeSwgeCwgeSwgeCwgeV1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvaW50c1RvU2VnbWVudChwb2ludHMsIGN1cnZpbmVzcywgY29ybmVyVGhyZXNob2xkKSB7XG4gIC8vcG9pbnRzID0gc2ltcGxpZnlQb2ludHMocG9pbnRzLCB0b2xlcmFuY2UpO1xuICB2YXIgbCA9IHBvaW50cy5sZW5ndGggLSAyLFxuICAgICAgeCA9ICtwb2ludHNbMF0sXG4gICAgICB5ID0gK3BvaW50c1sxXSxcbiAgICAgIG5leHRYID0gK3BvaW50c1syXSxcbiAgICAgIG5leHRZID0gK3BvaW50c1szXSxcbiAgICAgIHNlZ21lbnQgPSBbeCwgeSwgeCwgeV0sXG4gICAgICBkeDIgPSBuZXh0WCAtIHgsXG4gICAgICBkeTIgPSBuZXh0WSAtIHksXG4gICAgICBjbG9zZWQgPSBNYXRoLmFicyhwb2ludHNbbF0gLSB4KSA8IDAuMDAxICYmIE1hdGguYWJzKHBvaW50c1tsICsgMV0gLSB5KSA8IDAuMDAxLFxuICAgICAgcHJldlgsXG4gICAgICBwcmV2WSxcbiAgICAgIGFuZ2xlLFxuICAgICAgc2xvcGUsXG4gICAgICBpLFxuICAgICAgZHgxLFxuICAgICAgZHgzLFxuICAgICAgZHkxLFxuICAgICAgZHkzLFxuICAgICAgZDEsXG4gICAgICBkMixcbiAgICAgIGEsXG4gICAgICBiLFxuICAgICAgYztcblxuICBpZiAoaXNOYU4oY29ybmVyVGhyZXNob2xkKSkge1xuICAgIGNvcm5lclRocmVzaG9sZCA9IE1hdGguUEkgLyAxMDtcbiAgfVxuXG4gIGlmIChjbG9zZWQpIHtcbiAgICAvLyBpZiB0aGUgc3RhcnQgYW5kIGVuZCBwb2ludHMgYXJlIGJhc2ljYWxseSBvbiB0b3Agb2YgZWFjaCBvdGhlciwgY2xvc2UgdGhlIHNlZ21lbnQgYnkgYWRkaW5nIHRoZSAybmQgcG9pbnQgdG8gdGhlIGVuZCwgYW5kIHRoZSAybmQtdG8tbGFzdCBwb2ludCB0byB0aGUgYmVnaW5uaW5nICh3ZSdsbCByZW1vdmUgdGhlbSBhdCB0aGUgZW5kLCBidXQgdGhpcyBhbGxvd3MgdGhlIGN1cnZhdHVyZSB0byBsb29rIHBlcmZlY3QpXG4gICAgcG9pbnRzLnB1c2gobmV4dFgsIG5leHRZKTtcbiAgICBuZXh0WCA9IHg7XG4gICAgbmV4dFkgPSB5O1xuICAgIHggPSBwb2ludHNbbCAtIDJdO1xuICAgIHkgPSBwb2ludHNbbCAtIDFdO1xuICAgIHBvaW50cy51bnNoaWZ0KHgsIHkpO1xuICAgIGwgKz0gNDtcbiAgfVxuXG4gIGN1cnZpbmVzcyA9IGN1cnZpbmVzcyB8fCBjdXJ2aW5lc3MgPT09IDAgPyArY3VydmluZXNzIDogMTtcblxuICBmb3IgKGkgPSAyOyBpIDwgbDsgaSArPSAyKSB7XG4gICAgcHJldlggPSB4O1xuICAgIHByZXZZID0geTtcbiAgICB4ID0gbmV4dFg7XG4gICAgeSA9IG5leHRZO1xuICAgIG5leHRYID0gK3BvaW50c1tpICsgMl07XG4gICAgbmV4dFkgPSArcG9pbnRzW2kgKyAzXTtcbiAgICBkeDEgPSBkeDI7XG4gICAgZHkxID0gZHkyO1xuICAgIGR4MiA9IG5leHRYIC0geDtcbiAgICBkeTIgPSBuZXh0WSAtIHk7XG4gICAgZHgzID0gbmV4dFggLSBwcmV2WDtcbiAgICBkeTMgPSBuZXh0WSAtIHByZXZZO1xuICAgIGEgPSBkeDEgKiBkeDEgKyBkeTEgKiBkeTE7XG4gICAgYiA9IGR4MiAqIGR4MiArIGR5MiAqIGR5MjtcbiAgICBjID0gZHgzICogZHgzICsgZHkzICogZHkzO1xuICAgIGFuZ2xlID0gTWF0aC5hY29zKChhICsgYiAtIGMpIC8gX3NxcnQoNCAqIGEgKiBiKSk7IC8vYW5nbGUgYmV0d2VlbiB0aGUgMyBwb2ludHNcblxuICAgIGQyID0gYW5nbGUgLyBNYXRoLlBJICogY3VydmluZXNzOyAvL3RlbXBvcmFyeSBwcmVjYWxjdWxhdGlvbiBmb3Igc3BlZWQgKHJldXNpbmcgZDIgdmFyaWFibGUpXG5cbiAgICBkMSA9IF9zcXJ0KGEpICogZDI7IC8vdGhlIHRpZ2h0ZXIgdGhlIGFuZ2xlLCB0aGUgc2hvcnRlciB3ZSBtYWtlIHRoZSBoYW5kbGVzIGluIHByb3BvcnRpb24uXG5cbiAgICBkMiAqPSBfc3FydChiKTtcblxuICAgIGlmICh4ICE9PSBwcmV2WCB8fCB5ICE9PSBwcmV2WSkge1xuICAgICAgaWYgKGFuZ2xlID4gY29ybmVyVGhyZXNob2xkKSB7XG4gICAgICAgIHNsb3BlID0gX2F0YW4yKGR5MywgZHgzKTtcbiAgICAgICAgc2VnbWVudC5wdXNoKF9yb3VuZCh4IC0gX2NvcyhzbG9wZSkgKiBkMSksIC8vZmlyc3QgY29udHJvbCBwb2ludFxuICAgICAgICBfcm91bmQoeSAtIF9zaW4oc2xvcGUpICogZDEpLCBfcm91bmQoeCksIC8vYW5jaG9yXG4gICAgICAgIF9yb3VuZCh5KSwgX3JvdW5kKHggKyBfY29zKHNsb3BlKSAqIGQyKSwgLy9zZWNvbmQgY29udHJvbCBwb2ludFxuICAgICAgICBfcm91bmQoeSArIF9zaW4oc2xvcGUpICogZDIpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNsb3BlID0gX2F0YW4yKGR5MSwgZHgxKTtcbiAgICAgICAgc2VnbWVudC5wdXNoKF9yb3VuZCh4IC0gX2NvcyhzbG9wZSkgKiBkMSksIC8vZmlyc3QgY29udHJvbCBwb2ludFxuICAgICAgICBfcm91bmQoeSAtIF9zaW4oc2xvcGUpICogZDEpKTtcbiAgICAgICAgc2xvcGUgPSBfYXRhbjIoZHkyLCBkeDIpO1xuICAgICAgICBzZWdtZW50LnB1c2goX3JvdW5kKHgpLCAvL2FuY2hvclxuICAgICAgICBfcm91bmQoeSksIF9yb3VuZCh4ICsgX2NvcyhzbG9wZSkgKiBkMiksIC8vc2Vjb25kIGNvbnRyb2wgcG9pbnRcbiAgICAgICAgX3JvdW5kKHkgKyBfc2luKHNsb3BlKSAqIGQyKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2VnbWVudC5wdXNoKF9yb3VuZChuZXh0WCksIF9yb3VuZChuZXh0WSksIF9yb3VuZChuZXh0WCksIF9yb3VuZChuZXh0WSkpO1xuXG4gIGlmIChjbG9zZWQpIHtcbiAgICBzZWdtZW50LnNwbGljZSgwLCA2KTtcbiAgICBzZWdtZW50Lmxlbmd0aCA9IHNlZ21lbnQubGVuZ3RoIC0gNjtcbiAgfVxuXG4gIHJldHVybiBzZWdtZW50O1xufSAvL3JldHVybnMgdGhlIHNxdWFyZWQgZGlzdGFuY2UgYmV0d2VlbiBhbiB4L3kgY29vcmRpbmF0ZSBhbmQgYSBzZWdtZW50IGJldHdlZW4geDEveTEgYW5kIHgyL3kyXG5cbmZ1bmN0aW9uIHBvaW50VG9TZWdEaXN0KHgsIHksIHgxLCB5MSwgeDIsIHkyKSB7XG4gIHZhciBkeCA9IHgyIC0geDEsXG4gICAgICBkeSA9IHkyIC0geTEsXG4gICAgICB0O1xuXG4gIGlmIChkeCB8fCBkeSkge1xuICAgIHQgPSAoKHggLSB4MSkgKiBkeCArICh5IC0geTEpICogZHkpIC8gKGR4ICogZHggKyBkeSAqIGR5KTtcblxuICAgIGlmICh0ID4gMSkge1xuICAgICAgeDEgPSB4MjtcbiAgICAgIHkxID0geTI7XG4gICAgfSBlbHNlIGlmICh0ID4gMCkge1xuICAgICAgeDEgKz0gZHggKiB0O1xuICAgICAgeTEgKz0gZHkgKiB0O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBNYXRoLnBvdyh4IC0geDEsIDIpICsgTWF0aC5wb3coeSAtIHkxLCAyKTtcbn1cblxuZnVuY3Rpb24gc2ltcGxpZnlTdGVwKHBvaW50cywgZmlyc3QsIGxhc3QsIHRvbGVyYW5jZSwgc2ltcGxpZmllZCkge1xuICB2YXIgbWF4U3FEaXN0ID0gdG9sZXJhbmNlLFxuICAgICAgZmlyc3RYID0gcG9pbnRzW2ZpcnN0XSxcbiAgICAgIGZpcnN0WSA9IHBvaW50c1tmaXJzdCArIDFdLFxuICAgICAgbGFzdFggPSBwb2ludHNbbGFzdF0sXG4gICAgICBsYXN0WSA9IHBvaW50c1tsYXN0ICsgMV0sXG4gICAgICBpbmRleCxcbiAgICAgIGksXG4gICAgICBkO1xuXG4gIGZvciAoaSA9IGZpcnN0ICsgMjsgaSA8IGxhc3Q7IGkgKz0gMikge1xuICAgIGQgPSBwb2ludFRvU2VnRGlzdChwb2ludHNbaV0sIHBvaW50c1tpICsgMV0sIGZpcnN0WCwgZmlyc3RZLCBsYXN0WCwgbGFzdFkpO1xuXG4gICAgaWYgKGQgPiBtYXhTcURpc3QpIHtcbiAgICAgIGluZGV4ID0gaTtcbiAgICAgIG1heFNxRGlzdCA9IGQ7XG4gICAgfVxuICB9XG5cbiAgaWYgKG1heFNxRGlzdCA+IHRvbGVyYW5jZSkge1xuICAgIGlmIChpbmRleCAtIGZpcnN0ID4gMikge1xuICAgICAgc2ltcGxpZnlTdGVwKHBvaW50cywgZmlyc3QsIGluZGV4LCB0b2xlcmFuY2UsIHNpbXBsaWZpZWQpO1xuICAgIH1cblxuICAgIHNpbXBsaWZpZWQucHVzaChwb2ludHNbaW5kZXhdLCBwb2ludHNbaW5kZXggKyAxXSk7XG5cbiAgICBpZiAobGFzdCAtIGluZGV4ID4gMikge1xuICAgICAgc2ltcGxpZnlTdGVwKHBvaW50cywgaW5kZXgsIGxhc3QsIHRvbGVyYW5jZSwgc2ltcGxpZmllZCk7XG4gICAgfVxuICB9XG59IC8vcG9pbnRzIGlzIGFuIGFycmF5IG9mIHgveSB2YWx1ZXMgbGlrZSBbeCwgeSwgeCwgeSwgeCwgeV1cblxuXG5leHBvcnQgZnVuY3Rpb24gc2ltcGxpZnlQb2ludHMocG9pbnRzLCB0b2xlcmFuY2UpIHtcbiAgdmFyIHByZXZYID0gcGFyc2VGbG9hdChwb2ludHNbMF0pLFxuICAgICAgcHJldlkgPSBwYXJzZUZsb2F0KHBvaW50c1sxXSksXG4gICAgICB0ZW1wID0gW3ByZXZYLCBwcmV2WV0sXG4gICAgICBsID0gcG9pbnRzLmxlbmd0aCAtIDIsXG4gICAgICBpLFxuICAgICAgeCxcbiAgICAgIHksXG4gICAgICBkeCxcbiAgICAgIGR5LFxuICAgICAgcmVzdWx0LFxuICAgICAgbGFzdDtcbiAgdG9sZXJhbmNlID0gTWF0aC5wb3codG9sZXJhbmNlIHx8IDEsIDIpO1xuXG4gIGZvciAoaSA9IDI7IGkgPCBsOyBpICs9IDIpIHtcbiAgICB4ID0gcGFyc2VGbG9hdChwb2ludHNbaV0pO1xuICAgIHkgPSBwYXJzZUZsb2F0KHBvaW50c1tpICsgMV0pO1xuICAgIGR4ID0gcHJldlggLSB4O1xuICAgIGR5ID0gcHJldlkgLSB5O1xuXG4gICAgaWYgKGR4ICogZHggKyBkeSAqIGR5ID4gdG9sZXJhbmNlKSB7XG4gICAgICB0ZW1wLnB1c2goeCwgeSk7XG4gICAgICBwcmV2WCA9IHg7XG4gICAgICBwcmV2WSA9IHk7XG4gICAgfVxuICB9XG5cbiAgdGVtcC5wdXNoKHBhcnNlRmxvYXQocG9pbnRzW2xdKSwgcGFyc2VGbG9hdChwb2ludHNbbCArIDFdKSk7XG4gIGxhc3QgPSB0ZW1wLmxlbmd0aCAtIDI7XG4gIHJlc3VsdCA9IFt0ZW1wWzBdLCB0ZW1wWzFdXTtcbiAgc2ltcGxpZnlTdGVwKHRlbXAsIDAsIGxhc3QsIHRvbGVyYW5jZSwgcmVzdWx0KTtcbiAgcmVzdWx0LnB1c2godGVtcFtsYXN0XSwgdGVtcFtsYXN0ICsgMV0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBnZXRDbG9zZXN0UHJvZ3Jlc3NPbkJlemllcihpdGVyYXRpb25zLCBweCwgcHksIHN0YXJ0LCBlbmQsIHNsaWNlcywgeDAsIHkwLCB4MSwgeTEsIHgyLCB5MiwgeDMsIHkzKSB7XG4gIHZhciBpbmMgPSAoZW5kIC0gc3RhcnQpIC8gc2xpY2VzLFxuICAgICAgYmVzdCA9IDAsXG4gICAgICB0ID0gc3RhcnQsXG4gICAgICB4LFxuICAgICAgeSxcbiAgICAgIGQsXG4gICAgICBkeCxcbiAgICAgIGR5LFxuICAgICAgaW52O1xuICBfYmVzdERpc3RhbmNlID0gX2xhcmdlTnVtO1xuXG4gIHdoaWxlICh0IDw9IGVuZCkge1xuICAgIGludiA9IDEgLSB0O1xuICAgIHggPSBpbnYgKiBpbnYgKiBpbnYgKiB4MCArIDMgKiBpbnYgKiBpbnYgKiB0ICogeDEgKyAzICogaW52ICogdCAqIHQgKiB4MiArIHQgKiB0ICogdCAqIHgzO1xuICAgIHkgPSBpbnYgKiBpbnYgKiBpbnYgKiB5MCArIDMgKiBpbnYgKiBpbnYgKiB0ICogeTEgKyAzICogaW52ICogdCAqIHQgKiB5MiArIHQgKiB0ICogdCAqIHkzO1xuICAgIGR4ID0geCAtIHB4O1xuICAgIGR5ID0geSAtIHB5O1xuICAgIGQgPSBkeCAqIGR4ICsgZHkgKiBkeTtcblxuICAgIGlmIChkIDwgX2Jlc3REaXN0YW5jZSkge1xuICAgICAgX2Jlc3REaXN0YW5jZSA9IGQ7XG4gICAgICBiZXN0ID0gdDtcbiAgICB9XG5cbiAgICB0ICs9IGluYztcbiAgfVxuXG4gIHJldHVybiBpdGVyYXRpb25zID4gMSA/IGdldENsb3Nlc3RQcm9ncmVzc09uQmV6aWVyKGl0ZXJhdGlvbnMgLSAxLCBweCwgcHksIE1hdGgubWF4KGJlc3QgLSBpbmMsIDApLCBNYXRoLm1pbihiZXN0ICsgaW5jLCAxKSwgc2xpY2VzLCB4MCwgeTAsIHgxLCB5MSwgeDIsIHkyLCB4MywgeTMpIDogYmVzdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENsb3Nlc3REYXRhKHJhd1BhdGgsIHgsIHksIHNsaWNlcykge1xuICAvL3JldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGNsb3Nlc3QgaiwgaSwgYW5kIHQgKGogaXMgdGhlIHNlZ21lbnQgaW5kZXgsIGkgaXMgdGhlIGluZGV4IG9mIHRoZSBwb2ludCBpbiB0aGF0IHNlZ21lbnQsIGFuZCB0IGlzIHRoZSB0aW1lL3Byb2dyZXNzIGFsb25nIHRoYXQgYmV6aWVyKVxuICB2YXIgY2xvc2VzdCA9IHtcbiAgICBqOiAwLFxuICAgIGk6IDAsXG4gICAgdDogMFxuICB9LFxuICAgICAgYmVzdERpc3RhbmNlID0gX2xhcmdlTnVtLFxuICAgICAgaSxcbiAgICAgIGosXG4gICAgICB0LFxuICAgICAgc2VnbWVudDtcblxuICBmb3IgKGogPSAwOyBqIDwgcmF3UGF0aC5sZW5ndGg7IGorKykge1xuICAgIHNlZ21lbnQgPSByYXdQYXRoW2pdO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IHNlZ21lbnQubGVuZ3RoOyBpICs9IDYpIHtcbiAgICAgIHQgPSBnZXRDbG9zZXN0UHJvZ3Jlc3NPbkJlemllcigxLCB4LCB5LCAwLCAxLCBzbGljZXMgfHwgMjAsIHNlZ21lbnRbaV0sIHNlZ21lbnRbaSArIDFdLCBzZWdtZW50W2kgKyAyXSwgc2VnbWVudFtpICsgM10sIHNlZ21lbnRbaSArIDRdLCBzZWdtZW50W2kgKyA1XSwgc2VnbWVudFtpICsgNl0sIHNlZ21lbnRbaSArIDddKTtcblxuICAgICAgaWYgKGJlc3REaXN0YW5jZSA+IF9iZXN0RGlzdGFuY2UpIHtcbiAgICAgICAgYmVzdERpc3RhbmNlID0gX2Jlc3REaXN0YW5jZTtcbiAgICAgICAgY2xvc2VzdC5qID0gajtcbiAgICAgICAgY2xvc2VzdC5pID0gaTtcbiAgICAgICAgY2xvc2VzdC50ID0gdDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gY2xvc2VzdDtcbn0gLy9zdWJkaXZpZGUgYSBTZWdtZW50IGNsb3Nlc3QgdG8gYSBzcGVjaWZpYyB4LHkgY29vcmRpbmF0ZVxuXG5leHBvcnQgZnVuY3Rpb24gc3ViZGl2aWRlU2VnbWVudE5lYXIoeCwgeSwgc2VnbWVudCwgc2xpY2VzLCBpdGVyYXRpb25zKSB7XG4gIHZhciBsID0gc2VnbWVudC5sZW5ndGgsXG4gICAgICBiZXN0RGlzdGFuY2UgPSBfbGFyZ2VOdW0sXG4gICAgICBiZXN0VCA9IDAsXG4gICAgICBiZXN0U2VnbWVudEluZGV4ID0gMCxcbiAgICAgIHQsXG4gICAgICBpO1xuICBzbGljZXMgPSBzbGljZXMgfHwgMjA7XG4gIGl0ZXJhdGlvbnMgPSBpdGVyYXRpb25zIHx8IDM7XG5cbiAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gNikge1xuICAgIHQgPSBnZXRDbG9zZXN0UHJvZ3Jlc3NPbkJlemllcigxLCB4LCB5LCAwLCAxLCBzbGljZXMsIHNlZ21lbnRbaV0sIHNlZ21lbnRbaSArIDFdLCBzZWdtZW50W2kgKyAyXSwgc2VnbWVudFtpICsgM10sIHNlZ21lbnRbaSArIDRdLCBzZWdtZW50W2kgKyA1XSwgc2VnbWVudFtpICsgNl0sIHNlZ21lbnRbaSArIDddKTtcblxuICAgIGlmIChiZXN0RGlzdGFuY2UgPiBfYmVzdERpc3RhbmNlKSB7XG4gICAgICBiZXN0RGlzdGFuY2UgPSBfYmVzdERpc3RhbmNlO1xuICAgICAgYmVzdFQgPSB0O1xuICAgICAgYmVzdFNlZ21lbnRJbmRleCA9IGk7XG4gICAgfVxuICB9XG5cbiAgdCA9IGdldENsb3Nlc3RQcm9ncmVzc09uQmV6aWVyKGl0ZXJhdGlvbnMsIHgsIHksIGJlc3RUIC0gMC4wNSwgYmVzdFQgKyAwLjA1LCBzbGljZXMsIHNlZ21lbnRbYmVzdFNlZ21lbnRJbmRleF0sIHNlZ21lbnRbYmVzdFNlZ21lbnRJbmRleCArIDFdLCBzZWdtZW50W2Jlc3RTZWdtZW50SW5kZXggKyAyXSwgc2VnbWVudFtiZXN0U2VnbWVudEluZGV4ICsgM10sIHNlZ21lbnRbYmVzdFNlZ21lbnRJbmRleCArIDRdLCBzZWdtZW50W2Jlc3RTZWdtZW50SW5kZXggKyA1XSwgc2VnbWVudFtiZXN0U2VnbWVudEluZGV4ICsgNl0sIHNlZ21lbnRbYmVzdFNlZ21lbnRJbmRleCArIDddKTtcbiAgc3ViZGl2aWRlU2VnbWVudChzZWdtZW50LCBiZXN0U2VnbWVudEluZGV4LCB0KTtcbiAgcmV0dXJuIGJlc3RTZWdtZW50SW5kZXggKyA2O1xufVxuLypcblRha2VzIGFueSBvZiB0aGUgZm9sbG93aW5nIGFuZCBjb252ZXJ0cyBpdCB0byBhbiBhbGwgQ3ViaWMgQmV6aWVyIFNWRyBkYXRhIHN0cmluZzpcbi0gQSA8cGF0aD4gZGF0YSBzdHJpbmcgbGlrZSBcIk0wLDAgTDIsNCB2MjAsMTUgSDEwMFwiXG4tIEEgUmF3UGF0aCwgbGlrZSBbW3gsIHksIHgsIHksIHgsIHksIHgsIHldW1t4LCB5LCB4LCB5LCB4LCB5LCB4LCB5XV1cbi0gQSBTZWdtZW50LCBsaWtlIFt4LCB5LCB4LCB5LCB4LCB5LCB4LCB5XVxuXG5Ob3RlOiBhbGwgbnVtYmVycyBhcmUgcm91bmRlZCBkb3duIHRvIHRoZSBjbG9zZXN0IDAuMDAxIHRvIG1pbmltaXplIG1lbW9yeSwgbWF4aW1pemUgc3BlZWQsIGFuZCBhdm9pZCBvZGQgbnVtYmVycyBsaWtlIDFlLTEzXG4qL1xuXG5leHBvcnQgZnVuY3Rpb24gcmF3UGF0aFRvU3RyaW5nKHJhd1BhdGgpIHtcbiAgaWYgKF9pc051bWJlcihyYXdQYXRoWzBdKSkge1xuICAgIC8vaW4gY2FzZSBhIHNlZ21lbnQgaXMgcGFzc2VkIGluIGluc3RlYWRcbiAgICByYXdQYXRoID0gW3Jhd1BhdGhdO1xuICB9XG5cbiAgdmFyIHJlc3VsdCA9IFwiXCIsXG4gICAgICBsID0gcmF3UGF0aC5sZW5ndGgsXG4gICAgICBzbCxcbiAgICAgIHMsXG4gICAgICBpLFxuICAgICAgc2VnbWVudDtcblxuICBmb3IgKHMgPSAwOyBzIDwgbDsgcysrKSB7XG4gICAgc2VnbWVudCA9IHJhd1BhdGhbc107XG4gICAgcmVzdWx0ICs9IFwiTVwiICsgX3JvdW5kKHNlZ21lbnRbMF0pICsgXCIsXCIgKyBfcm91bmQoc2VnbWVudFsxXSkgKyBcIiBDXCI7XG4gICAgc2wgPSBzZWdtZW50Lmxlbmd0aDtcblxuICAgIGZvciAoaSA9IDI7IGkgPCBzbDsgaSsrKSB7XG4gICAgICByZXN1bHQgKz0gX3JvdW5kKHNlZ21lbnRbaSsrXSkgKyBcIixcIiArIF9yb3VuZChzZWdtZW50W2krK10pICsgXCIgXCIgKyBfcm91bmQoc2VnbWVudFtpKytdKSArIFwiLFwiICsgX3JvdW5kKHNlZ21lbnRbaSsrXSkgKyBcIiBcIiArIF9yb3VuZChzZWdtZW50W2krK10pICsgXCIsXCIgKyBfcm91bmQoc2VnbWVudFtpXSkgKyBcIiBcIjtcbiAgICB9XG5cbiAgICBpZiAoc2VnbWVudC5jbG9zZWQpIHtcbiAgICAgIHJlc3VsdCArPSBcInpcIjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuLypcbi8vIHRha2VzIGEgc2VnbWVudCB3aXRoIGNvb3JkaW5hdGVzIFt4LCB5LCB4LCB5LCAuLi5dIGFuZCBjb252ZXJ0cyB0aGUgY29udHJvbCBwb2ludHMgaW50byBhbmdsZXMgYW5kIGxlbmd0aHMgW3gsIHksIGFuZ2xlLCBsZW5ndGgsIGFuZ2xlLCBsZW5ndGgsIHgsIHksIGFuZ2xlLCBsZW5ndGgsIC4uLl0gc28gdGhhdCBpdCBhbmltYXRlcyBtb3JlIGNsZWFubHkgYW5kIGF2b2lkcyBvZGQgYnJlYWtzL2tpbmtzLiBGb3IgZXhhbXBsZSwgaWYgeW91IGFuaW1hdGUgZnJvbSAxIG8nY2xvY2sgdG8gNiBvJ2Nsb2NrLCBpdCdkIGp1c3QgZ28gZGlyZWN0bHkvbGluZWFybHkgcmF0aGVyIHRoYW4gYXJvdW5kLiBTbyB0aGUgbGVuZ3RoIHdvdWxkIGJlIHZlcnkgc2hvcnQgaW4gdGhlIG1pZGRsZSBvZiB0aGUgdHdlZW4uXG5leHBvcnQgZnVuY3Rpb24gY3BDb29yZHNUb0FuZ2xlcyhzZWdtZW50LCBjb3B5KSB7XG5cdHZhciByZXN1bHQgPSBjb3B5ID8gc2VnbWVudC5zbGljZSgwKSA6IHNlZ21lbnQsXG5cdFx0eCwgeSwgaTtcblx0Zm9yIChpID0gMDsgaSA8IHNlZ21lbnQubGVuZ3RoOyBpKz02KSB7XG5cdFx0eCA9IHNlZ21lbnRbaSsyXSAtIHNlZ21lbnRbaV07XG5cdFx0eSA9IHNlZ21lbnRbaSszXSAtIHNlZ21lbnRbaSsxXTtcblx0XHRyZXN1bHRbaSsyXSA9IE1hdGguYXRhbjIoeSwgeCk7XG5cdFx0cmVzdWx0W2krM10gPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XG5cdFx0eCA9IHNlZ21lbnRbaSs2XSAtIHNlZ21lbnRbaSs0XTtcblx0XHR5ID0gc2VnbWVudFtpKzddIC0gc2VnbWVudFtpKzVdO1xuXHRcdHJlc3VsdFtpKzRdID0gTWF0aC5hdGFuMih5LCB4KTtcblx0XHRyZXN1bHRbaSs1XSA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG4vLyB0YWtlcyBhIHNlZ21lbnQgdGhhdCB3YXMgY29udmVydGVkIHdpdGggY3BDb29yZHNUb0FuZ2xlcygpIHRvIGhhdmUgYW5nbGVzIGFuZCBsZW5ndGhzIGluc3RlYWQgb2YgY29vcmRpbmF0ZXMgZm9yIHRoZSBjb250cm9sIHBvaW50cywgYW5kIGNvbnZlcnRzIGl0IEJBQ0sgaW50byBjb29yZGluYXRlcy5cbmV4cG9ydCBmdW5jdGlvbiBjcEFuZ2xlc1RvQ29vcmRzKHNlZ21lbnQsIGNvcHkpIHtcblx0dmFyIHJlc3VsdCA9IGNvcHkgPyBzZWdtZW50LnNsaWNlKDApIDogc2VnbWVudCxcblx0XHRsZW5ndGggPSBzZWdtZW50Lmxlbmd0aCxcblx0XHRybmQgPSAxMDAwLFxuXHRcdGFuZ2xlLCBsLCBpLCBqO1xuXHRmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKz02KSB7XG5cdFx0YW5nbGUgPSBzZWdtZW50W2krMl07XG5cdFx0bCA9IHNlZ21lbnRbaSszXTsgLy9sZW5ndGhcblx0XHRyZXN1bHRbaSsyXSA9ICgoKHNlZ21lbnRbaV0gKyBNYXRoLmNvcyhhbmdsZSkgKiBsKSAqIHJuZCkgfCAwKSAvIHJuZDtcblx0XHRyZXN1bHRbaSszXSA9ICgoKHNlZ21lbnRbaSsxXSArIE1hdGguc2luKGFuZ2xlKSAqIGwpICogcm5kKSB8IDApIC8gcm5kO1xuXHRcdGFuZ2xlID0gc2VnbWVudFtpKzRdO1xuXHRcdGwgPSBzZWdtZW50W2krNV07IC8vbGVuZ3RoXG5cdFx0cmVzdWx0W2krNF0gPSAoKChzZWdtZW50W2krNl0gLSBNYXRoLmNvcyhhbmdsZSkgKiBsKSAqIHJuZCkgfCAwKSAvIHJuZDtcblx0XHRyZXN1bHRbaSs1XSA9ICgoKHNlZ21lbnRbaSs3XSAtIE1hdGguc2luKGFuZ2xlKSAqIGwpICogcm5kKSB8IDApIC8gcm5kO1xuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59XG5cbi8vYWRkcyBhbiBcImlzU21vb3RoXCIgYXJyYXkgdG8gZWFjaCBzZWdtZW50IGFuZCBwb3B1bGF0ZXMgaXQgd2l0aCBhIGJvb2xlYW4gdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIG9yIG5vdCBpdCdzIHNtb290aCAodGhlIGNvbnRyb2wgcG9pbnRzIGhhdmUgYmFzaWNhbGx5IHRoZSBzYW1lIHNsb3BlKS4gRm9yIGFueSBzbW9vdGggY29udHJvbCBwb2ludHMsIGl0IGNvbnZlcnRzIHRoZSBjb29yZGluYXRlcyBpbnRvIGFuZ2xlICh4LCBpbiByYWRpYW5zKSBhbmQgbGVuZ3RoICh5KSBhbmQgcHV0cyB0aGVtIGludG8gdGhlIHNhbWUgaW5kZXggdmFsdWUgaW4gYSBzbW9vdGhEYXRhIGFycmF5LlxuZXhwb3J0IGZ1bmN0aW9uIHBvcHVsYXRlU21vb3RoRGF0YShyYXdQYXRoKSB7XG5cdGxldCBqID0gcmF3UGF0aC5sZW5ndGgsXG5cdFx0c21vb3RoLCBzZWdtZW50LCB4LCB5LCB4MiwgeTIsIGksIGwsIGEsIGEyLCBpc1Ntb290aCwgc21vb3RoRGF0YTtcblx0d2hpbGUgKC0taiA+IC0xKSB7XG5cdFx0c2VnbWVudCA9IHJhd1BhdGhbal07XG5cdFx0aXNTbW9vdGggPSBzZWdtZW50LmlzU21vb3RoID0gc2VnbWVudC5pc1Ntb290aCB8fCBbMCwgMCwgMCwgMF07XG5cdFx0c21vb3RoRGF0YSA9IHNlZ21lbnQuc21vb3RoRGF0YSA9IHNlZ21lbnQuc21vb3RoRGF0YSB8fCBbMCwgMCwgMCwgMF07XG5cdFx0aXNTbW9vdGgubGVuZ3RoID0gNDtcblx0XHRsID0gc2VnbWVudC5sZW5ndGggLSAyO1xuXHRcdGZvciAoaSA9IDY7IGkgPCBsOyBpICs9IDYpIHtcblx0XHRcdHggPSBzZWdtZW50W2ldIC0gc2VnbWVudFtpIC0gMl07XG5cdFx0XHR5ID0gc2VnbWVudFtpICsgMV0gLSBzZWdtZW50W2kgLSAxXTtcblx0XHRcdHgyID0gc2VnbWVudFtpICsgMl0gLSBzZWdtZW50W2ldO1xuXHRcdFx0eTIgPSBzZWdtZW50W2kgKyAzXSAtIHNlZ21lbnRbaSArIDFdO1xuXHRcdFx0YSA9IF9hdGFuMih5LCB4KTtcblx0XHRcdGEyID0gX2F0YW4yKHkyLCB4Mik7XG5cdFx0XHRzbW9vdGggPSAoTWF0aC5hYnMoYSAtIGEyKSA8IDAuMDkpO1xuXHRcdFx0aWYgKHNtb290aCkge1xuXHRcdFx0XHRzbW9vdGhEYXRhW2kgLSAyXSA9IGE7XG5cdFx0XHRcdHNtb290aERhdGFbaSArIDJdID0gYTI7XG5cdFx0XHRcdHNtb290aERhdGFbaSAtIDFdID0gX3NxcnQoeCAqIHggKyB5ICogeSk7XG5cdFx0XHRcdHNtb290aERhdGFbaSArIDNdID0gX3NxcnQoeDIgKiB4MiArIHkyICogeTIpO1xuXHRcdFx0fVxuXHRcdFx0aXNTbW9vdGgucHVzaChzbW9vdGgsIHNtb290aCwgMCwgMCwgc21vb3RoLCBzbW9vdGgpO1xuXHRcdH1cblx0XHQvL2lmIHRoZSBmaXJzdCBhbmQgbGFzdCBwb2ludHMgYXJlIGlkZW50aWNhbCwgY2hlY2sgdG8gc2VlIGlmIHRoZXJlJ3MgYSBzbW9vdGggdHJhbnNpdGlvbi4gV2UgbXVzdCBoYW5kbGUgdGhpcyBhIGJpdCBkaWZmZXJlbnRseSBkdWUgdG8gdGhlaXIgcG9zaXRpb25zIGluIHRoZSBhcnJheS5cblx0XHRpZiAoc2VnbWVudFtsXSA9PT0gc2VnbWVudFswXSAmJiBzZWdtZW50W2wrMV0gPT09IHNlZ21lbnRbMV0pIHtcblx0XHRcdHggPSBzZWdtZW50WzBdIC0gc2VnbWVudFtsLTJdO1xuXHRcdFx0eSA9IHNlZ21lbnRbMV0gLSBzZWdtZW50W2wtMV07XG5cdFx0XHR4MiA9IHNlZ21lbnRbMl0gLSBzZWdtZW50WzBdO1xuXHRcdFx0eTIgPSBzZWdtZW50WzNdIC0gc2VnbWVudFsxXTtcblx0XHRcdGEgPSBfYXRhbjIoeSwgeCk7XG5cdFx0XHRhMiA9IF9hdGFuMih5MiwgeDIpO1xuXHRcdFx0aWYgKE1hdGguYWJzKGEgLSBhMikgPCAwLjA5KSB7XG5cdFx0XHRcdHNtb290aERhdGFbbC0yXSA9IGE7XG5cdFx0XHRcdHNtb290aERhdGFbMl0gPSBhMjtcblx0XHRcdFx0c21vb3RoRGF0YVtsLTFdID0gX3NxcnQoeCAqIHggKyB5ICogeSk7XG5cdFx0XHRcdHNtb290aERhdGFbM10gPSBfc3FydCh4MiAqIHgyICsgeTIgKiB5Mik7XG5cdFx0XHRcdGlzU21vb3RoW2wtMl0gPSBpc1Ntb290aFtsLTFdID0gdHJ1ZTsgLy9kb24ndCBjaGFuZ2UgaW5kZXhlcyAyIGFuZCAzIGJlY2F1c2Ugd2UnbGwgdHJpZ2dlciBldmVyeXRoaW5nIGZyb20gdGhlIEVORCwgYW5kIHRoaXMgd2lsbCBvcHRpbWl6ZSBmaWxlIHNpemUgYSBiaXQuXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiByYXdQYXRoO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBvaW50VG9TY3JlZW4oc3ZnRWxlbWVudCwgcG9pbnQpIHtcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7IC8vYnkgZGVmYXVsdCwgdGFrZSB0aGUgZmlyc3Qgc2V0IG9mIGNvb3JkaW5hdGVzIGluIHRoZSBwYXRoIGFzIHRoZSBwb2ludFxuXHRcdGxldCByYXdQYXRoID0gZ2V0UmF3UGF0aChzdmdFbGVtZW50KTtcblx0XHRwb2ludCA9IHN2Z0VsZW1lbnQub3duZXJTVkdFbGVtZW50LmNyZWF0ZVNWR1BvaW50KCk7XG5cdFx0cG9pbnQueCA9IHJhd1BhdGhbMF1bMF07XG5cdFx0cG9pbnQueSA9IHJhd1BhdGhbMF1bMV07XG5cdH1cblx0cmV0dXJuIHBvaW50Lm1hdHJpeFRyYW5zZm9ybShzdmdFbGVtZW50LmdldFNjcmVlbkNUTSgpKTtcbn1cblxuKi8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDaFlBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QSIsInNvdXJjZVJvb3QiOiIifQ==