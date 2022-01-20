async function start(){
    createItem(new Item('my item name', 10, 'my description'));
    updateTableFromAPI();
}

/**
 * fetchs the items that are in the db
 * @returns {Prmoise<Item[]>} the items that are currently in the db
 */
async function fetchItems(){
    const request = new XMLHttpRequest();
    request.open('GET', "http://localhost:5000/api/items");
    request.send();
    const response = await new Promise((resolve, reject)=>{
        request.addEventListener('load', (ProgressEvent)=>{
            resolve(ProgressEvent.currentTarget);
        });
    });
    const itemsValues = JSON.parse(response.responseText);
    const items = [];
    for(const iv of itemsValues){
        const {id, content } = iv;
        items.push(new Item(content.name, content.quantity, content.description, id));
    }
    return items;
}

/**
 * creates an item in the db
 * @param {Item} item the item to create
 * @returns {Promise<Item>} an item with the id given by the db
 */
async function createItem(item){
    const request = new XMLHttpRequest();
    request.open('POST', "http://localhost:5000/api/items");
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(item));
    const response = await new Promise((resolve, reject)=>{
        request.addEventListener('load', (ProgressEvent)=>{
            resolve(ProgressEvent.currentTarget);
        });
    });
    const {id, content } = JSON.parse(response.responseText);
    const createdItem = new Item(content.name, content.quantity, content.description, id);
    return createdItem;
}
/**
 * deletes an item from the db
 * @param {Item} item the item to be deleted from the db
 */
async function deleteItem(item){
    const request = new XMLHttpRequest();
    request.open('DELETE', "http://localhost:5000/api/items");
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({id: item.id}));
    const response = await new Promise((resolve, reject)=>{
        request.addEventListener('load', (ProgressEvent)=>{
            resolve(ProgressEvent.currentTarget);
        });
    });
    return response.responseText;
}

async function deleteAll(){
    if(confirm('are you sure you want to delete all the items?')){
        const request = new XMLHttpRequest();
        request.open('DELETE', "http://localhost:5000/api/items/all");
        request.send();
        const response = await new Promise((resolve, reject)=>{
            request.addEventListener('load', (ProgressEvent)=>{
                resolve(ProgressEvent.currentTarget);
            });
        });
        return response.responseText;
    }
}

/**
 * updates an item in the database
 * @param {Item} item the item to be updated
 */
async function updateItem(item){
    const request = new XMLHttpRequest();
    request.open('PUT', "http://localhost:5000/api/items");
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(item));
    const response = await new Promise((resolve, reject)=>{
        request.addEventListener('load', (ProgressEvent)=>{
            resolve(ProgressEvent.currentTarget);
        });
    });
    return JSON.parse(response.responseText);
}

/**
 * tranforms an item to a row in a table
 * @param {Item} item the item to be tranformed to a row
 * @returns {HTMLTableRowElement}
 */
function itemToRow(item){
    const row = document.createElement('tr');
    for(const [key, value] of Object.entries(item)){
        if(key !== 'id'){
            const td = document.createElement('td');
            td.innerText = value;
            row.appendChild(td);
        }
    }
    return row;
}

/**
 * transforms an array of items into rows
 * @param {Item[]} items the items
 * @returns {HTMLTableRowElement[]}
 */
function itemsToRows(items){
    const rows = [];
    for(const item of items){
        rows.push(itemToRow(item));
    }
    return rows;
}

/**
 * appends rows to the table
 * @param {HTMLTableRowElement[]} rows the rows to be appended to the table
 */
function addRowsToTable(rows){
    const table = document.getElementById('table-body');
    for(const row of rows){
        table.appendChild(row);
    }
}

async function updateTableFromAPI(){
    const items = await fetchItems();
    const rows = itemsToRows(items);
    addRowsToTable(rows)
}


start();