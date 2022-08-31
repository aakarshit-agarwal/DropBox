// Package Imports

// Common Library Imports
import GlobalTypes from "@dropbox/common_library/GlobalTypes";

// Local Imports

const DependencyTypes = {
    ...GlobalTypes,
    Application: Symbol.for("Application"),
    UserRepository: Symbol.for("UserRepository"),
    UserService: Symbol.for("UserService"),
    UserController: Symbol.for("UserController"),
    EventPublisher: Symbol.for("EventPublisher"),
    EventReceiver: Symbol.for("EventReceiver")
};

export default DependencyTypes;