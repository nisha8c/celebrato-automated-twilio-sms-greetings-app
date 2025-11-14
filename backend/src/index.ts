import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";

import { typeDefs } from "./schema";
import { userResolver } from "./resolvers/userResolver";
import { contactResolver } from "./resolvers/contactResolver";
import { messageResolver } from "./resolvers/messageResolver";
import { authMiddleware } from "./auth";
import { startScheduler } from "./scheduler";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

dotenv.config();

const app: Application = express();

/* ------------------------------------------
   CORS – Allows your Vite frontend
------------------------------------------- */
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: false,
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

/* ------------------------------------------
   Auth middleware (decodes JWT)
------------------------------------------- */
app.use(authMiddleware);

/* ------------------------------------------
   Apollo Server (GraphQL)
------------------------------------------- */
const server = new ApolloServer({
    typeDefs,
    resolvers: [userResolver, contactResolver, messageResolver],
    context: ({ req }) => ({ user: (req as any).user }),
    introspection: true,
    csrfPrevention: false,
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});

/* ------------------------------------------
   Start server
------------------------------------------- */
async function start() {
    await server.start();

    // Attach GraphQL endpoint
    //server.applyMiddleware({ app, path: "/graphql" });
    server.applyMiddleware({ app: app as any, path: "/graphql" });


    /* ------------------------------------------
       HTTPS Setup
       Uses files: cert/key.pem & cert/cert.pem
    ------------------------------------------- */
    const httpsOptions = {
        key: fs.readFileSync("cert/key.pem"),
        cert: fs.readFileSync("cert/cert.pem"),
    };

    // Simple root test route
    app.get("/", (_req, res) => {
        res.send("🎉 Secure Celebrato backend running on HTTPS!");
    });

    // Start HTTPS server
    https.createServer(httpsOptions, app).listen(4000, "0.0.0.0", () => {
        console.log("🔒 HTTPS server running at: https://localhost:4000/graphql");
    });

    // Auto-schedule birthday + anniversary jobs
    startScheduler();
}

start().catch((err) => {
    console.error("❌ Error starting server:", err);
});
