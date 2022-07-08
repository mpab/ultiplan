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
