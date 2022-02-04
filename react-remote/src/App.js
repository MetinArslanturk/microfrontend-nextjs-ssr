import React from "react";
import Button from "./components/RemoteButton";
import { useTranslation } from "react-i18next";

const App = ({eventBus}) => {
  const { t } = useTranslation();
  return (
    <>
    <p>I am remote app and showing this text from common i18n: {t('test text')}</p>
    <p>I am remote app and showing this text from second i18n: {t('second text', {ns: 'second'})}</p>
      <Button eventBus={eventBus} />
    </>
  );
};

export default App;
