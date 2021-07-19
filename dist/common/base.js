"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
// import Table from 'tty-table';
var lodash_get_1 = __importDefault(require("lodash.get"));
var core_1 = require("@serverless-devs/core");
var SINGLE_VARS = ['string', 'number', 'boolean', 'null', 'undefined'];
var BaseComponent = /** @class */ (function () {
    function BaseComponent(inputs) {
        this.inputs = inputs;
        var libBasePath = this.__getBasePath();
        var pkgPath = path_1.default.join(libBasePath, '..', 'package.json');
        if (pkgPath) {
            var pkg = JSON.parse(fs_1.default.readFileSync(path_1.default.join(pkgPath), 'utf8'));
            this.name = pkg.name;
        }
    }
    BaseComponent.prototype.__getBasePath = function () {
        if (this.basePath) {
            return this.basePath;
        }
        var baseName = path_1.default.basename(__dirname);
        if (baseName !== 'lib') {
            this.basePath = path_1.default.join(__dirname, '..');
        }
        else {
            this.basePath = __dirname;
        }
        return this.basePath;
    };
    BaseComponent.prototype.help = function (name) {
        var helpInfo = this.getEntityHelpInfoByName(name);
        core_1.help(helpInfo);
    };
    BaseComponent.prototype.__report = function (reportData) {
        if (process && process.send) {
            var name_1 = reportData.name, content = reportData.content;
            process.send({
                action: 'resource',
                data: {
                    name: name_1,
                    content: JSON.stringify(content),
                },
            });
            return content;
        }
    };
    BaseComponent.prototype.getEntityByName = function (entityName) {
        var docPath = path_1.default.join(__dirname, '../..', 'doc', 'doc.json');
        if (fs_1.default.existsSync(docPath)) {
            var fileContent = fs_1.default.readFileSync(docPath).toString();
            var result = JSON.parse(fileContent);
            var interfaces = lodash_get_1.default(result, 'children', []).filter(function (_a) {
                var name = _a.name;
                return name.includes('interface') || name.includes('command/') || name.includes('entity');
            });
            var fullInputParams_1 = {};
            interfaces.forEach(function (_interface) {
                var data = lodash_get_1.default(_interface, 'children', []).filter(function (item) { return item.name === entityName; })[0];
                if (data) {
                    fullInputParams_1 = data;
                }
            });
            return fullInputParams_1;
        }
    };
    BaseComponent.prototype.getEntityHelpInfoByName = function (name, simpleType) {
        var _this = this;
        if (simpleType === void 0) { simpleType = false; }
        var inputPropParams = this.getEntityByName(name);
        var content = lodash_get_1.default(inputPropParams, 'comment.shortText');
        var tags = lodash_get_1.default(inputPropParams, 'comment.tags', []);
        var preHelpItem = [];
        var afterHelpItem = [];
        var example = [];
        tags.forEach(function (item) {
            if (item.tag === 'example') {
                example.push(item);
            }
            if (item.tag === 'pre_help') {
                preHelpItem.push(item);
            }
            if (item.tag === 'after_help') {
                afterHelpItem.push(item);
            }
        });
        var paramsList = lodash_get_1.default(inputPropParams, 'children', []);
        var optionList = paramsList.map(function (item) {
            // const { name } = item;
            var description = lodash_get_1.default(item, 'comment.shortText');
            var tagData = lodash_get_1.default(item, 'comment.tags', []);
            var aliasTag = tagData.filter(function (tagItem) { return tagItem.tag === 'alias'; })[0] || {};
            var alias = aliasTag.text ? aliasTag.text.replace(/\n/g, '') : '';
            var defaultOption = lodash_get_1.default(item, 'flags.isOptional', false);
            var type = lodash_get_1.default(item, 'type.name');
            if (!SINGLE_VARS.includes(type)) {
                // const typeDetail = this.translateType(type);
                // type = `${type} <${typeDetail}> `;
                type = 'string';
            }
            if (alias) {
                return { name: item.name, typeLabel: type, description: description, alias: alias, defaultOption: defaultOption };
            }
            return { name: item.name, typeLabel: type, description: description, defaultOption: defaultOption };
        });
        var finalPreHelpData = preHelpItem.map(function (item) {
            if (item.text) {
                var jsonData = {};
                try {
                    jsonData = JSON.parse(item.text);
                    if (jsonData.ref) {
                        return _this.getEntityHelpInfoByName(jsonData.ref, true)[0];
                    }
                    return jsonData;
                }
                catch (e) {
                    return {
                        header: '',
                        context: item.text,
                    };
                }
            }
            return {};
        });
        var finalAfterHelpData = afterHelpItem.map(function (item) {
            if (item.text) {
                var jsonData = {};
                try {
                    jsonData = JSON.parse(item.text);
                    if (jsonData.ref) {
                        return _this.getEntityHelpInfoByName(jsonData.ref, true)[0];
                    }
                    return jsonData;
                }
                catch (e) {
                    return {
                        header: '',
                        context: item.text,
                    };
                }
            }
            return {};
        });
        var finalExampleData = example.map(function (item) {
            if (item.shortText) {
                return {
                    header: 'example',
                    content: item.shortText,
                };
            }
            if (item.text) {
                var jsonData = {};
                try {
                    jsonData = JSON.parse(item.text);
                    return jsonData;
                }
                catch (e) {
                    return {
                        header: 'example',
                        content: item.text,
                    };
                }
            }
            return {};
        });
        var finalOptionData = [];
        if (simpleType) {
            finalOptionData = [{
                    header: content,
                    optionList: optionList,
                }];
        }
        else {
            finalOptionData = [{
                    header: 'Usage',
                    content: content,
                }];
            if (optionList.length > 0) {
                finalOptionData.push({
                    header: 'Options',
                    optionList: optionList,
                });
            }
        }
        return __spreadArrays(finalPreHelpData, finalOptionData, finalAfterHelpData, finalExampleData);
    };
    return BaseComponent;
}());
exports.default = BaseComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tb24vYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSwwQ0FBb0I7QUFDcEIsOENBQXdCO0FBQ3hCLGlDQUFpQztBQUNqQywwREFBNkI7QUFDN0IsOENBQTZDO0FBRTdDLElBQU0sV0FBVyxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBRXpFO0lBSUUsdUJBQXNCLE1BQVc7UUFBWCxXQUFNLEdBQU4sTUFBTSxDQUFLO1FBQy9CLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN6QyxJQUFNLE9BQU8sR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDN0QsSUFBSSxPQUFPLEVBQUU7WUFDWCxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQUUsQ0FBQyxZQUFZLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztTQUN0QjtJQUNILENBQUM7SUFFRCxxQ0FBYSxHQUFiO1FBQ0UsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUN0QjtRQUNELElBQU0sUUFBUSxHQUFHLGNBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUMsSUFBSSxRQUFRLEtBQUssS0FBSyxFQUFFO1lBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDNUM7YUFBTTtZQUNMLElBQUksQ0FBQyxR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