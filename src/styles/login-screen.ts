import { screenHeight, screenWidth } from "@utils/Scaling";
import { Dimensions, TextStyle, ViewStyle } from "react-native";
const { width, height } = Dimensions.get("window");
import { RFValue } from "react-native-responsive-fontsize";

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

export const LoginScreenStyles:LoginScreenStylesType = {
	Container: {
		flex: 1,
		justifyContent: "flex-end",
	},
	Logo: {
		Box: {
			alignItems: "center",
			justifyContent: "center",
			paddingBottom: 20,
		},
		ImageHolder: {
			height: screenHeight*0.15,
			width: screenWidth*1,
		},
		Title: {
			fontFamily: "NunitoSans_900Black",
			fontSize: RFValue(24),
		},
		SubTitle: {
			fontFamily: "Regular",
			fontSize:RFValue(16),
		},
		Version: {
			fontFamily: "Regular",
			fontSize: RFValue(9),
		},
	},
	FormBox: {
		paddingHorizontal: 20,
		paddingTop: 30,
		paddingBottom: 20,
		// borderTopLeftRadius: 30,
		// borderTopRightRadius: 30,
	},
	Stacks: {
		flex: 1,
		justifyContent: "flex-end",
		paddingHorizontal: 20,
	},
};

