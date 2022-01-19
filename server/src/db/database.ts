import { IStorable } from "../models/items-models";

interface IDatabase{
    save(collectionName: string, document:IStorable): void;
    get(collectionName: string, documentID?: IStorable['id']): IStorable[] | IStorable | undefined;
    delete(collectionName: string, documentID?: IStorable['id']): boolean;
    update(collectionName: string, documentID: IStorable['id']): boolean;
}


class Database implements IDatabase {
    private readonly collections = new Map<string, IStorable[]>();
    save(collectionName: string, document:any){
        const collection = this.collections.get(collectionName);
        if(collection){
            collection.push(document);
            this.collections.set(collectionName, collection);
            return;
        }
        this.collections.set(collectionName, [document]);
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
        return this.collections.delete(collectionName)
    }
    
    update(collectionName: string, documentID: string): boolean {
        throw new Error("Method not implemented.");
    }
}

const dbInstance:IDatabase = new Database();
export {dbInstance, Database};