"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@serverless-devs/core");
var lodash_1 = __importDefault(require("lodash"));
var ram_1 = __importDefault(require("@alicloud/ram"));
var promise_retry_1 = __importDefault(require("promise-retry"));
var constant_1 = require("../constant");
var getStatement = function (service, statement) {
    if (statement) {
        return {
            Version: '1',
            Statement: statement,
        };
    }
    return {
        Statement: [
            {
                Action: 'sts:AssumeRole',
                Effect: 'Allow',
                Principal: {
                    Service: [service],
                },
            },
        ],
        Version: '1',
    };
};
var R = /** @class */ (function () {
    function R(profile) {
        var timeout = 10;
        if (process.env.ALIYUN_RAM_CLIENT_TIMEOUT) {
            timeout = parseInt(process.env.ALIYUN_RAM_CLIENT_TIMEOUT);
        }
        this.ramClient = new ram_1.default({
            accessKeyId: profile.AccessKeyID,
            accessKeySecret: profile.AccessKeySecret,
            securityToken: profile.SecurityToken,
            endpoint: 'https://ram.aliyuncs.com',
            opts: {
                timeout: timeout * 1000,
            },
        });
    }
    R.prototype.checkPolicyNotExistOrEnsureAvailable = function (policyName, policyType, statement) {
        return __awaiter(this, void 0, void 0, function () {
            var policyNameAvailable;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        policyNameAvailable = false;
                        return [4 /*yield*/, promise_retry_1.default(function (retry, times) { return __awaiter(_this, void 0, void 0, function () {
                                var onlinePolicyConfig, onlinePolicyDocument, ex_1, exCode;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 3, , 4]);
                                            this.logger.debug("Check plicy " + policyName + " exist start...");
                                            return [4 /*yield*/, this.ramClient.getPolicy({
                                                    PolicyType: policyType,
                                                    PolicyName: policyName,
                                                })];
                                        case 1:
                                            onlinePolicyConfig = _a.sent();
                                            this.logger.debug("On-line policy config: " + JSON.stringify(onlinePolicyConfig));
                                            onlinePolicyDocument = JSON.parse(onlinePolicyConfig.DefaultPolicyVersion.PolicyDocument);
                                            this.logger.debug("On-line default policy version document: " + JSON.stringify(onlinePolicyDocument));
                                            policyNameAvailable = true;
                                            this.logger.debug("Check plicy " + policyName + " exist.");
                                            if (!statement || lodash_1.default.isEqual(onlinePolicyDocument.Statement, statement)) {
                                                return [2 /*return*/];
                                            }
                                            return [4 /*yield*/, this.updatePolicy(policyName, statement)];
                                        case 2:
                                            _a.sent();
                                            return [3 /*break*/, 4];
                                        case 3:
                                            ex_1 = _a.sent();
                                            exCode = ex_1.code;
                                            if (exCode === 'EntityNotExist.Policy') {
                                                return [2 /*return*/];
                                            }
                                            else if (exCode === 'NoPermission') {
                                                throw ex_1;
                                            }
                                            this.logger.debug("Error when getPolicy, policyName is " + policyName + ", error is: " + ex_1);
                                            this.logger.info("Retrying policy: check policy not exist or ensure available, retry " + times + " time.");
                                            retry(ex_1);
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); }, constant_1.RETRYOPTIONS)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, policyNameAvailable];
                }
            });
        });
    };
    R.prototype.checkRoleNotExistOrEnsureAvailable = function (roleName, roleDocument) {
        return __awaiter(this, void 0, void 0, function () {
            var roleResponse, _a, Arn, AssumeRolePolicyDocument, ex_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.ramClient.getRole({ RoleName: roleName })];
                    case 1:
                        roleResponse = _b.sent();
                        this.logger.debug(roleName + " already exists.");
                        this.logger.debug("Get role " + roleName + " response: " + JSON.stringify(roleResponse));
                        _a = roleResponse.Role, Arn = _a.Arn, AssumeRolePolicyDocument = _a.AssumeRolePolicyDocument;
                        if (!(roleDocument && JSON.stringify(roleDocument) !== AssumeRolePolicyDocument)) return [3 /*break*/, 3];
                        this.logger.debug(roleName + " authorization policy is inconsistent with online.");
                        return [4 /*yield*/, this.updateRole(roleName, roleDocument)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/, Arn];
                    case 4:
                        ex_2 = _b.sent();
                        this.logger.debug("error when getRole: " + roleName + ", error is: " + ex_2);
                        if (ex_2.name !== 'EntityNotExist.RoleError') {
                            throw ex_2;
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    R.prototype.createPolicy = function (policyName, statement, description) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("Create plicy " + policyName + " start...");
                        this.logger.info("Creating plicy: " + policyName);
                        return [4 /*yield*/, promise_retry_1.default(function (retry, times) { return __awaiter(_this, void 0, void 0, function () {
                                var ex_3;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, this.ramClient.createPolicy({
                                                    PolicyName: policyName,
                                                    Description: description || '',
                                                    PolicyDocument: JSON.stringify({
                                                        Version: '1',
                                                        Statement: statement,
                                                    }),
                                                })];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            ex_3 = _a.sent();
                                            if (ex_3.code === 'NoPermission') {
                                                throw ex_3;
                                            }
                                            this.logger.debug("Error when createPolicy, policyName is " + policyName + ", error is: " + ex_3);
                                            this.logger.info("Retrying policy: create policy, retry " + times + " time.");
                                            retry(ex_3);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, constant_1.RETRYOPTIONS)];
                    case 1:
                        _a.sent();
                        this.logger.debug("Create plicy " + policyName + " success.");
                        return [2 /*return*/];
                }
            });
        });
    };
    R.prototype.createRole = function (name, roleDocument, description) {
        return __awaiter(this, void 0, void 0, function () {
            var role, ex_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.logger.info("Creating role: " + name);
                        return [4 /*yield*/, this.ramClient.createRole({
                                RoleName: name,
                                Description: description,
                                AssumeRolePolicyDocument: JSON.stringify(roleDocument),
                            })];
                    case 1:
                        role = _a.sent();
                        this.logger.debug("Get role " + name + " response: " + JSON.stringify(role));
                        this.logger.debug("Create role " + name + " success, arn is " + role.Role.Arn);
                        return [2 /*return*/, role.Role.Arn];
                    case 2:
                        ex_4 = _a.sent();
                        this.logger.debug("Error when createRole, roleName is " + name + ", error is: " + ex_4);
                        throw ex_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    R.prototype.updatePolicy = function (policyName, statement) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.info("Updating plicy: " + policyName);
                        return [4 /*yield*/, promise_retry_1.default(function (retry, times) { return __awaiter(_this, void 0, void 0, function () {
                                var listResponse, versions, ex_5;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 5, , 6]);
                                            return [4 /*yield*/, this.ramClient.listPolicyVersions({
                                                    PolicyType: 'Custom',
                                                    PolicyName: policyName,
                                                })];
                                        case 1:
                                            listResponse = _a.sent();
                                            this.logger.debug("Policy listPolicyVersions response: " + JSON.stringify(listResponse));
                                            versions = (listResponse.PolicyVersions || {}).PolicyVersion || [];
                                            if (!(versions.length >= 5)) return [3 /*break*/, 3];
                                            return [4 /*yield*/, this.deletePolicyVersion(policyName, versions, false)];
                                        case 2:
                                            _a.sent();
                                            _a.label = 3;
                                        case 3: return [4 /*yield*/, this.ramClient.createPolicyVersion({
                                                PolicyName: policyName,
                                                PolicyDocument: JSON.stringify({
                                                    Version: '1',
                                                    Statement: statement,
                                                }),
                                                SetAsDefault: true,
                                            })];
                                        case 4:
                                            _a.sent();
                                            return [3 /*break*/, 6];
                                        case 5:
                                            ex_5 = _a.sent();
                                            if (ex_5.code === 'NoPermission') {
                                                throw ex_5;
                                            }
                                            this.logger.debug("Error when updatePolicy, policyName is " + policyName + ", error is: " + ex_5);
                                            this.logger.info("Retrying plicy: update plicy, retry " + times + " time");
                                            retry(ex_5);
                                            return [3 /*break*/, 6];
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            }); }, constant_1.RETRYOPTIONS)];
                    case 1:
                        _a.sent();
                        this.logger.debug("Update plicy: " + policyName + " success.");
                        return [2 /*return*/];
                }
            });
        });
    };
    R.prototype.updateRole = function (name, roleDocument) {
        return __awaiter(this, void 0, void 0, function () {
            var role, ex_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.logger.info("Updating role: " + name);
                        return [4 /*yield*/, this.ramClient.updateRole({
                                RoleName: name,
                                NewAssumeRolePolicyDocument: JSON.stringify(roleDocument),
                            })];
                    case 1:
                        role = _a.sent();
                        this.logger.debug("Get role " + name + " response: " + JSON.stringify(role));
                        this.logger.debug("Update role " + name + " success, arn is " + role.Role.Arn);
                        return [2 /*return*/, role.Role.Arn];
                    case 2:
                        ex_6 = _a.sent();
                        this.logger.debug("Error when updateRole, roleName is " + name + ", error is: " + ex_6);
                        throw ex_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    R.prototype.deletePolicyVersion = function (policyName, versions, deleteAll) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("Delete policy " + policyName + " " + (deleteAll ? 'all' : 'single') + " version start...");
                        return [4 /*yield*/, promise_retry_1.default(function (retry, times) { return __awaiter(_this, void 0, void 0, function () {
                                var _i, versions_1, version, ex_7;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 5, , 6]);
                                            _i = 0, versions_1 = versions;
                                            _a.label = 1;
                                        case 1:
                                            if (!(_i < versions_1.length)) return [3 /*break*/, 4];
                                            version = versions_1[_i];
                                            if (!(version.IsDefaultVersion === false)) return [3 /*break*/, 3];
                                            this.logger.info("Removing policy version: " + version.VersionId);
                                            return [4 /*yield*/, this.ramClient.deletePolicyVersion({
                                                    PolicyName: policyName,
                                                    VersionId: version.VersionId,
                                                })];
                                        case 2:
                                            _a.sent();
                                            if (!deleteAll) {
                                                return [2 /*return*/];
                                            }
                                            _a.label = 3;
                                        case 3:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 4: return [3 /*break*/, 6];
                                        case 5:
                                            ex_7 = _a.sent();
                                            if (ex_7.code === 'NoPermission') {
                                                throw ex_7;
                                            }
                                            this.logger.debug("Error when deletePolicyVersion, policyName is " + policyName + ", error is: " + ex_7);
                                            this.logger.info("Retrying policy: delete policy version, retry " + times + " time.");
                                            retry(ex_7);
                                            return [3 /*break*/, 6];
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            }); }, constant_1.RETRYOPTIONS)];
                    case 1:
                        _a.sent();
                        this.logger.debug("Delete policy " + policyName + " " + (deleteAll ? 'all' : 'single') + " version success.");
                        return [2 /*return*/];
                }
            });
        });
    };
    R.prototype.mackPlicies = function (policies) {
        return __awaiter(this, void 0, void 0, function () {
            var policyNamesArray, _i, policies_1, policy, policyName, policyNameAvailable, name_1, statement, description, policyNameAvailable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        policyNamesArray = [];
                        _i = 0, policies_1 = policies;
                        _a.label = 1;
                    case 1:
                        if (!(_i < policies_1.length)) return [3 /*break*/, 9];
                        policy = policies_1[_i];
                        if (!lodash_1.default.isString(policy)) return [3 /*break*/, 4];
                        policyName = policy;
                        return [4 /*yield*/, this.checkPolicyNotExistOrEnsureAvailable(policyName, 'System')];
                    case 2:
                        policyNameAvailable = _a.sent();
                        if (policyNameAvailable) {
                            policyNamesArray.push({ name: policyName, type: 'System' });
                            return [3 /*break*/, 8];
                        }
                        return [4 /*yield*/, this.checkPolicyNotExistOrEnsureAvailable(policyName, 'Custom')];
                    case 3:
                        policyNameAvailable = _a.sent();
                        if (!policyNameAvailable) {
                            throw new Error("Check plicy " + policyName + " does not exist.");
                        }
                        policyNamesArray.push({ name: policyName, type: 'Custom' });
                        return [3 /*break*/, 8];
                    case 4:
                        name_1 = policy.name, statement = policy.statement, description = policy.description;
                        return [4 /*yield*/, this.checkPolicyNotExistOrEnsureAvailable(name_1, 'Custom', statement)];
                    case 5:
                        policyNameAvailable = _a.sent();
                        if (!!policyNameAvailable) return [3 /*break*/, 7];
                        this.logger.debug("Check plicy " + name_1 + " does not exist.");
                        return [4 /*yield*/, this.createPolicy(name_1, statement, description)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        policyNamesArray.push({ name: name_1, type: 'Custom' });
                        _a.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 1];
                    case 9: return [2 /*return*/, policyNamesArray];
                }
            });
        });
    };
    R.prototype.makeRole = function (_a) {
        var name = _a.name, service = _a.service, statement = _a.statement, description = _a.description;
        return __awaiter(this, void 0, void 0, function () {
            var roleDocument, arn;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        roleDocument = getStatement(service, statement);
                        return [4 /*yield*/, this.checkRoleNotExistOrEnsureAvailable(name, roleDocument)];
                    case 1:
                        arn = _b.sent();
                        if (!!arn) return [3 /*break*/, 3];
                        this.logger.info("Reminder role: Could not find " + name + ", create a new role.");
                        return [4 /*yield*/, this.createRole(name, roleDocument, description)];
                    case 2:
                        arn = _b.sent();
                        _b.label = 3;
                    case 3:
                        this.logger.debug(name + " arn is " + arn + ".");
                        return [2 /*return*/, arn];
                }
            });
        });
    };
    R.prototype.attachPolicysToRole = function (policyNamesArray, roleName) {
        return __awaiter(this, void 0, void 0, function () {
            var policies, _loop_1, _i, policyNamesArray_1, _a, name_2, type;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, promise_retry_1.default(function (retry, times) { return __awaiter(_this, void 0, void 0, function () {
                            var ex_8;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        this.logger.debug("Get list policies for " + roleName + " start...");
                                        return [4 /*yield*/, this.ramClient.listPoliciesForRole({
                                                RoleName: roleName,
                                            })];
                                    case 1:
                                        policies = _a.sent();
                                        this.logger.debug("Get list policies for " + roleName + " response: " + JSON.stringify(policies));
                                        return [3 /*break*/, 3];
                                    case 2:
                                        ex_8 = _a.sent();
                                        if (ex_8.code === 'NoPermission') {
                                            throw ex_8;
                                        }
                                        this.logger.debug("Error when listPoliciesForRole, roleName is " + roleName + ", error is: " + ex_8);
                                        this.logger.info("Retrying policy: list policies for role, retry " + times + " time.");
                                        retry(ex_8);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }, constant_1.RETRYOPTIONS)];
                    case 1:
                        _b.sent();
                        _loop_1 = function (name_2, type) {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, promise_retry_1.default(function (retry, times) { return __awaiter(_this, void 0, void 0, function () {
                                            var policy, ex_9;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        this.logger.debug("Attach policy(" + name_2 + ") to " + roleName + " start...");
                                                        _a.label = 1;
                                                    case 1:
                                                        _a.trys.push([1, 5, , 6]);
                                                        policy = policies.Policies.Policy.find(function (item) {
                                                            return lodash_1.default.toLower(item.PolicyName) === lodash_1.default.toLower(name_2);
                                                        });
                                                        if (!policy) return [3 /*break*/, 2];
                                                        this.logger.debug("Policy(" + name_2 + ") already exists in " + roleName + ", skip attach.");
                                                        return [3 /*break*/, 4];
                                                    case 2: return [4 /*yield*/, this.ramClient.attachPolicyToRole({
                                                            PolicyType: type,
                                                            PolicyName: name_2,
                                                            RoleName: roleName,
                                                        })];
                                                    case 3:
                                                        _a.sent();
                                                        this.logger.debug("Attach policy(" + name_2 + ") to " + roleName + " success.");
                                                        _a.label = 4;
                                                    case 4: return [3 /*break*/, 6];
                                                    case 5:
                                                        ex_9 = _a.sent();
                                                        if (ex_9.code === 'NoPermission') {
                                                            throw ex_9;
                                                        }
                                                        this.logger.debug("Error when attachPolicyToRole, roleName is " + roleName + ", policyName is " + name_2 + ", policyType is " + type + ", error is: " + ex_9);
                                                        this.logger.info("Retrying policy: attach policy to role, retry " + times + " time.");
                                                        retry(ex_9);
                                                        return [3 /*break*/, 6];
                                                    case 6: return [2 /*return*/];
                                                }
                                            });
                                        }); }, constant_1.RETRYOPTIONS)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, policyNamesArray_1 = policyNamesArray;
                        _b.label = 2;
                    case 2:
                        if (!(_i < policyNamesArray_1.length)) return [3 /*break*/, 5];
                        _a = policyNamesArray_1[_i], name_2 = _a.name, type = _a.type;
                        return [5 /*yield**/, _loop_1(name_2, type)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    R.prototype.deploy = function (propertie) {
        return __awaiter(this, void 0, void 0, function () {
            var arn, _a, policies, policyNamesArray;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.makeRole(propertie)];
                    case 1:
                        arn = _b.sent();
                        _a = propertie.policies, policies = _a === void 0 ? [] : _a;
                        this.logger.debug("Ram component policies config: " + policies);
                        return [4 /*yield*/, this.mackPlicies(policies)];
                    case 2:
                        policyNamesArray = _b.sent();
                        this.logger.debug("Ram component policies names: " + policyNamesArray);
                        this.logger.debug("Request attachPolicysToRole start...");
                        return [4 /*yield*/, this.attachPolicysToRole(policyNamesArray, propertie.name)];
                    case 3:
                        _b.sent();
                        this.logger.debug("Request attachPolicysToRole end.");
                        return [2 /*return*/, arn];
                }
            });
        });
    };
    R.prototype.deletePolicys = function (policies) {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_2, this_1, _i, policies_2, item;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _loop_2 = function (item) {
                            var policyName;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (lodash_1.default.isString(item)) {
                                            this_1.logger.warn(item + " is a reference resource, skip delete.");
                                            return [2 /*return*/, "continue"];
                                        }
                                        policyName = item.name;
                                        return [4 /*yield*/, promise_retry_1.default(function (retry, times) { return __awaiter(_this, void 0, void 0, function () {
                                                var listPolicyVersionResponse, versions, ex_10, exCode;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            _a.trys.push([0, 5, , 6]);
                                                            return [4 /*yield*/, this.ramClient.listPolicyVersions({
                                                                    PolicyType: 'Custom',
                                                                    PolicyName: policyName,
                                                                })];
                                                        case 1:
                                                            listPolicyVersionResponse = _a.sent();
                                                            this.logger.debug("Policy listPolicyVersions response: " + JSON.stringify(listPolicyVersionResponse));
                                                            versions = (listPolicyVersionResponse.PolicyVersions || {}).PolicyVersion || [];
                                                            return [4 /*yield*/, this.deletePolicyVersion(policyName, versions, true)];
                                                        case 2:
                                                            _a.sent();
                                                            return [4 /*yield*/, this.logger.info("Removing policy: " + policyName)];
                                                        case 3:
                                                            _a.sent();
                                                            return [4 /*yield*/, this.ramClient.deletePolicy({ PolicyName: policyName })];
                                                        case 4:
                                                            _a.sent();
                                                            return [3 /*break*/, 6];
                                                        case 5:
                                                            ex_10 = _a.sent();
                                                            exCode = ex_10.code;
                                                            if (exCode === 'NoPermission' || times > 5) {
                                                                throw ex_10;
                                                            }
                                                            else if (exCode === 'EntityNotExist.Policy') {
                                                                this.logger.debug("The policy does not exist: " + policyName);
                                                                return [2 /*return*/];
                                                            }
                                                            this.logger.debug("Error when deletePolicys, policyName is " + policyName + ", error is: " + ex_10);
                                                            this.logger.info("Retrying policy: delete policy, retry " + times + " time.");
                                                            retry(ex_10);
                                                            return [3 /*break*/, 6];
                                                        case 6: return [2 /*return*/];
                                                    }
                                                });
                                            }); }, constant_1.RETRYOPTIONS)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, policies_2 = policies;
                        _a.label = 1;
                    case 1:
                        if (!(_i < policies_2.length)) return [3 /*break*/, 4];
                        item = policies_2[_i];
                        return [5 /*yield**/, _loop_2(item)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    R.prototype.deleteRole = function (roleName) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // 先删除 DetachPolicy
                    return [4 /*yield*/, promise_retry_1.default(function (retry, times) { return __awaiter(_this, void 0, void 0, function () {
                            var policies, _i, _a, _b, PolicyType, PolicyName, ex_11, exCode;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _c.trys.push([0, 7, , 8]);
                                        return [4 /*yield*/, this.ramClient.listPoliciesForRole({
                                                RoleName: roleName,
                                            })];
                                    case 1:
                                        policies = _c.sent();
                                        _i = 0, _a = policies.Policies.Policy;
                                        _c.label = 2;
                                    case 2:
                                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                                        _b = _a[_i], PolicyType = _b.PolicyType, PolicyName = _b.PolicyName;
                                        return [4 /*yield*/, this.ramClient.detachPolicyFromRole({
                                                PolicyName: PolicyName,
                                                PolicyType: PolicyType,
                                                RoleName: roleName,
                                            })];
                                    case 3:
                                        _c.sent();
                                        _c.label = 4;
                                    case 4:
                                        _i++;
                                        return [3 /*break*/, 2];
                                    case 5:
                                        this.logger.info("Removing role: " + roleName);
                                        return [4 /*yield*/, this.ramClient.deleteRole({ RoleName: roleName })];
                                    case 6:
                                        _c.sent();
                                        this.logger.debug("Delete role " + roleName + " success.");
                                        return [3 /*break*/, 8];
                                    case 7:
                                        ex_11 = _c.sent();
                                        exCode = ex_11.code;
                                        if (exCode === 'NoPermission' || times > 5) {
                                            throw ex_11;
                                        }
                                        else if (exCode === 'EntityNotExist.Role') {
                                            this.logger.debug("The role not exists: " + roleName + ".");
                                            return [2 /*return*/];
                                        }
                                        this.logger.debug("Error when deleteRole, roleName is " + roleName + ", error is: " + ex_11);
                                        this.logger.info("Retrying role: delete role, retry " + times + " time.");
                                        retry(ex_11);
                                        return [3 /*break*/, 8];
                                    case 8: return [2 /*return*/];
                                }
                            });
                        }); }, constant_1.RETRYOPTIONS)];
                    case 1:
                        // 先删除 DetachPolicy
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        core_1.HLogger(constant_1.CONTEXT),
        __metadata("design:type", Object)
    ], R.prototype, "logger", void 0);
    return R;
}());
exports.default = R;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL3JhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUF5RDtBQUN6RCxrREFBdUI7QUFDdkIsc0RBQWdDO0FBQ2hDLGdFQUFrQztBQUNsQyx3Q0FBb0Q7QUFRcEQsSUFBTSxZQUFZLEdBQUcsVUFBQyxPQUFlLEVBQUUsU0FBYztJQUNuRCxJQUFJLFNBQVMsRUFBRTtRQUNiLE9BQU87WUFDTCxPQUFPLEVBQUUsR0FBRztZQUNaLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNELE9BQU87UUFDTCxTQUFTLEVBQUU7WUFDVDtnQkFDRSxNQUFNLEVBQUUsZ0JBQWdCO2dCQUN4QixNQUFNLEVBQUUsT0FBTztnQkFDZixTQUFTLEVBQUU7b0JBQ1QsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDO2lCQUNuQjthQUNGO1NBQ0Y7UUFDRCxPQUFPLEVBQUUsR0FBRztLQUNiLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRjtJQUlFLFdBQVksT0FBcUI7UUFDL0IsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRTtZQUN6QyxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUMzRDtRQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxhQUFHLENBQUM7WUFDdkIsV0FBVyxFQUFFLE9BQU8sQ0FBQyxXQUFXO1lBQ2hDLGVBQWUsRUFBRSxPQUFPLENBQUMsZUFBZTtZQUN4QyxhQUFhLEVBQUUsT0FBTyxDQUFDLGFBQWE7WUFDcEMsUUFBUSxFQUFFLDBCQUEwQjtZQUNwQyxJQUFJLEVBQUU7Z0JBQ0osT0FBTyxFQUFFLE9BQU8sR0FBRyxJQUFJO2FB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