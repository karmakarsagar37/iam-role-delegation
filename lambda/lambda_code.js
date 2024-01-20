// Import the AWS SDK to interact with AWS services
const AWS = require('aws-sdk');

// AWS Lambda function handler
// Sample Lambda code to test the IAM Role Delegation. In the stack we gave the IAM role permission to access the list of executions for a particular step function
module.exports.handler = async (event, context) => {
    // Define parameters to assume the role in the consumer account
    const ConsumerRoleParams = {
        RoleArn: `${process.env.CLIENT_ROLE_ARN}`,
        RoleSessionName: 'Consumer-Session',
        ExternalId: `${process.env.EXTERNAL_ID}`
    };

    // Create an AWS Security Token Service (STS) object
    const sts = new AWS.STS();

    try {
        // Assume the specified role in the consumer account using STS
        const assumedRole = await sts.assumeRole(ConsumerRoleParams).promise();

        // Log the assumed role's credentials to the console
        console.log(assumedRole.Credentials);

        // Create an AWS Step Functions object with the assumed role's credentials
        const stepFunctions = new AWS.StepFunctions({
            accessKeyId: assumedRole.Credentials.AccessKeyId,
            secretAccessKey: assumedRole.Credentials.SecretAccessKey,
            sessionToken: assumedRole.Credentials.SessionToken,
            region: 'us-east-2'
        });

        // Retrieve the list of state machines using the assumed role's credentials
        const stepFunctionList = await  stepFunctions.listStateMachines().promise();
        const stateMachines = stepFunctionList.stateMachines;

        // Initialize an array to store the results
        const result = [];
        for (const stateMachine of stateMachines) {
            // Retrieve the executions for the current state machine
            const stepFunctionActivities = await stepFunctions.listExecutions({
                stateMachineArn: `${stateMachine.stateMachineArn}`
            }).promise();

            // Extract the name of the state machine from its ARN
            const stateMachineName = stateMachine.stateMachineArn.split(':').slice(6).join(':');

            // Create an object with the state machine name as the key and activities as the value
            const res = {
                [stateMachineName]: stepFunctionActivities
            }

            // Add the result to the array
            result.push(res);
        }

        // Return a success response with the retrieved step function metrics
        return {
            statusCode: 200,
            body: JSON.stringify({ result }),
        };
    } catch (err) {
        // Log and handle errors gracefully
        console.error('Error:', err);

        // Return an error response if an exception occurs
        return {
            statusCode: 500,
            body: JSON.stringify('Error occurred while listing state machines.'),
        };
    }
};
