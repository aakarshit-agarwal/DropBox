import DirectoryTypeModel from "./../data/DirectoryTypeModel";

export default class CreateDirectoryRequestModel {
    public parentId: string;
    public name: string;
    public type: DirectoryTypeModel

    constructor(parentId: string, name: string, type: DirectoryTypeModel = DirectoryTypeModel.COMMON) {
        this.parentId = parentId;
        this.name = name;
        this.type = type;
    }
}
