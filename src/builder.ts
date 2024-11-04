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

	buildMethodDecl({keyword, name, value}: Dafny.MethodDecl): string {
		const body = this.buildBlockStmt(value);

		return `${this.buildMethodKeyword(keyword)} ${name}() {\n${this.indent(body)}\n}`;
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

		return "";
	}

	buildVarDeclStatement({key, init}: Dafny.VarDeclStatement): string {
		return `var ${key.join(", ")} := ${init.map(rhs => this.buildRhs(rhs)).join(", ")};`;
	}

	buildUpdateStmt({key, value}: Dafny.UpdateStmt): string {
		return `${key.map(lhs => this.buildLhs(lhs)).join(", ")} := ${value.map(rhs => this.buildRhs(rhs)).join(", ")};`;
	}

	buildRhs({value}: Dafny.Rhs): string {
		if(value.type === "LiteralExpression") {
			return this.buildLiteralExpression(value);
		}

		return "";
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