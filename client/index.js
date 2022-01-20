async function start(){
    createItem(new Item('my item name', 10, 'my description'))
    .then(async (item)=>{
        console.log(await toCSV(item.id))
    })
    .then(updateTableFromAPI);
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
 * @param {Item['id']} id the item to be deleted from the db
 */
async function deleteItem(id){
    const request = new XMLHttpRequest();
    request.open('DELETE', "http://localhost:5000/api/items");
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({id: id}));
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
 * gets the csv of an item from the db
 * @param {Item['id']} id the id of the item
 */
async function toCSV(id){

    const request = new XMLHttpRequest();
    request.open('POST', "http://localhost:5000/api/items/csv");
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({id: id}));
    console.log({id: id})
    const response = await new Promise((resolve, reject)=>{
        request.addEventListener('load', (ProgressEvent)=>{
            resolve(ProgressEvent.currentTarget);
        });
    });
    return response.responseText;
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
    const buttons = [deleteButton(item), downloadCSVButton(item)];
    for(const button of buttons){
        const td = document.createElement('td');
        td.appendChild(button);
        row.appendChild(td);
    }
    return row;
}

function deleteButton(item){
    const button = document.createElement('input');
    button.type = "button";
    button.value = "delete";
    button.setAttribute('itemID', item.id);
    button.onclick = function(event){
        deleteItem(event.target.getAttribute('itemid')).then( async ()=>{
            await updateTableFromAPI();
        });
    }
    return button;
}

function downloadCSVButton(item){
    const button = document.createElement('input');
    button.type = 'button';
    button.value = "toCSV";
    button.setAttribute('itemID', item.id);
    button.onclick = function(event){
        toCSV(item.id).then((csvString)=>{
            const link = document.createElement('a');
            link.download = 'data.csv';
            const content = "data:text/csv;charset=utf-8," + csvString;
            const uri = encodeURI(content);
            link.href = uri;
            link.click();
        });
    }
    return button;
}

async function updateButton(item){
    const button = document.createElement('input');
    button.type = "button";
    button.value = "update";
    button.setAttribute('itemID', item.id);
    button.onclick = function (event){
        const name = document.getElementById('item-name');
        const quantity = document.getElementById('quantity');
        const description = document.getElementById('description');
        // name.value = 'yourmom';
    }
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
    table.innerHTML = '';
    for(const row of rows){
        table.appendChild(row);
    }
}

async function updateTableFromAPI(){
    const items = await fetchItems();
    const rows = itemsToRows(items);
    addRowsToTable(rows);
    console.log('updating the table')
}

function createItemForm(){
    const name = document.getElementById('item-name').value;
    const quantity = document.getElementById('quantity').value;
    const description = document.getElementById('description').value;
    if(!name || !quantity) return;
    if(quantity < 0) return;
    console.log('creating item');
    console.log(name, quantity, description);
    const item = new Item(name, Number(quantity), description);
    createItem(item).then(updateTableFromAPI);
}
start();