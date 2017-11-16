import Module from "./Module";
import DogmaEffect from "../effects/DogmaEffect";
import Modifier from "../modifier/Modifier";
import DogmaEnvironment from "../modifier/DogmaEnvironment";
import DogmaType from './DogmaType';

export default class ModuleHandler {
    high: Module[];
    mid: Module[];
    low: Module[];

    constructor() {
        this.high = [];
        this.mid = [];
        this.low = [];
    }

    getModifiers(getModifiersFunction: Function): [DogmaType, Modifier[]][] {

        let func = x => getModifiersFunction(x) as [DogmaType, Modifier[]];

        const highModifiers = this.high.map(func);
        const midModifiers = this.high.map(func);
        const lowModifiers = this.high.map(func);

        return [...highModifiers, ...midModifiers, ...lowModifiers];
    }

    getPreModifiers(): [DogmaType, Modifier[]][] {
        return this.getModifiers(x => [x, x.getPreModifiers()] as [DogmaType, Modifier[]]);
    }

    getMidModifiers(): [DogmaType, Modifier[]][] {
        return this.getModifiers(x => [x, x.getMidModifiers()] as [DogmaType, Modifier[]]);
    }

    getPostModifiers(): [DogmaType, Modifier[]][] {
        return this.getModifiers(x => [x, x.getPostModifiers()] as [DogmaType, Modifier[]]);
    }
}