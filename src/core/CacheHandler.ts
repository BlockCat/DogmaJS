import * as operandsJson from '../cache/dogma()_GetOperandsForChar().json';
import * as expressionsJson from '../cache/dgmexpressions.json';
import * as attributesJson from '../cache/dgmattribs.json';
import * as effectsJson from '../cache/dgmeffects.json';
import * as typesJson from '../cache/invtypes.json';

import * as typeAttributeJson from '../cache/dgmtypeattribs.json';
import * as typeEffectsJson from '../cache/dgmtypeeffects.json';

import {DogmaOperand, DogmaExpression, DogmaAttribute} from '../types/DogmaTypes';
import DogmaEffect from './effects/DogmaEffect';

export default class CacheHandler {

    private static instance: CacheHandler;

    private operandsDictionary: {[id: number]: DogmaOperand};
    private expressionsDictionary: {[id: number]: DogmaExpression};
    private attributesDictionary: {[id: number]: DogmaAttribute};
    private attributeNameDictionary: {[name: string]: DogmaAttribute};
    private effectsDictionary: {[id: number]: DogmaEffect};
    private typeDictionary: {[id: number]: number};

    private typeAttributeBinding: {[id: number]: [DogmaAttribute, number][]};
    private typeEffecetsBinding: {[id: number]: [DogmaEffect, boolean][]};


    constructor() {
        console.log('Loading data');
        this.loadOperands();
        this.loadExpressions();
        this.loadAttributes();
        this.loadEffects();
        this.loadTypeGroups();

        console.log('Binding data');
        this.bindTypeAttribute();
        this.bindTypeEffect();

        console.log('Finished loading data');
    }

    public static GetCacheHandler(): CacheHandler {
        if (CacheHandler.instance == null) {
            CacheHandler.instance = new CacheHandler();
        }
        return CacheHandler.instance;
    }

    // Load operands from json
    private loadOperands() {
        this.operandsDictionary = {};
        for (const operand of <any>operandsJson) {
            this.operandsDictionary[operand.operandID] = operand as DogmaOperand;
        }
    }

    // Load expressions from json
    private loadExpressions() {
        this.expressionsDictionary = {};
        for (const expression of <any>expressionsJson) {
            this.expressionsDictionary[expression.expressionID] = expression as DogmaExpression;
        }
    }

    // Load effects from json
    private loadAttributes() {
        this.attributesDictionary = {};
        this.attributeNameDictionary = {};
        for (const attribute of <any>attributesJson) {
            this.attributesDictionary[attribute.attributeID] = attribute as DogmaAttribute;
            this.attributeNameDictionary[attribute.attributeName] = attribute as DogmaAttribute;
        }
    }

    // Load effects from json
    private loadEffects() {
        this.effectsDictionary = {};
        for (const json of <any>effectsJson) {
            this.effectsDictionary[json.effectID] = new DogmaEffect(json.effectID, json.description, json.name, json.preExpression);
        }
    }

    private loadTypeGroups() {
        this.typeDictionary = {};
        for (const json of Object.keys(typesJson)) {
            this.typeDictionary[json] = typesJson[json].groupID;
        }
    }

    // Bind effects to types
    private bindTypeAttribute() {
        this.typeAttributeBinding = {};
        for (const json of <any>typeAttributeJson) {
            const typeId = json.typeID;
            const attribute = this.GetAttribute(json.attributeID);
            const value = json.value;
            if (!(typeId in this.typeAttributeBinding)) {
                this.typeAttributeBinding[typeId] = [];
            }
            this.typeAttributeBinding[typeId].push([attribute, value]);
        }
    }

    // Bind the effects to types
    private bindTypeEffect() {
        this.typeEffecetsBinding = {};
        for (const json of <any>typeEffectsJson) {
            const typeId = json.typeID;
            const effect = this.GetEffect(json.effectID);
            const value = json.isDefault;
            if (!(typeId in this.typeEffecetsBinding)) {
                this.typeEffecetsBinding[typeId] = [];
            }
            this.typeEffecetsBinding[typeId].push([effect, value]);
        }
    }

    public GetOperand(operandId: number): DogmaOperand {
        return this.operandsDictionary[operandId];
    }
    public GetEffectExpression(expressionId: number): DogmaExpression {
        return this.expressionsDictionary[expressionId];
    }
    public GetAttribute(attributeId: number): DogmaAttribute {
        return this.attributesDictionary[attributeId];
    }
    public GetAttributeByName(attributeName: string) {
        return this.attributeNameDictionary[attributeName];
    }


    public GetEffect(effectId: number): DogmaEffect {
        return this.effectsDictionary[effectId];
    }

    public GetTypeAttributes(typeId: number): [DogmaAttribute, number][] {
        return this.typeAttributeBinding[typeId];
    }

    public GetTypeEffects(typeId: number): [DogmaEffect, boolean][] {
        return this.typeEffecetsBinding[typeId];
    }

    public GetTypesBound() {
        return Object.keys(this.typeEffecetsBinding);
    }

    public GetGroupId(typeId: number) {
        return this.typeDictionary[typeId];
    }
}
