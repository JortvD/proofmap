import { createCardinalityExpression_, createConstAtomExpression, createExpression, createPrimaryExpression, createTo } from "../typeCreate";
import { Dafny } from "../types";

export interface Type {
	type: "property"|"function"|"group";
	name: string;
	members: Type[];
	replaceProperty?: (parent: Dafny.RhsValue) => Dafny.RhsValue;
	replaceFunction?: (parent: Dafny.RhsValue, params: Dafny.RhsValue[]) => Dafny.RhsValue;
}

export function createType(name: string, members: Type[] = []): Type {
	return {
		type: "group",
		name,
		members,
	};
}

export function createTypeProperty(name: string,members: Type[] = [], replaceProperty?: (from: Dafny.RhsValue) => Dafny.RhsValue): Type {
	return {
		type: "property",
		name,
		members,
		replaceProperty,
	};
}

class TypeStore {
	types: Type[] = [];

	constructor() {
		this.add(createType("string", [
			createTypeProperty("length", [], 
				parent => createConstAtomExpression(createCardinalityExpression_(createTo<Dafny.Expression>(parent, "Expression")))),
		]));
		this.add(createType("number"));
		this.add(createType("boolean"));
	}
	
	add(type: Type): void {
		this.types = this.types.filter((t) => t.name !== type.name);
		this.types.push(type);
	}

	get(type: string): Type|undefined {
		return this.types.find((t) => t.name === type);
	}

	getCopy(): TypeStore {
		const store = new TypeStore();
		store.types = [...this.types];
		return store;
	}
}

export default TypeStore;