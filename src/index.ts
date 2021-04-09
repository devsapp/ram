import { HLogger, ILogger, getCredential, commandParse, help } from '@serverless-devs/core';
import _ from 'lodash';
import { CONTEXT, HELP } from './constant';
import { IInputs, IProperties } from './interface';
import Ram from './utils/ram';

export default class RamCompoent {
  @HLogger(CONTEXT) logger: ILogger;

  async deploy(inputs: IInputs): Promise<string> {
    this.logger.debug('Create ram start...');
    this.logger.debug(`inputs params: ${JSON.stringify(inputs)}`);

    const apts = { boolean: ['help'], alias: { help: 'h' } };
    const commandData: any = commandParse({ args: inputs.args }, apts);
    this.logger.debug(`Command data is: ${JSON.stringify(commandData)}`);
    if (commandData.data?.help) {
      help(HELP);
      return;
    }

    const credentials = await getCredential(inputs.credentials?.Alias);
    const properties: IProperties = inputs.props;
    this.logger.debug(`Properties values: ${JSON.stringify(properties)}.`);

    if (properties.service && properties.statement) {
      this.logger.warn(
        "The 'service' and 'statement' configurations exist at the same time, and the 'service' configuration is invalid and overwritten by the 'statement'.",
      );
    } else if (!(properties.service || properties.statement)) {
      throw new Error("'service' and 'statement' must have at least one configuration.");
    }

    const ram = new Ram(credentials);
    const arn = await ram.deploy(properties);

    this.logger.debug('Create ram success.');
    return arn;
  }

  async delete(inputs) {
    this.logger.debug('Delete ram start...');
    
    const apts = { boolean: ['help'], alias: { help: 'h' } };
    const commandData: any = commandParse({ args: inputs.args }, apts);
    this.logger.debug(`Command data is: ${JSON.stringify(commandData)}`);
    if (commandData.data?.help) {
      help(HELP);
      return;
    }

    const credentials = await getCredential(inputs.credentials?.Alias);
    const properties: IProperties = inputs.Properties;
    this.logger.debug(`Properties values: ${JSON.stringify(properties)}.`);

    const ram = new Ram(credentials);
    await ram.deleteRole(properties.name);
    await ram.deletePolicys(properties.policies || []);

    this.logger.debug('Delete ram success.');
  }
}
