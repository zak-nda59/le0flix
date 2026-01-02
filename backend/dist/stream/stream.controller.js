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
exports.StreamController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const movies_service_1 = require("../movies/movies.service");
const create_stream_session_dto_1 = require("./dto/create-stream-session.dto");
const stream_service_1 = require("./stream.service");
let StreamController = class StreamController {
    stream;
    movies;
    config;
    constructor(stream, movies, config) {
        this.stream = stream;
        this.movies = movies;
        this.config = config;
    }
    async createSession(req, body) {
        const user = req.user;
        const movie = await this.movies.getPublishedById(String(body.movieId));
        const ttl = Number(this.config.get('STREAM_SESSION_TTL_SECONDS', '300'));
        const { token, expiresAt } = await this.stream.createSession({
            userId: user.sub,
            movieId: String(movie.id),
            ip: req.ip ?? null,
            userAgent: req.headers['user-agent'] ?? null,
            ttlSeconds: Number.isFinite(ttl) ? ttl : 300,
        });
        const quality = body.quality ?? '1080p';
        return {
            playbackUrl: this.stream.buildPlaybackUrl(String(movie.id), quality, token),
            expiresAt,
        };
    }
    async serveHls(movieId, quality, file, token, res) {
        if (!token)
            return res.status(401).send('Missing token');
        await this.stream.assertValidToken(token, movieId);
        const rootDir = this.config.get('HLS_ROOT_DIR', '../hls');
        const absoluteRoot = path.resolve(process.cwd(), rootDir);
        if (file.includes('..') || file.includes('/') || file.includes('\\')) {
            return res.status(400).send('Invalid path');
        }
        const absoluteFile = path.resolve(absoluteRoot, movieId, quality, file);
        if (!fs.existsSync(absoluteFile) || !fs.statSync(absoluteFile).isFile()) {
            return res.status(404).send('Not found');
        }
        if (absoluteFile.endsWith('.m3u8')) {
            res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
            const raw = fs.readFileSync(absoluteFile, 'utf8');
            const rewritten = raw
                .split(/\r?\n/)
                .map((line) => {
                if (!line || line.startsWith('#'))
                    return line;
                if (line.includes('://'))
                    return line;
                if (line.includes('token='))
                    return line;
                const joiner = line.includes('?') ? '&' : '?';
                return `${line}${joiner}token=${encodeURIComponent(token)}`;
            })
                .join('\n');
            return res.send(rewritten);
        }
        if (absoluteFile.endsWith('.ts')) {
            res.setHeader('Content-Type', 'video/mp2t');
        }
        return fs.createReadStream(absoluteFile).pipe(res);
    }
};
exports.StreamController = StreamController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('stream/sessions'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_stream_session_dto_1.CreateStreamSessionDto]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "createSession", null);
__decorate([
    (0, common_1.Get)('hls/:movieId/:quality/:file'),
    __param(0, (0, common_1.Param)('movieId')),
    __param(1, (0, common_1.Param)('quality')),
    __param(2, (0, common_1.Param)('file')),
    __param(3, (0, common_1.Query)('token')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "serveHls", null);
exports.StreamController = StreamController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [stream_service_1.StreamService,
        movies_service_1.MoviesService,
        config_1.ConfigService])
], StreamController);
//# sourceMappingURL=stream.controller.js.map