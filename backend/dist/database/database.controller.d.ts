import { PrismaService } from './prisma.service.js';
export declare class DatabaseController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    checkDatabase(): Promise<{
        status: string;
        database: string;
        totalConsultas: number;
    }>;
}
