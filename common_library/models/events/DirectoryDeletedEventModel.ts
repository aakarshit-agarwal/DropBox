import DirectoryTypeModel from "./../data/DirectoryTypeModel";

export default class DirectoryDeletedEventModel {
    public _id: string;
    public files: string[];
    public directories: string[];
    public parentId: string;
    public owner: string;
    public type: DirectoryTypeModel;
    public metadataId?: string;
}
