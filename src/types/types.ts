import { ViewStyle, TextStyle } from "react-native";

interface LogoStyles {
  Box: ViewStyle;
  ImageHolder: ViewStyle;
  Title: TextStyle;
  SubTitle: TextStyle;
  Version: TextStyle;
}

interface LoginScreenStylesType {
  Container: ViewStyle;
  Logo: LogoStyles;
  FormBox: ViewStyle;
  Stacks: ViewStyle;
}

export type { LoginScreenStylesType };
