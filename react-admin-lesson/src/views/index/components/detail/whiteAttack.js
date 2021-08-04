import React, { Component, Fragment } from "react";
import {Card, Carousel, Image} from 'antd';
import ReactEcharts from 'echarts-for-react';
import "./detail.scss";
import Success from "../steps/data";
import SuccessGraph from "./successGraph"
import { WhiteDetail, BlackDetail} from "../../../../api/task";
import Nav0 from "../../../../assets/0.jpg";
import Nav1 from "../../../../assets/1.jpg";
import Nav2 from "../../../../assets/10.jpg";
import Nav3 from "../../../../assets/100.jpg";
import Nav4 from "../../../../assets/101.jpg";
import Nav5 from "../../../../assets/102.jpg";
import Nav6 from "../../../../assets/103.jpg";
import Nav7 from "../../../../assets/104.jpg";
import Nav8 from "../../../../assets/105.jpg";
import Nav9 from "../../../../assets/1000.jpg";
const imgs = [Nav0,Nav1,Nav2,Nav3,Nav4,Nav5,Nav6,Nav7,Nav8,Nav9]

const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};


class WhiteAttack extends Component{
    componentDidMount() {
        WhiteDetail({"id":3}).then(response => {  // resolves
            this.setState({
                loading: false
            })
            const data = response.data
            console.log(data)
            // 路由跳转
        }).catch(error => {  // reject
            this.setState({
                loading: false
            })
        })
    }

    render() {
        console.log(this.props.record)
        const {taskname,taskremark,time,resultset,type } = this.props.record
        return (
            <>
                <section className="site-card-wrapper">
                    <Card title="白盒任务" bordered={false}>
                        <p style={{fontWeight:"bold",fontSize:18}}>任务名称：{taskname}</p>
                        <p>创建时间：{time}</p>
                        <h1>攻击方式：{type}</h1>
                        <p>备注：{taskremark}</p>
                    </Card>
                    <Card title="算法结果" bordered={false}>
                        <p className='content-title'>测评图表</p>
                        <SuccessGraph success={Success}>
                        </SuccessGraph>
                        <p className='content-title2' >攻破结果图：</p>
                        <Carousel autoplay autoplaySpeed={2000} className="imgCarousel">
                            {imgs.map((item,index)=>{
                                return <Image key={index}
                                    width={500}
                                    src={item}
                                />
                            })}

                        </Carousel>
                        {/*<Image.PreviewGroup>*/}
                        {/*    <Image*/}
                        {/*        width={200}*/}
                        {/*        src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"*/}
                        {/*    />*/}
                        {/*    <Image*/}
                        {/*        width={200}*/}
                        {/*        src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"*/}
                        {/*    />*/}
                        {/*</Image.PreviewGroup>*/}
                    </Card>
                </section>
            </>
        );
    }
};


export default WhiteAttack
