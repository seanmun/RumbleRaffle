import app from "./server";
import { createServerlessExpressMiddleware } from "@vercel/node";

export default createServerlessExpressMiddleware(app);
