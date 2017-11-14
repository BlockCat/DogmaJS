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
import Modifier from "./modifier/Modifier";
import {default as DogmaEnvironment, DogmaEnvironmentType} from "./modifier/DogmaEnvironment";

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

        this.applyPreModifiers();

        console.log(this.ship.environment);

        return fitResult;
    }

    applyPreModifiers() {
        const shipEnvironment = this.ship.environment;
        // const characterEnvironment = this.character.environment;

        const preModifiers = this.getPreModifiers();

        for (const [selfEnvironment, modifiers] of preModifiers) {
            for (const modifier of modifiers) {
                let environment: DogmaEnvironment;
                switch (modifier.environmentType) {
                    case DogmaEnvironmentType.CHARACTER:
                        environment = characterEnvironment;
                        break;
                    case DogmaEnvironmentType.SHIP:
                        environment = shipEnvironment;
                        break;
                    default:
                        environment = selfEnvironment;
                }
                modifier.apply(selfEnvironment, environment);
            }
        }
    }

    getPreModifiers(): [DogmaEnvironment, Modifier[]][] {
        const shipModifiers = [this.ship.environment, this.ship.getPreModifiers()];
        // const characterModifiers = [this.character.environment, this.character.getPreModifiers()];
        const moduleModifiers = this.modules.getPreModifiers();
        const skillModifiers = this.skills.map(x => [x.environment, x.getPreModifiers()]);

        return [shipModifiers, ...moduleModifiers, ...skillModifiers];
    }

    private concatPreModifiers(types: DogmaType[]): Modifier[] {
        return [].concat([], types.map(type => type.getPreModifiers()));
    }
}
