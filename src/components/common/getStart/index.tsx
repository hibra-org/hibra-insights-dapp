import React from 'react';
import { Svgbackgrou, SvgImg } from '@/figma';
import { Button } from 'antd';

const GetStart: React.FC = () => {
  return (
    <div
      //   gap="middle"
      style={{ margin: 'auto', backgroundColor: '#000000' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '100%' }}>
          <div
            style={{
              height: 98,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                background:
                  'linear-gradient(91.06deg, #FF1CF7 2.26%, #00F0FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                MozBackgroundClip: 'text',
                fontWeight: 700,
                fontSize: 80,
                textAlign: 'center',
              }}
            >
              A Fast Blockchain.
            </span>
          </div>
          <div
            style={{
              height: 98,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 80,
                fontWeight: 700,
                color: '#fff',
              }}
            >
              Scalable AI.
            </span>
          </div>
          <div
            style={{
              marginTop: 18,
              textAlign: 'center',
              height: 99,
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 500, color: '#fff' }}>
              Our technology performing fast blockchain (120K TPS) and it has
              guaranteed
              <br /> AI-based data security. Proof of Stake, its consensus
              algorithm enables
              <br /> unlimited speeds.
            </span>
          </div>

          <div
            style={{
              marginTop: 32,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              type="primary"
              style={{
                fontWeight: 400,
                fontSize: 20,
                color: '#fff',
                background: 'linear-gradient(180deg, #497CFF 0%, #001664 100%)',
                height: 70,
                width: 182,
                border: 0,
              }}
            >
              Get started
            </Button>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: 0,
              width: '100%',
            }}
          >
            <img
              style={{
                width: '100%',
                zIndex: 1,
                position: 'absolute',
                bottom: 0,
                right: 0,
              }}
              src="ImgGetstart.png"
              alt=""
            />
            <div style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
              <SvgImg></SvgImg>
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
              <Svgbackgrou></Svgbackgrou>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStart;
