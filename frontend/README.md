# DalVacationHome Application Configuration

This README provides instructions on how to configure and integrate environment variables in our DalVacationHome application.

## Prerequisites

Before you begin, make sure you have the following:

- Node.js installed on your machine
- A code editor of your choice

## Installation

1. Clone the repository to your local machine:
- SSH
```
git clone git@git.cs.dal.ca:patrawala/csci5410-s24-sdp-32.git
```
- HTTP
```
git clone https://git.cs.dal.ca/patrawala/csci5410-s24-sdp-32.git
```
2. Navigate to the project directory:

```
cd csci5410-s24-sdp-32
```

3. Navigate to the frontend folder

```
cd frontend
```

3. Install the dependencies:

```
npm install
```

## Environment Variables

To integrate environment variables in your application, follow these steps:

1. Create a new file named `.env.local` in the root directory of your project.

2. Open the `.env.local` file and define your environment variables in the following format (copy the environment variables I forwarded in the group to run your application):

```
VARIABLE_NAME=value
```

Replace `VARIABLE_NAME` with the name of your variable and `value` with the desired value.

3. Save the `.env.local` file.

## Running the Application

To run your Next.js application, use the following command:

```
npm run dev
```

This will start the development server and you can access your application at `http://localhost:3000`.

## Conclusion

Congratulations! You have successfully configured and integrated environment variables in your application. Feel free to explore and customize your application further.
