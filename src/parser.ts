import { parse } from '@typescript-eslint/typescript-estree';
import {readFileSync} from 'fs';

class Parser {
	loadFile(path: string) {
		return readFileSync(path, 'utf-8');
	}

	parse(fileContents: string) {
		return parse(fileContents, {
			loc: true,
		});
	}
}

export default Parser;