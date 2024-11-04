import { TSESTree } from "@typescript-eslint/typescript-estree";
import AbstractMapper from "./abstract";
import { Dafny } from "../types";
import { createLiteralExpression } from "../typeCreate";

class LiteralMapper extends AbstractMapper<TSESTree.Literal,Dafny.RhsValue> {
	map() {
		if (typeof this.node.value !== "string" && typeof this.node.value !== "number" && typeof this.node.value !== "boolean") {
			throw new Error("Literal value must be a string, number, boolean or null");
		}

		let value = this.node.value;

		if (typeof value === "boolean") {
			value = value ? "true" : "false";
		}

		return createLiteralExpression(value);
	}
}

export default LiteralMapper;