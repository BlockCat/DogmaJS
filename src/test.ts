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

// https://zkillboard.com/kill/66006406/
const fit = new Fit();
fit.ship = new Ship(17740);

CacheHandler.GetCacheHandler()

fit.skills.push(new Skill(3336, 5));
fit.skills.push(new Skill(3337, 5));
fit.skills.push(new Skill(3413, 5));
fit.skills.push(new Skill(12209, 5));

// neutron blaster cannon II with Void L
fit.modules.high.push(new Module(3186, ModuleLocation.HIGH, ModuleState.ACTIVE, new Charge(12791)));
fit.modules.high.push(new Module(3186, ModuleLocation.HIGH, ModuleState.ACTIVE, new Charge(12791)));
fit.modules.high.push(new Module(3186, ModuleLocation.HIGH, ModuleState.ACTIVE, new Charge(12791)));
fit.modules.high.push(new Module(3186, ModuleLocation.HIGH, ModuleState.ACTIVE, new Charge(12791)));

fit.modules.high.push(new Module(3186, ModuleLocation.HIGH, ModuleState.ACTIVE, new Charge(12791)));
fit.modules.high.push(new Module(3186, ModuleLocation.HIGH, ModuleState.ACTIVE, new Charge(12791)));
fit.modules.high.push(new Module(3186, ModuleLocation.HIGH, ModuleState.ACTIVE, new Charge(12791)));
fit.modules.high.push(new Module(3186, ModuleLocation.HIGH, ModuleState.ACTIVE, new Charge(12791)));


fit.modules.mid.push(new Module(14258, ModuleLocation.MID, ModuleState.ACTIVE));
fit.modules.mid.push(new Module(14174, ModuleLocation.MID, ModuleState.ACTIVE));
fit.modules.mid.push(new Module(41220, ModuleLocation.MID, ModuleState.ACTIVE));
fit.modules.mid.push(new Module(19335, ModuleLocation.MID, ModuleState.ACTIVE));
fit.modules.mid.push(new Module(14268, ModuleLocation.MID, ModuleState.ACTIVE));

fit.modules.low.push(new Module(31900, ModuleLocation.LOW, ModuleState.ACTIVE));
fit.modules.low.push(new Module(31900, ModuleLocation.LOW, ModuleState.ACTIVE));
fit.modules.low.push(new Module(41201, ModuleLocation.LOW, ModuleState.ACTIVE));
fit.modules.low.push(new Module(18851, ModuleLocation.LOW, ModuleState.ACTIVE));
fit.modules.low.push(new Module(18851, ModuleLocation.LOW, ModuleState.ACTIVE));

fit.rigs.push(new Rig(26302));
fit.rigs.push(new Rig(26302));
fit.rigs.push(new Rig(26006));

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
    document.getElementById('shield_hp').innerHTML = fit.ship.environment.getAttributeValueByName('shieldCapacity').toFixed(0)+ '';
    document.getElementById('armor_hp').innerHTML = (fit.ship.environment.getAttributeValueByName('armorHP') + fit.ship.environment.getAttributeValueByName('armorHPBonusAdd')).toFixed(0) + '';
    document.getElementById('hull_hp').innerHTML = fit.ship.environment.getAttributeValueByName('hp') + '';

    let shieldResistances = fit.getShieldResistance();
    let armorResistances = fit.getArmorResistance();
    let hullResistance = fit.getHullResistance();


    document.getElementById('shield_em').innerHTML = ((1 - shieldResistances.em) * 100).toFixed(1) + '%';
    document.getElementById('shield_kinetic').innerHTML = ((1 - shieldResistances.kinetic) * 100).toFixed(1) + '%';
    document.getElementById('shield_explosive').innerHTML = ((1 - shieldResistances.explosive) * 100).toFixed(1) + '%';
    document.getElementById('shield_heat').innerHTML = ((1 -shieldResistances.thermal) * 100).toFixed(1) + '%';

    document.getElementById('armor_em').innerHTML = ((1 - armorResistances.em) * 100).toFixed(1) + '%';
    document.getElementById('armor_kinetic').innerHTML = ((1 - armorResistances.kinetic) * 100).toFixed(1) + '%';
    document.getElementById('armor_explosive').innerHTML = ((1 - armorResistances.explosive) * 100).toFixed(1) + '%';
    document.getElementById('armor_heat').innerHTML = ((1 -armorResistances.thermal) * 100).toFixed(1) + '%';

    document.getElementById('hull_em').innerHTML = ((1 - hullResistance.em) * 100).toFixed(1) + '%';
    document.getElementById('hull_kinetic').innerHTML = ((1 - hullResistance.kinetic) * 100).toFixed(1) + '%';
    document.getElementById('hull_explosive').innerHTML = ((1 - hullResistance.explosive) * 100).toFixed(1) + '%';
    document.getElementById('hull_heat').innerHTML = ((1 -hullResistance.thermal) * 100).toFixed(1) + '%';

    let highParent = document.getElementById('high_mod');
    for (const highModule of fit.modules.high) {
        let typeh1 = '<p>' + highModule.typeId + '</p>'
        let extra = '';
        console.log(highModule);

        extra += '<p>Range: ' + highModule.environment.getAttributeValueByName('maxRange') + '</p>';
        extra += '<p>Falloff: ' + highModule.environment.getAttributeValueByName('falloff') + '</p>';
        if (highModule.charge) {
            let damageModifier = highModule.environment.getAttributeValueByName('damageMultiplier');
            let emDamage = highModule.charge.environment.getAttributeValueByName('emDamage') * damageModifier;
            let heatDamage = highModule.charge.environment.getAttributeValueByName('thermalDamage') * damageModifier;
            let kineticDamage = highModule.charge.environment.getAttributeValueByName('kineticDamage') * damageModifier;
            let explosiveDamage = highModule.charge.environment.getAttributeValueByName('explosiveDamage') * damageModifier;

            extra += '<p>';
            extra += 'damageModifier: ' + damageModifier.toFixed(1) + ';</br>';
            extra += 'em damage: ' + (emDamage).toFixed(0) + ';</br> ';
            extra += 'heat damage: ' + (heatDamage).toFixed(0) + ';</br> ';
            extra += 'kinetic damage: ' + (kineticDamage ).toFixed(0)+ ';</br> ';
            extra += 'explosive damage: ' + (explosiveDamage ).toFixed(0) + ';</br> ';
            extra += '</p>';
        }
        highParent.insertAdjacentHTML('beforeend', '<div>' + typeh1 + extra + '</div>');
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

