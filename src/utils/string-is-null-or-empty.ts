module.exports = (str: string): boolean => {
  return typeof str == 'undefined' || !str || !str.trim;
}