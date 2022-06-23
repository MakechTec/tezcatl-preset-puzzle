import {CONFIG_FILE, TEMPLATE_EXTENSION} from "@makechtec/tezcatl-constants";
import {Reader, Writter, CLI} from "@makechtec/tezcatl-cli";
import {cwd} from "node:process";
import {Pipe} from "@makechtec/pipe";
import {ConditionalProcessor} from "@makechtec/tezcatl-conditional-processor";
import {IterativeProcessor} from "@makechtec/tezcatl-iterative-processor";

export const run = () => {
    
    const line = CLI.getArgumentValue(ARGS.line);
    const block = CLI.getArgumentValue(ARGS.block);
    const moreArgs = CLI.getAllArguments();
    
    const config = readConfig();
    let fileName = CLI.getArgumentValue(ARGS.file).value;

    if(fileName === ""){
        fileName = config.file;
    }

    let content = readTemplate(block.value);

    let pipe = new Pipe(content);

    const conditionalProcessor = new ConditionalProcessor();
    const iterativeProcessor = new IterativeProcessor();
    

    let finalContent = pipe.addAction( (newContent: string) => {
                            return conditionalProcessor.parse(newContent);
                        } )
                        .addAction( (newContent: string) => {
                            return iterativeProcessor.parse(newContent);
                        })
                        .addAction( (newContent: string) => {
                            return Reader.changePlaceholders(newContent, moreArgs);
                        })
                        .execActions();

    console.log(finalContent);
    Writter.insertInLine(fileName, line.value, finalContent);

};

export const readConfig = (): any => {

    try{
        let content = Reader.read( cwd() + "/" + CONFIG_FILE);
        return JSON.parse(content);
    }
    catch(e){
        return {
            file: "",
        };
    }
};

export const readTemplate = (templateName: string): string => {
    let content = Reader.read( USER_TEMPLATE_DIR + templateName + TEMPLATE_EXTENSION);

    if(content === ""){
        content = Reader.read(DEFAULT_TEMPLATE_DIR + templateName + TEMPLATE_EXTENSION);
    }

    return content;
};

const ARGS = {
    file: "f",
    line: "l",
    block: "b",
};

const USER_TEMPLATE_DIR = "./templates/";
const DEFAULT_TEMPLATE_DIR = "./node_modules/@makechtec/tezcatl-preset-puzzle/templates/";