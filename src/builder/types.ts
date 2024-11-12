import { Dafny } from "../types";
import AbstractBuilder from "./abstract";
import { FunctionDeclBuilder, MethodDeclBuilder } from "./typeMemberDeclarations";

export class FormalsBuilder extends AbstractBuilder<Dafny.Formals> {
	builder() {
		return [
			"(",
			...this.join(this.data.value.map(formal => new GIdentTypeBuilder(formal, this.options)), ", "),
			")"
		];
	}
}

export class GIdentTypeBuilder extends AbstractBuilder<Dafny.GIdentType> {
	builder() {
		return [new IdentTypeBuilder(this.data.value, this.options)];
	}
}

export class IdentTypeBuilder extends AbstractBuilder<Dafny.IdentType> {
	builder() {
		return [`${this.data.name}: `, new TypeBuilder(this.data.type_, this.options)];
	}
}

export class TypeBuilder extends AbstractBuilder<Dafny.Type> {
	builder() {
		if (this.data.value.type === "DomainType_") {
			return [new DomainType_Builder(this.data.value, this.options)];
		}

		return [];
	}
}

export class DomainType_Builder extends AbstractBuilder<Dafny.DomainType_> {
	builder() {
		if (this.data.value.type === "BoolType_") {
			return [new BoolType_Builder(this.data.value, this.options)];
		} else if (this.data.value.type === "IntType_") {
			return [new IntType_Builder(this.data.value, this.options)];
		} else if (this.data.value.type === "StringType_") {
			return [new StringType_Builder(this.data.value, this.options)];
		}

		return [];
	}
}

export class BoolType_Builder extends AbstractBuilder<Dafny.BoolType_> {
	builder() {
		return [this.data.value];
	}
}

export class IntType_Builder extends AbstractBuilder<Dafny.IntType_> {
	builder() {
		return [this.data.value];
	}
}

export class StringType_Builder extends AbstractBuilder<Dafny.StringType_> {
	builder() {
		return [this.data.value];
	}
}

export class ClassDeclBuilder extends AbstractBuilder<Dafny.ClassDecl> {
	builder() {
		return [
			`class ${this.data.name} {\n`,
			...this.join(this.data.value.map(topDecl => new ClassMemberDeclBuilder(topDecl, this.options, true)), "\n\n"),
			"\n}"
		];
	}
}

export class ClassMemberDeclBuilder extends AbstractBuilder<Dafny.ClassMemberDecl> {
	builder() {
		if (this.data.value.type === "MethodDecl") {
			return [new MethodDeclBuilder(this.data.value, this.options)];
		}
		else if (this.data.value.type === "FunctionDecl") {
			return [new FunctionDeclBuilder(this.data.value, this.options)];
		}

		return [] as any;
	}
}