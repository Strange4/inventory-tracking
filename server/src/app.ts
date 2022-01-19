import express from 'express';
import itemsRoute from './routes/items-routes';
const app = express();
app.use(express.json());
app.use('/api/items', itemsRoute);
app.get('/', (request, response)=>{
    response.send('welcome to dungeon')
});
export {app};