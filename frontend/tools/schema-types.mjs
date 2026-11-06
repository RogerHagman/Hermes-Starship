// Generate src/types/fixtures.ts from api/schema/*.schema.json.
//   npm run types            write the file
//   npm run types -- --check fail if the file is out of date (used by `npm run check`)
import { compileFromFile } from 'json-schema-to-typescript';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const schemaDir = resolve(import.meta.dirname, '../../api/schema');
const out = resolve(import.meta.dirname, '../src/types/fixtures.ts');
const names = { stations: 'StationsFile', rails: 'RailsFile', orders: 'OrdersFile', shiplog: 'ShipLogFile', ship: 'ShipFile', quarters: 'QuartersFile', raillog: 'RailLogFile', sensors: 'SensorsFile', engineering: 'EngineeringFile', science: 'ScienceFile', ops: 'OpsFile' };

let text = '// Generated from api/schema by `npm run types`. Do not edit by hand.\n/* eslint-disable */\n';
for (const file of readdirSync(schemaDir).filter((f) => f.endsWith('.schema.json')).sort()) {
  const key = file.replace('.schema.json', '');
  const schema = JSON.parse(readFileSync(resolve(schemaDir, file), 'utf8'));
  schema.title = names[key];
  const tmp = resolve(import.meta.dirname, `.${key}.tmp.json`);
  writeFileSync(tmp, JSON.stringify(schema));
  const ts = await compileFromFile(tmp, { bannerComment: '', additionalProperties: false, cwd: schemaDir });
  text += '\n' + ts;
  (await import('node:fs')).rmSync(tmp);
}

if (process.argv.includes('--check')) {
  const current = readFileSync(out, 'utf8');
  if (current !== text) { console.error('src/types/fixtures.ts is out of date: run npm run types'); process.exit(1); }
  console.log('types up to date');
} else {
  writeFileSync(out, text);
  console.log('wrote', out);
}
