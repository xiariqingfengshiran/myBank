import React from 'react';
import Progress from '../components/progress';
import './player.less';
import { Link } from 'react-router';
import Pubsub from 'pubsub-js'

// 歌曲总时长
let duration = null;
let Player = React.createClass({
    getInitialState(){
        return{
            //进度条初始状态
            progress:0,
            // 声音
            voice:0,
            // 播放状态
            isPlay:true,
            // 歌曲播放时间
            leftTime:'',
            // 循环方式
            cycleStyle:2,
        }
    },

    componentDidMount(){
        // 进度条绑定歌曲播放进度
        $('#player').bind($.jPlayer.event.timeupdate,(e) => {
            // 获取歌曲总时长
            duration = e.jPlayer.status.duration;

            this.setState({
                voice:e.jPlayer.options.volume * 100 ,
                progress:e.jPlayer.status.currentPercentAbsolute,
                leftTime:this.formaTime(duration * (1 - e.jPlayer.status.currentPercentAbsolute / 100))
            });
        })
    },
    // 格式化时间
    formaTime(time){
        let min = Math.floor(time / 60);
        let sec = Math.floor(time % 60);
        sec = sec<10 ? `0${sec}` : sec;
        return `${min}:${sec}`;
    },

    // 解绑
    componentWillUnMont(){
        $('#player').unbind($.jPlayer.event.timeupdate);
    },
    // 点击进度条设置播放进度
    progressChangeHandler(progress){
        $('#player').jPlayer('play', duration * progress);
        this.setState({
            isPlay:true
        })
    },
    // 设置声音大小
    progressChangeVoice(progress){
        $('#player').jPlayer('volume',progress)
    },

    // 播放按钮
    play(){
        if(this.state.isPlay)
            $('#player').jPlayer('pause');
        else
            $('#player').jPlayer('play');

        this.setState({
            isPlay:!this.state.isPlay
        })
    },
    // 上一曲
    playPrev(){
        Pubsub.publish('PLAY_PREV')
    },
    // 下一曲
    playNext(){
        Pubsub.publish('PLAY_NEXT')
    },
    // 循环方式
    playCycle(){
        if(this.state.cycleStyle < 2){
            this.setState({
                cycleStyle:this.state.cycleStyle + 1
            });
        }else if(this.state.cycleStyle === 2){
            this.setState({
                cycleStyle:0
            });
        }

        Pubsub.publish('PLAY_CYCLE',this.state.cycleStyle);
        switch (this.state.cycleStyle){
            case 0:
                $('.-col-auto i').addClass('repeat-once').removeClass('repeat-cycle');
                break;
            case 1:
                $('.-col-auto i').addClass('repeat-random').removeClass('repeat-once');
                break;
            case 2:
                $('.-col-auto i').addClass('repeat-cycle').removeClass('repeat-random');
                break;
        }


    },

    render(){
        return(
            <div className="player-page">
                <h1 className="caption" style={{cursor: 'pointer'}}><Link to="/list">我的私人音乐坊&gt;</Link></h1>
                <div className="controll-wrapper">
                    <h2 className="music-title">{this.props.currentMusicItem.title}</h2>
                    <h3 className="music-artist mt10">{this.props.currentMusicItem.artist}</h3>
                    <div className="row mt20">
                        <div className="left-time -col-auto">-{this.state.leftTime}</div>
                        <div className="volume-container">
                            <i className="icon-volume rt" style={{top: 5, left: -5}}></i>
                            <div className="volume-wrapper">
                                <Progress
                                    progress={this.state.voice}
                                    onChangeProgress={this.progressChangeVoice}
                                    barColor='#aaa'
                                    height='0.2rem'
                                ></Progress>
                            </div>
                            <div style={{height: 10, lineHeight: '10px',marginTop:'1rem'}}>
                                <Progress
                                    progress={this.state.progress}
                                    onChangeProgress={this.progressChangeHandler}
                                ></Progress>
                            </div>
                            <div className="mt35 row">
                                <div>
                                    <i className="icon prev" onClick={this.playPrev}></i>
                                    <i className={`icon ml20 ${this.state.isPlay ? 'pause' : 'play'}`} onClick={this.play}></i>
                                    <i className="icon next ml20" onClick={this.playNext}></i>
                                </div>
                                <div className="-col-auto">
                                    <i className="icon repeat-cycle" onClick={this.playCycle}></i>
                                </div>
                            </div>
                        </div>
                        <div className="-col-auto cover">
                            <img src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.title}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

export default Player;