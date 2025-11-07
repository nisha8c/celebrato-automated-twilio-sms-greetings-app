import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";

import { typeDefs } from "./schema";
import { userResolver } from "./resolvers/userResolver";
import { contactResolver } from "./resolvers/contactResolver";
import { messageResolver } from "./resolvers/messageResolver";
import { authMiddleware } from "./auth";
import { startScheduler } from "./scheduler";
import {
    ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";


dotenv.config();

const app: Application = express();

// ✅ Allow all origins during local dev
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
//app.use(bodyParser.json());
app.use(authMiddleware);

// ✅ Apollo Server setup
const server = new ApolloServer({
    typeDefs,
    resolvers: [userResolver, contactResolver, messageResolver],
    context: ({ req }) => ({ user: (req as any).user }),
    introspection: true,           // allow the local UI in dev
    csrfPrevention: false,
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});


async function start() {
    await server.start();

    // ✅ Apply GraphQL middleware
    server.applyMiddleware({ app: app as any, path: "/graphql" });

    // ✅ HTTPS configuration
    const httpsOptions = {
        key: fs.readFileSync("localhost-key.pem"),
        cert: fs.readFileSync("localhost.pem"),
    };

    // ✅ Simple test route
    app.get("/", (_req, res) => {
        res.send("✅ Celebrato backend is running securely over HTTPS!");
    });

    // ✅ Start HTTPS server (NOT app.listen)
    https.createServer(httpsOptions, app).listen(4000, "0.0.0.0", () => {
        console.log("🔒 HTTPS Server running at https://localhost:4000/graphql");
    });

    // ✅ Start daily message scheduler
    startScheduler();
}

start().catch((err) => {
    console.error("❌ Error starting server:", err);
});
