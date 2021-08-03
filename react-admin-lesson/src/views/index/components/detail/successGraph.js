import React, {Component} from 'react';
import ReactEcharts from 'echarts-for-react';

class SuccessGraph extends Component {
    constructor(props){
        super(props);
        this.state = {
            success : props.success
        };
    }
    getOtion = (success) => {
        const epsData = this.state.success.map((item, index) => {
            return index/255
        })
        const option = {
            title: {
                text: '攻击测评',
                // subtext: 'eps-success'
            },
            axisTick: {
                show: false, //是否显示刻度
            },
            tooltip: {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                },
            },
            /* 设置图例样式 */
            legend: {
                padding: [3,60,0,0],
                icon: "circle", // 形状 类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow，none
                data: ['eps成功'],
                textStyle:{	// 设置图例字体
                    color: '#000000',
                }
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: {readOnly: false},
                    magicType: {type: ['bar']},
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                data: epsData,
                boundaryGap: false,
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: 'eps成功',
                data: this.state.success,
                type: 'line',
                smooth: true
            }]
        };
        return option;
    };
    render() {
        return (
            <ReactEcharts
                option={this.getOtion()}
                style={{height: '350px', width: '500px'}}
                className='react_for_echarts' />
        );
    }
}

export default SuccessGraph;
