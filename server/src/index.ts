import express from 'express';
import itemsRoute from './routes/items-routes';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use('/api/items', itemsRoute);
app.get('/', (request, response)=>{
    response.send(request.body);
});
app.listen(port, ()=>console.log(`App running on port: ${port}`));