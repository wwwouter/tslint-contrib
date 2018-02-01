# @wwwouter/tslint-contrib

Add to tslint.json

    {
        "rulesDirectory": [
            "node_modules/@wwwouter/tslint-contrib",
        ],
        "rules": {
            "no-promise-as-boolean": true,
        }
    }


## Rule(s)

### no-promise-as-boolean

Checks for unresolved Promises in boolean expressions.

For example where this.isTrue() returns a Promise, this violates the rule:

    if(this.isTrue()){

    }

This doesn't:

    if(await this.isTrue()){

    }

## Update version

    npm version major|minor|patch
    npm publish --access=public
    git push


## [License](LICENSE)

Copyright (c) 2018 Wouter Mooij.

Licensed under the [MIT License](LICENSE).