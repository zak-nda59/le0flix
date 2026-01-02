"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const movies_module_1 = require("../movies/movies.module");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const stream_controller_1 = require("./stream.controller");
const streaming_session_entity_1 = require("./streaming-session.entity");
const stream_service_1 = require("./stream.service");
let StreamModule = class StreamModule {
};
exports.StreamModule = StreamModule;
exports.StreamModule = StreamModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([streaming_session_entity_1.StreamingSession]), movies_module_1.MoviesModule],
        controllers: [stream_controller_1.StreamController],
        providers: [stream_service_1.StreamService, jwt_auth_guard_1.JwtAuthGuard],
    })
], StreamModule);
//# sourceMappingURL=stream.module.js.map