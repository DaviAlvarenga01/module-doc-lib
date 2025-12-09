import { ImportedEntity, LocalEntity, ManyToMany, ManyToOne, OneToMany, OneToOne, UseCase, UseCasesModel } from "./model.js";

export type Reference<T> = { ref: T } | T;
export type Container<T> = { $container: T };

export type DATATYPE = 'boolean' | 'cnpj' | 'cpf' | 'currency' | 'date' | 'datetime' | 'decimal' | 'email' | 'file' | 'integer' | 'mobilePhoneNumber' | 'phoneNumber' | 'string' | 'uuid' | 'void' | 'zipcode';

export type FEATURE_TYPE = 'authentication';
export type LANGUAGETYPE = 'csharp-clean-architecture' | 'csharp-minimal-api' | 'java' | 'python';
export type QualifiedName = string;
export type QualifiedNameWithWildcard = string;
export type Entity = ImportedEntity | LocalEntity;
export type Relation = ManyToMany | ManyToOne | OneToMany | OneToOne;
export type UseCaseElements = Actor | UseCase;


export interface Actor {
    $container: UseCasesModel;
    $type: 'Actor';
    comment?: string;
    fullName?: string;
    id: QualifiedName;
    superType?: Reference<Actor>;
}

export function isActor(item: any): item is Actor {
    return item && item.$type === 'Actor';
}

export function isUseCasesModel(item: any): item is UseCasesModel {
    return item && item.$type === 'UseCasesModel';
}