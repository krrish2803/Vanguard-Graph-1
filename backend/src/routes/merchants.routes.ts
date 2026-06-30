import { Router } from "express";
import { createMerchantController } from "../modules/merchants/merchants.controller";


const merchantrouter = Router();

merchantrouter.post("/",createMerchantController);

export default merchantrouter;