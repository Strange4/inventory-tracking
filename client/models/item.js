/**
 * an Object representation of a item in the db
 */
class Item {
    /**
     * makes a new item
     * @param {string} name the name of the item
     * @param {string?} description the description of the item
     * @param {number} quantity the quantity of the item
     * @param {string?} id the id of the item 
     */
    constructor(name, quantity, description, id) {
        if(typeof name !== 'string' || typeof quantity !== 'number') throw new Error('the name and the quantity of the item must be defined');
        if(quantity<0) throw new Error('the quantity of an item must be above 0');
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.id = id;
    }
}