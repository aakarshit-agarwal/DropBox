export default interface DirectoryModel {
    _id: string,
    files: string[],
    directories: string[],
    metadataId: string,
    parentId: string
}
