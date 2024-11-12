import { Dafny } from "../types";
import AbstractBuilder from "./abstract";
import { SubModuleDeclBuilder } from "./modules";
import { ClassDeclBuilder, ClassMemberDeclBuilder } from "./types";

export class DafnyBuilder extends AbstractBuilder<Dafny.Dafny> {
	builder() {
		return this.join(this.data.value.map(topDecl => new TopDeclBuilder(topDecl, this.options)), '\n');
	}
}

export class TopDeclBuilder extends AbstractBuilder<Dafny.TopDecl> {
	builder() {
		if(this.data.value.type === "SubModuleDecl") {
			return [new SubModuleDeclBuilder(this.data.value, this.options)];
		} else if(this.data.value.type === "ClassDecl") {
			return [new ClassDeclBuilder(this.data.value, this.options)];
		} else if(this.data.value.type === "ClassMemberDecl") {
			return [new ClassMemberDeclBuilder(this.data.value, this.options)];
		}

		return [];
	}
}