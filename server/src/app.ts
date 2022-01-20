import express from 'express';
import itemsRoute from './routes/items-routes';
import { ErrorRequestHandler } from 'express';
const app = express();
app.use(function (req, res, next) {
    
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if(req.method === 'OPTIONS'){
        return res.status(200).end();
    }
    next();
});
app.use(express.json());
// preventing the parsing error to get to the middle ware
const errorHandler: ErrorRequestHandler = (err, req, resp, next)=>{
    if(err){
        resp.status(422).send(err);
    } else {
        next();
    }
};
app.use(errorHandler)
app.use('/api/items', itemsRoute);
app.get('/', (request, response)=>{
    response.json(request.query);
});
export {app};