import {listMyChartByPageUsingPost} from '@/services/leeyou_bi/chartController';
import {Avatar, Card, List, message, Result,} from 'antd';
import ReactECharts from 'echarts-for-react';
import React, {useEffect, useState} from 'react';
import initialState from "@@/plugin-initialState/@@initialState";
import {getInitialState} from "@/app";
import {useModel} from "@@/exports";
import {Pagination} from 'antd';
import Search from "antd/es/input/Search";

/**
 * 我的图表页面
 * @constructor
 */
const MyChart: React.FC = () => {

  const initSearchParams = {
    pageSize: 4,
    current: 1,
    sortField: 'createTime',
    sortOrder: 'descend',
  };

  const {initialState} = useModel('@@initialState');
  const {currentUser} = initialState ?? {};
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams});
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const loadData = async () => {
    try {
      const res = await listMyChartByPageUsingPost(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        // 隐藏图表的 title
        if (res.data.records) {
          res.data.records.forEach(data => {
            if (data.status === 'succeed') {
              const chartOption = JSON.parse(data.genChart ?? '{}');
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          })
        }
      } else {
        message.error('获取我的图表失败');
      }
    } catch (e: any) {
      message.error('获取我的图表失败' + e.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [searchParams]);

  return (
    <div className="my-chart-page">
      <div>
        <Search
          placeholder="请搜索图表名称"
          enterButton="Search" size="large"

          onSearch={(value) => {
            setSearchParams({
              ...initSearchParams,
              name: value,
            })
          }}/>
      </div>
      <br/>
      <List
        itemLayout="vertical"
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        loading={loading}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            })
          },
          total: total,
          current: searchParams.current,
          pageSize: searchParams.pageSize,
        }}
        dataSource={chartList}

        renderItem={(item) => (
          <Card>
            <List.Item
              key={item.id}

            >
              <List.Item.Meta
                avatar={<Avatar src={currentUser?.userAvatar}/>}
                title={<a>{item.name}</a>}
                description={<text>{'分析目标：' + item.goal}<br/>{'图表类型：'+item.chartType}</text>}
              />
              <>
              {
                item.status === 'succeed' &&  <>
                  {item.genResult}
                  <div style={{marginBottom: 20}}>
                  </div>
                  <ReactECharts option={item.genChart && JSON.parse(item.genChart ?? '')}/>
                </>
              }
              {
                item.status === 'failed' && <>
                  <Result
                    status="error"
                    title="生成失败"
                    subTitle={item.execMessage}
                    style={{color: 'red'}}>
                  </Result>
                </>
              }
              {
                item.status === 'running' && <>
                  <Result
                    status="info"
                    title="图表生成中"
                    subTitle={item.execMessage}
                  />
                </>
              }
                {
                  item.status === 'waiting' && <>
                  <Result
                    status="warning"
                    title="图表待生成"
                    subTitle={item.execMessage??'当前队列生成繁忙，请耐心等候'}
                  />
                  </>
                }
                {/*{item.genResult}*/}
                {/*<div style={{marginBottom: 20}}>*/}
                {/*</div>*/}
                {/*<ReactECharts option={item.genChart && JSON.parse(item.genChart ?? '')}/>*/}
              </>



            </List.Item>
          </Card>

        )}
      />
    </div>
  );
};
export default MyChart;
