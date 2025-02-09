import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

class GameServerStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

    }
}

export class GameServerStage extends cdk.Stage {
    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        new GameServerStack(this, 'GameServerStack');
    }
}