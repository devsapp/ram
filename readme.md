# 帮助文档

通过该组件，可以对RAM产品进行相关操作

## 参数

|  参数   |  必填  |  类型  | 取值  |  描述  |  备注  |    
|  ----  | ----  |  ----  | ----  |  ----  |  ----  |
| name  | true | string  | - | 角色名称  |  -  |
| description  | true | string  | - | 角色描述，仅第一次创建生效  |  -   |
| service  | true | string  | - |  角色授权主体，statement 配置后不生效， statement 和 service 必填其一  | -  |
| policies  | true | list  | - | 策略配置 | -  |

### policies

- string
- struct:

    |  参数   |  必填  |  类型  | 取值  |  描述  |  备注  |    
    |  ----  | ----  |  ----  | ----  |  ----  |  ----  |
    | name  | true | string  | - | 策略名  |  -  |
    | statement  | true | string  | - | 角色授权 statement，配置后不生效 service 不生效， statement 和 service 必填其一  |  -   |

### statement

|  参数   |  必填  |  类型  | 取值  |  描述  |  备注  |    
|  ----  | ----  |  ----  | ----  |  ----  |  ----  |
| Effect  | true | string  | - | Effect设置，同意或拒绝  |  -  |
| Action  | true | <string>list  | - | 行为，动作  |  -   |
| Resource  | true | string  | - | 资源  |  -  |


------- 

# 其它

组件开发者：项目编译

````
$ npm i

$ npm run build:ts && npm run package-zip
````
