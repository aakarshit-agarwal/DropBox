export default class CreateDirectoryRequestModel {
    public parentId?: string;

    constructor(parentId: string) {
        this.parentId = parentId;
    }
}
