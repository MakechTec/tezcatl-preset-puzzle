import {TEMPLATE_EXTENSION} from "@makechtec/tezcatl-constants";
import {Reader, Writter, CLI} from "@makechtec/tezcatl-cli";
import {Pipe} from "@makechtec/pipe";
import {ConditionalProcessor} from "@makechtec/tezcatl-conditional-processor";
import {IterativeProcessor} from "@makechtec/tezcatl-iterative-processor";
import {Settings} from "@makechtec/tezcatl-settings";

export const run = () => {
    
    const line = CLI.getArgumentValue(ARGS.line);
    const block = CLI.getArgumentValue(ARGS.block);
    const moreArgs = CLI.getAllArguments();
    const config = Settings.get();
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

    Writter.insertInLine(fileName, line.value, finalContent);

};

export const readTemplate = (templateName : string): string => {

    let templateDir = CLI.getArgumentValue(ARGS.templateDir);
    let content = "";

    if(templateDir === ""){
        templateDir = Settings.get().templateDir;
        content = Reader.read(templateDir + templateName + TEMPLATE_EXTENSION);
    }

    if(content === ""){
        content = Reader.read(USER_TEMPLATE_DIR + templateName + TEMPLATE_EXTENSION);
    }

    if(content === ""){
        content = Reader.read(DEFAULT_TEMPLATE_DIR + templateName + TEMPLATE_EXTENSION);
    }

    return content;

}

const ARGS = {
    file: "f",
    line: "l",
    block: "b",
    templateDir: "templateDir"
};

const USER_TEMPLATE_DIR = "./templates/";
const DEFAULT_TEMPLATE_DIR = "./node_modules/@makechtec/tezcatl-preset-puzzle/templates/";