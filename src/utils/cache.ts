import * as core from '@serverless-devs/core';
import path from 'path';
import logger from '../common/logger';

async function getStateId(accountID, region, serviceName) {
  const fcCore = await core.loadComponent('devsapp/fc-core');
  return await fcCore.DeployCache.getCreateResourceStateID(accountID, region, serviceName);
}

export async function writeCreatCache({
  accountID, region, serviceName,
  configPath, roleArn, policy,
}) {
  if (!(region && serviceName)) { // region serviceName必须存在，否则不计入缓存
    return;
  }
  try {
    const _ = core.lodash;
    const stateId = await getStateId(accountID, region, serviceName);
    const cachePath = path.join(configPath ? path.dirname(configPath) : process.cwd(), '.s');
    const cacheData = (await core.getState(stateId, cachePath)) || {};

    if (roleArn) {
      cacheData.serviceRole = roleArn;
    }

    if (policy) {
      const policies = cacheData.policies || [];
      policies.push(policy);
      cacheData.policies = _.uniq(policies);
    }

    await core.setState(stateId, cacheData, cachePath);
  } catch (ex) {
    /* 不影响主进程 */
    logger.debug(ex);
  }
}
