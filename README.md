**Setup**
**Set Environment Variables:**

Create a file named .env based on the .env_example file and set the required variables.

**Install Dependencies:**

Run the following command to install all the required packages:

**npm install**

**Database Initialization**

**Uncomment the following line in your code:**

// dumpRandomUsersToDatabase(100);  in app.js

Run the application, and enter the desired number (e.g., 100) in the function to populate the user table with random data. After successful data insertion, commit the changes.


**API Endpoint**

**Endpoint**: http://localhost:8080/api/users
**Method**: GET


**Query Parameters**:

**pageNumber**: Page number for pagination (default: 1).

**perPage**: Number of items per page (default: 10).

**startAge and endAge**: Range filter for age.

**startDate and endDate**: Range filter for date_of_birth.

**name** and **email**: Case-sensitive substring search in the name and email.

**sortFields**: Array of fields to sort.

**sortOrder**: Sort order (-1 for descending, 1 for ascending, default on id column ascending).

**Example:**

GET /api/users?pageNumber=1&perPage=10&startAge=20&endAge=80&startDate=20
