const index = (str: string | null | undefined): boolean => {
  return typeof str == 'undefined' || !str || !str.trim;
};
export default index;
