import stringIsNullOrEmpty from './string-is-null-or-empty';

const index = (str: string | null): boolean => {
  if (stringIsNullOrEmpty(str)) return true;
  let checkstr = str as string;
  checkstr = checkstr.replace(' ', '');
  checkstr = checkstr.replace(/(\r\n|\n|\r)/gm, '');
  return checkstr.length === 0;
};
export default index;
