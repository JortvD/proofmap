import { ProofMap } from "../../lib";

class Test {
	test(): string {
		const pm = new ProofMap<typeof this.test>();
		pm.requires(out => out.length > 0);

		let test = "test";

		return test;
	}
}