import {ModuleLocation, ModuleState} from "./ModuleState";
import DogmaItem from "./DogmaType";

export default class Module extends DogmaItem {
    moduleLocation: ModuleLocation;
    moduleState: ModuleState;

    constructor(moduleId, moduleLocation, moduleState, charge = null) {
        super(moduleId);
        this.moduleLocation = moduleLocation;
        this.moduleState = moduleState;
    }
}