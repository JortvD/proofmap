import { Dafny } from "./types";

export interface BuildOptions {
	indentation: string;
}

class Builder {
	indentation: string;

	constructor({indentation = '  '}: BuildOptions) {
		this.indentation = indentation;
	}

	indent(value: string): string {
		return value.split('\n').map((line) => line.trim() !== "" ? this.indentation + line : line).join('\n');
	}

	buildDafny({value}: Dafny.Dafny): string {
		return value.map(topDecl => this.buildTopDecl(topDecl)).join("\n");
	}

	buildTopDecl({value}: Dafny.TopDecl): string {
		if(value.type === "SubModuleDecl") {
			return this.buildSubModuleDecl(value);
		} else if(value.type === "ClassDecl") {
			return this.buildClassDecl(value);
		}

		return "";
	}

	buildSubModuleDecl({value}: Dafny.SubModuleDecl): string {
		return this.buildModuleDefinition(value);
	}

	buildModuleDefinition({name, value}: Dafny.ModuleDefinition): string {
		const body = value.map(topDecl => this.buildTopDecl(topDecl)).join("\n");

		return `module ${name} {\n${this.indent(body)}\n}`;
	}

	buildClassDecl({name, value}: Dafny.ClassDecl): string {
		const body = value.map(classMemberDecl => this.buildClassMemberDecl(classMemberDecl)).join("\n");

		return `class ${name} {\n${this.indent(body)}\n}`;
	}

	buildClassMemberDecl({value}: Dafny.ClassMemberDecl): string {
		if(value.type === "MethodDecl") {
			return this.buildMethodDecl(value);
		}

		return "";
	}

	buildMethodDecl({keyword, name, value, signature}: Dafny.MethodDecl): string {
		const body = this.buildBlockStmt(value);

		return `${this.buildMethodKeyword(keyword)} ${name}${this.buildMethodSignature_(signature)} {\n${this.indent(body)}\n}`;
	}

	buildMethodSignature_({parameters, returns}: Dafny.MethodSignature_): string {
		const returnsText = returns.value.length > 0 ? ` returns ${this.buildFormals(returns)}` : "";

		return `${this.buildFormals(parameters)}${returnsText}`;
	}

	buildFormals({value}: Dafny.Formals): string {
		return `(${value.map(gIdentType => this.buildGIdentType(gIdentType)).join(", ")})`;
	}

	buildGIdentType({value}: Dafny.GIdentType): string {
		return this.buildIdentType(value);
	}

	buildIdentType({name, type_}: Dafny.IdentType): string {
		return `${name}: ${this.buildType(type_)}`;
	}

	buildType({value}: Dafny.Type): string {
		if (value.type === "DomainType_") {
			return this.buildDomainType_(value);
		}

		return "";
	}

	buildDomainType_({value}: Dafny.DomainType_): string {
		if (value.type === "BoolType_") {
			return this.buildBoolType_(value);
		}
		else if (value.type === "IntType_") {
			return this.buildIntType_(value);
		}
		else if (value.type === "StringType_") {
			return this.buildStringType_(value);
		}
	}

	buildBoolType_({value}: Dafny.BoolType_): string {
		return value;
	}

	buildIntType_({value}: Dafny.IntType_): string {
		return value;
	}

	buildStringType_({value}: Dafny.StringType_): string {
		return value;
	}

	buildMethodKeyword({value}: Dafny.MethodKeyword): string {
		return value;
	}
	
	buildBlockStmt({value}: Dafny.BlockStmt): string {
		return value.map(stmt => this.buildStmt(stmt)).join("\n");
	}

	buildStmt({value}: Dafny.Stmt): string {
		if(value.type === "VarDeclStatement") {
			return this.buildVarDeclStatement(value);
		}
		else if(value.type === "UpdateStmt") {
			return this.buildUpdateStmt(value);
		}
		else if(value.type === "ReturnStmt") {
			return this.buildReturnStmt(value);
		}

		return "";
	}

	buildVarDeclStatement({key, init}: Dafny.VarDeclStatement): string {
		return `var ${key.join(", ")} := ${init.map(rhs => this.buildRhs(rhs)).join(", ")};`;
	}

	buildUpdateStmt({key, value}: Dafny.UpdateStmt): string {
		return `${key.map(lhs => this.buildLhs(lhs)).join(", ")} := ${value.map(rhs => this.buildRhs(rhs)).join(", ")};`;
	}

	buildReturnStmt({value}: Dafny.ReturnStmt): string {
		const returnValue = value.length > 0 ? ` ${value.map(rhs => this.buildRhs(rhs)).join(", ")}` : "";

		return `return${returnValue};`;
	}

	buildRhs({value}: Dafny.Rhs): string {
		if(value.type === "ConstAtomExpression") {
			return this.buildConstAtomExpression(value);
		}
		else if(value.type === "NameSegment") {
			return this.buildNameSegment(value);
		}
		else if(value.type === "LogicalExpression") {
			return this.buildLogicalExpression(value);
		}

		return "";
	}

	buildLogicalExpression({value, operations}: Dafny.LogicalExpression): string {
		const valueText: string[] = [];

		for(let child of value) {
			if(child.type === "RelationalExpression") {
				valueText.push(this.buildRelationalExpression(child));
			}
			else if(child.type === "ShiftTerm") {
				valueText.push(this.buildShiftTerm(child));
			}
			else if(child.type === "AddTerm") {
				valueText.push(this.buildAddTerm(child));
			}
		}

		return ``;
	}

	buildLhs({value}: Dafny.Lhs): string {
		if(value.type === "NameSegment") {
			return this.buildNameSegment(value);
		}

		return "";
	}

	buildNameSegment({value}: Dafny.NameSegment): string {
		return value;
	}

	buildConstAtomExpression({value}: Dafny.ConstAtomExpression): string {
		if(value.type === "LiteralExpression") {
			return this.buildLiteralExpression(value);
		}

		return "";
	}

	buildLiteralExpression({value}: Dafny.LiteralExpression): string {
		if (value === "true" || value === "false") {
			return value;
		}
		else if (value === "null") {
			return "null";
		}
		else if (typeof value === "string") {
			return `"${value}"`;
		}
		else {
			return value.toString();
		}
	}
}

export default Builder;