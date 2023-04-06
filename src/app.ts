import { Component } from "react";
import Taro from "@tarojs/taro";
import "./app.scss";

class App extends Component {
  componentDidMount() {
    // 登录
    Taro.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        Taro.request({
          url: "https://www.changebox.cn/wechat_login",
          data: {
            code: res?.code,
          },
        }).then((res) => {
          console.log("res", res);
        });
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
