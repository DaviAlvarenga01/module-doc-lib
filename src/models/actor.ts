import { QualifiedName, Reference } from "./model.js";
import { UseCasesModel } from "./model.js";
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