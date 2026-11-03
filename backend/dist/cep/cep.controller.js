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
import { CepService } from './cep.service.js';
let CepController = class CepController {
    cepService;
    constructor(cepService) {
        this.cepService = cepService;
    }
    consultar(cep) {
        return this.cepService.consultar(cep);
    }
};
__decorate([
    Get(':cep'),
    __param(0, Param('cep')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CepController.prototype, "consultar", null);
CepController = __decorate([
    Controller('api/v1/cep'),
    __metadata("design:paramtypes", [CepService])
], CepController);
export { CepController };
//# sourceMappingURL=cep.controller.js.map