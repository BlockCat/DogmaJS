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
        const midModifiers = this.mid.map(func);
        const lowModifiers = this.low.map(func);

        const highModifiersCharges = this.high.filter(x => x.charge).map(x => x.charge).map(func);
        const midModifiersCharges = this.mid.filter(x => x.charge).map(x => x.charge).map(func);
        const lowModifiersCharges = this.low.filter(x => x.charge).map(x => x.charge).map(func);

        return [...highModifiers, ...midModifiers, ...lowModifiers, ...highModifiersCharges, ...midModifiersCharges, ...lowModifiersCharges];
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