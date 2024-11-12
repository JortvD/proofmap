import { DafnyBuilder } from "./src/builder/programs";
import ProgramMapper from "./src/mappers/program";
import Parser from "./src/parser";
import { writeFileSync } from "fs";

const fileName = "test";
const folder = "testing/test";

const parser = new Parser();
const contents = parser.loadFile(`${folder}/${fileName}.ts`);
const ast = parser.parse(contents);

if (ast.type !== "Program") {
	throw new Error("Expected a Program AST");
}

writeFileSync(`${folder}/${fileName}.json`, JSON.stringify(ast, null, "\t"));

const mapper = new ProgramMapper(ast, {
	defaultReturnsName: 'pm_output'
}, fileName);

const data = mapper.map();

const builder = new DafnyBuilder(data, {
	indentation: "  "
})
const output = builder.build({ line: 0, column: 0 });

writeFileSync(`${folder}/${fileName}.map.json`, JSON.stringify(data, null, "\t"));
writeFileSync(`${folder}/${fileName}.dfy`, output);