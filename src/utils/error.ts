module.exports = (message: string, exit: boolean) => {
  console.error("ERROR: " + message);
  exit && process.exit(1);
}
