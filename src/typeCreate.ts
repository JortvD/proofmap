import { Dafny } from "./types";

export function createMethodDecl(name: string, keyword: Dafny.MethodKeywordValue, value: Dafny.BlockStmt) {
	const type: Dafny.MethodDecl = {
		type: "MethodDecl",
		keyword: {
			type: "MethodKeyword",
			value: keyword
		},
		name: name,
		specification: undefined,
		value
	}

	return type;
}

export function createBlockStmt(value: Dafny.Stmt[]) {
	const type: Dafny.BlockStmt = {
		type: "BlockStmt",
		value
	}

	return type;
}

export function createStmt(value: Dafny.StmtValue) {
	const type: Dafny.Stmt = {
		type: "Stmt",
		value
	}

	return type;
}

export function createClassDecl(name: string, value: Dafny.ClassMemberDecl[]) {
	const type: Dafny.ClassDecl = {
		type: "ClassDecl",
		name,
		value
	}

	return type;
}

export function createClassMemberDecl(value: Dafny.MethodDecl) {
	const type: Dafny.ClassMemberDecl = {
		type: "ClassMemberDecl",
		value
	}

	return type;
}

export function createLiteralExpression(value: Dafny.LiteralExpressionType) {
	const data: Dafny.LiteralExpression = {
		type: "LiteralExpression",
		value
	}

	return data;
}

export function createUpdateStmt(lhs: Dafny.Lhs[], rhs: Dafny.Rhs[]) {
	const type: Dafny.UpdateStmt = {
		type: "UpdateStmt",
		key: lhs,
		value: rhs
	}

	return type;
}

export function createVarDeclStatement(key: string[], init: Dafny.Rhs[]) {
	const type: Dafny.VarDeclStatement = {
		type: "VarDeclStatement",
		key,
		init
	}

	return type;
}

export function createRhs(value: Dafny.RhsValue) {
	const type: Dafny.Rhs = {
		type: "Rhs",
		value
	}

	return type;
}

export function createLhs(value: Dafny.NameSegment) {
	const type: Dafny.Lhs = {
		type: "Lhs",
		value
	}

	return type;
}

export function createNameSegment(value: string) {
	const type: Dafny.NameSegment = {
		type: "NameSegment",
		value
	}

	return type;
}

export function createDafny(value: Dafny.TopDecl[]) {
	const type: Dafny.Dafny = {
		type: "Dafny",
		value
	}

	return type;
}

export function createTopDecl(value: Dafny.ClassDecl|Dafny.SubModuleDecl) {
	const type: Dafny.TopDecl = {
		type: "TopDecl",
		value
	}

	return type;
}

export function createSubModuleDecl(value: Dafny.ModuleDefinition) {
	const type: Dafny.SubModuleDecl = {
		type: "SubModuleDecl",
		value
	}

	return type;
}

export function createModuleDefinition(name: string, value: Dafny.TopDecl[]) {
	const type: Dafny.ModuleDefinition = {
		type: "ModuleDefinition",
		name,
		value
	}

	return type;
}