export function describeIf(expression: unknown): typeof describe | typeof describe.skip {
    return expression ? describe : describe.skip;
}
