import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  console.log("🔍 Current working directory:", process.cwd());
  
  // Try multiple possible paths
  const possiblePaths = [
    path.join(process.cwd(), "dist", "public"),
    path.join(process.cwd(), "dist"),
    path.join(process.cwd(), "client", "dist")
  ];
  
  let distPath = null;
  for (const testPath of possiblePaths) {
    console.log(`Testing path: ${testPath} - exists: ${fs.existsSync(testPath)}`);
    if (fs.existsSync(testPath)) {
      distPath = testPath;
      break;
    }
  }
  
  if (!distPath) {
    console.error("❌ No valid dist path found!");
    // Serve a simple response instead of crashing
    app.use("*", (_req, res) => {
      res.send("Application is starting up...");
    });
    return;
  }
  
  console.log("✅ Using dist path:", distPath);
  app.use(express.static(distPath));
  
  app.use("*", (_req, res) => {
    const indexPath = path.join(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.send("Application is starting up...");
    }
  });
}
