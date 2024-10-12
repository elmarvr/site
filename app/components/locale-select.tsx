import * as React from "react";
import { useLocation, useNavigate } from "@remix-run/react";
import { FormattedDisplayName, useIntl } from "react-intl";
import { i18n } from "i18n.config";
import { Select, SelectContentProps } from "./ui/select";
import { $i18n } from "~/i18n/route";

interface LocaleSelectProps extends Pick<SelectContentProps, "side" | "align"> {
  children: React.ReactNode;
}

const LocaleSelect = ({
  children,
  side = "bottom",
  align = "end",
}: LocaleSelectProps) => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Select
      value={intl.locale}
      onValueChange={(locale) => {
        navigate($i18n(location.pathname, locale));
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
