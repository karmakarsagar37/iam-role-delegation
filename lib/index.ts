// Importing necessary modules from AWS CDK library
import { CfnOutput, Stack } from 'aws-cdk-lib';
import { AccountPrincipal, Effect, Policy, PolicyDocument, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

// Define properties for the ConsumerIamRoleStack
export interface ConsumerIamRoleStackProps {
  // This is the AWS Account of the Consumer which will be able to acces the Client Account
  readonly trustAccount: string;
  // Consumer AWS Account need to have these external IDs in order to assume the IAM Role in Client Account
  readonly externalIds: string[];
}

export class ConsumerIamRoleStack extends Stack {
  constructor(scope: Construct, id: string, props?: ConsumerIamRoleStackProps) {
    super(scope, id);

    // Define the IAM policy statement allowing specific actions on Step Functions
    const policyStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      // Below is the list of AWS APIs that the consumer account can call after assuming the role which
      // will be created by this particular stack
      actions:[
        "states:ListStateMachines",
        "states:ListExecutions"
      ],
      // Here I have given permission to access every setpfunction AWS Resource. You can aslo control the permissions by mentioning
      // the ARNs fo the resources
      resources: ['*']
    });
    
    // Create an IAM policy with the defined statement
    const crossAccessPolicy = new Policy(this, "ConsumerStepFunctionMetricsReadPolicy", {
      policyName: 'ConsumerStepFunctionMetricsReadPolicy',
      document: new PolicyDocument({
        statements: [policyStatement]
      })
    });

    // Create an IAM role with the specified trust account and external IDs
    const role = new Role(this, "ConsumerAccessRole", {
      assumedBy: new AccountPrincipal(props?.trustAccount),
      roleName: "ConsumerStepFunctionAccessRole",
      externalIds: props?.externalIds
    })

    // Attaching the IAM policy to the IAM role
    role.attachInlinePolicy(crossAccessPolicy);

    // Output the IAM role ARN so that this ARN can be assumed by the Consumer Account
    new CfnOutput(this, "ConsumerAccessRoleArn", {
      value: role.roleArn,
      description: 'IAM Role ARN created by the ConsumerIamRoleStack stack. This role will be used by the Consumer Account to access the Client Account resources',
      exportName: 'ConsumerAccessRoleArn',
    });
  }
}
