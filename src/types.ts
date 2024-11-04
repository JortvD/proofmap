export namespace Dafny {
	export interface Grammar {
		type: string;
	}

	// 17.2.1. Programs
	export interface Dafny extends Grammar {
		type: "Dafny";
		value: TopDecl[];
	}

	// 17.2.1.2. Top-level declarations
	export interface TopDecl extends Grammar {
		type: "TopDecl";
		value: SubModuleDecl|ClassDecl;
	}

	// 17.2.2. Modules
	export interface SubModuleDecl extends Grammar {
		type: "SubModuleDecl";
		value: ModuleDefinition;
	}

	// 17.2.2.1. Module Definitions
	export interface ModuleDefinition extends Grammar {
		type: "ModuleDefinition";
		name: string;
		value: TopDecl[];
	}

	// 17.2.3. Types
	export interface Type extends Grammar {
		type: "Type";
		value: TypeValue;
	}
	export type TypeValue = DomainType_;

	export interface DomainType_ extends Grammar {
		type: "DomainType_";
		value: DomainType_Value;
	}
	export type DomainType_Value = BoolType_|IntType_ | StringType_;

	// 17.2.3.1. Basic types
	export interface BoolType_ extends Grammar {
		type: "BoolType_";
		value: "bool";
	}

	export interface IntType_ extends Grammar {
		type: "IntType_";
		value: "int";
	}

	// 17.2.3.4. Collection types
	export interface StringType_ extends Grammar {
		type: "StringType_";
		value: "string";
	}

	// 17.2.3.6. Class types
	export interface ClassDecl extends Grammar {
		type: "ClassDecl";
		name: string;
		value: ClassMemberDecl[];
	}

	export interface ClassMemberDecl extends Grammar {
		type: "ClassMemberDecl";
		value: MethodDecl;
	}

	// 17.2.4.3. Method declarations
	export interface MethodDecl extends Grammar {
		type: "MethodDecl";
		keyword: MethodKeyword;
		name: string;
		specification?: MethodSpec;
		signature: MethodSignature_;
		value: BlockStmt;
	}

	export interface MethodKeyword extends Grammar {
		type: "MethodKeyword";
		value: MethodKeywordValue;
	}

	export type MethodKeywordValue = "method"|"constructor"|"lemma"|"twostate lemma"|"least lemma"|"greatest lemma";

	export interface MethodSignature_ extends Grammar {
		type: "MethodSignature_";
		parameters: Formals;
		returns: Formals;
	}

	export interface Formals extends Grammar {
		type: "Formals";
		value: GIdentType[];
	}

	// 17.2.5.1. Method specifications
	export interface MethodSpec extends Grammar {
		type: "MethodSpec";
		value: (RequiresClause|EnsuresClause)[];
	}

	// 17.2.5.6. Requires clauses
	export interface RequiresClause extends Grammar {
		type: "RequiresClause";
		value: Expression;
	}

	// 17.2.5.7. Ensures clauses
	export interface EnsuresClause extends Grammar {
		type: "EnsuresClause";
		value: Expression;
	}

	// 17.2.6.1. Labeled statement
	export interface Stmt extends Grammar {
		type: "Stmt";
		//label: string;
		value: StmtValue; // TODO: change to NonLabeledStmt
	}
	export type StmtValue = VarDeclStatement|UpdateStmt|ReturnStmt;

	// 17.2.6.2. Non-Labeled statement
	/*export interface NonLabeledStmt extends Grammar {
		type: "NoneLabeledStmt";
		value: VarDeclStatement|UpdateStmt;
	}*/

	// 17.2.6.4. Block statement
	export interface BlockStmt extends Grammar {
		type: "BlockStmt";
		value: Stmt[];
	}

	// 17.2.6.5. Return statement
	export interface ReturnStmt extends Grammar {
		type: "ReturnStmt";
		value: Rhs[];
	}

	// 17.2.6.7. Update and call statement
	export interface UpdateStmt extends Grammar {
		type: "UpdateStmt";
		key: Lhs[];
		value: Rhs[];
	}

	// 17.2.6.9. Variable declaration statement
	export interface VarDeclStatement extends Grammar {
		type: "VarDeclStatement";
		key: string[];
		init: Rhs[];
	}

	// 17.2.7.1. Top-level expression
	export interface Expression extends Grammar {
		type: "Expression";
		value: EquivExpression;
	}

	// 17.2.7.2. Equivalence expression
	export interface EquivExpression extends Grammar {
		type: "EquivExpression";
		value: ImpliesExpliesExpression[];
	}

	// 17.2.7.3. Implies expression
	export interface ImpliesExpliesExpression extends Grammar {
		type: "ImpliesExpliesExpression";
		value: LogicalExpression;
		rightDir?: ImpliesExpression;
		leftDir?: LogicalExpression[];
	}

	export interface ImpliesExpression extends Grammar {
		type: "ImpliesExpression";
		left: LogicalExpression;
		right?: LogicalExpression;
	}

	export interface LogicalExpression extends Grammar {
		type: "LogicalExpression";
		value: LogicalExpressionValue[];
		operations: ("&&"|"||")[];
	}
	export type LogicalExpressionValue = RelationalExpression | RelationalExpressionValue;

	// 17.2.7.5. Relational expression
	export interface RelationalExpression extends Grammar {
		type: "RelationalExpression";
		value: RelationalExpressionValue[];
		operations: RelOp[];
	}
	export type RelationalExpressionValue = ShiftTerm | ShiftTermValue;

	export interface RelOp extends Grammar {
		type: "RelOp";
		value: ("=="|"!="|"<="|"<"|">="|">"|"in"|"!in"|"!!");
	}

	// 17.2.7.6. Bit-shift expression
	export interface ShiftTerm extends Grammar {
		type: "ShiftTerm";
		value: ShiftTermValue[];
		operations: ShiftOp[];
	}
	export type ShiftTermValue = Term | TermValue;

	export interface ShiftOp extends Grammar {
		type: "ShiftOp";
		value: ("<<"|">>");
	}

	// 17.2.7.7. Term (addition operations)
	export interface Term extends Grammar {
		type: "Term";
		value: TermValue[];
		operations: AddOp[];
	}
	export type TermValue = Factor | FactorValue;

	export interface AddOp extends Grammar {
		type: "AddOp";
		value: ("+"|"-");
	}

	// 17.2.7.8. Factor (multiplication operations)
	export interface Factor extends Grammar {
		type: "Factor";
		value: FactorValue;
		operations: MulOp[];
	}
	export type FactorValue = BitvectorFactor | BitvectorFactorValue;

	export interface MulOp extends Grammar {
		type: "MulOp";
		value: ("*"|"/"|"%");
	}

	// 17.2.7.9. Bit-vector expression
	export interface BitvectorFactor extends Grammar {
		type: "BitvectorFactor";
		value: BitvectorFactorValue;
		operations: BVOp[];
	}
	export type BitvectorFactorValue = AsExpression | AsExpressionValue;

	export interface BVOp extends Grammar {
		type: "BVOp";
		value: ("&"|"|"|"^");
	}

	// 17.2.7.10. As/Is expression
	export interface AsExpression extends Grammar {
		type: "AsExpression";
		value: AsExpressionValue;
		type_: Type;
	}
	export type AsExpressionValue = UnaryExpression | UnaryExpressionValue;

	// 17.2.7.11. Unary expression
	export interface UnaryExpression extends Grammar {
		type: "UnaryExpression";
		value: UnaryExpressionValue;
	}
	export type UnaryExpressionValue = PrimaryExpression | PrimaryExpressionValue;

	// 17.2.7.12. Primary expression
	export interface PrimaryExpression extends Grammar {
		type: "PrimaryExpression";
		value: PrimaryExpressionValue;
	}
	export type PrimaryExpressionValue = NameSegment|ConstAtomExpression;

	// 17.2.7.14. Left-hand-side expression
	export interface Lhs extends Grammar {
		type: "Lhs";
		value: NameSegment;
	}

	// 17.2.7.15. Right-hand-side expression
	export interface Rhs extends Grammar {
		type: "Rhs";
		value: RhsValue; // Change from Expression
	}

	export type RhsValue = EquivExpression|ImpliesExpliesExpression|LogicalExpression|RelationalExpression|ShiftTerm|Term|Factor|BitvectorFactor|AsExpression|UnaryExpression|PrimaryExpression|ConstAtomExpression|NameSegment;

	export interface ConstAtomExpression extends Grammar {
		type: "ConstAtomExpression";
		value: LiteralExpression;
	}

	export interface LiteralExpression extends Grammar {
		type: "LiteralExpression";
		value: LiteralExpressionValue;
	}
	export type LiteralExpressionValue = "false"|"true"|"null"|number|bigint|string;

	// 17.2.7.40. Name Segment
	export interface NameSegment extends Grammar {
		type: "NameSegment";
		value: string;
	}

	// 17.2.7.53. Basic name and type combinations
	export interface IdentType extends Grammar {
		type: "IdentType";
		name: string;
		type_: Type;
	}

	export interface GIdentType extends Grammar {
		type: "GIdentType";
		value: IdentType;
	}
}