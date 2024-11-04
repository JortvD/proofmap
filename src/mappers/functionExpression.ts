import AbstractMapper, { MapContext, MapOptions } from "./abstract";
import { TSESTree } from "@typescript-eslint/typescript-estree";
import AbstractFunctionMapper from "./abstractFunction";
import { Dafny } from "../types";

class FunctionExpressionMapper extends AbstractFunctionMapper<TSESTree.FunctionExpression> {
	constructor(node: TSESTree.FunctionExpression, options: MapOptions, context: MapContext, id: TSESTree.Identifier) {
		super(node, options, context, id);
	}
}

export default FunctionExpressionMapper;