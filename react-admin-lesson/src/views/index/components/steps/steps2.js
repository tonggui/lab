import React from "react";
import {Radio, Checkbox, Row, Col, Image, Upload, Button, Modal} from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
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
        if (getAttackType() == 1) {
            console.log('checked = ', checkedValues);
            setWhiteParams( checkedValues)
        }
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

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class Pictures extends React.Component {
    state = {
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChange = ({ fileList }) => {
        this.setState({ fileList })
        console.log(fileList)
        setBlackParams(fileList)
    };

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <>
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}
const BlackAttack = () => {
    const [type, setType] = React.useState(1);
    const onRadioChange = e => {
        let value = e.target.value
        console.log('type checked', value);
        setType(value);
    };
    const props = {
        action: '//jsonplaceholder.typicode.com/posts/',
        listType: 'picture',
        previewFile(file) {
            console.log('Your upload file:', file);
            // Your process logic. Here we just mock to the same file
            return fetch('https://next.json-generator.com/api/json/get/4ytyBoLK8', {
                method: 'POST',
                body: file,
            })
                .then(res => res.json())
                .then(({ thumbnail }) => thumbnail);
        },
    };
    const UploadType = props => {
        if (props.type === 1) {
            return (
                <Pictures></Pictures>
            );
        } else {
            return (
                <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
            );
        }
    }
    return (
        <div>
            <Radio.Group onChange={onRadioChange} value={type}  style={{marginBottom:20}}>
                <Radio value={1}>图片</Radio>
                <Radio value={2}>视频</Radio>
            </Radio.Group>
            <div>
                <UploadType type = {type} />
            </div>
        </div>
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
