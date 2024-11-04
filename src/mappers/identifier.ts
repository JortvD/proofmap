import { createNameSegment } from "../typeCreate";
import { Dafny } from "../types";
import AbstractMapper from "./abstract";
import { TSESTree } from "@typescript-eslint/typescript-estree";

class IdentifierMapper extends AbstractMapper<TSESTree.Identifier, Dafny.NameSegment> {
	map() {
		return createNameSegment(this.node.name);
	}
}

export default IdentifierMapper;