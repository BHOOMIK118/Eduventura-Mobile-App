import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { THEME } from "../utils/ui";
import { useUI } from "./UIContext";
import { TouchableOpacity, View } from "react-native";
import CustomText from "@components/CustomText";
import { RFValue } from "react-native-responsive-fontsize";

interface CustomBottomSheetContextTypes {
  showBottomSheet: (view: ReactNode, snapPoints?: string[]) => void;
  hideBottomSheet: () => void;
  isVisible: boolean;
}

const CustomBottomSheetContext =
  createContext<CustomBottomSheetContextTypes | null>(null);

export const CustomBottomSheetProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [content, setContent] = useState<ReactNode>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { theme } = useUI();
  const [snapPoints, setSnapPoints] = useState<string[]>();

  const showBottomSheet = (view: ReactNode, snapPoints: string[]=[]) => {
    setContent(view);
    if (snapPoints) {
      setSnapPoints(snapPoints);
    }
    if (bottomSheetRef.current) {
      bottomSheetRef.current.present();
    }
    setIsVisible(true);
  };

  const hideBottomSheet = () => {
    console.log("hello");
    if (bottomSheetRef?.current) {
      bottomSheetRef.current.dismiss();
      // setContent(null);
      // setIsVisible(false);
    }
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        {...props}
      />
    ),
    []
  );

  return (
    <CustomBottomSheetContext.Provider
      value={{ isVisible, showBottomSheet, hideBottomSheet }}
    >
      {children}
      {isVisible && (
        <BottomSheetModalProvider>
          <BottomSheetModal
            enableContentPanningGesture={false}
            ref={bottomSheetRef}
            enableDynamicSizing
            handleIndicatorStyle={{
              backgroundColor: THEME[theme].disabled,
              width: "20%",
            }}
            backgroundStyle={{ backgroundColor: THEME[theme].background }}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
          >
            {content}
          </BottomSheetModal>
        </BottomSheetModalProvider>
      )}
    </CustomBottomSheetContext.Provider>
  );
};

export const useCustomBottomSheet = (): CustomBottomSheetContextTypes => {
  const context = useContext(CustomBottomSheetContext);
  if (!context) {
    throw new Error(
      "useCustomBottomSheet must be used within a CustomBottomSheetProvider"
    );
  }
  return context;
};
