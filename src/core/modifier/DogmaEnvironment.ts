import DogmaEffect from '../effects/DogmaEffect';
import {DogmaAssociation} from './Modifier';
import CacheHandler from '../CacheHandler';
import {DogmaAttribute} from '../../types/DogmaTypes';

// Every type has its own environment, this environment affects others and itself.
export default class DogmaEnvironment {

    typeId: number;

    private attributes: {[attribute: string]: number};

    constructor(typeId: number) {
        this.typeId = typeId;
        this.loadAttributes();
    }

    /// Load all effects of the type into the environment.
    private loadAttributes() {
        this.attributes = {};
        const attributes = CacheHandler.GetCacheHandler().GetTypeAttributes(this.typeId);

        for (const [attribute, defaultValue] of attributes) {
            this.attributes[attribute.attributeName] = defaultValue;
        }
    }

    setAttributeValue(attribute: string, value: number) {
        this.attributes[attribute] = value;
    }

    getAttributeValue(attribute: DogmaAttribute): number {
        if (!(attribute.attributeName in this.attributes))  {
            this.attributes[attribute.attributeName] = attribute.defaultValue;
        }
        return this.attributes[attribute.attributeName];
    }

    changeAttribute(attribute: DogmaAttribute, value: number, association: DogmaAssociation) {
        if (!(attribute.attributeName in this.attributes))  {
            this.attributes[attribute.attributeName] = attribute.defaultValue;
        }
        let modifiers: Function;
        switch (association) {
            case DogmaAssociation.PRE_ASSIGN:
                modifiers = (x => value);
                break;
            case DogmaAssociation.PRE_DIV:
                modifiers = (x => x / value);
                break;
            case DogmaAssociation.PRE_MUL:
                modifiers = (x => x * value);
                break;
            case DogmaAssociation.MOD_ADD:
                modifiers = (x => x + value);
                break;
            case DogmaAssociation.MOD_SUB:
                modifiers = (x => x - value);
                break;
            case DogmaAssociation.POST_ASSIGN:
                modifiers = (x => value);
                break;
            case DogmaAssociation.POST_DIV:
                modifiers = (x => x / value);
                break;
            case DogmaAssociation.POST_MUL:
                modifiers = (x => x * value);
                break;
            case DogmaAssociation.POST_PERCENT:
                modifiers = (x => x * (value / 100.0 + 1));
                break;
            default:
                console.log('dogmaAssociation not found: ', association);
                modifiers = x => x;
        }
        this.attributes[attribute.attributeName] = modifiers(this.attributes[attribute.attributeName]);
    }


}


export enum DogmaEnvironmentType {
    SELF = 'CurrentSelf',
    CHARACTER = 'CurrentCharacter',
    SHIP = 'CurrentShip',
    OTHER = 'CurrentOther',
}
