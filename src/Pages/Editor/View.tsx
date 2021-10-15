import { useEditor } from '../../Hooks/Editor.hook';
import mjml2html from 'mjml-browser';
import css from './Editor.module.scss';
import Scrollbars from 'react-custom-scrollbars-2';
import { htmlProcessor } from '../../Utils/htmlProcessor';
import { Editor } from '../../Components/Mods/Editor';
import { Add, Remove } from '../../Utils/operations';
import { useDragAndDropUniqueId } from '../../Hooks/Drag.hook';
import '../../Assets/Css/ckeditorOverride.css';
import '../../Assets/Css/quillOverride.css';
import { InlineEditor } from '../../Components/Mods/CustomInlineEditor';
import styled from 'styled-components';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';
import { useCkeditor } from '../../Hooks/Ckeditor.hook';
import { useCallback, useEffect } from 'react';
import { UndoRedo } from '../../Components/UndoRedo';
import _ from 'lodash';
import { UNDOREDO } from '../../Utils/undoRedo';

interface ViewProps {}

const DesignContainer = styled('div')`
  .editor-active {
    :focus {
      outline: none;
    }
  }
`;

export const View = (props: ViewProps) => {
  const { mjmlJson, setMjmlJson } = useEditor();
  const { getId } = useDragAndDropUniqueId();
  const { setActive, active } = useHtmlWrapper();
  const {
    setDelActive,
    copy,
    drag: { setIsColumn, isColumn },
  } = useCkeditor();
  const { setCopyActive } = copy;

  useEffect(() => {
    UNDOREDO.print();
  }, [mjmlJson]);

  const undoCallback = () => {
    const action = UNDOREDO.undoAction(mjmlJson);
    if (action) {
      setMjmlJson({ ...action });
      setDelActive(false);
      setCopyActive(false);
    }
  };
  const redoCallback = () => {
    const action = UNDOREDO.redoAction(mjmlJson);
    if (action) {
      setMjmlJson({ ...action });
      setDelActive(false);
      setCopyActive(false);
    }
  };

  const onDragOver = useCallback(
    (e: any) => {
      if (active) {
        setActive(null);
      }
      e.preventDefault();
    },
    [setActive, active]
  );

  const onDrop = (e: any) => {
    e.preventDefault();
    if (isColumn) {
      setIsColumn(false);
    }
    setIsColumn(false);
    let config = JSON.parse(e.dataTransfer.getData('config'));
    if (config && config.mode && config.mode === 'move' && config['config']) {
      // remove the item old position, before inserting in new position
      Remove({
        uniqueClassName: config.uniqueClassName,
        mjmlJson,
        setMjmlJson,
        setActive,
        setDelActive,
        setCopyActive,
        movement: true,
      });
      console.info(`operation move: onDrop -> removed previous instance 
      of config :'${config.uniqueClassName}'`);
      config = config['config'];
    }
    Add({
      target: e.nativeEvent.target,
      droppedConfig: config,
      mjmlJson,
      setMjmlJson,
      uid: getId,
    });
  };

  return (
    <Scrollbars style={{ height: '100%' }}>
      <Editor />
      <InlineEditor />
      <UndoRedo undoCallback={undoCallback} redoCallback={redoCallback} />
      <DesignContainer
        className={`${css.viewHolder} mjml-wrapper mjml-tag identifier-mj-body`}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        {htmlProcessor(mjml2html(mjmlJson).html)}
      </DesignContainer>
    </Scrollbars>
  );
};
