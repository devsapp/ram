import { getCredential, commandParse, help } from '@serverless-devs/core';
import { HELP } from './constant';
import StdoutFormatter from './common/stdout-formatter';
import { IInputs, IProperties } from './interface';
import Ram from './utils/ram';
import Base from './common/base';
import logger from './common/logger';

export default class RamCompoent extends Base {
  logger = logger;

  async deploy(inputs: IInputs): Promise<string> {
    this.logger.debug('Create ram start...');
    this.logger.debug(`inputs.props: ${JSON.stringify(inputs.props)}`);

    const apts = { boolean: ['help'], alias: { help: 'h' } };
    const commandData: any = commandParse({ args: inputs.args }, apts);
    this.logger.debug(`Command data is: ${JSON.stringify(commandData)}`);
    if (commandData.data?.help) {
      help(HELP);
      return;
    }
    await StdoutFormatter.initStdout();

    const credentials = inputs.credentials || (await getCredential(inputs.project?.access));
    const properties: IProperties = inputs.props;
    this.logger.debug(`Properties values: ${JSON.stringify(properties)}.`);

    if (properties.service && properties.statement) {
      this.logger.warn(
        StdoutFormatter.stdoutFormatter.warn(
          'deploy',
          "The 'service' and 'statement' configurations exist at the same time, and the 'service' configuration is invalid and overwritten by the 'statement'",
        ),
      );
    } else if (!(properties.service || properties.statement)) {
      throw new Error("'service' and 'statement' must have at least one configuration.");
    }

    const ram = new Ram(credentials, properties.region, properties.serviceName, inputs.path?.configPath);
    const arn = await ram.deploy(properties);
    super.__report({
      name: 'ram',
      access: inputs.project?.access,
      content: { arn, role: properties.name },
    });

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

    const credentials = inputs.credentials || (await getCredential(inputs.project?.access));
    const properties: IProperties = inputs.props;
    this.logger.debug(`Properties values: ${JSON.stringify(properties)}.`);

    const ram = new Ram(credentials);
    await ram.deleteRole(properties.name);
    await ram.deletePolicys(properties.policies || []);
    super.__report({ name: 'ram', access: inputs.project?.access, content: { arn: '', role: '' } });

    this.logger.debug('Delete ram success.');
  }

  async remove(inputs) {
    return await this.delete(inputs);
  }

  async list(inputs: IInputs): Promise<any[]> {
    this.logger.debug('List ram roles...');
    this.logger.debug(`Input data is: ${JSON.stringify(inputs)}`);

    const apts = { boolean: ['help'], alias: { help: 'h' } };
    const commandData: any = commandParse({ args: inputs.args }, apts);
    this.logger.debug(`Command data is: ${JSON.stringify(commandData)}`);
    if (commandData.data?.help) {
      help(HELP);
      return;
    }
    await StdoutFormatter.initStdout();

    const credentials = inputs.credentials || (await getCredential(inputs.project?.access));
    const ram = new Ram(credentials);
    const roles = await ram.listRoles();
    this.logger.debug(`List roles success, response: ${JSON.stringify(roles)}`);
    super.__report({ name: 'ram', access: inputs.project?.access, content: { arn: '', role: '' } });
    this.logger.debug('List ram roles success.');

    return roles;
  }
}
