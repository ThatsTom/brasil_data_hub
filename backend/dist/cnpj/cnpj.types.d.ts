export interface EmpresaCnpj {
    cnpj: string;
    razaoSocial: string;
    nomeFantasia: string | null;
    situacaoCadastral: string;
    dataAbertura: string | null;
    matrizFilial: string | null;
    naturezaJuridica: string | null;
    porte: string | null;
    capitalSocial: number | null;
    atividadePrincipal: {
        codigo: number | null;
        descricao: string | null;
    };
    endereco: {
        logradouro: string | null;
        numero: string | null;
        complemento: string | null;
        bairro: string | null;
        municipio: string | null;
        uf: string | null;
        cep: string | null;
    };
    fonte: string;
}
