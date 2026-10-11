import { useTranslation } from "react-i18next";

// ----------------------------------------------------------------------

const LANGS = [
  {
    value: "vi",
    label: "Việt Nam",
    icon: "/static/icons/ic_flag_vi.svg",
  },
  {
    value: "en",
    label: "English",
    icon: "/static/icons/ic_flag_en.svg",
  },
];

export default function useLocales() {
  const { i18n, t: translate } = useTranslation();
  const langStorage =
    typeof window !== "undefined" && localStorage.getItem("i18nextLng");
  const currentLang =
    LANGS.find((_lang) => _lang.value === langStorage) || LANGS[0];

  const handleChangeLanguage = (newlang: string) => {
    i18n.changeLanguage(newlang);
  };

  return {
    onChangeLang: handleChangeLanguage,
    translate,
    currentLang,
    allLang: LANGS,
  };
}
