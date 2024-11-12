import { Dafny } from "../types";
import AbstractBuilder from "./abstract";
import { TypeBuilder } from "./types";

export class RhsBuilder extends AbstractBuilder<Dafny.Rhs> {
	builder() {
		if (this.data.value.type === "Expression") {
			return [new ExpressionBuilder(this.data.value, this.options)];
		}

		return [];
	}
}

export class ExpressionBuilder extends AbstractBuilder<Dafny.Expression> {
	builder() {
		return [new EquivExpressionBuilder(this.data.value, this.options)];
	}
}

export class EquivExpressionBuilder extends AbstractBuilder<Dafny.EquivExpression> {
	builder() {
		return [
			...this.join(this.data.value.map(impliesExpliesExpression => new ImpliesExpliesExpressionBuilder(impliesExpliesExpression, this.options)), " <==> ")
		];
	}
}

export class ImpliesExpliesExpressionBuilder extends AbstractBuilder<Dafny.ImpliesExpliesExpression> {
	builder() {
		const left = new LogicalExpressionBuilder(this.data.value, this.options);

		if(this.data.rightDir) {
			return [
				left, 
				" ==> ", 
				new ImpliesExpressionBuilder(this.data.rightDir, this.options)
			];
		} else if(this.data.leftDir) {
			return [
				left, 
				" <== ", 
				...this.join(this.data.leftDir.map(logicalExpression => new LogicalExpressionBuilder(logicalExpression, this.options)), " <== ")
			];
		}

		return [left];
	}
}

export class ImpliesExpressionBuilder extends AbstractBuilder<Dafny.ImpliesExpression> {
	builder(): (AbstractBuilder<any>|string)[] {
		return [new LogicalExpressionBuilder(this.data.left, this.options), " ==> ", new ImpliesExpressionBuilder(this.data.right, this.options)];
	}
}

export class LogicalExpressionBuilder extends AbstractBuilder<Dafny.LogicalExpression> {
	builder() {
		return [
			...this.joinOperations(this.data.value.map(operator => new RelationalExpressionBuilder(operator, this.options)), this.data.operations.map(op => op.value))
		];
	}
}

export class RelationalExpressionBuilder extends AbstractBuilder<Dafny.RelationalExpression> {
	builder() {
		return [
			...this.joinOperations(this.data.value.map(operator => new ShiftTermBuilder(operator, this.options)), this.data.operations.map(op => op.value))
		];
	}
}

export class ShiftTermBuilder extends AbstractBuilder<Dafny.ShiftTerm> {
	builder() {
		return [
			...this.joinOperations(this.data.value.map(operator => new TermBuilder(operator, this.options)), this.data.operations.map(op => op.value))
		];
	}
}

export class TermBuilder extends AbstractBuilder<Dafny.Term> {
	builder() {
		return [
			...this.joinOperations(this.data.value.map(operator => new FactorBuilder(operator, this.options)), this.data.operations.map(op => op.value))
		];
	}
}

export class FactorBuilder extends AbstractBuilder<Dafny.Factor> {
	builder() {
		return [
			...this.joinOperations(this.data.value.map(operator => new BitvectorFactorBuilder(operator, this.options)), this.data.operations.map(op => op.value))
		];
	}
}

export class BitvectorFactorBuilder extends AbstractBuilder<Dafny.BitvectorFactor> {
	builder() {
		return [
			...this.joinOperations(this.data.value.map(operator => new AsExpressionBuilder(operator, this.options)), this.data.operations.map(op => op.value))
		];
	}
}

export class AsExpressionBuilder extends AbstractBuilder<Dafny.AsExpression> {
	builder() {
		const value = [new UnaryExpressionBuilder(this.data.value, this.options)];

		if (this.data.type_) {
			return [
				...value, 
				" as ", 
				new TypeBuilder(this.data.type_, this.options)
			];
		} else {
			return value;
		}
	}
}

export class UnaryExpressionBuilder extends AbstractBuilder<Dafny.UnaryExpression> {
	builder() {
		return [new PrimaryExpressionBuilder(this.data.value, this.options)];
	}
}

export class PrimaryExpressionBuilder extends AbstractBuilder<Dafny.PrimaryExpression> {
	builder() {
		if (this.data.value.type === "ConstAtomExpression") {
			return [new ConstAtomExpressionBuilder(this.data.value, this.options)];
		} else if (this.data.value.type === "NameSegment") {
			return [new NameSegmentBuilder(this.data.value, this.options)];
		}

		return [];
	}
}

export class ConstAtomExpressionBuilder extends AbstractBuilder<Dafny.ConstAtomExpression> {
	builder() {
		if (this.data.value.type === "LiteralExpression") {
			return [new LiteralExpressionBuilder(this.data.value, this.options)];
		} else if (this.data.value.type === "CardinalityExpression_") {
			return [new CardinalityExpression_Builder(this.data.value, this.options)];
		}

		return [];
	}
}

export class CardinalityExpression_Builder extends AbstractBuilder<Dafny.CardinalityExpression_> {
	builder() {
		return [new ExpressionBuilder(this.data.value, this.options)];
	}
}

export class LiteralExpressionBuilder extends AbstractBuilder<Dafny.LiteralExpression> {
	builder() {
		if (this.data.value === "true" || this.data.value === "false" || this.data.value === "null") {
			return [this.data.value];
		} else if (typeof this.data.value === "string") {
			return [`"${this.data.value}"`];
		} else {
			return [this.data.value.toString()];
		}
	}
}

export class LhsBuilder extends AbstractBuilder<Dafny.Lhs> {
	builder() {
		if(this.data.value.type === "NameSegment") {
			return [new NameSegmentBuilder(this.data.value, this.options)];
		}

		return [];
	}
}

export class NameSegmentBuilder extends AbstractBuilder<Dafny.NameSegment> {
	builder() {
		return [
			this.data.value, 
			...this.join(this.data.suffixes.map(suffix => new SuffixBuilder(suffix, this.options)))
		];
	}
}

export class SuffixBuilder extends AbstractBuilder<Dafny.Suffix> {
	builder() {
		if(this.data.value.type === "AugmentedDotSuffix_") {
			return [new AugmentedDotSuffix_Builder(this.data.value, this.options)];
		}

		return [];
	}
}

export class AugmentedDotSuffix_Builder extends AbstractBuilder<Dafny.AugmentedDotSuffix_> {
	builder() {
		return [".", new DotSuffixBuilder(this.data.value, this.options)];
	}
}

export class DotSuffixBuilder extends AbstractBuilder<Dafny.DotSuffix> {
	builder() {
		return [this.data.value];
	}
}