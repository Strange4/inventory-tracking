import { Router } from "express";
import ItemController from "../controllers/items-controller";
const itemsRoute = Router();

//todo: get item query
// get item csv
// get all items csv
itemsRoute.get('/', ItemController.listAll);
itemsRoute.post('/', ItemController.create);
itemsRoute.delete('/', ItemController.delete);
itemsRoute.delete('/all', ItemController.deleteAll);
itemsRoute.put('/', ItemController.update)

export default itemsRoute;