const index = (str: string): boolean => {
  return typeof str == 'undefined' || !str || !str.trim;
};
export default index;
