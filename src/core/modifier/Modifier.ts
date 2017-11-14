import {DogmaAttribute } from '../../types/DogmaTypes';
import DogmaEnvironment, {DogmaEnvironmentType} from './DogmaEnvironment';
import DogmaEffect from '../effects/DogmaEffect';
import {Filter} from './Filter';

export default class Modifier {
    public operation: DogmaAssociation;
    public environmentType: DogmaEnvironmentType;

    private attribute: DogmaAttribute;
    private changeAttribute: DogmaAttribute;
    private filter: Filter;

    constructor(operation: DogmaAssociation, attribute: DogmaAttribute, changeAttribute: DogmaAttribute) {
        this.attribute = attribute;
        this.operation = operation;
        this.changeAttribute = changeAttribute;
    }

    setEnvironmentType(environmentType: DogmaEnvironmentType) {
        this.environmentType = environmentType;
    }

    setFilter(filter: Filter) {
        this.filter = filter;
    }

    apply(selfEnvironment: DogmaEnvironment, environment: DogmaEnvironment) {
        environment.changeAttribute(this.attribute, selfEnvironment.getAttributeValue(this.changeAttribute), this.operation);
    }
}


export enum DogmaAssociation {
    // First stage, these effects/modifiers/values are handled first
    PRE_ASSIGN = 'PreAssign', // Set the value of the attribute.
    PRE_MUL = 'PreMul', // First calculations, multiply the first stage
    PRE_DIV = 'PreDiv', // First calculations, divide the first stage

    // Second stage, these modifiers are handled seconds
    MOD_ADD = 'ModAdd', // Add to the first stage,
    MOD_SUB = 'ModSub', // Remove from the first stage

    // Third stage, these operations are handled last.
    POST_MUL = 'PostMul', // After the second stage, multiply?
    POST_DIV = 'PostDiv', // After the stage, divide?
    POST_PERCENT = 'PostPercent', //
    POST_ASSIGN = 'PostAssign',
}
