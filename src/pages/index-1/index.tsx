import React, { useEffect, useState } from "react";
import { View, Text, Image, OpenData } from "@tarojs/components";
import { AtAvatar, AtButton } from "taro-ui";
import Taro from "@tarojs/taro";

import "./index.scss";
import "taro-ui/dist/style/index.scss";
import { post } from "../../api";

const Homepage = () => {
  const [userInfo, setUserInfo] = useState<any>({});

  const getUserInfo = () => {
    Taro.getUserInfo({}).then((res) => {
      console.log("res: ", res);
      setUserInfo(res);
    });
  };

  const goChatRoom = () => {
    Taro.navigateTo({ url: "/pages/chat-room/index" });
  };

  const goHistoryList = () => {};

  useEffect(() => {
    getUserInfo();
    // post("https://www.changebox.cn/wechat_login", {});
  }, []);

  return (
    <View className="index">
      <View className="title">
        您好, <OpenData type="userNickName" className="nickName" />
      </View>
      <Text className="desc">欢迎使用西南市政总院智能助手</Text>
      <View className="avatar">
        <AtAvatar
          openData={{ type: "userAvatarUrl" }}
          size="small"
          circle
          customStyle={{
            borderRadius: "100%",
            overflow: "hidden",
            width: 140,
            height: 140,
          }}
        />
      </View>
      <View className="buttonsWrap">
        <AtButton
          onClick={goChatRoom}
          type="primary"
          size="normal"
          className="button"
        >
          开始提问
        </AtButton>
        <AtButton
          onClick={goHistoryList}
          type="secondary"
          size="normal"
          className="button"
        >
          查看历史
        </AtButton>
      </View>
    </View>
  );
};

export default Homepage;
