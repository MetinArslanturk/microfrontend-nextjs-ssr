import React, {useEffect} from "react";
import Button from "./components/RemoteButton";
import { useTranslation } from "react-i18next";
import appConfig from "../public/metadata.json";

const App = ({eventBus}) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    let unsub;

    if (eventBus) {
      const callback = (type, data) => {
        if (type === "change_locale") {
          Object.keys(data.resources[data.newLocale]).forEach((ns) => {
            i18n.addResources(
              data.newLocale,
              ns,
              data.resources[data.newLocale][ns]
            );
          });
          i18n.changeLanguage(data.newLocale);
        }
      };
      unsub = eventBus.on(`Container_to_${appConfig.appName}`, callback);

      setTimeout(() => {
        eventBus.publish(`to_Container`, 'greetings', 'Hello container app. I am your remote-child app.' )
      }, 2000)
    }
    return () => {
      unsub && unsub();
    };
  }, [eventBus]);

  return (
    <>
    <p>I am remote app and showing this text from common i18n: {t('test text')}</p>
    <p>I am remote app and showing this text from second i18n: {t('second text', {ns: 'second'})}</p>
      <Button eventBus={eventBus} />
    </>
  );
};

export default App;
