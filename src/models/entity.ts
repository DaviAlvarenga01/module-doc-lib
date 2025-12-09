import { EnumEntityAtribute, Module, ModuleImport, Parameter } from "./model.js";
import { Attribute, DATATYPE } from "./atribute.js";
import { Entity, Reference, Relation } from "./actor.js";

export interface FunctionEntity {
    $container: LocalEntity;
    $type: 'FunctionEntity';
    comment?: string;
    name: string;
    paramters: Array<Parameter>;
    response: DATATYPE;
}

export interface ImportedEntity {
    $container: ModuleImport;
    $type: 'ImportedEntity';
    name: string;
}

export interface LocalEntity {
    $container: Module;
    $type: 'LocalEntity';
    attributes: Array<Attribute>;
    comment?: string;
    enumentityatributes: Array<EnumEntityAtribute>;
    functions: Array<FunctionEntity>;
    is_abstract: boolean;
    name: string;
    relations: Array<Relation>;
    superType?: Reference<Entity>;
}

export function isFunctionEntity(item: any): item is FunctionEntity {
    return item && item.$type === 'FunctionEntity';
}
export function isImportedEntity(item: any): item is ImportedEntity {
    return item && item.$type === 'ImportedEntity';
}
export function isLocalEntity(item: any): item is LocalEntity {
    return item && item.$type === 'LocalEntity';
}