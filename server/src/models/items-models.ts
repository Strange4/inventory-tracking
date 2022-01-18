import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
class Item implements IStorable {
    public readonly id;
    public readonly content;
    constructor(name: string, description: string) {
        this.id = uuidv4();
        this.content = {
            name,
            description
        }
    }

    static getSchema(): Joi.ObjectSchema<any> {
        return Joi.object({
            name: Joi.string().max(50).required(),
            description: Joi.string().max(500)
        });
    }
}

interface IStorable {
    id: string;
    content: any;
}

export {Item, IStorable};