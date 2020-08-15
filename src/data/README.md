### 结构
1. api 所有的接口发送 会进行入参出参的清洗 get/submit开头
2. repos 提供给外部使用的对于api的封装 fetch开头
3. client axios封装
4. constants 需要的固定变量
5. enums 各种状态的枚举
6. helper 清洗接口的函数
   1. convertFromServer：服务端数据洗成规定格式
   2. convertToServer：洗成服务端需要数据
7. interface 定义的各种实体的数据结构
8. services 面向上下文工作，解决高度重合交互数据场景下，数据来源不同的问题(避免过深的容器层和穿透式的数据配置)

