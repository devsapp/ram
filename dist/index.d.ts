import { ILogger } from '@serverless-devs/core';
import { IInputs } from './interface';
export default class RamCompoent {
    logger: ILogger;
    deploy(inputs: IInputs): Promise<string>;
    delete(inputs: any): Promise<void>;
}
