export default class CreateDirectoryRequestModel {
    public parentId: string;
    public name: string;

    constructor(parentId: string, name: string) {
        this.parentId = parentId;
        this.name = name;
    }
}
