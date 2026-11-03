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
import { Controller, Get, Query, UsePipes, ValidationPipe, } from '@nestjs/common';
import { ConsultasService } from './consultas.service.js';
import { ListarConsultasDto } from './dto/listar-consultas.dto.js';
let ConsultasController = class ConsultasController {
    consultasService;
    constructor(consultasService) {
        this.consultasService = consultasService;
    }
    listar(filtros) {
        return this.consultasService.listar(filtros);
    }
};
__decorate([
    Get(),
    UsePipes(new ValidationPipe({
        transform: true,
        whitelist: true,
    })),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ListarConsultasDto]),
    __metadata("design:returntype", void 0)
], ConsultasController.prototype, "listar", null);
ConsultasController = __decorate([
    Controller('api/v1/consultas'),
    __metadata("design:paramtypes", [ConsultasService])
], ConsultasController);
export { ConsultasController };
//# sourceMappingURL=consultas.controller.js.map