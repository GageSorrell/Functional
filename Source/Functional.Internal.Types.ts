/**
 * @file      Functional.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * A `ReadonlyArray` of a given {@link ElementType} that is
 * nonempty.
 * 
 * @template ElementType - The type of the elements in this `ReadonlyArray`.
 */
export type TReadonlyArrayNonempty<ElementType> = 
    readonly [ ElementType ]
    | readonly [ ElementType, ...Array<ElementType> ];