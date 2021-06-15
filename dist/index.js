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
var constant_1 = require("./constant");
var stdout_formatter_1 = __importDefault(require("./common/stdout-formatter"));
var ram_1 = __importDefault(require("./utils/ram"));
var RamCompoent = /** @class */ (function () {
    function RamCompoent() {
    }
    RamCompoent.prototype.deploy = function (inputs) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var apts, commandData, credentials, properties, ram, arn;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // @ts-ignore
                        delete inputs.Credentials;
                        // @ts-ignore
                        delete inputs.credentials;
                        this.logger.debug('Create ram start...');
                        this.logger.debug("inputs params: " + JSON.stringify(inputs));
                        apts = { boolean: ['help'], alias: { help: 'h' } };
                        commandData = core_1.commandParse({ args: inputs.args }, apts);
                        this.logger.debug("Command data is: " + JSON.stringify(commandData));
                        if ((_a = commandData.data) === null || _a === void 0 ? void 0 : _a.help) {
                            core_1.help(constant_1.HELP);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, stdout_formatter_1.default.initStdout()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, core_1.getCredential(inputs.project.access)];
                    case 2:
                        credentials = _b.sent();
                        core_1.reportComponent(constant_1.CONTEXT_NAME, {
                            uid: credentials.AccountID,
                            command: 'deploy',
                        });
                        properties = inputs.props;
                        this.logger.debug("Properties values: " + JSON.stringify(properties) + ".");
                        if (properties.service && properties.statement) {
                            this.logger.warn(stdout_formatter_1.default.stdoutFormatter.warn('deploy', "The 'service' and 'statement' configurations exist at the same time, and the 'service' configuration is invalid and overwritten by the 'statement'"));
                        }
                        else if (!(properties.service || properties.statement)) {
                            throw new Error("'service' and 'statement' must have at least one configuration.");
                        }
                        ram = new ram_1.default(credentials);
                        return [4 /*yield*/, ram.deploy(properties)];
                    case 3:
                        arn = _b.sent();
                        this.logger.debug('Create ram success.');
                        return [2 /*return*/, arn];
                }
            });
        });
    };
    RamCompoent.prototype.delete = function (inputs) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var apts, commandData, credentials, properties, ram;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.logger.debug('Delete ram start...');
                        apts = { boolean: ['help'], alias: { help: 'h' } };
                        commandData = core_1.commandParse({ args: inputs.args }, apts);
                        this.logger.debug("Command data is: " + JSON.stringify(commandData));
                        if ((_a = commandData.data) === null || _a === void 0 ? void 0 : _a.help) {
                            core_1.help(constant_1.HELP);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, stdout_formatter_1.default.initStdout()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, core_1.getCredential(inputs.project.access)];
                    case 2:
                        credentials = _b.sent();
                        core_1.reportComponent(constant_1.CONTEXT_NAME, {
                            uid: credentials.AccountID,
                            command: 'delete',
                        });
                        properties = inputs.Properties;
                        this.logger.debug("Properties values: " + JSON.stringify(properties) + ".");
                        ram = new ram_1.default(credentials);
                        return [4 /*yield*/, ram.deleteRole(properties.name)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, ram.deletePolicys(properties.policies || [])];
                    case 4:
                        _b.sent();
                        this.logger.debug('Delete ram success.');
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        core_1.HLogger(constant_1.CONTEXT),
        __metadata("design:type", Object)
    ], RamCompoent.prototype, "logger", void 0);
    return RamCompoent;
}());
exports.default = RamCompoent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4Q0FBNkc7QUFFN0csdUNBQXlEO0FBQ3pELCtFQUF3RDtBQUV4RCxvREFBOEI7QUFFOUI7SUFBQTtJQXdFQSxDQUFDO0lBckVPLDRCQUFNLEdBQVosVUFBYSxNQUFlOzs7Ozs7O3dCQUMxQixhQUFhO3dCQUNiLE9BQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQzt3QkFDMUIsYUFBYTt3QkFDYixPQUFPLE1BQU0sQ0FBQyxXQUFXLENBQUM7d0JBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7d0JBQ3pDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFrQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBRyxDQUFDLENBQUM7d0JBRXhELElBQUksR0FBRyxFQUFFLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO3dCQUNuRCxXQUFXLEdBQVEsbUJBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ25FLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHNCQUFvQixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBRyxDQUFDLENBQUM7d0JBQ3JFLFVBQUksV0FBVyxDQUFDLElBQUksMENBQUUsSUFBSSxFQUFFOzRCQUMxQixXQUFJLENBQUMsZUFBSSxDQUFDLENBQUM7NEJBQ1gsc0JBQU87eUJBQ1I7d0JBQ0QscUJBQU0sMEJBQWUsQ0FBQyxVQUFVLEVBQUUsRUFBQTs7d0JBQWxDLFNBQWtDLENBQUM7d0JBRWYscUJBQU0sb0JBQWEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFBOzt3QkFBeEQsV0FBVyxHQUFHLFNBQTBDO3dCQUM5RCxzQkFBZSxDQUFDLHVCQUFZLEVBQUU7NEJBQzVCLEdBQUcsRUFBRSxXQUFXLENBQUMsU0FBUzs0QkFDMUIsT0FBTyxFQUFFLFFBQVE7eUJBQ2xCLENBQUMsQ0FBQzt3QkFFRyxVQUFVLEdBQWdCLE1BQU0sQ0FBQyxLQUFLLENBQUM7d0JBQzdDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHdCQUFzQixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFHLENBQUMsQ0FBQzt3QkFFdkUsSUFBSSxVQUFVLENBQUMsT0FBTyxJQUFJLFVBQVUsQ0FBQyxTQUFTLEVBQUU7NEJBQzlDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLDBCQUFlLENBQUMsZUFBZSxDQUFDLElBQUksQ0FDbkQsUUFBUSxFQUNSLG9KQUFvSixDQUFDLENBQ3RKLENBQUM7eUJBQ0g7NkJBQU0sSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUU7NEJBQ3hELE1BQU0sSUFBSSxLQUFLLENBQUMsaUVBQWlFLENBQUMsQ0FBQzt5QkFDcEY7d0JBRUssR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO3dCQUNyQixxQkFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFBOzt3QkFBbEMsR0FBRyxHQUFHLFNBQTRCO3dCQUV4QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO3dCQUN6QyxzQkFBTyxHQUFHLEVBQUM7Ozs7S0FDWjtJQUVLLDRCQUFNLEdBQVosVUFBYSxNQUFNOzs7Ozs7O3dCQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO3dCQUVuQyxJQUFJLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQzt3QkFDbkQsV0FBVyxHQUFRLG1CQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUNuRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxzQkFBb0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUcsQ0FBQyxDQUFDO3dCQUNyRSxVQUFJLFdBQVcsQ0FBQyxJQUFJLDBDQUFFLElBQUksRUFBRTs0QkFDMUIsV0FBSSxDQUFDLGVBQUksQ0FBQyxDQUFDOzRCQUNYLHNCQUFPO3lCQUNSO3dCQUNELHFCQUFNLDBCQUFlLENBQUMsVUFBVSxFQUFFLEVBQUE7O3dCQUFsQyxTQUFrQyxDQUFDO3dCQUVmLHFCQUFNLG9CQUFhLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBQTs7d0JBQXhELFdBQVcsR0FBRyxTQUEwQzt3QkFDOUQsc0JBQWUsQ0FBQyx1QkFBWSxFQUFFOzRCQUM1QixHQUFHLEVBQUUsV0FBVyxDQUFDLFNBQVM7NEJBQzFCLE9BQU8sRUFBRSxRQUFRO3lCQUNsQixDQUFDLENBQUM7d0JBRUcsVUFBVSxHQUFnQixNQUFNLENBQUMsVUFBVSxDQUFDO3dCQUNsRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyx3QkFBc0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBRyxDQUFDLENBQUM7d0JBRWpFLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQzt3QkFDakMscUJBQU0sR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUE7O3dCQUFyQyxTQUFxQyxDQUFDO3dCQUN0QyxxQkFBTSxHQUFHLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDLEVBQUE7O3dCQUFsRCxTQUFrRCxDQUFDO3dCQUVuRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDOzs7OztLQUMxQztJQXRFaUI7UUFBakIsY0FBTyxDQUFDLGtCQUFPLENBQUM7OytDQUFpQjtJQXVFcEMsa0JBQUM7Q0FBQSxBQXhFRCxJQXdFQztrQkF4RW9CLFdBQVcifQ==