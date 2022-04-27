export const chunk = <T extends any[]>(array: T, size: number): T[] =>
  array.reduce(
    (newarr, _, i) =>
      i % size ? newarr : [...newarr, array.slice(i, i + size)],
    [],
  );

export const destructiveDeepDeleteUndefined = (data: Record<string, any>) => {
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined) {
      delete data[k];
    } else if (v instanceof Array) {
      for (const val of v) {
        destructiveDeepDeleteUndefined(val);
      }
    } else if (v instanceof Object) {
      destructiveDeepDeleteUndefined(v);
    }
  }
};

export const destructiveDeepDeleteUndefinedOrNull = (
  data: Record<string, any>,
) => {
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v == null) {
      delete data[k];
    } else if (v instanceof Array) {
      for (const val of v) {
        destructiveDeepDeleteUndefinedOrNull(val);
      }
    } else if (v instanceof Object) {
      destructiveDeepDeleteUndefinedOrNull(v);
    }
  }
};

type EpochMillis = number;

type isDate<T> = T extends Date
  ? T
  : T extends Date | undefined
  ? EpochMillis | undefined
  : never;

export type DeepDateToMillis<T> = T extends Array<infer R>
  ? Array<DeepDateToMillis<R>>
  : T extends Date
  ? EpochMillis
  : T extends Record<string, any>
  ? {
      [P in keyof T]: T[P] extends isDate<T[P]>
        ? EpochMillis
        : T[P] extends Array<infer R>
        ? Array<DeepDateToMillis<R>>
        : T[P] extends Record<string, any>
        ? DeepDateToMillis<T[P]>
        : T[P];
    }
  : T;

export const deepTimestampToMillis = <T>(data: T): DeepDateToMillis<T> => {
  if (data instanceof Array) {
    return data.map(deepTimestampToMillis) as DeepDateToMillis<T>;
  } else if (data instanceof Date) {
    return data.valueOf() as DeepDateToMillis<T>;
    // https://stackoverflow.com/questions/31459821/whats-different-between-object-prototype-tostring-call-and-typeof
  } else if (Object.prototype.toString.call(data) === '[object Object]') {
    return Object.entries(data).reduce((prev, [k, v]) => {
      if (v instanceof Date) {
        prev[k] = v.valueOf();
      } else {
        prev[k] = deepTimestampToMillis(v);
      }
      return prev;
    }, {} as Record<string, unknown>) as DeepDateToMillis<T>;
  } else {
    return data as DeepDateToMillis<T>;
  }
};
