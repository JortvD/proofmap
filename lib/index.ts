export class ProofMap<T extends (...args: any) => any> {
	requires(value: (output: ReturnType<T>) => any) {
		return value;
	}
}