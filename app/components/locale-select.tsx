import * as React from "react";
import { FormattedDisplayName, useIntl } from "react-intl";
import { i18n } from "i18n.config";
import { Select, SelectContentProps } from "./ui/select";
import { useChangeLocale } from "~/i18n/react";
import { Locale } from "~/i18n/core";

interface LocaleSelectProps extends Pick<SelectContentProps, "side" | "align"> {
  children: React.ReactNode;
}

const LocaleSelect = ({
  children,
  side = "bottom",
  align = "end",
}: LocaleSelectProps) => {
  const intl = useIntl();
  const changeLocale = useChangeLocale();

  return (
    <Select
      value={intl.locale}
      onValueChange={(locale: Locale) => {
        changeLocale(locale);
      }}
    >
      <Select.Trigger asChild>{children}</Select.Trigger>

      <Select.Content side={side} align={align}>
        {i18n.locales.map((locale) => (
          <Select.Item key={locale} value={locale}>
            <FormattedDisplayName type="language" value={locale} />
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
};

export { LocaleSelect };
