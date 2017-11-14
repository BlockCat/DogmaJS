import DogmaType from "../DogmaType";

export default class Skill extends DogmaType {

    skillLevel: number;

    constructor(skillId, skillLevel) {
        super(skillId);
        this.skillLevel = skillLevel;
        this.environment.setAttributeValue('skillLevel', skillLevel);
    }
}