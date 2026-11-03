-- CreateTable
CREATE TABLE "consultas" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "termo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "fonte" TEXT,
    "tempoMs" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consultas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "consultas_tipo_criadoEm_idx" ON "consultas"("tipo", "criadoEm");
