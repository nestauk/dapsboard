// eslint-disable-next-line node/no-unpublished-import
import * as ts from "typescript";
import path from 'path';
import fs from 'fs';

import { servicesHost } from 'app/tsservices';

const LIBDTS = `// Standard types
interface Date {}

type Record<K extends keyof any, T> = {
	[P in K]: T;
};
`;

const srcname = "datasets.ts";
const src = `${fs.readFileSync(path.resolve('static/dsl', srcname))}

const selection: Aggs<eurito_cordis_v1, 'cost_total_project'> = {"primary":{"histogram":{"field":"cost_total_project"}}};
`;

const host = servicesHost(ts, {[srcname]: src}, LIBDTS);
const service = ts.createLanguageService(host, ts.createDocumentRegistry());
const semDiags = service.getSemanticDiagnostics(srcname);
console.log(semDiags);
const synDiags = service.getSyntacticDiagnostics(srcname);
console.log(synDiags);

const targetPosition = src.lastIndexOf('{') + 1;
for (let position = targetPosition - 20; position < src.length; position++) {
	try {
		console.log(src.slice(src.slice(0, position).lastIndexOf('\n'), position));
		const info = service.getCompletionsAtPosition(srcname, position, {
			// includeCompletionsWithInsertText: true,
			// includeInsertTextCompletions: true,
			// includeExternalModuleExports: true,
			// includeAutomaticOptionalChainCompletions: true
		});
		// console.log(info && info.entries.map(i => i.name).join(', '));
		console.log(info && info.entries.map(i => {

			const details = service.getCompletionEntryDetails(srcname, position, i.name, undefined, undefined, undefined);
			const displayText = details.displayParts.map(part => part.text).join('');
			return `${details.name} -> ${displayText}`;
		}));
		// console.log(info && info.entries);
	} catch (error) {
		console.log(error);
	}
}
