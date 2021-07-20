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
var lodash_1 = require("lodash");
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
            var name_1 = reportData.name, content = reportData.content, access = reportData.access;
            process.send({
                action: 'resource',
                data: {
                    name: name_1,
                    access: access,
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
            var interfaces = lodash_1.get(result, 'children', []).filter(function (_a) {
                var name = _a.name;
                return name.includes('interface') || name.includes('command/') || name.includes('entity');
            });
            var fullInputParams_1 = {};
            interfaces.forEach(function (_interface) {
                var data = lodash_1.get(_interface, 'children', []).filter(function (item) { return item.name === entityName; })[0];
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
        var content = lodash_1.get(inputPropParams, 'comment.shortText');
        var tags = lodash_1.get(inputPropParams, 'comment.tags', []);
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
        var paramsList = lodash_1.get(inputPropParams, 'children', []);
        var optionList = paramsList.map(function (item) {
            // const { name } = item;
            var description = lodash_1.get(item, 'comment.shortText');
            var tagData = lodash_1.get(item, 'comment.tags', []);
            var aliasTag = tagData.filter(function (tagItem) { return tagItem.tag === 'alias'; })[0] || {};
            var alias = aliasTag.text ? aliasTag.text.replace(/\n/g, '') : '';
            var defaultOption = lodash_1.get(item, 'flags.isOptional', false);
            var type = lodash_1.get(item, 'type.name');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tb24vYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSwwQ0FBb0I7QUFDcEIsOENBQXdCO0FBQ3hCLGlDQUFpQztBQUNqQyxpQ0FBNkI7QUFDN0IsOENBQTZDO0FBRTdDLElBQU0sV0FBVyxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBRXpFO0lBSUUsdUJBQXNCLE1BQVc7UUFBWCxXQUFNLEdBQU4sTUFBTSxDQUFLO1FBQy9CLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN6QyxJQUFNLE9BQU8sR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDN0QsSUFBSSxPQUFPLEVBQUU7WUFDWCxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQUUsQ0FBQyxZQUFZLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztTQUN0QjtJQUNILENBQUM7SUFFRCxxQ0FBYSxHQUFiO1FBQ0UsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUN0QjtRQUNELElBQU0sUUFBUSxHQUFHLGNBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUMsSUFBSSxRQUFRLEtBQUssS0FBSyxFQUFFO1lBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDNUM7YUFBTTtZQUNMLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1NBQzNCO1FBQ0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFUyw0QkFBSSxHQUFkLFVBQWUsSUFBSTtRQUNqQixJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEQsV0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pCLENBQUM7SUFFUyxnQ0FBUSxHQUFsQixVQUFtQixVQUEyQztRQUM1RCxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO1lBQ25CLElBQUEsTUFBSSxHQUFzQixVQUFVLEtBQWhDLEVBQUUsT0FBTyxHQUFhLFVBQVUsUUFBdkIsRUFBRSxNQUFNLEdBQUssVUFBVSxPQUFmLENBQWdCO1lBQzdDLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0JBQ1gsTUFBTSxFQUFFLFVBQVU7Z0JBQ2xCLElBQUksRUFBRTtvQkFDSixJQUFJLFFBQUE7b0JBQ0osTUFBTSxRQUFBO29CQUNOLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztpQkFDakM7YUFDRixDQUFDLENBQUM7WUFDSCxPQUFPLE9BQU8sQ0FBQztTQUNoQjtJQUNILENBQUM7SUFFTyx1Q0FBZSxHQUF2QixVQUF3QixVQUFVO1FBQ2hDLElBQU0sT0FBTyxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDakUsSUFBSSxZQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzFCLElBQU0sV0FBVyxHQUFXLFlBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEUsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN2QyxJQUFNLFVBQVUsR0FBRyxZQUFHLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxFQUFRO29CQUFOLElBQUksVUFBQTtnQkFBTyxPQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztZQUFsRixDQUFrRixDQUFDLENBQUM7WUFDeEosSUFBSSxpQkFBZSxHQUFRLEVBQUUsQ0FBQztZQUM5QixVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUMsVUFBVTtnQkFDNUIsSUFBTSxJQUFJLEdBQUcsWUFBRyxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsSUFBSSxDQUFDLElBQUksS0FBSyxVQUFVLEVBQXhCLENBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0YsSUFBSSxJQUFJLEVBQUU7b0JBQ1IsaUJBQWUsR0FBRyxJQUFJLENBQUM7aUJBQ3hCO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDSCxPQUFPLGlCQUFlLENBQUM7U0FDeEI7SUFDSCxDQUFDO0lBRU8sK0NBQXVCLEdBQS9CLFVBQWdDLElBQUksRUFBRSxVQUFrQjtRQUF4RCxpQkFvSEM7UUFwSHFDLDJCQUFBLEVBQUEsa0JBQWtCO1FBQ3RELElBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkQsSUFBTSxPQUFPLEdBQUcsWUFBRyxDQUFDLGVBQWUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQzFELElBQU0sSUFBSSxHQUFHLFlBQUcsQ0FBQyxlQUFlLEVBQUUsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3RELElBQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUN2QixJQUFNLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDekIsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO1lBQ2hCLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxTQUFTLEVBQUU7Z0JBQzFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDcEI7WUFDRCxJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssVUFBVSxFQUFFO2dCQUMzQixXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3hCO1lBQ0QsSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLFlBQVksRUFBRTtnQkFDN0IsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMxQjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBTSxVQUFVLEdBQUcsWUFBRyxDQUFDLGVBQWUsRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDeEQsSUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUk7WUFDckMseUJBQXlCO1lBQ3pCLElBQU0sV0FBVyxHQUFHLFlBQUcsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUNuRCxJQUFNLE9BQU8sR0FBRyxZQUFHLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM5QyxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsT0FBTyxJQUFLLE9BQUEsT0FBTyxDQUFDLEdBQUcsS0FBSyxPQUFPLEVBQXZCLENBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDL0UsSUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDcEUsSUFBTSxhQUFhLEdBQUcsWUFBRyxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMzRCxJQUFJLElBQUksR0FBRyxZQUFHLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUMvQiwrQ0FBK0M7Z0JBQy9DLHFDQUFxQztnQkFDckMsSUFBSSxHQUFHLFFBQVEsQ0FBQzthQUNqQjtZQUNELElBQUksS0FBSyxFQUFFO2dCQUNULE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFdBQVcsYUFBQSxFQUFFLEtBQUssT0FBQSxFQUFFLGFBQWEsZUFBQSxFQUFFLENBQUM7YUFDaEY7WUFFRCxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxXQUFXLGFBQUEsRUFBRSxhQUFhLGVBQUEsRUFBRSxDQUFDO1FBQzFFLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBTSxnQkFBZ0IsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBSTtZQUM1QyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ2IsSUFBSSxRQUFRLEdBQVEsRUFBRSxDQUFDO2dCQUN2QixJQUFJO29CQUNGLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDakMsSUFBSSxRQUFRLENBQUMsR0FBRyxFQUFFO3dCQUNoQixPQUFPLEtBQUksQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUM1RDtvQkFDRCxPQUFPLFFBQVEsQ0FBQztpQkFDakI7Z0JBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ1YsT0FBTzt3QkFDTCxNQUFNLEVBQUUsRUFBRTt3QkFDVixPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUk7cUJBQ25CLENBQUM7aUJBQ0g7YUFDRjtZQUNELE9BQU8sRUFBRSxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFNLGtCQUFrQixHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFJO1lBQ2hELElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDYixJQUFJLFFBQVEsR0FBUSxFQUFFLENBQUM7Z0JBQ3ZCLElBQUk7b0JBQ0YsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNqQyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUU7d0JBQ2hCLE9BQU8sS0FBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQzVEO29CQUNELE9BQU8sUUFBUSxDQUFDO2lCQUNqQjtnQkFBQyxPQUFPLENBQUMsRUFBRTtvQkFDVixPQUFPO3dCQUNMLE1BQU0sRUFBRSxFQUFFO3dCQUNWLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSTtxQkFDbkIsQ0FBQztpQkFDSDthQUNGO1lBQ0QsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQztRQUNILElBQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUk7WUFDeEMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNsQixPQUFPO29CQUNMLE1BQU0sRUFBRSxTQUFTO29CQUNqQixPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVM7aUJBQ3hCLENBQUM7YUFDSDtZQUNELElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDYixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7Z0JBQ2xCLElBQUk7b0JBQ0YsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNqQyxPQUFPLFFBQVEsQ0FBQztpQkFDakI7Z0JBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ1YsT0FBTzt3QkFDTCxNQUFNLEVBQUUsU0FBUzt3QkFDakIsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJO3FCQUNuQixDQUFDO2lCQUNIO2FBQ0Y7WUFDRCxPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxlQUFlLEdBQUcsRUFBRSxDQUFDO1FBQ3pCLElBQUksVUFBVSxFQUFFO1lBQ2QsZUFBZSxHQUFHLENBQUM7b0JBQ2pCLE1BQU0sRUFBRSxPQUFPO29CQUNmLFVBQVUsWUFBQTtpQkFDWCxDQUFDLENBQUM7U0FDSjthQUFNO1lBQ0wsZUFBZSxHQUFHLENBQUM7b0JBQ2pCLE1BQU0sRUFBRSxPQUFPO29CQUNmLE9BQU8sU0FBQTtpQkFDUixDQUFDLENBQUM7WUFDSCxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN6QixlQUFlLENBQUMsSUFBSSxDQUFDO29CQUNuQixNQUFNLEVBQUUsU0FBUztvQkFDakIsVUFBVSxZQUFBO2lCQUNYLENBQUMsQ0FBQzthQUNKO1NBQ0Y7UUFFRCxzQkFBVyxnQkFBZ0IsRUFBSyxlQUFlLEVBQUssa0JBQWtCLEVBQUssZ0JBQWdCLEVBQUU7SUFDL0YsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQXBMRCxJQW9MQyJ9