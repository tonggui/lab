import React, { Component, Fragment } from "react";
import { Card, Image } from 'antd';
import ReactEcharts from 'echarts-for-react';
import "./detail.scss";
import Success from "../steps/data";
import SuccessGraph from "./successGraph"
import { WhiteDetail, BlackDetail} from "../../../../api/task";

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
        return (
            <>
                <section className="site-card-wrapper">
                    <Card title="白盒任务" bordered={false}>
                        <p>创建时间：2021-01-02</p>
                        <h1>攻击方式：xxxxx</h1>
                    </Card>
                    <Card title="算法结果" bordered={false}>
                        <p className='content-title'>测评图表</p>
                        <SuccessGraph success={Success}>
                        </SuccessGraph>
                        <p className='content-title2' >攻破结果图：</p>
                        <Image.PreviewGroup>
                            <Image
                                width={200}
                                src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                            />
                            <Image
                                width={200}
                                src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                            />
                        </Image.PreviewGroup>
                    </Card>
                </section>
            </>
        );
    }
};


export default WhiteAttack
