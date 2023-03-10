import { languages, Range } from 'monaco-editor';
import {
    fieldCompletionsCreator,
    expressionCompletionsCreator,
} from './languages';

languages.json.jsonDefaults.setDiagnosticsOptions;

console.log('register ++++');
languages.registerCompletionItemProvider('json', {
    triggerCharacters: ['.', ' ', '*'],
    provideCompletionItems: function (model, position, context, token) {
        const wordInfo = model.getWordUntilPosition(position);
        const wordRange = new Range(
            position.lineNumber,
            wordInfo.startColumn,
            position.lineNumber,
            wordInfo.endColumn,
        );

        let suggestions: languages.CompletionItem[] = [];
        suggestions = suggestions.concat(fieldCompletionsCreator(wordRange));
        suggestions = suggestions.concat(
            expressionCompletionsCreator(wordRange),
        );

        return new Promise((resolve) => {
            resolve({
                suggestions: suggestions,
            });
        });
    },
});
