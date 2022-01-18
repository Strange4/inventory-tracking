import {Item} from "../models/items-models";
import {dbInstance} from "../db/database";
import Joi from 'joi';
import express from 'express';
interface Controller {
    listAll(request: express.Request, response: express.Response, next: express.NextFunction): void;
    create(request: express.Request, response: express.Response, next: express.NextFunction): void;
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
            response.sendStatus(201);
        }
        next();
    }
}

function validateItem(requestBody: any){
    const schema = Item.getSchema();
    return schema.validate(requestBody);
}


const controller: Controller = new ItemController();
export default controller;