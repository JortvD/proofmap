import { TSESTree } from "@typescript-eslint/typescript-estree";
import AbstractMapper, { MapOptions } from "./abstract";
import ClassDeclarationMapper from "./classDeclaration";
import { Dafny } from "../types";

class ProgramMapper extends AbstractMapper<TSESTree.Program,Dafny.Dafny> {
	fileName: string;

	constructor(node: TSESTree.Program, options: MapOptions, fileName: string) {
		super(node, options, {
			variables: new Map(),
			moduleName: "",
			requires: [],
			ensures: []
		});
		this.fileName = fileName;
	}

	map() {
		this.context.moduleName = this.fileName;

		const value: Dafny.TopDecl[] = [];

		for (const statement of this.node.body) {
			if (statement.type === "ClassDeclaration") {
				const mapper = new ClassDeclarationMapper(statement, this.options, this.context);
				value.push(this.createTopDecl(mapper.map()));
			}
		}

		const wrapperModule = this.createSubModuleDecl(this.createModuleDefinition(this.fileName, value));
		return this.createType([this.createTopDecl(wrapperModule)]);
	}

	createType(value: Dafny.TopDecl[]) {
		const type: Dafny.Dafny = {
			type: "Dafny",
			value
		}

		return type;
	}

	createTopDecl(value: Dafny.ClassDecl|Dafny.SubModuleDecl) {
		const type: Dafny.TopDecl = {
			type: "TopDecl",
			value
		}

		return type;
	}

	createSubModuleDecl(value: Dafny.ModuleDefinition) {
		const type: Dafny.SubModuleDecl = {
			type: "SubModuleDecl",
			value
		}

		return type;
	}

	createModuleDefinition(name: string, value: Dafny.TopDecl[]) {
		const type: Dafny.ModuleDefinition = {
			type: "ModuleDefinition",
			name,
			value
		}

		return type;
	}
}

export default ProgramMapper;