import { assign, record, union, Describe, optional, array, enums, Infer, assert, boolean, object, number, string } from 'superstruct'
import { readFileSync } from 'fs'
import * as fs from 'fs'

import { scriptSign, scriptActionSign } from './Types/script.js'
import { ProxyTypeSign } from './Types/proxy.js'

const _cfg_path = './config.json'

const configSign = object({
        concurrency: number(),
        path: object({
                storage: string(),
                scripts: string(),
                log: string(),
        }),
        scripts: array(string()),
        proxy: array(ProxyTypeSign)
})

if (!fs.existsSync(_cfg_path)) {
        let cfg: ConfigType = {
                concurrency: 1,
                scripts: new Array(),
                path: {
                        log: './.log',
                        scripts: "./scripts",
                        storage: './storage'
                },
                proxy: []
        }
        fs.writeFileSync(_cfg_path, JSON.stringify(cfg, null, " ".repeat(4)))
}

type ConfigType = Infer<typeof configSign>;

export function Config(): ConfigType {
        let config
        try {
                config = JSON.parse(readFileSync(_cfg_path).toString());
        } catch(e) {
                throw new Error("Config parse error: " + e);
        }

        assert(config, configSign);

        return config;
}

let cfg = Config()

for (const path of Object.values(cfg.path)) {
        if (!fs.existsSync(path)) {
                fs.mkdirSync(path)
        }
}

export default cfg
