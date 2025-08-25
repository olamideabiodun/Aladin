import bcrypt from 'bcrypt';

async function hashPassword(password: string) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log(hashedPassword);
}

// Get the password from terminal
const password = process.argv[2];

if (!password) {
  console.error("Please provide a password as an argument.");
  process.exit(1);
}

hashPassword(password);