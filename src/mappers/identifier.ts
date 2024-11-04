import { Dafny } from "../types";
import AbstractMapper from "./abstract";
import { TSESTree } from "@typescript-eslint/typescript-estree";

class IdentifierMapper extends AbstractMapper<TSESTree.Identifier, Dafny.NameSegment> {
	map() {
		return this.createNameSegment(this.node.name);
	}

	createNameSegment(value: string) {
		const type: Dafny.NameSegment = {
			type: "NameSegment",
			value
		}

		return type;
	}
}

export default IdentifierMapper;