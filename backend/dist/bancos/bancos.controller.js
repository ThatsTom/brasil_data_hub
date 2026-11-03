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
import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Query, UsePipes, ValidationPipe, } from '@nestjs/common';
import { BancosService } from './bancos.service.js';
import { ListarBancosDto } from './dto/listar-bancos.dto.js';
let BancosController = class BancosController {
    bancosService;
    constructor(bancosService) {
        this.bancosService = bancosService;
    }
    listar(filtros) {
        return this.bancosService.listar(filtros);
    }
    pesquisar(filtros) {
        return this.bancosService.pesquisar(filtros);
    }
    obter(codigo) {
        return this.bancosService.obterPorCodigo(codigo);
    }
};
__decorate([
    Get(),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ListarBancosDto]),
    __metadata("design:returntype", Promise)
], BancosController.prototype, "listar", null);
__decorate([
    Post('pesquisar'),
    HttpCode(200),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ListarBancosDto]),
    __metadata("design:returntype", Promise)
], BancosController.prototype, "pesquisar", null);
__decorate([
    Get(':codigo'),
    __param(0, Param('codigo', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BancosController.prototype, "obter", null);
BancosController = __decorate([
    Controller('api/v1/bancos'),
    UsePipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    })),
    __metadata("design:paramtypes", [BancosService])
], BancosController);
export { BancosController };
//# sourceMappingURL=bancos.controller.js.map