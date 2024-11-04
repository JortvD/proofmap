import { createNameSegment } from "../typeCreate";
import { Dafny } from "../types";
import AbstractMapper from "./abstract";
import { TSESTree } from "@typescript-eslint/typescript-estree";

class IdentifierMapper extends AbstractMapper<TSESTree.Identifier, Dafny.NameSegment> {
	map() {
		const variableType = this.context.variables.getType(this.node.name);

		if (!variableType) {
			throw new Error(`Unknown variable ${this.node.name}`);
		}
		
		const type = this.context.types.get(variableType);

		if (!type) {
			throw new Error(`Unknown type ${variableType}`);
		}

		const value = createNameSegment(this.node.name);

		if (type.replaceProperty) {
			const replaced = type.replaceProperty(value);

			if(replaced.type !== "NameSegment") {
				throw new Error(`Expected NameSegment, got ${replaced.type}`);
			}

			return replaced;
		}

		return value;
	}
}

export default IdentifierMapper;