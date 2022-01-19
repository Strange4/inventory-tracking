import { Router } from "express";
import ItemController from "../controllers/items-controller";
const itemsRoute = Router();

itemsRoute.get('/', ItemController.listAll);
itemsRoute.post('/', ItemController.create);
itemsRoute.delete('/', ItemController.delete);

export default itemsRoute;