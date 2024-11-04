import { TSESTree } from "@typescript-eslint/typescript-estree";
import VariableStore from "../store/variable";
import TypeStore from "../store/type";

export interface MapOptions {
	defaultReturnsName: string;
}

export interface MapContext {
	variables: VariableStore;
	types: TypeStore;
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