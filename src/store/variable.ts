import { TSESTree } from "@typescript-eslint/typescript-estree";

export interface Variable {
	name: string;
	type: string;
}

export function createVariable(name: string, type: string): Variable {
	return {
		name,
		type,
	};
}

class VariableStore {
	variables: Variable[] = [];

	add(variable: Variable): void {
		this.variables = this.variables.filter((v) => v.name !== variable.name);
		this.variables.push(variable);
	}

	getType(name: string): string|undefined {
		return this.variables.find((v) => v.name === name)?.type;
	}
}

export default VariableStore;