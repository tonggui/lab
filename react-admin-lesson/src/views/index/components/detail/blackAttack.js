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
        videoUrl:import('../../../bbtest.mp4'),
    }
    // handleStateChange = () => {
    //     this.setState({
    //         player: state,
    //         currentTime: state.currentTime,
    //         duration:state.duration,
    //     });
    // }

    render() {
        return (
            <>
                <script src="http://html5media.googlecode.com/svn/trunk/src/html5media.min.js"></script>
                <section className="site-card-wrapper">
                    <Card title="黑盒任务" bordered={false}>
                        <p>创建时间：2021-01-02</p>
                        <h1>攻击方式：xxxxx</h1>
                    </Card>
                    <Card title="算法结果" bordered={false}>
                        <p className='content-title2' >攻破结果图：</p>
                        <video width="620" height="200"controls>
                            <source src={require('../../../bbtest.mp4')}/>
                            Your browser does not support the video tag
                        </video>
                    </Card>
                </section>
            </>
        );
    }
};


export default BlackAttack
