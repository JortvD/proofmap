import { TSESTree } from "@typescript-eslint/typescript-estree";
import AbstractMapper from "./abstract";
import FunctionExpressionMapper from "./functionExpression";
import { Dafny } from "../types";
import { createClassMemberDecl } from "../typeCreate";

class MethodDefinitionMapper extends AbstractMapper<TSESTree.MethodDefinition,Dafny.ClassMemberDecl> {
	map() {
		if (this.node.value && this.node.value.type === "FunctionExpression") {
			const mapper = new FunctionExpressionMapper(this.node.value, this.options, this.context, this.node.key as TSESTree.Identifier);

			return mapper.map();
		}
	}
}

export default MethodDefinitionMapper;