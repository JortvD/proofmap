import Builder from "./src/builder";
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
	defaultOutputName: 'pm_output'
}, fileName);

const data = mapper.map();

writeFileSync(`${folder}/${fileName}.map.json`, JSON.stringify(data, null, "\t"));

const builder = new Builder({
	indentation: "  "
});
const output = builder.buildDafny(data);

writeFileSync(`${folder}/${fileName}.dfy`, output);