import { TSESTree } from "@typescript-eslint/typescript-estree";
import AbstractMapper from "./abstract";
import { Dafny } from "../types";
import LiteralMapper from "./literal";
import IdentifierMapper from "./identifier";
import { createAsExpression, createBitvectorFactor, createConstAtomExpression, createEquivExpression, createExpression, createFactor, createImpliesExpliesExpression, createLogicalExpression, createLogOp, createPrimaryExpression, createRelationalExpression, createRelOp, createRhs, createShiftTerm, createTerm, createUnaryExpression } from "../typeCreate";
import { create } from "domain";

class ExpressionMapper extends AbstractMapper<TSESTree.Expression,Dafny.Expression> {
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
		const value = this.subMap(this.node);

		if (!value) {
			return;
		}

		return this.createTo<Dafny.Expression>(value, "Expression");
	}

	subMap(node: TSESTree.Expression): Dafny.RhsValue|undefined {
		console.log(node.type, node);
		if (node.type === "Literal") {
			const mapper = new LiteralMapper(node, this.options, this.context);

			return createConstAtomExpression(mapper.map());
		}
		else if (node.type === "Identifier") {
			const mapper = new IdentifierMapper(node, this.options, this.context);

			return mapper.map();
		}
		else if (node.type === "MemberExpression") {
			const variable = this.context.variables.getTypeFromMemberExpression(node);

			if (!variable) {
				throw new Error("Variable not found");
			}

			
		}
		else if (node.type === "CallExpression") {
			if (node.callee.type === "MemberExpression") {
				const object = node.callee.object as TSESTree.Identifier;
				const property = node.callee.property as TSESTree.Identifier;

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
		else if (node.type === "LogicalExpression") {
			const operator = node.operator;
			this.checkAllowedOperators(operator, ["&&", "||"]);

			const {value, operations} = this.mapLeftRight<Dafny.RelationalExpression,Dafny.LogOp>(node, createLogOp(operator as Dafny.LogOpValue));

			return createLogicalExpression(value, operations);
		}
		else if (node.type === "BinaryExpression") {
			let operator = this.mapOperator(node.operator, {
				"===": "==",
				"!==": "!=",
			});
			this.checkAllowedOperators(operator, ["===", "==", "!==", "!=", "<=", "<", ">=", ">"]);

			const {value, operations} = this.mapLeftRight<Dafny.ShiftTerm,Dafny.RelOp>(node, createRelOp(operator as Dafny.RelOpValue));
		}
	}

	mapLeftRight<T,U>(node: TSESTree.LogicalExpression|TSESTree.BinaryExpression, operator: U): {value: T[], operations: U[]} {
		if (node.left.type === "PrivateIdentifier") {
			throw new Error("PrivateIdentifier is not allowed");
		}

		const left = this.subMap(node.left), right = this.subMap(node.right);

		if (!left || !right) {
			throw new Error("Left and right must be defined");
		}

		const value: T[] = [];
		const operations: U[] = [];

		if (left.type === "LogicalExpression") {
			value.push(...(left.value as T[]));
			operations.push(...(left.operations as U[]));
		}
		else if(this.order(left.type) >= this.order("RelationalExpression")) {
			throw new Error(`The child ${left.type} is not allowed for RelationalExpression`);
		}
		else {
			value.push(this.createTo(left, "RelationalExpression"));
		}

		operations.push(operator as U);

		if (right.type === "LogicalExpression") {
			value.push(...(right.value as T[]));
			operations.push(...(right.operations as U[]));
		}
		else if(this.order(right.type) >= this.order("RelationalExpression")) {
			throw new Error(`The child ${right.type} is not allowed for RelationalExpression`);
		}
		else {
			value.push(this.createTo(right, "RelationalExpression"));
		}
		
		return {value, operations};
	}

	order(to: string) {
		let i = 0;
		return {
			"ConstAtomExpression": i,
			"NameSegment": i++,
			"PrimaryExpression": i++,
			"UnaryExpression":  i++,
			"AsExpression": i++,
			"BitvectorFactor": i++,
			"Factor": i++,
			"Term": i++,
			"ShiftTerm": i++,
			"RelationalExpression": i++,
			"LogicalExpression": i++,
			"ImpliesExpliesExpression": i++,
			"EquivExpression": i++,
			"Expression": i++,
		}[to];
	}

	createTo<T>(from: Dafny.RhsValue, to: string): T {
		let value = from;
		const order = this.order(to);

		if (value.type === "NameSegment" && order > this.order("NameSegment")) {
			value = createPrimaryExpression(value);
		}
		else if (value.type === "ConstAtomExpression" && order > this.order("ConstAtomExpression")) {
			value = createPrimaryExpression(value);
		}

		if (value.type === "PrimaryExpression" && order > this.order("PrimaryExpression")) {
			value = createUnaryExpression(value);
		}

		if (value.type === "UnaryExpression" && order > this.order("UnaryExpression")) {
			value = createAsExpression(value);
		}

		if (value.type === "AsExpression" && order > this.order("AsExpression")) {
			value = createBitvectorFactor([value], []);
		}

		if (value.type === "BitvectorFactor" && order > this.order("BitvectorFactor")) {
			value = createFactor([value], []);
		}

		if (value.type === "Factor" && order > this.order("Factor")) {
			value = createTerm([value], []);
		}

		if (value.type === "Term" && order > this.order("Term")) {
			value = createShiftTerm([value], []);
		}

		if (value.type === "ShiftTerm" && order > this.order("ShiftTerm")) {
			value = createRelationalExpression([value], []);
		}

		if (value.type === "RelationalExpression" && order > this.order("RelationalExpression")) {
			value = createLogicalExpression([value], []);
		}

		if (value.type === "LogicalExpression" && order > this.order("LogicalExpression")) {
			value = createImpliesExpliesExpression(value);
		}

		if (value.type === "ImpliesExpliesExpression" && order > this.order("ImpliesExpliesExpression")) {
			value = createEquivExpression([value]);
		}

		if (value.type === "EquivExpression" && order > this.order("EquivExpression")) {
			value = createExpression(value);
		}

		return value as T;
	}

	checkAllowedOperators(operator: string, operators: string[]) {
		if (!operators.includes(operator)) {
			throw new Error(`Operator ${operator} is not allowed`);
		}
	}

	mapOperator(operator: string, map: {[from: string]: string}) {
		if (map[operator]) {
			return map[operator];
		}

		return operator;
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