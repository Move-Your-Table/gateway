import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import "@tsed/ajv";
import "@tsed/swagger";
import {config, rootDir} from "./config";
import { IndexCtrl } from "./controllers/pages/IndexController";


@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.TSED_PORT || 8083,
  httpsPort: true, // CHANGE
  mount: {
    "/rest": [`${rootDir}/controllers/**/*.ts`],
    "/": [IndexCtrl]
  },
  swagger: [
    {
      path: "/api-general",
      doc: "general-api",
      specVersion: "3.0.3"
    },
    {
      path: "/api-admin",
      doc: "admin-api",
      pathPatterns: ["/rest/admin/**"],
      specVersion: "3.0.3"
    }
  ],
  views: {
    root: `${rootDir}/views`,
    extensions: {
      ejs: "ejs"
    }
  },
  exclude: ["**/*.spec.ts"]
})

export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      );
  }
}
