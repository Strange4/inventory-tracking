import { IStorable } from "../models/items-model";

interface IDatabase{
    save(collectionName: string, document:IStorable): void;
    get(collectionName: string, documentID?: IStorable['id']): IStorable[] | IStorable | undefined;
    delete(collectionName: string, documentID?: IStorable['id']): boolean;
    update(collectionName: string, documentID: IStorable): boolean;
}


class Database implements IDatabase {
    private readonly collections = new Map<string, IStorable[]>();
    save(collectionName: string, document:any | any[]){
        const updatedCollection = document instanceof Array ? [...document] : [document];
        const collection = this.collections.get(collectionName);
        if(collection){
            this.collections.set(collectionName, updatedCollection);
            return;
        }
        this.collections.set(collectionName, updatedCollection);
    }
    get(collectionName: string, documentID?: IStorable['id']): IStorable[] | IStorable | undefined{
        const collection = this.collections.get(collectionName);
        if(collection){
            if(documentID){
                const document = collection.find(document => {return document.id === documentID});
                return document;
            }
            return collection;
        }
        return undefined;
    }
    delete(collectionName: string, documentID?: IStorable['id']): boolean {
        if(documentID){
            const collection = this.collections.get(collectionName);
            if(!collection) return false;
            const newCollection = collection.filter(document=>{ return document.id !== documentID });
            if(newCollection.length === collection.length) return false;
            this.collections.set(collectionName, newCollection);
            return true;
        }
        return this.collections.delete(collectionName);
    }
    
    update(collectionName: string, documentToUpdate: IStorable): boolean {
        const collection = this.collections.get(collectionName);
        if(collection){
            const document = collection.find(document=>{return document.id === documentToUpdate.id});
            if(document){
                this.delete(collectionName, document.id);
                this.save(collectionName, documentToUpdate);
                return true;
            }
            return false;
        }
        return false;
    }
}

const dbInstance:IDatabase = new Database();
export {dbInstance, Database};