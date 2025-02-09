import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';

export class Pipeline extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const gh_owner = this.node.tryGetContext('gh_owner');
    const gh_repo = this.node.tryGetContext('gh_repo');
    const gh_branch = this.node.tryGetContext('gh_branch') || 'main';

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'gameserver-pipeline',
      synth: new ShellStep('Synth', {
        // requires web hook permissions
        input: CodePipelineSource.gitHub(`${gh_owner}/${gh_repo}`, gh_branch),
        commands: ['cd cdk', 'npm ci', 'npm run build', 'npx cdk synth'],
        primaryOutputDirectory: 'cdk/cdk.out',
      })
    });
  }
}
