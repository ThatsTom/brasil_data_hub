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
import { Controller, Get, HttpCode, Param, ParseIntPipe, Post, } from '@nestjs/common';
import { FeriadosService } from './feriados.service.js';
let FeriadosController = class FeriadosController {
    feriadosService;
    constructor(feriadosService) {
        this.feriadosService = feriadosService;
    }
    listar(ano) {
        return this.feriadosService.listar(ano);
    }
    consultar(ano) {
        return this.feriadosService.consultar(ano);
    }
};
__decorate([
    Get(':ano'),
    __param(0, Param('ano', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FeriadosController.prototype, "listar", null);
__decorate([
    Post(':ano/consultar'),
    HttpCode(200),
    __param(0, Param('ano', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FeriadosController.prototype, "consultar", null);
FeriadosController = __decorate([
    Controller('api/v1/feriados'),
    __metadata("design:paramtypes", [FeriadosService])
], FeriadosController);
export { FeriadosController };
//# sourceMappingURL=feriados.controller.js.map