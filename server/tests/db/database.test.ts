import { dbInstance, Database } from '../../src/db/database'

describe('mock db testing', ()=>{
    it('get a db instance', ()=>{
        expect(dbInstance).toBeInstanceOf(Database);
    });
    it('should retreived an array of item', ()=>{
        const collectionName = 'myCollection';
        const myObj = { id: "10", content: ""}
        dbInstance.save(collectionName, myObj);
        const receivedObject = dbInstance.get(collectionName);
        expect(receivedObject).toBeInstanceOf(Array);
    });
    it('should be able to save and retrieve an item', ()=>{
        const collectionName = 'myCollection';
        const myObj = { id: "ayh09i89yuih", content: "content"}
        dbInstance.save(collectionName, myObj);
        const receivedObject = dbInstance.get(collectionName)?.[1];
        expect(receivedObject).toEqual(myObj);
    });
    it('should save classes between test', ()=>{
        const collectionName = 'myCollection';
        const myObj = { id: "ayh09i89yuih", content: "content"}
        const receivedObject = dbInstance.get(collectionName)?.[1];
        expect(receivedObject).toEqual(myObj);
    });
});