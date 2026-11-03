import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'cep',
        pathMatch: 'full',
    },
    {
        path: 'cep',
        loadComponent: () =>
            import('./features/cep/cep.page').then(m => m.CepPage),
        title: 'Consulta de CEP | Brasil Data Hub',
    },
    {
        path: 'cnpj',
        loadComponent: () =>
            import('./features/cnpj/cnpj.page').then(m => m.CnpjPage),
        title: 'Consulta de CNPJ | Brasil Data Hub',
    },
    {
        path: 'historico',
        loadComponent: () =>
            import('./features/historico/historico.page')
                .then(m => m.HistoricoPage),
        title: 'Histórico | Brasil Data Hub',
    },
    {
        path: 'bancos',
        loadComponent: () =>
            import('./features/bancos/bancos.page')
                .then(m => m.BancosPage),
        title: 'Diretório de Bancos | Brasil Data Hub',
    },
    {
        path: '**',
        redirectTo: 'cep',
    },
];