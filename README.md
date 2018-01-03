# react-playerMusic

技术栈 webpack + react + node + ES6

实现功能：
1.自动显示 歌曲海报、歌手名、歌曲名
2.显示播放器进度条
3.音乐播放暂停、上一曲、下一曲
4.实时显示播放时间倒计时、播放总长度
5.歌曲播放完后，自动切换下一曲
6.通过鼠标点击、拖住，设置歌曲播放进度、声音
7.歌曲列表点击歌曲名，播放对应歌曲
8.删除歌曲


初学react，这个简易音乐播放器虽然是跟着视频做的，不过还是踩了挺多坑，并且由于视频是比较早的，所以里面的一些技术有更改，不过对于react的编程思想还是很好理解的，放在这里就当做个纪念吧。

#####如何运行

开发启动
```
npm start
```
编译产品
```
npm run build
```
运行各阶段例子

修改webpack.config.js中entry

比如Router例子
```
entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    path.join(__dirname, 'app/router/index.js')
],
```
