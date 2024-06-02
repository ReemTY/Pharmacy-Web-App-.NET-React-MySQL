# Pharmacy-Web-App-.NET-React-MySQL

```markdown
# Pharmacy-Web-App-.NET-React-MySQL

## Description
A captivating and useful pharmaceutical web app designed to streamline pharmacy operations. This app provides a user-friendly interface with CRUD functionalities.

## Technologies Used
- .NET
- React
- MySQL

## Features
- User-friendly interface
- CRUD functionalities (Create, Read, Update, Delete)
- Secure user authentication
- Role-based access control
- Search and filter functionality

## Installation Instructions

### Prerequisites
- Ensure you have Node.js, npm, .NET SDK, and MySQL installed on your machine.

### Backend Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/ReemTY/Pharmacy-Web-App-.NET-React-MySQL.git
   ```
2. **Navigate to the backend directory**:
   ```bash
   cd pharmacy-web-app/backend
   ```
3. **Install the required packages**:
   ```bash
   dotnet restore
   ```
4. **Update the MySQL connection string**:
   - Open `appsettings.json` and update the connection string with your MySQL database details.
   ```json
   "ConnectionStrings": {
       "DefaultConnection": "Server=your-server;Database=your-database;User=your-username;Password=your-password;"
   }
   ```
5. **Run the backend server**:
   ```bash
   dotnet run
   ```

### Frontend Setup
1. **Navigate to the frontend directory**:
   ```bash
   cd ../frontend
   ```
2. **Install the required packages**:
   ```bash
   npm install
   ```
3. **Start the frontend development server**:
   ```bash
   npm start
   ```

### Database Setup
1. **Create a new MySQL database**.
2. **Run the provided SQL scripts** located in the `database` directory to set up the necessary tables.

## Usage
- Open your browser and go to `http://localhost:3000`.
- Register a new account or log in with existing credentials.
- Use the navigation menu to access different functionalities like adding new records, viewing existing records, updating records, and deleting records.

## Screenshots
![Home Page](path/to/homepage-screenshot.png)
![User Dashboard](path/to/dashboard-screenshot.png)

## Contributors
- Reem Tarek (Team Leader)

## Contact
For any inquiries, please contact Reem Tarek at reem1tarek8@gmail.com.
```

### Adding Screenshots
Replace the placeholder paths in the `Screenshots` section with actual paths to your screenshots. You can do this by:
1. Creating a folder named `screenshots` in the root directory of your repository.
2. Adding your screenshot images to this folder.
3. Updating the paths in the README file to point to these images, e.g., `![Home Page](screenshots/homepage.png)`.

### Final Steps
1. **Commit the README**: Make sure to commit the updated README file along with any screenshots or other resources.
2. **Push to GitHub**: Push your changes to your GitHub repository.

By following these steps, you’ll have a well-structured and informative README file for your Pharmacy Web App project on GitHub.
