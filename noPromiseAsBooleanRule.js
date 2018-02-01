"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ts = require("typescript");
var Lint = require("tslint");
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.applyWithProgram = function (sourceFile, program) {
        return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
    };
    Rule.metadata = {
        ruleName: "no-promise-as-boolean",
        description: (_a = ["\n            Restricts using unresolved Promises in boolean expressions. "], Lint.Utils.dedent(_a)),
        optionExamples: [
            true,
        ],
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING = "Promises should be awaited when used in boolean expressions";
    return Rule;
}(Lint.Rules.TypedRule));
exports.Rule = Rule;
function walk(ctx, checker) {
    var sourceFile = ctx.sourceFile, options = ctx.options;
    ts.forEachChild(sourceFile, function cb(node) {
        switch (node.kind) {
            case ts.SyntaxKind.BinaryExpression: {
                var b_1 = node;
                if (binaryBooleanExpressionKind(b_1) !== undefined) {
                    var left = b_1.left, right = b_1.right;
                    var checkHalf = function (expr) {
                        // If it's another boolean binary expression, we'll check it when recursing.
                        if (!isBooleanBinaryExpression(expr)) {
                            checkExpression(expr, b_1);
                        }
                    };
                    checkHalf(left);
                    checkHalf(right);
                }
                break;
            }
            case ts.SyntaxKind.PrefixUnaryExpression: {
                var _a = node, operator = _a.operator, operand = _a.operand;
                if (operator === ts.SyntaxKind.ExclamationToken) {
                    checkExpression(operand, node);
                }
                break;
            }
            case ts.SyntaxKind.IfStatement:
            case ts.SyntaxKind.WhileStatement:
            case ts.SyntaxKind.DoStatement: {
                var c = node;
                // If it's a boolean binary expression, we'll check it when recursing.
                if (!isBooleanBinaryExpression(c.expression)) {
                    checkExpression(c.expression, c);
                }
                break;
            }
            case ts.SyntaxKind.ConditionalExpression:
                checkExpression(node.condition, node);
                break;
            case ts.SyntaxKind.ForStatement: {
                var condition = node.condition;
                if (condition !== undefined) {
                    checkExpression(condition, node);
                }
            }
        }
        return ts.forEachChild(node, cb);
    });
    function checkExpression(node, location) {
        var symbol = checker.getTypeAtLocation(node).symbol;
        if (symbol !== undefined && symbol.name === 'Promise') {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
    }
}
/** Matches `&&` and `||` operators. */
function isBooleanBinaryExpression(node) {
    return node.kind === ts.SyntaxKind.BinaryExpression && binaryBooleanExpressionKind(node) !== undefined;
}
function binaryBooleanExpressionKind(node) {
    switch (node.operatorToken.kind) {
        case ts.SyntaxKind.AmpersandAmpersandToken:
            return "&&";
        case ts.SyntaxKind.BarBarToken:
            return "||";
        default:
            return undefined;
    }
}
var _a, _b;
