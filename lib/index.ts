import { CfnOutput, Stack } from 'aws-cdk-lib';
import { AccountPrincipal, Effect, Policy, PolicyDocument, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface ConsumerIamRoleStackProps {
  readonly trustAccount: string;
  readonly externalIds: string[];
}

export class ConsumerIamRoleStack extends Stack {
  constructor(scope: Construct, id: string, props?: ConsumerIamRoleStackProps) {
    super(scope, id);

    const policyStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      actions:[
        "states:ListStateMachines",
        "states:ListExecutions"
      ],
      resources: ['*']
    });
    
    const crossAccessPolicy = new Policy(this, "ConsumerStepFunctionMetricsReadPolicy", {
      policyName: 'ConsumerStepFunctionMetricsReadPolicy',
      document: new PolicyDocument({
        statements: [policyStatement]
      })
    });
    const role = new Role(this, "ConsumerAccessRole", {
      assumedBy: new AccountPrincipal(props?.trustAccount),
      roleName: "ConsumerStepFunctionAccessRole",
      externalIds: props?.externalIds
    })
    role.attachInlinePolicy(crossAccessPolicy);

    new CfnOutput(this, "ConsumerAccessRoleArn", {
      value: role.roleArn,
      description: 'IAM Role ARN created by the ConsumerIamRoleStack stack. This role will be used by the Consumer Account to access the Client Account resources',
      exportName: 'ConsumerAccessRoleArn',
    });
  }
}
