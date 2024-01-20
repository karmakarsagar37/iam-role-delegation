import { App } from "aws-cdk-lib";
import {ConsumerIamRoleStack, ConsumerIamRoleStackProps} from "./lib";

const app = new App();

const consumerIamRoleStackProps:  ConsumerIamRoleStackProps = {
    trustAccount: process.env.CONSUMER_AWS_ACCOUNT as string,
    externalIds: [process.env.EXTERNAL_ID as string]
}

new ConsumerIamRoleStack(app, 'ConsumerIamRoleStack', consumerIamRoleStackProps);
