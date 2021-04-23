module.exports = {
    "root":true,
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential",
        "plugin:@typescript-eslint/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 2020,
        "parser": "@typescript-eslint/parser",
        "sourceType": "module"
    },
    "plugins": [
        "vue",
        "@typescript-eslint"
    ],
    "rules": {
        // '@typescript-eslint/ban-ts-ignore': 'off',
        // '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        // '@typescript-eslint/no-var-requires': 'off',
        // '@typescript-eslint/no-empty-function': 'off',
        // 'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        // '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
