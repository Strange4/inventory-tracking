interface IDatabase{
    save(collectionName: string, document:any): void;
    get(collectionName: string): any | undefined;
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
    get(collectionName: string): any | undefined{
        return this.collections.get(collectionName);
    }
}

const dbInstance:IDatabase = new Database();
export default dbInstance;