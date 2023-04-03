Drone Fleet Management API
This project is an API for managing a fleet of 10 drones. Each drone is capable of carrying medications and delivering them to a specific location.

Github repository(in case local commit history is not visible) - https://github.com/janithapm/Drones

Assumptions
    01. Each drone is in IDLE state when registering.
    02. Once loaded medicine with a location, it is not IDLE even if there is capacity left(can deliver medicine one place at a time).
    03. Only un delivered payloads are requireds to be shown when requested(can scale to request history of deliveries).
    04. If LOADING of one medication in the list failed, the delivery is cancelled and therefore drone is becoming back to IDLE.

Limitations
    01. Unit tests are not added due to the time constraint.
    02. Need to add a wrapper for proper output status codes and generalize the response.
    03. Since we are using a sql based database, the event logs are not being saved in the db(we do not know the time interval that the scheduler should run), the logs will be saved in the logs folder as a text file.
    04. Default time interval is 30 seconds(You can change this by setting the LOG_INTERVAL environment variable).
    05. Medicine image is added as a url, if in case, someone uploaded a huge file, there is no mechanism to reduc the size right now.

API Endpoints (please refer to the attached postman collection for further information)
The following endpoints are available:

    Register Drone
        Endpoint: POST /drone

        Registers a new drone with the API. Requires the following parameters in the request body:

        serial (string): The serial number of the drone being registered.
        model (string): The model of the drone.
        battery (integer): The starting battery percentage of the drone.
        weight_limit(integer): The maximum weightcan be carried out.


    Load Drone with Medications
        Endpoint: POST /drone/:serialNumber/medications

        Loads a drone with medications to be delivered to a specific location. Requires the following parameters in the request body:

        medications (array): constis of code, weight of each medicine as object 
        location (string): The location where the medication should be delivered.


    Get Medications in Drone
        Endpoint: GET /drone/:serialNumber/medications

        Retrieves the medications currently loaded in a specific drone. Requires the following parameter in the URL path:

        serialNumber (string): The serial number of the drone being queried.


    Get Drones in a Given State (To retrieve idle state drones in the fleet)
        Endpoint: GET /drone?state=

        Retrieves the drones in a specific state. Requires the following query parameter:

        state (string): The state of the drones being queried.Can retireve any state drones.
    

    Get Battery Percentage
        Endpoint: GET /drone/:serialNumber/battery

        Retrieves the battery percentage of a specific drone. Requires the following parameter in the URL path:

        serialNumber (string): The serial number of the drone being queried.


Installation
To install and run the API, follow these steps:

Clone the repository to your local machine / unzip the repository.
Checkout to master branch.
Install the dependencies by running npm install.
Start the API by running npm start.
By default, the API will start on port 8080. You can change this by setting the PORT environment variable.