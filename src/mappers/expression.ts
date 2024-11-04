import { TSESTree } from "@typescript-eslint/typescript-estree";
import AbstractMapper from "./abstract";
import { Dafny } from "../types";

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
			if (typeof this.node.value !== "string" && typeof this.node.value !== "number" && typeof this.node.value !== "boolean") {
				throw new Error("Literal value must be a string, number, boolean or null");
			}

			let value = this.node.value;

			if (typeof value === "boolean") {
				value = value ? "true" : "false";
			}

			return this.createLiteralExpression(value);
		}
		else if (this.node.type === "CallExpression") {
			if (this.node.callee.type === "MemberExpression") {
				const object = this.node.callee.object as TSESTree.Identifier;
				const property = this.node.callee.property as TSESTree.Identifier;

				if(this.context.variables.get(object.name) === 'ProofMap') {
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
	}

	createLiteralExpression(value: Dafny.LiteralExpressionType) {
		const data: Dafny.LiteralExpression = {
			type: "LiteralExpression",
			value
		}

		return data;
	}

	getType() {
		if (this.node.type === "NewExpression") {
			const callee = this.node.callee as TSESTree.Identifier;

			return callee.name;
		}
	}
}

export default ExpressionMapper;