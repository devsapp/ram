import { ILogger } from '@serverless-devs/core';
import { ICredentials } from './interface';
export default class RamCompoent {
    logger: ILogger;
    getCredentials(credentials: {} | ICredentials, provider: string, accessAlias?: string): Promise<ICredentials>;
    deploy(inputs: any): Promise<string>;
    delete(inputs: any): Promise<void>;
}
