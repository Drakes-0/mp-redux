mp-redux
========
Miniprogram bindings for Redux （在小程序中使用Redux）

小程序开发有时也会遇到复杂的业务场景，例如跨页面的数据传递，非父子组件的数据同步，多个子孙组件的数据复用等等，此时，`global data`或者`selectComponent`已经无法很好地提供支持，相反，它们会导致业务逻辑代码和模板代码迅速膨胀到难以维护，且容易产生难以追踪的bug隐患。

`redux`作为一个已经被熟知且广泛应用到`react`项目中的状态管理方案，可以很好地帮助我们解决此类问题。

## 使用

1.自行引用`redux`，如果你需要处理异步，可以自行引用`thunk`，`saga`或者`what ever`，这一步与你以往使用`redux`的web项目没有任何区别

2.将`dist`目录下的`mp-redux.js`文件拷贝出来，`mp-redux`提供了三个API

### `Provider`

> 为`App`注入创建好的`store`

```javascript
// app.js
import { createStore } from './lib/redux'
import reducer from './reducer/index'
import getInitialState from './getInitialState'
import { Provider } from './lib/mp-redux'

App(
    Provider(createStore(reducer, getInitialState()))({
        // ...app config
    })
)
```

### `connect`

> 绑定`store`到小程序页面

```javascript
import { add } from './actions'
import { connect } from '../lib/mp-redux'

const mapStateToProps = state => ({
    num: state.num
})

const mapDispatchToProps = {
    add
}

Page(
    connect(mapStateToProps,mapDispatchToProps)({
        // ...page config
        customClick() {
            this.add(1)
        }
    })
)
```

### `connectComponent`

> 绑定`store`到小程序自定义组件，用法与`connect`雷同，唯一的区别是一个用于绑定页面，一个用于绑定组件

```javascript
import { minus } from './actions'
import { connectComponent } from '../../lib/mp-redux'

const mapStateToProps = state => ({
    num: state.num
})

const mapDispatchToProps = {
    minus
}

Component(
    connectComponent(mapStateToProps,mapDispatchToProps)({
        // ...component config
        methods: {
            customClick() {
                this.minus(2)
            }
        }
    })
)
```

### 自定义监听`watch`

使用`react`的项目，我们在渲染函数中可以按需处理组件接收到的`props`，而在小程序中，逻辑层与视图层分离，且没有提供类`computed`的计算属性API，唯一的桥接在`setData`接口，这时如果需要自定义处理变更数据无疑是一件很麻烦的事，因此`mp-redux`提供了`watch`，一个可以帮助监听到`state`指定字段的变更并且将`setData`权限交还给开发者的接口。

```javascript
const mapStateToProps = state => ({
    num: state.num
})

Component(
    connectComponent(mapStateToProps)({
        // ...component config
        watch: {
            num(newVal, oldVal){  // 与绑定的state属性同名，当state.num发生变更时，会调用此函数，并传入新的值与旧的值
                this.setData({    // 注意，此时setData不会再自动触发，由开发者自行对数据处理后调用
                    num: newVal * 10
                })
            }
        }
    })
)
```

### 参考代码链接
https://developers.weixin.qq.com/s/oq1gBNmI713E