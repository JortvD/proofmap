import { assert } from 'console';
import { Dafny } from '../types';

export interface BuildOptions {
	indentation: string;
}

abstract class AbstractBuilder<T extends Dafny.Grammar> {
	data: T;
	options: BuildOptions;
	indent: boolean;

	constructor(data: T, options: BuildOptions, indent: boolean = false) {
		this.data = data;
		this.options = options;
		this.indent = indent;
	}

	abstract builder(start: Dafny.LocPosition): (AbstractBuilder<any>|string)[];

	build(start: Dafny.LocPosition): string {
		const builders = this.builder(start);

		let line = start.line;
		let column = start.column;

		let result = "";

		for(const builder of builders) {
			let buildResult = "";

			if(typeof builder === "string") {
				buildResult = builder;
			} else {
				buildResult = builder.build({ 
					line, 
					column: this.indent ? column + this.options.indentation.length : column
				});
			}

			if(this.indent) {
				buildResult = buildResult.split("\n").map(line => line.trim() !== "" ? this.options.indentation + line : line).join("\n");
			}

			result += buildResult;

			const lines = buildResult.split("\n");
			line += lines.length - 1;
			column = start.column + lines[lines.length - 1].length;
		}

		this.data.loc = {
			start: {
				line: start.line,
				column: this.indent ? start.column + this.options.indentation.length : start.column
			},
			end: {
				line,
				column
			}
		}

		return result;
	}

	join(builders: (AbstractBuilder<any>|string)[], separator: string = ""): (AbstractBuilder<any>|string)[] {
		const result: (AbstractBuilder<any>|string)[] = [];

		for(let i = 0; i < builders.length; i++) {
			result.push(builders[i]);

			if(i < builders.length - 1) {
				result.push(separator);
			}
		}

		return result;
	}

	joinOperations(builders: (AbstractBuilder<any>|string)[], operations: string[]): (AbstractBuilder<any>|string)[] {
		assert(builders.length === operations.length + 1, "Builders and operations must have the same length.");

		const result: (AbstractBuilder<any>|string)[] = [];

		for(let i = 0; i < builders.length; i++) {
			result.push(builders[i]);

			if(i < builders.length - 1) {
				result.push(` ${operations[i]} `);
			}
		}

		return result;
	}
}

export default AbstractBuilder;