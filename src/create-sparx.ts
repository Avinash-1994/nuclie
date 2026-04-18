#!/usr/bin/env node
import { createSparxProject } from './create/index.js';

const projectName = process.argv[2];
createSparxProject(projectName).catch((err) => {
    console.error(err);
    process.exit(1);
});
