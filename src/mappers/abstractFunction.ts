import { TSESTree } from "@typescript-eslint/typescript-estree";
import AbstractMapper, { MapContext, MapOptions } from "./abstract";
import BlockStatementMapper from "./blockStatement";
import { Dafny } from "../types";
import { createBoolType_, createClassMemberDecl, createDomainType_, createFormals, createFunctionBody, createFunctionDecl, createFunctionSignature_, createGIndentType, createIndentType, createMethodDecl, createPredicateSignature_, createStringType_, createType } from "../typeCreate";

abstract class AbstractFunctionMapper<T extends TSESTree.FunctionDeclaration|TSESTree.FunctionExpression> extends AbstractMapper<T,Dafny.ClassMemberDecl> {
	id?: TSESTree.Identifier;

	constructor(node: T, options: MapOptions, context: MapContext, id?: TSESTree.Identifier) {
		context.spec = [];
		context.types = context.types.getCopy();
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

		if (value.value.length === 1 && value.value[0].value.type === "ReturnStmt") {
			const body = createFunctionBody(value.value[0].value.value[0].value);

			if(returns[0].value.type_.value.value.value === "bool") {
				return createClassMemberDecl(createFunctionDecl(
					id.name, 
					body, 
					createPredicateSignature_(createFormals(parameters)), 
					this.context.spec
				));
			}
			else {
				return createClassMemberDecl(createFunctionDecl(
					id.name, 
					body, 
					createFunctionSignature_(createFormals(parameters), returns[0].value.type_), 
					this.context.spec
				));
			}
		}
		else {
			return createClassMemberDecl(createMethodDecl(id.name, "method", value, createFormals(parameters), createFormals(returns), this.context.spec));
		}
	}

	returnType(): Dafny.Type|undefined {
		if (!this.node.returnType || !this.node.returnType.type) {
			return;
		}

		switch(this.node.returnType.typeAnnotation.type) {
			case "TSStringKeyword":
				return createType(createDomainType_(createStringType_()))
			case "TSBooleanKeyword":
				return createType(createDomainType_(createBoolType_()))
		}
	}

	mapArrowFunction(node: TSESTree.ArrowFunctionExpression) {
		console.log(node)

	}
}

export default AbstractFunctionMapper;