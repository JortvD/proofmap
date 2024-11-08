import { TSESTree } from "@typescript-eslint/typescript-estree";
import ExpressionMapper from "./expression";
import AbstractMapper from "./abstract";
import { Dafny } from "../types";
import { createRhs, createVarDeclStatement } from "../typeCreate";
import { createVariable } from "../store/variable";

class VariableDeclarationMapper extends AbstractMapper<TSESTree.VariableDeclaration,Dafny.VarDeclStatement> {
	map() {
		const key: string[] = [];
		const init: Dafny.Rhs[] = [];

		for (const declerator of this.node.declarations) {
			const id = declerator.id as TSESTree.Identifier;

			if(declerator.init) {
				const mapper = new ExpressionMapper(declerator.init, this.options, this.context);
				const type = mapper.getType();

				this.context.variables.add(createVariable(id.name, type));

				if (this.shouldSkipDeclarator(type)) continue;

				if (!this.context.types.get(type)) {
					throw new Error(`Unknown type ${type}`);
				}

				init.push(createRhs(mapper.map()));
			}
			key.push(id.name);
		}

		if (key.length > 1 && key.length !== init.length) {
			throw new Error(`Variable declaration key (${key.length}) and init (${init.length}) length mismatch`);
		}

		if (key.length === 0) {
			return;
		}

		return createVarDeclStatement(key, init);
	}

	shouldSkipDeclarator(type: string) {
		return type === 'ProofMap';
	}
}

export default VariableDeclarationMapper;