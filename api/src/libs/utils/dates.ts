const index = (date: {
  getTime: () => number;
  getTimezoneOffset: () => number;
}) => {
  const ms_per_minute = 60000;
  return new Date(date.getTime() - date.getTimezoneOffset() * ms_per_minute)
    .toISOString()
    .split('T')[0];
};

export default index;
