import { Dafny } from "../types";
import AbstractBuilder from "./abstract";
import { LhsBuilder, RhsBuilder } from "./expressions";

export class BlockStmtBuilder extends AbstractBuilder<Dafny.BlockStmt> {
	builder() {
		return [
			...this.join(this.data.value.map(stmt => new StmtBuilder(stmt, this.options)), "\n"),
		];
	}
}

export class StmtBuilder extends AbstractBuilder<Dafny.Stmt> {
	builder() {
		if(this.data.value.type === "VarDeclStatement") {
			return [new VarDeclStatementBuilder(this.data.value, this.options)];
		} else if(this.data.value.type === "UpdateStmt") {
			return [new UpdateStmtBuilder(this.data.value, this.options)];
		} else if(this.data.value.type === "ReturnStmt") {
			return [new ReturnStmtBuilder(this.data.value, this.options)];
		}

		return [];
	}
}

export class VarDeclStatementBuilder extends AbstractBuilder<Dafny.VarDeclStatement> {
	builder() {
		return [
			"var ", 
			this.data.key.join(", "),  
			" := ", 
			...this.join(this.data.init.map(rhs => new RhsBuilder(rhs, this.options)), ", "), 
			";"
		];
	}
}

export class UpdateStmtBuilder extends AbstractBuilder<Dafny.UpdateStmt> {
	builder() {
		return [
			...this.join(this.data.key.map(lhs => new LhsBuilder(lhs, this.options)), ", "), 
			" := ", 
			...this.join(this.data.value.map(rhs => new RhsBuilder(rhs, this.options)), ", "), 
			";"
		];
	}
}

export class ReturnStmtBuilder extends AbstractBuilder<Dafny.ReturnStmt> {
	builder() {
		if(this.data.value.length === 0) {
			return ["return;"];
		}

		return ["return ", ...this.join(this.data.value.map(rhs => new RhsBuilder(rhs, this.options)), ", "), ";"];
	}
}