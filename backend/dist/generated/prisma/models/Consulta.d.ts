import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ConsultaModel = runtime.Types.Result.DefaultSelection<Prisma.$ConsultaPayload>;
export type AggregateConsulta = {
    _count: ConsultaCountAggregateOutputType | null;
    _avg: ConsultaAvgAggregateOutputType | null;
    _sum: ConsultaSumAggregateOutputType | null;
    _min: ConsultaMinAggregateOutputType | null;
    _max: ConsultaMaxAggregateOutputType | null;
};
export type ConsultaAvgAggregateOutputType = {
    tempoMs: number | null;
};
export type ConsultaSumAggregateOutputType = {
    tempoMs: number | null;
};
export type ConsultaMinAggregateOutputType = {
    id: string | null;
    tipo: string | null;
    termo: string | null;
    status: string | null;
    fonte: string | null;
    tempoMs: number | null;
    criadoEm: Date | null;
};
export type ConsultaMaxAggregateOutputType = {
    id: string | null;
    tipo: string | null;
    termo: string | null;
    status: string | null;
    fonte: string | null;
    tempoMs: number | null;
    criadoEm: Date | null;
};
export type ConsultaCountAggregateOutputType = {
    id: number;
    tipo: number;
    termo: number;
    status: number;
    fonte: number;
    tempoMs: number;
    criadoEm: number;
    _all: number;
};
export type ConsultaAvgAggregateInputType = {
    tempoMs?: true;
};
export type ConsultaSumAggregateInputType = {
    tempoMs?: true;
};
export type ConsultaMinAggregateInputType = {
    id?: true;
    tipo?: true;
    termo?: true;
    status?: true;
    fonte?: true;
    tempoMs?: true;
    criadoEm?: true;
};
export type ConsultaMaxAggregateInputType = {
    id?: true;
    tipo?: true;
    termo?: true;
    status?: true;
    fonte?: true;
    tempoMs?: true;
    criadoEm?: true;
};
export type ConsultaCountAggregateInputType = {
    id?: true;
    tipo?: true;
    termo?: true;
    status?: true;
    fonte?: true;
    tempoMs?: true;
    criadoEm?: true;
    _all?: true;
};
export type ConsultaAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ConsultaWhereInput;
    orderBy?: Prisma.ConsultaOrderByWithRelationInput | Prisma.ConsultaOrderByWithRelationInput[];
    cursor?: Prisma.ConsultaWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ConsultaCountAggregateInputType;
    _avg?: ConsultaAvgAggregateInputType;
    _sum?: ConsultaSumAggregateInputType;
    _min?: ConsultaMinAggregateInputType;
    _max?: ConsultaMaxAggregateInputType;
};
export type GetConsultaAggregateType<T extends ConsultaAggregateArgs> = {
    [P in keyof T & keyof AggregateConsulta]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateConsulta[P]> : Prisma.GetScalarType<T[P], AggregateConsulta[P]>;
};
export type ConsultaGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ConsultaWhereInput;
    orderBy?: Prisma.ConsultaOrderByWithAggregationInput | Prisma.ConsultaOrderByWithAggregationInput[];
    by: Prisma.ConsultaScalarFieldEnum[] | Prisma.ConsultaScalarFieldEnum;
    having?: Prisma.ConsultaScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ConsultaCountAggregateInputType | true;
    _avg?: ConsultaAvgAggregateInputType;
    _sum?: ConsultaSumAggregateInputType;
    _min?: ConsultaMinAggregateInputType;
    _max?: ConsultaMaxAggregateInputType;
};
export type ConsultaGroupByOutputType = {
    id: string;
    tipo: string;
    termo: string;
    status: string;
    fonte: string | null;
    tempoMs: number | null;
    criadoEm: Date;
    _count: ConsultaCountAggregateOutputType | null;
    _avg: ConsultaAvgAggregateOutputType | null;
    _sum: ConsultaSumAggregateOutputType | null;
    _min: ConsultaMinAggregateOutputType | null;
    _max: ConsultaMaxAggregateOutputType | null;
};
export type GetConsultaGroupByPayload<T extends ConsultaGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ConsultaGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ConsultaGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ConsultaGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ConsultaGroupByOutputType[P]>;
}>>;
export type ConsultaWhereInput = {
    AND?: Prisma.ConsultaWhereInput | Prisma.ConsultaWhereInput[];
    OR?: Prisma.ConsultaWhereInput[];
    NOT?: Prisma.ConsultaWhereInput | Prisma.ConsultaWhereInput[];
    id?: Prisma.StringFilter<"Consulta"> | string;
    tipo?: Prisma.StringFilter<"Consulta"> | string;
    termo?: Prisma.StringFilter<"Consulta"> | string;
    status?: Prisma.StringFilter<"Consulta"> | string;
    fonte?: Prisma.StringNullableFilter<"Consulta"> | string | null;
    tempoMs?: Prisma.IntNullableFilter<"Consulta"> | number | null;
    criadoEm?: Prisma.DateTimeFilter<"Consulta"> | Date | string;
};
export type ConsultaOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tipo?: Prisma.SortOrder;
    termo?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    fonte?: Prisma.SortOrderInput | Prisma.SortOrder;
    tempoMs?: Prisma.SortOrderInput | Prisma.SortOrder;
    criadoEm?: Prisma.SortOrder;
};
export type ConsultaWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ConsultaWhereInput | Prisma.ConsultaWhereInput[];
    OR?: Prisma.ConsultaWhereInput[];
    NOT?: Prisma.ConsultaWhereInput | Prisma.ConsultaWhereInput[];
    tipo?: Prisma.StringFilter<"Consulta"> | string;
    termo?: Prisma.StringFilter<"Consulta"> | string;
    status?: Prisma.StringFilter<"Consulta"> | string;
    fonte?: Prisma.StringNullableFilter<"Consulta"> | string | null;
    tempoMs?: Prisma.IntNullableFilter<"Consulta"> | number | null;
    criadoEm?: Prisma.DateTimeFilter<"Consulta"> | Date | string;
}, "id">;
export type ConsultaOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tipo?: Prisma.SortOrder;
    termo?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    fonte?: Prisma.SortOrderInput | Prisma.SortOrder;
    tempoMs?: Prisma.SortOrderInput | Prisma.SortOrder;
    criadoEm?: Prisma.SortOrder;
    _count?: Prisma.ConsultaCountOrderByAggregateInput;
    _avg?: Prisma.ConsultaAvgOrderByAggregateInput;
    _max?: Prisma.ConsultaMaxOrderByAggregateInput;
    _min?: Prisma.ConsultaMinOrderByAggregateInput;
    _sum?: Prisma.ConsultaSumOrderByAggregateInput;
};
export type ConsultaScalarWhereWithAggregatesInput = {
    AND?: Prisma.ConsultaScalarWhereWithAggregatesInput | Prisma.ConsultaScalarWhereWithAggregatesInput[];
    OR?: Prisma.ConsultaScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ConsultaScalarWhereWithAggregatesInput | Prisma.ConsultaScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Consulta"> | string;
    tipo?: Prisma.StringWithAggregatesFilter<"Consulta"> | string;
    termo?: Prisma.StringWithAggregatesFilter<"Consulta"> | string;
    status?: Prisma.StringWithAggregatesFilter<"Consulta"> | string;
    fonte?: Prisma.StringNullableWithAggregatesFilter<"Consulta"> | string | null;
    tempoMs?: Prisma.IntNullableWithAggregatesFilter<"Consulta"> | number | null;
    criadoEm?: Prisma.DateTimeWithAggregatesFilter<"Consulta"> | Date | string;
};
export type ConsultaCreateInput = {
    id?: string;
    tipo: string;
    termo: string;
    status: string;
    fonte?: string | null;
    tempoMs?: number | null;
    criadoEm?: Date | string;
};
export type ConsultaUncheckedCreateInput = {
    id?: string;
    tipo: string;
    termo: string;
    status: string;
    fonte?: string | null;
    tempoMs?: number | null;
    criadoEm?: Date | string;
};
export type ConsultaUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tipo?: Prisma.StringFieldUpdateOperationsInput | string;
    termo?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    fonte?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tempoMs?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    criadoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ConsultaUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tipo?: Prisma.StringFieldUpdateOperationsInput | string;
    termo?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    fonte?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tempoMs?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    criadoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ConsultaCreateManyInput = {
    id?: string;
    tipo: string;
    termo: string;
    status: string;
    fonte?: string | null;
    tempoMs?: number | null;
    criadoEm?: Date | string;
};
export type ConsultaUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tipo?: Prisma.StringFieldUpdateOperationsInput | string;
    termo?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    fonte?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tempoMs?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    criadoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ConsultaUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tipo?: Prisma.StringFieldUpdateOperationsInput | string;
    termo?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    fonte?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tempoMs?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    criadoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ConsultaCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tipo?: Prisma.SortOrder;
    termo?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    fonte?: Prisma.SortOrder;
    tempoMs?: Prisma.SortOrder;
    criadoEm?: Prisma.SortOrder;
};
export type ConsultaAvgOrderByAggregateInput = {
    tempoMs?: Prisma.SortOrder;
};
export type ConsultaMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tipo?: Prisma.SortOrder;
    termo?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    fonte?: Prisma.SortOrder;
    tempoMs?: Prisma.SortOrder;
    criadoEm?: Prisma.SortOrder;
};
export type ConsultaMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tipo?: Prisma.SortOrder;
    termo?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    fonte?: Prisma.SortOrder;
    tempoMs?: Prisma.SortOrder;
    criadoEm?: Prisma.SortOrder;
};
export type ConsultaSumOrderByAggregateInput = {
    tempoMs?: Prisma.SortOrder;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type ConsultaSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tipo?: boolean;
    termo?: boolean;
    status?: boolean;
    fonte?: boolean;
    tempoMs?: boolean;
    criadoEm?: boolean;
}, ExtArgs["result"]["consulta"]>;
export type ConsultaSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tipo?: boolean;
    termo?: boolean;
    status?: boolean;
    fonte?: boolean;
    tempoMs?: boolean;
    criadoEm?: boolean;
}, ExtArgs["result"]["consulta"]>;
export type ConsultaSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tipo?: boolean;
    termo?: boolean;
    status?: boolean;
    fonte?: boolean;
    tempoMs?: boolean;
    criadoEm?: boolean;
}, ExtArgs["result"]["consulta"]>;
export type ConsultaSelectScalar = {
    id?: boolean;
    tipo?: boolean;
    termo?: boolean;
    status?: boolean;
    fonte?: boolean;
    tempoMs?: boolean;
    criadoEm?: boolean;
};
export type ConsultaOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tipo" | "termo" | "status" | "fonte" | "tempoMs" | "criadoEm", ExtArgs["result"]["consulta"]>;
export type $ConsultaPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Consulta";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tipo: string;
        termo: string;
        status: string;
        fonte: string | null;
        tempoMs: number | null;
        criadoEm: Date;
    }, ExtArgs["result"]["consulta"]>;
    composites: {};
};
export type ConsultaGetPayload<S extends boolean | null | undefined | ConsultaDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ConsultaPayload, S>;
export type ConsultaCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ConsultaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ConsultaCountAggregateInputType | true;
};
export interface ConsultaDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Consulta'];
        meta: {
            name: 'Consulta';
        };
    };
    findUnique<T extends ConsultaFindUniqueArgs>(args: Prisma.SelectSubset<T, ConsultaFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ConsultaClient<runtime.Types.Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ConsultaFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ConsultaFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ConsultaClient<runtime.Types.Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ConsultaFindFirstArgs>(args?: Prisma.SelectSubset<T, ConsultaFindFirstArgs<ExtArgs>>): Prisma.Prisma__ConsultaClient<runtime.Types.Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ConsultaFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ConsultaFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ConsultaClient<runtime.Types.Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ConsultaFindManyArgs>(args?: Prisma.SelectSubset<T, ConsultaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ConsultaCreateArgs>(args: Prisma.SelectSubset<T, ConsultaCreateArgs<ExtArgs>>): Prisma.Prisma__ConsultaClient<runtime.Types.Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ConsultaCreateManyArgs>(args?: Prisma.SelectSubset<T, ConsultaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ConsultaCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ConsultaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ConsultaDeleteArgs>(args: Prisma.SelectSubset<T, ConsultaDeleteArgs<ExtArgs>>): Prisma.Prisma__ConsultaClient<runtime.Types.Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ConsultaUpdateArgs>(args: Prisma.SelectSubset<T, ConsultaUpdateArgs<ExtArgs>>): Prisma.Prisma__ConsultaClient<runtime.Types.Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ConsultaDeleteManyArgs>(args?: Prisma.SelectSubset<T, ConsultaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ConsultaUpdateManyArgs>(args: Prisma.SelectSubset<T, ConsultaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ConsultaUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ConsultaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ConsultaUpsertArgs>(args: Prisma.SelectSubset<T, ConsultaUpsertArgs<ExtArgs>>): Prisma.Prisma__ConsultaClient<runtime.Types.Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ConsultaCountArgs>(args?: Prisma.Subset<T, ConsultaCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ConsultaCountAggregateOutputType> : number>;
    aggregate<T extends ConsultaAggregateArgs>(args: Prisma.Subset<T, ConsultaAggregateArgs>): Prisma.PrismaPromise<GetConsultaAggregateType<T>>;
    groupBy<T extends ConsultaGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ConsultaGroupByArgs['orderBy'];
    } : {
        orderBy?: ConsultaGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ConsultaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConsultaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ConsultaFieldRefs;
}
export interface Prisma__ConsultaClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ConsultaFieldRefs {
    readonly id: Prisma.FieldRef<"Consulta", 'String'>;
    readonly tipo: Prisma.FieldRef<"Consulta", 'String'>;
    readonly termo: Prisma.FieldRef<"Consulta", 'String'>;
    readonly status: Prisma.FieldRef<"Consulta", 'String'>;
    readonly fonte: Prisma.FieldRef<"Consulta", 'String'>;
    readonly tempoMs: Prisma.FieldRef<"Consulta", 'Int'>;
    readonly criadoEm: Prisma.FieldRef<"Consulta", 'DateTime'>;
}
export type ConsultaFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConsultaSelect<ExtArgs> | null;
    omit?: Prisma.ConsultaOmit<ExtArgs> | null;
    where: Prisma.ConsultaWhereUniqueInput;
};
export type ConsultaFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConsultaSelect<ExtArgs> | null;
    omit?: Prisma.ConsultaOmit<ExtArgs> | null;
    where: Prisma.ConsultaWhereUniqueInput;
};
export type ConsultaFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConsultaSelect<ExtArgs> | null;
    omit?: Prisma.ConsultaOmit<ExtArgs> | null;
    where?: Prisma.ConsultaWhereInput;
    orderBy?: Prisma.ConsultaOrderByWithRelationInput | Prisma.ConsultaOrderByWithRelationInput[];
    cursor?: Prisma.ConsultaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ConsultaScalarFieldEnum | Prisma.ConsultaScalarFieldEnum[];
};
export type ConsultaFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConsultaSelect<ExtArgs> | null;
    omit?: Prisma.ConsultaOmit<ExtArgs> | null;
    where?: Prisma.ConsultaWhereInput;
    orderBy?: Prisma.ConsultaOrderByWithRelationInput | Prisma.ConsultaOrderByWithRelationInput[];
    cursor?: Prisma.ConsultaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ConsultaScalarFieldEnum | Prisma.ConsultaScalarFieldEnum[];
};
export type ConsultaFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConsultaSelect<ExtArgs> | null;
    omit?: Prisma.ConsultaOmit<ExtArgs> | null;
    where?: Prisma.ConsultaWhereInput;
    orderBy?: Prisma.ConsultaOrderByWithRelationInput | Prisma.ConsultaOrderByWithRelationInput[];
    cursor?: Prisma.ConsultaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ConsultaScalarFieldEnum | Prisma.ConsultaScalarFieldEnum[];
};
export type ConsultaCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConsultaSelect<ExtArgs> | null;
    omit?: Prisma.ConsultaOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ConsultaCreateInput, Prisma.ConsultaUncheckedCreateInput>;
};
export type ConsultaCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ConsultaCreateManyInput | Prisma.ConsultaCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ConsultaCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConsultaSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ConsultaOmit<ExtArgs> | null;
    data: Prisma.ConsultaCreateManyInput | Prisma.ConsultaCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ConsultaUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConsultaSelect<ExtArgs> | null;
    omit?: Prisma.ConsultaOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ConsultaUpdateInput, Prisma.ConsultaUncheckedUpdateInput>;
    where: Prisma.ConsultaWhereUniqueInput;
};
export type ConsultaUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ConsultaUpdateManyMutationInput, Prisma.ConsultaUncheckedUpdateManyInput>;
    where?: Prisma.ConsultaWhereInput;
    limit?: number;
};
export type ConsultaUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConsultaSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ConsultaOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ConsultaUpdateManyMutationInput, Prisma.ConsultaUncheckedUpdateManyInput>;
    where?: Prisma.ConsultaWhereInput;
    limit?: number;
};
export type ConsultaUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConsultaSelect<ExtArgs> | null;
    omit?: Prisma.ConsultaOmit<ExtArgs> | null;
    where: Prisma.ConsultaWhereUniqueInput;
    create: Prisma.XOR<Prisma.ConsultaCreateInput, Prisma.ConsultaUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ConsultaUpdateInput, Prisma.ConsultaUncheckedUpdateInput>;
};
export type ConsultaDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConsultaSelect<ExtArgs> | null;
    omit?: Prisma.ConsultaOmit<ExtArgs> | null;
    where: Prisma.ConsultaWhereUniqueInput;
};
export type ConsultaDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ConsultaWhereInput;
    limit?: number;
};
export type ConsultaDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConsultaSelect<ExtArgs> | null;
    omit?: Prisma.ConsultaOmit<ExtArgs> | null;
};
