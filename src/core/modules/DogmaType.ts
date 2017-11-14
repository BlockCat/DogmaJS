import DogmaEffect from '../effects/DogmaEffect';
import DogmaEnvironment, {DogmaEnvironmentType} from '../modifier/DogmaEnvironment';
import CacheHandler from '../CacheHandler';
import {DogmaAttribute} from '../../types/DogmaTypes';
import Modifier, {DogmaAssociation} from "../modifier/Modifier";


// Every ship, module, rig, skill etc that changes stats on a ship are items.
// An item consists one or more effects (dgmeffects.json) that are defined in the effectstree (dgmexpressions.json).
// This expression tree generates a function with empty values, these values are defined in the effects of the item (dgmattribs).

//
export default class DogmaType {

    public typeId: number;
    public environment: DogmaEnvironment;

    private preModifiers: Modifier[];
    private midModifiers: Modifier[];
    private postModifiers: Modifier[];

    constructor(itemId: number) {
        this.typeId = itemId;
        this.environment = new DogmaEnvironment(this.typeId);
        this.calculateModifiers();
    }

    private calculateModifiers() {
        this.preModifiers = [];
        this.midModifiers = [];
        this.postModifiers = [];

        this.getEffects().forEach(x => {
            x[0].getModifiers().forEach(modifier => {
                switch(modifier.operation) {
                    case DogmaAssociation.PRE_MUL:
                    case DogmaAssociation.PRE_DIV:
                    case DogmaAssociation.PRE_ASSIGN:
                        this.preModifiers.push(modifier);
                        break;
                    case DogmaAssociation.MOD_ADD:
                    case DogmaAssociation.MOD_SUB:
                        this.midModifiers.push(modifier);
                        break;
                    case DogmaAssociation.POST_MUL:
                    case DogmaAssociation.POST_PERCENT:
                    case DogmaAssociation.POST_DIV:
                    case DogmaAssociation.POST_ASSIGN:
                        this.postModifiers.push(modifier);
                        break;
                }
            });
        });
    }

    getAttributes(): [DogmaAttribute, number][] {
        return CacheHandler.GetCacheHandler().GetTypeAttributes(this.typeId);
    }

    getEffects(): [DogmaEffect, boolean][] {
        return CacheHandler.GetCacheHandler().GetTypeEffects(this.typeId);
    }

    getPreModifiers(): Modifier[] {
        return this.preModifiers;
    }

    getMidModifiers(): Modifier[] {
        return this.midModifiers;
    }

    getPostModifiers(): Modifier[] {
        return this.postModifiers;
    }
}
