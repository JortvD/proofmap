import { TSESTree } from "@typescript-eslint/typescript-estree";
import AbstractMapper from "./abstract";
import { Dafny } from "../types";
import LiteralMapper from "./literal";
import IdentifierMapper from "./identifier";
import { createConstAtomExpression, createLogicalExpression, createRelationalExpression, createRelOp } from "../typeCreate";

class ExpressionMapper extends AbstractMapper<TSESTree.Expression,Dafny.RhsValue> {
	checkProofMapValidArguments() {
		if (this.node.type !== "CallExpression") {
			throw new Error("ProofMap.requires must be a call expression");
		}

		if (this.node.arguments.length === 0 || this.node.arguments[0].type !== "ArrowFunctionExpression") {
			throw new Error("ProofMap.requires must have an arrow function as argument");
		}

		return this.node.arguments[0];
	}

	map() {
		if (this.node.type === "Literal") {
			const mapper = new LiteralMapper(this.node, this.options, this.context);

			return createConstAtomExpression(mapper.map());
		}
		else if (this.node.type === "Identifier") {
			const mapper = new IdentifierMapper(this.node, this.options, this.context);

			return mapper.map();
		}
		else if (this.node.type === "CallExpression") {
			if (this.node.callee.type === "MemberExpression") {
				const object = this.node.callee.object as TSESTree.Identifier;
				const property = this.node.callee.property as TSESTree.Identifier;

				if(this.context.variables.getType(object.name) === 'ProofMap') {
					const argument = this.checkProofMapValidArguments();

					if(property.name === 'requires') {
						this.context.requires.push(argument);
					}
					else if (property.name === 'ensures') {
						this.context.ensures.push(argument);
					}

					return;
				}

				throw new Error("Not implemented");
			}
		}
		else if (this.node.type === "LogicalExpression") {
			const operator = this.node.operator;

			this.includeOperators(operator, ["&&", "||"]);

			const left = this.mapExpression(this.node.left), right = this.mapExpression(this.node.right);

			if (!left || !right || operator === "??") {
				return;
			}

			const value: Dafny.LogicalExpressionValue[] = [];
			const operations: ("&&"|"||")[] = [];

			if (left.type === "LogicalExpression") {
				value.push(...left.value);
				operations.push(...left.operations);
			}
			else if(left.type === "EquivExpression" || left.type === "ImpliesExpliesExpression") {
				throw new Error("EquivExpression and ImpliesExpliesExpression are not allowed");
			}
			else {
				value.push(left);
			}

			operations.push(operator);

			if (right.type === "LogicalExpression") {
				value.push(...right.value);
				operations.push(...right.operations);
			}
			else if(right.type === "EquivExpression" || right.type === "ImpliesExpliesExpression") {
				throw new Error("EquivExpression and ImpliesExpliesExpression are not allowed");
			}
			else {
				value.push(right);
			}

			return createLogicalExpression(value, operations);
		}
		else if (this.node.type === "BinaryExpression") {
			let operator = this.node.operator;

			this.includeOperators(operator, ["===", "==", "!==", "!=", "<=", "<", ">=", ">"]);

			if (operator === "===") operator = "==";
			else if (operator === "!==") operator = "!=";
			else if (operator !== "==" && operator !== "!=" && operator !== "<=" && operator !== "<" && operator !== ">=" && operator !== ">") {
				return;
			}

			if (this.node.left.type === "PrivateIdentifier") {
				throw new Error("PrivateIdentifier is not allowed");
			}

			const left = this.mapExpression(this.node.left), right = this.mapExpression(this.node.right);

			if (!left || !right) {
				return;
			}

			if (right.type === "LogicalExpression" || right.type === "EquivExpression" || right.type === "ImpliesExpliesExpression" || right.type === "RelationalExpression") {
				throw new Error("LogicalExpression, EquivExpression, RelationalExpression and ImpliesExpliesExpression are not allowed");
			}
			else if (left.type === "LogicalExpression" || left.type === "EquivExpression" || left.type === "ImpliesExpliesExpression" || left.type === "RelationalExpression") {
				throw new Error("LogicalExpression, EquivExpression, RelationalExpression and ImpliesExpliesExpression are not allowed");
			}

			return createRelationalExpression([left, right], [createRelOp(operator)]);
		}
	}

	includeOperators(operator: string, operators: string[]) {
		if (!operators.includes(operator)) {
			throw new Error(`Operator ${operator} is not allowed`);
		}
	}

	mapExpression(expression: TSESTree.Expression): Dafny.RhsValue|undefined {
		const leftMapper = new ExpressionMapper(expression, this.options, this.context);
		return leftMapper.map();
	}

	order(type: string) {
		return [
			"Expression",
			"EquivExpression",
			"ImpliesExpliesExpression",
			""
		].indexOf(type);
	}

	getType() {
		if (this.node.type === "NewExpression") {
			const callee = this.node.callee as TSESTree.Identifier;

			return callee.name;
		}
		else if (this.node.type === "Literal") {
			if (typeof this.node.value === "string") {
				return "string";
			}
			else if (typeof this.node.value === "number") {
				return "number";
			}
			else if (typeof this.node.value === "boolean") {
				return "boolean";
			}
		}
	}
}

export default ExpressionMapper;