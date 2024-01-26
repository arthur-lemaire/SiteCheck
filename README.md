### Site Status Checker

## This Node.js application uses Puppeteer and Socket.IO to periodically check the status of multiple websites and provide real-time updates to connected clients via WebSocket.

## Prerequisites
#### Node.js installed on your machine
#### Internet connection (required for website status checking)
#### Getting Started
#### Clone the repository:


    git clone https://github.com/your-username/site-status-checker.git


### Navigate to the project directory:

    cd site-status-checker

### Install dependencies:

    npm install
  
  Run the application:
    
    node app.js

### The server will start running at http://localhost:3000.

###Configuration

Edit the app.js file to customize the application according to your needs:

Websites to Check: Add or remove websites in the checkSitesStatus function by modifying the sites array.

Timeout Duration: Adjust the checkTimeout variable to set the interval between automatic website checks (in seconds).

Usage
Access the application in your web browser at http://localhost:3000 to view the current status of the configured websites. The page will automatically update with real-time information.

WebSocket Integration
The application uses Socket.IO to establish a WebSocket connection. Clients connecting to the server will receive updates on the remaining countdown time and the results of the website checks.

### Acknowledgements

This project utilizes the following libraries:


Express - Web framework for Node.js

Puppeteer - Headless Chrome browser automation

Socket.IO - Real-time bidirectional event-based communication

License
This project is licensed under the MIT License. Feel free to modify and use it according to your requirements.
