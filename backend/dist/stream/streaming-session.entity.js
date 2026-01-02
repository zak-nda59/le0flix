"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamingSession = void 0;
const typeorm_1 = require("typeorm");
let StreamingSession = class StreamingSession {
    id;
    userId;
    movieId;
    sessionTokenHash;
    ip;
    userAgent;
    expiresAt;
    createdAt;
};
exports.StreamingSession = StreamingSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], StreamingSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', unsigned: true, name: 'user_id' }),
    __metadata("design:type", String)
], StreamingSession.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', unsigned: true, name: 'movie_id' }),
    __metadata("design:type", String)
], StreamingSession.prototype, "movieId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'session_token_hash' }),
    __metadata("design:type", String)
], StreamingSession.prototype, "sessionTokenHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 45, nullable: true }),
    __metadata("design:type", Object)
], StreamingSession.prototype, "ip", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'user_agent', nullable: true }),
    __metadata("design:type", Object)
], StreamingSession.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', name: 'expires_at' }),
    __metadata("design:type", Date)
], StreamingSession.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime', name: 'created_at' }),
    __metadata("design:type", Date)
], StreamingSession.prototype, "createdAt", void 0);
exports.StreamingSession = StreamingSession = __decorate([
    (0, typeorm_1.Entity)({ name: 'streaming_sessions' })
], StreamingSession);
//# sourceMappingURL=streaming-session.entity.js.map