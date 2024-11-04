import { TSESTree } from "@typescript-eslint/typescript-estree";

export interface MapOptions {
	defaultReturnsName: string;
}

export interface MapContext {
	variables: Map<string, string>;
	moduleName: string;
	requires: TSESTree.ArrowFunctionExpression[];
	ensures: TSESTree.ArrowFunctionExpression[];
}

abstract class AbstractMapper<T,U> {
	node: T;
	options: MapOptions;
	context: MapContext;

	constructor(node: T, options: MapOptions, context: MapContext) {
		this.node = node;
		this.options = options;
		this.context = context;
	}

	abstract map(): U|undefined;
}

export default AbstractMapper;