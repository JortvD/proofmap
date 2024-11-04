import { ProofMap } from "../../lib";

class Test {
	test(): boolean {
		const pm = new ProofMap<typeof this.test>();
		pm.ensures(out => true);

		return 0 > 0;
	}
}

function test2(): boolean {
	const pm = new ProofMap<typeof test2>();
	pm.requires(() => true);

	return 1 > 0;
}