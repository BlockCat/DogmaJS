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

    getPreModifiers(): [DogmaType, Modifier[]][] {
        const highModifiers = this.high.map(x => [x, x.getPreModifiers()]);
        const midModifiers = this.high.map(x => [x, x.getPreModifiers()]);
        const lowModifiers = this.high.map(x => [x, x.getPreModifiers()]);

        return [...lowModifiers, ...midModifiers, ...highModifiers];
    }
}