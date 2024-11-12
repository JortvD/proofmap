import { Dafny } from "../types";
import AbstractBuilder from "./abstract";
import { TopDeclBuilder } from "./programs";

export class SubModuleDeclBuilder extends AbstractBuilder<Dafny.SubModuleDecl> {
	builder() {
		return [new ModuleDefinitionBuilder(this.data.value, this.options)];
	}
}

export class ModuleDefinitionBuilder extends AbstractBuilder<Dafny.ModuleDefinition> {
	builder() {
		return [
			`module ${this.data.name} {\n`,
			...this.join(this.data.value.map(topDecl => new TopDeclBuilder(topDecl, this.options, true)), "\n"),
			"\n}"
		];
	}
}