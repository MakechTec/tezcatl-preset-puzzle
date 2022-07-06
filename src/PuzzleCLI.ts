import {TEMPLATE_EXTENSION} from "@makechtec/tezcatl-constants";
import {Reader, Writter, CLI} from "@makechtec/tezcatl-cli";
import {Pipe} from "@makechtec/pipe";
import {ConditionalProcessor} from "@makechtec/tezcatl-conditional-processor";
import {IterativeProcessor} from "@makechtec/tezcatl-iterative-processor";
import {Settings} from "@makechtec/tezcatl-settings";
import { PlaceholderProcessor } from "@makechtec/tezcatl-placeholder-processor";

export const run = () => {

    const conditionalProcessor = new ConditionalProcessor();
    const iterativeProcessor = new IterativeProcessor();
    const placeholderProcessor = new PlaceholderProcessor();
    
    let line = CLI.getArgumentValue(ARGS.line).value;
    let block = CLI.getArgumentValue(ARGS.block).value;
    let fileName = CLI.getArgumentValue(ARGS.file).value;

    const config = Settings.get();


    if(fileName === ""){
        fileName = config.file;
    }
    
    let content = readTemplate(block);
    
    
    let finalContent = (new Pipe(content))
    .addAction( (newContent: string) => {
        return conditionalProcessor.parse(newContent);
    } )
    .addAction( (newContent: string) => {
        return iterativeProcessor.parse(newContent);
    })
    .addAction( (newContent: string) => {
        return placeholderProcessor.parse(newContent);
    })
    .execActions();

    Writter.insertInLine(fileName, line, finalContent);

};

export const readTemplate = (templateName : string): string => {

    let templateDir = CLI.getArgumentValue(ARGS.templateDir);
    let content = "";

    if(templateDir.value === ""){
        templateDir = Settings.get().templateDir;
        content = Reader.read(templateDir + "/" + templateName +TEMPLATE_EXTENSION);
    }

    if(content === ""){
        content = Reader.read(USER_TEMPLATE_DIR + templateName + TEMPLATE_EXTENSION);
    }

    if(content === ""){
        content = Reader.read(DEFAULT_TEMPLATE_DIR + templateName + TEMPLATE_EXTENSION);
    }

    return content;

}

export const ARGS = {
    file: "f",
    line: "l",
    block: "b",
    templateDir: "templateDir"
};

export const USER_TEMPLATE_DIR = "./templates/";
export const DEFAULT_TEMPLATE_DIR = "./node_modules/@makechtec/tezcatl-preset-puzzle/templates/";