import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC } from "react";
import Carousel from "react-native-reanimated-carousel";
import CustomText from "./CustomText";
import { useNavigation } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";

const SLIDER_WIDTH = Dimensions.get("screen").width;
const ITEM_HEIGHT = Dimensions.get('screen').height;

const carouselData = [
  {
    title: "Top Universities in Australia",
    subtitle: "Discover leading institutions and pave your path to success.",
    image: require("@assets/images/education.png"),
    screen: "Universities",
  },
  {
    title: "Trending Courses in Australia",
    subtitle: "Unlock endless opportunities with globally acclaimed programs.",
    image: require("@assets/images/education2.png"),
    screen: "Courses",
  },
];

const renderItem = ({ item }) => {
  const { navigate } = useNavigation<any>();
  return (
    <View style={styles.featuredCard}>
      <View style={styles.featuredContent}>
        <CustomText style={styles.featuredTitle} heading={item.title} />
        <CustomText style={styles.featuredSubtitle} heading={item.subtitle} />
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigate(item.screen)}
        >
          <CustomText style={[styles.exploreButtonText]} heading="Explore" />
        </TouchableOpacity>
      </View>
      <Image source={item.image} style={styles.featuredImage} />
    </View>
  );
};

const CarouselComponent: FC = () => {
  return (
    <View style={styles.carouselContainer}>
      <Carousel
        data={carouselData}
        width={SLIDER_WIDTH}
        height={ITEM_HEIGHT/3.5}
        autoPlay={true}
        scrollAnimationDuration={2000}
        renderItem={renderItem}
      />
    </View>
  );
};

export default CarouselComponent;

const styles = StyleSheet.create({
  carouselContainer: {
    alignItems: "center",
  },
  featuredCard: {
    backgroundColor: "#F0FDFA",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  featuredContent: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: RFValue(18),
    marginBottom: 8,
  },
  featuredSubtitle: {
    fontSize: RFValue(14),
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  featuredImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  exploreButton: {
    backgroundColor: "#13478b",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  exploreButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: RFValue(14),
  },
});
