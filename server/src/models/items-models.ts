import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
class Item {
    public readonly id;
    public readonly name;
    public readonly description;
    constructor(name: string, description: string){
        this.id = uuidv4();
        this.name = name;
        this.description = description;
    }

    static getSchema(): Joi.ObjectSchema<any> {
        return Joi.object({
            name: Joi.string().max(50).required(),
            description: Joi.string().max(500)
        });
    }
}

export default Item;