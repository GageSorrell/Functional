/**
 * @file      Curry.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FCurriedArgument } from "./Curry.Types.js";

export type ReplaceAtIndex<
    TupleType extends ReadonlyArray<unknown>,
    TargetIndexType extends keyof TupleType
> = {
    [ Index in keyof TupleType ]: Index extends TargetIndexType
        ? FCurriedArgument
        : TupleType[Index];
};

type IsEqual<Left, Right> =
    (<Value>() => Value extends Left ? 1 : 2) extends
    (<Value>() => Value extends Right ? 1 : 2)
        ? true
        : false;

export type TCurriedArgumentVectorSourceRecursive<
    ArgumentVectorType extends ReadonlyArray<unknown>,
    CurriedType extends ReadonlyArray<unknown>,
    SourceVectorType extends ReadonlyArray<unknown> = [ ]
> =
    ArgumentVectorType extends readonly [
        infer ArgumentType,
        ...infer RemainingArgumentVectorType
    ]
        ? CurriedType extends readonly [
            infer CurriedArgumentType,
            ...infer RemainingCurriedType
        ]
            ? IsEqual<CurriedArgumentType, FCurriedArgument> extends true
                ? TCurriedArgumentVectorSourceRecursive<
                    RemainingArgumentVectorType,
                    RemainingCurriedType,
                    [ ...SourceVectorType, ArgumentType ]
                >
                : TCurriedArgumentVectorSourceRecursive<
                    RemainingArgumentVectorType,
                    RemainingCurriedType,
                    SourceVectorType
                >
            : SourceVectorType
        : SourceVectorType;

export type TWithCurryRecurrence<
    ArgumentVectorType extends ReadonlyArray<unknown>,
    HasPipedArgument extends boolean = false,
    HasOriginalArgument extends boolean = false
> =
    ArgumentVectorType extends readonly [
        infer ArgumentType,
        ...infer RemainingArgumentVectorType
    ]
        ? readonly [
            FCurriedArgument,
            ...TWithCurryRecurrence<
                RemainingArgumentVectorType,
                true,
                HasOriginalArgument
            >
        ] | readonly [
            ArgumentType,
            ...TWithCurryRecurrence<
                RemainingArgumentVectorType,
                HasPipedArgument,
                true
            >
        ]
        : HasPipedArgument extends true
            ? HasOriginalArgument extends true
                ? readonly [ ]
                : never
            : never;

export type TCurriedRecurrence<
    ArgumentVectorType extends ReadonlyArray<unknown>,
    CurriedType extends ReadonlyArray<unknown>,
    __Accumulator extends ReadonlyArray<unknown> = readonly [ ]
> =
    ArgumentVectorType extends readonly [ infer HeadType, ...infer TailType ]
        ? CurriedType extends readonly [ infer CurriedHeadType, ...infer CurriedTailType ]
            ? CurriedHeadType extends FCurriedArgument
                ? TCurriedRecurrence<TailType, CurriedTailType, readonly [ ...__Accumulator, HeadType ]>
                : TCurriedRecurrence<TailType, CurriedTailType, __Accumulator>
            : never
        : ArgumentVectorType extends readonly [ infer HeadType ]
            ? CurriedType extends readonly [ infer CurriedHeadType ]
                ? CurriedHeadType extends FCurriedArgument
                    ? readonly [ ...__Accumulator, HeadType ]
                    : __Accumulator
                : __Accumulator
            : __Accumulator;