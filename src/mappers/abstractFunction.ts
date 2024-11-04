import { TSESTree } from "@typescript-eslint/typescript-estree";
import AbstractMapper, { MapContext, MapOptions } from "./abstract";
import BlockStatementMapper from "./blockStatement";
import { Dafny } from "../types";
import { createDomainType_, createFormals, createGIndentType, createIndentType, createMethodDecl, createStringType_, createType } from "../typeCreate";

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
		const returns: Dafny.GIdentType[] = [];
		const parameters: Dafny.GIdentType[] = [];

		if (this.node.returnType) {
			const returnType = this.returnType();
			const name = this.options.defaultReturnsName;
			
			if (returnType) {
				const returnValue = createGIndentType(createIndentType(name, returnType));
				returns.push(returnValue);
			}
		}

		return createMethodDecl(id.name, "method", value, createFormals(parameters), createFormals(returns));
	}

	returnType(): Dafny.Type|undefined {
		if (!this.node.returnType || !this.node.returnType.type) {
			return;
		}

		switch(this.node.returnType.typeAnnotation.type) {
			case "TSStringKeyword":
				return createType(createDomainType_(createStringType_()))
		}
	}

	mapArrowFunction(node: TSESTree.ArrowFunctionExpression) {
		console.log(node)

	}
}

export default AbstractFunctionMapper;