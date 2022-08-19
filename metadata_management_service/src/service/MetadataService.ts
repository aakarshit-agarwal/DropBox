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
import Logger from './../logger/Logger';

export default class MetadataService implements IService{
    private metadataRepository: IRepository;
    private eventPublished: EventPublisher;

    constructor() {
        this.metadataRepository = new MetadataRepository();
        this.eventPublished = new EventPublisher();
    }

    async createMetadata(createMetadataRequest: CreateMetadataRequestModel): Promise<MetadataModel> {
        Logger.logInfo(`Calling createMetadata with createMetadataRequest: ${createMetadataRequest}`);
        this.validateInputs(createMetadataRequest);
        let newMetadataInput: MetadataModel = {
            _id: randomUUID(),
            ...createMetadataRequest
        }
        let result = await this.metadataRepository.saveMetadata(newMetadataInput);
        this.eventPublished.createMetadata(result);
        Logger.logInfo(`Returning createMetadata with result: ${result}`);
        return result;
    }

    async getMetadata(id: string): Promise<MetadataModel> {
        Logger.logInfo(`Calling getMetadata with id: ${id}`);
        let metadata = await this.metadataRepository.getMetadata(id);
        if(metadata == null) {
            throw new HttpError(400, "Invalid metadataId input");
        }
        Logger.logInfo(`Returning getMetadata with metadata: ${metadata}`);
        return metadata;
    }
    
    async getMetadataByResourceId(resourceId: string): Promise<MetadataModel> {
        Logger.logInfo(`Calling getMetadataByResourceId with resourceId: ${resourceId}`);
        let metadata = await this.metadataRepository.getMetadataByResourceId(resourceId);
        if(metadata == null) {
            throw new HttpError(400, "Invalid metadataId input");
        }
        Logger.logInfo(`Returning getMetadataByResourceId with metadata: ${metadata}`);
        return metadata;
    }
    
    async updateMetadata(id: string, updateMetadataRequest: UpdateMetadataRequestModel): Promise<MetadataModel> {
        Logger.logInfo(`Calling updateMetadata with id: ${id}, updateMetadataRequest: ${updateMetadataRequest}`);
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
        Logger.logInfo(`Returning updateMetadata with result: ${result}`);
        return result;
    }

    async deleteMetadata(id: string): Promise<void> {
        Logger.logInfo(`Calling deleteMetadata with id: ${id}`);
        await this.metadataRepository.deleteMetadata(id);
        this.eventPublished.deleteMetadata(id);
        Logger.logInfo(`Returning deleteMetadata`);
    }

    private validateInputs(data: CreateMetadataRequestModel) {
        if(!Validation.validateString(data.name)) {
            throw new HttpError(400, "Invalid resource name input");
        }
    }
}