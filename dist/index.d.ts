import { ILogger } from '@serverless-devs/core';
import { IInputs } from './interface';
import Base from './common/base';
export default class RamCompoent extends Base {
    logger: ILogger;
    deploy(inputs: IInputs): Promise<string>;
    delete(inputs: any): Promise<void>;
}
