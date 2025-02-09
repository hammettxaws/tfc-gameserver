#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Pipeline } from '../lib/pipeline';

const app = new cdk.App();
const envName = app.node.tryGetContext('env_name')

if (envName && envName != 'unknown') {
  new Pipeline(app, `gameserver-${envName}`, {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    }
  });
} else {
  console.log('add enviornment using "--context envName=foo"')
  throw new Error(`error: environment not found`);
}