import { Dafny } from "../types";
import AbstractBuilder from "./abstract";
import { ExpressionBuilder } from "./expressions";
import { FormalsBuilder, TypeBuilder } from "./types";

export class FunctionBodyBuilder extends AbstractBuilder<Dafny.FunctionBody> {
	builder() {
		return [new ExpressionBuilder(this.data.value, this.options)];
	}
}

export class FunctionSpecBuilder extends AbstractBuilder<Dafny.FunctionSpec> {
	builder() {
		if (this.data.value.length === 0) {
			return [];
		}

		return [
			"\n",
			...this.join(this.data.value.map(spec => new SpecValueBuilder(spec, this.options, true)), "\n"),
			"\n"
		];
	}
}

export class FunctionSignature_Builder extends AbstractBuilder<Dafny.FunctionSignature_> {
	builder() {
		return [
			new FormalsBuilder(this.data.parameters, this.options),
			": ",
			new TypeBuilder(this.data.returns, this.options)
		]
	}
}

export class PredicateSignature_Builder extends AbstractBuilder<Dafny.PredicateSignature_> {
	builder() {
		return [new FormalsBuilder(this.data.parameters, this.options)];
	}
}

export class MethodSignature_Builder extends AbstractBuilder<Dafny.MethodSignature_> {
	builder() {
		const formals = new FormalsBuilder(this.data.parameters, this.options);

		if (this.data.returns.value.length > 0) {
			return [
				formals, 
				" returns ", 
				new FormalsBuilder(this.data.returns, this.options)
			];
		} else {
			return [formals];
		}
	}
}

export class MethodSpecBuilder extends AbstractBuilder<Dafny.MethodSpec> {
	builder() {
		if (this.data.value.length === 0) {
			return [];
		}

		return [
			"\n",
			...this.join(this.data.value.map(spec => new SpecValueBuilder(spec, this.options, true)), "\n"),
			"\n"
		];
	}
}

export class SpecValueBuilder extends AbstractBuilder<Dafny.SpecValue> {
	builder() {
		if (this.data.type === "RequiresClause") {
			return [new RequiresClauseBuilder(this.data, this.options)];
		} else if (this.data.type === "EnsuresClause") {
			return [new EnsuresClauseBuilder(this.data, this.options)];
		}

		return [];
	}
}

export class RequiresClauseBuilder extends AbstractBuilder<Dafny.RequiresClause> {
	builder() {
		return [
			"requires ",
			new ExpressionBuilder(this.data.value, this.options)
		];
	}
}

export class EnsuresClauseBuilder extends AbstractBuilder<Dafny.EnsuresClause> {
	builder() {
		return [
			"ensures ",
			new ExpressionBuilder(this.data.value, this.options)
		];
	}
}