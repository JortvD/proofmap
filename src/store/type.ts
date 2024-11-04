export interface TypeMember {
	name: string;
	known: boolean;
	members: TypeMember[];
	mapsTo?: (o: string) => string;
}

export interface Type extends Omit<TypeMember, "mapsTo"> {}

export function createType(name: string, known: boolean, members: TypeMember[] = []): Type {
	return {
		name,
		known,
		members,
	};
}

export function createTypeMember(name: string, known: boolean, members: TypeMember[] = [], mapsTo?: (o: string) => string): TypeMember {
	return {
		name,
		known,
		members,
		mapsTo,
	};
}

class TypeStore {
	types: Type[] = [];

	constructor() {
		this.add(createType("string", true, [
			createTypeMember("length", true, [], o => `${o}.Length`),
		]));
		this.add(createType("number", true));
		this.add(createType("boolean", true));
	}
	
	add(type: Type): void {
		this.types = this.types.filter((t) => t.name !== type.name);
		this.types.push(type);
	}

	knows(type: string): boolean {
		return this.types.some((t) => t.name === type);
	}
}

export default TypeStore;