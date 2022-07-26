---
tags: [Vuex]
---
#### state

`state`里面的值的处理方式与 `computed`属性一样,依赖 `data`里面的值并且做缓存(也就是混入 `computer`)

```javascript
state:{
    userId:null
}

1. this.$store.state.[name]
2. import {mapState} from 'Vuex'
// 混入computed里面
computed:{
   // ...mapState(['name1'],['name2']...)
    ...mapState({
        name1:state=>state.name1,
        name2:state=>state.name2,
        ...
    })
}
```

#### getter

`getter`里面的值的处理方式与 `computed`属性一样,依赖 `data`里面的值并且做缓存(也就是混入 `computer`)

```javascript
getter:{
    setGender(state){
        const gender = {0:'保密',1:'男',2:'女'}
        return gender[1]
    }
}

1. this.$store.getters.[name]
2. import {mapGetters} from 'Vuex'
computed:{
    ...mapGetters(['setGender'])
}
```

#### mutations

- `commit` === 同步
- 第一个参数永远是 `state`
- 混入 `methods`

```javascript
mutations:{
    setUser(state,useId){
        state.useId = userId
    }
}

1. this.$store.commit('mutations里面的方法名',args)
2. import {mapMutations} from 'Vuex'
methods:{
    ...mapMutations('[setUser]')
    //传递参数在调用this.setUser(args)既可
    //this.setUser(args)映射成this.$store.commit('setUser',args)
}
```

#### action

- `dispatch` === 异步
- 通过调用 `mutations`里面的方法进行更改 `state`
- 混入 `methods`

```javascript
actions:{
    login({commit},val){
        commit('setUser',val)
    }
}

1. this.$store.dispatch('mutations里面的方法名',args)
2. import {mapActions} from 'Vuex'
methods:{
    ...mapActions(['login'])
    //传递参数在调用this.login(args)既可
    //this.login(args)映射成this.$store.dispatch('login',args)
    //对login重命名
    ...mapActions([LOGIN:'login'])
    this.LOGIN()

}

```
