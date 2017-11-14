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
        const highModifiers = this.high.map(x => {
            return [x, x.getPreModifiers()] as [DogmaType, Modifier[]];
        });
        const midModifiers = this.high.map(x => {
            return [x, x.getPreModifiers()] as [DogmaType, Modifier[]];
        });
        const lowModifiers = this.high.map(x => {
            return [x, x.getPreModifiers()] as [DogmaType, Modifier[]];
        });
        return [...highModifiers, ...midModifiers, ...lowModifiers];
    }

    getMidModifiers(): [DogmaType, Modifier[]][] {
        const highModifiers = this.high.map(x => {
            return [x, x.getMidModifiers()] as [DogmaType, Modifier[]];
        });
        const midModifiers = this.high.map(x => {
            return [x, x.getMidModifiers()] as [DogmaType, Modifier[]];
        });
        const lowModifiers = this.high.map(x => {
            return [x, x.getMidModifiers()] as [DogmaType, Modifier[]];
        });
        return [...highModifiers, ...midModifiers, ...lowModifiers];
    }

    getPostModifiers(): [DogmaType, Modifier[]][] {
        const highModifiers = this.high.map(x => {
            return [x, x.getPostModifiers()] as [DogmaType, Modifier[]];
        });
        const midModifiers = this.high.map(x => {
            return [x, x.getPostModifiers()] as [DogmaType, Modifier[]];
        });
        const lowModifiers = this.high.map(x => {
            return [x, x.getPostModifiers()] as [DogmaType, Modifier[]];
        });
        return [...highModifiers, ...midModifiers, ...lowModifiers];
    }
}