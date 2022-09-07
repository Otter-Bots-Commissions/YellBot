// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import 'reflect-metadata';
import '@sapphire/plugin-logger/register';
import * as colorette from 'colorette';
import { inspect } from 'util';
import "dotenv/config";
import { container } from '@sapphire/framework';
import { QuickDB } from "quick.db";
container.db = new QuickDB();
inspect.defaultOptions.depth = 1;

// Enable colorette
colorette.createColors({ useColor: true });

declare module "@sapphire/pieces" {
    interface Container {
        db: QuickDB;
    }
}