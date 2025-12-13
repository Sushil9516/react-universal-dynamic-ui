import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel from "pinar"; // Ensure pinar is installed: npm install pinar
import LinearGradient from "react-native-linear-gradient"; // Ensure installed
import ShimmerPlaceholder from "react-native-shimmer-placeholder"; // Ensure installed

const { width, height } = Dimensions.get("window");
const DEFAULT_IMAGE = "https://via.placeholder.com/400x300?text=No+Image";

/* ============================================================================
   1. HELPER: ImageLoader
   ============================================================================ */
const ImageLoader = ({ source, style, resizeMode = "cover" }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const finalSource = !error && source?.uri ? source : { uri: DEFAULT_IMAGE };

  return (
    <View style={[style, { overflow: "hidden", backgroundColor: "#f0f0f0" }]}>
      <Image
        source={finalSource}
        style={[
          StyleSheet.absoluteFill,
          { width: undefined, height: undefined },
        ]}
        resizeMode={resizeMode}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
      {loading && !error && (
        <ShimmerPlaceholder
          style={[StyleSheet.absoluteFill, { width: "100%", height: "100%" }]}
          LinearGradient={LinearGradient}
        />
      )}
    </View>
  );
};

/* ============================================================================
   2. SHARED UI ELEMENTS
   ============================================================================ */
const Heading = ({
  title,
  subtitle,
  align = "left",
  size = "lg",
  style = {},
}) => {
  const alignMap = { left: "flex-start", center: "center", right: "flex-end" };
  const sizeMap = { sm: 16, md: 18, lg: 20, xl: 24 };
  return (
    <View
      style={[
        { marginBottom: 16, alignItems: alignMap[align] || "flex-start" },
        style,
      ]}
    >
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

const Section = ({ children, padding = 16, marginBottom = 20, style = {} }) => (
  <View style={[{ padding, marginBottom }, style]}>{children}</View>
);

const ButtonComponent = ({
  text,
  onPress,
  backgroundColor = "#FF6B6B",
  textColor = "#fff",
}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={{
      width: "100%",
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      marginVertical: 8,
      backgroundColor,
    }}
  >
    <Text style={{ fontSize: 16, fontWeight: "700", color: textColor }}>
      {text}
    </Text>
  </TouchableOpacity>
);

/* ============================================================================
   3. COMPONENT: BannerComponent (Hybrid)
   ============================================================================ */
const BannerComponent = ({
  bannerData = [],
  apiUrl,
  autoplay = true,
  onBannerPress,
}) => {
  const [data, setData] = useState(bannerData);

  useEffect(() => {
    if (!apiUrl) return;
    const fetchBanners = async () => {
      try {
        const res = await fetch(apiUrl);
        const json = await res.json();
        if (json.status === "SUCCESS") {
          setData(
            json.data.map((item) => ({
              id: item.BannerId,
              image: item.BannerImage?.[0]?.documentUrl || DEFAULT_IMAGE,
              title: item.BannerName,
            }))
          );
        }
      } catch (e) {
        setData([{ id: 0, image: DEFAULT_IMAGE, title: "Default" }]);
      }
    };
    fetchBanners();
  }, [apiUrl]);

  if (!data.length) return null;

  return (
    <View style={{ height: height * 0.25, marginVertical: 12 }}>
      <Carousel
        autoplay={autoplay}
        loop
        showsControls={false}
        activeDotStyle={{
          width: 24,
          height: 8,
          backgroundColor: "#a1127f",
          borderRadius: 8,
        }}
      >
        {data.map((item, i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.9}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={() => onBannerPress && onBannerPress(item)}
          >
            <ImageLoader
              style={{
                width: width - 32,
                height: height * 0.25,
                borderRadius: 8,
              }}
              source={{ uri: item.image }}
            />
          </TouchableOpacity>
        ))}
      </Carousel>
    </View>
  );
};

/* ============================================================================
   4. COMPONENT: CategoryComponent (Hybrid)
   ============================================================================ */
const CategoryComponent = ({
  categoriesData = [],
  apiUrl,
  onCategoryPress,
}) => {
  const [data, setData] = useState(categoriesData);

  useEffect(() => {
    if (!apiUrl) return;
    const fetchCats = async () => {
      try {
        const res = await fetch(apiUrl);
        const json = await res.json();
        if (json.status === "SUCCESS") {
          setData(
            json.data.map((item) => ({
              id: item.categoryId,
              name: item.categoryName,
              image: item.categoryImages?.[0]?.documentUrl || DEFAULT_IMAGE,
            }))
          );
        }
      } catch (e) {}
    };
    fetchCats();
  }, [apiUrl]);

  if (!data.length) return null;

  return (
    <Section>
      <Heading title="Shop by Category" />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {data.map((item, index) => {
          const widthPerItem = (width - 48) / 3;
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              style={{
                width: widthPerItem,
                alignItems: "center",
                marginBottom: 12,
              }}
              onPress={() => onCategoryPress && onCategoryPress(item)}
            >
              <View
                style={{
                  width: "100%",
                  aspectRatio: 1,
                  borderRadius: 12,
                  overflow: "hidden",
                  backgroundColor: "#eee",
                }}
              >
                <ImageLoader
                  style={{ width: "100%", height: "100%" }}
                  source={{ uri: item.image }}
                />
              </View>
              <Text
                numberOfLines={2}
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  textAlign: "center",
                  color: "#333",
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Section>
  );
};

/* ============================================================================
   5. COMPONENT: SaleCard (Pure UI)
   ============================================================================ */
const SaleCard = ({
  title,
  discount,
  image,
  showTimer,
  endTime,
  timerLabel = "Ends in",
  primaryButton,
}) => {
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
      };
    };
    setTimeRemaining(tick());
    const interval = setInterval(() => setTimeRemaining(tick()), 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const RenderTimer = () => {
    if (!showTimer || !timeRemaining) return null;
    if (timeRemaining.ended)
      return (
        <View
          style={{
            backgroundColor: "#95A5A6",
            padding: 8,
            borderRadius: 4,
            marginTop: 8,
          }}
        >
          <Text style={{ color: "white" }}>SALE ENDED</Text>
        </View>
      );
    return (
      <View
        style={{
          backgroundColor: "#FFF3CD",
          padding: 8,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <Text
          style={{
            fontSize: 10,
            fontWeight: "bold",
            color: "#856404",
            marginBottom: 4,
          }}
        >
          {timerLabel}
        </Text>
        <View style={{ flexDirection: "row", gap: 6 }}>
          {["d", "h", "m", "s"].map((u) => (
            <View
              key={u}
              style={{
                backgroundColor: "#fff",
                paddingHorizontal: 6,
                paddingVertical: 4,
                borderRadius: 4,
              }}
            >
              <Text style={{ color: "#FF6B6B", fontWeight: "bold" }}>
                {timeRemaining[u]}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        borderRadius: 12,
        marginVertical: 8,
        overflow: "hidden",
        elevation: 3,
        backgroundColor: "#fff",
      }}
    >
      <View style={{ width: "100%", height: 180 }}>
        <ImageLoader
          source={{ uri: image }}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 6 }}>
          {title}
        </Text>
        <View
          style={{
            backgroundColor: "#4ECDC4",
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 4,
            alignSelf: "flex-start",
            marginBottom: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>
            {discount}
          </Text>
        </View>
        <RenderTimer />
        {primaryButton && (
          <TouchableOpacity
            onPress={primaryButton.onPress}
            style={{
              backgroundColor: "#007AFF",
              paddingVertical: 10,
              borderRadius: 6,
              marginTop: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {primaryButton.text}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

/* ============================================================================
   6. COMPONENT: DealOfTheDay (Hybrid)
   ============================================================================ */
const DealOfTheDay = ({ apiUrl }) => {
  const [deal, setDeal] = useState(null);

  useEffect(() => {
    if (!apiUrl) return;
    const fetchDeal = async () => {
      try {
        const res = await fetch(apiUrl);
        const json = await res.json();
        if (json.status === "SUCCESS" && json.data.length > 0) {
          const item = json.data[0];
          setDeal({
            image: item.BannerImage?.[0]?.documentUrl || DEFAULT_IMAGE,
            title: item.BannerName,
            discount: item.Discount,
          });
        }
      } catch (e) {}
    };
    fetchDeal();
  }, [apiUrl]);

  if (!deal) return null;

  return (
    <Section>
      <Heading title="DEAL OF THE DAY" size="sm" subtitle="Expires Soon!" />
      <SaleCard
        image={deal.image}
        title={deal.title}
        discount={`FLAT ${deal.discount || "50%"} OFF`}
        showTimer={true}
        endTime={new Date(Date.now() + 172800000).toISOString()}
        primaryButton={{
          text: "ORDER NOW",
          onPress: () => console.log("Added"),
        }}
      />
    </Section>
  );
};

/* ============================================================================
   7. COMPONENT: ProductCard (Pure UI)
   ============================================================================ */
const ProductCard = ({
  image,
  brand,
  title,
  price,
  discount,
  onPress,
  style,
}) => (
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={onPress}
    style={[
      {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#eee",
        overflow: "hidden",
        marginBottom: 16,
      },
      style,
    ]}
  >
    <View style={{ width: "100%", height: 180 }}>
      <ImageLoader
        source={{ uri: image }}
        style={{ width: "100%", height: "100%" }}
      />
      {discount && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "#FF5252",
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderBottomRightRadius: 8,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
            {discount}
          </Text>
        </View>
      )}
    </View>
    <View style={{ padding: 12 }}>
      {brand && (
        <Text style={{ fontSize: 11, color: "#777", marginBottom: 2 }}>
          {brand}
        </Text>
      )}
      <Text
        numberOfLines={1}
        style={{ fontSize: 14, fontWeight: "700", marginBottom: 4 }}
      >
        {title}
      </Text>
      <Text style={{ fontSize: 16, fontWeight: "700" }}>₹{price}</Text>
    </View>
  </TouchableOpacity>
);

/* ============================================================================
   8. COMPONENT: ProductList (Hybrid)
   ============================================================================ */
const ProductList = ({ apiUrl }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!apiUrl) return;
    const fetchProd = async () => {
      try {
        const res = await fetch(apiUrl);
        const json = await res.json();
        if (json.status === "SUCCESS") {
          setProducts(
            json.data.map((item) => {
              const firstVariant = item.variants?.[0];
              return {
                id: item.productId,
                title: item.productName,
                brand: item.brandName,
                price: firstVariant ? firstVariant.sellingPrice : "N/A",
                discount: firstVariant
                  ? `${firstVariant.discountPercentage}% OFF`
                  : null,
                image:
                  firstVariant?.productVariantImages?.[0]?.documentUrl ||
                  DEFAULT_IMAGE,
              };
            })
          );
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchProd();
  }, [apiUrl]);

  if (loading) return <ActivityIndicator size="large" color="#a1127f" />;

  return (
    <Section>
      <Heading title="NEW ARRIVALS" size="sm" />
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={{ flex: 0.5, padding: 6 }}>
            <ProductCard
              image={item.image}
              brand={item.brand}
              title={item.title}
              price={item.price}
              discount={item.discount}
              onPress={() => console.log(item.title)}
            />
          </View>
        )}
      />
    </Section>
  );
};

/* ============================================================================
   9. PAGE WRAPPER
   ============================================================================ */
const PageWrapper = ({ children, backgroundColor = "#F9FAFB" }) => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor }}
      edges={["top", "left", "right"]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

/* ============================================================================
   10. EXPORTS (CRITICAL: Must export everything used in App.jsx)
   ============================================================================ */
export {
  BannerComponent,
  CategoryComponent,
  DealOfTheDay,
  ProductList,
  SaleCard,
  ProductCard,
  ButtonComponent,
  Heading,
  Section,
  PageWrapper,
};
