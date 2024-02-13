(this["webpackJsonp"] = this["webpackJsonp"] || []).push([[14],{

/***/ "./node_modules/@crc/stage/build/core/physics/debug_draw.js":
/*!******************************************************************!*\
  !*** ./node_modules/@crc/stage/build/core/physics/debug_draw.js ***!
  \******************************************************************/
/*! exports provided: DebugDraw */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DebugDraw", function() { return DebugDraw; });
/* harmony import */ var _crc_box2d__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @crc/box2d */ "./node_modules/@crc/box2d/build/index.js");
/* harmony import */ var _di_interfaces_physics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../di/interfaces/physics */ "./node_modules/@crc/stage/build/core/di/interfaces/physics.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./node_modules/@crc/stage/build/core/physics/utils.js");



class DebugDraw extends _crc_box2d__WEBPACK_IMPORTED_MODULE_0__["Draw"] {
    constructor(canvas) {
        super();
        this.m_ctx = null;
        this.half_width = 310;
        this.half_height = 450;
        this.m_ctx = canvas.getContext('2d');
        this.half_width = canvas.width / 2;
        this.half_height = canvas.height / 2;
    }
    set_world(world) {
        this.world = world;
    }
    PushTransform(xf) {
        const ctx = this.m_ctx;
        if (ctx) {
            ctx.save();
            ctx.translate(Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(xf.p.x) + this.half_width, Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(xf.p.y) + this.half_height);
            ctx.rotate(xf.q.GetAngle());
        }
    }
    PopTransform(xf) {
        const ctx = this.m_ctx;
        if (ctx) {
            ctx.restore();
        }
    }
    DrawPolygon(vertices, vertexCount, color) {
        const ctx = this.m_ctx;
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(vertices[0].x), Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(vertices[0].y));
            for (let i = 1; i < vertexCount; i++) {
                ctx.lineTo(Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(vertices[i].x), Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(vertices[i].y));
            }
            ctx.closePath();
            ctx.strokeStyle = color.MakeStyleString(1);
            ctx.stroke();
        }
    }
    DrawSolidPolygon(vertices, vertexCount, color) {
        // 红色看不清，随手改改
        if (color.r === 0.9) {
            color.SetRGB(0.9, 0.9, 0.9);
        }
        const ctx = this.m_ctx;
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(vertices[0].x), Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(vertices[0].y));
            for (let i = 1; i < vertexCount; i++) {
                ctx.lineTo(Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(vertices[i].x), Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(vertices[i].y));
            }
            ctx.closePath();
            ctx.fillStyle = color.MakeStyleString(0.1);
            ctx.fill();
            ctx.strokeStyle = color.MakeStyleString(1);
            ctx.stroke();
        }
    }
    DrawCircle(center, radius, color) {
        const ctx = this.m_ctx;
        if (ctx) {
            ctx.beginPath();
            ctx.arc(Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(center.x), Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(center.y), radius, 0, _crc_box2d__WEBPACK_IMPORTED_MODULE_0__["pi"] * 2, true);
            ctx.strokeStyle = color.MakeStyleString(1);
            ctx.stroke();
        }
    }
    DrawSolidCircle(center, radius, axis, color) {
        const ctx = this.m_ctx;
        if (ctx) {
            const cx = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(center.x);
            const cy = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(center.y);
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, _crc_box2d__WEBPACK_IMPORTED_MODULE_0__["pi"] * 2, true);
            ctx.moveTo(cx, cy);
            ctx.lineTo((cx + axis.x * radius), (cy + axis.y * radius));
            ctx.fillStyle = color.MakeStyleString(0.5);
            ctx.fill();
            ctx.strokeStyle = color.MakeStyleString(1);
            ctx.stroke();
        }
    }
    // #if B2_ENABLE_PARTICLE
    DrawParticles(centers, radius, colors, count) {
        if (!this.m_ctx)
            return;
        for (let i = 0; i < count; ++i) {
            const center = centers[i];
            const color = (colors === null || colors === void 0 ? void 0 : colors[i]) || new _crc_box2d__WEBPACK_IMPORTED_MODULE_0__["Color"](255, 255, 255, 0.5);
            this.m_ctx.fillStyle = color.MakeStyleString();
            this.m_ctx.beginPath();
            this.m_ctx.arc(Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(center.x), Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(center.y), Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(radius), 0, _crc_box2d__WEBPACK_IMPORTED_MODULE_0__["pi"] * 2, true);
            this.m_ctx.fill();
        }
    }
    DrawParticleTriads(centers, triangles) {
        var _a;
        if (!this.m_ctx)
            return;
        if ((_a = this.world) === null || _a === void 0 ? void 0 : _a.body_list) {
            triangles = [];
            this.world.body_list.forEach((b) => {
                var _a;
                const p_body = b.get_current_physics_body();
                if (p_body.type !== _di_interfaces_physics__WEBPACK_IMPORTED_MODULE_1__["PhysicsBodyTypes"].ELASTIC) {
                    return;
                }
                const first_idx = p_body.particle_group.m_firstIndex;
                (_a = p_body.soft_filter) === null || _a === void 0 ? void 0 : _a.triangle_top_points.forEach((t) => {
                    triangles.push([t[0] + first_idx, t[1] + first_idx, t[2] + first_idx]);
                });
            });
        }
        for (let i = 0; i < triangles.length; i++) {
            const [a, b, c] = triangles[i];
            const pa = centers[a];
            const pb = centers[b];
            const pc = centers[c];
            if (!pa || !pb || !pc) {
                console.error('Invalid triangle: ', triangles[i]);
                continue;
            }
            this.m_ctx.fillStyle = 'rgba(0,0,0,0.5)';
            this.m_ctx.beginPath();
            this.m_ctx.moveTo(Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(pa.x), Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(pa.y));
            this.m_ctx.lineTo(Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(pb.x), Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(pb.y));
            this.m_ctx.lineTo(Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(pc.x), Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(pc.y));
            this.m_ctx.closePath();
            this.m_ctx.stroke();
        }
    }
    // #endif
    DrawSegment(p1, p2, color) {
        const ctx = this.m_ctx;
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(p1.x), Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(p1.y));
            ctx.lineTo(Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(p2.x), Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(p2.y));
            ctx.strokeStyle = color.MakeStyleString(1);
            ctx.stroke();
        }
    }
    DrawTransform(xf) {
        const ctx = this.m_ctx;
        if (ctx) {
            this.PushTransform(xf);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(1, 0);
            ctx.strokeStyle = _crc_box2d__WEBPACK_IMPORTED_MODULE_0__["Color"].RED.MakeStyleString(1);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 1);
            ctx.strokeStyle = _crc_box2d__WEBPACK_IMPORTED_MODULE_0__["Color"].GREEN.MakeStyleString(1);
            ctx.stroke();
            this.PopTransform(xf);
        }
    }
    DrawPoint(p, size, color) {
        const ctx = this.m_ctx;
        if (ctx) {
            ctx.fillStyle = color.MakeStyleString();
            const hsize = size / 2;
            ctx.fillRect(p.x - hsize, p.y - hsize, size, size);
        }
    }
    DrawString(x, y, message) {
        const ctx = this.m_ctx;
        if (ctx) {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.font = '15px DroidSans';
            const color = DebugDraw.DrawString_s_color;
            ctx.fillStyle = color.MakeStyleString();
            ctx.fillText(message, Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(x), Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(y));
            ctx.restore();
        }
    }
    DrawStringWorld(x, y, message) {
        const ctx = this.m_ctx;
        if (ctx) {
            const p = DebugDraw.DrawStringWorld_s_p.Set(x, y);
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.font = '15px DroidSans';
            const color = DebugDraw.DrawStringWorld_s_color;
            ctx.fillStyle = color.MakeStyleString();
            ctx.fillText(message, p.x, p.y);
            ctx.restore();
        }
    }
    DrawAABB(aabb, color) {
        const ctx = this.m_ctx;
        if (ctx) {
            ctx.strokeStyle = color.MakeStyleString();
            const x = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(aabb.lowerBound.x);
            const y = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(aabb.lowerBound.y);
            const w = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(aabb.upperBound.x - aabb.lowerBound.x);
            const h = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["convert_meter_to_pixel"])(aabb.upperBound.y - aabb.lowerBound.y);
            ctx.strokeRect(x, y, w, h);
        }
    }
}
DebugDraw.DrawString_s_color = new _crc_box2d__WEBPACK_IMPORTED_MODULE_0__["Color"](0.9, 0.6, 0.6);
DebugDraw.DrawStringWorld_s_p = new _crc_box2d__WEBPACK_IMPORTED_MODULE_0__["Vec2"]();
DebugDraw.DrawStringWorld_s_color = new _crc_box2d__WEBPACK_IMPORTED_MODULE_0__["Color"](0.5, 0.9, 0.5);
//# sourceMappingURL=debug_draw.js.map

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTQuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGNyYy9zdGFnZS9idWlsZC9jb3JlL3BoeXNpY3MvZGVidWdfZHJhdy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEcmF3LCBWZWMyLCBDb2xvciwgcGkgfSBmcm9tICdAY3JjL2JveDJkJztcbmltcG9ydCB7IFBoeXNpY3NCb2R5VHlwZXMgfSBmcm9tICcuLi9kaS9pbnRlcmZhY2VzL3BoeXNpY3MnO1xuaW1wb3J0IHsgY29udmVydF9tZXRlcl90b19waXhlbCB9IGZyb20gJy4vdXRpbHMnO1xuZXhwb3J0IGNsYXNzIERlYnVnRHJhdyBleHRlbmRzIERyYXcge1xuICAgIGNvbnN0cnVjdG9yKGNhbnZhcykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm1fY3R4ID0gbnVsbDtcbiAgICAgICAgdGhpcy5oYWxmX3dpZHRoID0gMzEwO1xuICAgICAgICB0aGlzLmhhbGZfaGVpZ2h0ID0gNDUwO1xuICAgICAgICB0aGlzLm1fY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIHRoaXMuaGFsZl93aWR0aCA9IGNhbnZhcy53aWR0aCAvIDI7XG4gICAgICAgIHRoaXMuaGFsZl9oZWlnaHQgPSBjYW52YXMuaGVpZ2h0IC8gMjtcbiAgICB9XG4gICAgc2V0X3dvcmxkKHdvcmxkKSB7XG4gICAgICAgIHRoaXMud29ybGQgPSB3b3JsZDtcbiAgICB9XG4gICAgUHVzaFRyYW5zZm9ybSh4Zikge1xuICAgICAgICBjb25zdCBjdHggPSB0aGlzLm1fY3R4O1xuICAgICAgICBpZiAoY3R4KSB7XG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZShjb252ZXJ0X21ldGVyX3RvX3BpeGVsKHhmLnAueCkgKyB0aGlzLmhhbGZfd2lkdGgsIGNvbnZlcnRfbWV0ZXJfdG9fcGl4ZWwoeGYucC55KSArIHRoaXMuaGFsZl9oZWlnaHQpO1xuICAgICAgICAgICAgY3R4LnJvdGF0ZSh4Zi5xLkdldEFuZ2xlKCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFBvcFRyYW5zZm9ybSh4Zikge1xuICAgICAgICBjb25zdCBjdHggPSB0aGlzLm1fY3R4O1xuICAgICAgICBpZiAoY3R4KSB7XG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIERyYXdQb2x5Z29uKHZlcnRpY2VzLCB2ZXJ0ZXhDb3VudCwgY29sb3IpIHtcbiAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5tX2N0eDtcbiAgICAgICAgaWYgKGN0eCkge1xuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY3R4Lm1vdmVUbyhjb252ZXJ0X21ldGVyX3RvX3BpeGVsKHZlcnRpY2VzWzBdLngpLCBjb252ZXJ0X21ldGVyX3RvX3BpeGVsKHZlcnRpY2VzWzBdLnkpKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdmVydGV4Q291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oY29udmVydF9tZXRlcl90b19waXhlbCh2ZXJ0aWNlc1tpXS54KSwgY29udmVydF9tZXRlcl90b19waXhlbCh2ZXJ0aWNlc1tpXS55KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvci5NYWtlU3R5bGVTdHJpbmcoMSk7XG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgRHJhd1NvbGlkUG9seWdvbih2ZXJ0aWNlcywgdmVydGV4Q291bnQsIGNvbG9yKSB7XG4gICAgICAgIC8vIOe6ouiJsueci+S4jea4he+8jOmaj+aJi+aUueaUuVxuICAgICAgICBpZiAoY29sb3IuciA9PT0gMC45KSB7XG4gICAgICAgICAgICBjb2xvci5TZXRSR0IoMC45LCAwLjksIDAuOSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5tX2N0eDtcbiAgICAgICAgaWYgKGN0eCkge1xuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY3R4Lm1vdmVUbyhjb252ZXJ0X21ldGVyX3RvX3BpeGVsKHZlcnRpY2VzWzBdLngpLCBjb252ZXJ0X21ldGVyX3RvX3BpeGVsKHZlcnRpY2VzWzBdLnkpKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdmVydGV4Q291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oY29udmVydF9tZXRlcl90b19waXhlbCh2ZXJ0aWNlc1tpXS54KSwgY29udmVydF9tZXRlcl90b19waXhlbCh2ZXJ0aWNlc1tpXS55KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gY29sb3IuTWFrZVN0eWxlU3RyaW5nKDAuMSk7XG4gICAgICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gY29sb3IuTWFrZVN0eWxlU3RyaW5nKDEpO1xuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIERyYXdDaXJjbGUoY2VudGVyLCByYWRpdXMsIGNvbG9yKSB7XG4gICAgICAgIGNvbnN0IGN0eCA9IHRoaXMubV9jdHg7XG4gICAgICAgIGlmIChjdHgpIHtcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGN0eC5hcmMoY29udmVydF9tZXRlcl90b19waXhlbChjZW50ZXIueCksIGNvbnZlcnRfbWV0ZXJfdG9fcGl4ZWwoY2VudGVyLnkpLCByYWRpdXMsIDAsIHBpICogMiwgdHJ1ZSk7XG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvci5NYWtlU3R5bGVTdHJpbmcoMSk7XG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgRHJhd1NvbGlkQ2lyY2xlKGNlbnRlciwgcmFkaXVzLCBheGlzLCBjb2xvcikge1xuICAgICAgICBjb25zdCBjdHggPSB0aGlzLm1fY3R4O1xuICAgICAgICBpZiAoY3R4KSB7XG4gICAgICAgICAgICBjb25zdCBjeCA9IGNvbnZlcnRfbWV0ZXJfdG9fcGl4ZWwoY2VudGVyLngpO1xuICAgICAgICAgICAgY29uc3QgY3kgPSBjb252ZXJ0X21ldGVyX3RvX3BpeGVsKGNlbnRlci55KTtcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGN0eC5hcmMoY3gsIGN5LCByYWRpdXMsIDAsIHBpICogMiwgdHJ1ZSk7XG4gICAgICAgICAgICBjdHgubW92ZVRvKGN4LCBjeSk7XG4gICAgICAgICAgICBjdHgubGluZVRvKChjeCArIGF4aXMueCAqIHJhZGl1cyksIChjeSArIGF4aXMueSAqIHJhZGl1cykpO1xuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yLk1ha2VTdHlsZVN0cmluZygwLjUpO1xuICAgICAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yLk1ha2VTdHlsZVN0cmluZygxKTtcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyAjaWYgQjJfRU5BQkxFX1BBUlRJQ0xFXG4gICAgRHJhd1BhcnRpY2xlcyhjZW50ZXJzLCByYWRpdXMsIGNvbG9ycywgY291bnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLm1fY3R4KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IGNlbnRlciA9IGNlbnRlcnNbaV07XG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IChjb2xvcnMgPT09IG51bGwgfHwgY29sb3JzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjb2xvcnNbaV0pIHx8IG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1LCAwLjUpO1xuICAgICAgICAgICAgdGhpcy5tX2N0eC5maWxsU3R5bGUgPSBjb2xvci5NYWtlU3R5bGVTdHJpbmcoKTtcbiAgICAgICAgICAgIHRoaXMubV9jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICB0aGlzLm1fY3R4LmFyYyhjb252ZXJ0X21ldGVyX3RvX3BpeGVsKGNlbnRlci54KSwgY29udmVydF9tZXRlcl90b19waXhlbChjZW50ZXIueSksIGNvbnZlcnRfbWV0ZXJfdG9fcGl4ZWwocmFkaXVzKSwgMCwgcGkgKiAyLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMubV9jdHguZmlsbCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIERyYXdQYXJ0aWNsZVRyaWFkcyhjZW50ZXJzLCB0cmlhbmdsZXMpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAoIXRoaXMubV9jdHgpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmICgoX2EgPSB0aGlzLndvcmxkKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuYm9keV9saXN0KSB7XG4gICAgICAgICAgICB0cmlhbmdsZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYm9keV9saXN0LmZvckVhY2goKGIpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgY29uc3QgcF9ib2R5ID0gYi5nZXRfY3VycmVudF9waHlzaWNzX2JvZHkoKTtcbiAgICAgICAgICAgICAgICBpZiAocF9ib2R5LnR5cGUgIT09IFBoeXNpY3NCb2R5VHlwZXMuRUxBU1RJQykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0X2lkeCA9IHBfYm9keS5wYXJ0aWNsZV9ncm91cC5tX2ZpcnN0SW5kZXg7XG4gICAgICAgICAgICAgICAgKF9hID0gcF9ib2R5LnNvZnRfZmlsdGVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EudHJpYW5nbGVfdG9wX3BvaW50cy5mb3JFYWNoKCh0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyaWFuZ2xlcy5wdXNoKFt0WzBdICsgZmlyc3RfaWR4LCB0WzFdICsgZmlyc3RfaWR4LCB0WzJdICsgZmlyc3RfaWR4XSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyaWFuZ2xlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgW2EsIGIsIGNdID0gdHJpYW5nbGVzW2ldO1xuICAgICAgICAgICAgY29uc3QgcGEgPSBjZW50ZXJzW2FdO1xuICAgICAgICAgICAgY29uc3QgcGIgPSBjZW50ZXJzW2JdO1xuICAgICAgICAgICAgY29uc3QgcGMgPSBjZW50ZXJzW2NdO1xuICAgICAgICAgICAgaWYgKCFwYSB8fCAhcGIgfHwgIXBjKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignSW52YWxpZCB0cmlhbmdsZTogJywgdHJpYW5nbGVzW2ldKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubV9jdHguZmlsbFN0eWxlID0gJ3JnYmEoMCwwLDAsMC41KSc7XG4gICAgICAgICAgICB0aGlzLm1fY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgdGhpcy5tX2N0eC5tb3ZlVG8oY29udmVydF9tZXRlcl90b19waXhlbChwYS54KSwgY29udmVydF9tZXRlcl90b19waXhlbChwYS55KSk7XG4gICAgICAgICAgICB0aGlzLm1fY3R4LmxpbmVUbyhjb252ZXJ0X21ldGVyX3RvX3BpeGVsKHBiLngpLCBjb252ZXJ0X21ldGVyX3RvX3BpeGVsKHBiLnkpKTtcbiAgICAgICAgICAgIHRoaXMubV9jdHgubGluZVRvKGNvbnZlcnRfbWV0ZXJfdG9fcGl4ZWwocGMueCksIGNvbnZlcnRfbWV0ZXJfdG9fcGl4ZWwocGMueSkpO1xuICAgICAgICAgICAgdGhpcy5tX2N0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgICAgIHRoaXMubV9jdHguc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gI2VuZGlmXG4gICAgRHJhd1NlZ21lbnQocDEsIHAyLCBjb2xvcikge1xuICAgICAgICBjb25zdCBjdHggPSB0aGlzLm1fY3R4O1xuICAgICAgICBpZiAoY3R4KSB7XG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjdHgubW92ZVRvKGNvbnZlcnRfbWV0ZXJfdG9fcGl4ZWwocDEueCksIGNvbnZlcnRfbWV0ZXJfdG9fcGl4ZWwocDEueSkpO1xuICAgICAgICAgICAgY3R4LmxpbmVUbyhjb252ZXJ0X21ldGVyX3RvX3BpeGVsKHAyLngpLCBjb252ZXJ0X21ldGVyX3RvX3BpeGVsKHAyLnkpKTtcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yLk1ha2VTdHlsZVN0cmluZygxKTtcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBEcmF3VHJhbnNmb3JtKHhmKSB7XG4gICAgICAgIGNvbnN0IGN0eCA9IHRoaXMubV9jdHg7XG4gICAgICAgIGlmIChjdHgpIHtcbiAgICAgICAgICAgIHRoaXMuUHVzaFRyYW5zZm9ybSh4Zik7XG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjdHgubW92ZVRvKDAsIDApO1xuICAgICAgICAgICAgY3R4LmxpbmVUbygxLCAwKTtcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IENvbG9yLlJFRC5NYWtlU3R5bGVTdHJpbmcoMSk7XG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjdHgubW92ZVRvKDAsIDApO1xuICAgICAgICAgICAgY3R4LmxpbmVUbygwLCAxKTtcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IENvbG9yLkdSRUVOLk1ha2VTdHlsZVN0cmluZygxKTtcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgIHRoaXMuUG9wVHJhbnNmb3JtKHhmKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBEcmF3UG9pbnQocCwgc2l6ZSwgY29sb3IpIHtcbiAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5tX2N0eDtcbiAgICAgICAgaWYgKGN0eCkge1xuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yLk1ha2VTdHlsZVN0cmluZygpO1xuICAgICAgICAgICAgY29uc3QgaHNpemUgPSBzaXplIC8gMjtcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdChwLnggLSBoc2l6ZSwgcC55IC0gaHNpemUsIHNpemUsIHNpemUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIERyYXdTdHJpbmcoeCwgeSwgbWVzc2FnZSkge1xuICAgICAgICBjb25zdCBjdHggPSB0aGlzLm1fY3R4O1xuICAgICAgICBpZiAoY3R4KSB7XG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTtcbiAgICAgICAgICAgIGN0eC5mb250ID0gJzE1cHggRHJvaWRTYW5zJztcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gRGVidWdEcmF3LkRyYXdTdHJpbmdfc19jb2xvcjtcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvci5NYWtlU3R5bGVTdHJpbmcoKTtcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChtZXNzYWdlLCBjb252ZXJ0X21ldGVyX3RvX3BpeGVsKHgpLCBjb252ZXJ0X21ldGVyX3RvX3BpeGVsKHkpKTtcbiAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgRHJhd1N0cmluZ1dvcmxkKHgsIHksIG1lc3NhZ2UpIHtcbiAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5tX2N0eDtcbiAgICAgICAgaWYgKGN0eCkge1xuICAgICAgICAgICAgY29uc3QgcCA9IERlYnVnRHJhdy5EcmF3U3RyaW5nV29ybGRfc19wLlNldCh4LCB5KTtcbiAgICAgICAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDAsIDApO1xuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTVweCBEcm9pZFNhbnMnO1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBEZWJ1Z0RyYXcuRHJhd1N0cmluZ1dvcmxkX3NfY29sb3I7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gY29sb3IuTWFrZVN0eWxlU3RyaW5nKCk7XG4gICAgICAgICAgICBjdHguZmlsbFRleHQobWVzc2FnZSwgcC54LCBwLnkpO1xuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBEcmF3QUFCQihhYWJiLCBjb2xvcikge1xuICAgICAgICBjb25zdCBjdHggPSB0aGlzLm1fY3R4O1xuICAgICAgICBpZiAoY3R4KSB7XG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvci5NYWtlU3R5bGVTdHJpbmcoKTtcbiAgICAgICAgICAgIGNvbnN0IHggPSBjb252ZXJ0X21ldGVyX3RvX3BpeGVsKGFhYmIubG93ZXJCb3VuZC54KTtcbiAgICAgICAgICAgIGNvbnN0IHkgPSBjb252ZXJ0X21ldGVyX3RvX3BpeGVsKGFhYmIubG93ZXJCb3VuZC55KTtcbiAgICAgICAgICAgIGNvbnN0IHcgPSBjb252ZXJ0X21ldGVyX3RvX3BpeGVsKGFhYmIudXBwZXJCb3VuZC54IC0gYWFiYi5sb3dlckJvdW5kLngpO1xuICAgICAgICAgICAgY29uc3QgaCA9IGNvbnZlcnRfbWV0ZXJfdG9fcGl4ZWwoYWFiYi51cHBlckJvdW5kLnkgLSBhYWJiLmxvd2VyQm91bmQueSk7XG4gICAgICAgICAgICBjdHguc3Ryb2tlUmVjdCh4LCB5LCB3LCBoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbkRlYnVnRHJhdy5EcmF3U3RyaW5nX3NfY29sb3IgPSBuZXcgQ29sb3IoMC45LCAwLjYsIDAuNik7XG5EZWJ1Z0RyYXcuRHJhd1N0cmluZ1dvcmxkX3NfcCA9IG5ldyBWZWMyKCk7XG5EZWJ1Z0RyYXcuRHJhd1N0cmluZ1dvcmxkX3NfY29sb3IgPSBuZXcgQ29sb3IoMC41LCAwLjksIDAuNSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kZWJ1Z19kcmF3LmpzLm1hcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0EiLCJzb3VyY2VSb290IjoiIn0=