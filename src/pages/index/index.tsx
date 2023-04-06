import { useEffect, useState } from "react";
import { View, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { debounce } from "lodash";
import "./index.scss";
import { AtButton, AtInput, AtToast } from "taro-ui";
import { MyChat, ChatgptChat, NavBar } from "./components";

import "taro-ui/dist/style/index.scss";

enum Role {
  User = "user",
  System = "system",
}

interface IQaListItem {
  content?: string;
  role: Role;
}

const Chatroom = () => {
  const [userInfo, setUserInfo] = useState<any>({});
  const [qaList, setQaList] = useState<IQaListItem[]>([]);
  const [tempQuestion, setTempQuestion] = useState("");
  const [question, setQuestion] = useState("");
  const [topicId, setTopicId] = useState("");
  const [topicList, setTopicList] = useState<any[]>([]);
  const [footerPlaceholderId, setFooterPlaceholderId] = useState("footer-0");
  const [disableBtn, setDisableBtn] = useState(false);

  // const getUserInfo = () => {
  //   Taro.getUserInfo({}).then((res) => {
  //     console.log("res: ", res);
  //     setUserInfo(res);
  //   });
  // };

  const getTopicList = () => {
    return Taro.request({
      url: "https://www.changebox.cn/get_all_topic",
      method: "POST",
      data: {
        user_id: userInfo?.user_id,
      },
    }).then((res) => {
      if (res?.data?.return_code === 0) {
        console.log(res);
        setTopicList(res?.data?.topic_list);
      }
    });
  };

  const handleClearHistory = () => {
    return Taro.request({
      url: "https://www.changebox.cn/delete_topic",
      method: "POST",
      data: {
        user_id: userInfo?.user_id,
      },
    }).then((res) => {
      if (res?.data?.return_code === 0) {
        setTopicList([]);
        setQaList([]);
        setTopicId("");
      }
    });
  };

  const handleLogin = () => {
    Taro.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        Taro.request({
          url: "https://www.changebox.cn/wechat_login",
          data: {
            code: res?.code,
          },
        }).then((res) => {
          console.log("userInfo: ", res);
          if (res?.data?.return_code === 0) {
            setUserInfo(res?.data);
          }
        });
      },
    });
  };

  const handleInputChange = (val) => {
    console.log("input val: ", val);
    setQuestion(val);
  };

  const getHistory = () => {
    Taro.request({
      url: "https://www.changebox.cn/get_history",
      method: "POST",
      data: {
        user_id: userInfo?.user_id,
        topic_id: topicId,
        topic_name: "",
        question,
      },
    }).then((res) => {
      if (res?.data?.return_code === 0) {
        setTempQuestion("");
        setQaList(res?.data?.conv_list);
      }
    });
  };

  const handleSend = () => {
    if (question.length < 1) return;
    setTempQuestion(question);
    setQuestion("");
    setDisableBtn(true);

    Taro.request({
      url: "https://www.changebox.cn/get_answer",
      method: "POST",
      data: {
        user_id: userInfo?.user_id,
        topic_id: topicId,
        topic_name: "",
        question,
      },
    }).then((res) => {
      console.log("answer: ", res);
      if (res?.data?.return_code === 0) {
        const temp = question;
        const idx = Number(footerPlaceholderId.split("-")[1]);
        setTempQuestion("");
        setTopicId(res?.data?.topic_id);
        setQaList([
          ...qaList,
          {
            content: temp,
            role: Role.User,
          },
          {
            role: Role.System,
            content: res?.data?.answer,
          },
        ]);
        setFooterPlaceholderId(`footer-${idx + 1}`);
        setDisableBtn(false);
      } else {
        // AtToast.setTempQuestion("");
        setTempQuestion("");
        setDisableBtn(false);
      }
    });

    // setTimeout(() => {
    //   const temp = question;
    //   const idx = Number(footerPlaceholderId.split("-")[1]);
    //   setTempQuestion("");
    //   setQaList([
    //     ...qaList,
    //     {
    //       question: temp,
    //       answer: new Array(Math.floor(Math.random() * 10) + 1)
    //         .fill("我是答案")
    //         .join(""),
    //     },
    //   ]);
    //   setFooterPlaceholderId(`footer-${idx + 1}`);
    //   setDisableBtn(false);
    // }, 2000);
    const footIdx = Number(footerPlaceholderId.split("-")[1]);
    setFooterPlaceholderId(`footer-${footIdx + 1}`);
  };

  useEffect(() => {
    // getUserInfo();
    handleLogin();
  }, []);

  useEffect(() => {
    if (!topicId) return;
    getHistory();
  }, [topicId]);

  return (
    <View className="chatroom">
      <NavBar
        onDrawerShow={() => {
          if (disableBtn) {
            return Promise.reject();
          } else {
            return getTopicList();
          }
        }}
        list={topicList}
        onTopicSelected={(topicId) => setTopicId(topicId)}
        onClearHistory={handleClearHistory}
        onAddClick={() => setQaList([])}
        topicId={topicId}
        isLoading={disableBtn}
      />
      <ScrollView
        className="content"
        scrollY
        scrollWithAnimation
        enableBackToTop
        lowerThreshold={100}
        scrollIntoView={footerPlaceholderId}
      >
        {qaList?.map((item) => (
          <>
            {item?.role === Role.User && <MyChat text={item?.content} />}
            {item?.role === Role.System && <ChatgptChat text={item?.content} />}
          </>
        ))}
        {tempQuestion && (
          <>
            <MyChat text={tempQuestion} />
            <ChatgptChat loading />
          </>
        )}
        <View id={`${footerPlaceholderId}`} />
      </ScrollView>
      <View className="footer">
        <AtInput
          type="text"
          className="questionInput"
          placeholder="您可以向AI提出任何问题"
          onChange={handleInputChange}
          controlled
          name="questionInput"
          value={question}
          placeholderClass="questionInputPlaceholder"
          disabled={disableBtn}
          adjustPosition
        />
        <AtButton
          type="primary"
          size="small"
          onClick={handleSend}
          disabled={disableBtn}
        >
          发送
        </AtButton>
      </View>
    </View>
  );
};

export default Chatroom;
