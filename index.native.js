import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  ScrollView,
  Animated,
} from "react-native";
import Carousel from "pinar";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";

const { width, height } = Dimensions.get("window");

// --- 1. Shared Image Loader ---
const ImageLoader = ({
  source,
  style,
  fallbackSource,
  resizeMode = "cover",
}) => {
  const [loading, setLoading] = useState(true);
  const finalSource = source?.uri ? source : fallbackSource;

  return (
    // FIX: style is applied to View to ensure borderRadius + overflow works
    <View style={[style, { overflow: "hidden" }]}>
      <Image
        source={finalSource}
        // FIX: Image fills the container perfectly
        style={[
          StyleSheet.absoluteFill,
          { width: undefined, height: undefined },
        ]}
        resizeMode={resizeMode}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
      {loading && (
        <ShimmerPlaceholder
          style={[StyleSheet.absoluteFill, style]}
          LinearGradient={LinearGradient}
        />
      )}
    </View>
  );
};

// --- 2. Banner Component ---
const BannerComponent = ({
  bannerData = [],
  autoplay = true,
  autoplayInterval = 4000,
  showDots = true,
  activeDotColor = "#a1127f",
  dotColor = "rgba(0,0,0,0.3)",
  onBannerPress,
}) => {
  if (!bannerData.length) return null;
  return (
    <View style={stylesBanner.wrapper}>
      <Carousel
        autoplay={autoplay}
        autoplayInterval={autoplayInterval}
        loop
        showsControls={false}
        dotStyle={
          showDots
            ? { ...stylesBanner.dot, backgroundColor: dotColor }
            : { display: "none" }
        }
        activeDotStyle={
          showDots
            ? { ...stylesBanner.activeDot, backgroundColor: activeDotColor }
            : { display: "none" }
        }
      >
        {bannerData.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            onPress={() => onBannerPress && onBannerPress(item)}
            style={stylesBanner.slide} // Center content
          >
            <ImageLoader
              style={stylesBanner.image}
              source={{ uri: item.image }}
            />
          </TouchableOpacity>
        ))}
      </Carousel>
    </View>
  );
};

const stylesBanner = StyleSheet.create({
  wrapper: { height: height * 0.25, marginVertical: 10 },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // Ensures image is centered
  },
  image: {
    width: width - 32, // FIX: Subtract margin so corners are visible!
    height: height * 0.25,
    borderRadius: 12, // Rounded corners
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    height: 8,
    borderRadius: 4,
  },
});

// --- 3. Category Component ---
const CategoryComponent = ({
  categoriesData = [],
  layout = "horizontal",
  onCategoryPress,
  numColumns = 3,
  showTitle = true,
  showCount = false,
  imageSize = 80,
  circleSize = 70,
  fallbackImage,
}) => {
  const renderItem = (item) => {
    // Circle
    if (layout === "circle") {
      return (
        <TouchableOpacity
          style={catStyles.circleItem}
          onPress={() => onCategoryPress && onCategoryPress(item)}
        >
          <View
            style={[
              catStyles.circleImgWrap,
              {
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
              },
            ]}
          >
            <ImageLoader
              style={{ width: "100%", height: "100%" }}
              source={{ uri: item.image }}
              fallbackSource={fallbackImage}
            />
          </View>
          {showTitle && (
            <Text numberOfLines={1} style={catStyles.circleTitle}>
              {item.name}
            </Text>
          )}
          {showCount && item.count && (
            <Text style={catStyles.countText}>{item.count}</Text>
          )}
        </TouchableOpacity>
      );
    }
    // Grid
    if (layout === "grid") {
      const itemWidth =
        (width - 48) / numColumns - ((numColumns - 1) * 8) / numColumns;
      return (
        <TouchableOpacity
          style={{ width: itemWidth, alignItems: "center", marginBottom: 8 }}
          onPress={() => onCategoryPress && onCategoryPress(item)}
        >
          <View style={catStyles.gridImgWrap}>
            <ImageLoader
              style={{ width: "100%", height: "100%" }}
              source={{ uri: item.image }}
              fallbackSource={fallbackImage}
            />
          </View>
          {showTitle && (
            <Text numberOfLines={2} style={catStyles.gridTitle}>
              {item.name}
            </Text>
          )}
          {showCount && item.count && (
            <Text style={catStyles.countText}>{item.count} items</Text>
          )}
        </TouchableOpacity>
      );
    }
    // Vertical
    if (layout === "vertical") {
      return (
        <TouchableOpacity
          style={catStyles.vertItem}
          onPress={() => onCategoryPress && onCategoryPress(item)}
        >
          <View
            style={{
              width: imageSize,
              height: imageSize,
              borderRadius: 10,
              overflow: "hidden",
              backgroundColor: "#ccc",
            }}
          >
            <ImageLoader
              style={{ width: "100%", height: "100%" }}
              source={{ uri: item.image }}
              fallbackSource={fallbackImage}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 12, justifyContent: "center" }}>
            {showTitle && (
              <Text numberOfLines={1} style={{ fontWeight: "bold" }}>
                {item.name}
              </Text>
            )}
            {item.description && (
              <Text numberOfLines={2} style={{ fontSize: 12, marginTop: 4 }}>
                {item.description}
              </Text>
            )}
            {showCount && item.count && (
              <Text style={{ fontSize: 11, marginTop: 4 }}>
                {item.count} items
              </Text>
            )}
          </View>
        </TouchableOpacity>
      );
    }
    // Default Horizontal
    return (
      <TouchableOpacity
        style={catStyles.horizItem}
        onPress={() => onCategoryPress && onCategoryPress(item)}
      >
        <View
          style={{
            width: imageSize,
            height: imageSize,
            borderRadius: 12,
            overflow: "hidden",
            backgroundColor: "#fff",
            elevation: 3,
          }}
        >
          <ImageLoader
            style={{ width: "100%", height: "100%" }}
            source={{ uri: item.image }}
            fallbackSource={fallbackImage}
          />
        </View>
        {showTitle && (
          <Text numberOfLines={2} style={catStyles.horizTitle}>
            {item.name}
          </Text>
        )}
        {showCount && item.count && (
          <Text style={catStyles.countText}>{item.count}</Text>
        )}
      </TouchableOpacity>
    );
  };

  if (layout === "horizontal" || layout === "circle") {
    return (
      <View style={{ paddingVertical: 12 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {categoriesData.map((item, index) => (
            <View key={index}>{renderItem(item)}</View>
          ))}
        </ScrollView>
      </View>
    );
  }
  if (layout === "grid") {
    return (
      <View
        style={{
          paddingHorizontal: 16,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {categoriesData.map((item, index) => (
          <View key={index}>{renderItem(item)}</View>
        ))}
      </View>
    );
  }
  return (
    <View style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
      {categoriesData.map((item, index) => (
        <View key={index}>{renderItem(item)}</View>
      ))}
    </View>
  );
};

const catStyles = StyleSheet.create({
  circleItem: { marginRight: 16, alignItems: "center" },
  circleImgWrap: { elevation: 3, backgroundColor: "#ccc", overflow: "hidden" },
  circleTitle: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 12,
    maxWidth: 80,
  },
  countText: { fontSize: 10, textAlign: "center", color: "#666" },
  gridImgWrap: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#ccc",
  },
  gridTitle: { marginTop: 8, textAlign: "center", fontSize: 12 },
  vertItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
  horizItem: { marginRight: 16, alignItems: "center" },
  horizTitle: {
    marginTop: 8,
    textAlign: "center",
    maxWidth: 100,
    fontSize: 12,
  },
});

// --- 4. Sale Card Component ---
const SaleCard = ({
  brand,
  category,
  title,
  discount,
  image,
  badge,
  primaryButton,
  secondaryButton,
  showTimer = false,
  endTime,
  timerLabel = "Ends in",
  horizontal = false,
  imagePosition = "top",
  onPress,
  theme = "light",
  minimalMode = false,
  imageOnly = false,
  imageStyle,
}) => {
  const isDark = theme === "dark";
  const [timeRemaining, setTimeRemaining] = useState(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!showTimer || !endTime) return;
    const calc = () => {
      const dist = new Date(endTime).getTime() - new Date().getTime();
      if (dist < 0) return { ended: true };
      return {
        d: Math.floor(dist / 86400000),
        h: Math.floor((dist % 86400000) / 3600000),
        m: Math.floor((dist % 3600000) / 60000), // ✅ FIXED: Variable name correct
        s: Math.floor((dist % 60000) / 1000),
        ended: false,
      };
    };
    setTimeRemaining(calc());
    const t = setInterval(() => setTimeRemaining(calc()), 1000);
    return () => clearInterval(t);
  }, [endTime]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const RenderTimer = () => {
    if (!showTimer || !timeRemaining) return null;
    if (timeRemaining.ended)
      return (
        <View style={saleStyles.ended}>
          <Text style={{ color: "white" }}>Ended</Text>
        </View>
      );
    return (
      <Animated.View
        style={[saleStyles.timerWrap, { transform: [{ scale: pulseAnim }] }]}
      >
        <Text
          style={{
            fontSize: 10,
            marginBottom: 4,
            fontWeight: "bold",
            color: "#856404",
          }}
        >
          {timerLabel}
        </Text>
        <View style={{ flexDirection: "row", gap: 6 }}>
          {["d", "h", "m", "s"].map((unit) => (
            <View key={unit} style={saleStyles.timerBox}>
              <Text
                style={{ fontWeight: "bold", color: "#FF6B6B", fontSize: 16 }}
              >
                {String(timeRemaining[unit]).padStart(2, "0")}
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  color: "#aaa",
                  fontWeight: "bold",
                  marginTop: 0,
                }}
              >
                {unit.toUpperCase()}
              </Text>
            </View>
          ))}
        </View>
      </Animated.View>
    );
  };

  const Content = () => (
    <View style={{ padding: 16, flex: 1 }}>
      {(category || brand) && (
        <Text style={{ color: "#666", fontSize: 12, marginBottom: 4 }}>
          {brand} {category}
        </Text>
      )}
      {title && (
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: isDark ? "#fff" : "#000",
          }}
        >
          {title}
        </Text>
      )}
      {discount && (
        <View style={saleStyles.discount}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>
            {discount}
          </Text>
        </View>
      )}

      <RenderTimer />

      {(primaryButton || secondaryButton) && (
        <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
          {primaryButton && (
            <TouchableOpacity
              onPress={primaryButton.onPress}
              style={[saleStyles.btn, { backgroundColor: "#007AFF" }]}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {primaryButton.text}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        saleStyles.card,
        horizontal && { flexDirection: "row" },
        { backgroundColor: isDark ? "#1C1C1E" : "#FFF" },
      ]}
    >
      {!minimalMode && imagePosition === "top" && (
        <Image
          source={{ uri: image }}
          style={[
            saleStyles.img,
            horizontal && { width: "40%", height: "100%" },
            imageStyle, // ✅ Pass custom styles
          ]}
        />
      )}
      {!imageOnly && <Content />}
      {badge && (
        <View style={saleStyles.badge}>
          <Text style={{ color: "#fff", fontSize: 10, fontWeight: "bold" }}>
            {badge}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const saleStyles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginVertical: 8,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: "#fff",
  },
  img: { width: "100%", height: 180 },
  discount: {
    backgroundColor: "#4ECDC4",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  timerWrap: {
    backgroundColor: "#FFF3CD",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  timerBox: {
    backgroundColor: "#FFF",
    padding: 4,
    borderRadius: 4,
    minWidth: 32,
    alignItems: "center",
  },
  ended: {
    backgroundColor: "#95A5A6",
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  btn: { flex: 1, padding: 10, borderRadius: 6, alignItems: "center" },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
});

export { BannerComponent, CategoryComponent, SaleCard };
