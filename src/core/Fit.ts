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
import Charge from './modules/Charge';
import Module from './modules/Module';

export default class Fit {
    // The ship selected for fitting
    ship: Ship;

    // The character
    character: DogmaEnvironment; // TODO: Character

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

    calculate(resitances: Resistances = this.defaultResistance) {

        // Create a special envrionment for the character.
        this.character = new DogmaEnvironment(0);

        // Reset the environment for the ship and modules
        this.ship.resetEnvironment();

        this.modules.high.forEach(x => x.resetEnvironment());
        this.modules.mid.forEach(x => x.resetEnvironment());
        this.modules.low.forEach(x => x.resetEnvironment());

        this.drones.forEach(x => x.resetEnvironment());
        this.skills.forEach(x => x.resetEnvironment());
        this.implants.forEach(x => x.resetEnvironment());
        this.boosters.forEach(x => x.resetEnvironment());

        this.rigs.forEach(x => x.resetEnvironment());

        // Calculate

        this.applyAllModifiers(this.getPreModifiers());
        this.applyAllModifiers(this.getMidModifiers());
        this.applyAllModifiers(this.getPostModifiers());
    }

    applyAllModifiers(modifierList: [DogmaType, Modifier[]][]) {
        const shipEnvironment = this.ship.environment;
        // const characterEnvironment = this.character.environment;

        // Every type has its own modifiers,
        for (const [selfType, modifiers] of modifierList) {
            for (const modifier of modifiers) {

                // Check what environment or environments this modifier modifies
                if (modifier.environmentType === DogmaEnvironmentType.CHARACTER) {

                    // IF the modifier has a filter, apply it to things in the character environment
                    if (modifier.getFilter()) {
                        for (const module of [...this.drones].filter(x => modifier.getFilter().contains(x))) {
                            modifier.applyModifier(selfType.environment, module.environment);
                        }
                    } else {
                        // IF there is no filter on the modifier, apply it to the character itself
                        modifier.applyModifier(selfType.environment, this.character);
                    }
                } else if (modifier.environmentType === DogmaEnvironmentType.SHIP) {
                    // If there is a filter, then this modifiers applies to modules in the filter
                    if (modifier.getFilter()) {
                        for (const module of [...this.modules.low, ...this.modules.mid, ...this.modules.high].filter(x => modifier.getFilter().contains(x))) {
                            modifier.applyModifier(selfType.environment, module.environment);
                        }
                    } else {

                        // Apply this modifier to the ship itself.
                        modifier.applyModifier(selfType.environment, this.ship.environment);
                    }
                } else if (modifier.environmentType === DogmaEnvironmentType.OTHER) {
                    if (selfType instanceof Charge) {
                        modifier.applyModifier(selfType.environment, (selfType as Charge).container.environment);
                    }
                    if (selfType instanceof Module && selfType.charge) {
                        modifier.applyModifier(selfType.environment, selfType.charge.environment);
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


    getShieldResistance(): Resistances {
        let em = this.ship.environment.getAttributeValueByName('shieldEmDamageResonance');
        let thermal = this.ship.environment.getAttributeValueByName('shieldThermalDamageResonance');
        let kinetic = this.ship.environment.getAttributeValueByName('shieldKineticDamageResonance');
        let explosive = this.ship.environment.getAttributeValueByName('shieldExplosiveDamageResonance');

        return {
            em: em,
            thermal: thermal,
            kinetic: kinetic,
            explosive: explosive
        };
    }

    getArmorResistance(): Resistances {
        let em = this.ship.environment.getAttributeValueByName('armorEmDamageResonance');
        let thermal = this.ship.environment.getAttributeValueByName('armorThermalDamageResonance');
        let kinetic = this.ship.environment.getAttributeValueByName('armorKineticDamageResonance');
        let explosive = this.ship.environment.getAttributeValueByName('armorExplosiveDamageResonance');

        return {
            em: em,
            thermal: thermal,
            kinetic: kinetic,
            explosive: explosive
        };
    }

    getHullResistance(): Resistances {
        let em = this.ship.environment.getAttributeValueByName('emDamageResonance');
        let thermal = this.ship.environment.getAttributeValueByName('thermalDamageResonance');
        let kinetic = this.ship.environment.getAttributeValueByName('kineticDamageResonance');
        let explosive = this.ship.environment.getAttributeValueByName('explosiveDamageResonance');

        return {
            em: em,
            thermal: thermal,
            kinetic: kinetic,
            explosive: explosive
        };
    }

}
