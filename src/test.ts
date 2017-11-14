import Fit from './core/Fit';
import Ship from './core/Ship';
import Module from './core/modules/Module';
import {ModuleLocation, ModuleState} from './core/modules/ModuleState';
import Charge from './core/modules/Charge';
import Rig from './core/modules/Rig';
import Implant from './core/modules/skills/Implant';
import Booster from './core/modules/skills/Booster';
import CacheHandler from './core/CacheHandler';
import Skill from './core/modules/skills/Skill';

const fit = new Fit();
fit.ship = new Ship(17740);

fit.skills.push(new Skill(3336, 5));
fit.skills.push(new Skill(3337, 5));
fit.skills.push(new Skill(3413, 5));
fit.skills.push(new Skill(12209, 5));

fit.modules.high.push(new Module(12356, ModuleLocation.HIGH, ModuleState.ACTIVE, new Charge(12803)));
fit.modules.high.push(new Module(12356, ModuleLocation.HIGH, ModuleState.ACTIVE, new Charge(12803)));
fit.modules.high.push(new Module(12356, ModuleLocation.HIGH, ModuleState.ACTIVE, new Charge(12803)));
fit.modules.high.push(new Module(12356, ModuleLocation.HIGH, ModuleState.ACTIVE, new Charge(12803)));

fit.modules.high.push(new Module(12356, ModuleLocation.HIGH, ModuleState.ACTIVE, new Charge(12803)));
fit.modules.high.push(new Module(12356, ModuleLocation.HIGH, ModuleState.ACTIVE, new Charge(12803)));
fit.modules.high.push(new Module(12356, ModuleLocation.HIGH, ModuleState.ACTIVE, new Charge(12803)));
fit.modules.high.push(new Module(12356, ModuleLocation.HIGH, ModuleState.ACTIVE, new Charge(12803)));

fit.modules.mid.push(new Module(5945, ModuleLocation.MID, ModuleState.ACTIVE));
fit.modules.mid.push(new Module(4833, ModuleLocation.MID, ModuleState.ACTIVE));
fit.modules.mid.push(new Module(9622, ModuleLocation.MID, ModuleState.ACTIVE));
fit.modules.mid.push(new Module(5443, ModuleLocation.MID, ModuleState.ACTIVE));
fit.modules.mid.push(new Module(2281, ModuleLocation.MID, ModuleState.ACTIVE));

fit.modules.low.push(new Module(2048, ModuleLocation.LOW, ModuleState.ACTIVE));
fit.modules.low.push(new Module(519, ModuleLocation.LOW, ModuleState.ACTIVE));
fit.modules.low.push(new Module(519, ModuleLocation.LOW, ModuleState.ACTIVE));
fit.modules.low.push(new Module(22291, ModuleLocation.LOW, ModuleState.ACTIVE));
fit.modules.low.push(new Module(22291, ModuleLocation.LOW, ModuleState.ACTIVE));
fit.modules.low.push(new Module(4405, ModuleLocation.LOW, ModuleState.ACTIVE));
fit.modules.low.push(new Module(4405, ModuleLocation.LOW, ModuleState.ACTIVE));

fit.rigs.push(new Rig(26082));
fit.rigs.push(new Rig(26082));
fit.rigs.push(new Rig(26082));

fit.implants.push(new Implant(13231));
fit.implants.push(new Implant(10228));
fit.implants.push(new Implant(24663));
fit.implants.push(new Implant(13244));
fit.implants.push(new Implant(13219));

fit.boosters.push(new Booster(28672));
fit.boosters.push(new Booster(28674));

fit.calculate();

window['fit'] = fit;

const printItem = function(typeId: number) {
    const itemEffects = CacheHandler.GetCacheHandler().GetTypeEffects(typeId);
    const itemAttributes = CacheHandler.GetCacheHandler().GetTypeAttributes(typeId);
    console.log('Amount of effects: ', itemEffects.length);
    for (const effect of itemEffects) {
        console.log(effect[0].getExpressionTree().PrintFormat(), effect[0].getExpressionTree());
    }

    for (const attribute of itemAttributes) {
        console.log(attribute[0].attributeName, ': ', attribute[0].description, '{' + attribute[1] + '}');
    }
};

const loadFit = function(fit: Fit) {
    const parent = document.getElementById('attributeBody');
    parent.innerHTML = '';

    const attributes = fit.ship.environment.attributes;

    for (const attributeName of Object.keys(attributes)) {

        const attrib = '<td>' + attributeName + '</td>';
        const descr = '<td></td>';
        const value = '<td>' + attributes[attributeName] + '</td>';

        const nChild = '<tr>' + attrib + value + descr + '</tr>';

        parent.insertAdjacentHTML('beforeend', nChild);
    }
};

window['loadFit'] = loadFit;


window['printItem'] = printItem;

window['CacheHandler'] = CacheHandler.GetCacheHandler();


window['loadAttributes'] = function(typeId: number) {
    const parent = document.getElementById('attributeBody');
    parent.innerHTML = '';

    const itemAttributes = CacheHandler.GetCacheHandler().GetTypeAttributes(typeId);

    for (const attribute of itemAttributes) {

        const attrib = '<td>' + attribute[0].attributeName + '</td>';
        const descr = '<td>' + attribute[0].description + '</td>';
        const value = '<td>' + attribute[1] + '</td>';

        const nChild = '<tr>' + attrib + value + descr + '</tr>';

        parent.insertAdjacentHTML('beforeend', nChild);
    }
};

window['loadEffects'] = function(typeId: number) {
    const parent = document.getElementById('effectsBody');
    parent.innerHTML = '';

    const itemEffects = CacheHandler.GetCacheHandler().GetTypeEffects(typeId);

    for (const [effect, def] of itemEffects) {
        const expression = '<td>' + effect.getExpressionTree().PrintFormat() + '</td>';
        const descr = '<td>' + effect.effectId + ': ' + effect.description + '</td>';

        const nChild = '<tr>' + descr + expression + '</tr>';

        parent.insertAdjacentHTML('beforeend', nChild);

        for (const modifier of effect.getModifiers()) {
            console.log(modifier);
        }
    }

};

window['getTypesAvailable'] = function() {
    const types = CacheHandler.GetCacheHandler().GetTypesBound().map(x => '<option value="' + x  + '">' + x + '</option>');
    const parent = document.getElementById('input');
    parent.innerHTML = types.join('');
};

