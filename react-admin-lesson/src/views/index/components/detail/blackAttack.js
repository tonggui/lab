import React, { Component, Fragment } from "react";
import { Card, Image } from 'antd';
import {
    Player,
    ControlBar,
    PlayToggle, // PlayToggle 播放/暂停按钮 若需禁止加 disabled
    ReplayControl, // 后退按钮
    ForwardControl,  // 前进按钮
    CurrentTimeDisplay,
    TimeDivider,
    PlaybackRateMenuButton,  // 倍速播放选项
    VolumeMenuButton
} from 'video-react';
import "video-react/dist/video-react.css"; // import css
import "./detail.scss";

class BlackAttack extends Component {
    // this.player.subscribeToStateChange(this.handleStateChange.bind(this));
    // this.player.load();//  更改视频源并重新加载视频
    state = {
        videoUrl:import('../../../test.mp4'),
    }
    // handleStateChange = () => {
    //     this.setState({
    //         player: state,
    //         currentTime: state.currentTime,
    //         duration:state.duration,
    //     });
    // }

    render() {
        const {resultset,taskname,taskremark,time,type } = this.props.record
        return (
            <>
                <script src="http://html5media.googlecode.com/svn/trunk/src/html5media.min.js"></script>
                <section className="site-card-wrapper">
                    <Card title="黑盒任务" bordered={false}>
                        <p style={{fontWeight:"bold",fontSize:18}}>任务名称：深度伪造Detection through ensemble of CNNs算法迁移攻击安全评估</p>
                        <p>创建时间：{time}</p>
                        {/*<h1>攻击方式：{type}</h1>*/}
                        <p>备注：test</p>
                    </Card>
                    <Card title="算法结果" bordered={false}>
                        <p className='content-title2' >攻破结果图：</p>
                        <video width="620" height="450" controls style={{marginLeft:100}}>
                            <source src={require('../../../test.mp4')}/>
                            Your browser does not support the video tag
                        </video>
                    </Card>
                </section>
            </>
        );
    }
};


export default BlackAttack
