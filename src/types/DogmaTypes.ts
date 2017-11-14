import DogmaExpressionTree from '../core/effects/DogmExpressionTree';

export interface DogmaOperand {
    operandKey: string;
    operandID: number;
    description: string;
    format: string;
    pythonFormat: string;
}

export interface DogmaExpression {
    description: string;
    expressionName: string;
    expressionValue: string;
    arg1: number;
    arg2: number;
    operandID: number;
    expressionID: number;
    expressionAttributeID: number;
    expressionTypeID: number;
    expressionGroupID: number;

    tree: DogmaExpressionTree;
}

export interface DogmaAttribute {
    description: string;
    attributeID: number;
    attributeName: string;
    defaultValue: number;
}
