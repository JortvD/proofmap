import { TSESTree } from "@typescript-eslint/typescript-estree";
import ExpressionMapper from "./expression";
import AbstractMapper from "./abstract";
import { Dafny } from "../types";

class VariableDeclarationMapper extends AbstractMapper<TSESTree.VariableDeclaration,Dafny.VarDeclStatement> {
	map() {
		const key: string[] = [];
		const init: Dafny.Rhs[] = [];

		for (const declerator of this.node.declarations) {
			const id = declerator.id as TSESTree.Identifier;

			if(declerator.init) {
				const mapper = new ExpressionMapper(declerator.init, this.options, this.context);

				const type = mapper.getType();

				this.context.variables.set(id.name, mapper.getType());

				if (this.shouldSkipDeclarator(type)) continue;

				init.push(this.createRhs(mapper.map()));
			}
			key.push(id.name);
		}

		if (key.length > 1 && key.length !== init.length) {
			throw new Error(`Variable declaration key (${key.length}) and init (${init.length}) length mismatch`);
		}

		if (key.length === 0) {
			return;
		}

		return this.createVarDeclStatement(key, init);
	}

	createVarDeclStatement(key: string[], init: Dafny.Rhs[]) {
		const type: Dafny.VarDeclStatement = {
			type: "VarDeclStatement",
			key,
			init
		}

		return type;
	}

	createRhs(value: Dafny.RhsValue) {
		const type: Dafny.Rhs = {
			type: "Rhs",
			value
		}

		return type;
	}

	shouldSkipDeclarator(type: string) {
		return type === 'ProofMap';
	}
}

export default VariableDeclarationMapper;