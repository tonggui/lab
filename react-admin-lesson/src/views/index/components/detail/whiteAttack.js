import React, { Component, Fragment } from "react";
import { Card, Image } from 'antd';
import "./detail.scss";

const WhiteAttack = () => {
    return (
        <>
            <section className="site-card-wrapper">
                <Card title="白盒任务" bordered={false}>
                    <p>创建时间：2021-01-02</p>
                    <h1>攻击方式：xxxxx</h1>
                </Card>
                <Card title="算法结果" bordered={false}>
                    <p className='content-title'>测评图表</p>
                    <h1>曲线图</h1>
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
};


export default WhiteAttack
