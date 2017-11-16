import {ModuleLocation, ModuleState} from './ModuleState';
import DogmaType from './DogmaType';
import Charge from './Charge';

export default class Module extends DogmaType {
    moduleLocation: ModuleLocation;
    moduleState: ModuleState;

    charge: Charge;

    constructor(moduleId: number, moduleLocation: ModuleLocation, moduleState: ModuleState, charge: Charge = null) {
        super(moduleId);
        this.moduleLocation = moduleLocation;
        this.moduleState = moduleState;

        this.charge = this.charge;
    }
}
