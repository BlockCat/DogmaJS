export class Filter {

}

export class TypeFilter extends Filter {

    private typeId: number;

    constructor(typeId: number) {
        super();
        this.typeId = typeId;
    }
}

export class GroupFilter extends Filter {

    private groupId: number;

    constructor(groupId: number) {
        super();
        this.groupId = groupId;
    }
}
