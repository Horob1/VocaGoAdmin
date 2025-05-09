import { MantineProvider } from "@mantine/core";
import { I18nextProvider } from "react-i18next";
import i18n from "./locales";

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <MantineProvider>
        <></>
      </MantineProvider>
    </I18nextProvider>
  );
}
