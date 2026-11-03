var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Matches, MaxLength, } from 'class-validator';
export class DashboardFiltrosDto {
    periodo = 30;
    inicio;
    fim;
    tipo;
}
__decorate([
    IsOptional(),
    Type(() => Number),
    IsInt(),
    IsIn([7, 30, 90]),
    __metadata("design:type", Number)
], DashboardFiltrosDto.prototype, "periodo", void 0);
__decorate([
    IsOptional(),
    Matches(/^\d{4}-\d{2}-\d{2}$/),
    __metadata("design:type", String)
], DashboardFiltrosDto.prototype, "inicio", void 0);
__decorate([
    IsOptional(),
    Matches(/^\d{4}-\d{2}-\d{2}$/),
    __metadata("design:type", String)
], DashboardFiltrosDto.prototype, "fim", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(30),
    Matches(/^[A-Za-z_]+$/),
    __metadata("design:type", String)
], DashboardFiltrosDto.prototype, "tipo", void 0);
//# sourceMappingURL=dashboard-filtros.dto.js.map