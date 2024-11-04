import { ProofMap } from "../../lib";

class Test {
	test(): boolean {
		const pm = new ProofMap<typeof this.test>();
		pm.requires(out => out);

		let test = "test";

		return true && true && true;
	}
}