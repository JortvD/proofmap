export class ProofMap<T extends (...args: any) => any> {
	requires(value: () => any) {
		return value;
	}
	ensures(value: (output: ReturnType<T>) => any) {
		return value;
	}
}