export const stringIsNullOrEmpty = (str: string | null): boolean => {
  return typeof str == "undefined" || !str || !str.trim;
};

export const dateYYYYMMDD = (date: {
  getTime: () => number;
  getTimezoneOffset: () => number;
}) => {
  const ms_per_minute = 60000;
  return new Date(date.getTime() - date.getTimezoneOffset() * ms_per_minute)
    .toISOString()
    .split("T")[0];
};

// https://stackoverflow.com/questions/43100718/typescript-enum-to-object-array/43101184
export const enumToMap = (enumeration: any): Map<string, string | number> => {
  const map = new Map<string, string | number>();
  for (let key in enumeration) {
    //TypeScript does not allow enum keys to be numeric
    if (!isNaN(Number(key))) continue;

    const val = enumeration[key] as string | number;

    //TypeScript does not allow enum value to be null or undefined
    if (val !== undefined && val !== null) map.set(key, val);
  }

  return map;
};
