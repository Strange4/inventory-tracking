async function start(){
    fetchItems();
}

async function fetchItems(){
    const response = await fetch('http://localhost:5000/api/items');
    if(response.ok){
        const jsonData = await response.json();
        console.log(jsonData);
        return jsonData;
    }
}

/**
 * 
 * @param {string} name the name of the item
 * @param {number} quantity the quantity of items to create
 * @param {string} description the description of the item
 */
async function createItem(name, quantity, description){

}
// TODO: do functions for delete, update, and create
start();