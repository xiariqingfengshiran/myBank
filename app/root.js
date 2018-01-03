import React from 'react';
import Header from './components/header';
import Player from './page/player';
import MusicList from './page/musicList';
import {MUSIC_LIST} from './config/musicList';
import {Router, Link, IndexRoute, Route, HashHistory} from 'react-router'
import Pubsub from 'pubsub-js'

let App = React.createClass({
    getInitialState() {
        return {
            musicList: MUSIC_LIST,
            currentMusicItem: MUSIC_LIST[0],
            randomPlay: false,
            // newIndex:null,
        }
    },
    // 音乐播放
    playMusic(musicItem) {
        let that = this;
        // let time1 = setInterval(function(){
            $('#player').jPlayer('setMedia', {
                mp3: musicItem.file
            }).jPlayer('play');
            // 数据同步
            that.setState({
                currentMusicItem: musicItem
            })
            
        // },150);
        // let time2 = setTimeout(function(){
        //         clearInterval(time1);
        //         clearTimeout(time2);
        // },150)
        
    },
    // 上/下一曲
    playNext(type = 'next') {
        // 当前播放歌曲下标
        let index = this.findMusicIndex(this.state.currentMusicItem);
        // 即将播放歌曲下标
        let newIndex = null;
        // 歌单长度
        let musicListLength = this.state.musicList.length;

        if (type === 'next') {
            // 下一曲
            this.state.newIndex = (index + 1) % musicListLength;
            // this.setState({
            //     newIndex : (index + 1) % musicListLength
            // })
        } else {
            // 上一曲
            this.state.newIndex = (index - 1 + musicListLength) % musicListLength;
            // this.setState({
            //     newIndex : (index - 1 + musicListLength) % musicListLength
            // })
        }
        // 调用音乐播放方法
        this.playMusic(this.state.musicList[this.state.newIndex])

    },

    findMusicIndex(musicItem) {
        return this.state.musicList.indexOf(musicItem);
    },

    endPlayMusic(musicItem){
        $('#player').bind($.jPlayer.event.ended, (e) => {
            this.playMusic(musicItem)
        });
    },

    // 单曲循环
    singleCycle() {
        let index = this.findMusicIndex(this.state.currentMusicItem);
        // console.log("index---",index)
        // console.log("newIndex---",this.state.newIndex)
        // 
        // this.state.newIndex = this.state.newIndex ? this.state.newIndex : index;
        this.endPlayMusic(this.state.musicList[index])
    },

    // 随机播放
    playRandom() {
        // console.log('随机播放--', target);
        // 歌单长度
        // let musicListLength = this.state.musicList.length;
        // if (target === 'target') {
        //     console.log('111');
        //     let index = parseInt(Math.random() * musicListLength);

        //     this.playMusic(this.state.musicList[index]);
        // } else {
        //     console.log('222');
            // 调用音乐播放方法
            $('#player').bind($.jPlayer.event.ended, (e) => {
                let index = parseInt(Math.random() * musicListLength);
                this.playMusic(this.state.musicList[index]);
            });
        // }

    },
    // 循环方式
    playCycle(cycleStyle) {
        switch (cycleStyle) {

            // 单曲循环
            case 0:
                this.singleCycle();
                break;
            // 随机播放
            case 1:
                this.playRandom();
                break;
            // 顺序播放
            case 2:
                this.playMusic(this.state.currentMusicItem);
                break;
        }
    },
    componentDidMount() {
        $('#player').jPlayer({
            supplied: 'mp3',
            wmode: 'window'
        });

        this.playMusic(this.state.currentMusicItem);

        $('#player').bind($.jPlayer.event.ended, (e) => {
            this.playNext();
        });

        // 播放
        Pubsub.subscribe('PLAY_MUSIC', (msg, musicItem) => {
            this.playMusic(musicItem);
        });
        // 删除
        Pubsub.subscribe('DELETE_MUSIC', (msg, musicItem) => {
            // if (this.state.currentMusicItem === musicItem) {
            //     this.playNext();
            // }
            this.setState({
                musicList: this.state.musicList.filter(item => {
                    return item !== musicItem;
                })
            });
        });
        // 上一曲
        Pubsub.subscribe('PLAY_PREV', (msg, musicItem) => {
            this.state.randomPlay ? this.playRandom('target') : this.playNext('prev');

        });
        // 下一曲
        Pubsub.subscribe('PLAY_NEXT', (msg, musicItem) => {
            this.state.randomPlay ? this.playRandom('target') : this.playNext('prev');
        });

        // 循环方式
        Pubsub.subscribe('PLAY_CYCLE', (msg, cycleStyle) => {
            // console.log("cycleStyle--", cycleStyle);
            this.playCycle(cycleStyle);
        });
    },

    componentWillUnMont() {
        // 解绑
        Pubsub.unsubscribe('PLAY_MUSIC');
        Pubsub.unsubscribe('DELETE_MUSIC');
        Pubsub.unsubscribe('PLAY_PREV');
        Pubsub.unsubscribe('PLAY_NEXT');
        Pubsub.unsubscribe('PLAY_CYCLE');
        $('#player').unbind($.jPlayer.event.ended);
    },

    render() {
        return (
            <div>
                <Header/>
                {React.cloneElement(this.props.children, this.state)}
            </div>
        )
    }
});

let Root = React.createClass({
    render() {
        return (
            <Router history={HashHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={Player}></IndexRoute>
                    <Route path='/list' component={MusicList}></Route>
                </Route>
            </Router>
        )
    }
});

export default Root;