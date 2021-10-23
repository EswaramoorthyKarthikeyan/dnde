import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useEditor } from '../Hooks/Editor.hook';
import { Background } from './Mods/Background';
import { Width } from './Mods/WidthHeight';
import { Title as TitleMod } from './Mods/Title';

export const BODY_PATH = 'children[1]';

export const HEAD_PATH = 'children[0]';

const BodyContainer = styled.div`
  padding: 16px 0px;
  .title {
    font-size: 14px;
    font-weight: 600;
  }
  .props-container {
    padding: 16px;
  }
`;

const BodyAttributes = () => {
  const { mjmlJson } = useEditor();
  const [titleIndex, setTitleIndex] = useState<number>(-1);
  const [cssIndex, setCssIndex] = useState<number>(-1);

  useEffect(() => {
    // taking advantage of the fact that head tag always has a static path
    if (mjmlJson && mjmlJson['children'] && mjmlJson['children'].length > 0) {
      let headConfig = mjmlJson['children'][0];
      if (
        headConfig &&
        headConfig['tagName'] &&
        headConfig['tagName'].includes('head') &&
        headConfig.children &&
        headConfig.children.length > 0
      ) {
        let children = headConfig.children;
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (child && child.tagName && child.tagName.includes('title')) {
            setTitleIndex(i);
          } else if (child.tagName.includes('style')) {
            setCssIndex(i);
          }
        }
      }
    }
  }, []);

  return (
    <BodyContainer>
      <Title title="Body Properties" />
      <div className="props-container">
        <Width activePath={BODY_PATH} />
        <Background activePath={BODY_PATH} label="Body Background:" />
      </div>
      <Title title="Head Properties" />

      <div className="props-container">
        <TitleMod itemIndex={titleIndex} />
      </div>
    </BodyContainer>
  );
};

const Title = ({ title }: { title: string }) => {
  return (
    <Row justify="center">
      <Col span={24} style={{ textAlign: 'center' }}>
        <span className="title">{title}</span>
      </Col>
    </Row>
  );
};

export { BodyAttributes };
