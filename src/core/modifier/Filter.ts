import DogmaType from '../modules/DogmaType';

export abstract class Filter {
    abstract contains(type: DogmaType);
}

// This is more or less a skill filter, all modules that require the skill.
export class TypeFilter extends Filter {

    private typeId: number;

    constructor(typeId: number) {
        super();
        this.typeId = typeId;
    }

    contains(type: DogmaType) {
        return type.getSkillRequirements().indexOf(this.typeId) !== -1;
    }
}

export class GroupFilter extends Filter {

    private groupId: number;

    constructor(groupId: number) {
        super();
        this.groupId = groupId;
    }

    contains(type: DogmaType) {
        return type.getGroupId() === this.groupId;
    }
}
