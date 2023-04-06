import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { AtButton, AtDrawer, AtIcon } from "taro-ui";
import DrawerLogo from "../../../../assets/drawerLogo.png";
import Taro from "@tarojs/taro";
import "./index.scss";

const Index: React.FC<{
  onDrawerShow: () => Promise<void>;
  onClearHistory: () => Promise<void>;
  onTopicSelected: (topicId: string) => void;
  list: any[];
  onAddClick: () => void;
  topicId: string;
  isLoading: boolean;
}> = ({
  onDrawerShow,
  list,
  onAddClick,
  onClearHistory,
  onTopicSelected,
  topicId: selectedId,
  isLoading,
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [leftButtonAreaPos, setLeftButtonAreaPos] = useState<any>({});
  const [systemInfo, setSystemInfo] = useState<any>({});

  const handleDrawerOpen = () => {
    onDrawerShow().then(() => {
      setIsOpened(true);
    });
  };

  const handleDrawerClose = () => {
    setIsOpened(false);
  };

  const handleHistoryItemClick = (id) => {
    onTopicSelected(id);
    handleDrawerClose();
  };

  const handleClearHistoryClick = () => {
    onClearHistory().then(handleDrawerClose);
  };

  const handleAddClick = () => {
    if (isLoading) return;
    handleDrawerClose();
    onAddClick();
    onTopicSelected("");
  };

  const getLeftButtonAreaPosition = () => {
    const MenuButtonBoundingClientRect =
      Taro.getMenuButtonBoundingClientRect() ?? {};
    console.log("MenuButtonBoundingClientRect: ", MenuButtonBoundingClientRect);
    setLeftButtonAreaPos(MenuButtonBoundingClientRect);
  };

  const getNavbarHeight = () => {
    const res = Taro.getSystemInfoSync() ?? {};
    console.log("systemInfo: ", res);
    setSystemInfo(res);
  };

  useEffect(() => {
    getLeftButtonAreaPosition();
    getNavbarHeight();
  }, []);

  return (
    <>
      <View
        className="index"
        style={{
          height: systemInfo?.statusBarHeight
            ? systemInfo?.statusBarHeight + 50
            : 168,
        }}
      >
        <View
          className="left"
          style={{
            position: "absolute",
            left: systemInfo?.windowWidth - leftButtonAreaPos?.right,
            top: leftButtonAreaPos.top,
            width: leftButtonAreaPos.width,
            height: leftButtonAreaPos.height,
          }}
        >
          <View className="btn" onClick={handleDrawerOpen}>
            <AtIcon value="bullet-list" size="18" color="#fff" />
          </View>
          <View className="line"></View>
          <View className="btn" onClick={handleAddClick}>
            <AtIcon value="add" size="18" color="#fff" />
          </View>
        </View>
        <View className="nav-bar-title">
          <Text className="nav-bar-title-text">西南市政总院智能助手</Text>
        </View>
      </View>
      <AtDrawer show={isOpened} mask onClose={handleDrawerClose}>
        <View className="navbar-drawer">
          <View className="navbar-logo">
            <Image src={DrawerLogo} className="navbar-img"></Image>
          </View>
          <View className="navbar-drawer-header">
            <AtButton customStyle={{ width: 220 }} onClick={handleAddClick}>
              <AtIcon
                value="add"
                size="16"
                color="#fff"
                // customStyle={{ marginTop: -4 }}
              />
              <Text className="drawer-header-text">新话题</Text>
            </AtButton>
          </View>
          <ScrollView
            className="drawer-body"
            scrollY
            scrollWithAnimation
            enableBackToTop
            showScrollbar={false}
            lowerThreshold={100}
          >
            <View className="historyWrapper">
              {list?.map((item) => (
                <View
                  key={item.id}
                  className={`history-item ${
                    selectedId === item.topic_id ? "selected" : ""
                  }`}
                  onClick={() => handleHistoryItemClick(item.topic_id)}
                >
                  <AtIcon
                    value="message"
                    size="16"
                    color={selectedId === item.topic_id ? "#ff4423" : "#fff"}
                    customStyle={{ marginTop: 2 }}
                  />
                  <Text className="history-item-text">{item?.topic_name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
          <View className="drawer-footer">
            <AtButton
              className="drawer-footer-btn"
              onClick={handleClearHistoryClick}
              customStyle={{ width: 220 }}
            >
              <AtIcon
                value="trash"
                size="16"
                color="#fff"
                // customStyle={{ marginTop: -4 }}
              />
              <Text className="drawer-footer-text">清空对话</Text>
            </AtButton>
          </View>
        </View>
      </AtDrawer>
    </>
  );
};

export default Index;
