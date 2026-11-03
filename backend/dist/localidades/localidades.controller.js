var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Get, HttpCode, Param, Post, Query, UsePipes, ValidationPipe, } from '@nestjs/common';
import { LocalidadesService } from './localidades.service.js';
import { ListarMunicipiosDto } from './dto/listar-municipios.dto.js';
let LocalidadesController = class LocalidadesController {
    localidadesService;
    constructor(localidadesService) {
        this.localidadesService = localidadesService;
    }
    listarEstados() {
        return this.localidadesService.listarEstados();
    }
    listarMunicipios(uf, filtros) {
        return this.localidadesService.listarMunicipios(uf, filtros);
    }
    pesquisarMunicipios(uf, filtros) {
        return this.localidadesService.pesquisarMunicipios(uf, filtros);
    }
};
__decorate([
    Get('estados'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LocalidadesController.prototype, "listarEstados", null);
__decorate([
    Get('estados/:uf/municipios'),
    __param(0, Param('uf')),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ListarMunicipiosDto]),
    __metadata("design:returntype", Promise)
], LocalidadesController.prototype, "listarMunicipios", null);
__decorate([
    Post('estados/:uf/municipios/pesquisar'),
    HttpCode(200),
    __param(0, Param('uf')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ListarMunicipiosDto]),
    __metadata("design:returntype", Promise)
], LocalidadesController.prototype, "pesquisarMunicipios", null);
LocalidadesController = __decorate([
    Controller('api/v1/localidades'),
    UsePipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    })),
    __metadata("design:paramtypes", [LocalidadesService])
], LocalidadesController);
export { LocalidadesController };
//# sourceMappingURL=localidades.controller.js.map