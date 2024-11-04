import { TSESTree } from "@typescript-eslint/typescript-estree";
import AbstractMapper from "./abstract";
import MethodDefinitionMapper from "./methodDefinition";
import { Dafny } from "../types";
import { createClassDecl } from "../typeCreate";

class ClassDeclarationMapper extends AbstractMapper<TSESTree.ClassDeclaration,Dafny.ClassDecl> {
	map() {
		const id = this.node.id as TSESTree.Identifier;
		const value: Dafny.ClassMemberDecl[] = [];

		for (const statement of this.node.body.body) {
			if (statement.type === "MethodDefinition") {
				const mapper = new MethodDefinitionMapper(statement, this.options, this.context);
				value.push(mapper.map());
			}
		}

		return createClassDecl(id.name, value);
	}
}

export default ClassDeclarationMapper;