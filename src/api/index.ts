import Taro from "@tarojs/taro";

// const agent = axios.create({
//   timeout: 60000,
//   baseURL: "",
//   withCredentials: true,
// });

const post = (url, params) => {
  return Taro.request({ url, method: "POST", data: params })
    .then((res) => console.log(res))
    .catch((err) => {
      console.log("err: ", err);
    });
};

export { post };
