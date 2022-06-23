# tezcatl-preset-puzzle #

### Installation ###

    $ npm install @makechtec/tezcatl-preset-puzzle

in your tezcatl.config.json file:

    {
        "preset": "puzzle",
    }

### Usage ###

    $ tezcatl b=templateToChoose l=2 // more args ...

first, you should specify the file to work, one is by the tezcatl.config.json file:

    {
        "preset": "puzzle",
        "file": "test/example.js"
    }

the second method is by the command line using the f parameter:

    $ tezcatl f=test/example.js b=templateToChoose l=2 // more args ...

the b parameter is the template to choose, and the l parameter is the line of the file where the processed template content will be inserted.

### case of use ###

we are the following templates:

    template1:

    let ${varname} = ${varvalue};

also the work file is:

    test/example.js:

    34 export class Component {
    35     render() {
    36         return <div>
    37             <h1>Hello</h1>
    38             <p>World</p>
    39         </div>
    40     }
    41 }

whe need to add the template content inside the work file, and the line is: 35. Also the template content is in tezcatl template language, then we can pass the __varname__ and __varvalue__ to the template by command line.

    $ tezcatl b=template1 l=35 varname=foo varvalue=true f=test/example.js

the result is:

    test/example.js:

    34 export class Component {
    35   let foo = true;
    36     render() {
    37         return <div>
    38             <h1>Hello</h1>
    39             <p>World</p>
    40         </div>
    41     }
    42 }

if the work file is specified in the tezcatl.config.json then the command is:

    $ tezcatl b=template1 l=35 varname=foo varvalue=true

ommit the f parameter.