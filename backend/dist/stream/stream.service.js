"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const crypto = __importStar(require("crypto"));
const typeorm_2 = require("typeorm");
const streaming_session_entity_1 = require("./streaming-session.entity");
let StreamService = class StreamService {
    sessionsRepo;
    config;
    constructor(sessionsRepo, config) {
        this.sessionsRepo = sessionsRepo;
        this.config = config;
    }
    async createSession(params) {
        const token = crypto.randomBytes(32).toString('hex');
        const sessionTokenHash = this.hashToken(token);
        const expiresAt = new Date(Date.now() + params.ttlSeconds * 1000);
        const session = this.sessionsRepo.create({
            userId: params.userId,
            movieId: params.movieId,
            sessionTokenHash,
            ip: params.ip,
            userAgent: params.userAgent,
            expiresAt,
        });
        await this.sessionsRepo.save(session);
        return { token, expiresAt };
    }
    async assertValidToken(token, movieId) {
        const sessionTokenHash = this.hashToken(token);
        const session = await this.sessionsRepo.findOne({
            where: { sessionTokenHash, movieId },
        });
        if (!session)
            throw new common_1.UnauthorizedException('Invalid token');
        if (new Date(session.expiresAt).getTime() < Date.now()) {
            throw new common_1.UnauthorizedException('Token expired');
        }
        return session;
    }
    buildPlaybackUrl(movieId, quality, token) {
        const base = this.config.get('STREAM_BASE_URL', 'http://localhost:4000');
        return `${base}/hls/${encodeURIComponent(movieId)}/${encodeURIComponent(quality)}/index.m3u8?token=${encodeURIComponent(token)}`;
    }
    hashToken(token) {
        const secret = this.config.get('STREAM_TOKEN_SECRET', 'change-me');
        return crypto
            .createHash('sha256')
            .update(`${token}.${secret}`)
            .digest('hex');
    }
};
exports.StreamService = StreamService;
exports.StreamService = StreamService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(streaming_session_entity_1.StreamingSession)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], StreamService);
//# sourceMappingURL=stream.service.js.map