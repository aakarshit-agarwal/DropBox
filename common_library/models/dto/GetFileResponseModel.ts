export default class GetFileResponseModel {
    public filePath: string;
    public fileName: string;

    constructor(filePath: string, fileName: string) {
        this.filePath = filePath;
        this.fileName = fileName;
    }
}
