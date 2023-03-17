import { Component } from "react";
import Taro from "@tarojs/taro";
import "./app.scss";

class App extends Component {
  componentDidMount() {
    // 登录
    Taro.login({
      success: (res) => {
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    });
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children;
  }
}

export default App;
