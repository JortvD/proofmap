import { TSESTree } from "@typescript-eslint/typescript-estree";
import AbstractMapper from "./abstract";
import ExpressionMapper from "./expression";
import { Dafny } from "../types";
import { createLhs, createRhs, createUpdateStmt } from "../typeCreate";
import IdentifierMapper from "./identifier";

class ExpressionStatementMapper extends AbstractMapper<TSESTree.ExpressionStatement,Dafny.UpdateStmt> {
	map() {
		if (this.node.expression.type === "AssignmentExpression") {
			if (this.node.expression.left.type !== "Identifier") {
				return;
			}

			const leftMapper = new IdentifierMapper(this.node.expression.left, this.options, this.context);
			const left = leftMapper.map();
			const rightMapper = new ExpressionMapper(this.node.expression.right, this.options, this.context);
			const right = rightMapper.map();

			if (!left || !right) {
				return;
			}

			return createUpdateStmt([createLhs(left)], [createRhs(right)]);
		}
		else {
			const mapper = new ExpressionMapper(this.node.expression, this.options, this.context);
			const value = mapper.map();
	
			if (!value) {
				return;
			}
	
			return createUpdateStmt([], [createRhs(value)]);
		}
	}
}

export default ExpressionStatementMapper;