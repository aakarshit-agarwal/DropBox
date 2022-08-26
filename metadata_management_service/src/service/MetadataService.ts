import IRepository from "./../repository/IRepository";
import IService from "./IService";
import CreateMetadataRequestModel from '@dropbox/common_library/models/dto/CreateMetadataRequestModel';
import UpdateMetadataRequestModel from '@dropbox/common_library/models/dto/UpdateMetadataRequestModel';
import MetadataModel from '@dropbox/common_library/models/data/MetadataModel';
import Validation from '@dropbox/common_library/utils/Validation';
import HttpError from '@dropbox/common_library/error/HttpError';
import { randomUUID } from "crypto";
import EventPublisher from "./../events/EventPublisher";
import Logging from "@dropbox/common_library/logging/Logging";
import MetadataRepository from "src/repository/MetadataRepository";

export default class MetadataService implements IService{
    private logger: Logging;
    private metadataRepository: IRepository;
    private eventPublisher: EventPublisher;

    constructor(logger: Logging, metadataRepository: MetadataRepository, eventPublisher: EventPublisher) {
        this.logger = logger;
        this.metadataRepository = metadataRepository;
        this.eventPublisher = eventPublisher;
    }

    async createMetadata(createMetadataRequest: CreateMetadataRequestModel): Promise<MetadataModel> {
        this.logger.logInfo(`Calling createMetadata with createMetadataRequest: ${createMetadataRequest}`);
        this.validateInputs(createMetadataRequest);
        let newMetadataInput: MetadataModel = {
            _id: randomUUID(),
            ...createMetadataRequest
        }
        let result = await this.metadataRepository.saveMetadata(newMetadataInput);
        this.eventPublisher.createMetadata(result);
        this.logger.logInfo(`Returning createMetadata with result: ${result}`);
        return result;
    }

    async getMetadata(id: string): Promise<MetadataModel> {
        this.logger.logInfo(`Calling getMetadata with id: ${id}`);
        let metadata = await this.metadataRepository.getMetadata(id);
        if(metadata == null) {
            throw new HttpError(400, "Invalid metadataId input");
        }
        this.logger.logInfo(`Returning getMetadata with metadata: ${metadata}`);
        return metadata;
    }
    
    async getMetadataByResourceId(resourceId: string): Promise<MetadataModel> {
        this.logger.logInfo(`Calling getMetadataByResourceId with resourceId: ${resourceId}`);
        let metadata = await this.metadataRepository.getMetadataByResourceId(resourceId);
        if(metadata == null) {
            throw new HttpError(400, "Invalid metadataId input");
        }
        this.logger.logInfo(`Returning getMetadataByResourceId with metadata: ${metadata}`);
        return metadata;
    }
    
    async updateMetadata(id: string, updateMetadataRequest: UpdateMetadataRequestModel): Promise<MetadataModel> {
        this.logger.logInfo(`Calling updateMetadata with id: ${id}, updateMetadataRequest: ${updateMetadataRequest}`);
        let existingMetadata = await this.metadataRepository.getMetadata(id);
        if(existingMetadata == null) {
            throw new HttpError(400, "Invalid metadataId input");
        }
        existingMetadata.resourceType = updateMetadataRequest.resourceType !== undefined? updateMetadataRequest.resourceType! : existingMetadata.resourceType;
        existingMetadata.name = updateMetadataRequest.name !== undefined? updateMetadataRequest.name! : existingMetadata.name;
        existingMetadata.lastAccessedOn = updateMetadataRequest.lastAccessedOn !== undefined? updateMetadataRequest.lastAccessedOn! : existingMetadata.lastAccessedOn;
        existingMetadata.lastAccessedBy = updateMetadataRequest.lastAccessedBy !== undefined? updateMetadataRequest.lastAccessedBy! : existingMetadata.lastAccessedBy;

        let result = await this.metadataRepository.saveMetadata(existingMetadata);
        this.eventPublisher.updateMetadata(result);
        this.logger.logInfo(`Returning updateMetadata with result: ${result}`);
        return result;
    }

    async deleteMetadata(id: string): Promise<void> {
        this.logger.logInfo(`Calling deleteMetadata with id: ${id}`);
        await this.metadataRepository.deleteMetadata(id);
        this.eventPublisher.deleteMetadata(id);
        this.logger.logInfo(`Returning deleteMetadata`);
    }

    private validateInputs(data: CreateMetadataRequestModel) {
        if(!Validation.validateString(data.name)) {
            throw new HttpError(400, "Invalid resource name input");
        }
    }
}