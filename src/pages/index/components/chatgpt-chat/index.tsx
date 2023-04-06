import { View, Text, Image } from "@tarojs/components";
import Avatar from "../../../../assets/avatar.jpeg";
import Loading from "../../../../assets/loading.svg";
import { AtAvatar } from "taro-ui";

import "./index.scss";

const ChatgptChat = ({
  text,
  loading,
}: {
  text?: string;
  loading?: boolean;
}) => {
  return (
    <View className="chatgptChat">
      <View className="avatar">
        <AtAvatar image={Avatar} size="small" />
      </View>
      {loading ? (
        <Image
          src={Loading}
          style={{
            width: 80,
            height: 80,
            display: "inline-block",
            marginLeft: 12,
          }}
        ></Image>
      ) : (
        <Text className="chatgptChatContent">{text}</Text>
      )}
    </View>
  );
};

export default ChatgptChat;
