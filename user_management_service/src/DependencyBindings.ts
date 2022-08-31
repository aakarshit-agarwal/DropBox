// Package Imports
import "reflect-metadata";
import {Container} from "inversify";
import express, { Application } from "express";

// Common Library Imports
import Logging from '@dropbox/common_library/logging/Logging';
import MongoDb from "@dropbox/common_library/components/database/MongoDb";
import Kakfa from "@dropbox/common_library/components/messageBroker/Kafka";

// Local Imports
import TYPES from './DependencyTypes';
import UserController from "./controllers/UserController";
import UserRepository from "./repository/UserRepository";
import UserService from "./service/UserService";
import EventPublisher from "./events/EventPublisher";
import EventReceiver from "./events/EventReceiver";
import UserManagementApplication from "./application";

let container = new Container();

// Common Library Bindings
container.bind<Logging>(TYPES.Logger).to(Logging).inSingletonScope();
container.bind<MongoDb>(TYPES.Database).to(MongoDb).inSingletonScope();
container.bind<Kakfa>(TYPES.MessageBroker).to(Kakfa).inSingletonScope();

// String Bindings
container.bind<string>("SERVICE_NAME").toConstantValue(process.env.USER_MANAGEMENT_SERVICE_NAME!);
container.bind<string>("DATABASE_HOST").toConstantValue(process.env.DATABASE_HOST!);
container.bind<number>("DATABASE_PORT").toConstantValue(process.env.DATABASE_PORT! as unknown as number);
container.bind<string>("DATABASE_NAME").toConstantValue(process.env.USER_MANAGEMENT_SERVICE_DATABASE_NAME!);
container.bind<string>("MESSAGE_BROKER_HOST").toConstantValue(process.env.KAFKA_HOST!);
container.bind<number>("MESSAGE_BROKER_PORT").toConstantValue(process.env.KAFKA_PORT! as unknown as number);

// Application Bindings
container.bind<Application>(TYPES.Application).toConstantValue(express());
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
container.bind<EventPublisher>(TYPES.EventPublisher).to(EventPublisher).inSingletonScope();
container.bind<EventReceiver>(TYPES.EventReceiver).to(EventReceiver).inSingletonScope();
container.bind<UserManagementApplication>(TYPES.UserManagementService).to(UserManagementApplication).inSingletonScope();


export default container;