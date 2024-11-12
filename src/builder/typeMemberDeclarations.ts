import { Dafny } from "../types";
import AbstractBuilder from "./abstract";
import { FunctionBodyBuilder, FunctionSignature_Builder, FunctionSpecBuilder, MethodSignature_Builder, MethodSpecBuilder, PredicateSignature_Builder } from "./specifications";
import { BlockStmtBuilder } from "./statements";

export class MethodDeclBuilder extends AbstractBuilder<Dafny.MethodDecl> {
	builder() {
		const body = new BlockStmtBuilder(this.data.value, this.options, true);
		const spec = new MethodSpecBuilder(this.data.specification, this.options);

		return [
			new MethodKeyword_Builder(this.data.keyword, this.options),
			" ",
			this.data.name,
			new MethodSignature_Builder(this.data.signature, this.options),
			" ",
			spec,
			"{\n",
			body,
			"\n}"
		];
	}
}

export class MethodKeyword_Builder extends AbstractBuilder<Dafny.MethodKeyword_> {
	builder() {
		return [this.data.value];
	}
}

export class FunctionDeclBuilder extends AbstractBuilder<Dafny.FunctionDecl> {
	builder() {
		const body = new FunctionBodyBuilder(this.data.value, this.options, true);
		const spec = new FunctionSpecBuilder(this.data.specification, this.options);

		if(this.data.signature.type === "PredicateSignature_") {
			return [
				"predicate ",
				this.data.name,
				new PredicateSignature_Builder(this.data.signature, this.options),
				" ",
				spec,
				"{\n",
				body,
				"\n}"
			];
		} else if (this.data.signature.type === "FunctionSignature_") {
			return [
				"function ",
				this.data.name,
				new FunctionSignature_Builder(this.data.signature, this.options),
				" ",
				spec,
				"{\n",
				body,
				"\n}"
			];
		}

		return [];
	}
}