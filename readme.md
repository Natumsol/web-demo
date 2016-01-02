# web-demo
搜集学习过程中编写的各种DEMO

## 1.JSON-Generator
用模板动态生成JSON测试数据。
### 语法说明 
#### {{bool()}}

返回一个随即布尔值。

#### {{date([min],[max])}

返回一个在min 和 max之间的随机日期字符串。如果没有参数，则返回当前日期字符串

#### {{range([counter])}

返回一个 1 到 counter之间的序列。默认返回[1]
#### {{guid()}}
返回一个随机GUID
#### {{objectId()}}
返回一个随机的objectID
#### {{floating([min],[max],[fixed]}}
返回一个大小在min #### max之间的随机浮点数，fixed用于指定小数的位数。
#### {{integer([min], [max])}}
返回一个大小在min #### max之间的随机整数。
#### {{phone())}}
返回一个随机手机号码（中国的）。
#### {{text(counter,[type])}}
返回一段字数为`counter`的随机文本，type为`zh`返回中文，`en`返回英文。
#### {{country()}}
返回一个随机的国家名（中文）
#### {{city()}}
返回一个随机的中国城市名称。
