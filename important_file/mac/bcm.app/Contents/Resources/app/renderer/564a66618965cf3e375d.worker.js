/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./node_modules/@cmao/codemao-ai/dist/es6/ai_logics/classify_ai/classify_controller/worker.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@cmao/codemao-ai/dist/es6/ai_logics/classify_ai/classify_controller/worker.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/@cmao/codemao-ai/dist/es6/ai_logics/classify_ai/classify_controller/worker.js ***!
  \****************************************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var convnetjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! convnetjs */ "./node_modules/convnetjs/build/convnet.js");
/* harmony import */ var convnetjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(convnetjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _defs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../defs */ "./node_modules/@cmao/codemao-ai/dist/es6/ai_logics/defs.js");


var ctx = self;
var sendMessage = self.postMessage;
ctx.addEventListener('message', function (message) {
    var receive_data = JSON.parse(message.data);
    var type = receive_data.type;
    var send_data = {};
    switch (type) {
        case 'train':
            var train_net = new convnetjs__WEBPACK_IMPORTED_MODULE_0__["Net"]();
            train_net.fromJSON(receive_data.model);
            var input_array = receive_data.input;
            var output_array = receive_data.output;
            var train_max = receive_data.max;
            var train_min_1 = receive_data.min;
            var train_length_1 = [];
            train_max.forEach(function (item, index) {
                train_length_1[index] = item - train_min_1[index];
            });
            var dimension = input_array.length;
            var x = new convnetjs__WEBPACK_IMPORTED_MODULE_0__["Vol"](1, 1, dimension);
            var trainer = new convnetjs__WEBPACK_IMPORTED_MODULE_0__["Trainer"](train_net, { method: 'adagrad', l2_decay: 0.001, l1_decay: 0.001, batch_size: 20 });
            for (var loop_time = 0; loop_time < 20; loop_time++) {
                for (var i = 0; i < input_array.length; i++) {
                    var train_data = [];
                    for (var j = 0; j < input_array[i].length; j++) {
                        if (train_length_1[j] != 0) {
                            train_data[j] = (input_array[i][j] - train_min_1[j]) / train_length_1[j] * 10 - 5;
                        }
                        else {
                            train_data[j] = input_array[i][j];
                        }
                    }
                    x.w = train_data;
                    trainer.train(x, output_array[i]);
                }
            }
            send_data['net'] = train_net.toJSON();
            send_data['type'] = 'train';
            send_data['id'] = receive_data.id;
            sendMessage(send_data);
            break;
        case 'draw':
            var draw_net = new convnetjs__WEBPACK_IMPORTED_MODULE_0__["Net"]();
            draw_net.fromJSON(receive_data.model);
            var step = (_defs__WEBPACK_IMPORTED_MODULE_1__["RANGE_TRAINING_DATA"][1] - _defs__WEBPACK_IMPORTED_MODULE_1__["RANGE_TRAINING_DATA"][0]) / _defs__WEBPACK_IMPORTED_MODULE_1__["SIZE_PREVIEW_DIAGRAM"];
            var draw_data = [];
            var num_line = 0;
            for (var dx = _defs__WEBPACK_IMPORTED_MODULE_1__["RANGE_TRAINING_DATA"][0]; dx < _defs__WEBPACK_IMPORTED_MODULE_1__["RANGE_TRAINING_DATA"][1]; dx = Number((dx + step).toFixed(1))) {
                draw_data[num_line] = [];
                var _loop_1 = function (dy) {
                    var test_node = new convnetjs__WEBPACK_IMPORTED_MODULE_0__["Vol"]([dx, dy]);
                    var scores = draw_net.forward(test_node);
                    var main_class = 0;
                    var benchmark = 1 / scores.w.length;
                    var density = benchmark;
                    if (receive_data.is_simple_mode) {
                        density = 0.8;
                    }
                    else {
                        scores.w.forEach(function (weight, class_index) {
                            if (weight > benchmark) {
                                main_class = class_index;
                                density = weight;
                            }
                        });
                        density = (density - benchmark) / (1 - benchmark);
                    }
                    draw_data[num_line].unshift({
                        class_index: main_class,
                        density: density,
                    });
                };
                for (var dy = _defs__WEBPACK_IMPORTED_MODULE_1__["RANGE_TRAINING_DATA"][0]; dy < _defs__WEBPACK_IMPORTED_MODULE_1__["RANGE_TRAINING_DATA"][1]; dy = Number((dy + step).toFixed(1))) {
                    _loop_1(dy);
                }
                num_line++;
            }
            send_data['output_data'] = draw_data;
            send_data['type'] = 'draw';
            send_data['id'] = receive_data.id;
            sendMessage(send_data);
            break;
    }
});


/***/ }),

/***/ "./node_modules/@cmao/codemao-ai/dist/es6/ai_logics/defs.js":
/*!******************************************************************!*\
  !*** ./node_modules/@cmao/codemao-ai/dist/es6/ai_logics/defs.js ***!
  \******************************************************************/
/*! exports provided: RANGE_TRAINING_DATA, RANGE_NUM_NEURONS, SIZE_PREVIEW_DIAGRAM, WIDTH_PREVIEW_DIAGRAM, DEFAULT_LAYER_INFO */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RANGE_TRAINING_DATA", function() { return RANGE_TRAINING_DATA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RANGE_NUM_NEURONS", function() { return RANGE_NUM_NEURONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SIZE_PREVIEW_DIAGRAM", function() { return SIZE_PREVIEW_DIAGRAM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WIDTH_PREVIEW_DIAGRAM", function() { return WIDTH_PREVIEW_DIAGRAM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_LAYER_INFO", function() { return DEFAULT_LAYER_INFO; });
var RANGE_TRAINING_DATA = [-5, 5];
var RANGE_NUM_NEURONS = [1, 5];
var SIZE_PREVIEW_DIAGRAM = 50;
var WIDTH_PREVIEW_DIAGRAM = 250;
var DEFAULT_LAYER_INFO = {
    input: 2,
    hiddens: [4, 4],
    output: 2,
};


/***/ }),

/***/ "./node_modules/convnetjs/build/convnet.js":
/*!*************************************************!*\
  !*** ./node_modules/convnetjs/build/convnet.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var convnetjs = convnetjs || { REVISION: 'ALPHA' };
(function(global) {
  "use strict";

  // Random number utilities
  var return_v = false;
  var v_val = 0.0;
  var gaussRandom = function() {
    if(return_v) { 
      return_v = false;
      return v_val; 
    }
    var u = 2*Math.random()-1;
    var v = 2*Math.random()-1;
    var r = u*u + v*v;
    if(r == 0 || r > 1) return gaussRandom();
    var c = Math.sqrt(-2*Math.log(r)/r);
    v_val = v*c; // cache this
    return_v = true;
    return u*c;
  }
  var randf = function(a, b) { return Math.random()*(b-a)+a; }
  var randi = function(a, b) { return Math.floor(Math.random()*(b-a)+a); }
  var randn = function(mu, std){ return mu+gaussRandom()*std; }

  // Array utilities
  var zeros = function(n) {
    if(typeof(n)==='undefined' || isNaN(n)) { return []; }
    if(typeof ArrayBuffer === 'undefined') {
      // lacking browser support
      var arr = new Array(n);
      for(var i=0;i<n;i++) { arr[i]= 0; }
      return arr;
    } else {
      return new Float64Array(n);
    }
  }

  var arrContains = function(arr, elt) {
    for(var i=0,n=arr.length;i<n;i++) {
      if(arr[i]===elt) return true;
    }
    return false;
  }

  var arrUnique = function(arr) {
    var b = [];
    for(var i=0,n=arr.length;i<n;i++) {
      if(!arrContains(b, arr[i])) {
        b.push(arr[i]);
      }
    }
    return b;
  }

  // return max and min of a given non-empty array.
  var maxmin = function(w) {
    if(w.length === 0) { return {}; } // ... ;s
    var maxv = w[0];
    var minv = w[0];
    var maxi = 0;
    var mini = 0;
    var n = w.length;
    for(var i=1;i<n;i++) {
      if(w[i] > maxv) { maxv = w[i]; maxi = i; } 
      if(w[i] < minv) { minv = w[i]; mini = i; } 
    }
    return {maxi: maxi, maxv: maxv, mini: mini, minv: minv, dv:maxv-minv};
  }

  // create random permutation of numbers, in range [0...n-1]
  var randperm = function(n) {
    var i = n,
        j = 0,
        temp;
    var array = [];
    for(var q=0;q<n;q++)array[q]=q;
    while (i--) {
        j = Math.floor(Math.random() * (i+1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
  }

  // sample from list lst according to probabilities in list probs
  // the two lists are of same size, and probs adds up to 1
  var weightedSample = function(lst, probs) {
    var p = randf(0, 1.0);
    var cumprob = 0.0;
    for(var k=0,n=lst.length;k<n;k++) {
      cumprob += probs[k];
      if(p < cumprob) { return lst[k]; }
    }
  }

  // syntactic sugar function for getting default parameter values
  var getopt = function(opt, field_name, default_value) {
    return typeof opt[field_name] !== 'undefined' ? opt[field_name] : default_value;
  }

  global.randf = randf;
  global.randi = randi;
  global.randn = randn;
  global.zeros = zeros;
  global.maxmin = maxmin;
  global.randperm = randperm;
  global.weightedSample = weightedSample;
  global.arrUnique = arrUnique;
  global.arrContains = arrContains;
  global.getopt = getopt;
  
})(convnetjs);
(function(global) {
  "use strict";

  // Vol is the basic building block of all data in a net.
  // it is essentially just a 3D volume of numbers, with a
  // width (sx), height (sy), and depth (depth).
  // it is used to hold data for all filters, all volumes,
  // all weights, and also stores all gradients w.r.t. 
  // the data. c is optionally a value to initialize the volume
  // with. If c is missing, fills the Vol with random numbers.
  var Vol = function(sx, sy, depth, c) {
    // this is how you check if a variable is an array. Oh, Javascript :)
    if(Object.prototype.toString.call(sx) === '[object Array]') {
      // we were given a list in sx, assume 1D volume and fill it up
      this.sx = 1;
      this.sy = 1;
      this.depth = sx.length;
      // we have to do the following copy because we want to use
      // fast typed arrays, not an ordinary javascript array
      this.w = global.zeros(this.depth);
      this.dw = global.zeros(this.depth);
      for(var i=0;i<this.depth;i++) {
        this.w[i] = sx[i];
      }
    } else {
      // we were given dimensions of the vol
      this.sx = sx;
      this.sy = sy;
      this.depth = depth;
      var n = sx*sy*depth;
      this.w = global.zeros(n);
      this.dw = global.zeros(n);
      if(typeof c === 'undefined') {
        // weight normalization is done to equalize the output
        // variance of every neuron, otherwise neurons with a lot
        // of incoming connections have outputs of larger variance
        var scale = Math.sqrt(1.0/(sx*sy*depth));
        for(var i=0;i<n;i++) { 
          this.w[i] = global.randn(0.0, scale);
        }
      } else {
        for(var i=0;i<n;i++) { 
          this.w[i] = c;
        }
      }
    }
  }

  Vol.prototype = {
    get: function(x, y, d) { 
      var ix=((this.sx * y)+x)*this.depth+d;
      return this.w[ix];
    },
    set: function(x, y, d, v) { 
      var ix=((this.sx * y)+x)*this.depth+d;
      this.w[ix] = v; 
    },
    add: function(x, y, d, v) { 
      var ix=((this.sx * y)+x)*this.depth+d;
      this.w[ix] += v; 
    },
    get_grad: function(x, y, d) { 
      var ix = ((this.sx * y)+x)*this.depth+d;
      return this.dw[ix]; 
    },
    set_grad: function(x, y, d, v) { 
      var ix = ((this.sx * y)+x)*this.depth+d;
      this.dw[ix] = v; 
    },
    add_grad: function(x, y, d, v) { 
      var ix = ((this.sx * y)+x)*this.depth+d;
      this.dw[ix] += v; 
    },
    cloneAndZero: function() { return new Vol(this.sx, this.sy, this.depth, 0.0)},
    clone: function() {
      var V = new Vol(this.sx, this.sy, this.depth, 0.0);
      var n = this.w.length;
      for(var i=0;i<n;i++) { V.w[i] = this.w[i]; }
      return V;
    },
    addFrom: function(V) { for(var k=0;k<this.w.length;k++) { this.w[k] += V.w[k]; }},
    addFromScaled: function(V, a) { for(var k=0;k<this.w.length;k++) { this.w[k] += a*V.w[k]; }},
    setConst: function(a) { for(var k=0;k<this.w.length;k++) { this.w[k] = a; }},

    toJSON: function() {
      // todo: we may want to only save d most significant digits to save space
      var json = {}
      json.sx = this.sx; 
      json.sy = this.sy;
      json.depth = this.depth;
      json.w = this.w;
      return json;
      // we wont back up gradients to save space
    },
    fromJSON: function(json) {
      this.sx = json.sx;
      this.sy = json.sy;
      this.depth = json.depth;

      var n = this.sx*this.sy*this.depth;
      this.w = global.zeros(n);
      this.dw = global.zeros(n);
      // copy over the elements.
      for(var i=0;i<n;i++) {
        this.w[i] = json.w[i];
      }
    }
  }

  global.Vol = Vol;
})(convnetjs);
(function(global) {
  "use strict";
  var Vol = global.Vol; // convenience

  // Volume utilities
  // intended for use with data augmentation
  // crop is the size of output
  // dx,dy are offset wrt incoming volume, of the shift
  // fliplr is boolean on whether we also want to flip left<->right
  var augment = function(V, crop, dx, dy, fliplr) {
    // note assumes square outputs of size crop x crop
    if(typeof(fliplr)==='undefined') var fliplr = false;
    if(typeof(dx)==='undefined') var dx = global.randi(0, V.sx - crop);
    if(typeof(dy)==='undefined') var dy = global.randi(0, V.sy - crop);
    
    // randomly sample a crop in the input volume
    var W;
    if(crop !== V.sx || dx!==0 || dy!==0) {
      W = new Vol(crop, crop, V.depth, 0.0);
      for(var x=0;x<crop;x++) {
        for(var y=0;y<crop;y++) {
          if(x+dx<0 || x+dx>=V.sx || y+dy<0 || y+dy>=V.sy) continue; // oob
          for(var d=0;d<V.depth;d++) {
           W.set(x,y,d,V.get(x+dx,y+dy,d)); // copy data over
          }
        }
      }
    } else {
      W = V;
    }

    if(fliplr) {
      // flip volume horziontally
      var W2 = W.cloneAndZero();
      for(var x=0;x<W.sx;x++) {
        for(var y=0;y<W.sy;y++) {
          for(var d=0;d<W.depth;d++) {
           W2.set(x,y,d,W.get(W.sx - x - 1,y,d)); // copy data over
          }
        }
      }
      W = W2; //swap
    }
    return W;
  }

  // img is a DOM element that contains a loaded image
  // returns a Vol of size (W, H, 4). 4 is for RGBA
  var img_to_vol = function(img, convert_grayscale) {

    if(typeof(convert_grayscale)==='undefined') var convert_grayscale = false;

    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");

    // due to a Firefox bug
    try {
      ctx.drawImage(img, 0, 0);
    } catch (e) {
      if (e.name === "NS_ERROR_NOT_AVAILABLE") {
        // sometimes happens, lets just abort
        return false;
      } else {
        throw e;
      }
    }

    try {
      var img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } catch (e) {
      if(e.name === 'IndexSizeError') {
        return false; // not sure what causes this sometimes but okay abort
      } else {
        throw e;
      }
    }

    // prepare the input: get pixels and normalize them
    var p = img_data.data;
    var W = img.width;
    var H = img.height;
    var pv = []
    for(var i=0;i<p.length;i++) {
      pv.push(p[i]/255.0-0.5); // normalize image pixels to [-0.5, 0.5]
    }
    var x = new Vol(W, H, 4, 0.0); //input volume (image)
    x.w = pv;

    if(convert_grayscale) {
      // flatten into depth=1 array
      var x1 = new Vol(W, H, 1, 0.0);
      for(var i=0;i<W;i++) {
        for(var j=0;j<H;j++) {
          x1.set(i,j,0,x.get(i,j,0));
        }
      }
      x = x1;
    }

    return x;
  }
  
  global.augment = augment;
  global.img_to_vol = img_to_vol;

})(convnetjs);
(function(global) {
  "use strict";
  var Vol = global.Vol; // convenience

  // This file contains all layers that do dot products with input,
  // but usually in a different connectivity pattern and weight sharing
  // schemes: 
  // - FullyConn is fully connected dot products 
  // - ConvLayer does convolutions (so weight sharing spatially)
  // putting them together in one file because they are very similar
  var ConvLayer = function(opt) {
    var opt = opt || {};

    // required
    this.out_depth = opt.filters;
    this.sx = opt.sx; // filter size. Should be odd if possible, it's cleaner.
    this.in_depth = opt.in_depth;
    this.in_sx = opt.in_sx;
    this.in_sy = opt.in_sy;
    
    // optional
    this.sy = typeof opt.sy !== 'undefined' ? opt.sy : this.sx;
    this.stride = typeof opt.stride !== 'undefined' ? opt.stride : 1; // stride at which we apply filters to input volume
    this.pad = typeof opt.pad !== 'undefined' ? opt.pad : 0; // amount of 0 padding to add around borders of input volume
    this.l1_decay_mul = typeof opt.l1_decay_mul !== 'undefined' ? opt.l1_decay_mul : 0.0;
    this.l2_decay_mul = typeof opt.l2_decay_mul !== 'undefined' ? opt.l2_decay_mul : 1.0;

    // computed
    // note we are doing floor, so if the strided convolution of the filter doesnt fit into the input
    // volume exactly, the output volume will be trimmed and not contain the (incomplete) computed
    // final application.
    this.out_sx = Math.floor((this.in_sx + this.pad * 2 - this.sx) / this.stride + 1);
    this.out_sy = Math.floor((this.in_sy + this.pad * 2 - this.sy) / this.stride + 1);
    this.layer_type = 'conv';

    // initializations
    var bias = typeof opt.bias_pref !== 'undefined' ? opt.bias_pref : 0.0;
    this.filters = [];
    for(var i=0;i<this.out_depth;i++) { this.filters.push(new Vol(this.sx, this.sy, this.in_depth)); }
    this.biases = new Vol(1, 1, this.out_depth, bias);
  }
  ConvLayer.prototype = {
    forward: function(V, is_training) {
      this.in_act = V;

      var A = new Vol(this.out_sx, this.out_sy, this.out_depth, 0.0);
      for(var d=0;d<this.out_depth;d++) {
        var f = this.filters[d];
        var x = -this.pad;
        var y = -this.pad;
        for(var ax=0; ax<this.out_sx; x+=this.stride,ax++) {
          y = -this.pad;
          for(var ay=0; ay<this.out_sy; y+=this.stride,ay++) {

            // convolve centered at this particular location
            // could be bit more efficient, going for correctness first
            var a = 0.0;
            for(var fx=0;fx<f.sx;fx++) {
              for(var fy=0;fy<f.sy;fy++) {
                for(var fd=0;fd<f.depth;fd++) {
                  var oy = y+fy; // coordinates in the original input array coordinates
                  var ox = x+fx;
                  if(oy>=0 && oy<V.sy && ox>=0 && ox<V.sx) {
                    //a += f.get(fx, fy, fd) * V.get(ox, oy, fd);
                    // avoid function call overhead for efficiency, compromise modularity :(
                    a += f.w[((f.sx * fy)+fx)*f.depth+fd] * V.w[((V.sx * oy)+ox)*V.depth+fd];
                  }
                }
              }
            }
            a += this.biases.w[d];
            A.set(ax, ay, d, a);
          }
        }
      }
      this.out_act = A;
      return this.out_act;
    },
    backward: function() { 

      // compute gradient wrt weights, biases and input data
      var V = this.in_act;
      V.dw = global.zeros(V.w.length); // zero out gradient wrt bottom data, we're about to fill it
      for(var d=0;d<this.out_depth;d++) {
        var f = this.filters[d];
        var x = -this.pad;
        var y = -this.pad;
        for(var ax=0; ax<this.out_sx; x+=this.stride,ax++) {
          y = -this.pad;
          for(var ay=0; ay<this.out_sy; y+=this.stride,ay++) {
            // convolve and add up the gradients. 
            // could be more efficient, going for correctness first
            var chain_grad = this.out_act.get_grad(ax,ay,d); // gradient from above, from chain rule
            for(var fx=0;fx<f.sx;fx++) {
              for(var fy=0;fy<f.sy;fy++) {
                for(var fd=0;fd<f.depth;fd++) {
                  var oy = y+fy;
                  var ox = x+fx;
                  if(oy>=0 && oy<V.sy && ox>=0 && ox<V.sx) {
                    // forward prop calculated: a += f.get(fx, fy, fd) * V.get(ox, oy, fd);
                    //f.add_grad(fx, fy, fd, V.get(ox, oy, fd) * chain_grad);
                    //V.add_grad(ox, oy, fd, f.get(fx, fy, fd) * chain_grad);

                    // avoid function call overhead and use Vols directly for efficiency
                    var ix1 = ((V.sx * oy)+ox)*V.depth+fd;
                    var ix2 = ((f.sx * fy)+fx)*f.depth+fd;
                    f.dw[ix2] += V.w[ix1]*chain_grad;
                    V.dw[ix1] += f.w[ix2]*chain_grad;
                  }
                }
              }
            }
            this.biases.dw[d] += chain_grad;
          }
        }
      }
    },
    getParamsAndGrads: function() {
      var response = [];
      for(var i=0;i<this.out_depth;i++) {
        response.push({params: this.filters[i].w, grads: this.filters[i].dw, l2_decay_mul: this.l2_decay_mul, l1_decay_mul: this.l1_decay_mul});
      }
      response.push({params: this.biases.w, grads: this.biases.dw, l1_decay_mul: 0.0, l2_decay_mul: 0.0});
      return response;
    },
    toJSON: function() {
      var json = {};
      json.sx = this.sx; // filter size in x, y dims
      json.sy = this.sy;
      json.stride = this.stride;
      json.in_depth = this.in_depth;
      json.out_depth = this.out_depth;
      json.out_sx = this.out_sx;
      json.out_sy = this.out_sy;
      json.layer_type = this.layer_type;
      json.l1_decay_mul = this.l1_decay_mul;
      json.l2_decay_mul = this.l2_decay_mul;
      json.pad = this.pad;
      json.filters = [];
      for(var i=0;i<this.filters.length;i++) {
        json.filters.push(this.filters[i].toJSON());
      }
      json.biases = this.biases.toJSON();
      return json;
    },
    fromJSON: function(json) {
      this.out_depth = json.out_depth;
      this.out_sx = json.out_sx;
      this.out_sy = json.out_sy;
      this.layer_type = json.layer_type;
      this.sx = json.sx; // filter size in x, y dims
      this.sy = json.sy;
      this.stride = json.stride;
      this.in_depth = json.in_depth; // depth of input volume
      this.filters = [];
      this.l1_decay_mul = typeof json.l1_decay_mul !== 'undefined' ? json.l1_decay_mul : 1.0;
      this.l2_decay_mul = typeof json.l2_decay_mul !== 'undefined' ? json.l2_decay_mul : 1.0;
      this.pad = typeof json.pad !== 'undefined' ? json.pad : 0;
      for(var i=0;i<json.filters.length;i++) {
        var v = new Vol(0,0,0,0);
        v.fromJSON(json.filters[i]);
        this.filters.push(v);
      }
      this.biases = new Vol(0,0,0,0);
      this.biases.fromJSON(json.biases);
    }
  }

  var FullyConnLayer = function(opt) {
    var opt = opt || {};

    // required
    // ok fine we will allow 'filters' as the word as well
    this.out_depth = typeof opt.num_neurons !== 'undefined' ? opt.num_neurons : opt.filters;

    // optional 
    this.l1_decay_mul = typeof opt.l1_decay_mul !== 'undefined' ? opt.l1_decay_mul : 0.0;
    this.l2_decay_mul = typeof opt.l2_decay_mul !== 'undefined' ? opt.l2_decay_mul : 1.0;

    // computed
    this.num_inputs = opt.in_sx * opt.in_sy * opt.in_depth;
    this.out_sx = 1;
    this.out_sy = 1;
    this.layer_type = 'fc';

    // initializations
    var bias = typeof opt.bias_pref !== 'undefined' ? opt.bias_pref : 0.0;
    this.filters = [];
    for(var i=0;i<this.out_depth ;i++) { this.filters.push(new Vol(1, 1, this.num_inputs)); }
    this.biases = new Vol(1, 1, this.out_depth, bias);
  }

  FullyConnLayer.prototype = {
    forward: function(V, is_training) {
      this.in_act = V;
      var A = new Vol(1, 1, this.out_depth, 0.0);
      var Vw = V.w;
      for(var i=0;i<this.out_depth;i++) {
        var a = 0.0;
        var wi = this.filters[i].w;
        for(var d=0;d<this.num_inputs;d++) {
          a += Vw[d] * wi[d]; // for efficiency use Vols directly for now
        }
        a += this.biases.w[i];
        A.w[i] = a;
      }
      this.out_act = A;
      return this.out_act;
    },
    backward: function() {
      var V = this.in_act;
      V.dw = global.zeros(V.w.length); // zero out the gradient in input Vol
      
      // compute gradient wrt weights and data
      for(var i=0;i<this.out_depth;i++) {
        var tfi = this.filters[i];
        var chain_grad = this.out_act.dw[i];
        for(var d=0;d<this.num_inputs;d++) {
          V.dw[d] += tfi.w[d]*chain_grad; // grad wrt input data
          tfi.dw[d] += V.w[d]*chain_grad; // grad wrt params
        }
        this.biases.dw[i] += chain_grad;
      }
    },
    getParamsAndGrads: function() {
      var response = [];
      for(var i=0;i<this.out_depth;i++) {
        response.push({params: this.filters[i].w, grads: this.filters[i].dw, l1_decay_mul: this.l1_decay_mul, l2_decay_mul: this.l2_decay_mul});
      }
      response.push({params: this.biases.w, grads: this.biases.dw, l1_decay_mul: 0.0, l2_decay_mul: 0.0});
      return response;
    },
    toJSON: function() {
      var json = {};
      json.out_depth = this.out_depth;
      json.out_sx = this.out_sx;
      json.out_sy = this.out_sy;
      json.layer_type = this.layer_type;
      json.num_inputs = this.num_inputs;
      json.l1_decay_mul = this.l1_decay_mul;
      json.l2_decay_mul = this.l2_decay_mul;
      json.filters = [];
      for(var i=0;i<this.filters.length;i++) {
        json.filters.push(this.filters[i].toJSON());
      }
      json.biases = this.biases.toJSON();
      return json;
    },
    fromJSON: function(json) {
      this.out_depth = json.out_depth;
      this.out_sx = json.out_sx;
      this.out_sy = json.out_sy;
      this.layer_type = json.layer_type;
      this.num_inputs = json.num_inputs;
      this.l1_decay_mul = typeof json.l1_decay_mul !== 'undefined' ? json.l1_decay_mul : 1.0;
      this.l2_decay_mul = typeof json.l2_decay_mul !== 'undefined' ? json.l2_decay_mul : 1.0;
      this.filters = [];
      for(var i=0;i<json.filters.length;i++) {
        var v = new Vol(0,0,0,0);
        v.fromJSON(json.filters[i]);
        this.filters.push(v);
      }
      this.biases = new Vol(0,0,0,0);
      this.biases.fromJSON(json.biases);
    }
  }

  global.ConvLayer = ConvLayer;
  global.FullyConnLayer = FullyConnLayer;
  
})(convnetjs);
(function(global) {
  "use strict";
  var Vol = global.Vol; // convenience
  
  var PoolLayer = function(opt) {

    var opt = opt || {};

    // required
    this.sx = opt.sx; // filter size
    this.in_depth = opt.in_depth;
    this.in_sx = opt.in_sx;
    this.in_sy = opt.in_sy;

    // optional
    this.sy = typeof opt.sy !== 'undefined' ? opt.sy : this.sx;
    this.stride = typeof opt.stride !== 'undefined' ? opt.stride : 2;
    this.pad = typeof opt.pad !== 'undefined' ? opt.pad : 0; // amount of 0 padding to add around borders of input volume

    // computed
    this.out_depth = this.in_depth;
    this.out_sx = Math.floor((this.in_sx + this.pad * 2 - this.sx) / this.stride + 1);
    this.out_sy = Math.floor((this.in_sy + this.pad * 2 - this.sy) / this.stride + 1);
    this.layer_type = 'pool';
    // store switches for x,y coordinates for where the max comes from, for each output neuron
    this.switchx = global.zeros(this.out_sx*this.out_sy*this.out_depth);
    this.switchy = global.zeros(this.out_sx*this.out_sy*this.out_depth);
  }

  PoolLayer.prototype = {
    forward: function(V, is_training) {
      this.in_act = V;

      var A = new Vol(this.out_sx, this.out_sy, this.out_depth, 0.0);
      
      var n=0; // a counter for switches
      for(var d=0;d<this.out_depth;d++) {
        var x = -this.pad;
        var y = -this.pad;
        for(var ax=0; ax<this.out_sx; x+=this.stride,ax++) {
          y = -this.pad;
          for(var ay=0; ay<this.out_sy; y+=this.stride,ay++) {

            // convolve centered at this particular location
            var a = -99999; // hopefully small enough ;\
            var winx=-1,winy=-1;
            for(var fx=0;fx<this.sx;fx++) {
              for(var fy=0;fy<this.sy;fy++) {
                var oy = y+fy;
                var ox = x+fx;
                if(oy>=0 && oy<V.sy && ox>=0 && ox<V.sx) {
                  var v = V.get(ox, oy, d);
                  // perform max pooling and store pointers to where
                  // the max came from. This will speed up backprop 
                  // and can help make nice visualizations in future
                  if(v > a) { a = v; winx=ox; winy=oy;}
                }
              }
            }
            this.switchx[n] = winx;
            this.switchy[n] = winy;
            n++;
            A.set(ax, ay, d, a);
          }
        }
      }
      this.out_act = A;
      return this.out_act;
    },
    backward: function() { 
      // pooling layers have no parameters, so simply compute 
      // gradient wrt data here
      var V = this.in_act;
      V.dw = global.zeros(V.w.length); // zero out gradient wrt data
      var A = this.out_act; // computed in forward pass 

      var n = 0;
      for(var d=0;d<this.out_depth;d++) {
        var x = -this.pad;
        var y = -this.pad;
        for(var ax=0; ax<this.out_sx; x+=this.stride,ax++) {
          y = -this.pad;
          for(var ay=0; ay<this.out_sy; y+=this.stride,ay++) {

            var chain_grad = this.out_act.get_grad(ax,ay,d);
            V.add_grad(this.switchx[n], this.switchy[n], d, chain_grad);
            n++;

          }
        }
      }
    },
    getParamsAndGrads: function() {
      return [];
    },
    toJSON: function() {
      var json = {};
      json.sx = this.sx;
      json.sy = this.sy;
      json.stride = this.stride;
      json.in_depth = this.in_depth;
      json.out_depth = this.out_depth;
      json.out_sx = this.out_sx;
      json.out_sy = this.out_sy;
      json.layer_type = this.layer_type;
      json.pad = this.pad;
      return json;
    },
    fromJSON: function(json) {
      this.out_depth = json.out_depth;
      this.out_sx = json.out_sx;
      this.out_sy = json.out_sy;
      this.layer_type = json.layer_type;
      this.sx = json.sx;
      this.sy = json.sy;
      this.stride = json.stride;
      this.in_depth = json.in_depth;
      this.pad = typeof json.pad !== 'undefined' ? json.pad : 0; // backwards compatibility
      this.switchx = global.zeros(this.out_sx*this.out_sy*this.out_depth); // need to re-init these appropriately
      this.switchy = global.zeros(this.out_sx*this.out_sy*this.out_depth);
    }
  }

  global.PoolLayer = PoolLayer;

})(convnetjs);

(function(global) {
  "use strict";
  var Vol = global.Vol; // convenience
  
  var InputLayer = function(opt) {
    var opt = opt || {};

    // this is a bit silly but lets allow people to specify either ins or outs
    this.out_sx = typeof opt.out_sx !== 'undefined' ? opt.out_sx : opt.in_sx;
    this.out_sy = typeof opt.out_sy !== 'undefined' ? opt.out_sy : opt.in_sy;
    this.out_depth = typeof opt.out_depth !== 'undefined' ? opt.out_depth : opt.in_depth;
    this.layer_type = 'input';
  }
  InputLayer.prototype = {
    forward: function(V, is_training) {
      this.in_act = V;
      this.out_act = V;
      return this.out_act; // dummy identity function for now
    },
    backward: function() { },
    getParamsAndGrads: function() {
      return [];
    },
    toJSON: function() {
      var json = {};
      json.out_depth = this.out_depth;
      json.out_sx = this.out_sx;
      json.out_sy = this.out_sy;
      json.layer_type = this.layer_type;
      return json;
    },
    fromJSON: function(json) {
      this.out_depth = json.out_depth;
      this.out_sx = json.out_sx;
      this.out_sy = json.out_sy;
      this.layer_type = json.layer_type; 
    }
  }

  global.InputLayer = InputLayer;
})(convnetjs);
(function(global) {
  "use strict";
  var Vol = global.Vol; // convenience
  
  // Layers that implement a loss. Currently these are the layers that 
  // can initiate a backward() pass. In future we probably want a more 
  // flexible system that can accomodate multiple losses to do multi-task
  // learning, and stuff like that. But for now, one of the layers in this
  // file must be the final layer in a Net.

  // This is a classifier, with N discrete classes from 0 to N-1
  // it gets a stream of N incoming numbers and computes the softmax
  // function (exponentiate and normalize to sum to 1 as probabilities should)
  var SoftmaxLayer = function(opt) {
    var opt = opt || {};

    // computed
    this.num_inputs = opt.in_sx * opt.in_sy * opt.in_depth;
    this.out_depth = this.num_inputs;
    this.out_sx = 1;
    this.out_sy = 1;
    this.layer_type = 'softmax';
  }

  SoftmaxLayer.prototype = {
    forward: function(V, is_training) {
      this.in_act = V;

      var A = new Vol(1, 1, this.out_depth, 0.0);

      // compute max activation
      var as = V.w;
      var amax = V.w[0];
      for(var i=1;i<this.out_depth;i++) {
        if(as[i] > amax) amax = as[i];
      }

      // compute exponentials (carefully to not blow up)
      var es = global.zeros(this.out_depth);
      var esum = 0.0;
      for(var i=0;i<this.out_depth;i++) {
        var e = Math.exp(as[i] - amax);
        esum += e;
        es[i] = e;
      }

      // normalize and output to sum to one
      for(var i=0;i<this.out_depth;i++) {
        es[i] /= esum;
        A.w[i] = es[i];
      }

      this.es = es; // save these for backprop
      this.out_act = A;
      return this.out_act;
    },
    backward: function(y) {

      // compute and accumulate gradient wrt weights and bias of this layer
      var x = this.in_act;
      x.dw = global.zeros(x.w.length); // zero out the gradient of input Vol

      for(var i=0;i<this.out_depth;i++) {
        var indicator = i === y ? 1.0 : 0.0;
        var mul = -(indicator - this.es[i]);
        x.dw[i] = mul;
      }

      // loss is the class negative log likelihood
      return -Math.log(this.es[y]);
    },
    getParamsAndGrads: function() { 
      return [];
    },
    toJSON: function() {
      var json = {};
      json.out_depth = this.out_depth;
      json.out_sx = this.out_sx;
      json.out_sy = this.out_sy;
      json.layer_type = this.layer_type;
      json.num_inputs = this.num_inputs;
      return json;
    },
    fromJSON: function(json) {
      this.out_depth = json.out_depth;
      this.out_sx = json.out_sx;
      this.out_sy = json.out_sy;
      this.layer_type = json.layer_type;
      this.num_inputs = json.num_inputs;
    }
  }

  // implements an L2 regression cost layer,
  // so penalizes \sum_i(||x_i - y_i||^2), where x is its input
  // and y is the user-provided array of "correct" values.
  var RegressionLayer = function(opt) {
    var opt = opt || {};

    // computed
    this.num_inputs = opt.in_sx * opt.in_sy * opt.in_depth;
    this.out_depth = this.num_inputs;
    this.out_sx = 1;
    this.out_sy = 1;
    this.layer_type = 'regression';
  }

  RegressionLayer.prototype = {
    forward: function(V, is_training) {
      this.in_act = V;
      this.out_act = V;
      return V; // identity function
    },
    // y is a list here of size num_inputs
    backward: function(y) { 

      // compute and accumulate gradient wrt weights and bias of this layer
      var x = this.in_act;
      x.dw = global.zeros(x.w.length); // zero out the gradient of input Vol
      var loss = 0.0;
      if(y instanceof Array || y instanceof Float64Array) {
        for(var i=0;i<this.out_depth;i++) {
          var dy = x.w[i] - y[i];
          x.dw[i] = dy;
          loss += 2*dy*dy;
        }
      } else {
        // assume it is a struct with entries .dim and .val
        // and we pass gradient only along dimension dim to be equal to val
        var i = y.dim;
        var yi = y.val;
        var dy = x.w[i] - yi;
        x.dw[i] = dy;
        loss += 2*dy*dy;
      }
      return loss;
    },
    getParamsAndGrads: function() { 
      return [];
    },
    toJSON: function() {
      var json = {};
      json.out_depth = this.out_depth;
      json.out_sx = this.out_sx;
      json.out_sy = this.out_sy;
      json.layer_type = this.layer_type;
      json.num_inputs = this.num_inputs;
      return json;
    },
    fromJSON: function(json) {
      this.out_depth = json.out_depth;
      this.out_sx = json.out_sx;
      this.out_sy = json.out_sy;
      this.layer_type = json.layer_type;
      this.num_inputs = json.num_inputs;
    }
  }

  var SVMLayer = function(opt) {
    var opt = opt || {};

    // computed
    this.num_inputs = opt.in_sx * opt.in_sy * opt.in_depth;
    this.out_depth = this.num_inputs;
    this.out_sx = 1;
    this.out_sy = 1;
    this.layer_type = 'svm';
  }

  SVMLayer.prototype = {
    forward: function(V, is_training) {
      this.in_act = V;
      this.out_act = V; // nothing to do, output raw scores
      return V;
    },
    backward: function(y) {

      // compute and accumulate gradient wrt weights and bias of this layer
      var x = this.in_act;
      x.dw = global.zeros(x.w.length); // zero out the gradient of input Vol

      var yscore = x.w[y]; // score of ground truth
      var margin = 1.0;
      var loss = 0.0;
      for(var i=0;i<this.out_depth;i++) {
        if(-yscore + x.w[i] + margin > 0) {
          // violating example, apply loss
          // I love hinge loss, by the way. Truly.
          // Seriously, compare this SVM code with Softmax forward AND backprop code above
          // it's clear which one is superior, not only in code, simplicity
          // and beauty, but also in practice.
          x.dw[i] += 1;
          x.dw[y] -= 1;
          loss += -yscore + x.w[i] + margin;
        }
      }

      return loss;
    },
    getParamsAndGrads: function() { 
      return [];
    },
    toJSON: function() {
      var json = {};
      json.out_depth = this.out_depth;
      json.out_sx = this.out_sx;
      json.out_sy = this.out_sy;
      json.layer_type = this.layer_type;
      json.num_inputs = this.num_inputs;
      return json;
    },
    fromJSON: function(json) {
      this.out_depth = json.out_depth;
      this.out_sx = json.out_sx;
      this.out_sy = json.out_sy;
      this.layer_type = json.layer_type;
      this.num_inputs = json.num_inputs;
    }
  }
  
  global.RegressionLayer = RegressionLayer;
  global.SoftmaxLayer = SoftmaxLayer;
  global.SVMLayer = SVMLayer;

})(convnetjs);

(function(global) {
  "use strict";
  var Vol = global.Vol; // convenience
  
  // Implements ReLU nonlinearity elementwise
  // x -> max(0, x)
  // the output is in [0, inf)
  var ReluLayer = function(opt) {
    var opt = opt || {};

    // computed
    this.out_sx = opt.in_sx;
    this.out_sy = opt.in_sy;
    this.out_depth = opt.in_depth;
    this.layer_type = 'relu';
  }
  ReluLayer.prototype = {
    forward: function(V, is_training) {
      this.in_act = V;
      var V2 = V.clone();
      var N = V.w.length;
      var V2w = V2.w;
      for(var i=0;i<N;i++) { 
        if(V2w[i] < 0) V2w[i] = 0; // threshold at 0
      }
      this.out_act = V2;
      return this.out_act;
    },
    backward: function() {
      var V = this.in_act; // we need to set dw of this
      var V2 = this.out_act;
      var N = V.w.length;
      V.dw = global.zeros(N); // zero out gradient wrt data
      for(var i=0;i<N;i++) {
        if(V2.w[i] <= 0) V.dw[i] = 0; // threshold
        else V.dw[i] = V2.dw[i];
      }
    },
    getParamsAndGrads: function() {
      return [];
    },
    toJSON: function() {
      var json = {};
      json.out_depth = this.out_depth;
      json.out_sx = this.out_sx;
      json.out_sy = this.out_sy;
      json.layer_type = this.layer_type;
      return json;
    },
    fromJSON: function(json) {
      this.out_depth = json.out_depth;
      this.out_sx = json.out_sx;
      this.out_sy = json.out_sy;
      this.layer_type = json.layer_type; 
    }
  }

  // Implements Sigmoid nnonlinearity elementwise
  // x -> 1/(1+e^(-x))
  // so the output is between 0 and 1.
  var SigmoidLayer = function(opt) {
    var opt = opt || {};

    // computed
    this.out_sx = opt.in_sx;
    this.out_sy = opt.in_sy;
    this.out_depth = opt.in_depth;
    this.layer_type = 'sigmoid';
  }
  SigmoidLayer.prototype = {
    forward: function(V, is_training) {
      this.in_act = V;
      var V2 = V.cloneAndZero();
      var N = V.w.length;
      var V2w = V2.w;
      var Vw = V.w;
      for(var i=0;i<N;i++) { 
        V2w[i] = 1.0/(1.0+Math.exp(-Vw[i]));
      }
      this.out_act = V2;
      return this.out_act;
    },
    backward: function() {
      var V = this.in_act; // we need to set dw of this
      var V2 = this.out_act;
      var N = V.w.length;
      V.dw = global.zeros(N); // zero out gradient wrt data
      for(var i=0;i<N;i++) {
        var v2wi = V2.w[i];
        V.dw[i] =  v2wi * (1.0 - v2wi) * V2.dw[i];
      }
    },
    getParamsAndGrads: function() {
      return [];
    },
    toJSON: function() {
      var json = {};
      json.out_depth = this.out_depth;
      json.out_sx = this.out_sx;
      json.out_sy = this.out_sy;
      json.layer_type = this.layer_type;
      return json;
    },
    fromJSON: function(json) {
      this.out_depth = json.out_depth;
      this.out_sx = json.out_sx;
      this.out_sy = json.out_sy;
      this.layer_type = json.layer_type; 
    }
  }

  // Implements Maxout nnonlinearity that computes
  // x -> max(x)
  // where x is a vector of size group_size. Ideally of course,
  // the input size should be exactly divisible by group_size
  var MaxoutLayer = function(opt) {
    var opt = opt || {};

    // required
    this.group_size = typeof opt.group_size !== 'undefined' ? opt.group_size : 2;

    // computed
    this.out_sx = opt.in_sx;
    this.out_sy = opt.in_sy;
    this.out_depth = Math.floor(opt.in_depth / this.group_size);
    this.layer_type = 'maxout';

    this.switches = global.zeros(this.out_sx*this.out_sy*this.out_depth); // useful for backprop
  }
  MaxoutLayer.prototype = {
    forward: function(V, is_training) {
      this.in_act = V;
      var N = this.out_depth; 
      var V2 = new Vol(this.out_sx, this.out_sy, this.out_depth, 0.0);

      // optimization branch. If we're operating on 1D arrays we dont have
      // to worry about keeping track of x,y,d coordinates inside
      // input volumes. In convnets we do :(
      if(this.out_sx === 1 && this.out_sy === 1) {
        for(var i=0;i<N;i++) {
          var ix = i * this.group_size; // base index offset
          var a = V.w[ix];
          var ai = 0;
          for(var j=1;j<this.group_size;j++) {
            var a2 = V.w[ix+j];
            if(a2 > a) {
              a = a2;
              ai = j;
            }
          }
          V2.w[i] = a;
          this.switches[i] = ix + ai;
        }
      } else {
        var n=0; // counter for switches
        for(var x=0;x<V.sx;x++) {
          for(var y=0;y<V.sy;y++) {
            for(var i=0;i<N;i++) {
              var ix = i * this.group_size;
              var a = V.get(x, y, ix);
              var ai = 0;
              for(var j=1;j<this.group_size;j++) {
                var a2 = V.get(x, y, ix+j);
                if(a2 > a) {
                  a = a2;
                  ai = j;
                }
              }
              V2.set(x,y,i,a);
              this.switches[n] = ix + ai;
              n++;
            }
          }
        }

      }
      this.out_act = V2;
      return this.out_act;
    },
    backward: function() {
      var V = this.in_act; // we need to set dw of this
      var V2 = this.out_act;
      var N = this.out_depth;
      V.dw = global.zeros(V.w.length); // zero out gradient wrt data

      // pass the gradient through the appropriate switch
      if(this.out_sx === 1 && this.out_sy === 1) {
        for(var i=0;i<N;i++) {
          var chain_grad = V2.dw[i];
          V.dw[this.switches[i]] = chain_grad;
        }
      } else {
        // bleh okay, lets do this the hard way
        var n=0; // counter for switches
        for(var x=0;x<V2.sx;x++) {
          for(var y=0;y<V2.sy;y++) {
            for(var i=0;i<N;i++) {
              var chain_grad = V2.get_grad(x,y,i);
              V.set_grad(x,y,this.switches[n],chain_grad);
              n++;
            }
          }
        }
      }
    },
    getParamsAndGrads: function() {
      return [];
    },
    toJSON: function() {
      var json = {};
      json.out_depth = this.out_depth;
      json.out_sx = this.out_sx;
      json.out_sy = this.out_sy;
      json.layer_type = this.layer_type;
      json.group_size = this.group_size;
      return json;
    },
    fromJSON: function(json) {
      this.out_depth = json.out_depth;
      this.out_sx = json.out_sx;
      this.out_sy = json.out_sy;
      this.layer_type = json.layer_type; 
      this.group_size = json.group_size;
      this.switches = global.zeros(this.group_size);
    }
  }

  // a helper function, since tanh is not yet part of ECMAScript. Will be in v6.
  function tanh(x) {
    var y = Math.exp(2 * x);
    return (y - 1) / (y + 1);
  }
  // Implements Tanh nnonlinearity elementwise
  // x -> tanh(x) 
  // so the output is between -1 and 1.
  var TanhLayer = function(opt) {
    var opt = opt || {};

    // computed
    this.out_sx = opt.in_sx;
    this.out_sy = opt.in_sy;
    this.out_depth = opt.in_depth;
    this.layer_type = 'tanh';
  }
  TanhLayer.prototype = {
    forward: function(V, is_training) {
      this.in_act = V;
      var V2 = V.cloneAndZero();
      var N = V.w.length;
      for(var i=0;i<N;i++) { 
        V2.w[i] = tanh(V.w[i]);
      }
      this.out_act = V2;
      return this.out_act;
    },
    backward: function() {
      var V = this.in_act; // we need to set dw of this
      var V2 = this.out_act;
      var N = V.w.length;
      V.dw = global.zeros(N); // zero out gradient wrt data
      for(var i=0;i<N;i++) {
        var v2wi = V2.w[i];
        V.dw[i] = (1.0 - v2wi * v2wi) * V2.dw[i];
      }
    },
    getParamsAndGrads: function() {
      return [];
    },
    toJSON: function() {
      var json = {};
      json.out_depth = this.out_depth;
      json.out_sx = this.out_sx;
      json.out_sy = this.out_sy;
      json.layer_type = this.layer_type;
      return json;
    },
    fromJSON: function(json) {
      this.out_depth = json.out_depth;
      this.out_sx = json.out_sx;
      this.out_sy = json.out_sy;
      this.layer_type = json.layer_type; 
    }
  }
  
  global.TanhLayer = TanhLayer;
  global.MaxoutLayer = MaxoutLayer;
  global.ReluLayer = ReluLayer;
  global.SigmoidLayer = SigmoidLayer;

})(convnetjs);

(function(global) {
  "use strict";
  var Vol = global.Vol; // convenience

  // An inefficient dropout layer
  // Note this is not most efficient implementation since the layer before
  // computed all these activations and now we're just going to drop them :(
  // same goes for backward pass. Also, if we wanted to be efficient at test time
  // we could equivalently be clever and upscale during train and copy pointers during test
  // todo: make more efficient.
  var DropoutLayer = function(opt) {
    var opt = opt || {};

    // computed
    this.out_sx = opt.in_sx;
    this.out_sy = opt.in_sy;
    this.out_depth = opt.in_depth;
    this.layer_type = 'dropout';
    this.drop_prob = typeof opt.drop_prob !== 'undefined' ? opt.drop_prob : 0.5;
    this.dropped = global.zeros(this.out_sx*this.out_sy*this.out_depth);
  }
  DropoutLayer.prototype = {
    forward: function(V, is_training) {
      this.in_act = V;
      if(typeof(is_training)==='undefined') { is_training = false; } // default is prediction mode
      var V2 = V.clone();
      var N = V.w.length;
      if(is_training) {
        // do dropout
        for(var i=0;i<N;i++) {
          if(Math.random()<this.drop_prob) { V2.w[i]=0; this.dropped[i] = true; } // drop!
          else {this.dropped[i] = false;}
        }
      } else {
        // scale the activations during prediction
        for(var i=0;i<N;i++) { V2.w[i]*=this.drop_prob; }
      }
      this.out_act = V2;
      return this.out_act; // dummy identity function for now
    },
    backward: function() {
      var V = this.in_act; // we need to set dw of this
      var chain_grad = this.out_act;
      var N = V.w.length;
      V.dw = global.zeros(N); // zero out gradient wrt data
      for(var i=0;i<N;i++) {
        if(!(this.dropped[i])) { 
          V.dw[i] = chain_grad.dw[i]; // copy over the gradient
        }
      }
    },
    getParamsAndGrads: function() {
      return [];
    },
    toJSON: function() {
      var json = {};
      json.out_depth = this.out_depth;
      json.out_sx = this.out_sx;
      json.out_sy = this.out_sy;
      json.layer_type = this.layer_type;
      json.drop_prob = this.drop_prob;
      return json;
    },
    fromJSON: function(json) {
      this.out_depth = json.out_depth;
      this.out_sx = json.out_sx;
      this.out_sy = json.out_sy;
      this.layer_type = json.layer_type; 
      this.drop_prob = json.drop_prob;
    }
  }
  

  global.DropoutLayer = DropoutLayer;
})(convnetjs);
(function(global) {
  "use strict";
  var Vol = global.Vol; // convenience
  
  // a bit experimental layer for now. I think it works but I'm not 100%
  // the gradient check is a bit funky. I'll look into this a bit later.
  // Local Response Normalization in window, along depths of volumes
  var LocalResponseNormalizationLayer = function(opt) {
    var opt = opt || {};

    // required
    this.k = opt.k;
    this.n = opt.n;
    this.alpha = opt.alpha;
    this.beta = opt.beta;

    // computed
    this.out_sx = opt.in_sx;
    this.out_sy = opt.in_sy;
    this.out_depth = opt.in_depth;
    this.layer_type = 'lrn';

    // checks
    if(this.n%2 === 0) { console.log('WARNING n should be odd for LRN layer'); }
  }
  LocalResponseNormalizationLayer.prototype = {
    forward: function(V, is_training) {
      this.in_act = V;

      var A = V.cloneAndZero();
      this.S_cache_ = V.cloneAndZero();
      var n2 = Math.floor(this.n/2);
      for(var x=0;x<V.sx;x++) {
        for(var y=0;y<V.sy;y++) {
          for(var i=0;i<V.depth;i++) {

            var ai = V.get(x,y,i);

            // normalize in a window of size n
            var den = 0.0;
            for(var j=Math.max(0,i-n2);j<=Math.min(i+n2,V.depth-1);j++) {
              var aa = V.get(x,y,j);
              den += aa*aa;
            }
            den *= this.alpha / this.n;
            den += this.k;
            this.S_cache_.set(x,y,i,den); // will be useful for backprop
            den = Math.pow(den, this.beta);
            A.set(x,y,i,ai/den);
          }
        }
      }

      this.out_act = A;
      return this.out_act; // dummy identity function for now
    },
    backward: function() { 
      // evaluate gradient wrt data
      var V = this.in_act; // we need to set dw of this
      V.dw = global.zeros(V.w.length); // zero out gradient wrt data
      var A = this.out_act; // computed in forward pass 

      var n2 = Math.floor(this.n/2);
      for(var x=0;x<V.sx;x++) {
        for(var y=0;y<V.sy;y++) {
          for(var i=0;i<V.depth;i++) {

            var chain_grad = this.out_act.get_grad(x,y,i);
            var S = this.S_cache_.get(x,y,i);
            var SB = Math.pow(S, this.beta);
            var SB2 = SB*SB;

            // normalize in a window of size n
            for(var j=Math.max(0,i-n2);j<=Math.min(i+n2,V.depth-1);j++) {              
              var aj = V.get(x,y,j); 
              var g = -aj*this.beta*Math.pow(S,this.beta-1)*this.alpha/this.n*2*aj;
              if(j===i) g+= SB;
              g /= SB2;
              g *= chain_grad;
              V.add_grad(x,y,j,g);
            }

          }
        }
      }
    },
    getParamsAndGrads: function() { return []; },
    toJSON: function() {
      var json = {};
      json.k = this.k;
      json.n = this.n;
      json.alpha = this.alpha; // normalize by size
      json.beta = this.beta;
      json.out_sx = this.out_sx; 
      json.out_sy = this.out_sy;
      json.out_depth = this.out_depth;
      json.layer_type = this.layer_type;
      return json;
    },
    fromJSON: function(json) {
      this.k = json.k;
      this.n = json.n;
      this.alpha = json.alpha; // normalize by size
      this.beta = json.beta;
      this.out_sx = json.out_sx; 
      this.out_sy = json.out_sy;
      this.out_depth = json.out_depth;
      this.layer_type = json.layer_type;
    }
  }
  

  global.LocalResponseNormalizationLayer = LocalResponseNormalizationLayer;
})(convnetjs);
(function(global) {
  "use strict";
  var Vol = global.Vol; // convenience

  // transforms x-> [x, x_i*x_j forall i,j]
  // so the fully connected layer afters will essentially be doing tensor multiplies
  var QuadTransformLayer = function(opt) {
    var opt = opt || {};

    // computed
    this.out_sx = opt.in_sx;
    this.out_sy = opt.in_sy;
    // linear terms, and then quadratic terms, of which there are 1/2*n*(n+1),
    // (offdiagonals and the diagonal total) and arithmetic series.
    // Actually never mind, lets not be fancy here yet and just include
    // terms x_ix_j and x_jx_i twice. Half as efficient but much less
    // headache.
    this.out_depth = opt.in_depth + opt.in_depth * opt.in_depth;
    this.layer_type = 'quadtransform';

  }
  QuadTransformLayer.prototype = {
    forward: function(V, is_training) {
      this.in_act = V;
      var N = this.out_depth;
      var Ni = V.depth;
      var V2 = new Vol(this.out_sx, this.out_sy, this.out_depth, 0.0);
      for(var x=0;x<V.sx;x++) {
        for(var y=0;y<V.sy;y++) {
          for(var i=0;i<N;i++) {
            if(i<Ni) {
              V2.set(x,y,i,V.get(x,y,i)); // copy these over (linear terms)
            } else {
              var i0 = Math.floor((i-Ni)/Ni);
              var i1 = (i-Ni) - i0*Ni;
              V2.set(x,y,i,V.get(x,y,i0) * V.get(x,y,i1)); // quadratic
            }
          }
        }
      }
      this.out_act = V2;
      return this.out_act; // dummy identity function for now
    },
    backward: function() {
      var V = this.in_act;
      V.dw = global.zeros(V.w.length); // zero out gradient wrt data
      var V2 = this.out_act;
      var N = this.out_depth;
      var Ni = V.depth;
      for(var x=0;x<V.sx;x++) {
        for(var y=0;y<V.sy;y++) {
          for(var i=0;i<N;i++) {
            var chain_grad = V2.get_grad(x,y,i);
            if(i<Ni) {
              V.add_grad(x,y,i,chain_grad);
            } else {
              var i0 = Math.floor((i-Ni)/Ni);
              var i1 = (i-Ni) - i0*Ni;
              V.add_grad(x,y,i0,V.get(x,y,i1)*chain_grad);
              V.add_grad(x,y,i1,V.get(x,y,i0)*chain_grad);
            }
          }
        }
      }
    },
    getParamsAndGrads: function() {
      return [];
    },
    toJSON: function() {
      var json = {};
      json.out_depth = this.out_depth;
      json.out_sx = this.out_sx;
      json.out_sy = this.out_sy;
      json.layer_type = this.layer_type;
      return json;
    },
    fromJSON: function(json) {
      this.out_depth = json.out_depth;
      this.out_sx = json.out_sx;
      this.out_sy = json.out_sy;
      this.layer_type = json.layer_type; 
    }
  }
  

  global.QuadTransformLayer = QuadTransformLayer;
})(convnetjs);
(function(global) {
  "use strict";
  var Vol = global.Vol; // convenience
  
  // Net manages a set of layers
  // For now constraints: Simple linear order of layers, first layer input last layer a cost layer
  var Net = function(options) {
    this.layers = [];
  }

  Net.prototype = {
    
    // takes a list of layer definitions and creates the network layer objects
    makeLayers: function(defs) {

      // few checks for now
      if(defs.length<2) {console.log('ERROR! For now at least have input and softmax layers.');}
      if(defs[0].type !== 'input') {console.log('ERROR! For now first layer should be input.');}

      // desugar syntactic for adding activations and dropouts
      var desugar = function() {
        var new_defs = [];
        for(var i=0;i<defs.length;i++) {
          var def = defs[i];
          
          if(def.type==='softmax' || def.type==='svm') {
            // add an fc layer here, there is no reason the user should
            // have to worry about this and we almost always want to
            new_defs.push({type:'fc', num_neurons: def.num_classes});
          }

          if(def.type==='regression') {
            // add an fc layer here, there is no reason the user should
            // have to worry about this and we almost always want to
            new_defs.push({type:'fc', num_neurons: def.num_neurons});
          }

          if((def.type==='fc' || def.type==='conv') 
              && typeof(def.bias_pref) === 'undefined'){
            def.bias_pref = 0.0;
            if(typeof def.activation !== 'undefined' && def.activation === 'relu') {
              def.bias_pref = 0.1; // relus like a bit of positive bias to get gradients early
              // otherwise it's technically possible that a relu unit will never turn on (by chance)
              // and will never get any gradient and never contribute any computation. Dead relu.
            }
          }
          
          if(typeof def.tensor !== 'undefined') {
            // apply quadratic transform so that the upcoming multiply will include
            // quadratic terms, equivalent to doing a tensor product
            if(def.tensor) {
              new_defs.push({type: 'quadtransform'});
            }
          }

          new_defs.push(def);

          if(typeof def.activation !== 'undefined') {
            if(def.activation==='relu') { new_defs.push({type:'relu'}); }
            else if (def.activation==='sigmoid') { new_defs.push({type:'sigmoid'}); }
            else if (def.activation==='tanh') { new_defs.push({type:'tanh'}); }
            else if (def.activation==='maxout') {
              // create maxout activation, and pass along group size, if provided
              var gs = def.group_size !== 'undefined' ? def.group_size : 2;
              new_defs.push({type:'maxout', group_size:gs});
            }
            else { console.log('ERROR unsupported activation ' + def.activation); }
          }
          if(typeof def.drop_prob !== 'undefined' && def.type !== 'dropout') {
            new_defs.push({type:'dropout', drop_prob: def.drop_prob});
          }

        }
        return new_defs;
      }
      defs = desugar(defs);

      // create the layers
      this.layers = [];
      for(var i=0;i<defs.length;i++) {
        var def = defs[i];
        if(i>0) {
          var prev = this.layers[i-1];
          def.in_sx = prev.out_sx;
          def.in_sy = prev.out_sy;
          def.in_depth = prev.out_depth;
        }

        switch(def.type) {
          case 'fc': this.layers.push(new global.FullyConnLayer(def)); break;
          case 'lrn': this.layers.push(new global.LocalResponseNormalizationLayer(def)); break;
          case 'dropout': this.layers.push(new global.DropoutLayer(def)); break;
          case 'input': this.layers.push(new global.InputLayer(def)); break;
          case 'softmax': this.layers.push(new global.SoftmaxLayer(def)); break;
          case 'regression': this.layers.push(new global.RegressionLayer(def)); break;
          case 'conv': this.layers.push(new global.ConvLayer(def)); break;
          case 'pool': this.layers.push(new global.PoolLayer(def)); break;
          case 'relu': this.layers.push(new global.ReluLayer(def)); break;
          case 'sigmoid': this.layers.push(new global.SigmoidLayer(def)); break;
          case 'tanh': this.layers.push(new global.TanhLayer(def)); break;
          case 'maxout': this.layers.push(new global.MaxoutLayer(def)); break;
          case 'quadtransform': this.layers.push(new global.QuadTransformLayer(def)); break;
          case 'svm': this.layers.push(new global.SVMLayer(def)); break;
          default: console.log('ERROR: UNRECOGNIZED LAYER TYPE!');
        }
      }
    },

    // forward prop the network. A trainer will pass in is_training = true
    forward: function(V, is_training) {
      if(typeof(is_training)==='undefined') is_training = false;
      var act = this.layers[0].forward(V, is_training);
      for(var i=1;i<this.layers.length;i++) {
        act = this.layers[i].forward(act, is_training);
      }
      return act;
    },
    
    // backprop: compute gradients wrt all parameters
    backward: function(y) {
      var N = this.layers.length;
      var loss = this.layers[N-1].backward(y); // last layer assumed softmax
      for(var i=N-2;i>=0;i--) { // first layer assumed input
        this.layers[i].backward();
      }
      return loss;
    },
    getParamsAndGrads: function() {
      // accumulate parameters and gradients for the entire network
      var response = [];
      for(var i=0;i<this.layers.length;i++) {
        var layer_reponse = this.layers[i].getParamsAndGrads();
        for(var j=0;j<layer_reponse.length;j++) {
          response.push(layer_reponse[j]);
        }
      }
      return response;
    },
    getPrediction: function() {
      var S = this.layers[this.layers.length-1]; // softmax layer
      var p = S.out_act.w;
      var maxv = p[0];
      var maxi = 0;
      for(var i=1;i<p.length;i++) {
        if(p[i] > maxv) { maxv = p[i]; maxi = i;}
      }
      return maxi;
    },
    toJSON: function() {
      var json = {};
      json.layers = [];
      for(var i=0;i<this.layers.length;i++) {
        json.layers.push(this.layers[i].toJSON());
      }
      return json;
    },
    fromJSON: function(json) {
      this.layers = [];
      for(var i=0;i<json.layers.length;i++) {
        var Lj = json.layers[i]
        var t = Lj.layer_type;
        var L;
        if(t==='input') { L = new global.InputLayer(); }
        if(t==='relu') { L = new global.ReluLayer(); }
        if(t==='sigmoid') { L = new global.SigmoidLayer(); }
        if(t==='tanh') { L = new global.TanhLayer(); }
        if(t==='dropout') { L = new global.DropoutLayer(); }
        if(t==='conv') { L = new global.ConvLayer(); }
        if(t==='pool') { L = new global.PoolLayer(); }
        if(t==='lrn') { L = new global.LocalResponseNormalizationLayer(); }
        if(t==='softmax') { L = new global.SoftmaxLayer(); }
        if(t==='regression') { L = new global.RegressionLayer(); }
        if(t==='fc') { L = new global.FullyConnLayer(); }
        if(t==='maxout') { L = new global.MaxoutLayer(); }
        if(t==='quadtransform') { L = new global.QuadTransformLayer(); }
        if(t==='svm') { L = new global.SVMLayer(); }
        L.fromJSON(Lj);
        this.layers.push(L);
      }
    }
  }
  

  global.Net = Net;
})(convnetjs);
(function(global) {
  "use strict";
  var Vol = global.Vol; // convenience

  var Trainer = function(net, options) {

    this.net = net;

    var options = options || {};
    this.learning_rate = typeof options.learning_rate !== 'undefined' ? options.learning_rate : 0.01;
    this.l1_decay = typeof options.l1_decay !== 'undefined' ? options.l1_decay : 0.0;
    this.l2_decay = typeof options.l2_decay !== 'undefined' ? options.l2_decay : 0.0;
    this.batch_size = typeof options.batch_size !== 'undefined' ? options.batch_size : 1;
    this.method = typeof options.method !== 'undefined' ? options.method : 'sgd'; // sgd/adagrad/adadelta/windowgrad

    this.momentum = typeof options.momentum !== 'undefined' ? options.momentum : 0.9;
    this.ro = typeof options.ro !== 'undefined' ? options.ro : 0.95; // used in adadelta
    this.eps = typeof options.eps !== 'undefined' ? options.eps : 1e-6; // used in adadelta

    this.k = 0; // iteration counter
    this.gsum = []; // last iteration gradients (used for momentum calculations)
    this.xsum = []; // used in adadelta
  }

  Trainer.prototype = {
    train: function(x, y) {

      var start = new Date().getTime();
      this.net.forward(x, true); // also set the flag that lets the net know we're just training
      var end = new Date().getTime();
      var fwd_time = end - start;

      var start = new Date().getTime();
      var cost_loss = this.net.backward(y);
      var l2_decay_loss = 0.0;
      var l1_decay_loss = 0.0;
      var end = new Date().getTime();
      var bwd_time = end - start;
      
      this.k++;
      if(this.k % this.batch_size === 0) {

        var pglist = this.net.getParamsAndGrads();

        // initialize lists for accumulators. Will only be done once on first iteration
        if(this.gsum.length === 0 && (this.method !== 'sgd' || this.momentum > 0.0)) {
          // only vanilla sgd doesnt need either lists
          // momentum needs gsum
          // adagrad needs gsum
          // adadelta needs gsum and xsum
          for(var i=0;i<pglist.length;i++) {
            this.gsum.push(global.zeros(pglist[i].params.length));
            if(this.method === 'adadelta') {
              this.xsum.push(global.zeros(pglist[i].params.length));
            } else {
              this.xsum.push([]); // conserve memory
            }
          }
        }

        // perform an update for all sets of weights
        for(var i=0;i<pglist.length;i++) {
          var pg = pglist[i]; // param, gradient, other options in future (custom learning rate etc)
          var p = pg.params;
          var g = pg.grads;

          // learning rate for some parameters.
          var l2_decay_mul = typeof pg.l2_decay_mul !== 'undefined' ? pg.l2_decay_mul : 1.0;
          var l1_decay_mul = typeof pg.l1_decay_mul !== 'undefined' ? pg.l1_decay_mul : 1.0;
          var l2_decay = this.l2_decay * l2_decay_mul;
          var l1_decay = this.l1_decay * l1_decay_mul;

          var plen = p.length;
          for(var j=0;j<plen;j++) {
            l2_decay_loss += l2_decay*p[j]*p[j]/2; // accumulate weight decay loss
            l1_decay_loss += l1_decay*Math.abs(p[j]);
            var l1grad = l1_decay * (p[j] > 0 ? 1 : -1);
            var l2grad = l2_decay * (p[j]);

            var gij = (l2grad + l1grad + g[j]) / this.batch_size; // raw batch gradient

            var gsumi = this.gsum[i];
            var xsumi = this.xsum[i];
            if(this.method === 'adagrad') {
              // adagrad update
              gsumi[j] = gsumi[j] + gij * gij;
              var dx = - this.learning_rate / Math.sqrt(gsumi[j] + this.eps) * gij;
              p[j] += dx;
            } else if(this.method === 'windowgrad') {
              // this is adagrad but with a moving window weighted average
              // so the gradient is not accumulated over the entire history of the run. 
              // it's also referred to as Idea #1 in Zeiler paper on Adadelta. Seems reasonable to me!
              gsumi[j] = this.ro * gsumi[j] + (1-this.ro) * gij * gij;
              var dx = - this.learning_rate / Math.sqrt(gsumi[j] + this.eps) * gij; // eps added for better conditioning
              p[j] += dx;
            } else if(this.method === 'adadelta') {
              // assume adadelta if not sgd or adagrad
              gsumi[j] = this.ro * gsumi[j] + (1-this.ro) * gij * gij;
              var dx = - Math.sqrt((xsumi[j] + this.eps)/(gsumi[j] + this.eps)) * gij;
              xsumi[j] = this.ro * xsumi[j] + (1-this.ro) * dx * dx; // yes, xsum lags behind gsum by 1.
              p[j] += dx;
            } else {
              // assume SGD
              if(this.momentum > 0.0) {
                // momentum update
                var dx = this.momentum * gsumi[j] - this.learning_rate * gij; // step
                gsumi[j] = dx; // back this up for next iteration of momentum
                p[j] += dx; // apply corrected gradient
              } else {
                // vanilla sgd
                p[j] +=  - this.learning_rate * gij;
              }
            }
            g[j] = 0.0; // zero out gradient so that we can begin accumulating anew
          }
        }
      }

      // appending softmax_loss for backwards compatibility, but from now on we will always use cost_loss
      // in future, TODO: have to completely redo the way loss is done around the network as currently 
      // loss is a bit of a hack. Ideally, user should specify arbitrary number of loss functions on any layer
      // and it should all be computed correctly and automatically. 
      return {fwd_time: fwd_time, bwd_time: bwd_time, 
              l2_decay_loss: l2_decay_loss, l1_decay_loss: l1_decay_loss,
              cost_loss: cost_loss, softmax_loss: cost_loss, 
              loss: cost_loss + l1_decay_loss + l2_decay_loss}
    }
  }
  
  global.Trainer = Trainer;
  global.SGDTrainer = Trainer; // backwards compatibility
})(convnetjs);

(function(global) {
  "use strict";

  // used utilities, make explicit local references
  var randf = global.randf;
  var randi = global.randi;
  var Net = global.Net;
  var Trainer = global.Trainer;
  var maxmin = global.maxmin;
  var randperm = global.randperm;
  var weightedSample = global.weightedSample;
  var getopt = global.getopt;
  var arrUnique = global.arrUnique;

  /*
  A MagicNet takes data: a list of convnetjs.Vol(), and labels
  which for now are assumed to be class indeces 0..K. MagicNet then:
  - creates data folds for cross-validation
  - samples candidate networks
  - evaluates candidate networks on all data folds
  - produces predictions by model-averaging the best networks
  */
  var MagicNet = function(data, labels, opt) {
    var opt = opt || {};
    if(typeof data === 'undefined') { data = []; }
    if(typeof labels === 'undefined') { labels = []; }

    // required inputs
    this.data = data; // store these pointers to data
    this.labels = labels;

    // optional inputs
    this.train_ratio = getopt(opt, 'train_ratio', 0.7);
    this.num_folds = getopt(opt, 'num_folds', 10);
    this.num_candidates = getopt(opt, 'num_candidates', 50); // we evaluate several in parallel
    // how many epochs of data to train every network? for every fold?
    // higher values mean higher accuracy in final results, but more expensive
    this.num_epochs = getopt(opt, 'num_epochs', 50); 
    // number of best models to average during prediction. Usually higher = better
    this.ensemble_size = getopt(opt, 'ensemble_size', 10);

    // candidate parameters
    this.batch_size_min = getopt(opt, 'batch_size_min', 10);
    this.batch_size_max = getopt(opt, 'batch_size_max', 300);
    this.l2_decay_min = getopt(opt, 'l2_decay_min', -4);
    this.l2_decay_max = getopt(opt, 'l2_decay_max', 2);
    this.learning_rate_min = getopt(opt, 'learning_rate_min', -4);
    this.learning_rate_max = getopt(opt, 'learning_rate_max', 0);
    this.momentum_min = getopt(opt, 'momentum_min', 0.9);
    this.momentum_max = getopt(opt, 'momentum_max', 0.9);
    this.neurons_min = getopt(opt, 'neurons_min', 5);
    this.neurons_max = getopt(opt, 'neurons_max', 30);

    // computed
    this.folds = []; // data fold indices, gets filled by sampleFolds()
    this.candidates = []; // candidate networks that are being currently evaluated
    this.evaluated_candidates = []; // history of all candidates that were fully evaluated on all folds
    this.unique_labels = arrUnique(labels);
    this.iter = 0; // iteration counter, goes from 0 -> num_epochs * num_training_data
    this.foldix = 0; // index of active fold

    // callbacks
    this.finish_fold_callback = null;
    this.finish_batch_callback = null;

    // initializations
    if(this.data.length > 0) {
      this.sampleFolds();
      this.sampleCandidates();
    }
  };

  MagicNet.prototype = {

    // sets this.folds to a sampling of this.num_folds folds
    sampleFolds: function() {
      var N = this.data.length;
      var num_train = Math.floor(this.train_ratio * N);
      this.folds = []; // flush folds, if any
      for(var i=0;i<this.num_folds;i++) {
        var p = randperm(N);
        this.folds.push({train_ix: p.slice(0, num_train), test_ix: p.slice(num_train, N)});
      }
    },

    // returns a random candidate network
    sampleCandidate: function() {
      var input_depth = this.data[0].w.length;
      var num_classes = this.unique_labels.length;

      // sample network topology and hyperparameters
      var layer_defs = [];
      layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth: input_depth});
      var nl = weightedSample([0,1,2,3], [0.2, 0.3, 0.3, 0.2]); // prefer nets with 1,2 hidden layers
      for(var q=0;q<nl;q++) {
        var ni = randi(this.neurons_min, this.neurons_max);
        var act = ['tanh','maxout','relu'][randi(0,3)];
        if(randf(0,1)<0.5) {
          var dp = Math.random();
          layer_defs.push({type:'fc', num_neurons: ni, activation: act, drop_prob: dp});
        } else {
          layer_defs.push({type:'fc', num_neurons: ni, activation: act});
        }
      }
      layer_defs.push({type:'softmax', num_classes: num_classes});
      var net = new Net();
      net.makeLayers(layer_defs);

      // sample training hyperparameters
      var bs = randi(this.batch_size_min, this.batch_size_max); // batch size
      var l2 = Math.pow(10, randf(this.l2_decay_min, this.l2_decay_max)); // l2 weight decay
      var lr = Math.pow(10, randf(this.learning_rate_min, this.learning_rate_max)); // learning rate
      var mom = randf(this.momentum_min, this.momentum_max); // momentum. Lets just use 0.9, works okay usually ;p
      var tp = randf(0,1); // trainer type
      var trainer_def;
      if(tp<0.33) {
        trainer_def = {method:'adadelta', batch_size:bs, l2_decay:l2};
      } else if(tp<0.66) {
        trainer_def = {method:'adagrad', learning_rate: lr, batch_size:bs, l2_decay:l2};
      } else {
        trainer_def = {method:'sgd', learning_rate: lr, momentum: mom, batch_size:bs, l2_decay:l2};
      }
      
      var trainer = new Trainer(net, trainer_def);

      var cand = {};
      cand.acc = [];
      cand.accv = 0; // this will maintained as sum(acc) for convenience
      cand.layer_defs = layer_defs;
      cand.trainer_def = trainer_def;
      cand.net = net;
      cand.trainer = trainer;
      return cand;
    },

    // sets this.candidates with this.num_candidates candidate nets
    sampleCandidates: function() {
      this.candidates = []; // flush, if any
      for(var i=0;i<this.num_candidates;i++) {
        var cand = this.sampleCandidate();
        this.candidates.push(cand);
      }
    },

    step: function() {
      
      // run an example through current candidate
      this.iter++;

      // step all candidates on a random data point
      var fold = this.folds[this.foldix]; // active fold
      var dataix = fold.train_ix[randi(0, fold.train_ix.length)];
      for(var k=0;k<this.candidates.length;k++) {
        var x = this.data[dataix];
        var l = this.labels[dataix];
        this.candidates[k].trainer.train(x, l);
      }

      // process consequences: sample new folds, or candidates
      var lastiter = this.num_epochs * fold.train_ix.length;
      if(this.iter >= lastiter) {
        // finished evaluation of this fold. Get final validation
        // accuracies, record them, and go on to next fold.
        var val_acc = this.evalValErrors();
        for(var k=0;k<this.candidates.length;k++) {
          var c = this.candidates[k];
          c.acc.push(val_acc[k]);
          c.accv += val_acc[k];
        }
        this.iter = 0; // reset step number
        this.foldix++; // increment fold

        if(this.finish_fold_callback !== null) {
          this.finish_fold_callback();
        }

        if(this.foldix >= this.folds.length) {
          // we finished all folds as well! Record these candidates
          // and sample new ones to evaluate.
          for(var k=0;k<this.candidates.length;k++) {
            this.evaluated_candidates.push(this.candidates[k]);
          }
          // sort evaluated candidates according to accuracy achieved
          this.evaluated_candidates.sort(function(a, b) { 
            return (a.accv / a.acc.length) 
                 > (b.accv / b.acc.length) 
                 ? -1 : 1;
          });
          // and clip only to the top few ones (lets place limit at 3*ensemble_size)
          // otherwise there are concerns with keeping these all in memory 
          // if MagicNet is being evaluated for a very long time
          if(this.evaluated_candidates.length > 3 * this.ensemble_size) {
            this.evaluated_candidates = this.evaluated_candidates.slice(0, 3 * this.ensemble_size);
          }
          if(this.finish_batch_callback !== null) {
            this.finish_batch_callback();
          }
          this.sampleCandidates(); // begin with new candidates
          this.foldix = 0; // reset this
        } else {
          // we will go on to another fold. reset all candidates nets
          for(var k=0;k<this.candidates.length;k++) {
            var c = this.candidates[k];
            var net = new Net();
            net.makeLayers(c.layer_defs);
            var trainer = new Trainer(net, c.trainer_def);
            c.net = net;
            c.trainer = trainer;
          }
        }
      }
    },

    evalValErrors: function() {
      // evaluate candidates on validation data and return performance of current networks
      // as simple list
      var vals = [];
      var fold = this.folds[this.foldix]; // active fold
      for(var k=0;k<this.candidates.length;k++) {
        var net = this.candidates[k].net;
        var v = 0.0;
        for(var q=0;q<fold.test_ix.length;q++) {
          var x = this.data[fold.test_ix[q]];
          var l = this.labels[fold.test_ix[q]];
          net.forward(x);
          var yhat = net.getPrediction();
          v += (yhat === l ? 1.0 : 0.0); // 0 1 loss
        }
        v /= fold.test_ix.length; // normalize
        vals.push(v);
      }
      return vals;
    },

    // returns prediction scores for given test data point, as Vol
    // uses an averaged prediction from the best ensemble_size models
    // x is a Vol.
    predict_soft: function(data) {
      // forward prop the best networks
      // and accumulate probabilities at last layer into a an output Vol
      var nv = Math.min(this.ensemble_size, this.evaluated_candidates.length);
      if(nv === 0) { return new convnetjs.Vol(0,0,0); } // not sure what to do here? we're not ready yet
      var xout, n;
      for(var j=0;j<nv;j++) {
        var net = this.evaluated_candidates[j].net;
        var x = net.forward(data);
        if(j===0) { 
          xout = x; 
          n = x.w.length; 
        } else {
          // add it on
          for(var d=0;d<n;d++) {
            xout.w[d] += x.w[d];
          }
        }
      }
      // produce average
      for(var d=0;d<n;d++) {
        xout.w[d] /= n;
      }
      return xout;
    },

    predict: function(data) {
      var xout = this.predict_soft(data);
      if(xout.w.length !== 0) {
        var stats = maxmin(xout.w);
        var predicted_label = stats.maxi; 
      } else {
        var predicted_label = -1; // error out
      }
      return predicted_label;

    },

    toJSON: function() {
      // dump the top ensemble_size networks as a list
      var nv = Math.min(this.ensemble_size, this.evaluated_candidates.length);
      var json = {};
      json.nets = [];
      for(var i=0;i<nv;i++) {
        json.nets.push(this.evaluated_candidates[i].net.toJSON());
      }
      return json;
    },

    fromJSON: function(json) {
      this.ensemble_size = json.nets.length;
      this.evaluated_candidates = [];
      for(var i=0;i<this.ensemble_size;i++) {
        var net = new Net();
        net.fromJSON(json.nets[i]);
        var dummy_candidate = {};
        dummy_candidate.net = net;
        this.evaluated_candidates.push(dummy_candidate);
      }
    },

    // callback functions
    // called when a fold is finished, while evaluating a batch
    onFinishFold: function(f) { this.finish_fold_callback = f; },
    // called when a batch of candidates has finished evaluating
    onFinishBatch: function(f) { this.finish_batch_callback = f; }
    
  };

  global.MagicNet = MagicNet;
})(convnetjs);
(function(lib) {
  "use strict";
  if ( false || typeof module.exports === "undefined") {
    window.jsfeat = lib; // in ordinary browser attach library to window
  } else {
    module.exports = lib; // in nodejs
  }
})(convnetjs);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNTY0YTY2NjE4OTY1Y2YzZTM3NWQud29ya2VyLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AY21hby9jb2RlbWFvLWFpL2Rpc3QvZXM2L2FpX2xvZ2ljcy9jbGFzc2lmeV9haS9jbGFzc2lmeV9jb250cm9sbGVyL3dvcmtlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGNtYW8vY29kZW1hby1haS9kaXN0L2VzNi9haV9sb2dpY3MvZGVmcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29udm5ldGpzL2J1aWxkL2NvbnZuZXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9ub2RlX21vZHVsZXMvQGNtYW8vY29kZW1hby1haS9kaXN0L2VzNi9haV9sb2dpY3MvY2xhc3NpZnlfYWkvY2xhc3NpZnlfY29udHJvbGxlci93b3JrZXIuanNcIik7XG4iLCJpbXBvcnQgKiBhcyBjb252bmV0anMgZnJvbSAnY29udm5ldGpzJztcbmltcG9ydCB7IFJBTkdFX1RSQUlOSU5HX0RBVEEsIFNJWkVfUFJFVklFV19ESUFHUkFNIH0gZnJvbSAnLi4vLi4vZGVmcyc7XG52YXIgY3R4ID0gc2VsZjtcbnZhciBzZW5kTWVzc2FnZSA9IHNlbGYucG9zdE1lc3NhZ2U7XG5jdHguYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgdmFyIHJlY2VpdmVfZGF0YSA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcbiAgICB2YXIgdHlwZSA9IHJlY2VpdmVfZGF0YS50eXBlO1xuICAgIHZhciBzZW5kX2RhdGEgPSB7fTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSAndHJhaW4nOlxuICAgICAgICAgICAgdmFyIHRyYWluX25ldCA9IG5ldyBjb252bmV0anMuTmV0KCk7XG4gICAgICAgICAgICB0cmFpbl9uZXQuZnJvbUpTT04ocmVjZWl2ZV9kYXRhLm1vZGVsKTtcbiAgICAgICAgICAgIHZhciBpbnB1dF9hcnJheSA9IHJlY2VpdmVfZGF0YS5pbnB1dDtcbiAgICAgICAgICAgIHZhciBvdXRwdXRfYXJyYXkgPSByZWNlaXZlX2RhdGEub3V0cHV0O1xuICAgICAgICAgICAgdmFyIHRyYWluX21heCA9IHJlY2VpdmVfZGF0YS5tYXg7XG4gICAgICAgICAgICB2YXIgdHJhaW5fbWluXzEgPSByZWNlaXZlX2RhdGEubWluO1xuICAgICAgICAgICAgdmFyIHRyYWluX2xlbmd0aF8xID0gW107XG4gICAgICAgICAgICB0cmFpbl9tYXguZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICB0cmFpbl9sZW5ndGhfMVtpbmRleF0gPSBpdGVtIC0gdHJhaW5fbWluXzFbaW5kZXhdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgZGltZW5zaW9uID0gaW5wdXRfYXJyYXkubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIHggPSBuZXcgY29udm5ldGpzLlZvbCgxLCAxLCBkaW1lbnNpb24pO1xuICAgICAgICAgICAgdmFyIHRyYWluZXIgPSBuZXcgY29udm5ldGpzLlRyYWluZXIodHJhaW5fbmV0LCB7IG1ldGhvZDogJ2FkYWdyYWQnLCBsMl9kZWNheTogMC4wMDEsIGwxX2RlY2F5OiAwLjAwMSwgYmF0Y2hfc2l6ZTogMjAgfSk7XG4gICAgICAgICAgICBmb3IgKHZhciBsb29wX3RpbWUgPSAwOyBsb29wX3RpbWUgPCAyMDsgbG9vcF90aW1lKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0X2FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0cmFpbl9kYXRhID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaW5wdXRfYXJyYXlbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cmFpbl9sZW5ndGhfMVtqXSAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhaW5fZGF0YVtqXSA9IChpbnB1dF9hcnJheVtpXVtqXSAtIHRyYWluX21pbl8xW2pdKSAvIHRyYWluX2xlbmd0aF8xW2pdICogMTAgLSA1O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhaW5fZGF0YVtqXSA9IGlucHV0X2FycmF5W2ldW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHgudyA9IHRyYWluX2RhdGE7XG4gICAgICAgICAgICAgICAgICAgIHRyYWluZXIudHJhaW4oeCwgb3V0cHV0X2FycmF5W2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZW5kX2RhdGFbJ25ldCddID0gdHJhaW5fbmV0LnRvSlNPTigpO1xuICAgICAgICAgICAgc2VuZF9kYXRhWyd0eXBlJ10gPSAndHJhaW4nO1xuICAgICAgICAgICAgc2VuZF9kYXRhWydpZCddID0gcmVjZWl2ZV9kYXRhLmlkO1xuICAgICAgICAgICAgc2VuZE1lc3NhZ2Uoc2VuZF9kYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdkcmF3JzpcbiAgICAgICAgICAgIHZhciBkcmF3X25ldCA9IG5ldyBjb252bmV0anMuTmV0KCk7XG4gICAgICAgICAgICBkcmF3X25ldC5mcm9tSlNPTihyZWNlaXZlX2RhdGEubW9kZWwpO1xuICAgICAgICAgICAgdmFyIHN0ZXAgPSAoUkFOR0VfVFJBSU5JTkdfREFUQVsxXSAtIFJBTkdFX1RSQUlOSU5HX0RBVEFbMF0pIC8gU0laRV9QUkVWSUVXX0RJQUdSQU07XG4gICAgICAgICAgICB2YXIgZHJhd19kYXRhID0gW107XG4gICAgICAgICAgICB2YXIgbnVtX2xpbmUgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgZHggPSBSQU5HRV9UUkFJTklOR19EQVRBWzBdOyBkeCA8IFJBTkdFX1RSQUlOSU5HX0RBVEFbMV07IGR4ID0gTnVtYmVyKChkeCArIHN0ZXApLnRvRml4ZWQoMSkpKSB7XG4gICAgICAgICAgICAgICAgZHJhd19kYXRhW251bV9saW5lXSA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBfbG9vcF8xID0gZnVuY3Rpb24gKGR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0X25vZGUgPSBuZXcgY29udm5ldGpzLlZvbChbZHgsIGR5XSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzY29yZXMgPSBkcmF3X25ldC5mb3J3YXJkKHRlc3Rfbm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYWluX2NsYXNzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJlbmNobWFyayA9IDEgLyBzY29yZXMudy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkZW5zaXR5ID0gYmVuY2htYXJrO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVjZWl2ZV9kYXRhLmlzX3NpbXBsZV9tb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZW5zaXR5ID0gMC44O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcmVzLncuZm9yRWFjaChmdW5jdGlvbiAod2VpZ2h0LCBjbGFzc19pbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3ZWlnaHQgPiBiZW5jaG1hcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbl9jbGFzcyA9IGNsYXNzX2luZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZW5zaXR5ID0gd2VpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVuc2l0eSA9IChkZW5zaXR5IC0gYmVuY2htYXJrKSAvICgxIC0gYmVuY2htYXJrKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkcmF3X2RhdGFbbnVtX2xpbmVdLnVuc2hpZnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NfaW5kZXg6IG1haW5fY2xhc3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZW5zaXR5OiBkZW5zaXR5LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGR5ID0gUkFOR0VfVFJBSU5JTkdfREFUQVswXTsgZHkgPCBSQU5HRV9UUkFJTklOR19EQVRBWzFdOyBkeSA9IE51bWJlcigoZHkgKyBzdGVwKS50b0ZpeGVkKDEpKSkge1xuICAgICAgICAgICAgICAgICAgICBfbG9vcF8xKGR5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbnVtX2xpbmUrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbmRfZGF0YVsnb3V0cHV0X2RhdGEnXSA9IGRyYXdfZGF0YTtcbiAgICAgICAgICAgIHNlbmRfZGF0YVsndHlwZSddID0gJ2RyYXcnO1xuICAgICAgICAgICAgc2VuZF9kYXRhWydpZCddID0gcmVjZWl2ZV9kYXRhLmlkO1xuICAgICAgICAgICAgc2VuZE1lc3NhZ2Uoc2VuZF9kYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn0pO1xuIiwiZXhwb3J0IHZhciBSQU5HRV9UUkFJTklOR19EQVRBID0gWy01LCA1XTtcbmV4cG9ydCB2YXIgUkFOR0VfTlVNX05FVVJPTlMgPSBbMSwgNV07XG5leHBvcnQgdmFyIFNJWkVfUFJFVklFV19ESUFHUkFNID0gNTA7XG5leHBvcnQgdmFyIFdJRFRIX1BSRVZJRVdfRElBR1JBTSA9IDI1MDtcbmV4cG9ydCB2YXIgREVGQVVMVF9MQVlFUl9JTkZPID0ge1xuICAgIGlucHV0OiAyLFxuICAgIGhpZGRlbnM6IFs0LCA0XSxcbiAgICBvdXRwdXQ6IDIsXG59O1xuIiwidmFyIGNvbnZuZXRqcyA9IGNvbnZuZXRqcyB8fCB7IFJFVklTSU9OOiAnQUxQSEEnIH07XG4oZnVuY3Rpb24oZ2xvYmFsKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8vIFJhbmRvbSBudW1iZXIgdXRpbGl0aWVzXG4gIHZhciByZXR1cm5fdiA9IGZhbHNlO1xuICB2YXIgdl92YWwgPSAwLjA7XG4gIHZhciBnYXVzc1JhbmRvbSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHJldHVybl92KSB7IFxuICAgICAgcmV0dXJuX3YgPSBmYWxzZTtcbiAgICAgIHJldHVybiB2X3ZhbDsgXG4gICAgfVxuICAgIHZhciB1ID0gMipNYXRoLnJhbmRvbSgpLTE7XG4gICAgdmFyIHYgPSAyKk1hdGgucmFuZG9tKCktMTtcbiAgICB2YXIgciA9IHUqdSArIHYqdjtcbiAgICBpZihyID09IDAgfHwgciA+IDEpIHJldHVybiBnYXVzc1JhbmRvbSgpO1xuICAgIHZhciBjID0gTWF0aC5zcXJ0KC0yKk1hdGgubG9nKHIpL3IpO1xuICAgIHZfdmFsID0gdipjOyAvLyBjYWNoZSB0aGlzXG4gICAgcmV0dXJuX3YgPSB0cnVlO1xuICAgIHJldHVybiB1KmM7XG4gIH1cbiAgdmFyIHJhbmRmID0gZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gTWF0aC5yYW5kb20oKSooYi1hKSthOyB9XG4gIHZhciByYW5kaSA9IGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSooYi1hKSthKTsgfVxuICB2YXIgcmFuZG4gPSBmdW5jdGlvbihtdSwgc3RkKXsgcmV0dXJuIG11K2dhdXNzUmFuZG9tKCkqc3RkOyB9XG5cbiAgLy8gQXJyYXkgdXRpbGl0aWVzXG4gIHZhciB6ZXJvcyA9IGZ1bmN0aW9uKG4pIHtcbiAgICBpZih0eXBlb2Yobik9PT0ndW5kZWZpbmVkJyB8fCBpc05hTihuKSkgeyByZXR1cm4gW107IH1cbiAgICBpZih0eXBlb2YgQXJyYXlCdWZmZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAvLyBsYWNraW5nIGJyb3dzZXIgc3VwcG9ydFxuICAgICAgdmFyIGFyciA9IG5ldyBBcnJheShuKTtcbiAgICAgIGZvcih2YXIgaT0wO2k8bjtpKyspIHsgYXJyW2ldPSAwOyB9XG4gICAgICByZXR1cm4gYXJyO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IEZsb2F0NjRBcnJheShuKTtcbiAgICB9XG4gIH1cblxuICB2YXIgYXJyQ29udGFpbnMgPSBmdW5jdGlvbihhcnIsIGVsdCkge1xuICAgIGZvcih2YXIgaT0wLG49YXJyLmxlbmd0aDtpPG47aSsrKSB7XG4gICAgICBpZihhcnJbaV09PT1lbHQpIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgYXJyVW5pcXVlID0gZnVuY3Rpb24oYXJyKSB7XG4gICAgdmFyIGIgPSBbXTtcbiAgICBmb3IodmFyIGk9MCxuPWFyci5sZW5ndGg7aTxuO2krKykge1xuICAgICAgaWYoIWFyckNvbnRhaW5zKGIsIGFycltpXSkpIHtcbiAgICAgICAgYi5wdXNoKGFycltpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBiO1xuICB9XG5cbiAgLy8gcmV0dXJuIG1heCBhbmQgbWluIG9mIGEgZ2l2ZW4gbm9uLWVtcHR5IGFycmF5LlxuICB2YXIgbWF4bWluID0gZnVuY3Rpb24odykge1xuICAgIGlmKHcubGVuZ3RoID09PSAwKSB7IHJldHVybiB7fTsgfSAvLyAuLi4gO3NcbiAgICB2YXIgbWF4diA9IHdbMF07XG4gICAgdmFyIG1pbnYgPSB3WzBdO1xuICAgIHZhciBtYXhpID0gMDtcbiAgICB2YXIgbWluaSA9IDA7XG4gICAgdmFyIG4gPSB3Lmxlbmd0aDtcbiAgICBmb3IodmFyIGk9MTtpPG47aSsrKSB7XG4gICAgICBpZih3W2ldID4gbWF4dikgeyBtYXh2ID0gd1tpXTsgbWF4aSA9IGk7IH0gXG4gICAgICBpZih3W2ldIDwgbWludikgeyBtaW52ID0gd1tpXTsgbWluaSA9IGk7IH0gXG4gICAgfVxuICAgIHJldHVybiB7bWF4aTogbWF4aSwgbWF4djogbWF4diwgbWluaTogbWluaSwgbWludjogbWludiwgZHY6bWF4di1taW52fTtcbiAgfVxuXG4gIC8vIGNyZWF0ZSByYW5kb20gcGVybXV0YXRpb24gb2YgbnVtYmVycywgaW4gcmFuZ2UgWzAuLi5uLTFdXG4gIHZhciByYW5kcGVybSA9IGZ1bmN0aW9uKG4pIHtcbiAgICB2YXIgaSA9IG4sXG4gICAgICAgIGogPSAwLFxuICAgICAgICB0ZW1wO1xuICAgIHZhciBhcnJheSA9IFtdO1xuICAgIGZvcih2YXIgcT0wO3E8bjtxKyspYXJyYXlbcV09cTtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSsxKSk7XG4gICAgICAgIHRlbXAgPSBhcnJheVtpXTtcbiAgICAgICAgYXJyYXlbaV0gPSBhcnJheVtqXTtcbiAgICAgICAgYXJyYXlbal0gPSB0ZW1wO1xuICAgIH1cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICAvLyBzYW1wbGUgZnJvbSBsaXN0IGxzdCBhY2NvcmRpbmcgdG8gcHJvYmFiaWxpdGllcyBpbiBsaXN0IHByb2JzXG4gIC8vIHRoZSB0d28gbGlzdHMgYXJlIG9mIHNhbWUgc2l6ZSwgYW5kIHByb2JzIGFkZHMgdXAgdG8gMVxuICB2YXIgd2VpZ2h0ZWRTYW1wbGUgPSBmdW5jdGlvbihsc3QsIHByb2JzKSB7XG4gICAgdmFyIHAgPSByYW5kZigwLCAxLjApO1xuICAgIHZhciBjdW1wcm9iID0gMC4wO1xuICAgIGZvcih2YXIgaz0wLG49bHN0Lmxlbmd0aDtrPG47aysrKSB7XG4gICAgICBjdW1wcm9iICs9IHByb2JzW2tdO1xuICAgICAgaWYocCA8IGN1bXByb2IpIHsgcmV0dXJuIGxzdFtrXTsgfVxuICAgIH1cbiAgfVxuXG4gIC8vIHN5bnRhY3RpYyBzdWdhciBmdW5jdGlvbiBmb3IgZ2V0dGluZyBkZWZhdWx0IHBhcmFtZXRlciB2YWx1ZXNcbiAgdmFyIGdldG9wdCA9IGZ1bmN0aW9uKG9wdCwgZmllbGRfbmFtZSwgZGVmYXVsdF92YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2Ygb3B0W2ZpZWxkX25hbWVdICE9PSAndW5kZWZpbmVkJyA/IG9wdFtmaWVsZF9uYW1lXSA6IGRlZmF1bHRfdmFsdWU7XG4gIH1cblxuICBnbG9iYWwucmFuZGYgPSByYW5kZjtcbiAgZ2xvYmFsLnJhbmRpID0gcmFuZGk7XG4gIGdsb2JhbC5yYW5kbiA9IHJhbmRuO1xuICBnbG9iYWwuemVyb3MgPSB6ZXJvcztcbiAgZ2xvYmFsLm1heG1pbiA9IG1heG1pbjtcbiAgZ2xvYmFsLnJhbmRwZXJtID0gcmFuZHBlcm07XG4gIGdsb2JhbC53ZWlnaHRlZFNhbXBsZSA9IHdlaWdodGVkU2FtcGxlO1xuICBnbG9iYWwuYXJyVW5pcXVlID0gYXJyVW5pcXVlO1xuICBnbG9iYWwuYXJyQ29udGFpbnMgPSBhcnJDb250YWlucztcbiAgZ2xvYmFsLmdldG9wdCA9IGdldG9wdDtcbiAgXG59KShjb252bmV0anMpO1xuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvLyBWb2wgaXMgdGhlIGJhc2ljIGJ1aWxkaW5nIGJsb2NrIG9mIGFsbCBkYXRhIGluIGEgbmV0LlxuICAvLyBpdCBpcyBlc3NlbnRpYWxseSBqdXN0IGEgM0Qgdm9sdW1lIG9mIG51bWJlcnMsIHdpdGggYVxuICAvLyB3aWR0aCAoc3gpLCBoZWlnaHQgKHN5KSwgYW5kIGRlcHRoIChkZXB0aCkuXG4gIC8vIGl0IGlzIHVzZWQgdG8gaG9sZCBkYXRhIGZvciBhbGwgZmlsdGVycywgYWxsIHZvbHVtZXMsXG4gIC8vIGFsbCB3ZWlnaHRzLCBhbmQgYWxzbyBzdG9yZXMgYWxsIGdyYWRpZW50cyB3LnIudC4gXG4gIC8vIHRoZSBkYXRhLiBjIGlzIG9wdGlvbmFsbHkgYSB2YWx1ZSB0byBpbml0aWFsaXplIHRoZSB2b2x1bWVcbiAgLy8gd2l0aC4gSWYgYyBpcyBtaXNzaW5nLCBmaWxscyB0aGUgVm9sIHdpdGggcmFuZG9tIG51bWJlcnMuXG4gIHZhciBWb2wgPSBmdW5jdGlvbihzeCwgc3ksIGRlcHRoLCBjKSB7XG4gICAgLy8gdGhpcyBpcyBob3cgeW91IGNoZWNrIGlmIGEgdmFyaWFibGUgaXMgYW4gYXJyYXkuIE9oLCBKYXZhc2NyaXB0IDopXG4gICAgaWYoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN4KSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgLy8gd2Ugd2VyZSBnaXZlbiBhIGxpc3QgaW4gc3gsIGFzc3VtZSAxRCB2b2x1bWUgYW5kIGZpbGwgaXQgdXBcbiAgICAgIHRoaXMuc3ggPSAxO1xuICAgICAgdGhpcy5zeSA9IDE7XG4gICAgICB0aGlzLmRlcHRoID0gc3gubGVuZ3RoO1xuICAgICAgLy8gd2UgaGF2ZSB0byBkbyB0aGUgZm9sbG93aW5nIGNvcHkgYmVjYXVzZSB3ZSB3YW50IHRvIHVzZVxuICAgICAgLy8gZmFzdCB0eXBlZCBhcnJheXMsIG5vdCBhbiBvcmRpbmFyeSBqYXZhc2NyaXB0IGFycmF5XG4gICAgICB0aGlzLncgPSBnbG9iYWwuemVyb3ModGhpcy5kZXB0aCk7XG4gICAgICB0aGlzLmR3ID0gZ2xvYmFsLnplcm9zKHRoaXMuZGVwdGgpO1xuICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLmRlcHRoO2krKykge1xuICAgICAgICB0aGlzLndbaV0gPSBzeFtpXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gd2Ugd2VyZSBnaXZlbiBkaW1lbnNpb25zIG9mIHRoZSB2b2xcbiAgICAgIHRoaXMuc3ggPSBzeDtcbiAgICAgIHRoaXMuc3kgPSBzeTtcbiAgICAgIHRoaXMuZGVwdGggPSBkZXB0aDtcbiAgICAgIHZhciBuID0gc3gqc3kqZGVwdGg7XG4gICAgICB0aGlzLncgPSBnbG9iYWwuemVyb3Mobik7XG4gICAgICB0aGlzLmR3ID0gZ2xvYmFsLnplcm9zKG4pO1xuICAgICAgaWYodHlwZW9mIGMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIHdlaWdodCBub3JtYWxpemF0aW9uIGlzIGRvbmUgdG8gZXF1YWxpemUgdGhlIG91dHB1dFxuICAgICAgICAvLyB2YXJpYW5jZSBvZiBldmVyeSBuZXVyb24sIG90aGVyd2lzZSBuZXVyb25zIHdpdGggYSBsb3RcbiAgICAgICAgLy8gb2YgaW5jb21pbmcgY29ubmVjdGlvbnMgaGF2ZSBvdXRwdXRzIG9mIGxhcmdlciB2YXJpYW5jZVxuICAgICAgICB2YXIgc2NhbGUgPSBNYXRoLnNxcnQoMS4wLyhzeCpzeSpkZXB0aCkpO1xuICAgICAgICBmb3IodmFyIGk9MDtpPG47aSsrKSB7IFxuICAgICAgICAgIHRoaXMud1tpXSA9IGdsb2JhbC5yYW5kbigwLjAsIHNjYWxlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yKHZhciBpPTA7aTxuO2krKykgeyBcbiAgICAgICAgICB0aGlzLndbaV0gPSBjO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgVm9sLnByb3RvdHlwZSA9IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKHgsIHksIGQpIHsgXG4gICAgICB2YXIgaXg9KCh0aGlzLnN4ICogeSkreCkqdGhpcy5kZXB0aCtkO1xuICAgICAgcmV0dXJuIHRoaXMud1tpeF07XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKHgsIHksIGQsIHYpIHsgXG4gICAgICB2YXIgaXg9KCh0aGlzLnN4ICogeSkreCkqdGhpcy5kZXB0aCtkO1xuICAgICAgdGhpcy53W2l4XSA9IHY7IFxuICAgIH0sXG4gICAgYWRkOiBmdW5jdGlvbih4LCB5LCBkLCB2KSB7IFxuICAgICAgdmFyIGl4PSgodGhpcy5zeCAqIHkpK3gpKnRoaXMuZGVwdGgrZDtcbiAgICAgIHRoaXMud1tpeF0gKz0gdjsgXG4gICAgfSxcbiAgICBnZXRfZ3JhZDogZnVuY3Rpb24oeCwgeSwgZCkgeyBcbiAgICAgIHZhciBpeCA9ICgodGhpcy5zeCAqIHkpK3gpKnRoaXMuZGVwdGgrZDtcbiAgICAgIHJldHVybiB0aGlzLmR3W2l4XTsgXG4gICAgfSxcbiAgICBzZXRfZ3JhZDogZnVuY3Rpb24oeCwgeSwgZCwgdikgeyBcbiAgICAgIHZhciBpeCA9ICgodGhpcy5zeCAqIHkpK3gpKnRoaXMuZGVwdGgrZDtcbiAgICAgIHRoaXMuZHdbaXhdID0gdjsgXG4gICAgfSxcbiAgICBhZGRfZ3JhZDogZnVuY3Rpb24oeCwgeSwgZCwgdikgeyBcbiAgICAgIHZhciBpeCA9ICgodGhpcy5zeCAqIHkpK3gpKnRoaXMuZGVwdGgrZDtcbiAgICAgIHRoaXMuZHdbaXhdICs9IHY7IFxuICAgIH0sXG4gICAgY2xvbmVBbmRaZXJvOiBmdW5jdGlvbigpIHsgcmV0dXJuIG5ldyBWb2wodGhpcy5zeCwgdGhpcy5zeSwgdGhpcy5kZXB0aCwgMC4wKX0sXG4gICAgY2xvbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIFYgPSBuZXcgVm9sKHRoaXMuc3gsIHRoaXMuc3ksIHRoaXMuZGVwdGgsIDAuMCk7XG4gICAgICB2YXIgbiA9IHRoaXMudy5sZW5ndGg7XG4gICAgICBmb3IodmFyIGk9MDtpPG47aSsrKSB7IFYud1tpXSA9IHRoaXMud1tpXTsgfVxuICAgICAgcmV0dXJuIFY7XG4gICAgfSxcbiAgICBhZGRGcm9tOiBmdW5jdGlvbihWKSB7IGZvcih2YXIgaz0wO2s8dGhpcy53Lmxlbmd0aDtrKyspIHsgdGhpcy53W2tdICs9IFYud1trXTsgfX0sXG4gICAgYWRkRnJvbVNjYWxlZDogZnVuY3Rpb24oViwgYSkgeyBmb3IodmFyIGs9MDtrPHRoaXMudy5sZW5ndGg7aysrKSB7IHRoaXMud1trXSArPSBhKlYud1trXTsgfX0sXG4gICAgc2V0Q29uc3Q6IGZ1bmN0aW9uKGEpIHsgZm9yKHZhciBrPTA7azx0aGlzLncubGVuZ3RoO2srKykgeyB0aGlzLndba10gPSBhOyB9fSxcblxuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICAvLyB0b2RvOiB3ZSBtYXkgd2FudCB0byBvbmx5IHNhdmUgZCBtb3N0IHNpZ25pZmljYW50IGRpZ2l0cyB0byBzYXZlIHNwYWNlXG4gICAgICB2YXIganNvbiA9IHt9XG4gICAgICBqc29uLnN4ID0gdGhpcy5zeDsgXG4gICAgICBqc29uLnN5ID0gdGhpcy5zeTtcbiAgICAgIGpzb24uZGVwdGggPSB0aGlzLmRlcHRoO1xuICAgICAganNvbi53ID0gdGhpcy53O1xuICAgICAgcmV0dXJuIGpzb247XG4gICAgICAvLyB3ZSB3b250IGJhY2sgdXAgZ3JhZGllbnRzIHRvIHNhdmUgc3BhY2VcbiAgICB9LFxuICAgIGZyb21KU09OOiBmdW5jdGlvbihqc29uKSB7XG4gICAgICB0aGlzLnN4ID0ganNvbi5zeDtcbiAgICAgIHRoaXMuc3kgPSBqc29uLnN5O1xuICAgICAgdGhpcy5kZXB0aCA9IGpzb24uZGVwdGg7XG5cbiAgICAgIHZhciBuID0gdGhpcy5zeCp0aGlzLnN5KnRoaXMuZGVwdGg7XG4gICAgICB0aGlzLncgPSBnbG9iYWwuemVyb3Mobik7XG4gICAgICB0aGlzLmR3ID0gZ2xvYmFsLnplcm9zKG4pO1xuICAgICAgLy8gY29weSBvdmVyIHRoZSBlbGVtZW50cy5cbiAgICAgIGZvcih2YXIgaT0wO2k8bjtpKyspIHtcbiAgICAgICAgdGhpcy53W2ldID0ganNvbi53W2ldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdsb2JhbC5Wb2wgPSBWb2w7XG59KShjb252bmV0anMpO1xuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIFZvbCA9IGdsb2JhbC5Wb2w7IC8vIGNvbnZlbmllbmNlXG5cbiAgLy8gVm9sdW1lIHV0aWxpdGllc1xuICAvLyBpbnRlbmRlZCBmb3IgdXNlIHdpdGggZGF0YSBhdWdtZW50YXRpb25cbiAgLy8gY3JvcCBpcyB0aGUgc2l6ZSBvZiBvdXRwdXRcbiAgLy8gZHgsZHkgYXJlIG9mZnNldCB3cnQgaW5jb21pbmcgdm9sdW1lLCBvZiB0aGUgc2hpZnRcbiAgLy8gZmxpcGxyIGlzIGJvb2xlYW4gb24gd2hldGhlciB3ZSBhbHNvIHdhbnQgdG8gZmxpcCBsZWZ0PC0+cmlnaHRcbiAgdmFyIGF1Z21lbnQgPSBmdW5jdGlvbihWLCBjcm9wLCBkeCwgZHksIGZsaXBscikge1xuICAgIC8vIG5vdGUgYXNzdW1lcyBzcXVhcmUgb3V0cHV0cyBvZiBzaXplIGNyb3AgeCBjcm9wXG4gICAgaWYodHlwZW9mKGZsaXBscik9PT0ndW5kZWZpbmVkJykgdmFyIGZsaXBsciA9IGZhbHNlO1xuICAgIGlmKHR5cGVvZihkeCk9PT0ndW5kZWZpbmVkJykgdmFyIGR4ID0gZ2xvYmFsLnJhbmRpKDAsIFYuc3ggLSBjcm9wKTtcbiAgICBpZih0eXBlb2YoZHkpPT09J3VuZGVmaW5lZCcpIHZhciBkeSA9IGdsb2JhbC5yYW5kaSgwLCBWLnN5IC0gY3JvcCk7XG4gICAgXG4gICAgLy8gcmFuZG9tbHkgc2FtcGxlIGEgY3JvcCBpbiB0aGUgaW5wdXQgdm9sdW1lXG4gICAgdmFyIFc7XG4gICAgaWYoY3JvcCAhPT0gVi5zeCB8fCBkeCE9PTAgfHwgZHkhPT0wKSB7XG4gICAgICBXID0gbmV3IFZvbChjcm9wLCBjcm9wLCBWLmRlcHRoLCAwLjApO1xuICAgICAgZm9yKHZhciB4PTA7eDxjcm9wO3grKykge1xuICAgICAgICBmb3IodmFyIHk9MDt5PGNyb3A7eSsrKSB7XG4gICAgICAgICAgaWYoeCtkeDwwIHx8IHgrZHg+PVYuc3ggfHwgeStkeTwwIHx8IHkrZHk+PVYuc3kpIGNvbnRpbnVlOyAvLyBvb2JcbiAgICAgICAgICBmb3IodmFyIGQ9MDtkPFYuZGVwdGg7ZCsrKSB7XG4gICAgICAgICAgIFcuc2V0KHgseSxkLFYuZ2V0KHgrZHgseStkeSxkKSk7IC8vIGNvcHkgZGF0YSBvdmVyXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIFcgPSBWO1xuICAgIH1cblxuICAgIGlmKGZsaXBscikge1xuICAgICAgLy8gZmxpcCB2b2x1bWUgaG9yemlvbnRhbGx5XG4gICAgICB2YXIgVzIgPSBXLmNsb25lQW5kWmVybygpO1xuICAgICAgZm9yKHZhciB4PTA7eDxXLnN4O3grKykge1xuICAgICAgICBmb3IodmFyIHk9MDt5PFcuc3k7eSsrKSB7XG4gICAgICAgICAgZm9yKHZhciBkPTA7ZDxXLmRlcHRoO2QrKykge1xuICAgICAgICAgICBXMi5zZXQoeCx5LGQsVy5nZXQoVy5zeCAtIHggLSAxLHksZCkpOyAvLyBjb3B5IGRhdGEgb3ZlclxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgVyA9IFcyOyAvL3N3YXBcbiAgICB9XG4gICAgcmV0dXJuIFc7XG4gIH1cblxuICAvLyBpbWcgaXMgYSBET00gZWxlbWVudCB0aGF0IGNvbnRhaW5zIGEgbG9hZGVkIGltYWdlXG4gIC8vIHJldHVybnMgYSBWb2wgb2Ygc2l6ZSAoVywgSCwgNCkuIDQgaXMgZm9yIFJHQkFcbiAgdmFyIGltZ190b192b2wgPSBmdW5jdGlvbihpbWcsIGNvbnZlcnRfZ3JheXNjYWxlKSB7XG5cbiAgICBpZih0eXBlb2YoY29udmVydF9ncmF5c2NhbGUpPT09J3VuZGVmaW5lZCcpIHZhciBjb252ZXJ0X2dyYXlzY2FsZSA9IGZhbHNlO1xuXG4gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIGNhbnZhcy53aWR0aCA9IGltZy53aWR0aDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gaW1nLmhlaWdodDtcbiAgICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAgIC8vIGR1ZSB0byBhIEZpcmVmb3ggYnVnXG4gICAgdHJ5IHtcbiAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZS5uYW1lID09PSBcIk5TX0VSUk9SX05PVF9BVkFJTEFCTEVcIikge1xuICAgICAgICAvLyBzb21ldGltZXMgaGFwcGVucywgbGV0cyBqdXN0IGFib3J0XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHZhciBpbWdfZGF0YSA9IGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZihlLm5hbWUgPT09ICdJbmRleFNpemVFcnJvcicpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBub3Qgc3VyZSB3aGF0IGNhdXNlcyB0aGlzIHNvbWV0aW1lcyBidXQgb2theSBhYm9ydFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBwcmVwYXJlIHRoZSBpbnB1dDogZ2V0IHBpeGVscyBhbmQgbm9ybWFsaXplIHRoZW1cbiAgICB2YXIgcCA9IGltZ19kYXRhLmRhdGE7XG4gICAgdmFyIFcgPSBpbWcud2lkdGg7XG4gICAgdmFyIEggPSBpbWcuaGVpZ2h0O1xuICAgIHZhciBwdiA9IFtdXG4gICAgZm9yKHZhciBpPTA7aTxwLmxlbmd0aDtpKyspIHtcbiAgICAgIHB2LnB1c2gocFtpXS8yNTUuMC0wLjUpOyAvLyBub3JtYWxpemUgaW1hZ2UgcGl4ZWxzIHRvIFstMC41LCAwLjVdXG4gICAgfVxuICAgIHZhciB4ID0gbmV3IFZvbChXLCBILCA0LCAwLjApOyAvL2lucHV0IHZvbHVtZSAoaW1hZ2UpXG4gICAgeC53ID0gcHY7XG5cbiAgICBpZihjb252ZXJ0X2dyYXlzY2FsZSkge1xuICAgICAgLy8gZmxhdHRlbiBpbnRvIGRlcHRoPTEgYXJyYXlcbiAgICAgIHZhciB4MSA9IG5ldyBWb2woVywgSCwgMSwgMC4wKTtcbiAgICAgIGZvcih2YXIgaT0wO2k8VztpKyspIHtcbiAgICAgICAgZm9yKHZhciBqPTA7ajxIO2orKykge1xuICAgICAgICAgIHgxLnNldChpLGosMCx4LmdldChpLGosMCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB4ID0geDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHg7XG4gIH1cbiAgXG4gIGdsb2JhbC5hdWdtZW50ID0gYXVnbWVudDtcbiAgZ2xvYmFsLmltZ190b192b2wgPSBpbWdfdG9fdm9sO1xuXG59KShjb252bmV0anMpO1xuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIFZvbCA9IGdsb2JhbC5Wb2w7IC8vIGNvbnZlbmllbmNlXG5cbiAgLy8gVGhpcyBmaWxlIGNvbnRhaW5zIGFsbCBsYXllcnMgdGhhdCBkbyBkb3QgcHJvZHVjdHMgd2l0aCBpbnB1dCxcbiAgLy8gYnV0IHVzdWFsbHkgaW4gYSBkaWZmZXJlbnQgY29ubmVjdGl2aXR5IHBhdHRlcm4gYW5kIHdlaWdodCBzaGFyaW5nXG4gIC8vIHNjaGVtZXM6IFxuICAvLyAtIEZ1bGx5Q29ubiBpcyBmdWxseSBjb25uZWN0ZWQgZG90IHByb2R1Y3RzIFxuICAvLyAtIENvbnZMYXllciBkb2VzIGNvbnZvbHV0aW9ucyAoc28gd2VpZ2h0IHNoYXJpbmcgc3BhdGlhbGx5KVxuICAvLyBwdXR0aW5nIHRoZW0gdG9nZXRoZXIgaW4gb25lIGZpbGUgYmVjYXVzZSB0aGV5IGFyZSB2ZXJ5IHNpbWlsYXJcbiAgdmFyIENvbnZMYXllciA9IGZ1bmN0aW9uKG9wdCkge1xuICAgIHZhciBvcHQgPSBvcHQgfHwge307XG5cbiAgICAvLyByZXF1aXJlZFxuICAgIHRoaXMub3V0X2RlcHRoID0gb3B0LmZpbHRlcnM7XG4gICAgdGhpcy5zeCA9IG9wdC5zeDsgLy8gZmlsdGVyIHNpemUuIFNob3VsZCBiZSBvZGQgaWYgcG9zc2libGUsIGl0J3MgY2xlYW5lci5cbiAgICB0aGlzLmluX2RlcHRoID0gb3B0LmluX2RlcHRoO1xuICAgIHRoaXMuaW5fc3ggPSBvcHQuaW5fc3g7XG4gICAgdGhpcy5pbl9zeSA9IG9wdC5pbl9zeTtcbiAgICBcbiAgICAvLyBvcHRpb25hbFxuICAgIHRoaXMuc3kgPSB0eXBlb2Ygb3B0LnN5ICE9PSAndW5kZWZpbmVkJyA/IG9wdC5zeSA6IHRoaXMuc3g7XG4gICAgdGhpcy5zdHJpZGUgPSB0eXBlb2Ygb3B0LnN0cmlkZSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHQuc3RyaWRlIDogMTsgLy8gc3RyaWRlIGF0IHdoaWNoIHdlIGFwcGx5IGZpbHRlcnMgdG8gaW5wdXQgdm9sdW1lXG4gICAgdGhpcy5wYWQgPSB0eXBlb2Ygb3B0LnBhZCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHQucGFkIDogMDsgLy8gYW1vdW50IG9mIDAgcGFkZGluZyB0byBhZGQgYXJvdW5kIGJvcmRlcnMgb2YgaW5wdXQgdm9sdW1lXG4gICAgdGhpcy5sMV9kZWNheV9tdWwgPSB0eXBlb2Ygb3B0LmwxX2RlY2F5X211bCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHQubDFfZGVjYXlfbXVsIDogMC4wO1xuICAgIHRoaXMubDJfZGVjYXlfbXVsID0gdHlwZW9mIG9wdC5sMl9kZWNheV9tdWwgIT09ICd1bmRlZmluZWQnID8gb3B0LmwyX2RlY2F5X211bCA6IDEuMDtcblxuICAgIC8vIGNvbXB1dGVkXG4gICAgLy8gbm90ZSB3ZSBhcmUgZG9pbmcgZmxvb3IsIHNvIGlmIHRoZSBzdHJpZGVkIGNvbnZvbHV0aW9uIG9mIHRoZSBmaWx0ZXIgZG9lc250IGZpdCBpbnRvIHRoZSBpbnB1dFxuICAgIC8vIHZvbHVtZSBleGFjdGx5LCB0aGUgb3V0cHV0IHZvbHVtZSB3aWxsIGJlIHRyaW1tZWQgYW5kIG5vdCBjb250YWluIHRoZSAoaW5jb21wbGV0ZSkgY29tcHV0ZWRcbiAgICAvLyBmaW5hbCBhcHBsaWNhdGlvbi5cbiAgICB0aGlzLm91dF9zeCA9IE1hdGguZmxvb3IoKHRoaXMuaW5fc3ggKyB0aGlzLnBhZCAqIDIgLSB0aGlzLnN4KSAvIHRoaXMuc3RyaWRlICsgMSk7XG4gICAgdGhpcy5vdXRfc3kgPSBNYXRoLmZsb29yKCh0aGlzLmluX3N5ICsgdGhpcy5wYWQgKiAyIC0gdGhpcy5zeSkgLyB0aGlzLnN0cmlkZSArIDEpO1xuICAgIHRoaXMubGF5ZXJfdHlwZSA9ICdjb252JztcblxuICAgIC8vIGluaXRpYWxpemF0aW9uc1xuICAgIHZhciBiaWFzID0gdHlwZW9mIG9wdC5iaWFzX3ByZWYgIT09ICd1bmRlZmluZWQnID8gb3B0LmJpYXNfcHJlZiA6IDAuMDtcbiAgICB0aGlzLmZpbHRlcnMgPSBbXTtcbiAgICBmb3IodmFyIGk9MDtpPHRoaXMub3V0X2RlcHRoO2krKykgeyB0aGlzLmZpbHRlcnMucHVzaChuZXcgVm9sKHRoaXMuc3gsIHRoaXMuc3ksIHRoaXMuaW5fZGVwdGgpKTsgfVxuICAgIHRoaXMuYmlhc2VzID0gbmV3IFZvbCgxLCAxLCB0aGlzLm91dF9kZXB0aCwgYmlhcyk7XG4gIH1cbiAgQ29udkxheWVyLnByb3RvdHlwZSA9IHtcbiAgICBmb3J3YXJkOiBmdW5jdGlvbihWLCBpc190cmFpbmluZykge1xuICAgICAgdGhpcy5pbl9hY3QgPSBWO1xuXG4gICAgICB2YXIgQSA9IG5ldyBWb2wodGhpcy5vdXRfc3gsIHRoaXMub3V0X3N5LCB0aGlzLm91dF9kZXB0aCwgMC4wKTtcbiAgICAgIGZvcih2YXIgZD0wO2Q8dGhpcy5vdXRfZGVwdGg7ZCsrKSB7XG4gICAgICAgIHZhciBmID0gdGhpcy5maWx0ZXJzW2RdO1xuICAgICAgICB2YXIgeCA9IC10aGlzLnBhZDtcbiAgICAgICAgdmFyIHkgPSAtdGhpcy5wYWQ7XG4gICAgICAgIGZvcih2YXIgYXg9MDsgYXg8dGhpcy5vdXRfc3g7IHgrPXRoaXMuc3RyaWRlLGF4KyspIHtcbiAgICAgICAgICB5ID0gLXRoaXMucGFkO1xuICAgICAgICAgIGZvcih2YXIgYXk9MDsgYXk8dGhpcy5vdXRfc3k7IHkrPXRoaXMuc3RyaWRlLGF5KyspIHtcblxuICAgICAgICAgICAgLy8gY29udm9sdmUgY2VudGVyZWQgYXQgdGhpcyBwYXJ0aWN1bGFyIGxvY2F0aW9uXG4gICAgICAgICAgICAvLyBjb3VsZCBiZSBiaXQgbW9yZSBlZmZpY2llbnQsIGdvaW5nIGZvciBjb3JyZWN0bmVzcyBmaXJzdFxuICAgICAgICAgICAgdmFyIGEgPSAwLjA7XG4gICAgICAgICAgICBmb3IodmFyIGZ4PTA7Zng8Zi5zeDtmeCsrKSB7XG4gICAgICAgICAgICAgIGZvcih2YXIgZnk9MDtmeTxmLnN5O2Z5KyspIHtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGZkPTA7ZmQ8Zi5kZXB0aDtmZCsrKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgb3kgPSB5K2Z5OyAvLyBjb29yZGluYXRlcyBpbiB0aGUgb3JpZ2luYWwgaW5wdXQgYXJyYXkgY29vcmRpbmF0ZXNcbiAgICAgICAgICAgICAgICAgIHZhciBveCA9IHgrZng7XG4gICAgICAgICAgICAgICAgICBpZihveT49MCAmJiBveTxWLnN5ICYmIG94Pj0wICYmIG94PFYuc3gpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9hICs9IGYuZ2V0KGZ4LCBmeSwgZmQpICogVi5nZXQob3gsIG95LCBmZCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGF2b2lkIGZ1bmN0aW9uIGNhbGwgb3ZlcmhlYWQgZm9yIGVmZmljaWVuY3ksIGNvbXByb21pc2UgbW9kdWxhcml0eSA6KFxuICAgICAgICAgICAgICAgICAgICBhICs9IGYud1soKGYuc3ggKiBmeSkrZngpKmYuZGVwdGgrZmRdICogVi53WygoVi5zeCAqIG95KStveCkqVi5kZXB0aCtmZF07XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhICs9IHRoaXMuYmlhc2VzLndbZF07XG4gICAgICAgICAgICBBLnNldChheCwgYXksIGQsIGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5vdXRfYWN0ID0gQTtcbiAgICAgIHJldHVybiB0aGlzLm91dF9hY3Q7XG4gICAgfSxcbiAgICBiYWNrd2FyZDogZnVuY3Rpb24oKSB7IFxuXG4gICAgICAvLyBjb21wdXRlIGdyYWRpZW50IHdydCB3ZWlnaHRzLCBiaWFzZXMgYW5kIGlucHV0IGRhdGFcbiAgICAgIHZhciBWID0gdGhpcy5pbl9hY3Q7XG4gICAgICBWLmR3ID0gZ2xvYmFsLnplcm9zKFYudy5sZW5ndGgpOyAvLyB6ZXJvIG91dCBncmFkaWVudCB3cnQgYm90dG9tIGRhdGEsIHdlJ3JlIGFib3V0IHRvIGZpbGwgaXRcbiAgICAgIGZvcih2YXIgZD0wO2Q8dGhpcy5vdXRfZGVwdGg7ZCsrKSB7XG4gICAgICAgIHZhciBmID0gdGhpcy5maWx0ZXJzW2RdO1xuICAgICAgICB2YXIgeCA9IC10aGlzLnBhZDtcbiAgICAgICAgdmFyIHkgPSAtdGhpcy5wYWQ7XG4gICAgICAgIGZvcih2YXIgYXg9MDsgYXg8dGhpcy5vdXRfc3g7IHgrPXRoaXMuc3RyaWRlLGF4KyspIHtcbiAgICAgICAgICB5ID0gLXRoaXMucGFkO1xuICAgICAgICAgIGZvcih2YXIgYXk9MDsgYXk8dGhpcy5vdXRfc3k7IHkrPXRoaXMuc3RyaWRlLGF5KyspIHtcbiAgICAgICAgICAgIC8vIGNvbnZvbHZlIGFuZCBhZGQgdXAgdGhlIGdyYWRpZW50cy4gXG4gICAgICAgICAgICAvLyBjb3VsZCBiZSBtb3JlIGVmZmljaWVudCwgZ29pbmcgZm9yIGNvcnJlY3RuZXNzIGZpcnN0XG4gICAgICAgICAgICB2YXIgY2hhaW5fZ3JhZCA9IHRoaXMub3V0X2FjdC5nZXRfZ3JhZChheCxheSxkKTsgLy8gZ3JhZGllbnQgZnJvbSBhYm92ZSwgZnJvbSBjaGFpbiBydWxlXG4gICAgICAgICAgICBmb3IodmFyIGZ4PTA7Zng8Zi5zeDtmeCsrKSB7XG4gICAgICAgICAgICAgIGZvcih2YXIgZnk9MDtmeTxmLnN5O2Z5KyspIHtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGZkPTA7ZmQ8Zi5kZXB0aDtmZCsrKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgb3kgPSB5K2Z5O1xuICAgICAgICAgICAgICAgICAgdmFyIG94ID0geCtmeDtcbiAgICAgICAgICAgICAgICAgIGlmKG95Pj0wICYmIG95PFYuc3kgJiYgb3g+PTAgJiYgb3g8Vi5zeCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBmb3J3YXJkIHByb3AgY2FsY3VsYXRlZDogYSArPSBmLmdldChmeCwgZnksIGZkKSAqIFYuZ2V0KG94LCBveSwgZmQpO1xuICAgICAgICAgICAgICAgICAgICAvL2YuYWRkX2dyYWQoZngsIGZ5LCBmZCwgVi5nZXQob3gsIG95LCBmZCkgKiBjaGFpbl9ncmFkKTtcbiAgICAgICAgICAgICAgICAgICAgLy9WLmFkZF9ncmFkKG94LCBveSwgZmQsIGYuZ2V0KGZ4LCBmeSwgZmQpICogY2hhaW5fZ3JhZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gYXZvaWQgZnVuY3Rpb24gY2FsbCBvdmVyaGVhZCBhbmQgdXNlIFZvbHMgZGlyZWN0bHkgZm9yIGVmZmljaWVuY3lcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl4MSA9ICgoVi5zeCAqIG95KStveCkqVi5kZXB0aCtmZDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl4MiA9ICgoZi5zeCAqIGZ5KStmeCkqZi5kZXB0aCtmZDtcbiAgICAgICAgICAgICAgICAgICAgZi5kd1tpeDJdICs9IFYud1tpeDFdKmNoYWluX2dyYWQ7XG4gICAgICAgICAgICAgICAgICAgIFYuZHdbaXgxXSArPSBmLndbaXgyXSpjaGFpbl9ncmFkO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5iaWFzZXMuZHdbZF0gKz0gY2hhaW5fZ3JhZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGdldFBhcmFtc0FuZEdyYWRzOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZXNwb25zZSA9IFtdO1xuICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLm91dF9kZXB0aDtpKyspIHtcbiAgICAgICAgcmVzcG9uc2UucHVzaCh7cGFyYW1zOiB0aGlzLmZpbHRlcnNbaV0udywgZ3JhZHM6IHRoaXMuZmlsdGVyc1tpXS5kdywgbDJfZGVjYXlfbXVsOiB0aGlzLmwyX2RlY2F5X211bCwgbDFfZGVjYXlfbXVsOiB0aGlzLmwxX2RlY2F5X211bH0pO1xuICAgICAgfVxuICAgICAgcmVzcG9uc2UucHVzaCh7cGFyYW1zOiB0aGlzLmJpYXNlcy53LCBncmFkczogdGhpcy5iaWFzZXMuZHcsIGwxX2RlY2F5X211bDogMC4wLCBsMl9kZWNheV9tdWw6IDAuMH0pO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0sXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBqc29uID0ge307XG4gICAgICBqc29uLnN4ID0gdGhpcy5zeDsgLy8gZmlsdGVyIHNpemUgaW4geCwgeSBkaW1zXG4gICAgICBqc29uLnN5ID0gdGhpcy5zeTtcbiAgICAgIGpzb24uc3RyaWRlID0gdGhpcy5zdHJpZGU7XG4gICAgICBqc29uLmluX2RlcHRoID0gdGhpcy5pbl9kZXB0aDtcbiAgICAgIGpzb24ub3V0X2RlcHRoID0gdGhpcy5vdXRfZGVwdGg7XG4gICAgICBqc29uLm91dF9zeCA9IHRoaXMub3V0X3N4O1xuICAgICAganNvbi5vdXRfc3kgPSB0aGlzLm91dF9zeTtcbiAgICAgIGpzb24ubGF5ZXJfdHlwZSA9IHRoaXMubGF5ZXJfdHlwZTtcbiAgICAgIGpzb24ubDFfZGVjYXlfbXVsID0gdGhpcy5sMV9kZWNheV9tdWw7XG4gICAgICBqc29uLmwyX2RlY2F5X211bCA9IHRoaXMubDJfZGVjYXlfbXVsO1xuICAgICAganNvbi5wYWQgPSB0aGlzLnBhZDtcbiAgICAgIGpzb24uZmlsdGVycyA9IFtdO1xuICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLmZpbHRlcnMubGVuZ3RoO2krKykge1xuICAgICAgICBqc29uLmZpbHRlcnMucHVzaCh0aGlzLmZpbHRlcnNbaV0udG9KU09OKCkpO1xuICAgICAgfVxuICAgICAganNvbi5iaWFzZXMgPSB0aGlzLmJpYXNlcy50b0pTT04oKTtcbiAgICAgIHJldHVybiBqc29uO1xuICAgIH0sXG4gICAgZnJvbUpTT046IGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgIHRoaXMub3V0X2RlcHRoID0ganNvbi5vdXRfZGVwdGg7XG4gICAgICB0aGlzLm91dF9zeCA9IGpzb24ub3V0X3N4O1xuICAgICAgdGhpcy5vdXRfc3kgPSBqc29uLm91dF9zeTtcbiAgICAgIHRoaXMubGF5ZXJfdHlwZSA9IGpzb24ubGF5ZXJfdHlwZTtcbiAgICAgIHRoaXMuc3ggPSBqc29uLnN4OyAvLyBmaWx0ZXIgc2l6ZSBpbiB4LCB5IGRpbXNcbiAgICAgIHRoaXMuc3kgPSBqc29uLnN5O1xuICAgICAgdGhpcy5zdHJpZGUgPSBqc29uLnN0cmlkZTtcbiAgICAgIHRoaXMuaW5fZGVwdGggPSBqc29uLmluX2RlcHRoOyAvLyBkZXB0aCBvZiBpbnB1dCB2b2x1bWVcbiAgICAgIHRoaXMuZmlsdGVycyA9IFtdO1xuICAgICAgdGhpcy5sMV9kZWNheV9tdWwgPSB0eXBlb2YganNvbi5sMV9kZWNheV9tdWwgIT09ICd1bmRlZmluZWQnID8ganNvbi5sMV9kZWNheV9tdWwgOiAxLjA7XG4gICAgICB0aGlzLmwyX2RlY2F5X211bCA9IHR5cGVvZiBqc29uLmwyX2RlY2F5X211bCAhPT0gJ3VuZGVmaW5lZCcgPyBqc29uLmwyX2RlY2F5X211bCA6IDEuMDtcbiAgICAgIHRoaXMucGFkID0gdHlwZW9mIGpzb24ucGFkICE9PSAndW5kZWZpbmVkJyA/IGpzb24ucGFkIDogMDtcbiAgICAgIGZvcih2YXIgaT0wO2k8anNvbi5maWx0ZXJzLmxlbmd0aDtpKyspIHtcbiAgICAgICAgdmFyIHYgPSBuZXcgVm9sKDAsMCwwLDApO1xuICAgICAgICB2LmZyb21KU09OKGpzb24uZmlsdGVyc1tpXSk7XG4gICAgICAgIHRoaXMuZmlsdGVycy5wdXNoKHYpO1xuICAgICAgfVxuICAgICAgdGhpcy5iaWFzZXMgPSBuZXcgVm9sKDAsMCwwLDApO1xuICAgICAgdGhpcy5iaWFzZXMuZnJvbUpTT04oanNvbi5iaWFzZXMpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBGdWxseUNvbm5MYXllciA9IGZ1bmN0aW9uKG9wdCkge1xuICAgIHZhciBvcHQgPSBvcHQgfHwge307XG5cbiAgICAvLyByZXF1aXJlZFxuICAgIC8vIG9rIGZpbmUgd2Ugd2lsbCBhbGxvdyAnZmlsdGVycycgYXMgdGhlIHdvcmQgYXMgd2VsbFxuICAgIHRoaXMub3V0X2RlcHRoID0gdHlwZW9mIG9wdC5udW1fbmV1cm9ucyAhPT0gJ3VuZGVmaW5lZCcgPyBvcHQubnVtX25ldXJvbnMgOiBvcHQuZmlsdGVycztcblxuICAgIC8vIG9wdGlvbmFsIFxuICAgIHRoaXMubDFfZGVjYXlfbXVsID0gdHlwZW9mIG9wdC5sMV9kZWNheV9tdWwgIT09ICd1bmRlZmluZWQnID8gb3B0LmwxX2RlY2F5X211bCA6IDAuMDtcbiAgICB0aGlzLmwyX2RlY2F5X211bCA9IHR5cGVvZiBvcHQubDJfZGVjYXlfbXVsICE9PSAndW5kZWZpbmVkJyA/IG9wdC5sMl9kZWNheV9tdWwgOiAxLjA7XG5cbiAgICAvLyBjb21wdXRlZFxuICAgIHRoaXMubnVtX2lucHV0cyA9IG9wdC5pbl9zeCAqIG9wdC5pbl9zeSAqIG9wdC5pbl9kZXB0aDtcbiAgICB0aGlzLm91dF9zeCA9IDE7XG4gICAgdGhpcy5vdXRfc3kgPSAxO1xuICAgIHRoaXMubGF5ZXJfdHlwZSA9ICdmYyc7XG5cbiAgICAvLyBpbml0aWFsaXphdGlvbnNcbiAgICB2YXIgYmlhcyA9IHR5cGVvZiBvcHQuYmlhc19wcmVmICE9PSAndW5kZWZpbmVkJyA/IG9wdC5iaWFzX3ByZWYgOiAwLjA7XG4gICAgdGhpcy5maWx0ZXJzID0gW107XG4gICAgZm9yKHZhciBpPTA7aTx0aGlzLm91dF9kZXB0aCA7aSsrKSB7IHRoaXMuZmlsdGVycy5wdXNoKG5ldyBWb2woMSwgMSwgdGhpcy5udW1faW5wdXRzKSk7IH1cbiAgICB0aGlzLmJpYXNlcyA9IG5ldyBWb2woMSwgMSwgdGhpcy5vdXRfZGVwdGgsIGJpYXMpO1xuICB9XG5cbiAgRnVsbHlDb25uTGF5ZXIucHJvdG90eXBlID0ge1xuICAgIGZvcndhcmQ6IGZ1bmN0aW9uKFYsIGlzX3RyYWluaW5nKSB7XG4gICAgICB0aGlzLmluX2FjdCA9IFY7XG4gICAgICB2YXIgQSA9IG5ldyBWb2woMSwgMSwgdGhpcy5vdXRfZGVwdGgsIDAuMCk7XG4gICAgICB2YXIgVncgPSBWLnc7XG4gICAgICBmb3IodmFyIGk9MDtpPHRoaXMub3V0X2RlcHRoO2krKykge1xuICAgICAgICB2YXIgYSA9IDAuMDtcbiAgICAgICAgdmFyIHdpID0gdGhpcy5maWx0ZXJzW2ldLnc7XG4gICAgICAgIGZvcih2YXIgZD0wO2Q8dGhpcy5udW1faW5wdXRzO2QrKykge1xuICAgICAgICAgIGEgKz0gVndbZF0gKiB3aVtkXTsgLy8gZm9yIGVmZmljaWVuY3kgdXNlIFZvbHMgZGlyZWN0bHkgZm9yIG5vd1xuICAgICAgICB9XG4gICAgICAgIGEgKz0gdGhpcy5iaWFzZXMud1tpXTtcbiAgICAgICAgQS53W2ldID0gYTtcbiAgICAgIH1cbiAgICAgIHRoaXMub3V0X2FjdCA9IEE7XG4gICAgICByZXR1cm4gdGhpcy5vdXRfYWN0O1xuICAgIH0sXG4gICAgYmFja3dhcmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIFYgPSB0aGlzLmluX2FjdDtcbiAgICAgIFYuZHcgPSBnbG9iYWwuemVyb3MoVi53Lmxlbmd0aCk7IC8vIHplcm8gb3V0IHRoZSBncmFkaWVudCBpbiBpbnB1dCBWb2xcbiAgICAgIFxuICAgICAgLy8gY29tcHV0ZSBncmFkaWVudCB3cnQgd2VpZ2h0cyBhbmQgZGF0YVxuICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLm91dF9kZXB0aDtpKyspIHtcbiAgICAgICAgdmFyIHRmaSA9IHRoaXMuZmlsdGVyc1tpXTtcbiAgICAgICAgdmFyIGNoYWluX2dyYWQgPSB0aGlzLm91dF9hY3QuZHdbaV07XG4gICAgICAgIGZvcih2YXIgZD0wO2Q8dGhpcy5udW1faW5wdXRzO2QrKykge1xuICAgICAgICAgIFYuZHdbZF0gKz0gdGZpLndbZF0qY2hhaW5fZ3JhZDsgLy8gZ3JhZCB3cnQgaW5wdXQgZGF0YVxuICAgICAgICAgIHRmaS5kd1tkXSArPSBWLndbZF0qY2hhaW5fZ3JhZDsgLy8gZ3JhZCB3cnQgcGFyYW1zXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5iaWFzZXMuZHdbaV0gKz0gY2hhaW5fZ3JhZDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldFBhcmFtc0FuZEdyYWRzOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZXNwb25zZSA9IFtdO1xuICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLm91dF9kZXB0aDtpKyspIHtcbiAgICAgICAgcmVzcG9uc2UucHVzaCh7cGFyYW1zOiB0aGlzLmZpbHRlcnNbaV0udywgZ3JhZHM6IHRoaXMuZmlsdGVyc1tpXS5kdywgbDFfZGVjYXlfbXVsOiB0aGlzLmwxX2RlY2F5X211bCwgbDJfZGVjYXlfbXVsOiB0aGlzLmwyX2RlY2F5X211bH0pO1xuICAgICAgfVxuICAgICAgcmVzcG9uc2UucHVzaCh7cGFyYW1zOiB0aGlzLmJpYXNlcy53LCBncmFkczogdGhpcy5iaWFzZXMuZHcsIGwxX2RlY2F5X211bDogMC4wLCBsMl9kZWNheV9tdWw6IDAuMH0pO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0sXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBqc29uID0ge307XG4gICAgICBqc29uLm91dF9kZXB0aCA9IHRoaXMub3V0X2RlcHRoO1xuICAgICAganNvbi5vdXRfc3ggPSB0aGlzLm91dF9zeDtcbiAgICAgIGpzb24ub3V0X3N5ID0gdGhpcy5vdXRfc3k7XG4gICAgICBqc29uLmxheWVyX3R5cGUgPSB0aGlzLmxheWVyX3R5cGU7XG4gICAgICBqc29uLm51bV9pbnB1dHMgPSB0aGlzLm51bV9pbnB1dHM7XG4gICAgICBqc29uLmwxX2RlY2F5X211bCA9IHRoaXMubDFfZGVjYXlfbXVsO1xuICAgICAganNvbi5sMl9kZWNheV9tdWwgPSB0aGlzLmwyX2RlY2F5X211bDtcbiAgICAgIGpzb24uZmlsdGVycyA9IFtdO1xuICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLmZpbHRlcnMubGVuZ3RoO2krKykge1xuICAgICAgICBqc29uLmZpbHRlcnMucHVzaCh0aGlzLmZpbHRlcnNbaV0udG9KU09OKCkpO1xuICAgICAgfVxuICAgICAganNvbi5iaWFzZXMgPSB0aGlzLmJpYXNlcy50b0pTT04oKTtcbiAgICAgIHJldHVybiBqc29uO1xuICAgIH0sXG4gICAgZnJvbUpTT046IGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgIHRoaXMub3V0X2RlcHRoID0ganNvbi5vdXRfZGVwdGg7XG4gICAgICB0aGlzLm91dF9zeCA9IGpzb24ub3V0X3N4O1xuICAgICAgdGhpcy5vdXRfc3kgPSBqc29uLm91dF9zeTtcbiAgICAgIHRoaXMubGF5ZXJfdHlwZSA9IGpzb24ubGF5ZXJfdHlwZTtcbiAgICAgIHRoaXMubnVtX2lucHV0cyA9IGpzb24ubnVtX2lucHV0cztcbiAgICAgIHRoaXMubDFfZGVjYXlfbXVsID0gdHlwZW9mIGpzb24ubDFfZGVjYXlfbXVsICE9PSAndW5kZWZpbmVkJyA/IGpzb24ubDFfZGVjYXlfbXVsIDogMS4wO1xuICAgICAgdGhpcy5sMl9kZWNheV9tdWwgPSB0eXBlb2YganNvbi5sMl9kZWNheV9tdWwgIT09ICd1bmRlZmluZWQnID8ganNvbi5sMl9kZWNheV9tdWwgOiAxLjA7XG4gICAgICB0aGlzLmZpbHRlcnMgPSBbXTtcbiAgICAgIGZvcih2YXIgaT0wO2k8anNvbi5maWx0ZXJzLmxlbmd0aDtpKyspIHtcbiAgICAgICAgdmFyIHYgPSBuZXcgVm9sKDAsMCwwLDApO1xuICAgICAgICB2LmZyb21KU09OKGpzb24uZmlsdGVyc1tpXSk7XG4gICAgICAgIHRoaXMuZmlsdGVycy5wdXNoKHYpO1xuICAgICAgfVxuICAgICAgdGhpcy5iaWFzZXMgPSBuZXcgVm9sKDAsMCwwLDApO1xuICAgICAgdGhpcy5iaWFzZXMuZnJvbUpTT04oanNvbi5iaWFzZXMpO1xuICAgIH1cbiAgfVxuXG4gIGdsb2JhbC5Db252TGF5ZXIgPSBDb252TGF5ZXI7XG4gIGdsb2JhbC5GdWxseUNvbm5MYXllciA9IEZ1bGx5Q29ubkxheWVyO1xuICBcbn0pKGNvbnZuZXRqcyk7XG4oZnVuY3Rpb24oZ2xvYmFsKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgVm9sID0gZ2xvYmFsLlZvbDsgLy8gY29udmVuaWVuY2VcbiAgXG4gIHZhciBQb29sTGF5ZXIgPSBmdW5jdGlvbihvcHQpIHtcblxuICAgIHZhciBvcHQgPSBvcHQgfHwge307XG5cbiAgICAvLyByZXF1aXJlZFxuICAgIHRoaXMuc3ggPSBvcHQuc3g7IC8vIGZpbHRlciBzaXplXG4gICAgdGhpcy5pbl9kZXB0aCA9IG9wdC5pbl9kZXB0aDtcbiAgICB0aGlzLmluX3N4ID0gb3B0LmluX3N4O1xuICAgIHRoaXMuaW5fc3kgPSBvcHQuaW5fc3k7XG5cbiAgICAvLyBvcHRpb25hbFxuICAgIHRoaXMuc3kgPSB0eXBlb2Ygb3B0LnN5ICE9PSAndW5kZWZpbmVkJyA/IG9wdC5zeSA6IHRoaXMuc3g7XG4gICAgdGhpcy5zdHJpZGUgPSB0eXBlb2Ygb3B0LnN0cmlkZSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHQuc3RyaWRlIDogMjtcbiAgICB0aGlzLnBhZCA9IHR5cGVvZiBvcHQucGFkICE9PSAndW5kZWZpbmVkJyA/IG9wdC5wYWQgOiAwOyAvLyBhbW91bnQgb2YgMCBwYWRkaW5nIHRvIGFkZCBhcm91bmQgYm9yZGVycyBvZiBpbnB1dCB2b2x1bWVcblxuICAgIC8vIGNvbXB1dGVkXG4gICAgdGhpcy5vdXRfZGVwdGggPSB0aGlzLmluX2RlcHRoO1xuICAgIHRoaXMub3V0X3N4ID0gTWF0aC5mbG9vcigodGhpcy5pbl9zeCArIHRoaXMucGFkICogMiAtIHRoaXMuc3gpIC8gdGhpcy5zdHJpZGUgKyAxKTtcbiAgICB0aGlzLm91dF9zeSA9IE1hdGguZmxvb3IoKHRoaXMuaW5fc3kgKyB0aGlzLnBhZCAqIDIgLSB0aGlzLnN5KSAvIHRoaXMuc3RyaWRlICsgMSk7XG4gICAgdGhpcy5sYXllcl90eXBlID0gJ3Bvb2wnO1xuICAgIC8vIHN0b3JlIHN3aXRjaGVzIGZvciB4LHkgY29vcmRpbmF0ZXMgZm9yIHdoZXJlIHRoZSBtYXggY29tZXMgZnJvbSwgZm9yIGVhY2ggb3V0cHV0IG5ldXJvblxuICAgIHRoaXMuc3dpdGNoeCA9IGdsb2JhbC56ZXJvcyh0aGlzLm91dF9zeCp0aGlzLm91dF9zeSp0aGlzLm91dF9kZXB0aCk7XG4gICAgdGhpcy5zd2l0Y2h5ID0gZ2xvYmFsLnplcm9zKHRoaXMub3V0X3N4KnRoaXMub3V0X3N5KnRoaXMub3V0X2RlcHRoKTtcbiAgfVxuXG4gIFBvb2xMYXllci5wcm90b3R5cGUgPSB7XG4gICAgZm9yd2FyZDogZnVuY3Rpb24oViwgaXNfdHJhaW5pbmcpIHtcbiAgICAgIHRoaXMuaW5fYWN0ID0gVjtcblxuICAgICAgdmFyIEEgPSBuZXcgVm9sKHRoaXMub3V0X3N4LCB0aGlzLm91dF9zeSwgdGhpcy5vdXRfZGVwdGgsIDAuMCk7XG4gICAgICBcbiAgICAgIHZhciBuPTA7IC8vIGEgY291bnRlciBmb3Igc3dpdGNoZXNcbiAgICAgIGZvcih2YXIgZD0wO2Q8dGhpcy5vdXRfZGVwdGg7ZCsrKSB7XG4gICAgICAgIHZhciB4ID0gLXRoaXMucGFkO1xuICAgICAgICB2YXIgeSA9IC10aGlzLnBhZDtcbiAgICAgICAgZm9yKHZhciBheD0wOyBheDx0aGlzLm91dF9zeDsgeCs9dGhpcy5zdHJpZGUsYXgrKykge1xuICAgICAgICAgIHkgPSAtdGhpcy5wYWQ7XG4gICAgICAgICAgZm9yKHZhciBheT0wOyBheTx0aGlzLm91dF9zeTsgeSs9dGhpcy5zdHJpZGUsYXkrKykge1xuXG4gICAgICAgICAgICAvLyBjb252b2x2ZSBjZW50ZXJlZCBhdCB0aGlzIHBhcnRpY3VsYXIgbG9jYXRpb25cbiAgICAgICAgICAgIHZhciBhID0gLTk5OTk5OyAvLyBob3BlZnVsbHkgc21hbGwgZW5vdWdoIDtcXFxuICAgICAgICAgICAgdmFyIHdpbng9LTEsd2lueT0tMTtcbiAgICAgICAgICAgIGZvcih2YXIgZng9MDtmeDx0aGlzLnN4O2Z4KyspIHtcbiAgICAgICAgICAgICAgZm9yKHZhciBmeT0wO2Z5PHRoaXMuc3k7ZnkrKykge1xuICAgICAgICAgICAgICAgIHZhciBveSA9IHkrZnk7XG4gICAgICAgICAgICAgICAgdmFyIG94ID0geCtmeDtcbiAgICAgICAgICAgICAgICBpZihveT49MCAmJiBveTxWLnN5ICYmIG94Pj0wICYmIG94PFYuc3gpIHtcbiAgICAgICAgICAgICAgICAgIHZhciB2ID0gVi5nZXQob3gsIG95LCBkKTtcbiAgICAgICAgICAgICAgICAgIC8vIHBlcmZvcm0gbWF4IHBvb2xpbmcgYW5kIHN0b3JlIHBvaW50ZXJzIHRvIHdoZXJlXG4gICAgICAgICAgICAgICAgICAvLyB0aGUgbWF4IGNhbWUgZnJvbS4gVGhpcyB3aWxsIHNwZWVkIHVwIGJhY2twcm9wIFxuICAgICAgICAgICAgICAgICAgLy8gYW5kIGNhbiBoZWxwIG1ha2UgbmljZSB2aXN1YWxpemF0aW9ucyBpbiBmdXR1cmVcbiAgICAgICAgICAgICAgICAgIGlmKHYgPiBhKSB7IGEgPSB2OyB3aW54PW94OyB3aW55PW95O31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3dpdGNoeFtuXSA9IHdpbng7XG4gICAgICAgICAgICB0aGlzLnN3aXRjaHlbbl0gPSB3aW55O1xuICAgICAgICAgICAgbisrO1xuICAgICAgICAgICAgQS5zZXQoYXgsIGF5LCBkLCBhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMub3V0X2FjdCA9IEE7XG4gICAgICByZXR1cm4gdGhpcy5vdXRfYWN0O1xuICAgIH0sXG4gICAgYmFja3dhcmQ6IGZ1bmN0aW9uKCkgeyBcbiAgICAgIC8vIHBvb2xpbmcgbGF5ZXJzIGhhdmUgbm8gcGFyYW1ldGVycywgc28gc2ltcGx5IGNvbXB1dGUgXG4gICAgICAvLyBncmFkaWVudCB3cnQgZGF0YSBoZXJlXG4gICAgICB2YXIgViA9IHRoaXMuaW5fYWN0O1xuICAgICAgVi5kdyA9IGdsb2JhbC56ZXJvcyhWLncubGVuZ3RoKTsgLy8gemVybyBvdXQgZ3JhZGllbnQgd3J0IGRhdGFcbiAgICAgIHZhciBBID0gdGhpcy5vdXRfYWN0OyAvLyBjb21wdXRlZCBpbiBmb3J3YXJkIHBhc3MgXG5cbiAgICAgIHZhciBuID0gMDtcbiAgICAgIGZvcih2YXIgZD0wO2Q8dGhpcy5vdXRfZGVwdGg7ZCsrKSB7XG4gICAgICAgIHZhciB4ID0gLXRoaXMucGFkO1xuICAgICAgICB2YXIgeSA9IC10aGlzLnBhZDtcbiAgICAgICAgZm9yKHZhciBheD0wOyBheDx0aGlzLm91dF9zeDsgeCs9dGhpcy5zdHJpZGUsYXgrKykge1xuICAgICAgICAgIHkgPSAtdGhpcy5wYWQ7XG4gICAgICAgICAgZm9yKHZhciBheT0wOyBheTx0aGlzLm91dF9zeTsgeSs9dGhpcy5zdHJpZGUsYXkrKykge1xuXG4gICAgICAgICAgICB2YXIgY2hhaW5fZ3JhZCA9IHRoaXMub3V0X2FjdC5nZXRfZ3JhZChheCxheSxkKTtcbiAgICAgICAgICAgIFYuYWRkX2dyYWQodGhpcy5zd2l0Y2h4W25dLCB0aGlzLnN3aXRjaHlbbl0sIGQsIGNoYWluX2dyYWQpO1xuICAgICAgICAgICAgbisrO1xuXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRQYXJhbXNBbmRHcmFkczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSxcbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGpzb24gPSB7fTtcbiAgICAgIGpzb24uc3ggPSB0aGlzLnN4O1xuICAgICAganNvbi5zeSA9IHRoaXMuc3k7XG4gICAgICBqc29uLnN0cmlkZSA9IHRoaXMuc3RyaWRlO1xuICAgICAganNvbi5pbl9kZXB0aCA9IHRoaXMuaW5fZGVwdGg7XG4gICAgICBqc29uLm91dF9kZXB0aCA9IHRoaXMub3V0X2RlcHRoO1xuICAgICAganNvbi5vdXRfc3ggPSB0aGlzLm91dF9zeDtcbiAgICAgIGpzb24ub3V0X3N5ID0gdGhpcy5vdXRfc3k7XG4gICAgICBqc29uLmxheWVyX3R5cGUgPSB0aGlzLmxheWVyX3R5cGU7XG4gICAgICBqc29uLnBhZCA9IHRoaXMucGFkO1xuICAgICAgcmV0dXJuIGpzb247XG4gICAgfSxcbiAgICBmcm9tSlNPTjogZnVuY3Rpb24oanNvbikge1xuICAgICAgdGhpcy5vdXRfZGVwdGggPSBqc29uLm91dF9kZXB0aDtcbiAgICAgIHRoaXMub3V0X3N4ID0ganNvbi5vdXRfc3g7XG4gICAgICB0aGlzLm91dF9zeSA9IGpzb24ub3V0X3N5O1xuICAgICAgdGhpcy5sYXllcl90eXBlID0ganNvbi5sYXllcl90eXBlO1xuICAgICAgdGhpcy5zeCA9IGpzb24uc3g7XG4gICAgICB0aGlzLnN5ID0ganNvbi5zeTtcbiAgICAgIHRoaXMuc3RyaWRlID0ganNvbi5zdHJpZGU7XG4gICAgICB0aGlzLmluX2RlcHRoID0ganNvbi5pbl9kZXB0aDtcbiAgICAgIHRoaXMucGFkID0gdHlwZW9mIGpzb24ucGFkICE9PSAndW5kZWZpbmVkJyA/IGpzb24ucGFkIDogMDsgLy8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgICAgIHRoaXMuc3dpdGNoeCA9IGdsb2JhbC56ZXJvcyh0aGlzLm91dF9zeCp0aGlzLm91dF9zeSp0aGlzLm91dF9kZXB0aCk7IC8vIG5lZWQgdG8gcmUtaW5pdCB0aGVzZSBhcHByb3ByaWF0ZWx5XG4gICAgICB0aGlzLnN3aXRjaHkgPSBnbG9iYWwuemVyb3ModGhpcy5vdXRfc3gqdGhpcy5vdXRfc3kqdGhpcy5vdXRfZGVwdGgpO1xuICAgIH1cbiAgfVxuXG4gIGdsb2JhbC5Qb29sTGF5ZXIgPSBQb29sTGF5ZXI7XG5cbn0pKGNvbnZuZXRqcyk7XG5cbihmdW5jdGlvbihnbG9iYWwpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBWb2wgPSBnbG9iYWwuVm9sOyAvLyBjb252ZW5pZW5jZVxuICBcbiAgdmFyIElucHV0TGF5ZXIgPSBmdW5jdGlvbihvcHQpIHtcbiAgICB2YXIgb3B0ID0gb3B0IHx8IHt9O1xuXG4gICAgLy8gdGhpcyBpcyBhIGJpdCBzaWxseSBidXQgbGV0cyBhbGxvdyBwZW9wbGUgdG8gc3BlY2lmeSBlaXRoZXIgaW5zIG9yIG91dHNcbiAgICB0aGlzLm91dF9zeCA9IHR5cGVvZiBvcHQub3V0X3N4ICE9PSAndW5kZWZpbmVkJyA/IG9wdC5vdXRfc3ggOiBvcHQuaW5fc3g7XG4gICAgdGhpcy5vdXRfc3kgPSB0eXBlb2Ygb3B0Lm91dF9zeSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHQub3V0X3N5IDogb3B0LmluX3N5O1xuICAgIHRoaXMub3V0X2RlcHRoID0gdHlwZW9mIG9wdC5vdXRfZGVwdGggIT09ICd1bmRlZmluZWQnID8gb3B0Lm91dF9kZXB0aCA6IG9wdC5pbl9kZXB0aDtcbiAgICB0aGlzLmxheWVyX3R5cGUgPSAnaW5wdXQnO1xuICB9XG4gIElucHV0TGF5ZXIucHJvdG90eXBlID0ge1xuICAgIGZvcndhcmQ6IGZ1bmN0aW9uKFYsIGlzX3RyYWluaW5nKSB7XG4gICAgICB0aGlzLmluX2FjdCA9IFY7XG4gICAgICB0aGlzLm91dF9hY3QgPSBWO1xuICAgICAgcmV0dXJuIHRoaXMub3V0X2FjdDsgLy8gZHVtbXkgaWRlbnRpdHkgZnVuY3Rpb24gZm9yIG5vd1xuICAgIH0sXG4gICAgYmFja3dhcmQ6IGZ1bmN0aW9uKCkgeyB9LFxuICAgIGdldFBhcmFtc0FuZEdyYWRzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9LFxuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIganNvbiA9IHt9O1xuICAgICAganNvbi5vdXRfZGVwdGggPSB0aGlzLm91dF9kZXB0aDtcbiAgICAgIGpzb24ub3V0X3N4ID0gdGhpcy5vdXRfc3g7XG4gICAgICBqc29uLm91dF9zeSA9IHRoaXMub3V0X3N5O1xuICAgICAganNvbi5sYXllcl90eXBlID0gdGhpcy5sYXllcl90eXBlO1xuICAgICAgcmV0dXJuIGpzb247XG4gICAgfSxcbiAgICBmcm9tSlNPTjogZnVuY3Rpb24oanNvbikge1xuICAgICAgdGhpcy5vdXRfZGVwdGggPSBqc29uLm91dF9kZXB0aDtcbiAgICAgIHRoaXMub3V0X3N4ID0ganNvbi5vdXRfc3g7XG4gICAgICB0aGlzLm91dF9zeSA9IGpzb24ub3V0X3N5O1xuICAgICAgdGhpcy5sYXllcl90eXBlID0ganNvbi5sYXllcl90eXBlOyBcbiAgICB9XG4gIH1cblxuICBnbG9iYWwuSW5wdXRMYXllciA9IElucHV0TGF5ZXI7XG59KShjb252bmV0anMpO1xuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIFZvbCA9IGdsb2JhbC5Wb2w7IC8vIGNvbnZlbmllbmNlXG4gIFxuICAvLyBMYXllcnMgdGhhdCBpbXBsZW1lbnQgYSBsb3NzLiBDdXJyZW50bHkgdGhlc2UgYXJlIHRoZSBsYXllcnMgdGhhdCBcbiAgLy8gY2FuIGluaXRpYXRlIGEgYmFja3dhcmQoKSBwYXNzLiBJbiBmdXR1cmUgd2UgcHJvYmFibHkgd2FudCBhIG1vcmUgXG4gIC8vIGZsZXhpYmxlIHN5c3RlbSB0aGF0IGNhbiBhY2NvbW9kYXRlIG11bHRpcGxlIGxvc3NlcyB0byBkbyBtdWx0aS10YXNrXG4gIC8vIGxlYXJuaW5nLCBhbmQgc3R1ZmYgbGlrZSB0aGF0LiBCdXQgZm9yIG5vdywgb25lIG9mIHRoZSBsYXllcnMgaW4gdGhpc1xuICAvLyBmaWxlIG11c3QgYmUgdGhlIGZpbmFsIGxheWVyIGluIGEgTmV0LlxuXG4gIC8vIFRoaXMgaXMgYSBjbGFzc2lmaWVyLCB3aXRoIE4gZGlzY3JldGUgY2xhc3NlcyBmcm9tIDAgdG8gTi0xXG4gIC8vIGl0IGdldHMgYSBzdHJlYW0gb2YgTiBpbmNvbWluZyBudW1iZXJzIGFuZCBjb21wdXRlcyB0aGUgc29mdG1heFxuICAvLyBmdW5jdGlvbiAoZXhwb25lbnRpYXRlIGFuZCBub3JtYWxpemUgdG8gc3VtIHRvIDEgYXMgcHJvYmFiaWxpdGllcyBzaG91bGQpXG4gIHZhciBTb2Z0bWF4TGF5ZXIgPSBmdW5jdGlvbihvcHQpIHtcbiAgICB2YXIgb3B0ID0gb3B0IHx8IHt9O1xuXG4gICAgLy8gY29tcHV0ZWRcbiAgICB0aGlzLm51bV9pbnB1dHMgPSBvcHQuaW5fc3ggKiBvcHQuaW5fc3kgKiBvcHQuaW5fZGVwdGg7XG4gICAgdGhpcy5vdXRfZGVwdGggPSB0aGlzLm51bV9pbnB1dHM7XG4gICAgdGhpcy5vdXRfc3ggPSAxO1xuICAgIHRoaXMub3V0X3N5ID0gMTtcbiAgICB0aGlzLmxheWVyX3R5cGUgPSAnc29mdG1heCc7XG4gIH1cblxuICBTb2Z0bWF4TGF5ZXIucHJvdG90eXBlID0ge1xuICAgIGZvcndhcmQ6IGZ1bmN0aW9uKFYsIGlzX3RyYWluaW5nKSB7XG4gICAgICB0aGlzLmluX2FjdCA9IFY7XG5cbiAgICAgIHZhciBBID0gbmV3IFZvbCgxLCAxLCB0aGlzLm91dF9kZXB0aCwgMC4wKTtcblxuICAgICAgLy8gY29tcHV0ZSBtYXggYWN0aXZhdGlvblxuICAgICAgdmFyIGFzID0gVi53O1xuICAgICAgdmFyIGFtYXggPSBWLndbMF07XG4gICAgICBmb3IodmFyIGk9MTtpPHRoaXMub3V0X2RlcHRoO2krKykge1xuICAgICAgICBpZihhc1tpXSA+IGFtYXgpIGFtYXggPSBhc1tpXTtcbiAgICAgIH1cblxuICAgICAgLy8gY29tcHV0ZSBleHBvbmVudGlhbHMgKGNhcmVmdWxseSB0byBub3QgYmxvdyB1cClcbiAgICAgIHZhciBlcyA9IGdsb2JhbC56ZXJvcyh0aGlzLm91dF9kZXB0aCk7XG4gICAgICB2YXIgZXN1bSA9IDAuMDtcbiAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5vdXRfZGVwdGg7aSsrKSB7XG4gICAgICAgIHZhciBlID0gTWF0aC5leHAoYXNbaV0gLSBhbWF4KTtcbiAgICAgICAgZXN1bSArPSBlO1xuICAgICAgICBlc1tpXSA9IGU7XG4gICAgICB9XG5cbiAgICAgIC8vIG5vcm1hbGl6ZSBhbmQgb3V0cHV0IHRvIHN1bSB0byBvbmVcbiAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5vdXRfZGVwdGg7aSsrKSB7XG4gICAgICAgIGVzW2ldIC89IGVzdW07XG4gICAgICAgIEEud1tpXSA9IGVzW2ldO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmVzID0gZXM7IC8vIHNhdmUgdGhlc2UgZm9yIGJhY2twcm9wXG4gICAgICB0aGlzLm91dF9hY3QgPSBBO1xuICAgICAgcmV0dXJuIHRoaXMub3V0X2FjdDtcbiAgICB9LFxuICAgIGJhY2t3YXJkOiBmdW5jdGlvbih5KSB7XG5cbiAgICAgIC8vIGNvbXB1dGUgYW5kIGFjY3VtdWxhdGUgZ3JhZGllbnQgd3J0IHdlaWdodHMgYW5kIGJpYXMgb2YgdGhpcyBsYXllclxuICAgICAgdmFyIHggPSB0aGlzLmluX2FjdDtcbiAgICAgIHguZHcgPSBnbG9iYWwuemVyb3MoeC53Lmxlbmd0aCk7IC8vIHplcm8gb3V0IHRoZSBncmFkaWVudCBvZiBpbnB1dCBWb2xcblxuICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLm91dF9kZXB0aDtpKyspIHtcbiAgICAgICAgdmFyIGluZGljYXRvciA9IGkgPT09IHkgPyAxLjAgOiAwLjA7XG4gICAgICAgIHZhciBtdWwgPSAtKGluZGljYXRvciAtIHRoaXMuZXNbaV0pO1xuICAgICAgICB4LmR3W2ldID0gbXVsO1xuICAgICAgfVxuXG4gICAgICAvLyBsb3NzIGlzIHRoZSBjbGFzcyBuZWdhdGl2ZSBsb2cgbGlrZWxpaG9vZFxuICAgICAgcmV0dXJuIC1NYXRoLmxvZyh0aGlzLmVzW3ldKTtcbiAgICB9LFxuICAgIGdldFBhcmFtc0FuZEdyYWRzOiBmdW5jdGlvbigpIHsgXG4gICAgICByZXR1cm4gW107XG4gICAgfSxcbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGpzb24gPSB7fTtcbiAgICAgIGpzb24ub3V0X2RlcHRoID0gdGhpcy5vdXRfZGVwdGg7XG4gICAgICBqc29uLm91dF9zeCA9IHRoaXMub3V0X3N4O1xuICAgICAganNvbi5vdXRfc3kgPSB0aGlzLm91dF9zeTtcbiAgICAgIGpzb24ubGF5ZXJfdHlwZSA9IHRoaXMubGF5ZXJfdHlwZTtcbiAgICAgIGpzb24ubnVtX2lucHV0cyA9IHRoaXMubnVtX2lucHV0cztcbiAgICAgIHJldHVybiBqc29uO1xuICAgIH0sXG4gICAgZnJvbUpTT046IGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgIHRoaXMub3V0X2RlcHRoID0ganNvbi5vdXRfZGVwdGg7XG4gICAgICB0aGlzLm91dF9zeCA9IGpzb24ub3V0X3N4O1xuICAgICAgdGhpcy5vdXRfc3kgPSBqc29uLm91dF9zeTtcbiAgICAgIHRoaXMubGF5ZXJfdHlwZSA9IGpzb24ubGF5ZXJfdHlwZTtcbiAgICAgIHRoaXMubnVtX2lucHV0cyA9IGpzb24ubnVtX2lucHV0cztcbiAgICB9XG4gIH1cblxuICAvLyBpbXBsZW1lbnRzIGFuIEwyIHJlZ3Jlc3Npb24gY29zdCBsYXllcixcbiAgLy8gc28gcGVuYWxpemVzIFxcc3VtX2kofHx4X2kgLSB5X2l8fF4yKSwgd2hlcmUgeCBpcyBpdHMgaW5wdXRcbiAgLy8gYW5kIHkgaXMgdGhlIHVzZXItcHJvdmlkZWQgYXJyYXkgb2YgXCJjb3JyZWN0XCIgdmFsdWVzLlxuICB2YXIgUmVncmVzc2lvbkxheWVyID0gZnVuY3Rpb24ob3B0KSB7XG4gICAgdmFyIG9wdCA9IG9wdCB8fCB7fTtcblxuICAgIC8vIGNvbXB1dGVkXG4gICAgdGhpcy5udW1faW5wdXRzID0gb3B0LmluX3N4ICogb3B0LmluX3N5ICogb3B0LmluX2RlcHRoO1xuICAgIHRoaXMub3V0X2RlcHRoID0gdGhpcy5udW1faW5wdXRzO1xuICAgIHRoaXMub3V0X3N4ID0gMTtcbiAgICB0aGlzLm91dF9zeSA9IDE7XG4gICAgdGhpcy5sYXllcl90eXBlID0gJ3JlZ3Jlc3Npb24nO1xuICB9XG5cbiAgUmVncmVzc2lvbkxheWVyLnByb3RvdHlwZSA9IHtcbiAgICBmb3J3YXJkOiBmdW5jdGlvbihWLCBpc190cmFpbmluZykge1xuICAgICAgdGhpcy5pbl9hY3QgPSBWO1xuICAgICAgdGhpcy5vdXRfYWN0ID0gVjtcbiAgICAgIHJldHVybiBWOyAvLyBpZGVudGl0eSBmdW5jdGlvblxuICAgIH0sXG4gICAgLy8geSBpcyBhIGxpc3QgaGVyZSBvZiBzaXplIG51bV9pbnB1dHNcbiAgICBiYWNrd2FyZDogZnVuY3Rpb24oeSkgeyBcblxuICAgICAgLy8gY29tcHV0ZSBhbmQgYWNjdW11bGF0ZSBncmFkaWVudCB3cnQgd2VpZ2h0cyBhbmQgYmlhcyBvZiB0aGlzIGxheWVyXG4gICAgICB2YXIgeCA9IHRoaXMuaW5fYWN0O1xuICAgICAgeC5kdyA9IGdsb2JhbC56ZXJvcyh4LncubGVuZ3RoKTsgLy8gemVybyBvdXQgdGhlIGdyYWRpZW50IG9mIGlucHV0IFZvbFxuICAgICAgdmFyIGxvc3MgPSAwLjA7XG4gICAgICBpZih5IGluc3RhbmNlb2YgQXJyYXkgfHwgeSBpbnN0YW5jZW9mIEZsb2F0NjRBcnJheSkge1xuICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMub3V0X2RlcHRoO2krKykge1xuICAgICAgICAgIHZhciBkeSA9IHgud1tpXSAtIHlbaV07XG4gICAgICAgICAgeC5kd1tpXSA9IGR5O1xuICAgICAgICAgIGxvc3MgKz0gMipkeSpkeTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gYXNzdW1lIGl0IGlzIGEgc3RydWN0IHdpdGggZW50cmllcyAuZGltIGFuZCAudmFsXG4gICAgICAgIC8vIGFuZCB3ZSBwYXNzIGdyYWRpZW50IG9ubHkgYWxvbmcgZGltZW5zaW9uIGRpbSB0byBiZSBlcXVhbCB0byB2YWxcbiAgICAgICAgdmFyIGkgPSB5LmRpbTtcbiAgICAgICAgdmFyIHlpID0geS52YWw7XG4gICAgICAgIHZhciBkeSA9IHgud1tpXSAtIHlpO1xuICAgICAgICB4LmR3W2ldID0gZHk7XG4gICAgICAgIGxvc3MgKz0gMipkeSpkeTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsb3NzO1xuICAgIH0sXG4gICAgZ2V0UGFyYW1zQW5kR3JhZHM6IGZ1bmN0aW9uKCkgeyBcbiAgICAgIHJldHVybiBbXTtcbiAgICB9LFxuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIganNvbiA9IHt9O1xuICAgICAganNvbi5vdXRfZGVwdGggPSB0aGlzLm91dF9kZXB0aDtcbiAgICAgIGpzb24ub3V0X3N4ID0gdGhpcy5vdXRfc3g7XG4gICAgICBqc29uLm91dF9zeSA9IHRoaXMub3V0X3N5O1xuICAgICAganNvbi5sYXllcl90eXBlID0gdGhpcy5sYXllcl90eXBlO1xuICAgICAganNvbi5udW1faW5wdXRzID0gdGhpcy5udW1faW5wdXRzO1xuICAgICAgcmV0dXJuIGpzb247XG4gICAgfSxcbiAgICBmcm9tSlNPTjogZnVuY3Rpb24oanNvbikge1xuICAgICAgdGhpcy5vdXRfZGVwdGggPSBqc29uLm91dF9kZXB0aDtcbiAgICAgIHRoaXMub3V0X3N4ID0ganNvbi5vdXRfc3g7XG4gICAgICB0aGlzLm91dF9zeSA9IGpzb24ub3V0X3N5O1xuICAgICAgdGhpcy5sYXllcl90eXBlID0ganNvbi5sYXllcl90eXBlO1xuICAgICAgdGhpcy5udW1faW5wdXRzID0ganNvbi5udW1faW5wdXRzO1xuICAgIH1cbiAgfVxuXG4gIHZhciBTVk1MYXllciA9IGZ1bmN0aW9uKG9wdCkge1xuICAgIHZhciBvcHQgPSBvcHQgfHwge307XG5cbiAgICAvLyBjb21wdXRlZFxuICAgIHRoaXMubnVtX2lucHV0cyA9IG9wdC5pbl9zeCAqIG9wdC5pbl9zeSAqIG9wdC5pbl9kZXB0aDtcbiAgICB0aGlzLm91dF9kZXB0aCA9IHRoaXMubnVtX2lucHV0cztcbiAgICB0aGlzLm91dF9zeCA9IDE7XG4gICAgdGhpcy5vdXRfc3kgPSAxO1xuICAgIHRoaXMubGF5ZXJfdHlwZSA9ICdzdm0nO1xuICB9XG5cbiAgU1ZNTGF5ZXIucHJvdG90eXBlID0ge1xuICAgIGZvcndhcmQ6IGZ1bmN0aW9uKFYsIGlzX3RyYWluaW5nKSB7XG4gICAgICB0aGlzLmluX2FjdCA9IFY7XG4gICAgICB0aGlzLm91dF9hY3QgPSBWOyAvLyBub3RoaW5nIHRvIGRvLCBvdXRwdXQgcmF3IHNjb3Jlc1xuICAgICAgcmV0dXJuIFY7XG4gICAgfSxcbiAgICBiYWNrd2FyZDogZnVuY3Rpb24oeSkge1xuXG4gICAgICAvLyBjb21wdXRlIGFuZCBhY2N1bXVsYXRlIGdyYWRpZW50IHdydCB3ZWlnaHRzIGFuZCBiaWFzIG9mIHRoaXMgbGF5ZXJcbiAgICAgIHZhciB4ID0gdGhpcy5pbl9hY3Q7XG4gICAgICB4LmR3ID0gZ2xvYmFsLnplcm9zKHgudy5sZW5ndGgpOyAvLyB6ZXJvIG91dCB0aGUgZ3JhZGllbnQgb2YgaW5wdXQgVm9sXG5cbiAgICAgIHZhciB5c2NvcmUgPSB4LndbeV07IC8vIHNjb3JlIG9mIGdyb3VuZCB0cnV0aFxuICAgICAgdmFyIG1hcmdpbiA9IDEuMDtcbiAgICAgIHZhciBsb3NzID0gMC4wO1xuICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLm91dF9kZXB0aDtpKyspIHtcbiAgICAgICAgaWYoLXlzY29yZSArIHgud1tpXSArIG1hcmdpbiA+IDApIHtcbiAgICAgICAgICAvLyB2aW9sYXRpbmcgZXhhbXBsZSwgYXBwbHkgbG9zc1xuICAgICAgICAgIC8vIEkgbG92ZSBoaW5nZSBsb3NzLCBieSB0aGUgd2F5LiBUcnVseS5cbiAgICAgICAgICAvLyBTZXJpb3VzbHksIGNvbXBhcmUgdGhpcyBTVk0gY29kZSB3aXRoIFNvZnRtYXggZm9yd2FyZCBBTkQgYmFja3Byb3AgY29kZSBhYm92ZVxuICAgICAgICAgIC8vIGl0J3MgY2xlYXIgd2hpY2ggb25lIGlzIHN1cGVyaW9yLCBub3Qgb25seSBpbiBjb2RlLCBzaW1wbGljaXR5XG4gICAgICAgICAgLy8gYW5kIGJlYXV0eSwgYnV0IGFsc28gaW4gcHJhY3RpY2UuXG4gICAgICAgICAgeC5kd1tpXSArPSAxO1xuICAgICAgICAgIHguZHdbeV0gLT0gMTtcbiAgICAgICAgICBsb3NzICs9IC15c2NvcmUgKyB4LndbaV0gKyBtYXJnaW47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGxvc3M7XG4gICAgfSxcbiAgICBnZXRQYXJhbXNBbmRHcmFkczogZnVuY3Rpb24oKSB7IFxuICAgICAgcmV0dXJuIFtdO1xuICAgIH0sXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBqc29uID0ge307XG4gICAgICBqc29uLm91dF9kZXB0aCA9IHRoaXMub3V0X2RlcHRoO1xuICAgICAganNvbi5vdXRfc3ggPSB0aGlzLm91dF9zeDtcbiAgICAgIGpzb24ub3V0X3N5ID0gdGhpcy5vdXRfc3k7XG4gICAgICBqc29uLmxheWVyX3R5cGUgPSB0aGlzLmxheWVyX3R5cGU7XG4gICAgICBqc29uLm51bV9pbnB1dHMgPSB0aGlzLm51bV9pbnB1dHM7XG4gICAgICByZXR1cm4ganNvbjtcbiAgICB9LFxuICAgIGZyb21KU09OOiBmdW5jdGlvbihqc29uKSB7XG4gICAgICB0aGlzLm91dF9kZXB0aCA9IGpzb24ub3V0X2RlcHRoO1xuICAgICAgdGhpcy5vdXRfc3ggPSBqc29uLm91dF9zeDtcbiAgICAgIHRoaXMub3V0X3N5ID0ganNvbi5vdXRfc3k7XG4gICAgICB0aGlzLmxheWVyX3R5cGUgPSBqc29uLmxheWVyX3R5cGU7XG4gICAgICB0aGlzLm51bV9pbnB1dHMgPSBqc29uLm51bV9pbnB1dHM7XG4gICAgfVxuICB9XG4gIFxuICBnbG9iYWwuUmVncmVzc2lvbkxheWVyID0gUmVncmVzc2lvbkxheWVyO1xuICBnbG9iYWwuU29mdG1heExheWVyID0gU29mdG1heExheWVyO1xuICBnbG9iYWwuU1ZNTGF5ZXIgPSBTVk1MYXllcjtcblxufSkoY29udm5ldGpzKTtcblxuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIFZvbCA9IGdsb2JhbC5Wb2w7IC8vIGNvbnZlbmllbmNlXG4gIFxuICAvLyBJbXBsZW1lbnRzIFJlTFUgbm9ubGluZWFyaXR5IGVsZW1lbnR3aXNlXG4gIC8vIHggLT4gbWF4KDAsIHgpXG4gIC8vIHRoZSBvdXRwdXQgaXMgaW4gWzAsIGluZilcbiAgdmFyIFJlbHVMYXllciA9IGZ1bmN0aW9uKG9wdCkge1xuICAgIHZhciBvcHQgPSBvcHQgfHwge307XG5cbiAgICAvLyBjb21wdXRlZFxuICAgIHRoaXMub3V0X3N4ID0gb3B0LmluX3N4O1xuICAgIHRoaXMub3V0X3N5ID0gb3B0LmluX3N5O1xuICAgIHRoaXMub3V0X2RlcHRoID0gb3B0LmluX2RlcHRoO1xuICAgIHRoaXMubGF5ZXJfdHlwZSA9ICdyZWx1JztcbiAgfVxuICBSZWx1TGF5ZXIucHJvdG90eXBlID0ge1xuICAgIGZvcndhcmQ6IGZ1bmN0aW9uKFYsIGlzX3RyYWluaW5nKSB7XG4gICAgICB0aGlzLmluX2FjdCA9IFY7XG4gICAgICB2YXIgVjIgPSBWLmNsb25lKCk7XG4gICAgICB2YXIgTiA9IFYudy5sZW5ndGg7XG4gICAgICB2YXIgVjJ3ID0gVjIudztcbiAgICAgIGZvcih2YXIgaT0wO2k8TjtpKyspIHsgXG4gICAgICAgIGlmKFYyd1tpXSA8IDApIFYyd1tpXSA9IDA7IC8vIHRocmVzaG9sZCBhdCAwXG4gICAgICB9XG4gICAgICB0aGlzLm91dF9hY3QgPSBWMjtcbiAgICAgIHJldHVybiB0aGlzLm91dF9hY3Q7XG4gICAgfSxcbiAgICBiYWNrd2FyZDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgViA9IHRoaXMuaW5fYWN0OyAvLyB3ZSBuZWVkIHRvIHNldCBkdyBvZiB0aGlzXG4gICAgICB2YXIgVjIgPSB0aGlzLm91dF9hY3Q7XG4gICAgICB2YXIgTiA9IFYudy5sZW5ndGg7XG4gICAgICBWLmR3ID0gZ2xvYmFsLnplcm9zKE4pOyAvLyB6ZXJvIG91dCBncmFkaWVudCB3cnQgZGF0YVxuICAgICAgZm9yKHZhciBpPTA7aTxOO2krKykge1xuICAgICAgICBpZihWMi53W2ldIDw9IDApIFYuZHdbaV0gPSAwOyAvLyB0aHJlc2hvbGRcbiAgICAgICAgZWxzZSBWLmR3W2ldID0gVjIuZHdbaV07XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRQYXJhbXNBbmRHcmFkczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSxcbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGpzb24gPSB7fTtcbiAgICAgIGpzb24ub3V0X2RlcHRoID0gdGhpcy5vdXRfZGVwdGg7XG4gICAgICBqc29uLm91dF9zeCA9IHRoaXMub3V0X3N4O1xuICAgICAganNvbi5vdXRfc3kgPSB0aGlzLm91dF9zeTtcbiAgICAgIGpzb24ubGF5ZXJfdHlwZSA9IHRoaXMubGF5ZXJfdHlwZTtcbiAgICAgIHJldHVybiBqc29uO1xuICAgIH0sXG4gICAgZnJvbUpTT046IGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgIHRoaXMub3V0X2RlcHRoID0ganNvbi5vdXRfZGVwdGg7XG4gICAgICB0aGlzLm91dF9zeCA9IGpzb24ub3V0X3N4O1xuICAgICAgdGhpcy5vdXRfc3kgPSBqc29uLm91dF9zeTtcbiAgICAgIHRoaXMubGF5ZXJfdHlwZSA9IGpzb24ubGF5ZXJfdHlwZTsgXG4gICAgfVxuICB9XG5cbiAgLy8gSW1wbGVtZW50cyBTaWdtb2lkIG5ub25saW5lYXJpdHkgZWxlbWVudHdpc2VcbiAgLy8geCAtPiAxLygxK2VeKC14KSlcbiAgLy8gc28gdGhlIG91dHB1dCBpcyBiZXR3ZWVuIDAgYW5kIDEuXG4gIHZhciBTaWdtb2lkTGF5ZXIgPSBmdW5jdGlvbihvcHQpIHtcbiAgICB2YXIgb3B0ID0gb3B0IHx8IHt9O1xuXG4gICAgLy8gY29tcHV0ZWRcbiAgICB0aGlzLm91dF9zeCA9IG9wdC5pbl9zeDtcbiAgICB0aGlzLm91dF9zeSA9IG9wdC5pbl9zeTtcbiAgICB0aGlzLm91dF9kZXB0aCA9IG9wdC5pbl9kZXB0aDtcbiAgICB0aGlzLmxheWVyX3R5cGUgPSAnc2lnbW9pZCc7XG4gIH1cbiAgU2lnbW9pZExheWVyLnByb3RvdHlwZSA9IHtcbiAgICBmb3J3YXJkOiBmdW5jdGlvbihWLCBpc190cmFpbmluZykge1xuICAgICAgdGhpcy5pbl9hY3QgPSBWO1xuICAgICAgdmFyIFYyID0gVi5jbG9uZUFuZFplcm8oKTtcbiAgICAgIHZhciBOID0gVi53Lmxlbmd0aDtcbiAgICAgIHZhciBWMncgPSBWMi53O1xuICAgICAgdmFyIFZ3ID0gVi53O1xuICAgICAgZm9yKHZhciBpPTA7aTxOO2krKykgeyBcbiAgICAgICAgVjJ3W2ldID0gMS4wLygxLjArTWF0aC5leHAoLVZ3W2ldKSk7XG4gICAgICB9XG4gICAgICB0aGlzLm91dF9hY3QgPSBWMjtcbiAgICAgIHJldHVybiB0aGlzLm91dF9hY3Q7XG4gICAgfSxcbiAgICBiYWNrd2FyZDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgViA9IHRoaXMuaW5fYWN0OyAvLyB3ZSBuZWVkIHRvIHNldCBkdyBvZiB0aGlzXG4gICAgICB2YXIgVjIgPSB0aGlzLm91dF9hY3Q7XG4gICAgICB2YXIgTiA9IFYudy5sZW5ndGg7XG4gICAgICBWLmR3ID0gZ2xvYmFsLnplcm9zKE4pOyAvLyB6ZXJvIG91dCBncmFkaWVudCB3cnQgZGF0YVxuICAgICAgZm9yKHZhciBpPTA7aTxOO2krKykge1xuICAgICAgICB2YXIgdjJ3aSA9IFYyLndbaV07XG4gICAgICAgIFYuZHdbaV0gPSAgdjJ3aSAqICgxLjAgLSB2MndpKSAqIFYyLmR3W2ldO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0UGFyYW1zQW5kR3JhZHM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH0sXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBqc29uID0ge307XG4gICAgICBqc29uLm91dF9kZXB0aCA9IHRoaXMub3V0X2RlcHRoO1xuICAgICAganNvbi5vdXRfc3ggPSB0aGlzLm91dF9zeDtcbiAgICAgIGpzb24ub3V0X3N5ID0gdGhpcy5vdXRfc3k7XG4gICAgICBqc29uLmxheWVyX3R5cGUgPSB0aGlzLmxheWVyX3R5cGU7XG4gICAgICByZXR1cm4ganNvbjtcbiAgICB9LFxuICAgIGZyb21KU09OOiBmdW5jdGlvbihqc29uKSB7XG4gICAgICB0aGlzLm91dF9kZXB0aCA9IGpzb24ub3V0X2RlcHRoO1xuICAgICAgdGhpcy5vdXRfc3ggPSBqc29uLm91dF9zeDtcbiAgICAgIHRoaXMub3V0X3N5ID0ganNvbi5vdXRfc3k7XG4gICAgICB0aGlzLmxheWVyX3R5cGUgPSBqc29uLmxheWVyX3R5cGU7IFxuICAgIH1cbiAgfVxuXG4gIC8vIEltcGxlbWVudHMgTWF4b3V0IG5ub25saW5lYXJpdHkgdGhhdCBjb21wdXRlc1xuICAvLyB4IC0+IG1heCh4KVxuICAvLyB3aGVyZSB4IGlzIGEgdmVjdG9yIG9mIHNpemUgZ3JvdXBfc2l6ZS4gSWRlYWxseSBvZiBjb3Vyc2UsXG4gIC8vIHRoZSBpbnB1dCBzaXplIHNob3VsZCBiZSBleGFjdGx5IGRpdmlzaWJsZSBieSBncm91cF9zaXplXG4gIHZhciBNYXhvdXRMYXllciA9IGZ1bmN0aW9uKG9wdCkge1xuICAgIHZhciBvcHQgPSBvcHQgfHwge307XG5cbiAgICAvLyByZXF1aXJlZFxuICAgIHRoaXMuZ3JvdXBfc2l6ZSA9IHR5cGVvZiBvcHQuZ3JvdXBfc2l6ZSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHQuZ3JvdXBfc2l6ZSA6IDI7XG5cbiAgICAvLyBjb21wdXRlZFxuICAgIHRoaXMub3V0X3N4ID0gb3B0LmluX3N4O1xuICAgIHRoaXMub3V0X3N5ID0gb3B0LmluX3N5O1xuICAgIHRoaXMub3V0X2RlcHRoID0gTWF0aC5mbG9vcihvcHQuaW5fZGVwdGggLyB0aGlzLmdyb3VwX3NpemUpO1xuICAgIHRoaXMubGF5ZXJfdHlwZSA9ICdtYXhvdXQnO1xuXG4gICAgdGhpcy5zd2l0Y2hlcyA9IGdsb2JhbC56ZXJvcyh0aGlzLm91dF9zeCp0aGlzLm91dF9zeSp0aGlzLm91dF9kZXB0aCk7IC8vIHVzZWZ1bCBmb3IgYmFja3Byb3BcbiAgfVxuICBNYXhvdXRMYXllci5wcm90b3R5cGUgPSB7XG4gICAgZm9yd2FyZDogZnVuY3Rpb24oViwgaXNfdHJhaW5pbmcpIHtcbiAgICAgIHRoaXMuaW5fYWN0ID0gVjtcbiAgICAgIHZhciBOID0gdGhpcy5vdXRfZGVwdGg7IFxuICAgICAgdmFyIFYyID0gbmV3IFZvbCh0aGlzLm91dF9zeCwgdGhpcy5vdXRfc3ksIHRoaXMub3V0X2RlcHRoLCAwLjApO1xuXG4gICAgICAvLyBvcHRpbWl6YXRpb24gYnJhbmNoLiBJZiB3ZSdyZSBvcGVyYXRpbmcgb24gMUQgYXJyYXlzIHdlIGRvbnQgaGF2ZVxuICAgICAgLy8gdG8gd29ycnkgYWJvdXQga2VlcGluZyB0cmFjayBvZiB4LHksZCBjb29yZGluYXRlcyBpbnNpZGVcbiAgICAgIC8vIGlucHV0IHZvbHVtZXMuIEluIGNvbnZuZXRzIHdlIGRvIDooXG4gICAgICBpZih0aGlzLm91dF9zeCA9PT0gMSAmJiB0aGlzLm91dF9zeSA9PT0gMSkge1xuICAgICAgICBmb3IodmFyIGk9MDtpPE47aSsrKSB7XG4gICAgICAgICAgdmFyIGl4ID0gaSAqIHRoaXMuZ3JvdXBfc2l6ZTsgLy8gYmFzZSBpbmRleCBvZmZzZXRcbiAgICAgICAgICB2YXIgYSA9IFYud1tpeF07XG4gICAgICAgICAgdmFyIGFpID0gMDtcbiAgICAgICAgICBmb3IodmFyIGo9MTtqPHRoaXMuZ3JvdXBfc2l6ZTtqKyspIHtcbiAgICAgICAgICAgIHZhciBhMiA9IFYud1tpeCtqXTtcbiAgICAgICAgICAgIGlmKGEyID4gYSkge1xuICAgICAgICAgICAgICBhID0gYTI7XG4gICAgICAgICAgICAgIGFpID0gajtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgVjIud1tpXSA9IGE7XG4gICAgICAgICAgdGhpcy5zd2l0Y2hlc1tpXSA9IGl4ICsgYWk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuPTA7IC8vIGNvdW50ZXIgZm9yIHN3aXRjaGVzXG4gICAgICAgIGZvcih2YXIgeD0wO3g8Vi5zeDt4KyspIHtcbiAgICAgICAgICBmb3IodmFyIHk9MDt5PFYuc3k7eSsrKSB7XG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPE47aSsrKSB7XG4gICAgICAgICAgICAgIHZhciBpeCA9IGkgKiB0aGlzLmdyb3VwX3NpemU7XG4gICAgICAgICAgICAgIHZhciBhID0gVi5nZXQoeCwgeSwgaXgpO1xuICAgICAgICAgICAgICB2YXIgYWkgPSAwO1xuICAgICAgICAgICAgICBmb3IodmFyIGo9MTtqPHRoaXMuZ3JvdXBfc2l6ZTtqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYTIgPSBWLmdldCh4LCB5LCBpeCtqKTtcbiAgICAgICAgICAgICAgICBpZihhMiA+IGEpIHtcbiAgICAgICAgICAgICAgICAgIGEgPSBhMjtcbiAgICAgICAgICAgICAgICAgIGFpID0gajtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgVjIuc2V0KHgseSxpLGEpO1xuICAgICAgICAgICAgICB0aGlzLnN3aXRjaGVzW25dID0gaXggKyBhaTtcbiAgICAgICAgICAgICAgbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgICB0aGlzLm91dF9hY3QgPSBWMjtcbiAgICAgIHJldHVybiB0aGlzLm91dF9hY3Q7XG4gICAgfSxcbiAgICBiYWNrd2FyZDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgViA9IHRoaXMuaW5fYWN0OyAvLyB3ZSBuZWVkIHRvIHNldCBkdyBvZiB0aGlzXG4gICAgICB2YXIgVjIgPSB0aGlzLm91dF9hY3Q7XG4gICAgICB2YXIgTiA9IHRoaXMub3V0X2RlcHRoO1xuICAgICAgVi5kdyA9IGdsb2JhbC56ZXJvcyhWLncubGVuZ3RoKTsgLy8gemVybyBvdXQgZ3JhZGllbnQgd3J0IGRhdGFcblxuICAgICAgLy8gcGFzcyB0aGUgZ3JhZGllbnQgdGhyb3VnaCB0aGUgYXBwcm9wcmlhdGUgc3dpdGNoXG4gICAgICBpZih0aGlzLm91dF9zeCA9PT0gMSAmJiB0aGlzLm91dF9zeSA9PT0gMSkge1xuICAgICAgICBmb3IodmFyIGk9MDtpPE47aSsrKSB7XG4gICAgICAgICAgdmFyIGNoYWluX2dyYWQgPSBWMi5kd1tpXTtcbiAgICAgICAgICBWLmR3W3RoaXMuc3dpdGNoZXNbaV1dID0gY2hhaW5fZ3JhZDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gYmxlaCBva2F5LCBsZXRzIGRvIHRoaXMgdGhlIGhhcmQgd2F5XG4gICAgICAgIHZhciBuPTA7IC8vIGNvdW50ZXIgZm9yIHN3aXRjaGVzXG4gICAgICAgIGZvcih2YXIgeD0wO3g8VjIuc3g7eCsrKSB7XG4gICAgICAgICAgZm9yKHZhciB5PTA7eTxWMi5zeTt5KyspIHtcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8TjtpKyspIHtcbiAgICAgICAgICAgICAgdmFyIGNoYWluX2dyYWQgPSBWMi5nZXRfZ3JhZCh4LHksaSk7XG4gICAgICAgICAgICAgIFYuc2V0X2dyYWQoeCx5LHRoaXMuc3dpdGNoZXNbbl0sY2hhaW5fZ3JhZCk7XG4gICAgICAgICAgICAgIG4rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGdldFBhcmFtc0FuZEdyYWRzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9LFxuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIganNvbiA9IHt9O1xuICAgICAganNvbi5vdXRfZGVwdGggPSB0aGlzLm91dF9kZXB0aDtcbiAgICAgIGpzb24ub3V0X3N4ID0gdGhpcy5vdXRfc3g7XG4gICAgICBqc29uLm91dF9zeSA9IHRoaXMub3V0X3N5O1xuICAgICAganNvbi5sYXllcl90eXBlID0gdGhpcy5sYXllcl90eXBlO1xuICAgICAganNvbi5ncm91cF9zaXplID0gdGhpcy5ncm91cF9zaXplO1xuICAgICAgcmV0dXJuIGpzb247XG4gICAgfSxcbiAgICBmcm9tSlNPTjogZnVuY3Rpb24oanNvbikge1xuICAgICAgdGhpcy5vdXRfZGVwdGggPSBqc29uLm91dF9kZXB0aDtcbiAgICAgIHRoaXMub3V0X3N4ID0ganNvbi5vdXRfc3g7XG4gICAgICB0aGlzLm91dF9zeSA9IGpzb24ub3V0X3N5O1xuICAgICAgdGhpcy5sYXllcl90eXBlID0ganNvbi5sYXllcl90eXBlOyBcbiAgICAgIHRoaXMuZ3JvdXBfc2l6ZSA9IGpzb24uZ3JvdXBfc2l6ZTtcbiAgICAgIHRoaXMuc3dpdGNoZXMgPSBnbG9iYWwuemVyb3ModGhpcy5ncm91cF9zaXplKTtcbiAgICB9XG4gIH1cblxuICAvLyBhIGhlbHBlciBmdW5jdGlvbiwgc2luY2UgdGFuaCBpcyBub3QgeWV0IHBhcnQgb2YgRUNNQVNjcmlwdC4gV2lsbCBiZSBpbiB2Ni5cbiAgZnVuY3Rpb24gdGFuaCh4KSB7XG4gICAgdmFyIHkgPSBNYXRoLmV4cCgyICogeCk7XG4gICAgcmV0dXJuICh5IC0gMSkgLyAoeSArIDEpO1xuICB9XG4gIC8vIEltcGxlbWVudHMgVGFuaCBubm9ubGluZWFyaXR5IGVsZW1lbnR3aXNlXG4gIC8vIHggLT4gdGFuaCh4KSBcbiAgLy8gc28gdGhlIG91dHB1dCBpcyBiZXR3ZWVuIC0xIGFuZCAxLlxuICB2YXIgVGFuaExheWVyID0gZnVuY3Rpb24ob3B0KSB7XG4gICAgdmFyIG9wdCA9IG9wdCB8fCB7fTtcblxuICAgIC8vIGNvbXB1dGVkXG4gICAgdGhpcy5vdXRfc3ggPSBvcHQuaW5fc3g7XG4gICAgdGhpcy5vdXRfc3kgPSBvcHQuaW5fc3k7XG4gICAgdGhpcy5vdXRfZGVwdGggPSBvcHQuaW5fZGVwdGg7XG4gICAgdGhpcy5sYXllcl90eXBlID0gJ3RhbmgnO1xuICB9XG4gIFRhbmhMYXllci5wcm90b3R5cGUgPSB7XG4gICAgZm9yd2FyZDogZnVuY3Rpb24oViwgaXNfdHJhaW5pbmcpIHtcbiAgICAgIHRoaXMuaW5fYWN0ID0gVjtcbiAgICAgIHZhciBWMiA9IFYuY2xvbmVBbmRaZXJvKCk7XG4gICAgICB2YXIgTiA9IFYudy5sZW5ndGg7XG4gICAgICBmb3IodmFyIGk9MDtpPE47aSsrKSB7IFxuICAgICAgICBWMi53W2ldID0gdGFuaChWLndbaV0pO1xuICAgICAgfVxuICAgICAgdGhpcy5vdXRfYWN0ID0gVjI7XG4gICAgICByZXR1cm4gdGhpcy5vdXRfYWN0O1xuICAgIH0sXG4gICAgYmFja3dhcmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIFYgPSB0aGlzLmluX2FjdDsgLy8gd2UgbmVlZCB0byBzZXQgZHcgb2YgdGhpc1xuICAgICAgdmFyIFYyID0gdGhpcy5vdXRfYWN0O1xuICAgICAgdmFyIE4gPSBWLncubGVuZ3RoO1xuICAgICAgVi5kdyA9IGdsb2JhbC56ZXJvcyhOKTsgLy8gemVybyBvdXQgZ3JhZGllbnQgd3J0IGRhdGFcbiAgICAgIGZvcih2YXIgaT0wO2k8TjtpKyspIHtcbiAgICAgICAgdmFyIHYyd2kgPSBWMi53W2ldO1xuICAgICAgICBWLmR3W2ldID0gKDEuMCAtIHYyd2kgKiB2MndpKSAqIFYyLmR3W2ldO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0UGFyYW1zQW5kR3JhZHM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH0sXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBqc29uID0ge307XG4gICAgICBqc29uLm91dF9kZXB0aCA9IHRoaXMub3V0X2RlcHRoO1xuICAgICAganNvbi5vdXRfc3ggPSB0aGlzLm91dF9zeDtcbiAgICAgIGpzb24ub3V0X3N5ID0gdGhpcy5vdXRfc3k7XG4gICAgICBqc29uLmxheWVyX3R5cGUgPSB0aGlzLmxheWVyX3R5cGU7XG4gICAgICByZXR1cm4ganNvbjtcbiAgICB9LFxuICAgIGZyb21KU09OOiBmdW5jdGlvbihqc29uKSB7XG4gICAgICB0aGlzLm91dF9kZXB0aCA9IGpzb24ub3V0X2RlcHRoO1xuICAgICAgdGhpcy5vdXRfc3ggPSBqc29uLm91dF9zeDtcbiAgICAgIHRoaXMub3V0X3N5ID0ganNvbi5vdXRfc3k7XG4gICAgICB0aGlzLmxheWVyX3R5cGUgPSBqc29uLmxheWVyX3R5cGU7IFxuICAgIH1cbiAgfVxuICBcbiAgZ2xvYmFsLlRhbmhMYXllciA9IFRhbmhMYXllcjtcbiAgZ2xvYmFsLk1heG91dExheWVyID0gTWF4b3V0TGF5ZXI7XG4gIGdsb2JhbC5SZWx1TGF5ZXIgPSBSZWx1TGF5ZXI7XG4gIGdsb2JhbC5TaWdtb2lkTGF5ZXIgPSBTaWdtb2lkTGF5ZXI7XG5cbn0pKGNvbnZuZXRqcyk7XG5cbihmdW5jdGlvbihnbG9iYWwpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBWb2wgPSBnbG9iYWwuVm9sOyAvLyBjb252ZW5pZW5jZVxuXG4gIC8vIEFuIGluZWZmaWNpZW50IGRyb3BvdXQgbGF5ZXJcbiAgLy8gTm90ZSB0aGlzIGlzIG5vdCBtb3N0IGVmZmljaWVudCBpbXBsZW1lbnRhdGlvbiBzaW5jZSB0aGUgbGF5ZXIgYmVmb3JlXG4gIC8vIGNvbXB1dGVkIGFsbCB0aGVzZSBhY3RpdmF0aW9ucyBhbmQgbm93IHdlJ3JlIGp1c3QgZ29pbmcgdG8gZHJvcCB0aGVtIDooXG4gIC8vIHNhbWUgZ29lcyBmb3IgYmFja3dhcmQgcGFzcy4gQWxzbywgaWYgd2Ugd2FudGVkIHRvIGJlIGVmZmljaWVudCBhdCB0ZXN0IHRpbWVcbiAgLy8gd2UgY291bGQgZXF1aXZhbGVudGx5IGJlIGNsZXZlciBhbmQgdXBzY2FsZSBkdXJpbmcgdHJhaW4gYW5kIGNvcHkgcG9pbnRlcnMgZHVyaW5nIHRlc3RcbiAgLy8gdG9kbzogbWFrZSBtb3JlIGVmZmljaWVudC5cbiAgdmFyIERyb3BvdXRMYXllciA9IGZ1bmN0aW9uKG9wdCkge1xuICAgIHZhciBvcHQgPSBvcHQgfHwge307XG5cbiAgICAvLyBjb21wdXRlZFxuICAgIHRoaXMub3V0X3N4ID0gb3B0LmluX3N4O1xuICAgIHRoaXMub3V0X3N5ID0gb3B0LmluX3N5O1xuICAgIHRoaXMub3V0X2RlcHRoID0gb3B0LmluX2RlcHRoO1xuICAgIHRoaXMubGF5ZXJfdHlwZSA9ICdkcm9wb3V0JztcbiAgICB0aGlzLmRyb3BfcHJvYiA9IHR5cGVvZiBvcHQuZHJvcF9wcm9iICE9PSAndW5kZWZpbmVkJyA/IG9wdC5kcm9wX3Byb2IgOiAwLjU7XG4gICAgdGhpcy5kcm9wcGVkID0gZ2xvYmFsLnplcm9zKHRoaXMub3V0X3N4KnRoaXMub3V0X3N5KnRoaXMub3V0X2RlcHRoKTtcbiAgfVxuICBEcm9wb3V0TGF5ZXIucHJvdG90eXBlID0ge1xuICAgIGZvcndhcmQ6IGZ1bmN0aW9uKFYsIGlzX3RyYWluaW5nKSB7XG4gICAgICB0aGlzLmluX2FjdCA9IFY7XG4gICAgICBpZih0eXBlb2YoaXNfdHJhaW5pbmcpPT09J3VuZGVmaW5lZCcpIHsgaXNfdHJhaW5pbmcgPSBmYWxzZTsgfSAvLyBkZWZhdWx0IGlzIHByZWRpY3Rpb24gbW9kZVxuICAgICAgdmFyIFYyID0gVi5jbG9uZSgpO1xuICAgICAgdmFyIE4gPSBWLncubGVuZ3RoO1xuICAgICAgaWYoaXNfdHJhaW5pbmcpIHtcbiAgICAgICAgLy8gZG8gZHJvcG91dFxuICAgICAgICBmb3IodmFyIGk9MDtpPE47aSsrKSB7XG4gICAgICAgICAgaWYoTWF0aC5yYW5kb20oKTx0aGlzLmRyb3BfcHJvYikgeyBWMi53W2ldPTA7IHRoaXMuZHJvcHBlZFtpXSA9IHRydWU7IH0gLy8gZHJvcCFcbiAgICAgICAgICBlbHNlIHt0aGlzLmRyb3BwZWRbaV0gPSBmYWxzZTt9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHNjYWxlIHRoZSBhY3RpdmF0aW9ucyBkdXJpbmcgcHJlZGljdGlvblxuICAgICAgICBmb3IodmFyIGk9MDtpPE47aSsrKSB7IFYyLndbaV0qPXRoaXMuZHJvcF9wcm9iOyB9XG4gICAgICB9XG4gICAgICB0aGlzLm91dF9hY3QgPSBWMjtcbiAgICAgIHJldHVybiB0aGlzLm91dF9hY3Q7IC8vIGR1bW15IGlkZW50aXR5IGZ1bmN0aW9uIGZvciBub3dcbiAgICB9LFxuICAgIGJhY2t3YXJkOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBWID0gdGhpcy5pbl9hY3Q7IC8vIHdlIG5lZWQgdG8gc2V0IGR3IG9mIHRoaXNcbiAgICAgIHZhciBjaGFpbl9ncmFkID0gdGhpcy5vdXRfYWN0O1xuICAgICAgdmFyIE4gPSBWLncubGVuZ3RoO1xuICAgICAgVi5kdyA9IGdsb2JhbC56ZXJvcyhOKTsgLy8gemVybyBvdXQgZ3JhZGllbnQgd3J0IGRhdGFcbiAgICAgIGZvcih2YXIgaT0wO2k8TjtpKyspIHtcbiAgICAgICAgaWYoISh0aGlzLmRyb3BwZWRbaV0pKSB7IFxuICAgICAgICAgIFYuZHdbaV0gPSBjaGFpbl9ncmFkLmR3W2ldOyAvLyBjb3B5IG92ZXIgdGhlIGdyYWRpZW50XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGdldFBhcmFtc0FuZEdyYWRzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9LFxuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIganNvbiA9IHt9O1xuICAgICAganNvbi5vdXRfZGVwdGggPSB0aGlzLm91dF9kZXB0aDtcbiAgICAgIGpzb24ub3V0X3N4ID0gdGhpcy5vdXRfc3g7XG4gICAgICBqc29uLm91dF9zeSA9IHRoaXMub3V0X3N5O1xuICAgICAganNvbi5sYXllcl90eXBlID0gdGhpcy5sYXllcl90eXBlO1xuICAgICAganNvbi5kcm9wX3Byb2IgPSB0aGlzLmRyb3BfcHJvYjtcbiAgICAgIHJldHVybiBqc29uO1xuICAgIH0sXG4gICAgZnJvbUpTT046IGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgIHRoaXMub3V0X2RlcHRoID0ganNvbi5vdXRfZGVwdGg7XG4gICAgICB0aGlzLm91dF9zeCA9IGpzb24ub3V0X3N4O1xuICAgICAgdGhpcy5vdXRfc3kgPSBqc29uLm91dF9zeTtcbiAgICAgIHRoaXMubGF5ZXJfdHlwZSA9IGpzb24ubGF5ZXJfdHlwZTsgXG4gICAgICB0aGlzLmRyb3BfcHJvYiA9IGpzb24uZHJvcF9wcm9iO1xuICAgIH1cbiAgfVxuICBcblxuICBnbG9iYWwuRHJvcG91dExheWVyID0gRHJvcG91dExheWVyO1xufSkoY29udm5ldGpzKTtcbihmdW5jdGlvbihnbG9iYWwpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBWb2wgPSBnbG9iYWwuVm9sOyAvLyBjb252ZW5pZW5jZVxuICBcbiAgLy8gYSBiaXQgZXhwZXJpbWVudGFsIGxheWVyIGZvciBub3cuIEkgdGhpbmsgaXQgd29ya3MgYnV0IEknbSBub3QgMTAwJVxuICAvLyB0aGUgZ3JhZGllbnQgY2hlY2sgaXMgYSBiaXQgZnVua3kuIEknbGwgbG9vayBpbnRvIHRoaXMgYSBiaXQgbGF0ZXIuXG4gIC8vIExvY2FsIFJlc3BvbnNlIE5vcm1hbGl6YXRpb24gaW4gd2luZG93LCBhbG9uZyBkZXB0aHMgb2Ygdm9sdW1lc1xuICB2YXIgTG9jYWxSZXNwb25zZU5vcm1hbGl6YXRpb25MYXllciA9IGZ1bmN0aW9uKG9wdCkge1xuICAgIHZhciBvcHQgPSBvcHQgfHwge307XG5cbiAgICAvLyByZXF1aXJlZFxuICAgIHRoaXMuayA9IG9wdC5rO1xuICAgIHRoaXMubiA9IG9wdC5uO1xuICAgIHRoaXMuYWxwaGEgPSBvcHQuYWxwaGE7XG4gICAgdGhpcy5iZXRhID0gb3B0LmJldGE7XG5cbiAgICAvLyBjb21wdXRlZFxuICAgIHRoaXMub3V0X3N4ID0gb3B0LmluX3N4O1xuICAgIHRoaXMub3V0X3N5ID0gb3B0LmluX3N5O1xuICAgIHRoaXMub3V0X2RlcHRoID0gb3B0LmluX2RlcHRoO1xuICAgIHRoaXMubGF5ZXJfdHlwZSA9ICdscm4nO1xuXG4gICAgLy8gY2hlY2tzXG4gICAgaWYodGhpcy5uJTIgPT09IDApIHsgY29uc29sZS5sb2coJ1dBUk5JTkcgbiBzaG91bGQgYmUgb2RkIGZvciBMUk4gbGF5ZXInKTsgfVxuICB9XG4gIExvY2FsUmVzcG9uc2VOb3JtYWxpemF0aW9uTGF5ZXIucHJvdG90eXBlID0ge1xuICAgIGZvcndhcmQ6IGZ1bmN0aW9uKFYsIGlzX3RyYWluaW5nKSB7XG4gICAgICB0aGlzLmluX2FjdCA9IFY7XG5cbiAgICAgIHZhciBBID0gVi5jbG9uZUFuZFplcm8oKTtcbiAgICAgIHRoaXMuU19jYWNoZV8gPSBWLmNsb25lQW5kWmVybygpO1xuICAgICAgdmFyIG4yID0gTWF0aC5mbG9vcih0aGlzLm4vMik7XG4gICAgICBmb3IodmFyIHg9MDt4PFYuc3g7eCsrKSB7XG4gICAgICAgIGZvcih2YXIgeT0wO3k8Vi5zeTt5KyspIHtcbiAgICAgICAgICBmb3IodmFyIGk9MDtpPFYuZGVwdGg7aSsrKSB7XG5cbiAgICAgICAgICAgIHZhciBhaSA9IFYuZ2V0KHgseSxpKTtcblxuICAgICAgICAgICAgLy8gbm9ybWFsaXplIGluIGEgd2luZG93IG9mIHNpemUgblxuICAgICAgICAgICAgdmFyIGRlbiA9IDAuMDtcbiAgICAgICAgICAgIGZvcih2YXIgaj1NYXRoLm1heCgwLGktbjIpO2o8PU1hdGgubWluKGkrbjIsVi5kZXB0aC0xKTtqKyspIHtcbiAgICAgICAgICAgICAgdmFyIGFhID0gVi5nZXQoeCx5LGopO1xuICAgICAgICAgICAgICBkZW4gKz0gYWEqYWE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZW4gKj0gdGhpcy5hbHBoYSAvIHRoaXMubjtcbiAgICAgICAgICAgIGRlbiArPSB0aGlzLms7XG4gICAgICAgICAgICB0aGlzLlNfY2FjaGVfLnNldCh4LHksaSxkZW4pOyAvLyB3aWxsIGJlIHVzZWZ1bCBmb3IgYmFja3Byb3BcbiAgICAgICAgICAgIGRlbiA9IE1hdGgucG93KGRlbiwgdGhpcy5iZXRhKTtcbiAgICAgICAgICAgIEEuc2V0KHgseSxpLGFpL2Rlbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMub3V0X2FjdCA9IEE7XG4gICAgICByZXR1cm4gdGhpcy5vdXRfYWN0OyAvLyBkdW1teSBpZGVudGl0eSBmdW5jdGlvbiBmb3Igbm93XG4gICAgfSxcbiAgICBiYWNrd2FyZDogZnVuY3Rpb24oKSB7IFxuICAgICAgLy8gZXZhbHVhdGUgZ3JhZGllbnQgd3J0IGRhdGFcbiAgICAgIHZhciBWID0gdGhpcy5pbl9hY3Q7IC8vIHdlIG5lZWQgdG8gc2V0IGR3IG9mIHRoaXNcbiAgICAgIFYuZHcgPSBnbG9iYWwuemVyb3MoVi53Lmxlbmd0aCk7IC8vIHplcm8gb3V0IGdyYWRpZW50IHdydCBkYXRhXG4gICAgICB2YXIgQSA9IHRoaXMub3V0X2FjdDsgLy8gY29tcHV0ZWQgaW4gZm9yd2FyZCBwYXNzIFxuXG4gICAgICB2YXIgbjIgPSBNYXRoLmZsb29yKHRoaXMubi8yKTtcbiAgICAgIGZvcih2YXIgeD0wO3g8Vi5zeDt4KyspIHtcbiAgICAgICAgZm9yKHZhciB5PTA7eTxWLnN5O3krKykge1xuICAgICAgICAgIGZvcih2YXIgaT0wO2k8Vi5kZXB0aDtpKyspIHtcblxuICAgICAgICAgICAgdmFyIGNoYWluX2dyYWQgPSB0aGlzLm91dF9hY3QuZ2V0X2dyYWQoeCx5LGkpO1xuICAgICAgICAgICAgdmFyIFMgPSB0aGlzLlNfY2FjaGVfLmdldCh4LHksaSk7XG4gICAgICAgICAgICB2YXIgU0IgPSBNYXRoLnBvdyhTLCB0aGlzLmJldGEpO1xuICAgICAgICAgICAgdmFyIFNCMiA9IFNCKlNCO1xuXG4gICAgICAgICAgICAvLyBub3JtYWxpemUgaW4gYSB3aW5kb3cgb2Ygc2l6ZSBuXG4gICAgICAgICAgICBmb3IodmFyIGo9TWF0aC5tYXgoMCxpLW4yKTtqPD1NYXRoLm1pbihpK24yLFYuZGVwdGgtMSk7aisrKSB7ICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgdmFyIGFqID0gVi5nZXQoeCx5LGopOyBcbiAgICAgICAgICAgICAgdmFyIGcgPSAtYWoqdGhpcy5iZXRhKk1hdGgucG93KFMsdGhpcy5iZXRhLTEpKnRoaXMuYWxwaGEvdGhpcy5uKjIqYWo7XG4gICAgICAgICAgICAgIGlmKGo9PT1pKSBnKz0gU0I7XG4gICAgICAgICAgICAgIGcgLz0gU0IyO1xuICAgICAgICAgICAgICBnICo9IGNoYWluX2dyYWQ7XG4gICAgICAgICAgICAgIFYuYWRkX2dyYWQoeCx5LGosZyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGdldFBhcmFtc0FuZEdyYWRzOiBmdW5jdGlvbigpIHsgcmV0dXJuIFtdOyB9LFxuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIganNvbiA9IHt9O1xuICAgICAganNvbi5rID0gdGhpcy5rO1xuICAgICAganNvbi5uID0gdGhpcy5uO1xuICAgICAganNvbi5hbHBoYSA9IHRoaXMuYWxwaGE7IC8vIG5vcm1hbGl6ZSBieSBzaXplXG4gICAgICBqc29uLmJldGEgPSB0aGlzLmJldGE7XG4gICAgICBqc29uLm91dF9zeCA9IHRoaXMub3V0X3N4OyBcbiAgICAgIGpzb24ub3V0X3N5ID0gdGhpcy5vdXRfc3k7XG4gICAgICBqc29uLm91dF9kZXB0aCA9IHRoaXMub3V0X2RlcHRoO1xuICAgICAganNvbi5sYXllcl90eXBlID0gdGhpcy5sYXllcl90eXBlO1xuICAgICAgcmV0dXJuIGpzb247XG4gICAgfSxcbiAgICBmcm9tSlNPTjogZnVuY3Rpb24oanNvbikge1xuICAgICAgdGhpcy5rID0ganNvbi5rO1xuICAgICAgdGhpcy5uID0ganNvbi5uO1xuICAgICAgdGhpcy5hbHBoYSA9IGpzb24uYWxwaGE7IC8vIG5vcm1hbGl6ZSBieSBzaXplXG4gICAgICB0aGlzLmJldGEgPSBqc29uLmJldGE7XG4gICAgICB0aGlzLm91dF9zeCA9IGpzb24ub3V0X3N4OyBcbiAgICAgIHRoaXMub3V0X3N5ID0ganNvbi5vdXRfc3k7XG4gICAgICB0aGlzLm91dF9kZXB0aCA9IGpzb24ub3V0X2RlcHRoO1xuICAgICAgdGhpcy5sYXllcl90eXBlID0ganNvbi5sYXllcl90eXBlO1xuICAgIH1cbiAgfVxuICBcblxuICBnbG9iYWwuTG9jYWxSZXNwb25zZU5vcm1hbGl6YXRpb25MYXllciA9IExvY2FsUmVzcG9uc2VOb3JtYWxpemF0aW9uTGF5ZXI7XG59KShjb252bmV0anMpO1xuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIFZvbCA9IGdsb2JhbC5Wb2w7IC8vIGNvbnZlbmllbmNlXG5cbiAgLy8gdHJhbnNmb3JtcyB4LT4gW3gsIHhfaSp4X2ogZm9yYWxsIGksal1cbiAgLy8gc28gdGhlIGZ1bGx5IGNvbm5lY3RlZCBsYXllciBhZnRlcnMgd2lsbCBlc3NlbnRpYWxseSBiZSBkb2luZyB0ZW5zb3IgbXVsdGlwbGllc1xuICB2YXIgUXVhZFRyYW5zZm9ybUxheWVyID0gZnVuY3Rpb24ob3B0KSB7XG4gICAgdmFyIG9wdCA9IG9wdCB8fCB7fTtcblxuICAgIC8vIGNvbXB1dGVkXG4gICAgdGhpcy5vdXRfc3ggPSBvcHQuaW5fc3g7XG4gICAgdGhpcy5vdXRfc3kgPSBvcHQuaW5fc3k7XG4gICAgLy8gbGluZWFyIHRlcm1zLCBhbmQgdGhlbiBxdWFkcmF0aWMgdGVybXMsIG9mIHdoaWNoIHRoZXJlIGFyZSAxLzIqbioobisxKSxcbiAgICAvLyAob2ZmZGlhZ29uYWxzIGFuZCB0aGUgZGlhZ29uYWwgdG90YWwpIGFuZCBhcml0aG1ldGljIHNlcmllcy5cbiAgICAvLyBBY3R1YWxseSBuZXZlciBtaW5kLCBsZXRzIG5vdCBiZSBmYW5jeSBoZXJlIHlldCBhbmQganVzdCBpbmNsdWRlXG4gICAgLy8gdGVybXMgeF9peF9qIGFuZCB4X2p4X2kgdHdpY2UuIEhhbGYgYXMgZWZmaWNpZW50IGJ1dCBtdWNoIGxlc3NcbiAgICAvLyBoZWFkYWNoZS5cbiAgICB0aGlzLm91dF9kZXB0aCA9IG9wdC5pbl9kZXB0aCArIG9wdC5pbl9kZXB0aCAqIG9wdC5pbl9kZXB0aDtcbiAgICB0aGlzLmxheWVyX3R5cGUgPSAncXVhZHRyYW5zZm9ybSc7XG5cbiAgfVxuICBRdWFkVHJhbnNmb3JtTGF5ZXIucHJvdG90eXBlID0ge1xuICAgIGZvcndhcmQ6IGZ1bmN0aW9uKFYsIGlzX3RyYWluaW5nKSB7XG4gICAgICB0aGlzLmluX2FjdCA9IFY7XG4gICAgICB2YXIgTiA9IHRoaXMub3V0X2RlcHRoO1xuICAgICAgdmFyIE5pID0gVi5kZXB0aDtcbiAgICAgIHZhciBWMiA9IG5ldyBWb2wodGhpcy5vdXRfc3gsIHRoaXMub3V0X3N5LCB0aGlzLm91dF9kZXB0aCwgMC4wKTtcbiAgICAgIGZvcih2YXIgeD0wO3g8Vi5zeDt4KyspIHtcbiAgICAgICAgZm9yKHZhciB5PTA7eTxWLnN5O3krKykge1xuICAgICAgICAgIGZvcih2YXIgaT0wO2k8TjtpKyspIHtcbiAgICAgICAgICAgIGlmKGk8TmkpIHtcbiAgICAgICAgICAgICAgVjIuc2V0KHgseSxpLFYuZ2V0KHgseSxpKSk7IC8vIGNvcHkgdGhlc2Ugb3ZlciAobGluZWFyIHRlcm1zKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdmFyIGkwID0gTWF0aC5mbG9vcigoaS1OaSkvTmkpO1xuICAgICAgICAgICAgICB2YXIgaTEgPSAoaS1OaSkgLSBpMCpOaTtcbiAgICAgICAgICAgICAgVjIuc2V0KHgseSxpLFYuZ2V0KHgseSxpMCkgKiBWLmdldCh4LHksaTEpKTsgLy8gcXVhZHJhdGljXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLm91dF9hY3QgPSBWMjtcbiAgICAgIHJldHVybiB0aGlzLm91dF9hY3Q7IC8vIGR1bW15IGlkZW50aXR5IGZ1bmN0aW9uIGZvciBub3dcbiAgICB9LFxuICAgIGJhY2t3YXJkOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBWID0gdGhpcy5pbl9hY3Q7XG4gICAgICBWLmR3ID0gZ2xvYmFsLnplcm9zKFYudy5sZW5ndGgpOyAvLyB6ZXJvIG91dCBncmFkaWVudCB3cnQgZGF0YVxuICAgICAgdmFyIFYyID0gdGhpcy5vdXRfYWN0O1xuICAgICAgdmFyIE4gPSB0aGlzLm91dF9kZXB0aDtcbiAgICAgIHZhciBOaSA9IFYuZGVwdGg7XG4gICAgICBmb3IodmFyIHg9MDt4PFYuc3g7eCsrKSB7XG4gICAgICAgIGZvcih2YXIgeT0wO3k8Vi5zeTt5KyspIHtcbiAgICAgICAgICBmb3IodmFyIGk9MDtpPE47aSsrKSB7XG4gICAgICAgICAgICB2YXIgY2hhaW5fZ3JhZCA9IFYyLmdldF9ncmFkKHgseSxpKTtcbiAgICAgICAgICAgIGlmKGk8TmkpIHtcbiAgICAgICAgICAgICAgVi5hZGRfZ3JhZCh4LHksaSxjaGFpbl9ncmFkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHZhciBpMCA9IE1hdGguZmxvb3IoKGktTmkpL05pKTtcbiAgICAgICAgICAgICAgdmFyIGkxID0gKGktTmkpIC0gaTAqTmk7XG4gICAgICAgICAgICAgIFYuYWRkX2dyYWQoeCx5LGkwLFYuZ2V0KHgseSxpMSkqY2hhaW5fZ3JhZCk7XG4gICAgICAgICAgICAgIFYuYWRkX2dyYWQoeCx5LGkxLFYuZ2V0KHgseSxpMCkqY2hhaW5fZ3JhZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRQYXJhbXNBbmRHcmFkczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSxcbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGpzb24gPSB7fTtcbiAgICAgIGpzb24ub3V0X2RlcHRoID0gdGhpcy5vdXRfZGVwdGg7XG4gICAgICBqc29uLm91dF9zeCA9IHRoaXMub3V0X3N4O1xuICAgICAganNvbi5vdXRfc3kgPSB0aGlzLm91dF9zeTtcbiAgICAgIGpzb24ubGF5ZXJfdHlwZSA9IHRoaXMubGF5ZXJfdHlwZTtcbiAgICAgIHJldHVybiBqc29uO1xuICAgIH0sXG4gICAgZnJvbUpTT046IGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgIHRoaXMub3V0X2RlcHRoID0ganNvbi5vdXRfZGVwdGg7XG4gICAgICB0aGlzLm91dF9zeCA9IGpzb24ub3V0X3N4O1xuICAgICAgdGhpcy5vdXRfc3kgPSBqc29uLm91dF9zeTtcbiAgICAgIHRoaXMubGF5ZXJfdHlwZSA9IGpzb24ubGF5ZXJfdHlwZTsgXG4gICAgfVxuICB9XG4gIFxuXG4gIGdsb2JhbC5RdWFkVHJhbnNmb3JtTGF5ZXIgPSBRdWFkVHJhbnNmb3JtTGF5ZXI7XG59KShjb252bmV0anMpO1xuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIFZvbCA9IGdsb2JhbC5Wb2w7IC8vIGNvbnZlbmllbmNlXG4gIFxuICAvLyBOZXQgbWFuYWdlcyBhIHNldCBvZiBsYXllcnNcbiAgLy8gRm9yIG5vdyBjb25zdHJhaW50czogU2ltcGxlIGxpbmVhciBvcmRlciBvZiBsYXllcnMsIGZpcnN0IGxheWVyIGlucHV0IGxhc3QgbGF5ZXIgYSBjb3N0IGxheWVyXG4gIHZhciBOZXQgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdGhpcy5sYXllcnMgPSBbXTtcbiAgfVxuXG4gIE5ldC5wcm90b3R5cGUgPSB7XG4gICAgXG4gICAgLy8gdGFrZXMgYSBsaXN0IG9mIGxheWVyIGRlZmluaXRpb25zIGFuZCBjcmVhdGVzIHRoZSBuZXR3b3JrIGxheWVyIG9iamVjdHNcbiAgICBtYWtlTGF5ZXJzOiBmdW5jdGlvbihkZWZzKSB7XG5cbiAgICAgIC8vIGZldyBjaGVja3MgZm9yIG5vd1xuICAgICAgaWYoZGVmcy5sZW5ndGg8Mikge2NvbnNvbGUubG9nKCdFUlJPUiEgRm9yIG5vdyBhdCBsZWFzdCBoYXZlIGlucHV0IGFuZCBzb2Z0bWF4IGxheWVycy4nKTt9XG4gICAgICBpZihkZWZzWzBdLnR5cGUgIT09ICdpbnB1dCcpIHtjb25zb2xlLmxvZygnRVJST1IhIEZvciBub3cgZmlyc3QgbGF5ZXIgc2hvdWxkIGJlIGlucHV0LicpO31cblxuICAgICAgLy8gZGVzdWdhciBzeW50YWN0aWMgZm9yIGFkZGluZyBhY3RpdmF0aW9ucyBhbmQgZHJvcG91dHNcbiAgICAgIHZhciBkZXN1Z2FyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBuZXdfZGVmcyA9IFtdO1xuICAgICAgICBmb3IodmFyIGk9MDtpPGRlZnMubGVuZ3RoO2krKykge1xuICAgICAgICAgIHZhciBkZWYgPSBkZWZzW2ldO1xuICAgICAgICAgIFxuICAgICAgICAgIGlmKGRlZi50eXBlPT09J3NvZnRtYXgnIHx8IGRlZi50eXBlPT09J3N2bScpIHtcbiAgICAgICAgICAgIC8vIGFkZCBhbiBmYyBsYXllciBoZXJlLCB0aGVyZSBpcyBubyByZWFzb24gdGhlIHVzZXIgc2hvdWxkXG4gICAgICAgICAgICAvLyBoYXZlIHRvIHdvcnJ5IGFib3V0IHRoaXMgYW5kIHdlIGFsbW9zdCBhbHdheXMgd2FudCB0b1xuICAgICAgICAgICAgbmV3X2RlZnMucHVzaCh7dHlwZTonZmMnLCBudW1fbmV1cm9uczogZGVmLm51bV9jbGFzc2VzfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYoZGVmLnR5cGU9PT0ncmVncmVzc2lvbicpIHtcbiAgICAgICAgICAgIC8vIGFkZCBhbiBmYyBsYXllciBoZXJlLCB0aGVyZSBpcyBubyByZWFzb24gdGhlIHVzZXIgc2hvdWxkXG4gICAgICAgICAgICAvLyBoYXZlIHRvIHdvcnJ5IGFib3V0IHRoaXMgYW5kIHdlIGFsbW9zdCBhbHdheXMgd2FudCB0b1xuICAgICAgICAgICAgbmV3X2RlZnMucHVzaCh7dHlwZTonZmMnLCBudW1fbmV1cm9uczogZGVmLm51bV9uZXVyb25zfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYoKGRlZi50eXBlPT09J2ZjJyB8fCBkZWYudHlwZT09PSdjb252JykgXG4gICAgICAgICAgICAgICYmIHR5cGVvZihkZWYuYmlhc19wcmVmKSA9PT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgZGVmLmJpYXNfcHJlZiA9IDAuMDtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBkZWYuYWN0aXZhdGlvbiAhPT0gJ3VuZGVmaW5lZCcgJiYgZGVmLmFjdGl2YXRpb24gPT09ICdyZWx1Jykge1xuICAgICAgICAgICAgICBkZWYuYmlhc19wcmVmID0gMC4xOyAvLyByZWx1cyBsaWtlIGEgYml0IG9mIHBvc2l0aXZlIGJpYXMgdG8gZ2V0IGdyYWRpZW50cyBlYXJseVxuICAgICAgICAgICAgICAvLyBvdGhlcndpc2UgaXQncyB0ZWNobmljYWxseSBwb3NzaWJsZSB0aGF0IGEgcmVsdSB1bml0IHdpbGwgbmV2ZXIgdHVybiBvbiAoYnkgY2hhbmNlKVxuICAgICAgICAgICAgICAvLyBhbmQgd2lsbCBuZXZlciBnZXQgYW55IGdyYWRpZW50IGFuZCBuZXZlciBjb250cmlidXRlIGFueSBjb21wdXRhdGlvbi4gRGVhZCByZWx1LlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICBpZih0eXBlb2YgZGVmLnRlbnNvciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIC8vIGFwcGx5IHF1YWRyYXRpYyB0cmFuc2Zvcm0gc28gdGhhdCB0aGUgdXBjb21pbmcgbXVsdGlwbHkgd2lsbCBpbmNsdWRlXG4gICAgICAgICAgICAvLyBxdWFkcmF0aWMgdGVybXMsIGVxdWl2YWxlbnQgdG8gZG9pbmcgYSB0ZW5zb3IgcHJvZHVjdFxuICAgICAgICAgICAgaWYoZGVmLnRlbnNvcikge1xuICAgICAgICAgICAgICBuZXdfZGVmcy5wdXNoKHt0eXBlOiAncXVhZHRyYW5zZm9ybSd9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXdfZGVmcy5wdXNoKGRlZik7XG5cbiAgICAgICAgICBpZih0eXBlb2YgZGVmLmFjdGl2YXRpb24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpZihkZWYuYWN0aXZhdGlvbj09PSdyZWx1JykgeyBuZXdfZGVmcy5wdXNoKHt0eXBlOidyZWx1J30pOyB9XG4gICAgICAgICAgICBlbHNlIGlmIChkZWYuYWN0aXZhdGlvbj09PSdzaWdtb2lkJykgeyBuZXdfZGVmcy5wdXNoKHt0eXBlOidzaWdtb2lkJ30pOyB9XG4gICAgICAgICAgICBlbHNlIGlmIChkZWYuYWN0aXZhdGlvbj09PSd0YW5oJykgeyBuZXdfZGVmcy5wdXNoKHt0eXBlOid0YW5oJ30pOyB9XG4gICAgICAgICAgICBlbHNlIGlmIChkZWYuYWN0aXZhdGlvbj09PSdtYXhvdXQnKSB7XG4gICAgICAgICAgICAgIC8vIGNyZWF0ZSBtYXhvdXQgYWN0aXZhdGlvbiwgYW5kIHBhc3MgYWxvbmcgZ3JvdXAgc2l6ZSwgaWYgcHJvdmlkZWRcbiAgICAgICAgICAgICAgdmFyIGdzID0gZGVmLmdyb3VwX3NpemUgIT09ICd1bmRlZmluZWQnID8gZGVmLmdyb3VwX3NpemUgOiAyO1xuICAgICAgICAgICAgICBuZXdfZGVmcy5wdXNoKHt0eXBlOidtYXhvdXQnLCBncm91cF9zaXplOmdzfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHsgY29uc29sZS5sb2coJ0VSUk9SIHVuc3VwcG9ydGVkIGFjdGl2YXRpb24gJyArIGRlZi5hY3RpdmF0aW9uKTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZih0eXBlb2YgZGVmLmRyb3BfcHJvYiAhPT0gJ3VuZGVmaW5lZCcgJiYgZGVmLnR5cGUgIT09ICdkcm9wb3V0Jykge1xuICAgICAgICAgICAgbmV3X2RlZnMucHVzaCh7dHlwZTonZHJvcG91dCcsIGRyb3BfcHJvYjogZGVmLmRyb3BfcHJvYn0pO1xuICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdfZGVmcztcbiAgICAgIH1cbiAgICAgIGRlZnMgPSBkZXN1Z2FyKGRlZnMpO1xuXG4gICAgICAvLyBjcmVhdGUgdGhlIGxheWVyc1xuICAgICAgdGhpcy5sYXllcnMgPSBbXTtcbiAgICAgIGZvcih2YXIgaT0wO2k8ZGVmcy5sZW5ndGg7aSsrKSB7XG4gICAgICAgIHZhciBkZWYgPSBkZWZzW2ldO1xuICAgICAgICBpZihpPjApIHtcbiAgICAgICAgICB2YXIgcHJldiA9IHRoaXMubGF5ZXJzW2ktMV07XG4gICAgICAgICAgZGVmLmluX3N4ID0gcHJldi5vdXRfc3g7XG4gICAgICAgICAgZGVmLmluX3N5ID0gcHJldi5vdXRfc3k7XG4gICAgICAgICAgZGVmLmluX2RlcHRoID0gcHJldi5vdXRfZGVwdGg7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2goZGVmLnR5cGUpIHtcbiAgICAgICAgICBjYXNlICdmYyc6IHRoaXMubGF5ZXJzLnB1c2gobmV3IGdsb2JhbC5GdWxseUNvbm5MYXllcihkZWYpKTsgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnbHJuJzogdGhpcy5sYXllcnMucHVzaChuZXcgZ2xvYmFsLkxvY2FsUmVzcG9uc2VOb3JtYWxpemF0aW9uTGF5ZXIoZGVmKSk7IGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2Ryb3BvdXQnOiB0aGlzLmxheWVycy5wdXNoKG5ldyBnbG9iYWwuRHJvcG91dExheWVyKGRlZikpOyBicmVhaztcbiAgICAgICAgICBjYXNlICdpbnB1dCc6IHRoaXMubGF5ZXJzLnB1c2gobmV3IGdsb2JhbC5JbnB1dExheWVyKGRlZikpOyBicmVhaztcbiAgICAgICAgICBjYXNlICdzb2Z0bWF4JzogdGhpcy5sYXllcnMucHVzaChuZXcgZ2xvYmFsLlNvZnRtYXhMYXllcihkZWYpKTsgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncmVncmVzc2lvbic6IHRoaXMubGF5ZXJzLnB1c2gobmV3IGdsb2JhbC5SZWdyZXNzaW9uTGF5ZXIoZGVmKSk7IGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2NvbnYnOiB0aGlzLmxheWVycy5wdXNoKG5ldyBnbG9iYWwuQ29udkxheWVyKGRlZikpOyBicmVhaztcbiAgICAgICAgICBjYXNlICdwb29sJzogdGhpcy5sYXllcnMucHVzaChuZXcgZ2xvYmFsLlBvb2xMYXllcihkZWYpKTsgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncmVsdSc6IHRoaXMubGF5ZXJzLnB1c2gobmV3IGdsb2JhbC5SZWx1TGF5ZXIoZGVmKSk7IGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3NpZ21vaWQnOiB0aGlzLmxheWVycy5wdXNoKG5ldyBnbG9iYWwuU2lnbW9pZExheWVyKGRlZikpOyBicmVhaztcbiAgICAgICAgICBjYXNlICd0YW5oJzogdGhpcy5sYXllcnMucHVzaChuZXcgZ2xvYmFsLlRhbmhMYXllcihkZWYpKTsgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnbWF4b3V0JzogdGhpcy5sYXllcnMucHVzaChuZXcgZ2xvYmFsLk1heG91dExheWVyKGRlZikpOyBicmVhaztcbiAgICAgICAgICBjYXNlICdxdWFkdHJhbnNmb3JtJzogdGhpcy5sYXllcnMucHVzaChuZXcgZ2xvYmFsLlF1YWRUcmFuc2Zvcm1MYXllcihkZWYpKTsgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnc3ZtJzogdGhpcy5sYXllcnMucHVzaChuZXcgZ2xvYmFsLlNWTUxheWVyKGRlZikpOyBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OiBjb25zb2xlLmxvZygnRVJST1I6IFVOUkVDT0dOSVpFRCBMQVlFUiBUWVBFIScpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIGZvcndhcmQgcHJvcCB0aGUgbmV0d29yay4gQSB0cmFpbmVyIHdpbGwgcGFzcyBpbiBpc190cmFpbmluZyA9IHRydWVcbiAgICBmb3J3YXJkOiBmdW5jdGlvbihWLCBpc190cmFpbmluZykge1xuICAgICAgaWYodHlwZW9mKGlzX3RyYWluaW5nKT09PSd1bmRlZmluZWQnKSBpc190cmFpbmluZyA9IGZhbHNlO1xuICAgICAgdmFyIGFjdCA9IHRoaXMubGF5ZXJzWzBdLmZvcndhcmQoViwgaXNfdHJhaW5pbmcpO1xuICAgICAgZm9yKHZhciBpPTE7aTx0aGlzLmxheWVycy5sZW5ndGg7aSsrKSB7XG4gICAgICAgIGFjdCA9IHRoaXMubGF5ZXJzW2ldLmZvcndhcmQoYWN0LCBpc190cmFpbmluZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWN0O1xuICAgIH0sXG4gICAgXG4gICAgLy8gYmFja3Byb3A6IGNvbXB1dGUgZ3JhZGllbnRzIHdydCBhbGwgcGFyYW1ldGVyc1xuICAgIGJhY2t3YXJkOiBmdW5jdGlvbih5KSB7XG4gICAgICB2YXIgTiA9IHRoaXMubGF5ZXJzLmxlbmd0aDtcbiAgICAgIHZhciBsb3NzID0gdGhpcy5sYXllcnNbTi0xXS5iYWNrd2FyZCh5KTsgLy8gbGFzdCBsYXllciBhc3N1bWVkIHNvZnRtYXhcbiAgICAgIGZvcih2YXIgaT1OLTI7aT49MDtpLS0pIHsgLy8gZmlyc3QgbGF5ZXIgYXNzdW1lZCBpbnB1dFxuICAgICAgICB0aGlzLmxheWVyc1tpXS5iYWNrd2FyZCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxvc3M7XG4gICAgfSxcbiAgICBnZXRQYXJhbXNBbmRHcmFkczogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBhY2N1bXVsYXRlIHBhcmFtZXRlcnMgYW5kIGdyYWRpZW50cyBmb3IgdGhlIGVudGlyZSBuZXR3b3JrXG4gICAgICB2YXIgcmVzcG9uc2UgPSBbXTtcbiAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5sYXllcnMubGVuZ3RoO2krKykge1xuICAgICAgICB2YXIgbGF5ZXJfcmVwb25zZSA9IHRoaXMubGF5ZXJzW2ldLmdldFBhcmFtc0FuZEdyYWRzKCk7XG4gICAgICAgIGZvcih2YXIgaj0wO2o8bGF5ZXJfcmVwb25zZS5sZW5ndGg7aisrKSB7XG4gICAgICAgICAgcmVzcG9uc2UucHVzaChsYXllcl9yZXBvbnNlW2pdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0sXG4gICAgZ2V0UHJlZGljdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgUyA9IHRoaXMubGF5ZXJzW3RoaXMubGF5ZXJzLmxlbmd0aC0xXTsgLy8gc29mdG1heCBsYXllclxuICAgICAgdmFyIHAgPSBTLm91dF9hY3QudztcbiAgICAgIHZhciBtYXh2ID0gcFswXTtcbiAgICAgIHZhciBtYXhpID0gMDtcbiAgICAgIGZvcih2YXIgaT0xO2k8cC5sZW5ndGg7aSsrKSB7XG4gICAgICAgIGlmKHBbaV0gPiBtYXh2KSB7IG1heHYgPSBwW2ldOyBtYXhpID0gaTt9XG4gICAgICB9XG4gICAgICByZXR1cm4gbWF4aTtcbiAgICB9LFxuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIganNvbiA9IHt9O1xuICAgICAganNvbi5sYXllcnMgPSBbXTtcbiAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5sYXllcnMubGVuZ3RoO2krKykge1xuICAgICAgICBqc29uLmxheWVycy5wdXNoKHRoaXMubGF5ZXJzW2ldLnRvSlNPTigpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBqc29uO1xuICAgIH0sXG4gICAgZnJvbUpTT046IGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgIHRoaXMubGF5ZXJzID0gW107XG4gICAgICBmb3IodmFyIGk9MDtpPGpzb24ubGF5ZXJzLmxlbmd0aDtpKyspIHtcbiAgICAgICAgdmFyIExqID0ganNvbi5sYXllcnNbaV1cbiAgICAgICAgdmFyIHQgPSBMai5sYXllcl90eXBlO1xuICAgICAgICB2YXIgTDtcbiAgICAgICAgaWYodD09PSdpbnB1dCcpIHsgTCA9IG5ldyBnbG9iYWwuSW5wdXRMYXllcigpOyB9XG4gICAgICAgIGlmKHQ9PT0ncmVsdScpIHsgTCA9IG5ldyBnbG9iYWwuUmVsdUxheWVyKCk7IH1cbiAgICAgICAgaWYodD09PSdzaWdtb2lkJykgeyBMID0gbmV3IGdsb2JhbC5TaWdtb2lkTGF5ZXIoKTsgfVxuICAgICAgICBpZih0PT09J3RhbmgnKSB7IEwgPSBuZXcgZ2xvYmFsLlRhbmhMYXllcigpOyB9XG4gICAgICAgIGlmKHQ9PT0nZHJvcG91dCcpIHsgTCA9IG5ldyBnbG9iYWwuRHJvcG91dExheWVyKCk7IH1cbiAgICAgICAgaWYodD09PSdjb252JykgeyBMID0gbmV3IGdsb2JhbC5Db252TGF5ZXIoKTsgfVxuICAgICAgICBpZih0PT09J3Bvb2wnKSB7IEwgPSBuZXcgZ2xvYmFsLlBvb2xMYXllcigpOyB9XG4gICAgICAgIGlmKHQ9PT0nbHJuJykgeyBMID0gbmV3IGdsb2JhbC5Mb2NhbFJlc3BvbnNlTm9ybWFsaXphdGlvbkxheWVyKCk7IH1cbiAgICAgICAgaWYodD09PSdzb2Z0bWF4JykgeyBMID0gbmV3IGdsb2JhbC5Tb2Z0bWF4TGF5ZXIoKTsgfVxuICAgICAgICBpZih0PT09J3JlZ3Jlc3Npb24nKSB7IEwgPSBuZXcgZ2xvYmFsLlJlZ3Jlc3Npb25MYXllcigpOyB9XG4gICAgICAgIGlmKHQ9PT0nZmMnKSB7IEwgPSBuZXcgZ2xvYmFsLkZ1bGx5Q29ubkxheWVyKCk7IH1cbiAgICAgICAgaWYodD09PSdtYXhvdXQnKSB7IEwgPSBuZXcgZ2xvYmFsLk1heG91dExheWVyKCk7IH1cbiAgICAgICAgaWYodD09PSdxdWFkdHJhbnNmb3JtJykgeyBMID0gbmV3IGdsb2JhbC5RdWFkVHJhbnNmb3JtTGF5ZXIoKTsgfVxuICAgICAgICBpZih0PT09J3N2bScpIHsgTCA9IG5ldyBnbG9iYWwuU1ZNTGF5ZXIoKTsgfVxuICAgICAgICBMLmZyb21KU09OKExqKTtcbiAgICAgICAgdGhpcy5sYXllcnMucHVzaChMKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG5cbiAgZ2xvYmFsLk5ldCA9IE5ldDtcbn0pKGNvbnZuZXRqcyk7XG4oZnVuY3Rpb24oZ2xvYmFsKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgVm9sID0gZ2xvYmFsLlZvbDsgLy8gY29udmVuaWVuY2VcblxuICB2YXIgVHJhaW5lciA9IGZ1bmN0aW9uKG5ldCwgb3B0aW9ucykge1xuXG4gICAgdGhpcy5uZXQgPSBuZXQ7XG5cbiAgICB2YXIgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy5sZWFybmluZ19yYXRlID0gdHlwZW9mIG9wdGlvbnMubGVhcm5pbmdfcmF0ZSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmxlYXJuaW5nX3JhdGUgOiAwLjAxO1xuICAgIHRoaXMubDFfZGVjYXkgPSB0eXBlb2Ygb3B0aW9ucy5sMV9kZWNheSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmwxX2RlY2F5IDogMC4wO1xuICAgIHRoaXMubDJfZGVjYXkgPSB0eXBlb2Ygb3B0aW9ucy5sMl9kZWNheSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmwyX2RlY2F5IDogMC4wO1xuICAgIHRoaXMuYmF0Y2hfc2l6ZSA9IHR5cGVvZiBvcHRpb25zLmJhdGNoX3NpemUgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5iYXRjaF9zaXplIDogMTtcbiAgICB0aGlzLm1ldGhvZCA9IHR5cGVvZiBvcHRpb25zLm1ldGhvZCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLm1ldGhvZCA6ICdzZ2QnOyAvLyBzZ2QvYWRhZ3JhZC9hZGFkZWx0YS93aW5kb3dncmFkXG5cbiAgICB0aGlzLm1vbWVudHVtID0gdHlwZW9mIG9wdGlvbnMubW9tZW50dW0gIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5tb21lbnR1bSA6IDAuOTtcbiAgICB0aGlzLnJvID0gdHlwZW9mIG9wdGlvbnMucm8gIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5ybyA6IDAuOTU7IC8vIHVzZWQgaW4gYWRhZGVsdGFcbiAgICB0aGlzLmVwcyA9IHR5cGVvZiBvcHRpb25zLmVwcyAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmVwcyA6IDFlLTY7IC8vIHVzZWQgaW4gYWRhZGVsdGFcblxuICAgIHRoaXMuayA9IDA7IC8vIGl0ZXJhdGlvbiBjb3VudGVyXG4gICAgdGhpcy5nc3VtID0gW107IC8vIGxhc3QgaXRlcmF0aW9uIGdyYWRpZW50cyAodXNlZCBmb3IgbW9tZW50dW0gY2FsY3VsYXRpb25zKVxuICAgIHRoaXMueHN1bSA9IFtdOyAvLyB1c2VkIGluIGFkYWRlbHRhXG4gIH1cblxuICBUcmFpbmVyLnByb3RvdHlwZSA9IHtcbiAgICB0cmFpbjogZnVuY3Rpb24oeCwgeSkge1xuXG4gICAgICB2YXIgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIHRoaXMubmV0LmZvcndhcmQoeCwgdHJ1ZSk7IC8vIGFsc28gc2V0IHRoZSBmbGFnIHRoYXQgbGV0cyB0aGUgbmV0IGtub3cgd2UncmUganVzdCB0cmFpbmluZ1xuICAgICAgdmFyIGVuZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgdmFyIGZ3ZF90aW1lID0gZW5kIC0gc3RhcnQ7XG5cbiAgICAgIHZhciBzdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgdmFyIGNvc3RfbG9zcyA9IHRoaXMubmV0LmJhY2t3YXJkKHkpO1xuICAgICAgdmFyIGwyX2RlY2F5X2xvc3MgPSAwLjA7XG4gICAgICB2YXIgbDFfZGVjYXlfbG9zcyA9IDAuMDtcbiAgICAgIHZhciBlbmQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIHZhciBid2RfdGltZSA9IGVuZCAtIHN0YXJ0O1xuICAgICAgXG4gICAgICB0aGlzLmsrKztcbiAgICAgIGlmKHRoaXMuayAlIHRoaXMuYmF0Y2hfc2l6ZSA9PT0gMCkge1xuXG4gICAgICAgIHZhciBwZ2xpc3QgPSB0aGlzLm5ldC5nZXRQYXJhbXNBbmRHcmFkcygpO1xuXG4gICAgICAgIC8vIGluaXRpYWxpemUgbGlzdHMgZm9yIGFjY3VtdWxhdG9ycy4gV2lsbCBvbmx5IGJlIGRvbmUgb25jZSBvbiBmaXJzdCBpdGVyYXRpb25cbiAgICAgICAgaWYodGhpcy5nc3VtLmxlbmd0aCA9PT0gMCAmJiAodGhpcy5tZXRob2QgIT09ICdzZ2QnIHx8IHRoaXMubW9tZW50dW0gPiAwLjApKSB7XG4gICAgICAgICAgLy8gb25seSB2YW5pbGxhIHNnZCBkb2VzbnQgbmVlZCBlaXRoZXIgbGlzdHNcbiAgICAgICAgICAvLyBtb21lbnR1bSBuZWVkcyBnc3VtXG4gICAgICAgICAgLy8gYWRhZ3JhZCBuZWVkcyBnc3VtXG4gICAgICAgICAgLy8gYWRhZGVsdGEgbmVlZHMgZ3N1bSBhbmQgeHN1bVxuICAgICAgICAgIGZvcih2YXIgaT0wO2k8cGdsaXN0Lmxlbmd0aDtpKyspIHtcbiAgICAgICAgICAgIHRoaXMuZ3N1bS5wdXNoKGdsb2JhbC56ZXJvcyhwZ2xpc3RbaV0ucGFyYW1zLmxlbmd0aCkpO1xuICAgICAgICAgICAgaWYodGhpcy5tZXRob2QgPT09ICdhZGFkZWx0YScpIHtcbiAgICAgICAgICAgICAgdGhpcy54c3VtLnB1c2goZ2xvYmFsLnplcm9zKHBnbGlzdFtpXS5wYXJhbXMubGVuZ3RoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLnhzdW0ucHVzaChbXSk7IC8vIGNvbnNlcnZlIG1lbW9yeVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHBlcmZvcm0gYW4gdXBkYXRlIGZvciBhbGwgc2V0cyBvZiB3ZWlnaHRzXG4gICAgICAgIGZvcih2YXIgaT0wO2k8cGdsaXN0Lmxlbmd0aDtpKyspIHtcbiAgICAgICAgICB2YXIgcGcgPSBwZ2xpc3RbaV07IC8vIHBhcmFtLCBncmFkaWVudCwgb3RoZXIgb3B0aW9ucyBpbiBmdXR1cmUgKGN1c3RvbSBsZWFybmluZyByYXRlIGV0YylcbiAgICAgICAgICB2YXIgcCA9IHBnLnBhcmFtcztcbiAgICAgICAgICB2YXIgZyA9IHBnLmdyYWRzO1xuXG4gICAgICAgICAgLy8gbGVhcm5pbmcgcmF0ZSBmb3Igc29tZSBwYXJhbWV0ZXJzLlxuICAgICAgICAgIHZhciBsMl9kZWNheV9tdWwgPSB0eXBlb2YgcGcubDJfZGVjYXlfbXVsICE9PSAndW5kZWZpbmVkJyA/IHBnLmwyX2RlY2F5X211bCA6IDEuMDtcbiAgICAgICAgICB2YXIgbDFfZGVjYXlfbXVsID0gdHlwZW9mIHBnLmwxX2RlY2F5X211bCAhPT0gJ3VuZGVmaW5lZCcgPyBwZy5sMV9kZWNheV9tdWwgOiAxLjA7XG4gICAgICAgICAgdmFyIGwyX2RlY2F5ID0gdGhpcy5sMl9kZWNheSAqIGwyX2RlY2F5X211bDtcbiAgICAgICAgICB2YXIgbDFfZGVjYXkgPSB0aGlzLmwxX2RlY2F5ICogbDFfZGVjYXlfbXVsO1xuXG4gICAgICAgICAgdmFyIHBsZW4gPSBwLmxlbmd0aDtcbiAgICAgICAgICBmb3IodmFyIGo9MDtqPHBsZW47aisrKSB7XG4gICAgICAgICAgICBsMl9kZWNheV9sb3NzICs9IGwyX2RlY2F5KnBbal0qcFtqXS8yOyAvLyBhY2N1bXVsYXRlIHdlaWdodCBkZWNheSBsb3NzXG4gICAgICAgICAgICBsMV9kZWNheV9sb3NzICs9IGwxX2RlY2F5Kk1hdGguYWJzKHBbal0pO1xuICAgICAgICAgICAgdmFyIGwxZ3JhZCA9IGwxX2RlY2F5ICogKHBbal0gPiAwID8gMSA6IC0xKTtcbiAgICAgICAgICAgIHZhciBsMmdyYWQgPSBsMl9kZWNheSAqIChwW2pdKTtcblxuICAgICAgICAgICAgdmFyIGdpaiA9IChsMmdyYWQgKyBsMWdyYWQgKyBnW2pdKSAvIHRoaXMuYmF0Y2hfc2l6ZTsgLy8gcmF3IGJhdGNoIGdyYWRpZW50XG5cbiAgICAgICAgICAgIHZhciBnc3VtaSA9IHRoaXMuZ3N1bVtpXTtcbiAgICAgICAgICAgIHZhciB4c3VtaSA9IHRoaXMueHN1bVtpXTtcbiAgICAgICAgICAgIGlmKHRoaXMubWV0aG9kID09PSAnYWRhZ3JhZCcpIHtcbiAgICAgICAgICAgICAgLy8gYWRhZ3JhZCB1cGRhdGVcbiAgICAgICAgICAgICAgZ3N1bWlbal0gPSBnc3VtaVtqXSArIGdpaiAqIGdpajtcbiAgICAgICAgICAgICAgdmFyIGR4ID0gLSB0aGlzLmxlYXJuaW5nX3JhdGUgLyBNYXRoLnNxcnQoZ3N1bWlbal0gKyB0aGlzLmVwcykgKiBnaWo7XG4gICAgICAgICAgICAgIHBbal0gKz0gZHg7XG4gICAgICAgICAgICB9IGVsc2UgaWYodGhpcy5tZXRob2QgPT09ICd3aW5kb3dncmFkJykge1xuICAgICAgICAgICAgICAvLyB0aGlzIGlzIGFkYWdyYWQgYnV0IHdpdGggYSBtb3Zpbmcgd2luZG93IHdlaWdodGVkIGF2ZXJhZ2VcbiAgICAgICAgICAgICAgLy8gc28gdGhlIGdyYWRpZW50IGlzIG5vdCBhY2N1bXVsYXRlZCBvdmVyIHRoZSBlbnRpcmUgaGlzdG9yeSBvZiB0aGUgcnVuLiBcbiAgICAgICAgICAgICAgLy8gaXQncyBhbHNvIHJlZmVycmVkIHRvIGFzIElkZWEgIzEgaW4gWmVpbGVyIHBhcGVyIG9uIEFkYWRlbHRhLiBTZWVtcyByZWFzb25hYmxlIHRvIG1lIVxuICAgICAgICAgICAgICBnc3VtaVtqXSA9IHRoaXMucm8gKiBnc3VtaVtqXSArICgxLXRoaXMucm8pICogZ2lqICogZ2lqO1xuICAgICAgICAgICAgICB2YXIgZHggPSAtIHRoaXMubGVhcm5pbmdfcmF0ZSAvIE1hdGguc3FydChnc3VtaVtqXSArIHRoaXMuZXBzKSAqIGdpajsgLy8gZXBzIGFkZGVkIGZvciBiZXR0ZXIgY29uZGl0aW9uaW5nXG4gICAgICAgICAgICAgIHBbal0gKz0gZHg7XG4gICAgICAgICAgICB9IGVsc2UgaWYodGhpcy5tZXRob2QgPT09ICdhZGFkZWx0YScpIHtcbiAgICAgICAgICAgICAgLy8gYXNzdW1lIGFkYWRlbHRhIGlmIG5vdCBzZ2Qgb3IgYWRhZ3JhZFxuICAgICAgICAgICAgICBnc3VtaVtqXSA9IHRoaXMucm8gKiBnc3VtaVtqXSArICgxLXRoaXMucm8pICogZ2lqICogZ2lqO1xuICAgICAgICAgICAgICB2YXIgZHggPSAtIE1hdGguc3FydCgoeHN1bWlbal0gKyB0aGlzLmVwcykvKGdzdW1pW2pdICsgdGhpcy5lcHMpKSAqIGdpajtcbiAgICAgICAgICAgICAgeHN1bWlbal0gPSB0aGlzLnJvICogeHN1bWlbal0gKyAoMS10aGlzLnJvKSAqIGR4ICogZHg7IC8vIHllcywgeHN1bSBsYWdzIGJlaGluZCBnc3VtIGJ5IDEuXG4gICAgICAgICAgICAgIHBbal0gKz0gZHg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBhc3N1bWUgU0dEXG4gICAgICAgICAgICAgIGlmKHRoaXMubW9tZW50dW0gPiAwLjApIHtcbiAgICAgICAgICAgICAgICAvLyBtb21lbnR1bSB1cGRhdGVcbiAgICAgICAgICAgICAgICB2YXIgZHggPSB0aGlzLm1vbWVudHVtICogZ3N1bWlbal0gLSB0aGlzLmxlYXJuaW5nX3JhdGUgKiBnaWo7IC8vIHN0ZXBcbiAgICAgICAgICAgICAgICBnc3VtaVtqXSA9IGR4OyAvLyBiYWNrIHRoaXMgdXAgZm9yIG5leHQgaXRlcmF0aW9uIG9mIG1vbWVudHVtXG4gICAgICAgICAgICAgICAgcFtqXSArPSBkeDsgLy8gYXBwbHkgY29ycmVjdGVkIGdyYWRpZW50XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdmFuaWxsYSBzZ2RcbiAgICAgICAgICAgICAgICBwW2pdICs9ICAtIHRoaXMubGVhcm5pbmdfcmF0ZSAqIGdpajtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ1tqXSA9IDAuMDsgLy8gemVybyBvdXQgZ3JhZGllbnQgc28gdGhhdCB3ZSBjYW4gYmVnaW4gYWNjdW11bGF0aW5nIGFuZXdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gYXBwZW5kaW5nIHNvZnRtYXhfbG9zcyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHksIGJ1dCBmcm9tIG5vdyBvbiB3ZSB3aWxsIGFsd2F5cyB1c2UgY29zdF9sb3NzXG4gICAgICAvLyBpbiBmdXR1cmUsIFRPRE86IGhhdmUgdG8gY29tcGxldGVseSByZWRvIHRoZSB3YXkgbG9zcyBpcyBkb25lIGFyb3VuZCB0aGUgbmV0d29yayBhcyBjdXJyZW50bHkgXG4gICAgICAvLyBsb3NzIGlzIGEgYml0IG9mIGEgaGFjay4gSWRlYWxseSwgdXNlciBzaG91bGQgc3BlY2lmeSBhcmJpdHJhcnkgbnVtYmVyIG9mIGxvc3MgZnVuY3Rpb25zIG9uIGFueSBsYXllclxuICAgICAgLy8gYW5kIGl0IHNob3VsZCBhbGwgYmUgY29tcHV0ZWQgY29ycmVjdGx5IGFuZCBhdXRvbWF0aWNhbGx5LiBcbiAgICAgIHJldHVybiB7ZndkX3RpbWU6IGZ3ZF90aW1lLCBid2RfdGltZTogYndkX3RpbWUsIFxuICAgICAgICAgICAgICBsMl9kZWNheV9sb3NzOiBsMl9kZWNheV9sb3NzLCBsMV9kZWNheV9sb3NzOiBsMV9kZWNheV9sb3NzLFxuICAgICAgICAgICAgICBjb3N0X2xvc3M6IGNvc3RfbG9zcywgc29mdG1heF9sb3NzOiBjb3N0X2xvc3MsIFxuICAgICAgICAgICAgICBsb3NzOiBjb3N0X2xvc3MgKyBsMV9kZWNheV9sb3NzICsgbDJfZGVjYXlfbG9zc31cbiAgICB9XG4gIH1cbiAgXG4gIGdsb2JhbC5UcmFpbmVyID0gVHJhaW5lcjtcbiAgZ2xvYmFsLlNHRFRyYWluZXIgPSBUcmFpbmVyOyAvLyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxufSkoY29udm5ldGpzKTtcblxuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvLyB1c2VkIHV0aWxpdGllcywgbWFrZSBleHBsaWNpdCBsb2NhbCByZWZlcmVuY2VzXG4gIHZhciByYW5kZiA9IGdsb2JhbC5yYW5kZjtcbiAgdmFyIHJhbmRpID0gZ2xvYmFsLnJhbmRpO1xuICB2YXIgTmV0ID0gZ2xvYmFsLk5ldDtcbiAgdmFyIFRyYWluZXIgPSBnbG9iYWwuVHJhaW5lcjtcbiAgdmFyIG1heG1pbiA9IGdsb2JhbC5tYXhtaW47XG4gIHZhciByYW5kcGVybSA9IGdsb2JhbC5yYW5kcGVybTtcbiAgdmFyIHdlaWdodGVkU2FtcGxlID0gZ2xvYmFsLndlaWdodGVkU2FtcGxlO1xuICB2YXIgZ2V0b3B0ID0gZ2xvYmFsLmdldG9wdDtcbiAgdmFyIGFyclVuaXF1ZSA9IGdsb2JhbC5hcnJVbmlxdWU7XG5cbiAgLypcbiAgQSBNYWdpY05ldCB0YWtlcyBkYXRhOiBhIGxpc3Qgb2YgY29udm5ldGpzLlZvbCgpLCBhbmQgbGFiZWxzXG4gIHdoaWNoIGZvciBub3cgYXJlIGFzc3VtZWQgdG8gYmUgY2xhc3MgaW5kZWNlcyAwLi5LLiBNYWdpY05ldCB0aGVuOlxuICAtIGNyZWF0ZXMgZGF0YSBmb2xkcyBmb3IgY3Jvc3MtdmFsaWRhdGlvblxuICAtIHNhbXBsZXMgY2FuZGlkYXRlIG5ldHdvcmtzXG4gIC0gZXZhbHVhdGVzIGNhbmRpZGF0ZSBuZXR3b3JrcyBvbiBhbGwgZGF0YSBmb2xkc1xuICAtIHByb2R1Y2VzIHByZWRpY3Rpb25zIGJ5IG1vZGVsLWF2ZXJhZ2luZyB0aGUgYmVzdCBuZXR3b3Jrc1xuICAqL1xuICB2YXIgTWFnaWNOZXQgPSBmdW5jdGlvbihkYXRhLCBsYWJlbHMsIG9wdCkge1xuICAgIHZhciBvcHQgPSBvcHQgfHwge307XG4gICAgaWYodHlwZW9mIGRhdGEgPT09ICd1bmRlZmluZWQnKSB7IGRhdGEgPSBbXTsgfVxuICAgIGlmKHR5cGVvZiBsYWJlbHMgPT09ICd1bmRlZmluZWQnKSB7IGxhYmVscyA9IFtdOyB9XG5cbiAgICAvLyByZXF1aXJlZCBpbnB1dHNcbiAgICB0aGlzLmRhdGEgPSBkYXRhOyAvLyBzdG9yZSB0aGVzZSBwb2ludGVycyB0byBkYXRhXG4gICAgdGhpcy5sYWJlbHMgPSBsYWJlbHM7XG5cbiAgICAvLyBvcHRpb25hbCBpbnB1dHNcbiAgICB0aGlzLnRyYWluX3JhdGlvID0gZ2V0b3B0KG9wdCwgJ3RyYWluX3JhdGlvJywgMC43KTtcbiAgICB0aGlzLm51bV9mb2xkcyA9IGdldG9wdChvcHQsICdudW1fZm9sZHMnLCAxMCk7XG4gICAgdGhpcy5udW1fY2FuZGlkYXRlcyA9IGdldG9wdChvcHQsICdudW1fY2FuZGlkYXRlcycsIDUwKTsgLy8gd2UgZXZhbHVhdGUgc2V2ZXJhbCBpbiBwYXJhbGxlbFxuICAgIC8vIGhvdyBtYW55IGVwb2NocyBvZiBkYXRhIHRvIHRyYWluIGV2ZXJ5IG5ldHdvcms/IGZvciBldmVyeSBmb2xkP1xuICAgIC8vIGhpZ2hlciB2YWx1ZXMgbWVhbiBoaWdoZXIgYWNjdXJhY3kgaW4gZmluYWwgcmVzdWx0cywgYnV0IG1vcmUgZXhwZW5zaXZlXG4gICAgdGhpcy5udW1fZXBvY2hzID0gZ2V0b3B0KG9wdCwgJ251bV9lcG9jaHMnLCA1MCk7IFxuICAgIC8vIG51bWJlciBvZiBiZXN0IG1vZGVscyB0byBhdmVyYWdlIGR1cmluZyBwcmVkaWN0aW9uLiBVc3VhbGx5IGhpZ2hlciA9IGJldHRlclxuICAgIHRoaXMuZW5zZW1ibGVfc2l6ZSA9IGdldG9wdChvcHQsICdlbnNlbWJsZV9zaXplJywgMTApO1xuXG4gICAgLy8gY2FuZGlkYXRlIHBhcmFtZXRlcnNcbiAgICB0aGlzLmJhdGNoX3NpemVfbWluID0gZ2V0b3B0KG9wdCwgJ2JhdGNoX3NpemVfbWluJywgMTApO1xuICAgIHRoaXMuYmF0Y2hfc2l6ZV9tYXggPSBnZXRvcHQob3B0LCAnYmF0Y2hfc2l6ZV9tYXgnLCAzMDApO1xuICAgIHRoaXMubDJfZGVjYXlfbWluID0gZ2V0b3B0KG9wdCwgJ2wyX2RlY2F5X21pbicsIC00KTtcbiAgICB0aGlzLmwyX2RlY2F5X21heCA9IGdldG9wdChvcHQsICdsMl9kZWNheV9tYXgnLCAyKTtcbiAgICB0aGlzLmxlYXJuaW5nX3JhdGVfbWluID0gZ2V0b3B0KG9wdCwgJ2xlYXJuaW5nX3JhdGVfbWluJywgLTQpO1xuICAgIHRoaXMubGVhcm5pbmdfcmF0ZV9tYXggPSBnZXRvcHQob3B0LCAnbGVhcm5pbmdfcmF0ZV9tYXgnLCAwKTtcbiAgICB0aGlzLm1vbWVudHVtX21pbiA9IGdldG9wdChvcHQsICdtb21lbnR1bV9taW4nLCAwLjkpO1xuICAgIHRoaXMubW9tZW50dW1fbWF4ID0gZ2V0b3B0KG9wdCwgJ21vbWVudHVtX21heCcsIDAuOSk7XG4gICAgdGhpcy5uZXVyb25zX21pbiA9IGdldG9wdChvcHQsICduZXVyb25zX21pbicsIDUpO1xuICAgIHRoaXMubmV1cm9uc19tYXggPSBnZXRvcHQob3B0LCAnbmV1cm9uc19tYXgnLCAzMCk7XG5cbiAgICAvLyBjb21wdXRlZFxuICAgIHRoaXMuZm9sZHMgPSBbXTsgLy8gZGF0YSBmb2xkIGluZGljZXMsIGdldHMgZmlsbGVkIGJ5IHNhbXBsZUZvbGRzKClcbiAgICB0aGlzLmNhbmRpZGF0ZXMgPSBbXTsgLy8gY2FuZGlkYXRlIG5ldHdvcmtzIHRoYXQgYXJlIGJlaW5nIGN1cnJlbnRseSBldmFsdWF0ZWRcbiAgICB0aGlzLmV2YWx1YXRlZF9jYW5kaWRhdGVzID0gW107IC8vIGhpc3Rvcnkgb2YgYWxsIGNhbmRpZGF0ZXMgdGhhdCB3ZXJlIGZ1bGx5IGV2YWx1YXRlZCBvbiBhbGwgZm9sZHNcbiAgICB0aGlzLnVuaXF1ZV9sYWJlbHMgPSBhcnJVbmlxdWUobGFiZWxzKTtcbiAgICB0aGlzLml0ZXIgPSAwOyAvLyBpdGVyYXRpb24gY291bnRlciwgZ29lcyBmcm9tIDAgLT4gbnVtX2Vwb2NocyAqIG51bV90cmFpbmluZ19kYXRhXG4gICAgdGhpcy5mb2xkaXggPSAwOyAvLyBpbmRleCBvZiBhY3RpdmUgZm9sZFxuXG4gICAgLy8gY2FsbGJhY2tzXG4gICAgdGhpcy5maW5pc2hfZm9sZF9jYWxsYmFjayA9IG51bGw7XG4gICAgdGhpcy5maW5pc2hfYmF0Y2hfY2FsbGJhY2sgPSBudWxsO1xuXG4gICAgLy8gaW5pdGlhbGl6YXRpb25zXG4gICAgaWYodGhpcy5kYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuc2FtcGxlRm9sZHMoKTtcbiAgICAgIHRoaXMuc2FtcGxlQ2FuZGlkYXRlcygpO1xuICAgIH1cbiAgfTtcblxuICBNYWdpY05ldC5wcm90b3R5cGUgPSB7XG5cbiAgICAvLyBzZXRzIHRoaXMuZm9sZHMgdG8gYSBzYW1wbGluZyBvZiB0aGlzLm51bV9mb2xkcyBmb2xkc1xuICAgIHNhbXBsZUZvbGRzOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBOID0gdGhpcy5kYXRhLmxlbmd0aDtcbiAgICAgIHZhciBudW1fdHJhaW4gPSBNYXRoLmZsb29yKHRoaXMudHJhaW5fcmF0aW8gKiBOKTtcbiAgICAgIHRoaXMuZm9sZHMgPSBbXTsgLy8gZmx1c2ggZm9sZHMsIGlmIGFueVxuICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLm51bV9mb2xkcztpKyspIHtcbiAgICAgICAgdmFyIHAgPSByYW5kcGVybShOKTtcbiAgICAgICAgdGhpcy5mb2xkcy5wdXNoKHt0cmFpbl9peDogcC5zbGljZSgwLCBudW1fdHJhaW4pLCB0ZXN0X2l4OiBwLnNsaWNlKG51bV90cmFpbiwgTil9KTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gcmV0dXJucyBhIHJhbmRvbSBjYW5kaWRhdGUgbmV0d29ya1xuICAgIHNhbXBsZUNhbmRpZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaW5wdXRfZGVwdGggPSB0aGlzLmRhdGFbMF0udy5sZW5ndGg7XG4gICAgICB2YXIgbnVtX2NsYXNzZXMgPSB0aGlzLnVuaXF1ZV9sYWJlbHMubGVuZ3RoO1xuXG4gICAgICAvLyBzYW1wbGUgbmV0d29yayB0b3BvbG9neSBhbmQgaHlwZXJwYXJhbWV0ZXJzXG4gICAgICB2YXIgbGF5ZXJfZGVmcyA9IFtdO1xuICAgICAgbGF5ZXJfZGVmcy5wdXNoKHt0eXBlOidpbnB1dCcsIG91dF9zeDoxLCBvdXRfc3k6MSwgb3V0X2RlcHRoOiBpbnB1dF9kZXB0aH0pO1xuICAgICAgdmFyIG5sID0gd2VpZ2h0ZWRTYW1wbGUoWzAsMSwyLDNdLCBbMC4yLCAwLjMsIDAuMywgMC4yXSk7IC8vIHByZWZlciBuZXRzIHdpdGggMSwyIGhpZGRlbiBsYXllcnNcbiAgICAgIGZvcih2YXIgcT0wO3E8bmw7cSsrKSB7XG4gICAgICAgIHZhciBuaSA9IHJhbmRpKHRoaXMubmV1cm9uc19taW4sIHRoaXMubmV1cm9uc19tYXgpO1xuICAgICAgICB2YXIgYWN0ID0gWyd0YW5oJywnbWF4b3V0JywncmVsdSddW3JhbmRpKDAsMyldO1xuICAgICAgICBpZihyYW5kZigwLDEpPDAuNSkge1xuICAgICAgICAgIHZhciBkcCA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgbGF5ZXJfZGVmcy5wdXNoKHt0eXBlOidmYycsIG51bV9uZXVyb25zOiBuaSwgYWN0aXZhdGlvbjogYWN0LCBkcm9wX3Byb2I6IGRwfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGF5ZXJfZGVmcy5wdXNoKHt0eXBlOidmYycsIG51bV9uZXVyb25zOiBuaSwgYWN0aXZhdGlvbjogYWN0fSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxheWVyX2RlZnMucHVzaCh7dHlwZTonc29mdG1heCcsIG51bV9jbGFzc2VzOiBudW1fY2xhc3Nlc30pO1xuICAgICAgdmFyIG5ldCA9IG5ldyBOZXQoKTtcbiAgICAgIG5ldC5tYWtlTGF5ZXJzKGxheWVyX2RlZnMpO1xuXG4gICAgICAvLyBzYW1wbGUgdHJhaW5pbmcgaHlwZXJwYXJhbWV0ZXJzXG4gICAgICB2YXIgYnMgPSByYW5kaSh0aGlzLmJhdGNoX3NpemVfbWluLCB0aGlzLmJhdGNoX3NpemVfbWF4KTsgLy8gYmF0Y2ggc2l6ZVxuICAgICAgdmFyIGwyID0gTWF0aC5wb3coMTAsIHJhbmRmKHRoaXMubDJfZGVjYXlfbWluLCB0aGlzLmwyX2RlY2F5X21heCkpOyAvLyBsMiB3ZWlnaHQgZGVjYXlcbiAgICAgIHZhciBsciA9IE1hdGgucG93KDEwLCByYW5kZih0aGlzLmxlYXJuaW5nX3JhdGVfbWluLCB0aGlzLmxlYXJuaW5nX3JhdGVfbWF4KSk7IC8vIGxlYXJuaW5nIHJhdGVcbiAgICAgIHZhciBtb20gPSByYW5kZih0aGlzLm1vbWVudHVtX21pbiwgdGhpcy5tb21lbnR1bV9tYXgpOyAvLyBtb21lbnR1bS4gTGV0cyBqdXN0IHVzZSAwLjksIHdvcmtzIG9rYXkgdXN1YWxseSA7cFxuICAgICAgdmFyIHRwID0gcmFuZGYoMCwxKTsgLy8gdHJhaW5lciB0eXBlXG4gICAgICB2YXIgdHJhaW5lcl9kZWY7XG4gICAgICBpZih0cDwwLjMzKSB7XG4gICAgICAgIHRyYWluZXJfZGVmID0ge21ldGhvZDonYWRhZGVsdGEnLCBiYXRjaF9zaXplOmJzLCBsMl9kZWNheTpsMn07XG4gICAgICB9IGVsc2UgaWYodHA8MC42Nikge1xuICAgICAgICB0cmFpbmVyX2RlZiA9IHttZXRob2Q6J2FkYWdyYWQnLCBsZWFybmluZ19yYXRlOiBsciwgYmF0Y2hfc2l6ZTpicywgbDJfZGVjYXk6bDJ9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJhaW5lcl9kZWYgPSB7bWV0aG9kOidzZ2QnLCBsZWFybmluZ19yYXRlOiBsciwgbW9tZW50dW06IG1vbSwgYmF0Y2hfc2l6ZTpicywgbDJfZGVjYXk6bDJ9O1xuICAgICAgfVxuICAgICAgXG4gICAgICB2YXIgdHJhaW5lciA9IG5ldyBUcmFpbmVyKG5ldCwgdHJhaW5lcl9kZWYpO1xuXG4gICAgICB2YXIgY2FuZCA9IHt9O1xuICAgICAgY2FuZC5hY2MgPSBbXTtcbiAgICAgIGNhbmQuYWNjdiA9IDA7IC8vIHRoaXMgd2lsbCBtYWludGFpbmVkIGFzIHN1bShhY2MpIGZvciBjb252ZW5pZW5jZVxuICAgICAgY2FuZC5sYXllcl9kZWZzID0gbGF5ZXJfZGVmcztcbiAgICAgIGNhbmQudHJhaW5lcl9kZWYgPSB0cmFpbmVyX2RlZjtcbiAgICAgIGNhbmQubmV0ID0gbmV0O1xuICAgICAgY2FuZC50cmFpbmVyID0gdHJhaW5lcjtcbiAgICAgIHJldHVybiBjYW5kO1xuICAgIH0sXG5cbiAgICAvLyBzZXRzIHRoaXMuY2FuZGlkYXRlcyB3aXRoIHRoaXMubnVtX2NhbmRpZGF0ZXMgY2FuZGlkYXRlIG5ldHNcbiAgICBzYW1wbGVDYW5kaWRhdGVzOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuY2FuZGlkYXRlcyA9IFtdOyAvLyBmbHVzaCwgaWYgYW55XG4gICAgICBmb3IodmFyIGk9MDtpPHRoaXMubnVtX2NhbmRpZGF0ZXM7aSsrKSB7XG4gICAgICAgIHZhciBjYW5kID0gdGhpcy5zYW1wbGVDYW5kaWRhdGUoKTtcbiAgICAgICAgdGhpcy5jYW5kaWRhdGVzLnB1c2goY2FuZCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0ZXA6IGZ1bmN0aW9uKCkge1xuICAgICAgXG4gICAgICAvLyBydW4gYW4gZXhhbXBsZSB0aHJvdWdoIGN1cnJlbnQgY2FuZGlkYXRlXG4gICAgICB0aGlzLml0ZXIrKztcblxuICAgICAgLy8gc3RlcCBhbGwgY2FuZGlkYXRlcyBvbiBhIHJhbmRvbSBkYXRhIHBvaW50XG4gICAgICB2YXIgZm9sZCA9IHRoaXMuZm9sZHNbdGhpcy5mb2xkaXhdOyAvLyBhY3RpdmUgZm9sZFxuICAgICAgdmFyIGRhdGFpeCA9IGZvbGQudHJhaW5faXhbcmFuZGkoMCwgZm9sZC50cmFpbl9peC5sZW5ndGgpXTtcbiAgICAgIGZvcih2YXIgaz0wO2s8dGhpcy5jYW5kaWRhdGVzLmxlbmd0aDtrKyspIHtcbiAgICAgICAgdmFyIHggPSB0aGlzLmRhdGFbZGF0YWl4XTtcbiAgICAgICAgdmFyIGwgPSB0aGlzLmxhYmVsc1tkYXRhaXhdO1xuICAgICAgICB0aGlzLmNhbmRpZGF0ZXNba10udHJhaW5lci50cmFpbih4LCBsKTtcbiAgICAgIH1cblxuICAgICAgLy8gcHJvY2VzcyBjb25zZXF1ZW5jZXM6IHNhbXBsZSBuZXcgZm9sZHMsIG9yIGNhbmRpZGF0ZXNcbiAgICAgIHZhciBsYXN0aXRlciA9IHRoaXMubnVtX2Vwb2NocyAqIGZvbGQudHJhaW5faXgubGVuZ3RoO1xuICAgICAgaWYodGhpcy5pdGVyID49IGxhc3RpdGVyKSB7XG4gICAgICAgIC8vIGZpbmlzaGVkIGV2YWx1YXRpb24gb2YgdGhpcyBmb2xkLiBHZXQgZmluYWwgdmFsaWRhdGlvblxuICAgICAgICAvLyBhY2N1cmFjaWVzLCByZWNvcmQgdGhlbSwgYW5kIGdvIG9uIHRvIG5leHQgZm9sZC5cbiAgICAgICAgdmFyIHZhbF9hY2MgPSB0aGlzLmV2YWxWYWxFcnJvcnMoKTtcbiAgICAgICAgZm9yKHZhciBrPTA7azx0aGlzLmNhbmRpZGF0ZXMubGVuZ3RoO2srKykge1xuICAgICAgICAgIHZhciBjID0gdGhpcy5jYW5kaWRhdGVzW2tdO1xuICAgICAgICAgIGMuYWNjLnB1c2godmFsX2FjY1trXSk7XG4gICAgICAgICAgYy5hY2N2ICs9IHZhbF9hY2Nba107XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pdGVyID0gMDsgLy8gcmVzZXQgc3RlcCBudW1iZXJcbiAgICAgICAgdGhpcy5mb2xkaXgrKzsgLy8gaW5jcmVtZW50IGZvbGRcblxuICAgICAgICBpZih0aGlzLmZpbmlzaF9mb2xkX2NhbGxiYWNrICE9PSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5maW5pc2hfZm9sZF9jYWxsYmFjaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5mb2xkaXggPj0gdGhpcy5mb2xkcy5sZW5ndGgpIHtcbiAgICAgICAgICAvLyB3ZSBmaW5pc2hlZCBhbGwgZm9sZHMgYXMgd2VsbCEgUmVjb3JkIHRoZXNlIGNhbmRpZGF0ZXNcbiAgICAgICAgICAvLyBhbmQgc2FtcGxlIG5ldyBvbmVzIHRvIGV2YWx1YXRlLlxuICAgICAgICAgIGZvcih2YXIgaz0wO2s8dGhpcy5jYW5kaWRhdGVzLmxlbmd0aDtrKyspIHtcbiAgICAgICAgICAgIHRoaXMuZXZhbHVhdGVkX2NhbmRpZGF0ZXMucHVzaCh0aGlzLmNhbmRpZGF0ZXNba10pO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBzb3J0IGV2YWx1YXRlZCBjYW5kaWRhdGVzIGFjY29yZGluZyB0byBhY2N1cmFjeSBhY2hpZXZlZFxuICAgICAgICAgIHRoaXMuZXZhbHVhdGVkX2NhbmRpZGF0ZXMuc29ydChmdW5jdGlvbihhLCBiKSB7IFxuICAgICAgICAgICAgcmV0dXJuIChhLmFjY3YgLyBhLmFjYy5sZW5ndGgpIFxuICAgICAgICAgICAgICAgICA+IChiLmFjY3YgLyBiLmFjYy5sZW5ndGgpIFxuICAgICAgICAgICAgICAgICA/IC0xIDogMTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICAvLyBhbmQgY2xpcCBvbmx5IHRvIHRoZSB0b3AgZmV3IG9uZXMgKGxldHMgcGxhY2UgbGltaXQgYXQgMyplbnNlbWJsZV9zaXplKVxuICAgICAgICAgIC8vIG90aGVyd2lzZSB0aGVyZSBhcmUgY29uY2VybnMgd2l0aCBrZWVwaW5nIHRoZXNlIGFsbCBpbiBtZW1vcnkgXG4gICAgICAgICAgLy8gaWYgTWFnaWNOZXQgaXMgYmVpbmcgZXZhbHVhdGVkIGZvciBhIHZlcnkgbG9uZyB0aW1lXG4gICAgICAgICAgaWYodGhpcy5ldmFsdWF0ZWRfY2FuZGlkYXRlcy5sZW5ndGggPiAzICogdGhpcy5lbnNlbWJsZV9zaXplKSB7XG4gICAgICAgICAgICB0aGlzLmV2YWx1YXRlZF9jYW5kaWRhdGVzID0gdGhpcy5ldmFsdWF0ZWRfY2FuZGlkYXRlcy5zbGljZSgwLCAzICogdGhpcy5lbnNlbWJsZV9zaXplKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYodGhpcy5maW5pc2hfYmF0Y2hfY2FsbGJhY2sgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoX2JhdGNoX2NhbGxiYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc2FtcGxlQ2FuZGlkYXRlcygpOyAvLyBiZWdpbiB3aXRoIG5ldyBjYW5kaWRhdGVzXG4gICAgICAgICAgdGhpcy5mb2xkaXggPSAwOyAvLyByZXNldCB0aGlzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gd2Ugd2lsbCBnbyBvbiB0byBhbm90aGVyIGZvbGQuIHJlc2V0IGFsbCBjYW5kaWRhdGVzIG5ldHNcbiAgICAgICAgICBmb3IodmFyIGs9MDtrPHRoaXMuY2FuZGlkYXRlcy5sZW5ndGg7aysrKSB7XG4gICAgICAgICAgICB2YXIgYyA9IHRoaXMuY2FuZGlkYXRlc1trXTtcbiAgICAgICAgICAgIHZhciBuZXQgPSBuZXcgTmV0KCk7XG4gICAgICAgICAgICBuZXQubWFrZUxheWVycyhjLmxheWVyX2RlZnMpO1xuICAgICAgICAgICAgdmFyIHRyYWluZXIgPSBuZXcgVHJhaW5lcihuZXQsIGMudHJhaW5lcl9kZWYpO1xuICAgICAgICAgICAgYy5uZXQgPSBuZXQ7XG4gICAgICAgICAgICBjLnRyYWluZXIgPSB0cmFpbmVyO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBldmFsVmFsRXJyb3JzOiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGV2YWx1YXRlIGNhbmRpZGF0ZXMgb24gdmFsaWRhdGlvbiBkYXRhIGFuZCByZXR1cm4gcGVyZm9ybWFuY2Ugb2YgY3VycmVudCBuZXR3b3Jrc1xuICAgICAgLy8gYXMgc2ltcGxlIGxpc3RcbiAgICAgIHZhciB2YWxzID0gW107XG4gICAgICB2YXIgZm9sZCA9IHRoaXMuZm9sZHNbdGhpcy5mb2xkaXhdOyAvLyBhY3RpdmUgZm9sZFxuICAgICAgZm9yKHZhciBrPTA7azx0aGlzLmNhbmRpZGF0ZXMubGVuZ3RoO2srKykge1xuICAgICAgICB2YXIgbmV0ID0gdGhpcy5jYW5kaWRhdGVzW2tdLm5ldDtcbiAgICAgICAgdmFyIHYgPSAwLjA7XG4gICAgICAgIGZvcih2YXIgcT0wO3E8Zm9sZC50ZXN0X2l4Lmxlbmd0aDtxKyspIHtcbiAgICAgICAgICB2YXIgeCA9IHRoaXMuZGF0YVtmb2xkLnRlc3RfaXhbcV1dO1xuICAgICAgICAgIHZhciBsID0gdGhpcy5sYWJlbHNbZm9sZC50ZXN0X2l4W3FdXTtcbiAgICAgICAgICBuZXQuZm9yd2FyZCh4KTtcbiAgICAgICAgICB2YXIgeWhhdCA9IG5ldC5nZXRQcmVkaWN0aW9uKCk7XG4gICAgICAgICAgdiArPSAoeWhhdCA9PT0gbCA/IDEuMCA6IDAuMCk7IC8vIDAgMSBsb3NzXG4gICAgICAgIH1cbiAgICAgICAgdiAvPSBmb2xkLnRlc3RfaXgubGVuZ3RoOyAvLyBub3JtYWxpemVcbiAgICAgICAgdmFscy5wdXNoKHYpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHM7XG4gICAgfSxcblxuICAgIC8vIHJldHVybnMgcHJlZGljdGlvbiBzY29yZXMgZm9yIGdpdmVuIHRlc3QgZGF0YSBwb2ludCwgYXMgVm9sXG4gICAgLy8gdXNlcyBhbiBhdmVyYWdlZCBwcmVkaWN0aW9uIGZyb20gdGhlIGJlc3QgZW5zZW1ibGVfc2l6ZSBtb2RlbHNcbiAgICAvLyB4IGlzIGEgVm9sLlxuICAgIHByZWRpY3Rfc29mdDogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgLy8gZm9yd2FyZCBwcm9wIHRoZSBiZXN0IG5ldHdvcmtzXG4gICAgICAvLyBhbmQgYWNjdW11bGF0ZSBwcm9iYWJpbGl0aWVzIGF0IGxhc3QgbGF5ZXIgaW50byBhIGFuIG91dHB1dCBWb2xcbiAgICAgIHZhciBudiA9IE1hdGgubWluKHRoaXMuZW5zZW1ibGVfc2l6ZSwgdGhpcy5ldmFsdWF0ZWRfY2FuZGlkYXRlcy5sZW5ndGgpO1xuICAgICAgaWYobnYgPT09IDApIHsgcmV0dXJuIG5ldyBjb252bmV0anMuVm9sKDAsMCwwKTsgfSAvLyBub3Qgc3VyZSB3aGF0IHRvIGRvIGhlcmU/IHdlJ3JlIG5vdCByZWFkeSB5ZXRcbiAgICAgIHZhciB4b3V0LCBuO1xuICAgICAgZm9yKHZhciBqPTA7ajxudjtqKyspIHtcbiAgICAgICAgdmFyIG5ldCA9IHRoaXMuZXZhbHVhdGVkX2NhbmRpZGF0ZXNbal0ubmV0O1xuICAgICAgICB2YXIgeCA9IG5ldC5mb3J3YXJkKGRhdGEpO1xuICAgICAgICBpZihqPT09MCkgeyBcbiAgICAgICAgICB4b3V0ID0geDsgXG4gICAgICAgICAgbiA9IHgudy5sZW5ndGg7IFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGFkZCBpdCBvblxuICAgICAgICAgIGZvcih2YXIgZD0wO2Q8bjtkKyspIHtcbiAgICAgICAgICAgIHhvdXQud1tkXSArPSB4LndbZF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBwcm9kdWNlIGF2ZXJhZ2VcbiAgICAgIGZvcih2YXIgZD0wO2Q8bjtkKyspIHtcbiAgICAgICAgeG91dC53W2RdIC89IG47XG4gICAgICB9XG4gICAgICByZXR1cm4geG91dDtcbiAgICB9LFxuXG4gICAgcHJlZGljdDogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdmFyIHhvdXQgPSB0aGlzLnByZWRpY3Rfc29mdChkYXRhKTtcbiAgICAgIGlmKHhvdXQudy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgdmFyIHN0YXRzID0gbWF4bWluKHhvdXQudyk7XG4gICAgICAgIHZhciBwcmVkaWN0ZWRfbGFiZWwgPSBzdGF0cy5tYXhpOyBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBwcmVkaWN0ZWRfbGFiZWwgPSAtMTsgLy8gZXJyb3Igb3V0XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJlZGljdGVkX2xhYmVsO1xuXG4gICAgfSxcblxuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBkdW1wIHRoZSB0b3AgZW5zZW1ibGVfc2l6ZSBuZXR3b3JrcyBhcyBhIGxpc3RcbiAgICAgIHZhciBudiA9IE1hdGgubWluKHRoaXMuZW5zZW1ibGVfc2l6ZSwgdGhpcy5ldmFsdWF0ZWRfY2FuZGlkYXRlcy5sZW5ndGgpO1xuICAgICAgdmFyIGpzb24gPSB7fTtcbiAgICAgIGpzb24ubmV0cyA9IFtdO1xuICAgICAgZm9yKHZhciBpPTA7aTxudjtpKyspIHtcbiAgICAgICAganNvbi5uZXRzLnB1c2godGhpcy5ldmFsdWF0ZWRfY2FuZGlkYXRlc1tpXS5uZXQudG9KU09OKCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGpzb247XG4gICAgfSxcblxuICAgIGZyb21KU09OOiBmdW5jdGlvbihqc29uKSB7XG4gICAgICB0aGlzLmVuc2VtYmxlX3NpemUgPSBqc29uLm5ldHMubGVuZ3RoO1xuICAgICAgdGhpcy5ldmFsdWF0ZWRfY2FuZGlkYXRlcyA9IFtdO1xuICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLmVuc2VtYmxlX3NpemU7aSsrKSB7XG4gICAgICAgIHZhciBuZXQgPSBuZXcgTmV0KCk7XG4gICAgICAgIG5ldC5mcm9tSlNPTihqc29uLm5ldHNbaV0pO1xuICAgICAgICB2YXIgZHVtbXlfY2FuZGlkYXRlID0ge307XG4gICAgICAgIGR1bW15X2NhbmRpZGF0ZS5uZXQgPSBuZXQ7XG4gICAgICAgIHRoaXMuZXZhbHVhdGVkX2NhbmRpZGF0ZXMucHVzaChkdW1teV9jYW5kaWRhdGUpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBjYWxsYmFjayBmdW5jdGlvbnNcbiAgICAvLyBjYWxsZWQgd2hlbiBhIGZvbGQgaXMgZmluaXNoZWQsIHdoaWxlIGV2YWx1YXRpbmcgYSBiYXRjaFxuICAgIG9uRmluaXNoRm9sZDogZnVuY3Rpb24oZikgeyB0aGlzLmZpbmlzaF9mb2xkX2NhbGxiYWNrID0gZjsgfSxcbiAgICAvLyBjYWxsZWQgd2hlbiBhIGJhdGNoIG9mIGNhbmRpZGF0ZXMgaGFzIGZpbmlzaGVkIGV2YWx1YXRpbmdcbiAgICBvbkZpbmlzaEJhdGNoOiBmdW5jdGlvbihmKSB7IHRoaXMuZmluaXNoX2JhdGNoX2NhbGxiYWNrID0gZjsgfVxuICAgIFxuICB9O1xuXG4gIGdsb2JhbC5NYWdpY05ldCA9IE1hZ2ljTmV0O1xufSkoY29udm5ldGpzKTtcbihmdW5jdGlvbihsaWIpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGlmICh0eXBlb2YgbW9kdWxlID09PSBcInVuZGVmaW5lZFwiIHx8IHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5qc2ZlYXQgPSBsaWI7IC8vIGluIG9yZGluYXJ5IGJyb3dzZXIgYXR0YWNoIGxpYnJhcnkgdG8gd2luZG93XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBsaWI7IC8vIGluIG5vZGVqc1xuICB9XG59KShjb252bmV0anMpO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNyRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBIiwic291cmNlUm9vdCI6IiJ9