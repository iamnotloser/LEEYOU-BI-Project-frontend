import { genChartByAiUsingPost } from '@/services/leeyou_bi/chartController';
import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Spin,
  Upload,
} from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useState } from 'react';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

/**
 * 添加图表页面
 * @constructor
 */
const AddChart: React.FC = () => {
  // const option={
  //   "title": {
  //     "text": "网站用户增长趋势"
  //   },
  //   "tooltip": {},
  //   "xAxis": {
  //     "data": ["一号", "二号", "三号"],
  //     "axisLabel": {
  //       "interval": 0
  //     }
  //   },
  //   "yAxis": {},
  //   "series": [{
  //     "name": "用户数",
  //     "type": "bar",
  //     "data": [10, 20, 30]
  //   }]
  // }
  const [chart, setChart] = useState<API.BIResponse>();
  const [option, setOption] = useState<any>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const onFinish = async (values: any) => {
    //避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);
    setChart(undefined);
    setOption(undefined);
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAiUsingPost(params, {}, values.file.file.originFileObj);
      console.log(res);
      if (!res.data) {
        message.error('分析任务创建失败');
        return;
      } else {
        message.success('分析任务创建成功');
        const chartOption = JSON.parse(res?.data.genChart ?? '');
        if (!chartOption) {
          throw new Error('分析任务创建失败');
        } else {
          setChart(res?.data);
          setOption(chartOption);
        }
      }
    } catch (e: any) {
      message.error('分析任务创建失败' + e.message);
    }
    setSubmitting(false);
    console.log('用户表单内容: ', values);
  };

  // @ts-ignore
  return (
    <div className="add-chart">
      <Row gutter={24}>
        <Col span={12}>
          <Card title="智能分析数据">
            <Form
              name="addChart"
              {...formItemLayout}
              labelAlign={'left'}
              labelCol={{ span: 4 }}
              onFinish={onFinish}
            >
              <Form.Item
                name="goal"
                label="分析目标"
                rules={[{ required: true, message: '请输入分析目标！' }]}
              >
                <Input placeholder={'请输入你的分析需求，比如：分析网站用户的增长情况'} />
              </Form.Item>
              <Form.Item
                name="name"
                label="图表名称"
                rules={[{ required: true, message: '请输入图表名称！' }]}
              >
                <Input placeholder={'请输入你的图表名称，比如：网站用户增长情况分析'} />
              </Form.Item>

              <Form.Item name="chartType" label="图表类型" hasFeedback>
                <Select
                  placeholder="请选择图表类型"
                  options={[
                    { value: '折线图', label: '折线图' },
                    { value: '柱状图', label: '柱状图' },
                    { value: '饼状图', label: '饼状图' },
                    { value: '堆叠图', label: '堆叠图' },
                    { value: '雷达图', label: '雷达图' },
                  ]}
                ></Select>
              </Form.Item>

              <Form.Item name="file" label="原始数据">
                  <Upload name="file" maxCount={1}>
                  <Button icon={<UploadOutlined />}>点击上传Excel文件</Button>
                </Upload>
              </Form.Item>

              <Form.Item wrapperCol={{ span: 12, offset: 4 }}>
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
        </Col>
        <Col span={12}>
          <Card title="分析结论">{chart?.genResult ?? <div>请先在左侧提交分析目标</div>}
            <Spin spinning={submitting}/>
          </Card>

          <Divider variant="dotted" />
          <Card title="可视化图表">
            {option ? <ReactECharts option={option} /> : <div>请先在左侧提交分析目标</div>}
            <Spin spinning={submitting}/>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddChart;
