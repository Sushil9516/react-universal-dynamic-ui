import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
  StatusBar,
} from "react-native";
import Carousel from "pinar";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";

const { width, height } = Dimensions.get("window");

/* ============================================================================
   1. IMAGE LOADER (Native Equivalent of Web ImageLoader)
   ============================================================================ */
const ImageLoader = ({
  source,
  style,
  fallbackSource,
  resizeMode = "cover",
}) => {
  const [loading, setLoading] = useState(true);
  const finalSource = source?.uri ? source : fallbackSource;

  return (
    <View style={[style, { overflow: "hidden" }]}>
      <Image
        source={finalSource}
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

/* ============================================================================
   2. BANNER COMPONENT (Native Equivalent)
   ============================================================================ */
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
        {bannerData.map((item, i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.9}
            style={stylesBanner.slide}
            onPress={() => onBannerPress && onBannerPress(item)}
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
  wrapper: { height: height * 0.25, marginVertical: 12 },
  slide: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: {
    width: width - 32,
    height: height * 0.25,
    borderRadius: 12,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  activeDot: { width: 24, height: 8, borderRadius: 4 },
});

/* ============================================================================
      3. CATEGORY COMPONENT (Fixed: 3 Columns, Proper Styling)
  ============================================================================ */
const CategoryComponent = ({
  categoriesData = [],
  layout = "horizontal",
  onCategoryPress,
  numColumns = 3,
  showTitle = true,
  showCount = false,
  circleSize = 70,
  imageSize = 80,
}) => {
  const renderGrid = (item) => {
    const screenPadding = 32;
    const totalGapSize = (numColumns - 1) * 8;
    const availableWidth = width - screenPadding - totalGapSize;
    const itemWidth = availableWidth / numColumns;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{ width: itemWidth, alignItems: "center", marginBottom: 12 }}
        onPress={() => onCategoryPress && onCategoryPress(item)}
      >
        <View style={catStyles.gridImgWrap}>
          <ImageLoader
            style={{ width: "100%", height: "100%" }}
            source={{ uri: item.image }}
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
  };

  // 2. Circle Renderer
  const renderCircle = (item) => (
    <TouchableOpacity
      activeOpacity={0.8}
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
        />
      </View>

      {showTitle && (
        <Text numberOfLines={1} style={catStyles.circleTitle}>
          {item.name}
        </Text>
      )}
    </TouchableOpacity>
  );

  // 3. Vertical Renderer (List view)
  const renderVertical = (item) => (
    <TouchableOpacity
      activeOpacity={0.8}
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
        />
      </View>

      <View style={{ flex: 1, marginLeft: 12 }}>
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
          <Text style={{ fontSize: 11, marginTop: 4 }}>{item.count} items</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  // 4. Horizontal Renderer (Square cards)
  const renderHorizontal = (item) => (
    <TouchableOpacity
      activeOpacity={0.8}
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
        }}
      >
        <ImageLoader
          style={{ width: "100%", height: "100%" }}
          source={{ uri: item.image }}
        />
      </View>

      {showTitle && (
        <Text numberOfLines={2} style={catStyles.horizTitle}>
          {item.name}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (layout === "grid") {
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          paddingHorizontal: 0,
          gap: 8,
        }}
      >
        {categoriesData.map((item, index) => (
          <View key={index}>{renderGrid(item)}</View>
        ))}
      </View>
    );
  }

  if (layout === "vertical") {
    return (
      <View style={{ padding: 0 }}>
        {categoriesData.map((item, index) => (
          <View key={index}>{renderVertical(item)}</View>
        ))}
      </View>
    );
  }

  const isCircle = layout === "circle";
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginHorizontal: -8 }}
      contentContainerStyle={{ paddingHorizontal: 20 }}
    >
      {categoriesData.map((item, index) => (
        <View key={index}>
          {isCircle ? renderCircle(item) : renderHorizontal(item)}
        </View>
      ))}
    </ScrollView>
  );
};

// --- STYLES FOR CATEGORY COMPONENT ---
const catStyles = StyleSheet.create({
  // Circle Layout Styles
  circleItem: { marginRight: 16, alignItems: "center" },
  circleImgWrap: { overflow: "hidden", backgroundColor: "#ccc" },
  circleTitle: {
    marginTop: 8,
    fontSize: 12,
    textAlign: "center",
    maxWidth: 80,
    color: "#333",
  },

  // Grid Layout Styles
  gridImgWrap: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#b4b6c1ff",
  },
  gridTitle: { marginTop: 8, fontSize: 12, textAlign: "center", color: "#333" },

  // Vertical Layout Styles
  vertItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  // Horizontal Layout Styles
  horizItem: { marginRight: 16, alignItems: "center" },
  horizTitle: {
    marginTop: 8,
    fontSize: 12,
    textAlign: "center",
    maxWidth: 100,
    color: "#333",
  },

  // Shared
  countText: { fontSize: 10, textAlign: "center", color: "#666", marginTop: 2 },
});

/* ============================================================================
   4. SALE CARD (Native Equivalent)
   ============================================================================ */
const SaleCard = ({
  brand,
  category,
  title,
  discount,
  image,
  badge,
  primaryButton,
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

  useEffect(() => {
    if (!showTimer || !endTime) return;

    const tick = () => {
      const diff = new Date(endTime) - new Date();
      if (diff <= 0) return { ended: true };

      return {
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        ended: false,
      };
    };

    setTimeRemaining(tick());
    const interval = setInterval(() => setTimeRemaining(tick()), 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const RenderTimer = () => {
    if (!showTimer || !timeRemaining) return null;

    if (timeRemaining.ended) {
      return (
        <View style={saleStyles.ended}>
          <Text style={{ color: "white" }}>SALE ENDED</Text>
        </View>
      );
    }

    return (
      <View style={saleStyles.timerWrap}>
        <Text style={saleStyles.timerLabel}>{timerLabel}</Text>
        <View style={saleStyles.timerRow}>
          {["d", "h", "m", "s"].map((unit) => (
            <View key={unit} style={saleStyles.timerBox}>
              <Text style={saleStyles.timerValue}>
                {String(timeRemaining[unit]).padStart(2, "0")}
              </Text>
              <Text style={saleStyles.timerUnit}>{unit.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const Content = () => (
    <View style={saleStyles.content}>
      {(category || brand) && (
        <Text style={saleStyles.subTitle}>
          {brand} {category}
        </Text>
      )}

      {title && (
        <Text style={[saleStyles.title, { color: isDark ? "#fff" : "#000" }]}>
          {title}
        </Text>
      )}

      {discount && (
        <View style={saleStyles.discount}>
          <Text style={saleStyles.discountText}>{discount}</Text>
        </View>
      )}

      <RenderTimer />

      {primaryButton && (
        <TouchableOpacity
          onPress={primaryButton.onPress}
          style={saleStyles.btnPrimary}
        >
          <Text style={saleStyles.btnPrimaryText}>{primaryButton.text}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        saleStyles.card,
        horizontal && { flexDirection: "row" },
        { backgroundColor: isDark ? "#1C1C1E" : "#fff" },
      ]}
    >
      {!minimalMode && imagePosition === "top" && (
        <Image
          source={{ uri: image }}
          style={[
            saleStyles.img,
            horizontal && { width: "40%", height: "100%" },
            imageStyle,
          ]}
        />
      )}

      {!imageOnly && <Content />}

      {badge && (
        <View style={saleStyles.badge}>
          <Text style={saleStyles.badgeText}>{badge}</Text>
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
  },
  img: { width: "100%", height: 180 },
  content: { padding: 16, flex: 1 },
  subTitle: { color: "#666", fontSize: 12, marginBottom: 4 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 6 },

  discount: {
    backgroundColor: "#4ECDC4",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  discountText: { color: "#fff", fontWeight: "bold", fontSize: 12 },

  timerWrap: {
    backgroundColor: "#FFF3CD",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  timerLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 4,
  },
  timerRow: { flexDirection: "row", gap: 6 },
  timerBox: {
    backgroundColor: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
    minWidth: 30,
    alignItems: "center",
  },
  timerValue: { color: "#FF6B6B", fontSize: 16, fontWeight: "bold" },
  timerUnit: { color: "#aaa", fontSize: 9, fontWeight: "bold" },
  ended: {
    backgroundColor: "#95A5A6",
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    alignItems: "center",
  },

  btnPrimary: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 12,
    alignItems: "center",
  },
  btnPrimaryText: { color: "#fff", fontWeight: "bold" },

  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#FF6B6B",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
});

/* ============================================================================
   5. PRODUCT CARD (Native Equivalent of Web version)
   ============================================================================ */
const ProductCard = ({
  image,
  brand,
  title,
  price,
  originalPrice,
  discount,
  onPress,
  onHeartPress,
  currencySymbol = "₹",
  imageStyle,
  style, // <--- ACCEPT STYLE PROP HERE
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      // Pass the 'style' prop last to allow overrides
      style={[pcStyles.card, style]}
    >
      <View style={[pcStyles.imgWrap, imageStyle]}>
        <ImageLoader source={{ uri: image }} style={pcStyles.image} />

        {discount && (
          <View style={pcStyles.discountTag}>
            <Text style={pcStyles.discountText}>{discount}</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={(e) => onHeartPress && onHeartPress()}
          activeOpacity={0.8}
          style={pcStyles.heartBtn}
        >
          <Text style={pcStyles.heartIcon}>♡</Text>
        </TouchableOpacity>
      </View>

      <View style={pcStyles.content}>
        {brand && <Text style={pcStyles.brand}>{brand}</Text>}
        <Text numberOfLines={1} style={pcStyles.title}>
          {title}
        </Text>

        <View style={pcStyles.priceRow}>
          <Text style={pcStyles.price}>
            {currencySymbol}
            {price}
          </Text>
          {originalPrice && (
            <Text style={pcStyles.originalPrice}>
              {currencySymbol}
              {originalPrice}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const pcStyles = StyleSheet.create({
  card: {
    // --- CHANGED HERE ---
    width: "48%", // Use percentage to fit 2 items (leaving 4% gap)
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
    marginBottom: 16, // Vertical spacing
    // marginHorizontal is REMOVED to prevent wrapping issues
  },
  imgWrap: {
    width: "100%",
    height: 180, // Reduced slightly for better portrait proportions
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },

  discountTag: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#FF5252",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomRightRadius: 8,
  },
  discountText: { color: "#fff", fontSize: 10, fontWeight: "700" },

  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  heartIcon: { fontSize: 16, color: "#FF6B6B" },

  content: { padding: 12 },
  brand: { fontSize: 11, color: "#777", marginBottom: 2 },
  title: { fontSize: 14, fontWeight: "700", marginBottom: 4 },

  priceRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  price: { fontSize: 16, fontWeight: "700" },
  originalPrice: {
    fontSize: 12,
    color: "#888",
    textDecorationLine: "line-through",
  },
});

/* ============================================================================
   6. BUTTON COMPONENT
   ============================================================================ */
const ButtonComponent = ({
  text = "Button",
  onPress,
  backgroundColor = "#FF6B6B",
  textColor = "#fff",
}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={[btnStyles.btn, { backgroundColor }]}
  >
    <Text style={[btnStyles.text, { color: textColor }]}>{text}</Text>
  </TouchableOpacity>
);

const btnStyles = StyleSheet.create({
  btn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 8,
  },
  text: { fontSize: 16, fontWeight: "700" },
});

/* ============================================================================
   7. GRID CONTAINER (Native Equivalent)
   ============================================================================ */
const GridContainer = ({
  data = [],
  renderItem,
  keyExtractor,
  children,
  style = {},
  emptyComponent,
  numColumns = 2,
  itemSpacing = 12,
}) => {
  if (!data || data.length === 0) {
    return (
      <View style={[{ padding: 8 }, style]}>{children || emptyComponent}</View>
    );
  }

  return (
    <FlatList
      data={data}
      numColumns={numColumns}
      keyExtractor={(item, index) =>
        keyExtractor ? keyExtractor(item) : index.toString()
      }
      renderItem={({ item, index }) => (
        <View style={{ flex: 1 / numColumns, padding: itemSpacing / 2 }}>
          {renderItem({ item, index })}
        </View>
      )}
      contentContainerStyle={[{ padding: itemSpacing / 2 }, style]}
    />
  );
};

/* ============================================================================
   8. HEADING (Native Equivalent)
   ============================================================================ */
const Heading = ({
  title,
  subtitle,
  align = "left",
  size = "lg",
  style = {},
}) => {
  const alignMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  };

  const sizeMap = {
    sm: 16,
    md: 18,
    lg: 20,
    xl: 24,
  };

  return (
    <View style={[{ marginBottom: 16, alignItems: alignMap[align] }, style]}>
      <Text
        style={{ fontSize: sizeMap[size], fontWeight: "700", color: "#000" }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

/* ============================================================================
   9. SECTION WRAPPER (Native Equivalent)
   ============================================================================ */
const Section = ({ children, padding = 16, marginBottom = 20, style = {} }) => (
  <View style={[{ padding, marginBottom }, style]}>{children}</View>
);

/* ============================================================================
      10. PAGE WRAPPER (Modern & Safe)
      ============================================================================ */
const PageWrapper = ({
  children,
  backgroundColor = "#F9FAFB",
  noScroll = false,
}) => {
  const Container = noScroll ? View : ScrollView;
  const scrollProps = noScroll
    ? { style: { flex: 1 } }
    : {
        showsVerticalScrollIndicator: false,
        contentContainerStyle: { paddingBottom: 40 },
      };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor }}
      edges={["top", "left", "right"]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <Container {...scrollProps}>{children}</Container>
    </SafeAreaView>
  );
};

export {
  BannerComponent,
  CategoryComponent,
  SaleCard,
  ProductCard,
  ButtonComponent,
  GridContainer,
  Heading,
  Section,
  PageWrapper,
};
