import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';

import { GameServerStage } from './game-server';

export class Pipeline extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const isLocal = this.node.tryGetContext('is_local') == 'true'
    const envName = this.node.tryGetContext('env_name')

    if (!envName) {
      console.log('add enviornment using "--context envName=foo"')
      throw new Error(`error: environment not found`);
    }

    let gh_owner = this.node.tryGetContext('gh_owner');
    let gh_repo = this.node.tryGetContext('gh_repo');
    let gh_branch = 'main';

    if (isLocal) {
      console.log('... running locally')
      gh_owner = this.node.tryGetContext('gh_owner');
      gh_repo = this.node.tryGetContext('gh_repo');
      gh_branch = this.node.tryGetContext('gh_branch')

      if (!gh_owner && !gh_repo && !gh_branch) {
        throw new Error("Couldn't add the Policy!");
      }
    } else {
      gh_owner = StringParameter.valueForStringParameter(this, `/gs/${envName}/gh_owner`)
      gh_repo = StringParameter.valueForStringParameter(this, `/gs/${envName}gh_repo`)
      gh_branch = StringParameter.valueForStringParameter(this, `/gs/${envName}gh_branch`)
    }

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'gameserver-pipeline',
      synth: new ShellStep('Synth', {
        // requires web hook permissions
        input: CodePipelineSource.gitHub(`${gh_owner}/${gh_repo}`, gh_branch),
        commands: ['cd infra', 'npm ci', 'npm run build', 'npx cdk synth', 'pwd'],
        primaryOutputDirectory: 'infra/cdk.out',
      })
    });

    pipeline.addStage(new GameServerStage(this, "gameserver", {
      // env: { account: "111111111111", region: "eu-west-1" }
    }));
  }
}
