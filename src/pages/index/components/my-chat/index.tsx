import React from "React";
import { View, Text, Image } from "@tarojs/components";
import Avatar from "../../../../assets/avatar.svg";
// import Avatar from "../../../../assets/avatar.jpeg";
import { AtAvatar } from "taro-ui";

import "./index.scss";

const MyChat = ({ text }: { text?: string }) => {
  return (
    <View className="myChat">
      <Text className="myChatContent">{text}</Text>
      <View className="avatar">
        <AtAvatar image={Avatar} size="small" circle />
      </View>
    </View>
  );
};

export default MyChat;
