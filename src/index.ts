import { HLogger, ILogger, getCredential, commandParse, reportComponent, help } from '@serverless-devs/core';
import _ from 'lodash';
import { CONTEXT, HELP, CONTEXT_NAME } from './constant';
import StdoutFormatter from './common/stdout-formatter';
import { IInputs, IProperties } from './interface';
import Ram from './utils/ram';

export default class RamCompoent {
  @HLogger(CONTEXT) logger: ILogger;

  async deploy(inputs: IInputs): Promise<string> {
    // @ts-ignore
    delete inputs.Credentials;
    // @ts-ignore
    delete inputs.credentials;
    this.logger.debug('Create ram start...');
    this.logger.debug(`inputs params: ${JSON.stringify(inputs)}`);

    const apts = { boolean: ['help'], alias: { help: 'h' } };
    const commandData: any = commandParse({ args: inputs.args }, apts);
    this.logger.debug(`Command data is: ${JSON.stringify(commandData)}`);
    if (commandData.data?.help) {
      help(HELP);
      return;
    }
    await StdoutFormatter.initStdout();

    const credentials = await getCredential(inputs.project.access);
    reportComponent(CONTEXT_NAME, {
      uid: credentials.AccountID,
      command: 'deploy',
    });

    const properties: IProperties = inputs.props;
    this.logger.debug(`Properties values: ${JSON.stringify(properties)}.`);

    if (properties.service && properties.statement) {
      this.logger.warn(StdoutFormatter.stdoutFormatter.warn(
        'deploy',
        "The 'service' and 'statement' configurations exist at the same time, and the 'service' configuration is invalid and overwritten by the 'statement'"),
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
    await StdoutFormatter.initStdout();

    const credentials = await getCredential(inputs.project.access);
    reportComponent(CONTEXT_NAME, {
      uid: credentials.AccountID,
      command: 'delete',
    });

    const properties: IProperties = inputs.Properties;
    this.logger.debug(`Properties values: ${JSON.stringify(properties)}.`);

    const ram = new Ram(credentials);
    await ram.deleteRole(properties.name);
    await ram.deletePolicys(properties.policies || []);

    this.logger.debug('Delete ram success.');
  }
}
