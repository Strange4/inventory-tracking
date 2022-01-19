import {IStorable, Item} from "../models/items-model";
import {dbInstance} from "../db/database";
import Joi from 'joi';
import express from 'express';
interface Controller {
    listAll(request: express.Request, response: express.Response, next: express.NextFunction): void;
    create(request: express.Request, response: express.Response, next: express.NextFunction): void;
    update(request: express.Request, response: express.Response, next: express.NextFunction): void;
    delete(request: express.Request, response: express.Response, next: express.NextFunction): void;
    deleteAll(request: express.Request, response: express.Response, next: express.NextFunction): void;
    toCSVString(request: express.Request, response: express.Response, next: express.NextFunction): void;
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
        if(!validationResult){
            response.sendStatus(422);
        } else {
            const item = new Item(validationResult.name, validationResult.description);
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
            const item = new Item(validationResult.name, validationResult.description, validationResult.id);
            const updateResult = dbInstance.update(this.collectionName, validationResult);
            updateResult ?  response.status(200).json(dbInstance.get(this.collectionName, item.id)) : response.status(404).send('no item with that id');
        }
        next();
    }

    toCSVString = (request: express.Request, response: express.Response, next: express.NextFunction) =>{
        if(!validateHasId(request.body)){
            response.sendStatus(422);
        } else {
            const item = dbInstance.get(this.collectionName, request.body.id) as IStorable | undefined;
            if(item){
                const output = Item.toCSVString(item);
                response.status(200).send(output);
            } else {
                response.status(404).send('item not found');
            }

        }
        next();
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
    return schema.validate(requestBody).value;
}

function validateItem(requestBody: any){
    const schema = Item.getSchema();
    return schema.validate(requestBody).value;
}


const controller: Controller = new ItemController();
export default controller;