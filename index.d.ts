export function run(): void;
export function readTemplate(templateName: string): string;

export namespace ARGS {
    const file: string;
    const line: string;
    const block: string;
    const templateDir: string;
}
export const USER_TEMPLATE_DIR: "./templates/";
export const DEFAULT_TEMPLATE_DIR: "./node_modules/@makechtec/tezcatl-preset-puzzle/templates/"