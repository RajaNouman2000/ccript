import casual from 'casual';
import { User, validateUser } from '../models/user.js';



const generateRandomUser = () => {
  const user = {
    name: casual.name,
    email: casual.email,
    age: casual.integer(1, 100),
    date_of_birth: casual.date('YYYY-MM-DD'),
  };

  // Log the generated values for debugging
  console.log("Generated user:", user);

  return user;
};

export const dumpRandomUsersToDatabase = async (count) => {
  try {
    for (let i = 0; i < count; i++) {
      const randomUser = generateRandomUser();
      const { error } = validateUser(randomUser);

      if (error) {
        console.error(`Validation error for generated user ${i + 1}:`, error.details);
        continue; // Skip invalid users
      }

   

      await User.create(randomUser);
      console.log(`User ${i + 1} inserted successfully`);
    }

    console.log(`Dumped ${count} random users to the database.`);
  } catch (error) {
    console.error("Error dumping random users:", error);
  }
};


export default  {dumpRandomUsersToDatabase}