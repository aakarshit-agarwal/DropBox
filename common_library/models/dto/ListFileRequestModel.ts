export default class ListFileRequestModel {
    userId: string;
    parentId?: string;
    filename?: string;

    constructor(userId: string, parentId?: string, filename?: string) {
        this.userId = userId;
        this.parentId = parentId;
        this.filename = filename;
    }
}
