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
		return this.types.find((t) => t.name === type)?.known;
	}

	knowsDeep(types: string[]): boolean {
		const type = this.types.find((t) => t.name === types[0]);

		if (!type) return false;

		if (types.length === 1) return type.known;

		return this.knowsDeepMember(type, types.slice(1));
	}

	knowsDeepMember(type: Type, types: string[]): boolean {
		const member = type.members.find((m) => m.name === types[0]);

		if (!member) return false;

		if (types.length === 1) return member.known;

		return this.knowsDeepMember(member, types.slice(1));
	}
}

export default TypeStore;