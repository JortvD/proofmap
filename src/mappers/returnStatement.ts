import AbstractMapper from "./abstract";
import { TSESTree } from "@typescript-eslint/typescript-estree";
import { Dafny } from "../types";
import { createBlockStmt, createReturnStmt, createRhs, createStmt } from "../typeCreate";
import ExpressionMapper from "./expression";

class ReturnStatementMapper extends AbstractMapper<TSESTree.ReturnStatement,Dafny.ReturnStmt> {
	map() {
		const value: Dafny.Rhs[] = [];

		if (this.node.argument) {
			const mapper = new ExpressionMapper(this.node.argument, this.options, this.context);
			value.push(createRhs(mapper.map()));
		}

		return createReturnStmt(value);
	}
}

export default ReturnStatementMapper;