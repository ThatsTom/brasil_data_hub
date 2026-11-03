import * as runtime from "@prisma/client/runtime/client";
const config = {
    "previewFeatures": [],
    "clientVersion": "7.10.1",
    "engineVersion": "d1b3f377ca835d73fd50954a5e22128b9ebdd6b8",
    "activeProvider": "postgresql",
    "inlineSchema": "generator client {\n  provider = \"prisma-client\"\n  output   = \"../src/generated/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nmodel Consulta {\n  id       String   @id @default(cuid())\n  tipo     String\n  termo    String\n  status   String\n  fonte    String?\n  tempoMs  Int?\n  criadoEm DateTime @default(now())\n\n  @@index([tipo, criadoEm])\n  @@map(\"consultas\")\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    },
    "parameterizationSchema": {
        "strings": [],
        "graph": ""
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"Consulta\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"tipo\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"termo\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fonte\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"tempoMs\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"criadoEm\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"consultas\",\"schema\":null}},\"enums\":{},\"types\":{}}");
config.parameterizationSchema = {
    strings: JSON.parse("[\"where\",\"Consulta.findUnique\",\"Consulta.findUniqueOrThrow\",\"orderBy\",\"cursor\",\"Consulta.findFirst\",\"Consulta.findFirstOrThrow\",\"Consulta.findMany\",\"data\",\"Consulta.createOne\",\"Consulta.createMany\",\"Consulta.createManyAndReturn\",\"Consulta.updateOne\",\"Consulta.updateMany\",\"Consulta.updateManyAndReturn\",\"create\",\"update\",\"Consulta.upsertOne\",\"Consulta.deleteOne\",\"Consulta.deleteMany\",\"having\",\"_count\",\"_avg\",\"_sum\",\"_min\",\"_max\",\"Consulta.groupBy\",\"Consulta.aggregate\",\"AND\",\"OR\",\"NOT\",\"id\",\"tipo\",\"termo\",\"status\",\"fonte\",\"tempoMs\",\"criadoEm\",\"equals\",\"in\",\"notIn\",\"lt\",\"lte\",\"gt\",\"gte\",\"not\",\"contains\",\"startsWith\",\"endsWith\",\"set\",\"increment\",\"decrement\",\"multiply\",\"divide\"]"),
    graph: "NwsQChwAACkAMB0AAAQAEB4AACkAMB8BAAAAASABACoAISEBACoAISIBACoAISMBACsAISQCACwAISVAAC0AIQEAAAABACABAAAAAQAgChwAACkAMB0AAAQAEB4AACkAMB8BACoAISABACoAISEBACoAISIBACoAISMBACsAISQCACwAISVAAC0AIQIjAAAuACAkAAAuACADAAAABAAgAwAABQAwBAAAAQAgAwAAAAQAIAMAAAUAMAQAAAEAIAMAAAAEACADAAAFADAEAAABACAHHwEAAAABIAEAAAABIQEAAAABIgEAAAABIwEAAAABJAIAAAABJUAAAAABAQgAAAkAIAcfAQAAAAEgAQAAAAEhAQAAAAEiAQAAAAEjAQAAAAEkAgAAAAElQAAAAAEBCAAACwAwAQgAAAsAMAcfAQA0ACEgAQA0ACEhAQA0ACEiAQA0ACEjAQA1ACEkAgA2ACElQAA3ACECAAAAAQAgCAAADgAgBx8BADQAISABADQAISEBADQAISIBADQAISMBADUAISQCADYAISVAADcAIQIAAAAEACAIAAAQACACAAAABAAgCAAAEAAgAwAAAAEAIA8AAAkAIBAAAA4AIAEAAAABACABAAAABAAgBxUAAC8AIBYAADAAIBcAADMAIBgAADIAIBkAADEAICMAAC4AICQAAC4AIAocAAAaADAdAAAXABAeAAAaADAfAQAbACEgAQAbACEhAQAbACEiAQAbACEjAQAcACEkAgAdACElQAAeACEDAAAABAAgAwAAFgAwFAAAFwAgAwAAAAQAIAMAAAUAMAQAAAEAIAocAAAaADAdAAAXABAeAAAaADAfAQAbACEgAQAbACEhAQAbACEiAQAbACEjAQAcACEkAgAdACElQAAeACEOFQAAIAAgGAAAKAAgGQAAKAAgJgEAAAABJwEAAAAEKAEAAAAEKQEAAAABKgEAAAABKwEAAAABLAEAAAABLQEAJwAhLgEAAAABLwEAAAABMAEAAAABDhUAACMAIBgAACYAIBkAACYAICYBAAAAAScBAAAABSgBAAAABSkBAAAAASoBAAAAASsBAAAAASwBAAAAAS0BACUAIS4BAAAAAS8BAAAAATABAAAAAQ0VAAAjACAWAAAkACAXAAAjACAYAAAjACAZAAAjACAmAgAAAAEnAgAAAAUoAgAAAAUpAgAAAAEqAgAAAAErAgAAAAEsAgAAAAEtAgAiACELFQAAIAAgGAAAIQAgGQAAIQAgJkAAAAABJ0AAAAAEKEAAAAAEKUAAAAABKkAAAAABK0AAAAABLEAAAAABLUAAHwAhCxUAACAAIBgAACEAIBkAACEAICZAAAAAASdAAAAABChAAAAABClAAAAAASpAAAAAAStAAAAAASxAAAAAAS1AAB8AIQgmAgAAAAEnAgAAAAQoAgAAAAQpAgAAAAEqAgAAAAErAgAAAAEsAgAAAAEtAgAgACEIJkAAAAABJ0AAAAAEKEAAAAAEKUAAAAABKkAAAAABK0AAAAABLEAAAAABLUAAIQAhDRUAACMAIBYAACQAIBcAACMAIBgAACMAIBkAACMAICYCAAAAAScCAAAABSgCAAAABSkCAAAAASoCAAAAASsCAAAAASwCAAAAAS0CACIAIQgmAgAAAAEnAgAAAAUoAgAAAAUpAgAAAAEqAgAAAAErAgAAAAEsAgAAAAEtAgAjACEIJggAAAABJwgAAAAFKAgAAAAFKQgAAAABKggAAAABKwgAAAABLAgAAAABLQgAJAAhDhUAACMAIBgAACYAIBkAACYAICYBAAAAAScBAAAABSgBAAAABSkBAAAAASoBAAAAASsBAAAAASwBAAAAAS0BACUAIS4BAAAAAS8BAAAAATABAAAAAQsmAQAAAAEnAQAAAAUoAQAAAAUpAQAAAAEqAQAAAAErAQAAAAEsAQAAAAEtAQAmACEuAQAAAAEvAQAAAAEwAQAAAAEOFQAAIAAgGAAAKAAgGQAAKAAgJgEAAAABJwEAAAAEKAEAAAAEKQEAAAABKgEAAAABKwEAAAABLAEAAAABLQEAJwAhLgEAAAABLwEAAAABMAEAAAABCyYBAAAAAScBAAAABCgBAAAABCkBAAAAASoBAAAAASsBAAAAASwBAAAAAS0BACgAIS4BAAAAAS8BAAAAATABAAAAAQocAAApADAdAAAEABAeAAApADAfAQAqACEgAQAqACEhAQAqACEiAQAqACEjAQArACEkAgAsACElQAAtACELJgEAAAABJwEAAAAEKAEAAAAEKQEAAAABKgEAAAABKwEAAAABLAEAAAABLQEAKAAhLgEAAAABLwEAAAABMAEAAAABCyYBAAAAAScBAAAABSgBAAAABSkBAAAAASoBAAAAASsBAAAAASwBAAAAAS0BACYAIS4BAAAAAS8BAAAAATABAAAAAQgmAgAAAAEnAgAAAAUoAgAAAAUpAgAAAAEqAgAAAAErAgAAAAEsAgAAAAEtAgAjACEIJkAAAAABJ0AAAAAEKEAAAAAEKUAAAAABKkAAAAABK0AAAAABLEAAAAABLUAAIQAhAAAAAAAAATEBAAAAAQExAQAAAAEFMQIAAAABMgIAAAABMwIAAAABNAIAAAABNQIAAAABATFAAAAAAQAAAAAFFQAGFgAHFwAIGAAJGQAKAAAAAAAFFQAGFgAHFwAIGAAJGQAKAQIBAgMBBQYBBgcBBwgBCQoBCgwCCw0DDA8BDRECDhIEERMBEhQBExUCGhgFGxkL"
};
async function decodeBase64AsWasm(wasmBase64) {
    const { Buffer } = await import('node:buffer');
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
    getQueryCompilerWasmModule: async () => {
        const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
        return await decodeBase64AsWasm(wasm);
    },
    importName: "./query_compiler_fast_bg.js"
};
export function getPrismaClientClass() {
    return runtime.getPrismaClient(config);
}
//# sourceMappingURL=class.js.map