"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var base_1 = __importDefault(require("./common/base"));
var RamCompoent = /** @class */ (function (_super) {
    __extends(RamCompoent, _super);
    function RamCompoent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RamCompoent.prototype.deploy = function (inputs) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var apts, commandData, credentials, _c, properties, ram, arn;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.logger.debug('Create ram start...');
                        this.logger.debug("inputs.props: " + JSON.stringify(inputs.props));
                        apts = { boolean: ['help'], alias: { help: 'h' } };
                        commandData = core_1.commandParse({ args: inputs.args }, apts);
                        this.logger.debug("Command data is: " + JSON.stringify(commandData));
                        if ((_a = commandData.data) === null || _a === void 0 ? void 0 : _a.help) {
                            core_1.help(constant_1.HELP);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, stdout_formatter_1.default.initStdout()];
                    case 1:
                        _d.sent();
                        _c = inputs.credentials;
                        if (_c) return [3 /*break*/, 3];
                        return [4 /*yield*/, core_1.getCredential((_b = inputs.project) === null || _b === void 0 ? void 0 : _b.access)];
                    case 2:
                        _c = (_d.sent());
                        _d.label = 3;
                    case 3:
                        credentials = _c;
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
                    case 4:
                        arn = _d.sent();
                        _super.prototype.__report.call(this, { name: 'ram', content: { arn: arn, role: properties.name } });
                        this.logger.debug('Create ram success.');
                        return [2 /*return*/, arn];
                }
            });
        });
    };
    RamCompoent.prototype.delete = function (inputs) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var apts, commandData, credentials, _c, properties, ram;
            return __generator(this, function (_d) {
                switch (_d.label) {
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
                        _d.sent();
                        _c = inputs.credentials;
                        if (_c) return [3 /*break*/, 3];
                        return [4 /*yield*/, core_1.getCredential((_b = inputs.project) === null || _b === void 0 ? void 0 : _b.access)];
                    case 2:
                        _c = (_d.sent());
                        _d.label = 3;
                    case 3:
                        credentials = _c;
                        core_1.reportComponent(constant_1.CONTEXT_NAME, {
                            uid: credentials.AccountID,
                            command: 'delete',
                        });
                        properties = inputs.Properties;
                        this.logger.debug("Properties values: " + JSON.stringify(properties) + ".");
                        ram = new ram_1.default(credentials);
                        return [4 /*yield*/, ram.deleteRole(properties.name)];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, ram.deletePolicys(properties.policies || [])];
                    case 5:
                        _d.sent();
                        _super.prototype.__report.call(this, { name: 'ram', content: { arn: '', role: '' } });
                        this.logger.debug('Delete ram success.');
                        return [2 /*return*/];
                }
            });
        });
    };
    var _a;
    __decorate([
        core_1.HLogger(constant_1.CONTEXT),
        __metadata("design:type", typeof (_a = typeof core_1.ILogger !== "undefined" && core_1.ILogger) === "function" ? _a : Object)
    ], RamCompoent.prototype, "logger", void 0);
    return RamCompoent;
}(base_1.default));
exports.default = RamCompoent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOENBQTZHO0FBQzdHLHVDQUF5RDtBQUN6RCwrRUFBd0Q7QUFFeEQsb0RBQThCO0FBQzlCLHVEQUFpQztBQUVqQztJQUF5QywrQkFBSTtJQUE3Qzs7SUFzRUEsQ0FBQztJQW5FTyw0QkFBTSxHQUFaLFVBQWEsTUFBZTs7Ozs7Ozt3QkFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQzt3QkFDekMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsbUJBQWlCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBRyxDQUFDLENBQUM7d0JBRTdELElBQUksR0FBRyxFQUFFLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO3dCQUNuRCxXQUFXLEdBQVEsbUJBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ25FLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHNCQUFvQixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBRyxDQUFDLENBQUM7d0JBQ3JFLFVBQUksV0FBVyxDQUFDLElBQUksMENBQUUsSUFBSSxFQUFFOzRCQUMxQixXQUFJLENBQUMsZUFBSSxDQUFDLENBQUM7NEJBQ1gsc0JBQU87eUJBQ1I7d0JBQ0QscUJBQU0sMEJBQWUsQ0FBQyxVQUFVLEVBQUUsRUFBQTs7d0JBQWxDLFNBQWtDLENBQUM7d0JBRWYsS0FBQSxNQUFNLENBQUMsV0FBVyxDQUFBO2dDQUFsQix3QkFB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