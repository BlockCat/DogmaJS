
import DogmaExpressionTree from './DogmExpressionTree';
import Modifier, {DogmaAssociation} from '../modifier/Modifier';
import CacheHandler from '../CacheHandler';
import {DogmaEnvironmentType} from '../modifier/DogmaEnvironment';
import {GroupFilter, TypeFilter} from '../modifier/Filter';

export default class DogmaEffect {

    effectId: number;
    preExpressionId: number;
    name: string;
    description: string;

    printFormat: string;

    private modifiers: Modifier[] = null;

    constructor(effectId: number, description: string, name: string, preExpressionId: number) {
        this.effectId = effectId;
        this.preExpressionId = preExpressionId;
        this.name = name;
        this.description = description;
        this.printFormat = null;
    }

    getExpressionTree(): DogmaExpressionTree {
        return DogmaExpressionTree.BuildTree(this.preExpressionId);
    }

    getModifiers(): Modifier[] {
        if (this.modifiers === null) {
            console.log('Loading effect modifiers');
            this.modifiers = [];
            this.Parse(this.getExpressionTree());
        }
        return this.modifiers;
    }

    Parse(tree: DogmaExpressionTree ) {
        if (tree.operand.operandKey === 'COMBINE') {
            this.Parse(tree.arg1);
            this.Parse(tree.arg2);
            return;
        }

        if (!['AGGM', 'AGIM', 'AGORSM', 'AGRSM', 'AIM', 'ALGM', 'ALM', 'ALRSM', 'AORSM', ].some(x => x === tree.operand.operandKey)) {
            console.log('Invalid expression tree: ' + tree.operand.operandKey);
            return;
        }

        // Get the attribute from an expression
        const changeAttribute = CacheHandler.GetCacheHandler().GetAttribute(tree.arg2.expression.expressionAttributeID);
        const association = tree.arg1.arg1.expression.expressionName as DogmaAssociation;
        const targetAttribute = CacheHandler.GetCacheHandler().GetAttribute(tree.arg1.arg2.arg2.expression.expressionAttributeID);

        const newModifier =  new Modifier(association, targetAttribute, changeAttribute);
        let dogmaEnvironmentType;
        // Type filter (skill)
        if (tree.arg1.arg2.arg1.operand.operandKey === 'LS') {
            const filterType = tree.arg1.arg2.arg1.arg2.expression.expressionTypeID;
            dogmaEnvironmentType = tree.arg1.arg2.arg1.arg1.expression.expressionName as DogmaEnvironmentType;
            newModifier.setFilter(new TypeFilter(filterType));
        } else if (tree.arg1.arg2.arg1.operand.operandKey === 'LG') {
            // Group filter
            const filterGroup = tree.arg1.arg2.arg1.arg2.expression.expressionTypeID;
            dogmaEnvironmentType = tree.arg1.arg2.arg1.arg1.expression.expressionName as DogmaEnvironmentType;
            newModifier.setFilter(new GroupFilter(filterGroup));
        } else {
            dogmaEnvironmentType = tree.arg1.arg2.arg1.expression.expressionName as DogmaEnvironmentType;
        }

        newModifier.setEnvironmentType(dogmaEnvironmentType);

        console.log('Modifier loaded:', newModifier);

        this.modifiers.push(newModifier);
    }
}
