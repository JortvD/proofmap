import { Dafny } from "./types";

export function createMethodDecl(
	name: string,
	keyword: Dafny.MethodKeywordValue,
	value: Dafny.BlockStmt,
	parameters: Dafny.Formals,
	returns: Dafny.Formals,
	specification: Dafny.SpecValue[] = []
): Dafny.MethodDecl {
	return {
		type: "MethodDecl",
		keyword: {
			type: "MethodKeyword",
			value: keyword,
		},
		name,
		specification: {
			type: "MethodSpec",
			value: specification
		},
		signature: {
			type: "MethodSignature_",
			parameters,
			returns,
		},
		value,
	};
}

export function createRequiresClause(
	value: Dafny.Expression
): Dafny.RequiresClause {
	return {
		type: "RequiresClause",
		value,
	};
}

export function createEnsuresClause(
	value: Dafny.Expression
): Dafny.EnsuresClause {
	return {
		type: "EnsuresClause",
		value,
	};
}

export function createFormals(value: Dafny.GIdentType[]): Dafny.Formals {
	return {
		type: "Formals",
		value,
	};
}

export function createFunctionDecl(
	name: string,
	value: Dafny.FunctionBody,
	signature: Dafny.FunctionDeclSignature,
	specification: Dafny.SpecValue[] = []
): Dafny.FunctionDecl {
	return {
		type: "FunctionDecl",
		name,
		signature,
		specification: {
			type: "FunctionSpec",
			value: specification
		},
		value,
	};
}

export function createFunctionSignature_(
	parameters: Dafny.Formals,
	returns: Dafny.Type
): Dafny.FunctionSignature_ {
	return {
		type: "FunctionSignature_",
		parameters,
		returns,
	};
}

export function createPredicateSignature_(
	parameters: Dafny.Formals
): Dafny.PredicateSignature_ {
	return {
		type: "PredicateSignature_",
		parameters,
	};
}

export function createFunctionBody(value: Dafny.Expression): Dafny.FunctionBody {
	return {
		type: "FunctionBody",
		value,
	};
}

export function createFunctionSpec(value: Dafny.SpecValue[]): Dafny.FunctionSpec {
	return {
		type: "FunctionSpec",
		value,
	};
}

export function createType(value: Dafny.TypeValue): Dafny.Type {
	return {
		type: "Type",
		value,
	};
}

export function createDomainType_(value: Dafny.DomainType_Value): Dafny.DomainType_ {
	return {
		type: "DomainType_",
		value,
	};
}

export function createBoolType_(): Dafny.BoolType_ {
	return {
		type: "BoolType_",
		value: "bool",
	};
}

export function createIntType_(): Dafny.IntType_ {
	return {
		type: "IntType_",
		value: "int",
	};
}

export function createStringType_(): Dafny.StringType_ {
	return {
		type: "StringType_",
		value: "string",
	};
}

export function createGIndentType(value: Dafny.IdentType): Dafny.GIdentType {
	return {
		type: "GIdentType",
		value,
	};
}

export function createIndentType(name: string, type: Dafny.Type): Dafny.IdentType {
	return {
		type: "IdentType",
		name,
		type_: type,
	};
}

export function createBlockStmt(value: Dafny.Stmt[]): Dafny.BlockStmt {
	return {
		type: "BlockStmt",
		value,
	};
}

export function createReturnStmt(value: Dafny.Rhs[]): Dafny.ReturnStmt {
	return {
		type: "ReturnStmt",
		value,
	};
}

export function createStmt(value: Dafny.StmtValue): Dafny.Stmt {
	return {
		type: "Stmt",
		value,
	};
}

export function createClassDecl(
	name: string,
	value: Dafny.ClassMemberDecl[]
): Dafny.ClassDecl {
	return {
		type: "ClassDecl",
		name,
		value,
	};
}

export function createClassMemberDecl(
	value: Dafny.ClassMemberDeclValue
): Dafny.ClassMemberDecl {
	return {
		type: "ClassMemberDecl",
		value,
	};
}

export function createLiteralExpression(
	value: Dafny.LiteralExpressionValue
): Dafny.LiteralExpression {
	return {
		type: "LiteralExpression",
		value,
	};
}

export function createUpdateStmt(
	lhs: Dafny.Lhs[],
	rhs: Dafny.Rhs[]
): Dafny.UpdateStmt {
	return {
		type: "UpdateStmt",
		key: lhs,
		value: rhs,
	};
}

export function createVarDeclStatement(
	key: string[],
	init: Dafny.Rhs[]
): Dafny.VarDeclStatement {
	return {
		type: "VarDeclStatement",
		key,
		init,
	};
}

export function createRhs(value: Dafny.Expression): Dafny.Rhs {
	return {
		type: "Rhs",
		value,
	};
}

export function createLhs(value: Dafny.NameSegment): Dafny.Lhs {
	return {
		type: "Lhs",
		value,
	};
}

export function createNameSegment(value: string, suffixes: Dafny.Suffix[] = []): Dafny.NameSegment {
	return {
		type: "NameSegment",
		value,
		suffixes,
	};
}

export function createSuffix(value: Dafny.SuffixValue): Dafny.Suffix {
	return {
		type: "Suffix",
		value,
	};
}

export function createAugmentedDotSuffix_(value: Dafny.DotSuffix): Dafny.AugmentedDotSuffix_ {
	return {
		type: "AugmentedDotSuffix_",
		value,
	};
}

export function createDotSuffix(value: string): Dafny.DotSuffix {
	return {
		type: "DotSuffix",
		value,
	}
}

export function createDafny(value: Dafny.TopDecl[]): Dafny.Dafny {
	return {
		type: "Dafny",
		value,
	};
}

export function createTopDecl(
	value: Dafny.TopDeclValue
): Dafny.TopDecl {
	return {
		type: "TopDecl",
		value,
	};
}

export function createSubModuleDecl(
	value: Dafny.ModuleDefinition
): Dafny.SubModuleDecl {
	return {
		type: "SubModuleDecl",
		value,
	};
}

export function createModuleDefinition(
	name: string,
	value: Dafny.TopDecl[]
): Dafny.ModuleDefinition {
	return {
		type: "ModuleDefinition",
		name,
		value,
	};
}

export function createLogicalExpression(
	value: Dafny.RelationalExpression[], operations: Dafny.LogOp[]
): Dafny.LogicalExpression {
	return {
		type: "LogicalExpression",
		value,
		operations,
	};
}

export function createLogOp(
	value: Dafny.LogOpValue
): Dafny.LogOp {
	return {
		type: "LogOp",
		value,
	};
}

export function createRelationalExpression(
	value: Dafny.ShiftTerm[], operations: Dafny.RelOp[]
): Dafny.RelationalExpression {
	return {
		type: "RelationalExpression",
		value,
		operations,
	};
}

export function createPrimaryExpression(
	value: Dafny.PrimaryExpressionValue
): Dafny.PrimaryExpression {
	return {
		type: "PrimaryExpression",
		value,
	};
}

export function createUnaryExpression(
	value: Dafny.PrimaryExpression
): Dafny.UnaryExpression {
	return {
		type: "UnaryExpression",
		value,
	};
}

export function createAsExpression(
	value: Dafny.UnaryExpression,
	type_?: Dafny.Type
): Dafny.AsExpression {
	return {
		type: "AsExpression",
		value,
		type_,
	};
}

export function createBitvectorFactor(
	value: Dafny.AsExpression[],
	operations: Dafny.BVOp[]
): Dafny.BitvectorFactor {
	return {
		type: "BitvectorFactor",
		value,
		operations,
	};
}

export function createFactor(
	value: Dafny.BitvectorFactor[],
	operations: Dafny.MulOp[]
): Dafny.Factor {
	return {
		type: "Factor",
		value,
		operations,
	};
}

export function createTerm(
	value: Dafny.Factor[],
	operations: Dafny.AddOp[]
): Dafny.Term {
	return {
		type: "Term",
		value,
		operations,
	};
}

export function createShiftTerm(
	value: Dafny.Term[],
	operations: Dafny.ShiftOp[]
): Dafny.ShiftTerm {
	return {
		type: "ShiftTerm",
		value,
		operations,
	};
}

export function createImpliesExpliesExpression(
	value: Dafny.LogicalExpression,
	rightDir?: Dafny.ImpliesExpression,
	leftDir?: Dafny.LogicalExpression[],
): Dafny.ImpliesExpliesExpression {
	return {
		type: "ImpliesExpliesExpression",
		value,
		rightDir,
		leftDir,
	};
}

export function createEquivExpression(
	value: Dafny.ImpliesExpliesExpression[]
): Dafny.EquivExpression {
	return {
		type: "EquivExpression",
		value,
	};
}

export function createExpression(
	value: Dafny.EquivExpression
): Dafny.Expression {
	return {
		type: "Expression",
		value,
	};
}

export function createRelOp(
	value: ("=="|"!="|"<="|"<"|">="|">"|"in"|"!in"|"!!")
): Dafny.RelOp {
	return {
		type: "RelOp",
		value,
	};
}

export function createConstAtomExpression(
	value: Dafny.ConstAtomExpressionValue
): Dafny.ConstAtomExpression {
	return {
		type: "ConstAtomExpression",
		value,
	};
}

export function createCardinalityExpression_(
	value: Dafny.Expression
): Dafny.CardinalityExpression_ {
	return {
		type: "CardinalityExpression_",
		value,
	};
}

export function expressionOrder(to: string) {
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

export function createTo<T>(from: Dafny.RhsValue, to: string): T {
	let value = from;
	const order = expressionOrder(to);

	if (value.type === "NameSegment" && order > expressionOrder("NameSegment")) {
		value = createPrimaryExpression(value);
	}
	else if (value.type === "ConstAtomExpression" && order > expressionOrder("ConstAtomExpression")) {
		value = createPrimaryExpression(value);
	}

	if (value.type === "PrimaryExpression" && order > expressionOrder("PrimaryExpression")) {
		value = createUnaryExpression(value);
	}

	if (value.type === "UnaryExpression" && order > expressionOrder("UnaryExpression")) {
		value = createAsExpression(value);
	}

	if (value.type === "AsExpression" && order > expressionOrder("AsExpression")) {
		value = createBitvectorFactor([value], []);
	}

	if (value.type === "BitvectorFactor" && order > expressionOrder("BitvectorFactor")) {
		value = createFactor([value], []);
	}

	if (value.type === "Factor" && order > expressionOrder("Factor")) {
		value = createTerm([value], []);
	}

	if (value.type === "Term" && order > expressionOrder("Term")) {
		value = createShiftTerm([value], []);
	}

	if (value.type === "ShiftTerm" && order > expressionOrder("ShiftTerm")) {
		value = createRelationalExpression([value], []);
	}

	if (value.type === "RelationalExpression" && order > expressionOrder("RelationalExpression")) {
		value = createLogicalExpression([value], []);
	}

	if (value.type === "LogicalExpression" && order > expressionOrder("LogicalExpression")) {
		value = createImpliesExpliesExpression(value);
	}

	if (value.type === "ImpliesExpliesExpression" && order > expressionOrder("ImpliesExpliesExpression")) {
		value = createEquivExpression([value]);
	}

	if (value.type === "EquivExpression" && order > expressionOrder("EquivExpression")) {
		value = createExpression(value);
	}

	return value as T;
}