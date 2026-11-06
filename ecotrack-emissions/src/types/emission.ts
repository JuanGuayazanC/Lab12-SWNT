export type EmissionCategory="Transporte"|"Energía"|"Residuos";
export interface Emission{id:string;source_name:string;category:EmissionCategory;co2_amount:number;created_at:string;}
export interface NewEmission{source_name:string;category:EmissionCategory;co2_amount:number;}
