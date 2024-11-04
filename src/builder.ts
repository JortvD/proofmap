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
		} else if(value.type === "ClassMemberDecl") {
			return this.buildClassMemberDecl(value);
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

	buildMethodDecl({keyword, name, value, signature, specification}: Dafny.MethodDecl): string {
		const body = this.buildBlockStmt(value);
		const spec = this.buildMethodSpec(specification);

		return `${this.buildMethodKeyword(keyword)} ${name}${this.buildMethodSignature_(signature)} ${spec}{\n${this.indent(body)}\n}`;
	}

	buildMethodSignature_({parameters, returns}: Dafny.MethodSignature_): string {
		const returnsText = returns.value.length > 0 ? ` returns ${this.buildFormals(returns)}` : "";

		return `${this.buildFormals(parameters)}${returnsText}`;
	}

	buildMethodSpec({value}: Dafny.MethodSpec): string {
		return `\n${this.indent(value.map(methodSpecValue => this.buildMethodSpecValue(methodSpecValue)).join("\n"))}\n`;
	}

	buildMethodSpecValue({type, value}: Dafny.MethodSpecValue): string {
		if(type === "RequiresClause") {
			return this.buildRequiresClause({type, value});
		} else if(type === "EnsuresClause") {
			return this.buildEnsuresClause({type, value});
		}

		return "";
	}

	buildRequiresClause({value}: Dafny.RequiresClause): string {
		return `requires ${this.buildExpression(value)}`;
	}

	buildEnsuresClause({value}: Dafny.EnsuresClause): string {
		return `ensures ${this.buildExpression(value)}`;
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
		} else if (value.type === "IntType_") {
			return this.buildIntType_(value);
		} else if (value.type === "StringType_") {
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
		} else if(value.type === "UpdateStmt") {
			return this.buildUpdateStmt(value);
		} else if(value.type === "ReturnStmt") {
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
		if(value.type === "Expression") {
			return this.buildExpression(value);
		}

		return "";
	}

	buildExpression({value}: Dafny.Expression): string {
		return this.buildEquivExpression(value);
	}

	buildEquivExpression({value}: Dafny.EquivExpression): string {
		return value.map(impliesExpliesExpression => this.buildImpliesExpliesExpression(impliesExpliesExpression)).join(" <==> ");
	}

	buildImpliesExpliesExpression({value, rightDir, leftDir}: Dafny.ImpliesExpliesExpression): string {
		let text = this.buildLogicalExpression(value);

		if(rightDir) {
			text += ` ==> ${this.buildImpliesExpression(rightDir)}`;
		} else if(leftDir) {
			text += ` <== ${leftDir.map(logicalExpression => this.buildLogicalExpression(logicalExpression)).join(" <== ")}`;
		}

		return text;
	}

	buildImpliesExpression({left, right}: Dafny.ImpliesExpression): string {
		return `${this.buildLogicalExpression(left)} ==> ${this.buildImpliesExpression(right)}`;
	}

	buildLogicalExpression({value, operations}: Dafny.LogicalExpression): string {
		let text = this.buildRelationalExpression(value[0]);

		for (let i = 1; i < value.length; i++) {
			text += ` ${operations[i - 1].value} ${this.buildRelationalExpression(value[i])}`;
		}

		return text;
	}

	buildRelationalExpression({value, operations}: Dafny.RelationalExpression): string {
		let text = this.buildShiftTerm(value[0]);

		for (let i = 1; i < value.length; i++) {
			text += ` ${operations[i-1].value} ${this.buildShiftTerm(value[i])}`;
		}

		return text;
	}

	buildShiftTerm({value, operations}: Dafny.ShiftTerm): string {
		let text = this.buildTerm(value[0]);

		for (let i = 1; i < value.length; i++) {
			text += ` ${operations[i-1].value} ${this.buildTerm(value[i])}`;
		}

		return text;
	}

	buildTerm({value, operations}: Dafny.Term): string {
		let text = this.buildFactor(value[0]);

		for (let i = 1; i < value.length; i++) {
			text += ` ${operations[i-1].value} ${this.buildFactor(value[i])}`;
		}

		return text;
	}

	buildFactor({value, operations}: Dafny.Factor): string {
		let text = this.buildBitvectorFactor(value[0]);

		for (let i = 1; i < value.length; i++) {
			text += ` ${operations[i-1].value} ${this.buildBitvectorFactor(value[i])}`;
		}

		return text;
	}

	buildBitvectorFactor({value, operations}: Dafny.BitvectorFactor): string {
		let text = this.buildAsExpression(value[0]);

		for (let i = 1; i < value.length; i++) {
			text += ` ${operations[i-1].value} ${this.buildAsExpression(value[i])}`;
		}

		return text;
	}

	buildAsExpression({value, type_}: Dafny.AsExpression): string {
		let text = this.buildUnaryExpression(value);

		if(type_) {
			text += ` as ${this.buildType(type_)}`;
		}

		return text;
	}

	buildUnaryExpression({value}: Dafny.UnaryExpression): string {
		return this.buildPrimaryExpression(value);
	}

	buildPrimaryExpression({value}: Dafny.PrimaryExpression): string {
		if(value.type === "ConstAtomExpression") {
			return this.buildConstAtomExpression(value);
		} else if(value.type === "NameSegment") {
			return this.buildNameSegment(value);
		}

		return "";
	}

	buildLhs({value}: Dafny.Lhs): string {
		if(value.type === "NameSegment") {
			return this.buildNameSegment(value);
		}

		return "";
	}

	buildNameSegment({value, suffixes}: Dafny.NameSegment): string {
		return `${value}${suffixes.map(suffix => this.buildSuffix(suffix)).join("")}`;
	}

	buildSuffix({value}: Dafny.Suffix): string {
		if(value.type === "AugmentedDotSuffix_") {
			return this.buildAugmentedDotSuffix_(value);
		}

		return "";
	}

	buildAugmentedDotSuffix_({value}: Dafny.AugmentedDotSuffix_): string {
		return `.${this.buildDotSuffix(value)}`;
	}

	buildDotSuffix({value}: Dafny.DotSuffix): string {
		return value;
	}

	buildConstAtomExpression({value}: Dafny.ConstAtomExpression): string {
		if(value.type === "LiteralExpression") {
			return this.buildLiteralExpression(value);
		} else if(value.type === "CardinalityExpression_") {
			return this.buildCardinalityExpression_(value);
		}

		return "";
	}

	buildCardinalityExpression_({value}: Dafny.CardinalityExpression_): string {
		return `|${this.buildExpression(value)}|`;
	}

	buildLiteralExpression({value}: Dafny.LiteralExpression): string {
		if (value === "true" || value === "false") {
			return value;
		} else if (value === "null") {
			return "null";
		} else if (typeof value === "string") {
			return `"${value}"`;
		} else {
			return value.toString();
		}
	}
}

export default Builder;