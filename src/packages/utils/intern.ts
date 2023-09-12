export const intern = <T, U extends object>(fn: (arg: T) => U) => {
  const cache: Map<T, WeakRef<U>> = new Map();
  const registry: FinalizationRegistry<T> = new FinalizationRegistry(
    (value) => {
      cache.delete(value);
    }
  );

  return (arg: T) => {
    const cachedValue = cache.get(arg);
    if (cachedValue) {
      const value = cachedValue.deref();
      if (value) return value;
    }

    const value = fn(arg);
    cache.set(arg, new WeakRef(value));
    registry.register(value, arg);
    return value;
  };
};

export const intern2 = <T, U, V extends object>(
  fn: (arg1: T, arg2: U) => V
) => {
  const interned = intern((arg1: T) => intern((arg2: U) => fn(arg1, arg2)));
  return (arg1: T, arg2: U) => interned(arg1)(arg2);
};

export const intern3 = <T, U, V, W extends object>(
  fn: (arg1: T, arg2: U, arg3: V) => W
) => {
  const interned = intern2((arg1: T, arg2: U) =>
    intern((arg3: V) => fn(arg1, arg2, arg3))
  );
  return (arg1: T, arg2: U, arg3: V) => interned(arg1, arg2)(arg3);
};
