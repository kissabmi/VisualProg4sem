import { describe, it } from 'vitest';
import { expectTypeOf } from 'expect-type';

export type DeepReadonly<T> = T extends Function
  ? T
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

export type PickedByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

export type EventHandlers<T> = {
  [K in keyof T as K extends string ? `on${Capitalize<K>}` : never]: (event: T[K]) => void;
};

describe('Type Utilities', () => {
  it('DeepReadonly should make everything readonly recursively', () => {
    type Base = { a: number; b: { c: string } };
    type ReadonlyBase = DeepReadonly<Base>;

    expectTypeOf<ReadonlyBase>().toEqualTypeOf<{
      readonly a: number;
      readonly b: { readonly c: string };
    }>();
  });

  it('PickedByType should pick only properties of specified type', () => {
    type Obj = { a: number; b: string; c: number; d: boolean; e: string[] };
    
    expectTypeOf<PickedByType<Obj, number>>().toEqualTypeOf<{ a: number; c: number }>();
    expectTypeOf<PickedByType<Obj, string>>().toEqualTypeOf<{ b: string }>();
    expectTypeOf<PickedByType<Obj, boolean>>().toEqualTypeOf<{ d: boolean }>();
  });

  it('EventHandlers should generate appropriate handler types', () => {
    type Events = { 
      click: MouseEvent; 
      change: string; 
      update: { id: number } 
    };
    
    type Handlers = EventHandlers<Events>;

    expectTypeOf<Handlers>().toEqualTypeOf<{
      onClick: (event: MouseEvent) => void;
      onChange: (event: string) => void;
      onUpdate: (event: { id: number }) => void;
    }>();
  });
});
