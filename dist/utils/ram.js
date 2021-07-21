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
/* eslint-disable no-await-in-loop */
var core_1 = require("@serverless-devs/core");
var lodash_1 = __importDefault(require("lodash"));
var ram_1 = __importDefault(require("@alicloud/ram"));
var promise_retry_1 = __importDefault(require("promise-retry"));
var constant_1 = require("../constant");
var stdout_formatter_1 = __importDefault(require("../common/stdout-formatter"));
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
        this.stdoutFormatter = stdout_formatter_1.default.stdoutFormatter;
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
                        this.logger.info(this.stdoutFormatter.check('plicy', policyName));
                        return [4 /*yield*/, promise_retry_1.default(function (rty, times) { return __awaiter(_this, void 0, void 0, function () {
                                var onlinePolicyConfig, onlinePolicyDocument, ex_1, exCode;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 3, , 4]);
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
                                            this.logger.info(this.stdoutFormatter.retry('policy', 'check policy not exist or ensure available', times));
                                            rty(ex_1);
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
                        this.logger.info(this.stdoutFormatter.check('role', roleName));
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
                        this.logger.info(this.stdoutFormatter.create('plicy', policyName));
                        return [4 /*yield*/, promise_retry_1.default(function (rty, times) { return __awaiter(_this, void 0, void 0, function () {
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
                                            this.logger.info(this.stdoutFormatter.retry('policy', 'create policy', times));
                                            rty(ex_3);
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
                        this.logger.info(this.stdoutFormatter.create('role', name));
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
                        this.logger.info(this.stdoutFormatter.update('plicy', policyName));
                        return [4 /*yield*/, promise_retry_1.default(function (rty, times) { return __awaiter(_this, void 0, void 0, function () {
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
                                            this.logger.info(this.stdoutFormatter.retry('plicy', 'update plicy', times));
                                            rty(ex_5);
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
                        this.logger.info(this.stdoutFormatter.update('role', name));
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
                        return [4 /*yield*/, promise_retry_1.default(function (rty, times) { return __awaiter(_this, void 0, void 0, function () {
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
                                            this.logger.info(this.stdoutFormatter.remove('policy version', version.VersionId));
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
                                            this.logger.info(this.stdoutFormatter.retry('policy', 'delete policy version', times));
                                            rty(ex_7);
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
                        this.logger.debug("Reminder role: Could not find " + name + ", create a new role");
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
            var policies, attachPolicys, _loop_1, _i, policyNamesArray_1, _a, name_2, type;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, promise_retry_1.default(function (rty, times) { return __awaiter(_this, void 0, void 0, function () {
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
                                        this.logger.info(this.stdoutFormatter.retry('policy', 'list policies for role', times));
                                        rty(ex_8);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }, constant_1.RETRYOPTIONS)];
                    case 1:
                        _b.sent();
                        attachPolicys = [];
                        _loop_1 = function (name_2, type) {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    // eslint-disable-next-line no-loop-func
                                    return [4 /*yield*/, promise_retry_1.default(function (rty, times) { return __awaiter(_this, void 0, void 0, function () {
                                            var policy, ex_9;
                                            var _a, _b;
                                            return __generator(this, function (_c) {
                                                switch (_c.label) {
                                                    case 0:
                                                        this.logger.debug("Attach policy(" + name_2 + ") to " + roleName + " start...");
                                                        _c.label = 1;
                                                    case 1:
                                                        _c.trys.push([1, 5, , 6]);
                                                        policy = (_b = (_a = policies === null || policies === void 0 ? void 0 : policies.Policies) === null || _a === void 0 ? void 0 : _a.Policy) === null || _b === void 0 ? void 0 : _b.find(function (item) {
                                                            return lodash_1.default.toLower(item.PolicyName) === lodash_1.default.toLower(name_2);
                                                        });
                                                        if (!(policy || attachPolicys.includes(name_2))) return [3 /*break*/, 2];
                                                        this.logger.debug("Policy(" + name_2 + ") already exists in " + roleName + ", skip attach.");
                                                        return [3 /*break*/, 4];
                                                    case 2: return [4 /*yield*/, this.ramClient.attachPolicyToRole({
                                                            PolicyType: type,
                                                            PolicyName: name_2,
                                                            RoleName: roleName,
                                                        })];
                                                    case 3:
                                                        _c.sent();
                                                        attachPolicys.push(name_2);
                                                        this.logger.debug("Attach policy(" + name_2 + ") to " + roleName + " success.");
                                                        _c.label = 4;
                                                    case 4: return [3 /*break*/, 6];
                                                    case 5:
                                                        ex_9 = _c.sent();
                                                        if (ex_9.code === 'NoPermission') {
                                                            throw ex_9;
                                                        }
                                                        this.logger.debug("Error when attachPolicyToRole, roleName is " + roleName + ", policyName is " + name_2 + ", policyType is " + type + ", error is: " + ex_9);
                                                        this.logger.info(this.stdoutFormatter.retry('policy', 'attach policy to role', times));
                                                        rty(ex_9);
                                                        return [3 /*break*/, 6];
                                                    case 6: return [2 /*return*/];
                                                }
                                            });
                                        }); }, constant_1.RETRYOPTIONS)];
                                    case 1:
                                        // eslint-disable-next-line no-loop-func
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
                        this.logger.debug('Request attachPolicysToRole start...');
                        return [4 /*yield*/, this.attachPolicysToRole(policyNamesArray, propertie.name)];
                    case 3:
                        _b.sent();
                        this.logger.debug('Request attachPolicysToRole end.');
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
                                            this_1.logger.warn(this_1.stdoutFormatter.warn('policy', item + " is the specified resource, skip delete."));
                                            return [2 /*return*/, "continue"];
                                        }
                                        policyName = item.name;
                                        return [4 /*yield*/, promise_retry_1.default(function (rty, times) { return __awaiter(_this, void 0, void 0, function () {
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
                                                            return [4 /*yield*/, this.logger.info(this.stdoutFormatter.remove('policy', policyName))];
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
                                                            this.logger.info(this.stdoutFormatter.retry('policy', 'delete policy', times));
                                                            rty(ex_10);
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
                    return [4 /*yield*/, promise_retry_1.default(function (rty, times) { return __awaiter(_this, void 0, void 0, function () {
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
                                        this.logger.info(this.stdoutFormatter.remove('role', roleName));
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
                                        this.logger.info(this.stdoutFormatter.retry('role', 'delete role', times));
                                        rty(ex_11);
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
    var _a;
    __decorate([
        core_1.HLogger(constant_1.CONTEXT),
        __metadata("design:type", typeof (_a = typeof core_1.ILogger !== "undefined" && core_1.ILogger) === "function" ? _a : Object)
    ], R.prototype, "logger", void 0);
    return R;
}());
exports.default = R;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL3JhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUFxQztBQUNyQyw4Q0FBeUQ7QUFDekQsa0RBQXVCO0FBQ3ZCLHNEQUFnQztBQUNoQyxnRUFBa0M7QUFDbEMsd0NBQW9EO0FBQ3BELGdGQUF5RDtBQVF6RCxJQUFNLFlBQVksR0FBRyxVQUFDLE9BQWUsRUFBRSxTQUFjO0lBQ25ELElBQUksU0FBUyxFQUFFO1FBQ2IsT0FBTztZQUNMLE9BQU8sRUFBRSxHQUFHO1lBQ1osU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ0QsT0FBTztRQUNMLFNBQVMsRUFBRTtZQUNUO2dCQUNFLE1BQU0sRUFBRSxnQkFBZ0I7Z0JBQ3hCLE1BQU0sRUFBRSxPQUFPO2dCQUNmLFNBQVMsRUFBRTtvQkFDVCxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUM7aUJBQ25CO2FBQ0Y7U0FDRjtRQUNELE9BQU8sRUFBRSxHQUFHO0tBQ2IsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVGO0lBS0UsV0FBWSxPQUFxQjtRQUZqQyxvQkFBZSxHQUFHLDBCQUFlLENBQUMsZUFBZSxDQUFDO1FBR2hELElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEVBQUU7WUFDekMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDM0Q7UUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksYUFBRyxDQUFDO1lBQ3ZCLFdBQVcsRUFBRSxPQUFPLENBQUMsV0FBVztZQUNoQyxlQUFlLEVBQUUsT0FBTyxDQUFDLGVBQWU7WUFDeEMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxhQUFhO1lBQ3BDLFFB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