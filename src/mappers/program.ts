import { TSESTree } from "@typescript-eslint/typescript-estree";
import AbstractMapper, { MapOptions } from "./abstract";
import ClassDeclarationMapper from "./classDeclaration";
import { Dafny } from "../types";
import { createDafny, createModuleDefinition, createSubModuleDecl, createTopDecl } from "../typeCreate";
import VariableStore from "../store/variable";
import TypeStore from "../store/type";
import FunctionDeclarationMapper from "./functionDeclaration";

class ProgramMapper extends AbstractMapper<TSESTree.Program,Dafny.Dafny> {
	fileName: string;

	constructor(node: TSESTree.Program, options: MapOptions, fileName: string) {
		super(node, options, {
			variables: new VariableStore(),
			types: new TypeStore(),
			moduleName: "",
			spec: []
		});
		this.fileName = fileName;
	}

	map() {
		this.context.moduleName = this.fileName;

		const value: Dafny.TopDecl[] = [];

		for (const statement of this.node.body) {
			if (statement.type === "ClassDeclaration") {
				const mapper = new ClassDeclarationMapper(statement, this.options, this.context);
				value.push(createTopDecl(mapper.map()));
			}
			else if (statement.type === "FunctionDeclaration") {
				const mapper = new FunctionDeclarationMapper(statement, this.options, this.context);
				value.push(createTopDecl(mapper.map()));
			}
		}

		const wrapperModule = createSubModuleDecl(createModuleDefinition(this.fileName, value));
		return createDafny([createTopDecl(wrapperModule)]);
	}

	
}

export default ProgramMapper;