import React from 'react';
import './progress.less';

let Progress = React.createClass({

    getDefaultProps(){
        return{
        	// 进度条颜色
            barColor:'orange',
			// 进度条的高度
			height:'0.5rem'
        }
    },
	// 改变进度条方法
	changeProgerss(e){
		// 获取点击进度条位置
		let progressBar = this.refs.progressBar;
		let progress = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth;
        // 点击进度条切换播放进度
        this.props.onChangeProgress && this.props.onChangeProgress(progress)
     },

	render(){
		return (
				<div className="components-progress" style={{height:this.props.height}} onClick={this.changeProgerss} ref="progressBar">
					<div className="progress" style={{width:`${this.props.progress}%`,backgroundColor:this.props.barColor}}></div>
				</div>
			);
	}
});

export default Progress;