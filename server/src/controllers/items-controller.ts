import {Item} from "../models/items-models";
import {dbInstance} from "../db/database";
import Joi from 'joi';
import express from 'express';
interface Controller {
    listAll(request: express.Request, response: express.Response, next: express.NextFunction): void;
    create(request: express.Request, response: express.Response, next: express.NextFunction): void;
    update(request: express.Request, response: express.Response, next: express.NextFunction): void;
    delete(request: express.Request, response: express.Response, next: express.NextFunction): void;
    deleteAll(request: express.Request, response: express.Response, next: express.NextFunction): void;
}
class ItemController implements Controller {
    private readonly collectionName = 'items';
    listAll = (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const allItems = dbInstance.get(this.collectionName);
        if(allItems){
            response.status(200).json(allItems);
        } else {
            response.sendStatus(404);
        }
        next();
    }
    create = (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const validationResult = validateItem(request.body);
        if(!validationResult.value){
            response.sendStatus(422);
        } else {
            const { value } = validationResult;
            const item = new Item(value.name, value.description);
            dbInstance.save(this.collectionName, item);
            response.status(201).json(item);
        }
        next();
    }

    delete = (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        if(!validateHasId(request.body)){
            response.sendStatus(422);
        } else {
            const deletionResult = dbInstance.delete(this.collectionName, request.body.id);
            if(!deletionResult){
                response.sendStatus(404);
            } else {
                response.sendStatus(200);
            }
        }
        next();
    }

    deleteAll = (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const deletionResult = dbInstance.delete(this.collectionName);    
        if(!deletionResult){
            response.sendStatus(404);
        } else {
            response.sendStatus(200);
        }
        next();
    }

    update = (request: express.Request, response: express.Response, next: express.NextFunction) =>{
        const validationResult = validateItemWithId(request.body);
        if(!validationResult){
            response.sendStatus(422);
        } else {
            
        }
    }
}

function validateHasId(requestBody: any){
    const schema = Joi.object({
        id: Joi.string().max(36).min(36).required()
    });
    const result = schema.validate(requestBody);
    return result.value ? true : false;
}

function validateItemWithId(requestBody: any){
    const schema = Item.getSchemaWithId();
    return schema.validate(requestBody);
}

function validateItem(requestBody: any){
    const schema = Item.getSchema();
    return schema.validate(requestBody);
}


const controller: Controller = new ItemController();
export default controller;