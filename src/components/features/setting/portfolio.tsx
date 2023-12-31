import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Access from '@/components/common/access';
import { GET_SETTING, POST_EXCHANGE } from '@/services/apollo/queries/setting';
import { ExchangeId } from '@/utils/constants';
import { QuestionCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import {
  App,
  Button,
  Card,
  Flex,
  Input,
  Skeleton,
  Spin,
  Tooltip,
  Typography,
} from 'antd';
import BNB from 'cryptocurrency-icons/svg/icon/bnb.svg';

import OKX from '../../../../public/features/setting/okx.svg';

const { Title, Text } = Typography;

function PortfolioSetting() {
  const [binanceApikey, setBinanceApiKey] = useState<string>();
  const [binanceApiSecret, setBinanceApiSecret] = useState<string>();
  const [okxApiKey, setOkxApiKey] = useState<string>();
  const { notification } = App.useApp();

  const { data: getSettingData, loading: loadingGetSettingData } =
    useQuery(GET_SETTING);

  const [postExchange, { loading: loadingPostExchange }] =
    useMutation(POST_EXCHANGE);

  const handleChangeBinanceApiKey = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      setBinanceApiKey(value);
    },
    [],
  );

  const handleChangeBinanceApiSecret = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      setBinanceApiSecret(value);
    },
    [],
  );

  const handleChangeOkxApiKey = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      setOkxApiKey(value);
    },
    [],
  );

  const handlePostExchange = async () => {
    try {
      await postExchange({
        variables: {
          binanceApiKey: binanceApikey,
          binanceApiSecret: binanceApiSecret,
          okxApiKey: okxApiKey,
        },
      });

      notification.success({
        message: 'Success',
        description: 'Connect to exchange account successfully!',
      });
    } catch {
      //
    }
  };

  useEffect(() => {
    if (
      getSettingData?.getSetting?.exchange &&
      Array.isArray(getSettingData.getSetting.exchange) &&
      getSettingData.getSetting.exchange.length > 0
    ) {
      getSettingData.getSetting.exchange.forEach((ex) => {
        if (ex?.exchangeId === ExchangeId.BINANCE) {
          setBinanceApiKey(ex?.apiKey || '');
          setBinanceApiSecret(ex?.apiSecret || '');
        }

        if (ex?.exchangeId === ExchangeId.OKX) {
          setOkxApiKey(ex?.apiKey || '');
        }
      });
    }
  }, [getSettingData?.getSetting?.exchange]);

  const isInitialUI = loadingGetSettingData;
  const isLoading = loadingPostExchange;

  return (
    <Access>
      <Card
        headStyle={{ textAlign: 'left' }}
        bodyStyle={{ textAlign: 'left' }}
        title={<Title level={4}>Portfolio</Title>}
        id="#portfolio"
        actions={[
          <Button
            icon={<SaveOutlined />}
            loading={loadingPostExchange}
            key="save"
            type="primary"
            onClick={handlePostExchange}
          >
            Save
          </Button>,
        ]}
      >
        <Spin spinning={isLoading} tip="Loading...">
          <Skeleton active loading={isInitialUI} paragraph={{ rows: 10 }}>
            <Flex vertical gap={60}>
              <div>
                <Title level={5}>
                  Connect Binance account{' '}
                  <Tooltip
                    title={
                      <span>
                        Please refer to{' '}
                        <a
                          href="https://www.binance.com/en/support/faq/how-to-create-api-keys-on-binance-360002502072"
                          rel="noopener noreferrer"
                        >
                          this page
                        </a>{' '}
                        regarding API key creation.
                      </span>
                    }
                    trigger="click"
                  >
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Title>
                <Text type="secondary">
                  Securely sync assets from your Binance account with using API
                  key.
                </Text>

                <div style={{ marginTop: '0.5rem' }}>
                  <Text strong>API key: </Text>
                </div>
                <div style={{ maxWidth: 400, marginTop: 8, marginBottom: 16 }}>
                  <Input.Password
                    placeholder="Binance API key"
                    allowClear
                    value={binanceApikey}
                    prefix={
                      <Image
                        src={BNB.src}
                        alt="BNB"
                        width={BNB.width}
                        height={BNB.height}
                        draggable={false}
                      />
                    }
                    onChange={handleChangeBinanceApiKey}
                  />
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <Text strong>API secret: </Text>
                </div>
                <div style={{ maxWidth: 400, marginTop: 8 }}>
                  <Input.Password
                    placeholder="Binance API secret"
                    allowClear
                    value={binanceApiSecret}
                    prefix={
                      <Image
                        src={BNB.src}
                        alt="BNB"
                        width={BNB.width}
                        height={BNB.height}
                        draggable={false}
                      />
                    }
                    onChange={handleChangeBinanceApiSecret}
                  />
                </div>
              </div>
              <div>
                <Title level={5}>Connect OKX account</Title>
                <Text type="secondary">
                  Securely sync assets from your OKX account with using API key.
                </Text>

                <div style={{ maxWidth: 400, marginTop: 16 }}>
                  <Input.Password
                    placeholder="OKX API key"
                    value={okxApiKey}
                    allowClear
                    disabled
                    prefix={
                      <Image
                        src={OKX}
                        alt="OKX"
                        width={BNB.width}
                        height={BNB.height}
                        draggable={false}
                      />
                    }
                    onChange={handleChangeOkxApiKey}
                  />
                </div>
              </div>
            </Flex>
          </Skeleton>
        </Spin>
      </Card>
    </Access>
  );
}

export default PortfolioSetting;
