import { TSESTree } from "@typescript-eslint/typescript-estree";
import AbstractMapper from "./abstract";
import MethodDefinitionMapper from "./methodDefinition";
import { Dafny } from "../types";

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

		return this.createClassDecl(id.name, value);
	}

	createClassDecl(name: string, value: Dafny.ClassMemberDecl[]) {
		const type: Dafny.ClassDecl = {
			type: "ClassDecl",
			name,
			value
		}

		return type;
	}
}

export default ClassDeclarationMapper;