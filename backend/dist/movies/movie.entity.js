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
exports.Movie = void 0;
const typeorm_1 = require("typeorm");
const category_entity_1 = require("./category.entity");
let Movie = class Movie {
    id;
    title;
    synopsis;
    releaseYear;
    durationMinutes;
    maturityRating;
    thumbnailUrl;
    backdropUrl;
    hlsBasePath;
    isPublished;
    categories;
    createdAt;
    updatedAt;
};
exports.Movie = Movie;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], Movie.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Movie.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Movie.prototype, "synopsis", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', unsigned: true, name: 'release_year', nullable: true }),
    __metadata("design:type", Object)
], Movie.prototype, "releaseYear", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'smallint',
        unsigned: true,
        name: 'duration_minutes',
        nullable: true,
    }),
    __metadata("design:type", Object)
], Movie.prototype, "durationMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, name: 'maturity_rating', nullable: true }),
    __metadata("design:type", Object)
], Movie.prototype, "maturityRating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, name: 'thumbnail_url', nullable: true }),
    __metadata("design:type", Object)
], Movie.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, name: 'backdrop_url', nullable: true }),
    __metadata("design:type", Object)
], Movie.prototype, "backdropUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, name: 'hls_base_path' }),
    __metadata("design:type", String)
], Movie.prototype, "hlsBasePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', width: 1, name: 'is_published', default: 0 }),
    __metadata("design:type", Number)
], Movie.prototype, "isPublished", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => category_entity_1.Category, { eager: true }),
    (0, typeorm_1.JoinTable)({
        name: 'movie_categories',
        joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Movie.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime', name: 'created_at' }),
    __metadata("design:type", Date)
], Movie.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'datetime', name: 'updated_at' }),
    __metadata("design:type", Date)
], Movie.prototype, "updatedAt", void 0);
exports.Movie = Movie = __decorate([
    (0, typeorm_1.Entity)({ name: 'movies' })
], Movie);
//# sourceMappingURL=movie.entity.js.map