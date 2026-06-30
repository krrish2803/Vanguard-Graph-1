import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { verifyConnection, closeDriver } from "./services/neo4j/driver"
import graphController from './modules/graph/graph.controller';
import merchantsController from './modules/merchants/merchants.controller';
import alertsController from './modules/alerts/alerts.controller';
import workflowsController from './modules/workflows/workflows.controller';



verifyConnection(); // server start hone se pehle

// graceful shutdown
process.on('SIGINT', async () => {
  await closeDriver();
  process.exit(0);
});

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(morgan("dev"));
app.use('/graph', graphController);
app.use('/merchants', merchantsController);
app.use('/alerts', alertsController);
app.use('/workflows', workflowsController);


app.get("/health",(req,res)=>{
    res.status(200).json({
        success:true,
        message: "Fraud detection is running"
    });
});

 export default app;