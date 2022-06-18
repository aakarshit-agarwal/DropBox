import IRepository from "./../repository/IRepository";
import MetadataRepository from "./../repository/MetadataRepository";
import IService from "./IService";
import CreateMetadataRequestModel from '@dropbox/common_library/models/dto/CreateMetadataRequestModel';
import UpdateMetadataRequestModel from '@dropbox/common_library/models/dto/UpdateMetadataRequestModel';
import MetadataModel from '@dropbox/common_library/models/data/MetadataModel';
import Validation from '@dropbox/common_library/utils/Validation';
import HttpError from '@dropbox/common_library/error/HttpError';
import { randomUUID } from "crypto";
import EventPublisher from "./../events/EventPublisher";

export default class MetadataService implements IService{
    private metadataRepository: IRepository;
    private eventPublished: EventPublisher;

    constructor() {
        this.metadataRepository = new MetadataRepository();
        this.eventPublished = new EventPublisher();
    }

    async createMetadata(createMetadataRequest: CreateMetadataRequestModel): Promise<MetadataModel> {
        this.validateInputs(createMetadataRequest);
        let newMetadataInput: MetadataModel = {
            _id: randomUUID(),
            ...createMetadataRequest
        }
        let result = await this.metadataRepository.saveMetadata(newMetadataInput);
        this.eventPublished.createMetadata(result);
        return result;
    }

    async getMetadata(id: string): Promise<MetadataModel> {
        let metadata = await this.metadataRepository.getMetadata(id);
        if(metadata == null) {
            throw new HttpError(400, "Invalid metadataId input");
        }
        return metadata;
    }
    
    async getMetadataByResourceId(resourceId: string): Promise<MetadataModel> {
        let metadata = await this.metadataRepository.getMetadataByResourceId(resourceId);
        if(metadata == null) {
            throw new HttpError(400, "Invalid metadataId input");
        }
        return metadata;
    }
    
    async updateMetadata(id: string, updateMetadataRequest: UpdateMetadataRequestModel): Promise<MetadataModel> {
        let existingMetadata = await this.metadataRepository.getMetadata(id);
        if(existingMetadata == null) {
            throw new HttpError(400, "Invalid metadataId input");
        }
        existingMetadata.resourceType = updateMetadataRequest.resourceType !== undefined? updateMetadataRequest.resourceType! : existingMetadata.resourceType;
        existingMetadata.name = updateMetadataRequest.name !== undefined? updateMetadataRequest.name! : existingMetadata.name;
        existingMetadata.lastAccessedOn = updateMetadataRequest.lastAccessedOn !== undefined? updateMetadataRequest.lastAccessedOn! : existingMetadata.lastAccessedOn;
        existingMetadata.lastAccessedBy = updateMetadataRequest.lastAccessedBy !== undefined? updateMetadataRequest.lastAccessedBy! : existingMetadata.lastAccessedBy;

        let result = await this.metadataRepository.saveMetadata(existingMetadata);
        this.eventPublished.updateMetadata(result);
        return result;
    }

    async deleteMetadata(id: string): Promise<void> {
        await this.metadataRepository.deleteMetadata(id);
        this.eventPublished.deleteMetadata(id);
    }

    private validateInputs(data: CreateMetadataRequestModel) {
        if(!Validation.validateString(data.name)) {
            throw new HttpError(400, "Invalid resource name input");
        }
    }
}