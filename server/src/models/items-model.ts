import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
class Item implements IStorable {
    public readonly id;
    public readonly content;
    constructor(name: string, description: string, quantity: number, id?: string) {
        this.id = id || uuidv4();
        this.content = {
            name,
            description,
            quantity
        }
    }

    static toCSVString(item: Item){
        let output = `id`;
        const keys = Object.keys(item.content);
        const values = Object.values(item.content);
        for(const key of keys){
            output+= `,${key}`;
        }
        output+= `\n${item.id}`;
        for(const value of values){
            output+= `,${value}`;
        }
        return output;
    }
    
    static getSchema(): Joi.ObjectSchema {
        return Joi.object({
            name: Joi.string().max(50).required(),
            description: Joi.string().max(500),
            quantity: Joi.number().min(0).required()
        });
    }

    static getSchemaWithId(): Joi.ObjectSchema {
        return Joi.object({
            id: Joi.string().max(36).min(36).required(),
            name: Joi.string().max(50).required(),
            description: Joi.string().max(500),
            quantity: Joi.number().min(0).required()
        });
    }
}

interface IStorable {
    id: string;
    content: any;
}

export {Item, IStorable};