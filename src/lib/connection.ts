//#region imports

import * as enigma                  from "enigma.js";
import * as bluebird                from "bluebird";
import { exposeAppApi }             from "../mixins/addDoc";

const qixSchema = require("../node_modules/enigma.js/schemas/12.20.0.json");

//#endregion

export class Connection {

    //#region variables

    private configEnigma: enigmaJS.IConfig;
    private qlikGlobal: EngineAPI.IGlobal;
    private session: enigmaJS.ISession;

    //#endregion

    constructor() {
        console.log("Constructor called: Connection");

        const prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );
        const prefixString = prefix!=="/"?`/${prefix}/`:"/";
        const host = window.location.hostname;
        const port = window.location.port?`:${window.location.port}`:"";
        const isSecure = window.location.protocol === "https:";
        const baseUrl =`${isSecure?"wss": "ws"}://${host}${port}${prefixString}app/engineData`;

        this.configEnigma = {
            Promise: bluebird,
            schema: qixSchema,
            mixins: [exposeAppApi],
            url: baseUrl
        };
    }

    /**
     * createSession
     */
    public createSession(): Promise<enigmaJS.ISession> {
        console.log("fcn called: createSession - Connection");

        return new Promise((resolve, reject) => {
            try {
                let session: enigmaJS.ISession = enigma.create(this.configEnigma);
                resolve(session);
            } catch (error) {
                reject(error);
            }
        });
    }
}