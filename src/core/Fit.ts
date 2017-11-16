import Ship from './Ship';
import Skill from './modules/skills/Skill';
import ModuleHandler from './modules/ModuleHandler';
import Rig from './modules/Rig';
import Drone from './modules/Drone';
import Implant from './modules/skills/Implant';
import Booster from './modules/skills/Booster';
import {FitResult} from './FitResult';
import {Resistances} from '../types/Resistances';

import DogmaType from './modules/DogmaType';
import Modifier from './modifier/Modifier';
import {default as DogmaEnvironment, DogmaEnvironmentType} from './modifier/DogmaEnvironment';

export default class Fit {
    // The ship selected for fitting
    ship: Ship;

    // The character
    //character: DogmaType; // TODO: Character

    // Modules on the ship
    modules: ModuleHandler;

    // Rigs added onto the ship
    rigs: Rig[];

    // Drones that are launched from the ship
    drones: Drone[];

    // The skills that should be applied to the bonusses
    skills: Skill[];

    // Implants and boosters on the ship
    implants: Implant[];
    boosters: Booster[];


    constructor() {
        this.modules = new ModuleHandler();
        //this.character = new DogmaType();

        this.rigs = [];
        this.drones = [];
        this.skills = [];
        this.implants = [];
        this.boosters = [];
    }


    // Start the calculations.
    defaultResistance = {
        em: 0.25,
        thermal: 0.25,
        kinetic: 0.25,
        explosive: 0.25
    };

    calculate(resitances: Resistances = this.defaultResistance): FitResult {
        // Calculate
        let fitResult: FitResult;

        this.applyAllModifiers(this.getPreModifiers());
        this.applyAllModifiers(this.getMidModifiers());
        this.applyAllModifiers(this.getPostModifiers());

        console.log(this.ship.environment);

        return fitResult;
    }

    applyAllModifiers(modifierList: [DogmaType, Modifier[]][]) {
        const shipEnvironment = this.ship.environment;
        // const characterEnvironment = this.character.environment;

        // Every type has its own modifiers,
        for (const [selfType, modifiers] of modifierList) {
            for (const modifier of modifiers) {

                // Check what environment or environments this modifier modifies
                if (modifier.environmentType === DogmaEnvironmentType.CHARACTER) {
                    // Not yet implemented
                } else if (modifier.environmentType === DogmaEnvironmentType.SHIP) {
                    // If there is a filter, then this modifiers applies to modules in the filter
                    if (modifier.getFilter()) {
                        console.log('Has a filter', modifier.getFilter(), modifier);
                        for (const module of [...this.modules.low, ...this.modules.mid, ...this.modules.high]) {
                            modifier.applyModifier(selfType.environment, module.environment);
                        }
                    } else {
                        // Apply this modifier to the ship itself.
                        modifier.applyModifier(selfType.environment, this.ship.environment);
                    }
                } else {
                    // only self environment
                    modifier.applyModifier(selfType.environment, selfType.environment);
                }
            }
        }
    }



    getPreModifiers(): [DogmaType, Modifier[]][] {
        const shipModifiers = [this.ship, this.ship.getPreModifiers()] as [DogmaType, Modifier[]];
        // const characterModifiers = [this.character.environment, this.character.getPreModifiers()];
        const moduleModifiers = this.modules.getPreModifiers();


        const skillModifiers = this.skills.map(x => [x, x.getPreModifiers()] as [DogmaType, Modifier[]]);

        return [shipModifiers, ...moduleModifiers, ...skillModifiers];
    }

    getMidModifiers(): [DogmaType, Modifier[]][] {
        const shipModifiers = [this.ship, this.ship.getMidModifiers()] as [DogmaType, Modifier[]];
        // const characterModifiers = [this.character.environment, this.character.getPreModifiers()];
        const moduleModifiers = this.modules.getMidModifiers();
        const skillModifiers = this.skills.map(x => [x, x.getMidModifiers()] as [DogmaType, Modifier[]]);

        return [shipModifiers, ...moduleModifiers, ...skillModifiers];
    }

    getPostModifiers(): [DogmaType, Modifier[]][] {
        const shipModifiers = [this.ship, this.ship.getPostModifiers()] as [DogmaType, Modifier[]];
        // const characterModifiers = [this.character.environment, this.character.getPreModifiers()];
        const moduleModifiers = this.modules.getPostModifiers();
        const skillModifiers = this.skills.map(x => [x, x.getPostModifiers()] as [DogmaType, Modifier[]]);

        return [shipModifiers, ...moduleModifiers, ...skillModifiers];
    }
}
