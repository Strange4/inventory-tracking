import { IStorable } from "../models/items-models";

interface IDatabase{
    save(collectionName: string, document:IStorable): void;
    get(collectionName: string): IStorable[] | undefined;
    delete(collectionName: string): boolean;
}


class Database implements IDatabase {
    private readonly collections = new Map<string, any[]>();
    save(collectionName: string, document:any){
        const collection = this.collections.get(collectionName);
        if(collection){
            collection.push(document);
            this.collections.set(collectionName, collection);
            return;
        }
        this.collections.set(collectionName, [document]);
    }
    get(collectionName: string): any[] | undefined{
        return this.collections.get(collectionName);
    }
    delete(collectionName: string): boolean {
        return this.collections.delete(collectionName)
    }
}

const dbInstance:IDatabase = new Database();
export {dbInstance, Database};