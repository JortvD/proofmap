import { TSESTree } from "@typescript-eslint/typescript-estree";
import AbstractMapper from "./abstract";
import ExpressionMapper from "./expression";
import { Dafny } from "../types";

class ExpressionStatementMapper extends AbstractMapper<TSESTree.ExpressionStatement,Dafny.UpdateStmt> {
	map() {
		const mapper = new ExpressionMapper(this.node.expression, this.options, this.context);
		const rhsValue = mapper.map();

		if (!rhsValue) {
			return;
		}

		const rhs = this.createRhs(mapper.map());

		return this.createUpdateStmt([rhs]);
	}

	createUpdateStmt(rhs: Dafny.Rhs[]) {
		const type: Dafny.UpdateStmt = {
			type: "UpdateStmt",
			key: [],
			value: rhs
		}

		return type;
	}

	createRhs(value: Dafny.RhsValue) {
		const type: Dafny.Rhs = {
			type: "Rhs",
			value
		}

		return type;
	}
}

export default ExpressionStatementMapper;