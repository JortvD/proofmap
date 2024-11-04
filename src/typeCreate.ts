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

export function createRhs(value: Dafny.RhsValue): Dafny.Rhs {
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
	value: Dafny.LogicalExpressionValue[], operations: ("&&"|"||")[]
): Dafny.LogicalExpression {
	return {
		type: "LogicalExpression",
		value,
		operations,
	};
}

export function createRelationalExpression(
	value: Dafny.RelationalExpressionValue[], operations: Dafny.RelOp[]
): Dafny.RelationalExpression {
	return {
		type: "RelationalExpression",
		value,
		operations,
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