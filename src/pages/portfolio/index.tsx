/* eslint-disable import/no-unused-modules */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Access from '@/components/common/access';
import AdminLayout from '@/components/common/layout/admin-layout';
import Layout from '@/components/common/layout/base-layout';
import { GET_PORTFOLIO } from '@/services/apollo/queries/portfolio';
import { currencyFormat } from '@/utils/helpers/common.helper';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  HolderOutlined,
} from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import {
  getPythProgramKeyForCluster,
  PythCluster,
  PythConnection,
  PythHttpClient,
} from '@pythnetwork/client';
import { PythHttpClientResult } from '@pythnetwork/client/lib/PythHttpClient';
import { Connection } from '@solana/web3.js';
import {
  App,
  Card,
  Empty,
  Flex,
  Segmented,
  Skeleton,
  Statistic,
  Table,
  Typography,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ApexOptions } from 'apexcharts';
import Big from 'big.js';
import dayjs from 'dayjs';
import { env } from 'env.mjs';
import { DefaultSeo } from 'next-seo';
import { SEO } from '@utils/constants/seo.constant';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const { Title } = Typography;

const CLUSTER: PythCluster = 'mainnet-beta';
const pythPublicKey = getPythProgramKeyForCluster(CLUSTER);
const connection = new Connection(env.NEXT_PUBLIC_SOLANA_RPC);
const pythConnection = new PythConnection(connection, pythPublicKey);
const pythClient = new PythHttpClient(connection, pythPublicKey);

const Portfolio = () => {
  const { data: dataGetPortfolio, loading: loadingGetPortfolio } =
    useQuery(GET_PORTFOLIO);

  const { notification } = App.useApp();
  const [rerender, setRerender] = useState<number>();
  const pythDataRef = useRef<PythHttpClientResult>();
  const symbolsRef = useRef<Map<string, string>>(new Map());
  const [isLoadingGetPythData, setIsLoadingGetPythData] = useState(true);
  const [historyChartData, setHistoryChartData] = useState<any>([]);
  const [historyTime, setHistoryTime] = useState<1 | 7 | 30 | 90 | 0>(1);

  const historyChartOptions: ApexOptions = useMemo(
    () => ({
      series: [
        {
          name: '',
          color:
            +historyChartData?.[0]?.[1] >
            +historyChartData?.[historyChartData?.length - 1]?.[1]
              ? '#ff0000'
              : '#008000',
          data: historyChartData as any,
        },
      ],
      chart: {
        zoom: {
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: 'pan',
          tools: {
            reset: false,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
          },
        },
      },

      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      xaxis: {
        type: 'datetime',
        tickAmount: 6,
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        labels: {
          formatter: (value: any) => currencyFormat(value),
        },
      },
      tooltip: {
        x: {
          format: 'dd/MM/yyyy HH:mm:ss',
        },
        y: {
          formatter: (value: any) => currencyFormat(value),
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100],
        },
      },
      stroke: {
        width: 2,
      },

      noData: {
        text: 'No data',
      },
    }),
    [historyChartData],
  );

  const performanceChartOptions = useMemo(() => {
    const firstSnapshot = dataGetPortfolio?.getPortfolio?.binanceSnapshots?.[0];
    const firstTotalValue = firstSnapshot?.totalAssetOfUsd;

    return {
      series: [
        {
          name: 'Value',
          type: 'bar',
          data:
            (dataGetPortfolio?.getPortfolio?.binanceSnapshots?.map((snap) => {
              const result = Big(snap?.totalAssetOfUsd || '0')
                .minus(firstTotalValue || '0')
                .toString();

              return result;
            }) as any) || [],
          color: '#008000',
        },
        {
          name: 'All-time profit',
          type: 'line',
          data:
            dataGetPortfolio?.getPortfolio?.binanceSnapshots?.map(
              (snap, index) => {
                const previousSnapshot =
                  dataGetPortfolio?.getPortfolio?.binanceSnapshots?.[
                    index === 0 ? index : index - 1
                  ];
                const previousTotalValue = previousSnapshot?.totalAssetOfUsd;

                const result =
                  snap?.totalAssetOfUsd !== '0'
                    ? Big(snap?.totalAssetOfUsd || '1')
                        .minus(previousTotalValue || '1')
                        .div(previousTotalValue || '1')
                        .mul(Big('100'))
                        .toFixed(2)
                    : '0';
                return result;
              },
            ) || [],
          color: '#1677ff',
        },
        {
          name: 'BTC trend',
          type: 'line',
          data:
            dataGetPortfolio?.getPortfolio?.binanceSnapshots?.map(
              (snap, index) => {
                const previousSnapshot =
                  dataGetPortfolio?.getPortfolio?.binanceSnapshots?.[
                    index === 0 ? index : index - 1
                  ];
                const previousTotalValue = previousSnapshot?.totalAssetOfBtc;

                const result =
                  snap?.totalAssetOfBtc !== '0'
                    ? Big(snap?.totalAssetOfBtc || '1')
                        .minus(previousTotalValue || '1')
                        .div(previousTotalValue || '1')
                        .mul(Big('100'))
                        .toFixed(2)
                    : '0';
                return result;
              },
            ) || [],
          color: '#ffff00',
        },
      ] as ApexOptions['series'],
      options: {
        chart: {
          type: 'line',
          stacked: false,
          toolbar: {
            autoSelected: 'pan',
            tools: {
              reset: false,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
            },
          },
        },
        stroke: {
          width: [0, 2, 2],
          curve: 'smooth',
          colors: ['#1677ff'],
        },
        plotOptions: {
          bar: {
            columnWidth: '80%',
            colors: {
              ranges: [
                {
                  from: -1000000000,
                  to: -1,
                  color: '#ff0000',
                },
                {
                  from: 0,
                  to: 1000000000,
                  color: '#008000',
                },
              ],
            },
          },
        },

        dataLabels: {
          enabled: false,
        },

        labels:
          dataGetPortfolio?.getPortfolio?.binanceSnapshots?.map((snap) => {
            return snap?.updateTime
              ? dayjs(+snap?.updateTime).format('YYYY-MM-DD HH:mm:ss')
              : null;
          }) || [],

        xaxis: {
          type: 'datetime',
          tooltip: {
            enabled: false,
          },
        },

        yaxis: {
          labels: {
            formatter: (value: any, opts) => {
              return `${value?.toFixed(2)}%`;
            },
          },
        },

        tooltip: {
          x: {
            format: 'dd/MM/yyyy HH:mm:ss',
          },
          y: {
            formatter(val, opts) {
              if (opts.seriesIndex === 0) {
                return `<span style="color: ${
                  +val >= 0 ? 'green' : 'red'
                }">${currencyFormat(val)}</span>`;
              }

              if (opts.seriesIndex === 1) {
                return `<span style="color: ${
                  +val >= 0 ? 'green' : 'red'
                }">${val}%</span>`;
              }

              if (opts.seriesIndex === 2) {
                return `<span style="color: ${
                  +val >= 0 ? 'green' : 'red'
                }">${val}%</span>`;
              }
            },
          },
        },
      } as ApexOptions,
    };
  }, [dataGetPortfolio?.getPortfolio?.binanceSnapshots]);

  const allocationChartOptions: ApexOptions = useMemo(
    () => ({
      series:
        dataGetPortfolio?.getPortfolio?.binanceBalances?.map((balance) => {
          return +Big(balance?.free || '0')
            .add(Big(balance?.locked || '0'))
            .toFixed();
        }) || [],
      labels:
        (dataGetPortfolio?.getPortfolio?.binanceBalances?.map((balance) => {
          return balance?.asset;
        }) as string[]) || [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      legend: {
        formatter: (val, opts) => {
          return (
            val +
            ' - ' +
            Big(`${opts.w.globals.seriesPercent[opts.seriesIndex]}`).toFixed(
              1,
            ) +
            '%'
          );
        },
      },
    }),
    [dataGetPortfolio?.getPortfolio?.binanceBalances],
  );

  const iconLists = useMemo(() => {
    const result: { src: string; width: number; height: number }[] = [];
    dataGetPortfolio?.getPortfolio?.binanceBalances?.map(async (balance) => {
      const key = balance?.asset?.replace('LD', '').toLowerCase();
      try {
        const icon = await import(
          `cryptocurrency-icons/svg/icon/${key}.svg`
        ).then((res) => res.default);
        result.push(icon);
      } catch {
        //
      }
      return null;
    });

    return result;
  }, [dataGetPortfolio?.getPortfolio?.binanceBalances]);

  useEffect(() => {
    if (
      dataGetPortfolio?.getPortfolio &&
      dataGetPortfolio.getPortfolio?.binanceSnapshots
    ) {
      const snapshots = dataGetPortfolio.getPortfolio.binanceSnapshots;

      if (snapshots.length > 0) {
        const maxDay = historyTime === 0 ? snapshots.length : historyTime;
        const partSnapshots =
          maxDay === 1
            ? snapshots.slice(-maxDay - 1)
            : snapshots.slice(-maxDay);
        const historyChartDataMap = partSnapshots.map((snap) => {
          return [+snap?.updateTime!, snap?.totalAssetOfUsd];
        });

        setHistoryChartData(historyChartDataMap);
      }
    }
  }, [dataGetPortfolio?.getPortfolio, historyTime]);

  const allBalance = useMemo(() => {
    if (
      dataGetPortfolio?.getPortfolio?.binanceBalances &&
      dataGetPortfolio.getPortfolio.binanceBalances.length > 0
    ) {
      let result = Big('0');
      dataGetPortfolio.getPortfolio.binanceBalances.forEach((balance) => {
        const asset = balance?.asset?.replace('LD', '');
        const key = `Crypto.${asset}/USD`;
        symbolsRef.current.set(key, key);
        const currentPrice = pythDataRef.current?.productPrice.get(key)?.price;
        if (currentPrice) {
          if (balance?.free) {
            result = Big(result).add(
              Big(currentPrice.toString()).mul(Big(balance.free)),
            );
          }

          if (balance?.locked) {
            result = Big(result).add(
              Big(currentPrice.toString()).mul(Big(balance.locked)),
            );
          }
        }
      });
      return result.toString();
    } else {
      return '0';
    }
  }, [dataGetPortfolio?.getPortfolio?.binanceBalances, rerender]);

  useEffect(() => {
    try {
      pythConnection.onPriceChange((product, price) => {
        if (symbolsRef.current.size > 0) {
          const symbol = symbolsRef.current.get(product.symbol);
          if (symbol) {
            pythDataRef.current?.productPrice.set(symbol, price);
            setRerender(price?.price);
          }
        }
      });
    } catch (e) {
      const err = e as Error;
      notification.error({ message: 'Error', description: err.message });
    }
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await pythClient.getData();
        pythDataRef.current = data;
      } catch (e) {
        const err = e as Error;
        notification.error({ message: 'Error', description: err.message });
      } finally {
        setIsLoadingGetPythData(false);
      }
    };

    try {
      getData();
      pythConnection.start();
    } catch (e) {
      const err = e as Error;
      notification.error({ message: 'Error', description: err.message });
    }

    return () => {
      pythConnection.stop();
    };
  }, []);

  const dataAssets: DataType[] = useMemo(() => {
    const result = dataGetPortfolio?.getPortfolio?.binanceBalances?.map(
      (balance) => {
        const key = `Crypto.${balance?.asset?.replace('LD', '')}/USD`;
        const price = `${Big(
          `${pythDataRef.current?.productPrice.get(key)?.price || '0'}`,
        ).toString()}`;

        const holdings = Big(`${balance?.free || '0'}`)
          .add(Big(`${balance?.locked}`))
          .toString();

        return {
          key: balance?.asset,
          name: balance?.asset?.replace('LD', 'Savings - '),
          price,
          holdings,
          avgBuyPrice: balance?.avgBuyPrice,
          profitLoss: Big(price)
            .mul(holdings)
            .minus(Big(balance?.avgBuyPrice || '0').mul(holdings))
            .toString(),
        } as DataType;
      },
    );

    return result || [];
  }, [dataGetPortfolio?.getPortfolio?.binanceBalances, rerender]);

  if (
    dataGetPortfolio?.getPortfolio?.binanceBalances?.length === 0 &&
    dataGetPortfolio?.getPortfolio?.binanceSnapshots?.length === 0
  ) {
    return <Empty />;
  }

  const isLoading = loadingGetPortfolio || isLoadingGetPythData;

  interface DataType {
    key: string;
    name: string;
    price: string;
    holdings: string;
    avgBuyPrice: string;
    profitLoss: string;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render(value, record) {
        const id = record.key?.replace('LD', '').toLowerCase();
        const iconSvg = iconLists.find((icon) => {
          return icon.src.includes(id);
        });
        return (
          <Flex align="center" gap={5}>
            {iconSvg?.src && (
              <Image
                src={iconSvg.src}
                alt={value}
                width={20}
                height={20}
                draggable={false}
              />
            )}
            {value}
          </Flex>
        );
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render(value) {
        return currencyFormat(value);
      },
      width: 150,
    },
    {
      title: 'Holdings',
      dataIndex: 'holdings',
      key: 'holdings',
      width: 150,
      render(value, record) {
        return (
          <Flex vertical>
            <div>
              {currencyFormat(+Big(value).mul(Big(record.price)).toString())}
            </div>
            <div style={{ fontSize: 12 }}>
              {Big(value).toFixed(4)} {record.key?.replace('LD', '')}
            </div>
          </Flex>
        );
      },
    },
    {
      title: 'Avg. Buy Price',
      key: 'avgBuyPrice',
      dataIndex: 'avgBuyPrice',
      width: 150,
      render(value) {
        return currencyFormat(value);
      },
    },
    {
      dataIndex: 'profitLoss',
      title: 'Profit/Loss',
      key: 'profitLoss',
      render(value, record) {
        const percent =
          record?.price === '0'
            ? '0'
            : +Big(value)
                .div(Big(record.price).mul(record.holdings))
                .mul(Big('100'))
                .toFixed(2);
        return (
          <Flex vertical>
            <div>{currencyFormat(value)}</div>
            <div
              style={{
                fontSize: 12,
                color: Big(percent).gte('0') ? 'green' : 'red',
              }}
            >
              {Big(percent).gte('0') ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )}{' '}
              {percent}%
            </div>
          </Flex>
        );
      },
    },
  ];

  return (
    <>
      <DefaultSeo {...SEO} title="Portfolio" />
      <Access>
        <Title level={5} style={{ textAlign: 'left' }}>
          <Skeleton active loading={isLoading} paragraph={{ rows: 1 }}>
            <HolderOutlined /> Total value
            <div>
              <Title level={1}>{currencyFormat(+allBalance)}</Title>
            </div>
          </Skeleton>
        </Title>

        <Flex gap={30} wrap="wrap">
          <Skeleton active loading={isLoading}>
            <Card bordered={true}>
              <Statistic
                title="All-time profit"
                formatter={() => {
                  const pnl = dataAssets?.reduce((current, asset) => {
                    return current.add(Big(asset.profitLoss));
                  }, Big('0'));

                  const isZero = pnl.lte('0') || allBalance === '0';
                  return (
                    <div style={{ color: pnl.gte('0') ? 'green' : 'red' }}>
                      <div>{currencyFormat(+pnl.toString())}</div>
                      <div style={{ fontSize: 18 }}>
                        {pnl.gte('0') ? (
                          <ArrowUpOutlined />
                        ) : (
                          <ArrowDownOutlined />
                        )}{' '}
                        {isZero
                          ? '0'
                          : pnl.div(allBalance).mul('100').toFixed(2)}
                        %
                      </div>
                    </div>
                  );
                }}
              />
            </Card>
          </Skeleton>

          <Skeleton active loading={isLoading}>
            <Card bordered={true}>
              <Statistic
                title="Best Performer"
                formatter={() => {
                  const maxPnlAsset = dataAssets?.reduce((maxAsset, asset) => {
                    return +asset.profitLoss > +maxAsset.profitLoss
                      ? asset
                      : maxAsset;
                  }, dataAssets[0]);

                  const percent =
                    maxPnlAsset?.price === '0'
                      ? '0'
                      : +Big(maxPnlAsset.profitLoss)
                          .div(Big(maxPnlAsset.price).mul(maxPnlAsset.holdings))
                          .mul(Big('100'))
                          .toFixed(2);

                  const orgAsset = maxPnlAsset?.key?.replace('LD', '');

                  return (
                    <div>
                      <div>{orgAsset}</div>
                      <div
                        style={{
                          fontSize: 18,
                          color: Big(percent).gte('0') ? 'green' : 'red',
                        }}
                      >
                        <span>
                          {Big(percent).gte('0') && '+ '}
                          {currencyFormat(+maxPnlAsset.profitLoss)}
                        </span>{' '}
                        <span>
                          {Big(percent).gte('0') ? (
                            <ArrowUpOutlined />
                          ) : (
                            <ArrowDownOutlined />
                          )}{' '}
                          {percent}%
                        </span>
                      </div>
                    </div>
                  );
                }}
              />
            </Card>
          </Skeleton>

          <Skeleton active loading={isLoading}>
            <Card bordered={true}>
              <Statistic
                title="Worst Performer"
                formatter={() => {
                  const maxPnlAsset = dataAssets?.reduce((maxAsset, asset) => {
                    return +asset.profitLoss < +maxAsset.profitLoss
                      ? asset
                      : maxAsset;
                  }, dataAssets[0]);

                  const percent =
                    maxPnlAsset?.price === '0'
                      ? '0'
                      : +Big(maxPnlAsset.profitLoss)
                          .div(Big(maxPnlAsset.price).mul(maxPnlAsset.holdings))
                          .mul(Big('100'))
                          .toFixed(2);

                  const orgAsset = maxPnlAsset?.key?.replace('LD', '');

                  return (
                    <div>
                      <div>{orgAsset}</div>
                      <div
                        style={{
                          fontSize: 18,
                          color: Big(percent).gte('0') ? 'green' : 'red',
                        }}
                      >
                        <span>
                          {Big(percent).gte('0') && '+ '}
                          {currencyFormat(+maxPnlAsset.profitLoss)}
                        </span>{' '}
                        <span>
                          {Big(percent).gte('0') ? (
                            <ArrowUpOutlined />
                          ) : (
                            <ArrowDownOutlined />
                          )}{' '}
                          {percent}%
                        </span>
                      </div>
                    </div>
                  );
                }}
              />
            </Card>
          </Skeleton>
        </Flex>

        <Flex style={{ marginTop: 30 }} gap={30} wrap="wrap">
          <div style={{ width: '100%', maxWidth: 500 }}>
            <Skeleton active loading={isLoading}>
              <Card bordered style={{ height: '100%' }}>
                <Flex
                  align="center"
                  gap={20}
                  justify="space-between"
                  style={{ marginBottom: 30 }}
                  wrap="wrap"
                >
                  <div>
                    <Title level={5}>History</Title>
                  </div>
                  <Segmented
                    options={[
                      { label: '24H', value: 1 },
                      { label: '7D', value: 7 },
                      { label: '30D', value: 30 },
                      { label: '90D', value: 90 },
                      { label: 'ALL', value: 0 },
                    ]}
                    value={historyTime}
                    onChange={(value) => setHistoryTime(value as any)}
                  />
                </Flex>
                <Chart
                  options={{
                    chart: historyChartOptions.chart,
                    dataLabels: historyChartOptions.dataLabels,
                    fill: historyChartOptions.fill,
                    markers: historyChartOptions.markers,
                    xaxis: historyChartOptions.xaxis,
                    yaxis: historyChartOptions.yaxis,
                    tooltip: historyChartOptions.tooltip,
                    stroke: historyChartOptions.stroke,
                  }}
                  series={historyChartOptions.series}
                  type="area"
                />
              </Card>
            </Skeleton>
          </div>

          <div style={{ width: '100%', maxWidth: 500 }}>
            <Skeleton active loading={isLoading}>
              <Card bordered style={{ height: '100%' }}>
                <Flex
                  align="center"
                  gap={20}
                  justify="space-between"
                  style={{ marginBottom: 30 }}
                  wrap="wrap"
                >
                  <div>
                    <Title level={5}>Performance (cumulative)</Title>
                  </div>
                </Flex>
                <Chart
                  options={performanceChartOptions.options}
                  series={performanceChartOptions.series}
                />
              </Card>
            </Skeleton>
          </div>

          <div style={{ width: '100%', maxWidth: 500 }}>
            <Skeleton active loading={isLoading}>
              <Card bordered style={{ height: '100%' }}>
                <Flex
                  align="center"
                  gap={20}
                  justify="space-between"
                  style={{ marginBottom: 30 }}
                  wrap="wrap"
                >
                  <div>
                    <Title level={5}>Allocation</Title>
                  </div>
                </Flex>
                <Chart
                  options={{
                    labels: allocationChartOptions.labels,
                    responsive: allocationChartOptions.responsive,
                    legend: allocationChartOptions.legend,
                  }}
                  series={allocationChartOptions.series}
                  type="donut"
                />
              </Card>
            </Skeleton>
          </div>
        </Flex>

        <Flex vertical style={{ marginTop: 30 }}>
          <Skeleton loading={isLoading}>
            <div>
              <Title style={{ textAlign: 'left', marginBottom: 30 }} level={5}>
                Assets
              </Title>
            </div>
            <div style={{ maxWidth: 'fit-content' }}>
              <Table
                columns={columns}
                dataSource={dataAssets}
                scroll={{ x: 'fit-content' }}
                pagination={false}
              />
            </div>
          </Skeleton>
        </Flex>
      </Access>
    </>
  );
};

export default Portfolio;

Portfolio.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>
      <AdminLayout>{page}</AdminLayout>
    </Layout>
  );
};
