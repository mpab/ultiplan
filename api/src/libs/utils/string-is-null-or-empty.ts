const index =  (str: string | null): boolean => {
  return typeof str == 'undefined' || !str || !str.trim;
};
export default index;
