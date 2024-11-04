import { ProofMap } from "../../lib";

class Test {
	test(): boolean {
		const pm = new ProofMap<typeof this.test>();
		pm.ensures(out => true);

		return 0 > 0;
	}
}

function test2(): boolean {
	return 1 > 0;
}