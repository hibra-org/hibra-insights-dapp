import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { GET_SETTING, POST_EXCHANGE } from '@/adapters/setting';
import Access from '@/components/common/access';
import { ExchangeId } from '@/utils/constants';
import { PLACEHOLDER_IMAGE } from '@/utils/helpers/common.helper';
import { SaveOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import { App, Button, Card, Flex, Input, Spin, Typography } from 'antd';
import BNB from 'cryptocurrency-icons/svg/icon/bnb.svg';

import OKX from '../../../../public/features/setting/okx.svg';

const { Title, Text } = Typography;

function PortfolioSetting() {
  const [binanceApikey, setBinanceApiKey] = useState<string>();
  const [okxApiKey, setOkxApiKey] = useState<string>();
  const { notification } = App.useApp();

  const { data: getSettingData } = useQuery(GET_SETTING);

  const [postExchange, { loading: loadingPostExchange }] =
    useMutation(POST_EXCHANGE);

  const handleChangeBinanceApiKey = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      setBinanceApiKey(value);
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
        }

        if (ex?.exchangeId === ExchangeId.OKX) {
          setOkxApiKey(ex?.apiKey || '');
        }
      });
    }
  }, [getSettingData?.getSetting?.exchange]);

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
        <Spin spinning={loadingPostExchange}>
          <Flex vertical gap={60}>
            <div>
              <Title level={5}>Connect Binance account</Title>
              <Text type="secondary">
                Securely sync assets from your Binance account with using API
                key.
              </Text>

              <div style={{ maxWidth: 400, marginTop: 16 }}>
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
                      placeholder={PLACEHOLDER_IMAGE}
                      draggable={false}
                    />
                  }
                  onChange={handleChangeBinanceApiKey}
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
                  placeholder="Binance API key"
                  value={okxApiKey}
                  allowClear
                  prefix={
                    <Image
                      src={OKX}
                      alt="OKX"
                      width={BNB.width}
                      height={BNB.height}
                      placeholder={PLACEHOLDER_IMAGE}
                      draggable={false}
                    />
                  }
                  onChange={handleChangeOkxApiKey}
                />
              </div>
            </div>
          </Flex>
        </Spin>
      </Card>
    </Access>
  );
}

export default PortfolioSetting;
