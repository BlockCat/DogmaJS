import DogmaItem from './DogmaType';
import Module from './Module';

export default class Charge extends DogmaItem {

    public container: Module;

    constructor(typeId: number) {
        super(typeId);
    }

}