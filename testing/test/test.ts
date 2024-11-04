import { ProofMap } from "../../lib";

class Test {
	test(): string {
		const pm = new ProofMap<typeof this.test>();
		pm.requires(out => out.length > 0);

		let test = "test", test2 = "test2";

		test = "abc";
		test2 = "def";

		return test;
	}
}