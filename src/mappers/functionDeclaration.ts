import { TSESTree } from "@typescript-eslint/typescript-estree";
import AbstractFunctionMapper from "./abstractFunction";

class FunctionDeclarationMapper extends AbstractFunctionMapper<TSESTree.FunctionDeclaration> {}

export default FunctionDeclarationMapper;