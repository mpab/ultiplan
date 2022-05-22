export default (message: string) => {
  console.error("ERROR: " + message);
  process.exit(1);
}
