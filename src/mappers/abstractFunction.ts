import { TSESTree } from "@typescript-eslint/typescript-estree";
import AbstractMapper, { MapContext, MapOptions } from "./abstract";
import BlockStatementMapper from "./blockStatement";
import { Dafny } from "../types";
import { createMethodDecl } from "../typeCreate";

abstract class AbstractFunctionMapper<T extends TSESTree.FunctionDeclaration|TSESTree.FunctionExpression> extends AbstractMapper<T,Dafny.MethodDecl> {
	id?: TSESTree.Identifier;

	constructor(node: T, options: MapOptions, context: MapContext, id?: TSESTree.Identifier) {
		super(node, options, context);
		this.id = id;
	}

	map() {
		const id = this.node.id as TSESTree.Identifier || this.id;
		const mapper = new BlockStatementMapper(this.node.body, this.options, this.context);
		const value = mapper.map();

		return createMethodDecl(id.name, "method", value);
	}

	returnType(): string|undefined {
		if (!this.node.returnType) {
			return;
		}

		switch(this.node.returnType.type) {
			case "TSTypeAnnotation":
				return "string";
		}
	}

	mapArrowFunction(node: TSESTree.ArrowFunctionExpression) {
		console.log(node)

	}
}

export default AbstractFunctionMapper;