import Module from "./Module";
import DogmaEffect from "../effects/DogmaEffect";
import Modifier from "../modifier/Modifier";
import DogmaEnvironment from "../modifier/DogmaEnvironment";

export default class ModuleHandler {
    high: Module[];
    mid: Module[];
    low: Module[];

    constructor() {
        this.high = [];
        this.mid = [];
        this.low = [];
    }

    getPreModifiers(): [DogmaEnvironment, Modifier[]][] {
        const highModifiers = this.high.map(x => [x.environment, x.getPreModifiers()]);
        const midModifiers = this.high.map(x => [x.environment, x.getPreModifiers()]);
        const lowModifiers = this.high.map(x => [x.environment, x.getPreModifiers()]);

        return [...lowModifiers, ...midModifiers, ...highModifiers];
    }
}