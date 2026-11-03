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
        path: 'localidades',
        loadComponent: () =>
            import('./features/localidades/localidades.page')
                .then(m => m.LocalidadesPage),
        title: 'Estados e Municípios | Brasil Data Hub',
    },
    {
        path: 'feriados',
        loadComponent: () =>
            import('./features/feriados/feriados.page')
                .then(m => m.FeriadosPage),
        title: 'Calendário de Feriados | Brasil Data Hub',
    },
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./features/dashboard/dashboard.page')
                .then(m => m.DashboardPage),
        title: 'Dashboard Corporativo | Brasil Data Hub',
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
];