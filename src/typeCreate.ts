import { Dafny } from "./types";

export function createMethodDecl(
	name: string,
	keyword: Dafny.MethodKeywordValue,
	value: Dafny.BlockStmt,
	parameters: Dafny.Formals,
	returns: Dafny.Formals
): Dafny.MethodDecl {
	return {
		type: "MethodDecl",
		keyword: {
			type: "MethodKeyword",
			value: keyword,
		},
		name,
		specification: undefined,
		signature: {
			type: "MethodSignature_",
			parameters: parameters,
			returns,
		},
		value,
	};
}

export function createFormals(value: Dafny.GIdentType[]): Dafny.Formals {
	return {
		type: "Formals",
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
	value: Dafny.MethodDecl
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

export function createNameSegment(value: string): Dafny.NameSegment {
	return {
		type: "NameSegment",
		value,
	};
}

export function createDafny(value: Dafny.TopDecl[]): Dafny.Dafny {
	return {
		type: "Dafny",
		value,
	};
}

export function createTopDecl(
	value: Dafny.ClassDecl | Dafny.SubModuleDecl
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
	value: Dafny.LiteralExpression
): Dafny.ConstAtomExpression {
	return {
		type: "ConstAtomExpression",
		value,
	};
}