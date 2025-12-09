import { EnumX, LocalEntity, DATATYPE } from "./model.js"; 
export type AbstractElement = EnumX;

export interface Attribute {
    $container: LocalEntity;
    $type: 'Attribute';
    blank: boolean;
    comment?: string;
    fullName?: string;
    max?: number;
    min?: number;
    name: string;
    type: DATATYPE;
    unique: boolean;
}

export interface AttributeEnum {
    $container: EnumX;
    $type: 'AttributeEnum';
    comment?: string;
    fullName?: string;
    name: string;
}

export function isAttribute(item: any): item is Attribute {
    return item && item.$type === 'Attribute';
}
export function isAttributeEnum(item: any): item is AttributeEnum {
    return item && item.$type === 'AttributeEnum';
}