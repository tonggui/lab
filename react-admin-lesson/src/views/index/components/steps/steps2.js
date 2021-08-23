import React from "react";
import {Radio, Checkbox, Row, Col} from 'antd';
import {
    setWhiteParams,
    setBlackParams,
    setAttackType,
    getWhiteParams,
    getBlackParams,
    getAttackType
} from "../../../../utils/cookies"

import './steps.scss'
const WhiteAttack = () => {
    const onCheckChange = (checkedValues) => {
        console.log('checked = ', checkedValues);
        setWhiteParams( checkedValues)
    }
    return (
        <Checkbox.Group style={{ width: '100%' }} onChange={onCheckChange}>
            <Checkbox value="untargeted">识别不到目标</Checkbox>
            <Checkbox value="vanishing">目标消失</Checkbox>
            <Checkbox value="fabrication">制造标签</Checkbox>
            <Checkbox value="mislabeling_ml">错误标签1</Checkbox>
            <Checkbox value="mislabeling_ll">错误标签2</Checkbox>
        </Checkbox.Group>
    );
};

const BlackAttack = () => {
    const onCheckChange = (checkedValues) => {
        console.log('checked = ', checkedValues);
        setBlackParams( checkedValues)
    }
    return (
        <Checkbox.Group style={{ width: '100%' }} onChange={onCheckChange}>
            <Checkbox value="deep_false_detection">深度伪造</Checkbox>
            <Checkbox value="face_recognition">人脸识别</Checkbox>
        </Checkbox.Group>
    );
};
const RenderAttack = props => {
    if (props.algorithmType === 1) {
        return (
            <WhiteAttack></WhiteAttack>
        );
    } else {
        return (
            <BlackAttack></BlackAttack>
        );
    }
}
const Steps2 = () => {
    const [algorithmType, setAlgorithmType] = React.useState(1);
    const onRadioChange = e => {
        let value = e.target.value
        setAttackType(value)
        console.log('radio checked', value, getAttackType());
        setAlgorithmType(value);
    };

    return (
        <div>
            <Radio.Group onChange={onRadioChange} value={algorithmType}>
                <Radio value={1}>白盒攻击</Radio>
                <Radio value={2}>黑盒攻击</Radio>
            </Radio.Group>
            <div style={{marginLeft:30,marginTop:20}}>
                <RenderAttack algorithmType = {algorithmType} />
            </div>
        </div>
    );
};

export default Steps2
