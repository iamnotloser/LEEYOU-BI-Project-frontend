import {genChartByAiAsyncByMqUsingPost, genChartByAiAsyncUsingPost} from '@/services/leeyou_bi/chartController';
import {Button, Card, Form, Input, message, Select, Space, Upload,} from 'antd';
import React, {useState} from 'react';
import {useForm} from "antd/es/form/Form";
import {UploadOutlined} from '@ant-design/icons';


/**
 * 添加图表(异步)页面
 * @constructor
 */
const AddChartAsync: React.FC = () => {


  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = useForm();
  const onFinish = async (values: any) => {
    //避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);

    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAiAsyncByMqUsingPost(params, {}, values.file.file.originFileObj);
      console.log(res);
      if (!res.data) {
        message.error('分析任务创建失败');
      } else {
        message.success('分析任务提交成功，稍后请在我的图表中查看分析结果');
        form.resetFields();
      }
    } catch (e: any) {
      message.error('分析任务创建失败' + e.message);
    }
    setSubmitting(false);
  };

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <div className="add-chart-async">

      <Card title="智能分析数据">
        <Form
          form={form}
          name="addChart"
          labelAlign={'left'}
          labelCol={{span: 4}}
          wrapperCol={{span: 16}}
          onFinish={onFinish}
          initialValues={{}}
        >
          <Form.Item
            name="goal"
            label="分析目标"
            rules={[{required: true, message: '请输入分析目标！'}]}
          >
            <Input placeholder={'请输入你的分析需求，比如：分析网站用户的增长情况'}/>
          </Form.Item>
          <Form.Item
            name="name"
            label="图表名称"
            rules={[{required: true, message: '请输入图表名称！'}]}
          >
            <Input placeholder={'请输入你的图表名称，比如：网站用户增长情况分析'}/>
          </Form.Item>

          <Form.Item name="chartType" label="图表类型" hasFeedback>
            <Select
              placeholder="请选择图表类型"
              options={[
                {value: '折线图', label: '折线图'},
                {value: '柱状图', label: '柱状图'},
                {value: '饼状图', label: '饼状图'},
                {value: '堆叠图', label: '堆叠图'},
                {value: '雷达图', label: '雷达图'},
              ]}
            ></Select>
          </Form.Item>

          <Form.Item name="file" label="原始数据">
            <Upload name="file" maxCount={1}>
              <Button icon={<UploadOutlined/>}>点击上传Excel文件</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{span: 12, offset: 4}}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={submitting}
              >
                提交
              </Button>
              <Button htmlType="reset">重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

    </div>
  );
};
export default AddChartAsync;
