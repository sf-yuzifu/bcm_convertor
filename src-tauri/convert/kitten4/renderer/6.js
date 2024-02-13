(this["webpackJsonp"] = this["webpackJsonp"] || []).push([[6],{

/***/ "./node_modules/@cmao/midi-domain-function/dist/es5/defs.js":
/*!******************************************************************!*\
  !*** ./node_modules/@cmao/midi-domain-function/dist/es5/defs.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTES = void 0;
exports.NOTES = [
    'C3',
    'D3',
    'E3',
    'F3',
    'G3',
    'A3',
    'B3',
    'C4',
    'D4',
    'E4',
    'F4',
    'G4',
    'A4',
    'B4',
    'C5',
    'D5',
    'E5',
    'F5',
    'G5',
    'A5',
    'B5',
    'C6',
];


/***/ }),

/***/ "./node_modules/@cmao/midi-domain-function/dist/es5/event/event.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@cmao/midi-domain-function/dist/es5/event/event.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.get_events = exports.MIDI_PLAY_COLUMN_EVENT = exports.MIDI_PLAY_NOTE_EVENT = void 0;
exports.MIDI_PLAY_NOTE_EVENT = 'on_midimusic_play_note';
exports.MIDI_PLAY_COLUMN_EVENT = 'on_midimusic_play_columns';
function get_events(deps) {
    var fns = {
        send_on_midimusic_play_note_action: function (midi_id, note) {
            deps
                .get_heart()
                .get_runtime_manager()
                .send_action({
                id: exports.MIDI_PLAY_NOTE_EVENT,
                namespace: '',
                parameters: undefined,
                sub_type: midi_id + note,
                value: JSON.stringify({ midi: midi_id, note: note }),
            });
        },
        send_on_midimusic_play_column_action: function (midi_id, start_step, step) {
            deps
                .get_heart()
                .get_runtime_manager()
                .send_action({
                id: exports.MIDI_PLAY_COLUMN_EVENT,
                namespace: '',
                parameters: undefined,
                sub_type: midi_id,
                value: JSON.stringify({
                    midi: midi_id,
                    start_step: start_step,
                    step: step,
                }),
            });
        },
        get_action_specs: function () {
            return [
                {
                    id: exports.MIDI_PLAY_COLUMN_EVENT,
                    entity_specific: false,
                    responder_blocks: [],
                    statefulness: {
                        default_value: '',
                        automatic_transitions: 'one_frame',
                        use_sub_type: true,
                    },
                },
                {
                    id: exports.MIDI_PLAY_NOTE_EVENT,
                    entity_specific: false,
                    responder_blocks: [],
                    statefulness: {
                        default_value: '',
                        automatic_transitions: 'one_frame',
                        use_sub_type: true,
                    },
                },
            ];
        },
    };
    return fns;
}
exports.get_events = get_events;


/***/ }),

/***/ "./node_modules/@cmao/midi-domain-function/dist/es5/function/domain_function.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@cmao/midi-domain-function/dist/es5/function/domain_function.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.get_domain_functions = void 0;
var lodash_1 = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var midimao_1 = __webpack_require__(/*! @cmao/midimao */ "./node_modules/@cmao/midimao/dist/index.js");
var runtime_info_1 = __webpack_require__(/*! ../runtime_info */ "./node_modules/@cmao/midi-domain-function/dist/es5/runtime_info.js");
var index_1 = __webpack_require__(/*! ../midi_player/index */ "./node_modules/@cmao/midi-domain-function/dist/es5/midi_player/index.js");
var defs_1 = __webpack_require__(/*! ../defs */ "./node_modules/@cmao/midi-domain-function/dist/es5/defs.js");
var event_1 = __webpack_require__(/*! ../event/event */ "./node_modules/@cmao/midi-domain-function/dist/es5/event/event.js");
function get_domain_functions(deps) {
    var runtime_manager = deps.get_heart().get_runtime_manager();
    var runtime_data = deps.get_heart().get_runtime_data();
    var midi_locks = {};
    function get_midi_id(args_midimusic) {
        var midi_info = runtime_info_1.get_midi_info();
        if (lodash_1.isNumber(args_midimusic)) {
            if (args_midimusic < 0.5 ||
                Math.round(args_midimusic) >= midi_info.length + 1 ||
                isNaN(args_midimusic)) {
                console.log('over range');
                return;
            }
            args_midimusic = Math.round(args_midimusic);
            var midiId = midi_info[args_midimusic - 1][1];
            return midiId;
        }
        if (!runtime_info_1.get_midiMusics().has(args_midimusic)) {
            var arr = midi_info.find(function (item) { return item[0] === args_midimusic; });
            if (lodash_1.isArray(arr)) {
                return arr[1];
            }
            else {
                console.log('please input right name');
                return;
            }
        }
        else {
            return args_midimusic;
        }
    }
    function get_note(note) {
        if (lodash_1.isString(note)) {
            return note;
        }
        if (lodash_1.isNumber(note) && 1 <= note && note <= defs_1.NOTES.length) {
            return defs_1.NOTES[Math.round(note) - 1];
        }
        return;
    }
    function get_note_number(note) {
        return defs_1.NOTES.indexOf(note) + 1;
    }
    function lock_midi_thread(entity_id, root_block_id, id) {
        midi_locks[id] = runtime_manager.get_thread_lock(entity_id, root_block_id);
    }
    function release_midi_lock(id, all) {
        if (all) {
            runtime_info_1.get_midiMusics().forEach(function (value, index_map) {
                release_midi_lock(value.id);
            });
        }
        if (midi_locks[id]) {
            midi_locks[id].stop();
            delete midi_locks[id];
        }
    }
    function registerEventtoTrigger(midi_id, start_step, func) {
        runtime_info_1.get_midiMusics()
            .get(midi_id)
            .midiMao.register_event(midimao_1.MidiMaoEventType.PLAYING, function (note, sequence, time, midi) {
            note.map(function (value, index) {
                event_1.get_events(deps).send_on_midimusic_play_note_action(midi_id, value);
            });
            event_1.get_events(deps).send_on_midimusic_play_column_action(midi_id, start_step, sequence.step);
        });
    }
    function unregisterAllMidi() {
        runtime_info_1.get_midiMusics().forEach(function (value) {
            value.midiMao.remove_all_event();
        });
    }
    function unregisterEvent(midi_id) {
        var _a;
        (_a = runtime_info_1.get_midiMusics().get(midi_id)) === null || _a === void 0 ? void 0 : _a.midiMao.remove_all_event();
    }
    var fns = {
        get_midis: function get_midis(args, rbid, entity_id) {
            return args.midimusic_id;
        },
        get_whole_midis: function get_whole_midis(args, rbid, entity_id) {
            return args.midimusic_id;
        },
        get_any_midis: function get_any_midis(args, rbid, entity_id) {
            return args.midimusic_id;
        },
        get_notes: function get_notes(args, rbid, entity_id) {
            return args.note;
        },
        on_midimusic_play_note: function on_midimusic_play_note(args, rbid, entity_id) {
            var midimusic = args.midimusic, note = args.note;
            var _note = get_note(note);
            if (!_note)
                return false;
            if (midimusic === 'any') {
                var midi_id_list = runtime_info_1.get_midi_info().map(function (value, index) { return value[1]; });
                return midi_id_list.some(function (element, index) { return (runtime_data.get_action_state_value({
                    action_id: event_1.MIDI_PLAY_NOTE_EVENT,
                    action_namespace: '',
                    sub_type: element + _note,
                }) !== ''); });
            }
            else {
                var midi_id = get_midi_id(midimusic);
                if (!midi_id)
                    return false;
                return (runtime_data.get_action_state_value({
                    action_id: event_1.MIDI_PLAY_NOTE_EVENT,
                    action_namespace: '',
                    sub_type: midi_id + _note,
                }) !== '');
            }
        },
        on_midimusic_play_columns: function on_midimusic_play_columns(args, rbid, entity_id) {
            var midimusic = args.midimusic, column_num = args.column_num;
            if (!lodash_1.isNumber(column_num))
                return false;
            var midi_id = get_midi_id(midimusic);
            if (!midi_id)
                return false;
            var value = runtime_data.get_action_state_value({
                action_id: event_1.MIDI_PLAY_COLUMN_EVENT,
                action_namespace: '',
                sub_type: midi_id,
            });
            if (value === '') {
                return false;
            }
            try {
                var params = JSON.parse(value);
                return (midi_id === params.midi &&
                    (params.step - params.start_step + 1) % column_num === 0);
            }
            catch (e) {
                console.error(e);
            }
            return false;
        },
        play_midimusic: function play_midimusic(args, rbid, entity_id) {
            var midimusic = args.midimusic;
            var midi_id = get_midi_id(midimusic);
            if (!midi_id)
                return;
            registerEventtoTrigger(midi_id, 0);
            index_1.midiPlayer.midiPlay(midi_id, function () {
                unregisterEvent(midi_id);
            });
        },
        play_midimusic_till_end: function play_midimusic_till_end(args, rbid, entity_id) {
            var midimusic = args.midimusic;
            var midi_id = get_midi_id(midimusic);
            if (!midi_id)
                return;
            registerEventtoTrigger(midi_id, 0);
            lock_midi_thread(entity_id, rbid, midi_id);
            index_1.midiPlayer.midiPlay(midi_id, function () {
                release_midi_lock(midi_id);
            });
        },
        stop_midimusic: function stop_midimusic(args, rbid, entity_id) {
            var midimusic = args.midimusic;
            if (midimusic === 'all') {
                unregisterAllMidi();
                release_midi_lock(midimusic, true);
                index_1.midiPlayer.midiStop(midimusic);
            }
            else {
                var midi_id = get_midi_id(midimusic);
                if (!midi_id)
                    return;
                unregisterEvent(midi_id);
                release_midi_lock(midi_id);
                index_1.midiPlayer.midiStop(midi_id);
            }
        },
        set_midimusic_instrument: function set_midimusic_instrument(args, rbid, entity_id) {
            var midimusic = args.midimusic, instrument = args.instrument;
            var midi_id = get_midi_id(midimusic);
            if (!midi_id)
                return;
            var choose_instrument;
            switch (instrument) {
                case 'electric': {
                    choose_instrument = midimao_1.InstrumentEnum.ELECTRIC;
                    break;
                }
                case 'guitar': {
                    choose_instrument = midimao_1.InstrumentEnum.GUITAR;
                    break;
                }
                case 'piano': {
                    choose_instrument = midimao_1.InstrumentEnum.PIANO;
                    break;
                }
                case 'game': {
                    choose_instrument = midimao_1.InstrumentEnum.GAME;
                    break;
                }
                case 'dream': {
                    choose_instrument = midimao_1.InstrumentEnum.DREAM;
                    break;
                }
                case 'joker': {
                    choose_instrument = midimao_1.InstrumentEnum.JOKER;
                    break;
                }
                default: {
                    choose_instrument = midimao_1.InstrumentEnum.MIDI;
                }
            }
            index_1.midiPlayer.midiSetInstrument(midi_id, choose_instrument);
        },
        set_midimusic_speed: function set_midimusic_speed(args, rbid, entity_id) {
            var speed = args.speed;
            if (!lodash_1.isNumber(speed) || speed <= 0 || !isFinite(speed) || isNaN(speed)) {
                return;
            }
            index_1.midiPlayer.midiSetGlobalSpeed(speed > 4 ? 4 : speed);
        },
        play_midimusic_column: function play_midimusic_column(args, rbid, entity_id) {
            var _a;
            var midimusic = args.midimusic, FROM = args.FROM, TO = args.TO;
            if (!lodash_1.isNumber(FROM) || (!!TO && !lodash_1.isNumber(TO)) || FROM < 1 || FROM > 240)
                return;
            var midi_id = get_midi_id(midimusic);
            if (!midi_id)
                return;
            if (((_a = runtime_info_1.get_midiMusics().get(midi_id)) === null || _a === void 0 ? void 0 : _a.midiMao.get_midi_info().state) !== 1) {
                runtime_info_1.get_midiMusics()
                    .get(midi_id)
                    .midiMao.register_event(midimao_1.MidiMaoEventType.END, function () {
                    unregisterEvent(midi_id);
                });
                registerEventtoTrigger(midi_id, FROM);
                index_1.midiPlayer.midiPlayNotes(midi_id, FROM - 1, TO - 1);
            }
        },
        midimusic_column_tag: function midimusic_column_tag(args, rbid, entity_id) {
            var TYPE = args.TYPE, midimusic = args.midimusic;
            var midi_id = get_midi_id(midimusic);
            if (!midi_id)
                return [];
            switch (TYPE) {
                case 'note': {
                    if (!lodash_1.isNumber(args.INDEX) || args.INDEX < 1 || args.INDEX > 240)
                        return;
                    var res = index_1.midiPlayer
                        .midiNotes(midi_id, args.INDEX - 1)
                        .map(function (value, index) { return get_note_number(value); });
                    if (res.length === 1)
                        return res[0];
                    return res.reverse();
                }
                case 'beat': {
                    return index_1.midiPlayer.midiBeats(midi_id);
                }
                default: {
                    return [];
                }
            }
        },
    };
    return fns;
}
exports.get_domain_functions = get_domain_functions;


/***/ }),

/***/ "./node_modules/@cmao/midi-domain-function/dist/es5/function/index.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@cmao/midi-domain-function/dist/es5/function/index.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.inject_midi_function = void 0;
var lodash_1 = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var event_1 = __webpack_require__(/*! ../event/event */ "./node_modules/@cmao/midi-domain-function/dist/es5/event/event.js");
var domain_function_1 = __webpack_require__(/*! ./domain_function */ "./node_modules/@cmao/midi-domain-function/dist/es5/function/domain_function.js");
function inject_midi_function(deps) {
    var domain_functions = domain_function_1.get_domain_functions(deps);
    var registry = deps.get_heart().get_registry();
    var metadatas = {
        'on_midimusic_play_columns': { restart_when_finished: true },
        'on_midimusic_play_note': { restart_when_finished: true },
    };
    lodash_1.forEach(domain_functions, function (fun, key) {
        deps.get_heart().get_registry().register({
            namespace: '',
            id: key,
            domain_function: fun,
            metadata: metadatas[key],
        });
    });
    var events = event_1.get_events(deps);
    lodash_1.forEach(events.get_action_specs(), function (action_spec) {
        deps.get_heart().get_registry().register_action_type({
            namespace: '',
            id: action_spec.id,
            statefulness: action_spec.statefulness,
        });
        action_spec.responder_blocks.forEach(function (responder_spec) {
            registry.register({
                namespace: '',
                id: responder_spec.id,
                respond: {
                    to_action: {
                        namespace: '',
                        id: action_spec.id,
                    },
                    type: responder_spec.type,
                    async: responder_spec.async,
                    priority: responder_spec.priority,
                    entity_specific: action_spec.entity_specific,
                    trigger_function: responder_spec.trigger_function,
                    filter_arg_names: responder_spec.filter_arg_names,
                },
            });
        });
    });
}
exports.inject_midi_function = inject_midi_function;


/***/ }),

/***/ "./node_modules/@cmao/midi-domain-function/dist/es5/index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@cmao/midi-domain-function/dist/es5/index.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.midiPlayer = exports.inject_runtime_data = exports.inject_midi_function = void 0;
var function_1 = __webpack_require__(/*! ./function */ "./node_modules/@cmao/midi-domain-function/dist/es5/function/index.js");
Object.defineProperty(exports, "inject_midi_function", { enumerable: true, get: function () { return function_1.inject_midi_function; } });
var runtime_info_1 = __webpack_require__(/*! ./runtime_info */ "./node_modules/@cmao/midi-domain-function/dist/es5/runtime_info.js");
Object.defineProperty(exports, "inject_runtime_data", { enumerable: true, get: function () { return runtime_info_1.inject_runtime_data; } });
var midi_player_1 = __webpack_require__(/*! ./midi_player */ "./node_modules/@cmao/midi-domain-function/dist/es5/midi_player/index.js");
Object.defineProperty(exports, "midiPlayer", { enumerable: true, get: function () { return midi_player_1.midiPlayer; } });


/***/ }),

/***/ "./node_modules/@cmao/midi-domain-function/dist/es5/midi_player/index.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@cmao/midi-domain-function/dist/es5/midi_player/index.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.midiPlayer = void 0;
var midimao_1 = __webpack_require__(/*! @cmao/midimao */ "./node_modules/@cmao/midimao/dist/index.js");
var runtime_info_1 = __webpack_require__(/*! ../runtime_info */ "./node_modules/@cmao/midi-domain-function/dist/es5/runtime_info.js");
function midiPlay(id, func) {
    var _a;
    runtime_info_1.get_midiMusics()
        .get(id)
        .midiMao.register_event(midimao_1.MidiMaoEventType.END, function () {
        func && func();
    });
    return (_a = runtime_info_1.get_midiMusics().get(id)) === null || _a === void 0 ? void 0 : _a.midiMao.play();
}
function midiStop(id) {
    var _a;
    if (id === 'all') {
        runtime_info_1.get_midiMusics().forEach(function (value, index) {
            value.midiMao.stop();
        });
        midiReset();
        return;
    }
    (_a = runtime_info_1.get_midiMusics().get(id)) === null || _a === void 0 ? void 0 : _a.midiMao.stop();
}
function midiSetInstrument(id, instrument) {
    var _a;
    (_a = runtime_info_1.get_midiMusics().get(id)) === null || _a === void 0 ? void 0 : _a.midiMao.set_instrument(instrument);
}
function midiSetGlobalSpeed(speed) {
    runtime_info_1.get_midiMusics().forEach(function (value) {
        value.midiMao.set_playback_rate(speed);
    });
}
function midiPlayNotes(id, from, to) {
    var _a;
    if ((to && from > to) || from < 0) {
        console.warn('please reset range');
    }
    return (_a = runtime_info_1.get_midiMusics().get(id)) === null || _a === void 0 ? void 0 : _a.midiMao.play_part(from, to);
}
function midiNotes(midi_id, column) {
    var _a;
    if (column < 0)
        return;
    var current_notes = [];
    (_a = runtime_info_1.get_midiMusics()
        .get(midi_id)) === null || _a === void 0 ? void 0 : _a.midiMao.get_pro_midi().tracks.forEach(function (track) {
        var note = track.notes[column];
        note && current_notes.push(note.name);
    });
    return current_notes;
}
function midiBeats(midi_id) {
    var _a;
    var info = (_a = runtime_info_1.get_midiMusics().get(midi_id)) === null || _a === void 0 ? void 0 : _a.midiMao.get_midi_info();
    return Math.round(info.bpm * info.playback_rate);
}
function midiReset() {
    runtime_info_1.get_midiMusics().forEach(function (value) {
        value.midiMao.set_playback_rate(1);
    });
}
exports.midiPlayer = {
    midiPlay: midiPlay,
    midiStop: midiStop,
    midiSetInstrument: midiSetInstrument,
    midiSetGlobalSpeed: midiSetGlobalSpeed,
    midiPlayNotes: midiPlayNotes,
    midiNotes: midiNotes,
    midiBeats: midiBeats,
};


/***/ }),

/***/ "./node_modules/@cmao/midi-domain-function/dist/es5/runtime_info.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@cmao/midi-domain-function/dist/es5/runtime_info.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.get_midiMusics = exports.get_midi_info = exports.inject_runtime_data = void 0;
var midimao_1 = __webpack_require__(/*! @cmao/midimao */ "./node_modules/@cmao/midimao/dist/index.js");
var data;
var midiMusics = new Map();
function inject_runtime_data(_data) {
    midiMusics = new Map();
    data = _data;
    for (var _i = 0, _data_1 = _data; _i < _data_1.length; _i++) {
        var value = _data_1[_i];
        var name_1 = value[0], id = value[1], midiData = value[2], vol = value[3];
        var midiMao = new midimao_1.MidiMao(midiData, {
            data: midimao_1.MidiMao.get_obb(midiData.obb),
            name: midiData.obb,
        }).set_volume(vol !== null && vol !== void 0 ? vol : 100);
        var midiMusic = {
            id: id,
            name: name_1,
            midiMao: midiMao,
        };
        midiMusics.set(id, midiMusic);
    }
}
exports.inject_runtime_data = inject_runtime_data;
function get_midi_info() {
    return data;
}
exports.get_midi_info = get_midi_info;
function get_midiMusics() {
    return midiMusics;
}
exports.get_midiMusics = get_midiMusics;


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AY21hby9taWRpLWRvbWFpbi1mdW5jdGlvbi9kaXN0L2VzNS9kZWZzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AY21hby9taWRpLWRvbWFpbi1mdW5jdGlvbi9kaXN0L2VzNS9ldmVudC9ldmVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGNtYW8vbWlkaS1kb21haW4tZnVuY3Rpb24vZGlzdC9lczUvZnVuY3Rpb24vZG9tYWluX2Z1bmN0aW9uLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AY21hby9taWRpLWRvbWFpbi1mdW5jdGlvbi9kaXN0L2VzNS9mdW5jdGlvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGNtYW8vbWlkaS1kb21haW4tZnVuY3Rpb24vZGlzdC9lczUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BjbWFvL21pZGktZG9tYWluLWZ1bmN0aW9uL2Rpc3QvZXM1L21pZGlfcGxheWVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AY21hby9taWRpLWRvbWFpbi1mdW5jdGlvbi9kaXN0L2VzNS9ydW50aW1lX2luZm8uanMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLk5PVEVTID0gdm9pZCAwO1xuZXhwb3J0cy5OT1RFUyA9IFtcbiAgICAnQzMnLFxuICAgICdEMycsXG4gICAgJ0UzJyxcbiAgICAnRjMnLFxuICAgICdHMycsXG4gICAgJ0EzJyxcbiAgICAnQjMnLFxuICAgICdDNCcsXG4gICAgJ0Q0JyxcbiAgICAnRTQnLFxuICAgICdGNCcsXG4gICAgJ0c0JyxcbiAgICAnQTQnLFxuICAgICdCNCcsXG4gICAgJ0M1JyxcbiAgICAnRDUnLFxuICAgICdFNScsXG4gICAgJ0Y1JyxcbiAgICAnRzUnLFxuICAgICdBNScsXG4gICAgJ0I1JyxcbiAgICAnQzYnLFxuXTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5nZXRfZXZlbnRzID0gZXhwb3J0cy5NSURJX1BMQVlfQ09MVU1OX0VWRU5UID0gZXhwb3J0cy5NSURJX1BMQVlfTk9URV9FVkVOVCA9IHZvaWQgMDtcbmV4cG9ydHMuTUlESV9QTEFZX05PVEVfRVZFTlQgPSAnb25fbWlkaW11c2ljX3BsYXlfbm90ZSc7XG5leHBvcnRzLk1JRElfUExBWV9DT0xVTU5fRVZFTlQgPSAnb25fbWlkaW11c2ljX3BsYXlfY29sdW1ucyc7XG5mdW5jdGlvbiBnZXRfZXZlbnRzKGRlcHMpIHtcbiAgICB2YXIgZm5zID0ge1xuICAgICAgICBzZW5kX29uX21pZGltdXNpY19wbGF5X25vdGVfYWN0aW9uOiBmdW5jdGlvbiAobWlkaV9pZCwgbm90ZSkge1xuICAgICAgICAgICAgZGVwc1xuICAgICAgICAgICAgICAgIC5nZXRfaGVhcnQoKVxuICAgICAgICAgICAgICAgIC5nZXRfcnVudGltZV9tYW5hZ2VyKClcbiAgICAgICAgICAgICAgICAuc2VuZF9hY3Rpb24oe1xuICAgICAgICAgICAgICAgIGlkOiBleHBvcnRzLk1JRElfUExBWV9OT1RFX0VWRU5ULFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogJycsXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHN1Yl90eXBlOiBtaWRpX2lkICsgbm90ZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogSlNPTi5zdHJpbmdpZnkoeyBtaWRpOiBtaWRpX2lkLCBub3RlOiBub3RlIH0pLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHNlbmRfb25fbWlkaW11c2ljX3BsYXlfY29sdW1uX2FjdGlvbjogZnVuY3Rpb24gKG1pZGlfaWQsIHN0YXJ0X3N0ZXAsIHN0ZXApIHtcbiAgICAgICAgICAgIGRlcHNcbiAgICAgICAgICAgICAgICAuZ2V0X2hlYXJ0KClcbiAgICAgICAgICAgICAgICAuZ2V0X3J1bnRpbWVfbWFuYWdlcigpXG4gICAgICAgICAgICAgICAgLnNlbmRfYWN0aW9uKHtcbiAgICAgICAgICAgICAgICBpZDogZXhwb3J0cy5NSURJX1BMQVlfQ09MVU1OX0VWRU5ULFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogJycsXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHN1Yl90eXBlOiBtaWRpX2lkLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIG1pZGk6IG1pZGlfaWQsXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0X3N0ZXA6IHN0YXJ0X3N0ZXAsXG4gICAgICAgICAgICAgICAgICAgIHN0ZXA6IHN0ZXAsXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0X2FjdGlvbl9zcGVjczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBleHBvcnRzLk1JRElfUExBWV9DT0xVTU5fRVZFTlQsXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eV9zcGVjaWZpYzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbmRlcl9ibG9ja3M6IFtdLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZWZ1bG5lc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRfdmFsdWU6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXV0b21hdGljX3RyYW5zaXRpb25zOiAnb25lX2ZyYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZV9zdWJfdHlwZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGV4cG9ydHMuTUlESV9QTEFZX05PVEVfRVZFTlQsXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eV9zcGVjaWZpYzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbmRlcl9ibG9ja3M6IFtdLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZWZ1bG5lc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRfdmFsdWU6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXV0b21hdGljX3RyYW5zaXRpb25zOiAnb25lX2ZyYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZV9zdWJfdHlwZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXTtcbiAgICAgICAgfSxcbiAgICB9O1xuICAgIHJldHVybiBmbnM7XG59XG5leHBvcnRzLmdldF9ldmVudHMgPSBnZXRfZXZlbnRzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldF9kb21haW5fZnVuY3Rpb25zID0gdm9pZCAwO1xudmFyIGxvZGFzaF8xID0gcmVxdWlyZShcImxvZGFzaFwiKTtcbnZhciBtaWRpbWFvXzEgPSByZXF1aXJlKFwiQGNtYW8vbWlkaW1hb1wiKTtcbnZhciBydW50aW1lX2luZm9fMSA9IHJlcXVpcmUoXCIuLi9ydW50aW1lX2luZm9cIik7XG52YXIgaW5kZXhfMSA9IHJlcXVpcmUoXCIuLi9taWRpX3BsYXllci9pbmRleFwiKTtcbnZhciBkZWZzXzEgPSByZXF1aXJlKFwiLi4vZGVmc1wiKTtcbnZhciBldmVudF8xID0gcmVxdWlyZShcIi4uL2V2ZW50L2V2ZW50XCIpO1xuZnVuY3Rpb24gZ2V0X2RvbWFpbl9mdW5jdGlvbnMoZGVwcykge1xuICAgIHZhciBydW50aW1lX21hbmFnZXIgPSBkZXBzLmdldF9oZWFydCgpLmdldF9ydW50aW1lX21hbmFnZXIoKTtcbiAgICB2YXIgcnVudGltZV9kYXRhID0gZGVwcy5nZXRfaGVhcnQoKS5nZXRfcnVudGltZV9kYXRhKCk7XG4gICAgdmFyIG1pZGlfbG9ja3MgPSB7fTtcbiAgICBmdW5jdGlvbiBnZXRfbWlkaV9pZChhcmdzX21pZGltdXNpYykge1xuICAgICAgICB2YXIgbWlkaV9pbmZvID0gcnVudGltZV9pbmZvXzEuZ2V0X21pZGlfaW5mbygpO1xuICAgICAgICBpZiAobG9kYXNoXzEuaXNOdW1iZXIoYXJnc19taWRpbXVzaWMpKSB7XG4gICAgICAgICAgICBpZiAoYXJnc19taWRpbXVzaWMgPCAwLjUgfHxcbiAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKGFyZ3NfbWlkaW11c2ljKSA+PSBtaWRpX2luZm8ubGVuZ3RoICsgMSB8fFxuICAgICAgICAgICAgICAgIGlzTmFOKGFyZ3NfbWlkaW11c2ljKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdvdmVyIHJhbmdlJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXJnc19taWRpbXVzaWMgPSBNYXRoLnJvdW5kKGFyZ3NfbWlkaW11c2ljKTtcbiAgICAgICAgICAgIHZhciBtaWRpSWQgPSBtaWRpX2luZm9bYXJnc19taWRpbXVzaWMgLSAxXVsxXTtcbiAgICAgICAgICAgIHJldHVybiBtaWRpSWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFydW50aW1lX2luZm9fMS5nZXRfbWlkaU11c2ljcygpLmhhcyhhcmdzX21pZGltdXNpYykpIHtcbiAgICAgICAgICAgIHZhciBhcnIgPSBtaWRpX2luZm8uZmluZChmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gaXRlbVswXSA9PT0gYXJnc19taWRpbXVzaWM7IH0pO1xuICAgICAgICAgICAgaWYgKGxvZGFzaF8xLmlzQXJyYXkoYXJyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhcnJbMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncGxlYXNlIGlucHV0IHJpZ2h0IG5hbWUnKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYXJnc19taWRpbXVzaWM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0X25vdGUobm90ZSkge1xuICAgICAgICBpZiAobG9kYXNoXzEuaXNTdHJpbmcobm90ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBub3RlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2Rhc2hfMS5pc051bWJlcihub3RlKSAmJiAxIDw9IG5vdGUgJiYgbm90ZSA8PSBkZWZzXzEuTk9URVMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVmc18xLk5PVEVTW01hdGgucm91bmQobm90ZSkgLSAxXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldF9ub3RlX251bWJlcihub3RlKSB7XG4gICAgICAgIHJldHVybiBkZWZzXzEuTk9URVMuaW5kZXhPZihub3RlKSArIDE7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGxvY2tfbWlkaV90aHJlYWQoZW50aXR5X2lkLCByb290X2Jsb2NrX2lkLCBpZCkge1xuICAgICAgICBtaWRpX2xvY2tzW2lkXSA9IHJ1bnRpbWVfbWFuYWdlci5nZXRfdGhyZWFkX2xvY2soZW50aXR5X2lkLCByb290X2Jsb2NrX2lkKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVsZWFzZV9taWRpX2xvY2soaWQsIGFsbCkge1xuICAgICAgICBpZiAoYWxsKSB7XG4gICAgICAgICAgICBydW50aW1lX2luZm9fMS5nZXRfbWlkaU11c2ljcygpLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBpbmRleF9tYXApIHtcbiAgICAgICAgICAgICAgICByZWxlYXNlX21pZGlfbG9jayh2YWx1ZS5pZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWlkaV9sb2Nrc1tpZF0pIHtcbiAgICAgICAgICAgIG1pZGlfbG9ja3NbaWRdLnN0b3AoKTtcbiAgICAgICAgICAgIGRlbGV0ZSBtaWRpX2xvY2tzW2lkXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiByZWdpc3RlckV2ZW50dG9UcmlnZ2VyKG1pZGlfaWQsIHN0YXJ0X3N0ZXAsIGZ1bmMpIHtcbiAgICAgICAgcnVudGltZV9pbmZvXzEuZ2V0X21pZGlNdXNpY3MoKVxuICAgICAgICAgICAgLmdldChtaWRpX2lkKVxuICAgICAgICAgICAgLm1pZGlNYW8ucmVnaXN0ZXJfZXZlbnQobWlkaW1hb18xLk1pZGlNYW9FdmVudFR5cGUuUExBWUlORywgZnVuY3Rpb24gKG5vdGUsIHNlcXVlbmNlLCB0aW1lLCBtaWRpKSB7XG4gICAgICAgICAgICBub3RlLm1hcChmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgZXZlbnRfMS5nZXRfZXZlbnRzKGRlcHMpLnNlbmRfb25fbWlkaW11c2ljX3BsYXlfbm90ZV9hY3Rpb24obWlkaV9pZCwgdmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBldmVudF8xLmdldF9ldmVudHMoZGVwcykuc2VuZF9vbl9taWRpbXVzaWNfcGxheV9jb2x1bW5fYWN0aW9uKG1pZGlfaWQsIHN0YXJ0X3N0ZXAsIHNlcXVlbmNlLnN0ZXApO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdW5yZWdpc3RlckFsbE1pZGkoKSB7XG4gICAgICAgIHJ1bnRpbWVfaW5mb18xLmdldF9taWRpTXVzaWNzKCkuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhbHVlLm1pZGlNYW8ucmVtb3ZlX2FsbF9ldmVudCgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdW5yZWdpc3RlckV2ZW50KG1pZGlfaWQpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICAoX2EgPSBydW50aW1lX2luZm9fMS5nZXRfbWlkaU11c2ljcygpLmdldChtaWRpX2lkKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm1pZGlNYW8ucmVtb3ZlX2FsbF9ldmVudCgpO1xuICAgIH1cbiAgICB2YXIgZm5zID0ge1xuICAgICAgICBnZXRfbWlkaXM6IGZ1bmN0aW9uIGdldF9taWRpcyhhcmdzLCByYmlkLCBlbnRpdHlfaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBhcmdzLm1pZGltdXNpY19pZDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0X3dob2xlX21pZGlzOiBmdW5jdGlvbiBnZXRfd2hvbGVfbWlkaXMoYXJncywgcmJpZCwgZW50aXR5X2lkKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJncy5taWRpbXVzaWNfaWQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldF9hbnlfbWlkaXM6IGZ1bmN0aW9uIGdldF9hbnlfbWlkaXMoYXJncywgcmJpZCwgZW50aXR5X2lkKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJncy5taWRpbXVzaWNfaWQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldF9ub3RlczogZnVuY3Rpb24gZ2V0X25vdGVzKGFyZ3MsIHJiaWQsIGVudGl0eV9pZCkge1xuICAgICAgICAgICAgcmV0dXJuIGFyZ3Mubm90ZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25fbWlkaW11c2ljX3BsYXlfbm90ZTogZnVuY3Rpb24gb25fbWlkaW11c2ljX3BsYXlfbm90ZShhcmdzLCByYmlkLCBlbnRpdHlfaWQpIHtcbiAgICAgICAgICAgIHZhciBtaWRpbXVzaWMgPSBhcmdzLm1pZGltdXNpYywgbm90ZSA9IGFyZ3Mubm90ZTtcbiAgICAgICAgICAgIHZhciBfbm90ZSA9IGdldF9ub3RlKG5vdGUpO1xuICAgICAgICAgICAgaWYgKCFfbm90ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBpZiAobWlkaW11c2ljID09PSAnYW55Jykge1xuICAgICAgICAgICAgICAgIHZhciBtaWRpX2lkX2xpc3QgPSBydW50aW1lX2luZm9fMS5nZXRfbWlkaV9pbmZvKCkubWFwKGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgpIHsgcmV0dXJuIHZhbHVlWzFdOyB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWlkaV9pZF9saXN0LnNvbWUoZnVuY3Rpb24gKGVsZW1lbnQsIGluZGV4KSB7IHJldHVybiAocnVudGltZV9kYXRhLmdldF9hY3Rpb25fc3RhdGVfdmFsdWUoe1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb25faWQ6IGV2ZW50XzEuTUlESV9QTEFZX05PVEVfRVZFTlQsXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbl9uYW1lc3BhY2U6ICcnLFxuICAgICAgICAgICAgICAgICAgICBzdWJfdHlwZTogZWxlbWVudCArIF9ub3RlLFxuICAgICAgICAgICAgICAgIH0pICE9PSAnJyk7IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIG1pZGlfaWQgPSBnZXRfbWlkaV9pZChtaWRpbXVzaWMpO1xuICAgICAgICAgICAgICAgIGlmICghbWlkaV9pZClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybiAocnVudGltZV9kYXRhLmdldF9hY3Rpb25fc3RhdGVfdmFsdWUoe1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb25faWQ6IGV2ZW50XzEuTUlESV9QTEFZX05PVEVfRVZFTlQsXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbl9uYW1lc3BhY2U6ICcnLFxuICAgICAgICAgICAgICAgICAgICBzdWJfdHlwZTogbWlkaV9pZCArIF9ub3RlLFxuICAgICAgICAgICAgICAgIH0pICE9PSAnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9uX21pZGltdXNpY19wbGF5X2NvbHVtbnM6IGZ1bmN0aW9uIG9uX21pZGltdXNpY19wbGF5X2NvbHVtbnMoYXJncywgcmJpZCwgZW50aXR5X2lkKSB7XG4gICAgICAgICAgICB2YXIgbWlkaW11c2ljID0gYXJncy5taWRpbXVzaWMsIGNvbHVtbl9udW0gPSBhcmdzLmNvbHVtbl9udW07XG4gICAgICAgICAgICBpZiAoIWxvZGFzaF8xLmlzTnVtYmVyKGNvbHVtbl9udW0pKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHZhciBtaWRpX2lkID0gZ2V0X21pZGlfaWQobWlkaW11c2ljKTtcbiAgICAgICAgICAgIGlmICghbWlkaV9pZClcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBydW50aW1lX2RhdGEuZ2V0X2FjdGlvbl9zdGF0ZV92YWx1ZSh7XG4gICAgICAgICAgICAgICAgYWN0aW9uX2lkOiBldmVudF8xLk1JRElfUExBWV9DT0xVTU5fRVZFTlQsXG4gICAgICAgICAgICAgICAgYWN0aW9uX25hbWVzcGFjZTogJycsXG4gICAgICAgICAgICAgICAgc3ViX3R5cGU6IG1pZGlfaWQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKG1pZGlfaWQgPT09IHBhcmFtcy5taWRpICYmXG4gICAgICAgICAgICAgICAgICAgIChwYXJhbXMuc3RlcCAtIHBhcmFtcy5zdGFydF9zdGVwICsgMSkgJSBjb2x1bW5fbnVtID09PSAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgcGxheV9taWRpbXVzaWM6IGZ1bmN0aW9uIHBsYXlfbWlkaW11c2ljKGFyZ3MsIHJiaWQsIGVudGl0eV9pZCkge1xuICAgICAgICAgICAgdmFyIG1pZGltdXNpYyA9IGFyZ3MubWlkaW11c2ljO1xuICAgICAgICAgICAgdmFyIG1pZGlfaWQgPSBnZXRfbWlkaV9pZChtaWRpbXVzaWMpO1xuICAgICAgICAgICAgaWYgKCFtaWRpX2lkKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHJlZ2lzdGVyRXZlbnR0b1RyaWdnZXIobWlkaV9pZCwgMCk7XG4gICAgICAgICAgICBpbmRleF8xLm1pZGlQbGF5ZXIubWlkaVBsYXkobWlkaV9pZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHVucmVnaXN0ZXJFdmVudChtaWRpX2lkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBwbGF5X21pZGltdXNpY190aWxsX2VuZDogZnVuY3Rpb24gcGxheV9taWRpbXVzaWNfdGlsbF9lbmQoYXJncywgcmJpZCwgZW50aXR5X2lkKSB7XG4gICAgICAgICAgICB2YXIgbWlkaW11c2ljID0gYXJncy5taWRpbXVzaWM7XG4gICAgICAgICAgICB2YXIgbWlkaV9pZCA9IGdldF9taWRpX2lkKG1pZGltdXNpYyk7XG4gICAgICAgICAgICBpZiAoIW1pZGlfaWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgcmVnaXN0ZXJFdmVudHRvVHJpZ2dlcihtaWRpX2lkLCAwKTtcbiAgICAgICAgICAgIGxvY2tfbWlkaV90aHJlYWQoZW50aXR5X2lkLCByYmlkLCBtaWRpX2lkKTtcbiAgICAgICAgICAgIGluZGV4XzEubWlkaVBsYXllci5taWRpUGxheShtaWRpX2lkLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmVsZWFzZV9taWRpX2xvY2sobWlkaV9pZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgc3RvcF9taWRpbXVzaWM6IGZ1bmN0aW9uIHN0b3BfbWlkaW11c2ljKGFyZ3MsIHJiaWQsIGVudGl0eV9pZCkge1xuICAgICAgICAgICAgdmFyIG1pZGltdXNpYyA9IGFyZ3MubWlkaW11c2ljO1xuICAgICAgICAgICAgaWYgKG1pZGltdXNpYyA9PT0gJ2FsbCcpIHtcbiAgICAgICAgICAgICAgICB1bnJlZ2lzdGVyQWxsTWlkaSgpO1xuICAgICAgICAgICAgICAgIHJlbGVhc2VfbWlkaV9sb2NrKG1pZGltdXNpYywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgaW5kZXhfMS5taWRpUGxheWVyLm1pZGlTdG9wKG1pZGltdXNpYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgbWlkaV9pZCA9IGdldF9taWRpX2lkKG1pZGltdXNpYyk7XG4gICAgICAgICAgICAgICAgaWYgKCFtaWRpX2lkKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgdW5yZWdpc3RlckV2ZW50KG1pZGlfaWQpO1xuICAgICAgICAgICAgICAgIHJlbGVhc2VfbWlkaV9sb2NrKG1pZGlfaWQpO1xuICAgICAgICAgICAgICAgIGluZGV4XzEubWlkaVBsYXllci5taWRpU3RvcChtaWRpX2lkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc2V0X21pZGltdXNpY19pbnN0cnVtZW50OiBmdW5jdGlvbiBzZXRfbWlkaW11c2ljX2luc3RydW1lbnQoYXJncywgcmJpZCwgZW50aXR5X2lkKSB7XG4gICAgICAgICAgICB2YXIgbWlkaW11c2ljID0gYXJncy5taWRpbXVzaWMsIGluc3RydW1lbnQgPSBhcmdzLmluc3RydW1lbnQ7XG4gICAgICAgICAgICB2YXIgbWlkaV9pZCA9IGdldF9taWRpX2lkKG1pZGltdXNpYyk7XG4gICAgICAgICAgICBpZiAoIW1pZGlfaWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIGNob29zZV9pbnN0cnVtZW50O1xuICAgICAgICAgICAgc3dpdGNoIChpbnN0cnVtZW50KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnZWxlY3RyaWMnOiB7XG4gICAgICAgICAgICAgICAgICAgIGNob29zZV9pbnN0cnVtZW50ID0gbWlkaW1hb18xLkluc3RydW1lbnRFbnVtLkVMRUNUUklDO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnZ3VpdGFyJzoge1xuICAgICAgICAgICAgICAgICAgICBjaG9vc2VfaW5zdHJ1bWVudCA9IG1pZGltYW9fMS5JbnN0cnVtZW50RW51bS5HVUlUQVI7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICdwaWFubyc6IHtcbiAgICAgICAgICAgICAgICAgICAgY2hvb3NlX2luc3RydW1lbnQgPSBtaWRpbWFvXzEuSW5zdHJ1bWVudEVudW0uUElBTk87XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICdnYW1lJzoge1xuICAgICAgICAgICAgICAgICAgICBjaG9vc2VfaW5zdHJ1bWVudCA9IG1pZGltYW9fMS5JbnN0cnVtZW50RW51bS5HQU1FO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnZHJlYW0nOiB7XG4gICAgICAgICAgICAgICAgICAgIGNob29zZV9pbnN0cnVtZW50ID0gbWlkaW1hb18xLkluc3RydW1lbnRFbnVtLkRSRUFNO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnam9rZXInOiB7XG4gICAgICAgICAgICAgICAgICAgIGNob29zZV9pbnN0cnVtZW50ID0gbWlkaW1hb18xLkluc3RydW1lbnRFbnVtLkpPS0VSO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgICAgICBjaG9vc2VfaW5zdHJ1bWVudCA9IG1pZGltYW9fMS5JbnN0cnVtZW50RW51bS5NSURJO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluZGV4XzEubWlkaVBsYXllci5taWRpU2V0SW5zdHJ1bWVudChtaWRpX2lkLCBjaG9vc2VfaW5zdHJ1bWVudCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldF9taWRpbXVzaWNfc3BlZWQ6IGZ1bmN0aW9uIHNldF9taWRpbXVzaWNfc3BlZWQoYXJncywgcmJpZCwgZW50aXR5X2lkKSB7XG4gICAgICAgICAgICB2YXIgc3BlZWQgPSBhcmdzLnNwZWVkO1xuICAgICAgICAgICAgaWYgKCFsb2Rhc2hfMS5pc051bWJlcihzcGVlZCkgfHwgc3BlZWQgPD0gMCB8fCAhaXNGaW5pdGUoc3BlZWQpIHx8IGlzTmFOKHNwZWVkKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluZGV4XzEubWlkaVBsYXllci5taWRpU2V0R2xvYmFsU3BlZWQoc3BlZWQgPiA0ID8gNCA6IHNwZWVkKTtcbiAgICAgICAgfSxcbiAgICAgICAgcGxheV9taWRpbXVzaWNfY29sdW1uOiBmdW5jdGlvbiBwbGF5X21pZGltdXNpY19jb2x1bW4oYXJncywgcmJpZCwgZW50aXR5X2lkKSB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICB2YXIgbWlkaW11c2ljID0gYXJncy5taWRpbXVzaWMsIEZST00gPSBhcmdzLkZST00sIFRPID0gYXJncy5UTztcbiAgICAgICAgICAgIGlmICghbG9kYXNoXzEuaXNOdW1iZXIoRlJPTSkgfHwgKCEhVE8gJiYgIWxvZGFzaF8xLmlzTnVtYmVyKFRPKSkgfHwgRlJPTSA8IDEgfHwgRlJPTSA+IDI0MClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB2YXIgbWlkaV9pZCA9IGdldF9taWRpX2lkKG1pZGltdXNpYyk7XG4gICAgICAgICAgICBpZiAoIW1pZGlfaWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKCgoX2EgPSBydW50aW1lX2luZm9fMS5nZXRfbWlkaU11c2ljcygpLmdldChtaWRpX2lkKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm1pZGlNYW8uZ2V0X21pZGlfaW5mbygpLnN0YXRlKSAhPT0gMSkge1xuICAgICAgICAgICAgICAgIHJ1bnRpbWVfaW5mb18xLmdldF9taWRpTXVzaWNzKClcbiAgICAgICAgICAgICAgICAgICAgLmdldChtaWRpX2lkKVxuICAgICAgICAgICAgICAgICAgICAubWlkaU1hby5yZWdpc3Rlcl9ldmVudChtaWRpbWFvXzEuTWlkaU1hb0V2ZW50VHlwZS5FTkQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdW5yZWdpc3RlckV2ZW50KG1pZGlfaWQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJlZ2lzdGVyRXZlbnR0b1RyaWdnZXIobWlkaV9pZCwgRlJPTSk7XG4gICAgICAgICAgICAgICAgaW5kZXhfMS5taWRpUGxheWVyLm1pZGlQbGF5Tm90ZXMobWlkaV9pZCwgRlJPTSAtIDEsIFRPIC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1pZGltdXNpY19jb2x1bW5fdGFnOiBmdW5jdGlvbiBtaWRpbXVzaWNfY29sdW1uX3RhZyhhcmdzLCByYmlkLCBlbnRpdHlfaWQpIHtcbiAgICAgICAgICAgIHZhciBUWVBFID0gYXJncy5UWVBFLCBtaWRpbXVzaWMgPSBhcmdzLm1pZGltdXNpYztcbiAgICAgICAgICAgIHZhciBtaWRpX2lkID0gZ2V0X21pZGlfaWQobWlkaW11c2ljKTtcbiAgICAgICAgICAgIGlmICghbWlkaV9pZClcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICBzd2l0Y2ggKFRZUEUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdub3RlJzoge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWxvZGFzaF8xLmlzTnVtYmVyKGFyZ3MuSU5ERVgpIHx8IGFyZ3MuSU5ERVggPCAxIHx8IGFyZ3MuSU5ERVggPiAyNDApXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXMgPSBpbmRleF8xLm1pZGlQbGF5ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5taWRpTm90ZXMobWlkaV9pZCwgYXJncy5JTkRFWCAtIDEpXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgpIHsgcmV0dXJuIGdldF9ub3RlX251bWJlcih2YWx1ZSk7IH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmxlbmd0aCA9PT0gMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNbMF07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXMucmV2ZXJzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICdiZWF0Jzoge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5kZXhfMS5taWRpUGxheWVyLm1pZGlCZWF0cyhtaWRpX2lkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH07XG4gICAgcmV0dXJuIGZucztcbn1cbmV4cG9ydHMuZ2V0X2RvbWFpbl9mdW5jdGlvbnMgPSBnZXRfZG9tYWluX2Z1bmN0aW9ucztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pbmplY3RfbWlkaV9mdW5jdGlvbiA9IHZvaWQgMDtcbnZhciBsb2Rhc2hfMSA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7XG52YXIgZXZlbnRfMSA9IHJlcXVpcmUoXCIuLi9ldmVudC9ldmVudFwiKTtcbnZhciBkb21haW5fZnVuY3Rpb25fMSA9IHJlcXVpcmUoXCIuL2RvbWFpbl9mdW5jdGlvblwiKTtcbmZ1bmN0aW9uIGluamVjdF9taWRpX2Z1bmN0aW9uKGRlcHMpIHtcbiAgICB2YXIgZG9tYWluX2Z1bmN0aW9ucyA9IGRvbWFpbl9mdW5jdGlvbl8xLmdldF9kb21haW5fZnVuY3Rpb25zKGRlcHMpO1xuICAgIHZhciByZWdpc3RyeSA9IGRlcHMuZ2V0X2hlYXJ0KCkuZ2V0X3JlZ2lzdHJ5KCk7XG4gICAgdmFyIG1ldGFkYXRhcyA9IHtcbiAgICAgICAgJ29uX21pZGltdXNpY19wbGF5X2NvbHVtbnMnOiB7IHJlc3RhcnRfd2hlbl9maW5pc2hlZDogdHJ1ZSB9LFxuICAgICAgICAnb25fbWlkaW11c2ljX3BsYXlfbm90ZSc6IHsgcmVzdGFydF93aGVuX2ZpbmlzaGVkOiB0cnVlIH0sXG4gICAgfTtcbiAgICBsb2Rhc2hfMS5mb3JFYWNoKGRvbWFpbl9mdW5jdGlvbnMsIGZ1bmN0aW9uIChmdW4sIGtleSkge1xuICAgICAgICBkZXBzLmdldF9oZWFydCgpLmdldF9yZWdpc3RyeSgpLnJlZ2lzdGVyKHtcbiAgICAgICAgICAgIG5hbWVzcGFjZTogJycsXG4gICAgICAgICAgICBpZDoga2V5LFxuICAgICAgICAgICAgZG9tYWluX2Z1bmN0aW9uOiBmdW4sXG4gICAgICAgICAgICBtZXRhZGF0YTogbWV0YWRhdGFzW2tleV0sXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHZhciBldmVudHMgPSBldmVudF8xLmdldF9ldmVudHMoZGVwcyk7XG4gICAgbG9kYXNoXzEuZm9yRWFjaChldmVudHMuZ2V0X2FjdGlvbl9zcGVjcygpLCBmdW5jdGlvbiAoYWN0aW9uX3NwZWMpIHtcbiAgICAgICAgZGVwcy5nZXRfaGVhcnQoKS5nZXRfcmVnaXN0cnkoKS5yZWdpc3Rlcl9hY3Rpb25fdHlwZSh7XG4gICAgICAgICAgICBuYW1lc3BhY2U6ICcnLFxuICAgICAgICAgICAgaWQ6IGFjdGlvbl9zcGVjLmlkLFxuICAgICAgICAgICAgc3RhdGVmdWxuZXNzOiBhY3Rpb25fc3BlYy5zdGF0ZWZ1bG5lc3MsXG4gICAgICAgIH0pO1xuICAgICAgICBhY3Rpb25fc3BlYy5yZXNwb25kZXJfYmxvY2tzLmZvckVhY2goZnVuY3Rpb24gKHJlc3BvbmRlcl9zcGVjKSB7XG4gICAgICAgICAgICByZWdpc3RyeS5yZWdpc3Rlcih7XG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiAnJyxcbiAgICAgICAgICAgICAgICBpZDogcmVzcG9uZGVyX3NwZWMuaWQsXG4gICAgICAgICAgICAgICAgcmVzcG9uZDoge1xuICAgICAgICAgICAgICAgICAgICB0b19hY3Rpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogYWN0aW9uX3NwZWMuaWQsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IHJlc3BvbmRlcl9zcGVjLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jOiByZXNwb25kZXJfc3BlYy5hc3luYyxcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6IHJlc3BvbmRlcl9zcGVjLnByaW9yaXR5LFxuICAgICAgICAgICAgICAgICAgICBlbnRpdHlfc3BlY2lmaWM6IGFjdGlvbl9zcGVjLmVudGl0eV9zcGVjaWZpYyxcbiAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcl9mdW5jdGlvbjogcmVzcG9uZGVyX3NwZWMudHJpZ2dlcl9mdW5jdGlvbixcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyX2FyZ19uYW1lczogcmVzcG9uZGVyX3NwZWMuZmlsdGVyX2FyZ19uYW1lcyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZXhwb3J0cy5pbmplY3RfbWlkaV9mdW5jdGlvbiA9IGluamVjdF9taWRpX2Z1bmN0aW9uO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLm1pZGlQbGF5ZXIgPSBleHBvcnRzLmluamVjdF9ydW50aW1lX2RhdGEgPSBleHBvcnRzLmluamVjdF9taWRpX2Z1bmN0aW9uID0gdm9pZCAwO1xudmFyIGZ1bmN0aW9uXzEgPSByZXF1aXJlKFwiLi9mdW5jdGlvblwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImluamVjdF9taWRpX2Z1bmN0aW9uXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBmdW5jdGlvbl8xLmluamVjdF9taWRpX2Z1bmN0aW9uOyB9IH0pO1xudmFyIHJ1bnRpbWVfaW5mb18xID0gcmVxdWlyZShcIi4vcnVudGltZV9pbmZvXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaW5qZWN0X3J1bnRpbWVfZGF0YVwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcnVudGltZV9pbmZvXzEuaW5qZWN0X3J1bnRpbWVfZGF0YTsgfSB9KTtcbnZhciBtaWRpX3BsYXllcl8xID0gcmVxdWlyZShcIi4vbWlkaV9wbGF5ZXJcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJtaWRpUGxheWVyXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBtaWRpX3BsYXllcl8xLm1pZGlQbGF5ZXI7IH0gfSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMubWlkaVBsYXllciA9IHZvaWQgMDtcbnZhciBtaWRpbWFvXzEgPSByZXF1aXJlKFwiQGNtYW8vbWlkaW1hb1wiKTtcbnZhciBydW50aW1lX2luZm9fMSA9IHJlcXVpcmUoXCIuLi9ydW50aW1lX2luZm9cIik7XG5mdW5jdGlvbiBtaWRpUGxheShpZCwgZnVuYykge1xuICAgIHZhciBfYTtcbiAgICBydW50aW1lX2luZm9fMS5nZXRfbWlkaU11c2ljcygpXG4gICAgICAgIC5nZXQoaWQpXG4gICAgICAgIC5taWRpTWFvLnJlZ2lzdGVyX2V2ZW50KG1pZGltYW9fMS5NaWRpTWFvRXZlbnRUeXBlLkVORCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jICYmIGZ1bmMoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gKF9hID0gcnVudGltZV9pbmZvXzEuZ2V0X21pZGlNdXNpY3MoKS5nZXQoaWQpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubWlkaU1hby5wbGF5KCk7XG59XG5mdW5jdGlvbiBtaWRpU3RvcChpZCkge1xuICAgIHZhciBfYTtcbiAgICBpZiAoaWQgPT09ICdhbGwnKSB7XG4gICAgICAgIHJ1bnRpbWVfaW5mb18xLmdldF9taWRpTXVzaWNzKCkuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XG4gICAgICAgICAgICB2YWx1ZS5taWRpTWFvLnN0b3AoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG1pZGlSZXNldCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIChfYSA9IHJ1bnRpbWVfaW5mb18xLmdldF9taWRpTXVzaWNzKCkuZ2V0KGlkKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm1pZGlNYW8uc3RvcCgpO1xufVxuZnVuY3Rpb24gbWlkaVNldEluc3RydW1lbnQoaWQsIGluc3RydW1lbnQpIHtcbiAgICB2YXIgX2E7XG4gICAgKF9hID0gcnVudGltZV9pbmZvXzEuZ2V0X21pZGlNdXNpY3MoKS5nZXQoaWQpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubWlkaU1hby5zZXRfaW5zdHJ1bWVudChpbnN0cnVtZW50KTtcbn1cbmZ1bmN0aW9uIG1pZGlTZXRHbG9iYWxTcGVlZChzcGVlZCkge1xuICAgIHJ1bnRpbWVfaW5mb18xLmdldF9taWRpTXVzaWNzKCkuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFsdWUubWlkaU1hby5zZXRfcGxheWJhY2tfcmF0ZShzcGVlZCk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBtaWRpUGxheU5vdGVzKGlkLCBmcm9tLCB0bykge1xuICAgIHZhciBfYTtcbiAgICBpZiAoKHRvICYmIGZyb20gPiB0bykgfHwgZnJvbSA8IDApIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdwbGVhc2UgcmVzZXQgcmFuZ2UnKTtcbiAgICB9XG4gICAgcmV0dXJuIChfYSA9IHJ1bnRpbWVfaW5mb18xLmdldF9taWRpTXVzaWNzKCkuZ2V0KGlkKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm1pZGlNYW8ucGxheV9wYXJ0KGZyb20sIHRvKTtcbn1cbmZ1bmN0aW9uIG1pZGlOb3RlcyhtaWRpX2lkLCBjb2x1bW4pIHtcbiAgICB2YXIgX2E7XG4gICAgaWYgKGNvbHVtbiA8IDApXG4gICAgICAgIHJldHVybjtcbiAgICB2YXIgY3VycmVudF9ub3RlcyA9IFtdO1xuICAgIChfYSA9IHJ1bnRpbWVfaW5mb18xLmdldF9taWRpTXVzaWNzKClcbiAgICAgICAgLmdldChtaWRpX2lkKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm1pZGlNYW8uZ2V0X3Byb19taWRpKCkudHJhY2tzLmZvckVhY2goZnVuY3Rpb24gKHRyYWNrKSB7XG4gICAgICAgIHZhciBub3RlID0gdHJhY2subm90ZXNbY29sdW1uXTtcbiAgICAgICAgbm90ZSAmJiBjdXJyZW50X25vdGVzLnB1c2gobm90ZS5uYW1lKTtcbiAgICB9KTtcbiAgICByZXR1cm4gY3VycmVudF9ub3Rlcztcbn1cbmZ1bmN0aW9uIG1pZGlCZWF0cyhtaWRpX2lkKSB7XG4gICAgdmFyIF9hO1xuICAgIHZhciBpbmZvID0gKF9hID0gcnVudGltZV9pbmZvXzEuZ2V0X21pZGlNdXNpY3MoKS5nZXQobWlkaV9pZCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5taWRpTWFvLmdldF9taWRpX2luZm8oKTtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChpbmZvLmJwbSAqIGluZm8ucGxheWJhY2tfcmF0ZSk7XG59XG5mdW5jdGlvbiBtaWRpUmVzZXQoKSB7XG4gICAgcnVudGltZV9pbmZvXzEuZ2V0X21pZGlNdXNpY3MoKS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YWx1ZS5taWRpTWFvLnNldF9wbGF5YmFja19yYXRlKDEpO1xuICAgIH0pO1xufVxuZXhwb3J0cy5taWRpUGxheWVyID0ge1xuICAgIG1pZGlQbGF5OiBtaWRpUGxheSxcbiAgICBtaWRpU3RvcDogbWlkaVN0b3AsXG4gICAgbWlkaVNldEluc3RydW1lbnQ6IG1pZGlTZXRJbnN0cnVtZW50LFxuICAgIG1pZGlTZXRHbG9iYWxTcGVlZDogbWlkaVNldEdsb2JhbFNwZWVkLFxuICAgIG1pZGlQbGF5Tm90ZXM6IG1pZGlQbGF5Tm90ZXMsXG4gICAgbWlkaU5vdGVzOiBtaWRpTm90ZXMsXG4gICAgbWlkaUJlYXRzOiBtaWRpQmVhdHMsXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldF9taWRpTXVzaWNzID0gZXhwb3J0cy5nZXRfbWlkaV9pbmZvID0gZXhwb3J0cy5pbmplY3RfcnVudGltZV9kYXRhID0gdm9pZCAwO1xudmFyIG1pZGltYW9fMSA9IHJlcXVpcmUoXCJAY21hby9taWRpbWFvXCIpO1xudmFyIGRhdGE7XG52YXIgbWlkaU11c2ljcyA9IG5ldyBNYXAoKTtcbmZ1bmN0aW9uIGluamVjdF9ydW50aW1lX2RhdGEoX2RhdGEpIHtcbiAgICBtaWRpTXVzaWNzID0gbmV3IE1hcCgpO1xuICAgIGRhdGEgPSBfZGF0YTtcbiAgICBmb3IgKHZhciBfaSA9IDAsIF9kYXRhXzEgPSBfZGF0YTsgX2kgPCBfZGF0YV8xLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YXIgdmFsdWUgPSBfZGF0YV8xW19pXTtcbiAgICAgICAgdmFyIG5hbWVfMSA9IHZhbHVlWzBdLCBpZCA9IHZhbHVlWzFdLCBtaWRpRGF0YSA9IHZhbHVlWzJdLCB2b2wgPSB2YWx1ZVszXTtcbiAgICAgICAgdmFyIG1pZGlNYW8gPSBuZXcgbWlkaW1hb18xLk1pZGlNYW8obWlkaURhdGEsIHtcbiAgICAgICAgICAgIGRhdGE6IG1pZGltYW9fMS5NaWRpTWFvLmdldF9vYmIobWlkaURhdGEub2JiKSxcbiAgICAgICAgICAgIG5hbWU6IG1pZGlEYXRhLm9iYixcbiAgICAgICAgfSkuc2V0X3ZvbHVtZSh2b2wgIT09IG51bGwgJiYgdm9sICE9PSB2b2lkIDAgPyB2b2wgOiAxMDApO1xuICAgICAgICB2YXIgbWlkaU11c2ljID0ge1xuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgbmFtZTogbmFtZV8xLFxuICAgICAgICAgICAgbWlkaU1hbzogbWlkaU1hbyxcbiAgICAgICAgfTtcbiAgICAgICAgbWlkaU11c2ljcy5zZXQoaWQsIG1pZGlNdXNpYyk7XG4gICAgfVxufVxuZXhwb3J0cy5pbmplY3RfcnVudGltZV9kYXRhID0gaW5qZWN0X3J1bnRpbWVfZGF0YTtcbmZ1bmN0aW9uIGdldF9taWRpX2luZm8oKSB7XG4gICAgcmV0dXJuIGRhdGE7XG59XG5leHBvcnRzLmdldF9taWRpX2luZm8gPSBnZXRfbWlkaV9pbmZvO1xuZnVuY3Rpb24gZ2V0X21pZGlNdXNpY3MoKSB7XG4gICAgcmV0dXJuIG1pZGlNdXNpY3M7XG59XG5leHBvcnRzLmdldF9taWRpTXVzaWNzID0gZ2V0X21pZGlNdXNpY3M7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDalJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0EiLCJzb3VyY2VSb290IjoiIn0=