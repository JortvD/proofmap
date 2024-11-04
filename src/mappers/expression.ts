import { TSESTree } from "@typescript-eslint/typescript-estree";
import AbstractMapper from "./abstract";
import { Dafny } from "../types";
import LiteralMapper from "./literal";
import IdentifierMapper from "./identifier";
import { createAsExpression, createAugmentedDotSuffix_, createBitvectorFactor, createConstAtomExpression, createDotSuffix, createEnsuresClause, createEquivExpression, createExpression, createFactor, createImpliesExpliesExpression, createLogicalExpression, createLogOp, createNameSegment, createPrimaryExpression, createRelationalExpression, createRelOp, createRequiresClause, createRhs, createShiftTerm, createSuffix, createTerm, createTo, expressionOrder } from "../typeCreate";
import { create } from "domain";
import { createType, createTypeProperty, Type } from "../store/type";
import { createVariable } from "../store/variable";

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

		return createTo<Dafny.Expression>(value, "Expression");
	}

	subMap(node: TSESTree.Expression): Dafny.RhsValue|undefined {
		if (node.type === "Literal") {
			const mapper = new LiteralMapper(node, this.options, this.context);

			return createConstAtomExpression(mapper.map());
		}
		else if (node.type === "Identifier") {
			const mapper = new IdentifierMapper(node, this.options, this.context);

			return mapper.map();
		}
		else if (node.type === "MemberExpression") {
			const list = this.getListFromMemberExpression(node);
			const variableType = this.context.variables.getType(list[0].name);

			if (!variableType) {
				throw new Error("Variable not found");
			}
			const type = this.context.types.get(variableType);
			
			if (!type) {
				throw new Error("Type not found");
			}

			const expressionList = [...list.slice(1).map((l) => l.name)];
			const suffixes: Dafny.Suffix[] = [];
			let memberType: Type = type;

			for (const member of expressionList) {
				memberType = memberType.members.find((m) => m.name === member);

				if (!memberType) {
					throw new Error("Member type not found");
				}

				if(memberType.replaceProperty) {
					return memberType.replaceProperty(createNameSegment(list[0].name, suffixes));
				}

				suffixes.push(createSuffix(createAugmentedDotSuffix_(createDotSuffix(member))));
			}

			return createNameSegment(list[0].name, suffixes);
		}
		else if (node.type === "CallExpression") {
			if (node.callee.type === "MemberExpression") {
				const object = node.callee.object as TSESTree.Identifier;
				const property = node.callee.property as TSESTree.Identifier;

				if(this.context.variables.getType(object.name) === 'ProofMap') {
					const argument = this.checkProofMapValidArguments();

					if(property.name === 'requires') {
						const expression = this.mapMethodSpecArrowFunction(argument, false);
						this.context.methodSpec.push(createRequiresClause(expression));
					}
					else if (property.name === 'ensures') {
						const expression = this.mapMethodSpecArrowFunction(argument, true);
						this.context.methodSpec.push(createEnsuresClause(expression));
					}

					return;
				}

				throw new Error("Not implemented");
			}
		}
		else if (node.type === "LogicalExpression") {
			const operator = node.operator;
			this.checkAllowedOperators(operator, ["&&", "||"]);

			const {value, operations} = this.mapLeftRight<Dafny.RelationalExpression,Dafny.LogOp>(
				node, 
				createLogOp(operator as Dafny.LogOpValue),
				"LogicalExpression",
				"RelationalExpression"
			);

			return createLogicalExpression(value, operations);
		}
		else if (node.type === "BinaryExpression") {
			let operator = this.mapOperator(node.operator, {
				"===": "==",
				"!==": "!=",
			});
			this.checkAllowedOperators(operator, ["===", "==", "!==", "!=", "<=", "<", ">=", ">"]);

			const {value, operations} = this.mapLeftRight<Dafny.ShiftTerm,Dafny.RelOp>(
				node, 
				createRelOp(operator as Dafny.RelOpValue),
				"RelationalExpression",
				"ShiftTerm"
			);

			return createRelationalExpression(value, operations);
		}
	}

	mapMethodSpecArrowFunction(node: TSESTree.ArrowFunctionExpression, setOutput: boolean): Dafny.Expression {
		const param = node.params[0];

		if (!setOutput && param) {
			if (param.type !== "Identifier") {
				throw new Error("Only Identifier is allowed as parameter");
			}
			
			this.context.variables.add(createVariable(param.name, "pm_Output"));
			this.context.types.add(createTypeProperty("pm_Output", [], () => createNameSegment(this.options.defaultReturnsName)));
		}

		if (!node.expression) {
			throw new Error("Only expression is allowed as body");
		}

		const mapper = new ExpressionMapper(node.body as TSESTree.Expression, this.options, this.context);
		const value = mapper.map();

		if (!value) {
			throw new Error("Value must be defined");
		}

		return value;
	}

	mapLeftRight<T,U>(
		node: TSESTree.LogicalExpression|TSESTree.BinaryExpression, 
		operator: U, 
		toType: "LogicalExpression"|"RelationalExpression", 
		valueType: "RelationalExpression"|"ShiftTerm"
	): {value: T[], operations: U[]} {
		if (node.left.type === "PrivateIdentifier") {
			throw new Error("PrivateIdentifier is not allowed");
		}

		const left = this.subMap(node.left), right = this.subMap(node.right);

		if (!left || !right) {
			throw new Error("Left and right must be defined");
		}

		const value: T[] = [];
		const operations: U[] = [];

		if (left.type === toType) {
			value.push(...(left.value as T[]));
			operations.push(...(left.operations as U[]));
		}
		else if(expressionOrder(left.type) >= expressionOrder(valueType)) {
			throw new Error(`The child ${left.type} is not allowed for RelationalExpression`);
		}
		else {
			value.push(createTo(left, valueType));
		}

		operations.push(operator as U);

		if (right.type === toType) {
			value.push(...(right.value as T[]));
			operations.push(...(right.operations as U[]));
		}
		else if(expressionOrder(right.type) >= expressionOrder(valueType)) {
			throw new Error(`The child ${right.type} is not allowed for RelationalExpression`);
		}
		else {
			value.push(createTo(right, valueType));
		}
		
		return {value, operations};
	}

	getListFromMemberExpression(node: TSESTree.MemberExpression): TSESTree.Identifier[] {
		const list: TSESTree.Identifier[] = [];

		if (node.object.type === "Identifier") {
			list.push(node.object);
		}
		else if (node.object.type === "MemberExpression") {
			list.push(...this.getListFromMemberExpression(node.object));
		}
		else {
			return [];
		}

		if (node.property.type === "Identifier") {
			list.push(node.property);
		}

		return list;
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