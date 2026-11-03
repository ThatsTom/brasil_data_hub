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
import { Controller, Get, Param } from '@nestjs/common';
import { CnpjService } from './cnpj.service.js';
let CnpjController = class CnpjController {
    cnpjService;
    constructor(cnpjService) {
        this.cnpjService = cnpjService;
    }
    consultar(cnpj) {
        return this.cnpjService.consultar(cnpj);
    }
};
__decorate([
    Get(':cnpj'),
    __param(0, Param('cnpj')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CnpjController.prototype, "consultar", null);
CnpjController = __decorate([
    Controller('api/v1/cnpj'),
    __metadata("design:paramtypes", [CnpjService])
], CnpjController);
export { CnpjController };
//# sourceMappingURL=cnpj.controller.js.map