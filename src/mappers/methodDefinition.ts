import { TSESTree } from "@typescript-eslint/typescript-estree";
import AbstractMapper from "./abstract";
import FunctionExpressionMapper from "./functionExpression";
import { Dafny } from "../types";

class MethodDefinitionMapper extends AbstractMapper<TSESTree.MethodDefinition,Dafny.ClassMemberDecl> {
	map() {
		if (this.node.value && this.node.value.type === "FunctionExpression") {
			const mapper = new FunctionExpressionMapper(this.node.value, this.options, this.context, this.node.key as TSESTree.Identifier);

			return this.createClassMemberDecl(mapper.map());
		}
	}

	createClassMemberDecl(value: Dafny.MethodDecl) {
		const type: Dafny.ClassMemberDecl = {
			type: "ClassMemberDecl",
			value
		}

		return type;
	}
}

export default MethodDefinitionMapper;