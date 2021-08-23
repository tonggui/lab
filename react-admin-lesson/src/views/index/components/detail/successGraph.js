import React, {Component} from 'react';
import ReactEcharts from 'echarts-for-react';

class SuccessGraph extends Component {
    constructor(props){
        super(props);
        this.state = {
            eps : props.success,
            attackType : props.attackType
        };
    }
    getOption = () => {
        let eps = this.state.eps
        // Eps.push([tmp[0],tmp[9],tmp[19],tmp[29],tmp[39],tmp[59],tmp[79],tmp[99],tmp[119],tmp[255]])
        let index = this.state.attackType == 2 ? [2,4,8,16,32] :[0,9,19,29,39,59,79,99,119,255].map(item=>{
            return item/255
        })
        const option = {
            title: {
                text: '',
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
                data: ['识别不到目标','目标消失','制造标签','错误标签1','错误标签2'],
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
                data: index,
                boundaryGap: false,
                name: '扰动大小',   // x轴名称
                // x轴名称样式
                nameTextStyle: {
                    fontWeight: 500,
                    fontSize: 14
                }
            },
            yAxis: {
                type: 'value',
                name: '算法有效率',   // y轴名称
                // y轴名称样式
                nameTextStyle: {
                    fontWeight: 500,
                    fontSize: 14
                }
            },
            series: [{
                name: '识别不到目标',
                data: this.state.eps[0],
                type: 'line',
                smooth: true
            },{
                name: '目标消失',
                data: this.state.eps[1],
                type: 'line',
                smooth: true
            },{
                name: '制造标签',
                data: this.state.eps[2],
                type: 'line',
                smooth: true
            },{
                name: '错误标签1',
                data: this.state.eps[3],
                type: 'line',
                smooth: true
            },{
                name: '错误标签2',
                data: this.state.eps[4],
                type: 'line',
                smooth: true
            }]
        };
        return option;
    };
    render() {
        return (
            <ReactEcharts
                option={this.getOption()}
                style={{height: '350px', width: '750px'}}
                className='react_for_echarts' />
        );
    }
}

export default SuccessGraph;
