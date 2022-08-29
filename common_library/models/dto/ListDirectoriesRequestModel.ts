import DirectoryTypeModel from "./../data/DirectoryTypeModel";

export default class CreateDirectoryRequestModel {
    public parentId?: string;
    public type?: DirectoryTypeModel

    constructor(parentId?: string, type?: DirectoryTypeModel) {
        this.parentId = parentId;
        this.type = type;
    }
}
