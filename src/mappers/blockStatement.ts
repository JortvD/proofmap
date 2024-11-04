import AbstractMapper from "./abstract";
import { TSESTree } from "@typescript-eslint/typescript-estree";
import VariableDeclarationMapper from "./variableDeclaration";
import ExpressionStatementMapper from "./expressionStatement";
import { Dafny } from "../types";

class BlockStatementMapper extends AbstractMapper<TSESTree.BlockStatement,Dafny.BlockStmt> {
	map() {
		let value: Dafny.Stmt[] = [];

		for (const statement of this.node.body) {
			let mapper;

			if (statement.type === "VariableDeclaration") {
				mapper = new VariableDeclarationMapper(statement, this.options, this.context);
			}
			else if (statement.type === "ExpressionStatement") {
				mapper = new ExpressionStatementMapper(statement, this.options, this.context);
			}

			if (!mapper) {
				continue;
			}

			const statementValue = mapper.map();

			if (!statementValue) {
				continue;
			}

			value.push(this.createStmt(statementValue));
		}

		return this.createBlockStmt(value);
	}

	createBlockStmt(value: Dafny.Stmt[]) {
		const type: Dafny.BlockStmt = {
			type: "BlockStmt",
			value
		}

		return type;
	}

	createStmt(value: Dafny.StmtValue) {
		const type: Dafny.Stmt = {
			type: "Stmt",
			value
		}

		return type;
	}
}

export default BlockStatementMapper;