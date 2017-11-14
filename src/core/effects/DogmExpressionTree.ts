import CacheHandler from '../CacheHandler';
import {DogmaExpression, DogmaOperand, DogmaAttribute} from '../../types/DogmaTypes';
import {DogmaEnvironmentType} from '../modifier/DogmaEnvironment';
import {DogmaAssociation} from '../modifier/Modifier';

export default class DogmaExpressionTree {
    id: number;

    arg1: DogmaExpressionTree;
    arg2: DogmaExpressionTree;

    operandId: number;

    expression: DogmaExpression;
    operand: DogmaOperand;

    constructor(id, expression, operandId) {
        this.id = id;
        this.expression = expression;
        this.operandId = operandId;
        this.operand = CacheHandler.GetCacheHandler().GetOperand(operandId);
    }

    static BuildTree(id: number) {

        const expression = CacheHandler.GetCacheHandler().GetEffectExpression(id);

        if (expression.tree) {
            // If the expression tree already exists, return the tree.
            return expression.tree;
        } else {
            // If the expression tree does not yet exist, build it.
            const root = new DogmaExpressionTree(id, expression, expression.operandID);

            if (expression.arg1 !== null) {
                root.arg1 = DogmaExpressionTree.BuildTree(expression.arg1);
            }
            if (expression.arg2 !== null) {
                root.arg2 = DogmaExpressionTree.BuildTree(expression.arg2);
            }
            return root;
        }
    }

    PrintFormat(): string {
        const s1 = this.arg1 ? this.arg1.PrintFormat() : '';
        const s2 = this.arg2 ? this.arg2.PrintFormat() : '';

        let value = this.expression.expressionValue;
        const operandFormat = this.operand.format;

        if (value === null) {
            value = this.expression.expressionName;
        }

        return operandFormat.replace('%(arg1)s', s1).replace('%(arg2)s', s2).replace('%(value)s', value);
    }

}
