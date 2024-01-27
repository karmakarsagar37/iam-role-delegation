
---

## Lambda Function for Cross-Account Access Testing

### Overview

This AWS Lambda function with AWS API Gateway is designed to test the cross-account access facilitated by this project. The function assumes the IAM role in the Client AWS Account using the assumed role's credentials, interacts with AWS Step Functions, and retrieves information about Step Functions and their executions.

### Prerequisites

Before using this Lambda function, ensure the following:

- The IAM Role Delegation stack is deployed, creating the necessary IAM role in the Client AWS Account.
- Environment variables are set:
  - `CLIENT_ROLE_ARN`: The ARN of the IAM role created in the Client AWS Account which was created when the `ConsumerIamRoleStack` was deployed in Client Account.
  - `EXTERNAL_ID`: The external ID which was used while creating the IAM Role Delegation.

### Deployment

1. Clone the repository and navigate to the Lambda function directory:

   ```bash
   git clone https://github.com/your-username/iam-role-delegation.git
   cd iam-role-delegation/lambda-function
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Deploy the Lambda function using Serverless:

   ```bash
   serverless deploy
   ```

### Usage

After deploying the Lambda function, you can invoke it to test the cross-account access:

1. Invoke the Lambda function using the provided API endpoint(You will get the API Gateway Url in the teminal after the `serverless deploy` command runs successfully):

   ```bash
   curl https://your-api-gateway-url/test
   ```

2. Check the Lambda function logs for information about the assumed role's credentials and the retrieved Step Function metrics.

### Troubleshooting

If you encounter issues during deployment or execution, check the following:

- Ensure that the IAM Role Delegation stack is deployed and the IAM role in the Client Account is configured correctly.
- Verify that the environment variables (`CLIENT_ROLE_ARN` and `EXTERNAL_ID`) are set correctly in the Lambda function configuration.

### Contributing

If you find issues or have suggestions for improvements, please open an issue or submit a pull request. Contributions are welcome!

### License

This Lambda function is part of the IAM Role Delegation project and is licensed under the [MIT License](../LICENSE).

---

This README section provides a brief overview of the Lambda function, explains prerequisites, deployment steps, usage instructions, troubleshooting tips, and information about contributing and licensing. Customize it further based on your specific requirements and project details.