#!/usr/bin/env node
import { createNuclieProject } from './create/index.js';

const projectName = process.argv[2];
createNuclieProject(projectName).catch((err) => {
    console.error(err);
    process.exit(1);
});
