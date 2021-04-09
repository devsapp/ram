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
                                            this.logger.info("retry " + times + " time");
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
                        this.logger.info(roleName + " already exists.");
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
                        this.logger.info("Create plicy " + policyName + " start...");
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
                                            this.logger.info("retry " + times + " time");
                                            retry(ex_3);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, constant_1.RETRYOPTIONS)];
                    case 1:
                        _a.sent();
                        this.logger.info("Create plicy " + policyName + " success.");
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
                        this.logger.info("Create role " + name + " start...");
                        return [4 /*yield*/, this.ramClient.createRole({
                                RoleName: name,
                                Description: description,
                                AssumeRolePolicyDocument: JSON.stringify(roleDocument),
                            })];
                    case 1:
                        role = _a.sent();
                        this.logger.debug("Get role " + name + " response: " + JSON.stringify(role));
                        this.logger.info("Create role " + name + " success, arn is " + role.Role.Arn);
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
                        this.logger.info("Update plicy " + policyName + " start...");
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
                                            this.logger.info("retry " + times + " time");
                                            retry(ex_5);
                                            return [3 /*break*/, 6];
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            }); }, constant_1.RETRYOPTIONS)];
                    case 1:
                        _a.sent();
                        this.logger.info("Update plicy " + policyName + " success.");
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
                        this.logger.info("Update role " + name + " start...");
                        return [4 /*yield*/, this.ramClient.updateRole({
                                RoleName: name,
                                NewAssumeRolePolicyDocument: JSON.stringify(roleDocument),
                            })];
                    case 1:
                        role = _a.sent();
                        this.logger.debug("Get role " + name + " response: " + JSON.stringify(role));
                        this.logger.info("Update role " + name + " success, arn is " + role.Role.Arn);
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
                                            this.logger.debug("Error when updatePolicy, policyName is " + policyName + ", error is: " + ex_7);
                                            this.logger.info("retry " + times + " time");
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
                        this.logger.info("No " + name + " is found, create a new role.");
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
                                        this.logger.info("retry " + times + " time");
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
                                                        this.logger.info("retry " + times + " time");
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
                                                            return [4 /*yield*/, this.logger.info("Delete policy " + policyName + " start...")];
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
                                                            this.logger.info("retry " + times + " time");
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
                                        this.logger.info("Delete role " + roleName + " start...");
                                        return [4 /*yield*/, this.ramClient.deleteRole({ RoleName: roleName })];
                                    case 6:
                                        _c.sent();
                                        this.logger.info("Delete role " + roleName + " success.");
                                        return [3 /*break*/, 8];
                                    case 7:
                                        ex_11 = _c.sent();
                                        exCode = ex_11.code;
                                        if (exCode === 'NoPermission' || times > 5) {
                                            throw ex_11;
                                        }
                                        else if (exCode === 'EntityNotExist.Role') {
                                            this.logger.info("The role not exists: " + roleName + ".");
                                            return [2 /*return*/];
                                        }
                                        this.logger.debug("Error when deleteRole, roleName is " + roleName + ", error is: " + ex_11);
                                        this.logger.info("retry " + times + " time");
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