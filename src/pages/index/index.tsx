import React, { useEffect, useState } from "react";
import { View, Text, Image, OpenData } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";

const Homepage = () => {
  const [userInfo, setUserInfo] = useState<any>({});

  const getUserInfo = () => {
    Taro.getUserInfo({}).then((res) => {
      console.log("res: ", res);
      setUserInfo(res);
    });
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <View className="index">
      <Text>Hello world12!</Text>
      <OpenData type="userAvatarUrl" />
      <OpenData type="userNickName" />
      <Image
        // style="width: 300px;height: 100px;background: #fff;"
        src={userInfo?.userInfo?.avatarUrl}
      />
    </View>
  );
};

export default Homepage;
