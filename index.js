import React, { useState, useEffect, useRef } from "react";

// --- CONSTANTS ---
const DEFAULT_IMAGE = "https://via.placeholder.com/400x300?text=No+Image";

// ==========================================
// 1. HELPER: ImageLoader
// ==========================================
const ImageLoader = ({
  source,
  className,
  fallbackSource = DEFAULT_IMAGE,
  style,
  alt = "Image",
}) => {
  const [error, setError] = useState(false);
  const finalSrc =
    !error && (typeof source === "string" ? source : source?.uri)
      ? source
      : fallbackSource;

  return (
    <div
      className={`relative overflow-hidden bg-gray-50 ${className}`}
      style={style}
    >
      <img
        src={finalSrc}
        alt={alt}
        className="w-full h-full object-cover block"
        onError={() => setError(true)}
      />
    </div>
  );
};

// ==========================================
// 2. HELPER: Shared UI Elements
// ==========================================
const Heading = ({
  title,
  subtitle,
  align = "left",
  size = "lg",
  className = "",
  subtitleClassName = "",
}) => {
  const alignClass =
    {
      left: "text-left items-start",
      center: "text-center items-center",
      right: "text-right items-end",
    }[align] || "text-left items-start";
  const sizeClass =
    {
      sm: "text-base",
      md: "text-lg",
      lg: "text-xl md:text-2xl",
      xl: "text-2xl md:text-3xl",
    }[size] || "text-xl";
  return (
    <div className={`flex flex-col mb-4 ${alignClass} ${className}`}>
      <h2 className={`font-bold text-gray-900 leading-tight ${sizeClass}`}>
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-sm text-gray-500 mt-1 font-medium ${subtitleClassName}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

const Section = ({
  children,
  className = "",
  padding = "p-4",
  margin = "mb-6",
}) => <div className={`${padding} ${margin} ${className}`}>{children}</div>;

const ButtonComponent = ({
  text = "Button",
  onPress,
  backgroundColor = "#FF6B6B",
  textColor = "#FFF",
}) => (
  <button
    onClick={onPress}
    className="w-full py-4 rounded-xl shadow-md font-bold text-lg transition-transform active:scale-95 hover:opacity-90 flex items-center justify-center my-2"
    style={{ backgroundColor, color: textColor }}
  >
    {text}
  </button>
);

// ==========================================
// 3. COMPONENT: BannerComponent (Hybrid: UI + Logic)
// ==========================================
const BannerComponent = ({
  bannerData = [],
  apiUrl,
  autoplay = true,
  autoplayInterval = 3000,
  onBannerPress,
}) => {
  const [data, setData] = useState(bannerData);
  const [index, setIndex] = useState(0);
  const timer = useRef(null);

  // --- LOGIC: Fetch if apiUrl is provided ---
  useEffect(() => {
    if (!apiUrl) return;
    const fetchData = async () => {
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
    fetchData();
  }, [apiUrl]);

  // --- LOGIC: Autoplay ---
  useEffect(() => {
    if (autoplay && data.length > 1) {
      timer.current = setTimeout(
        () => setIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1)),
        autoplayInterval
      );
    }
    return () => clearTimeout(timer.current);
  }, [index, autoplay, autoplayInterval, data.length]);

  if (!data.length) return null;

  return (
    <Section padding="p-0">
      <div className="w-full relative group my-4 select-none">
        <div className="relative w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm h-64 sm:h-72 md:h-80 lg:h-96">
          <div
            className="flex h-full w-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {data.map((item, i) => (
              <div
                key={i}
                className="w-full flex-none h-full relative cursor-pointer"
                onClick={() => onBannerPress && onBannerPress(item)}
              >
                <div className="w-full h-full rounded-xl overflow-hidden">
                  <ImageLoader source={item.image} className="w-full h-full" />
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10 pointer-events-none">
            {data.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className="pointer-events-auto rounded-full transition-all duration-300 h-2 shadow-sm border border-white/20"
                style={{
                  width: index === i ? "24px" : "8px",
                  backgroundColor: index === i ? "#a1127f" : "rgba(0,0,0,0.3)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

// ==========================================
// 4. COMPONENT: CategoryComponent (Hybrid)
// ==========================================
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
      } catch (e) {
        console.error(e);
      }
    };
    fetchCats();
  }, [apiUrl]);

  if (!data.length) return null;

  return (
    <Section>
      <Heading title="Shop by Category" />
      <div className="w-full px-4 py-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6">
          {data.map((item, i) => (
            <div
              key={i}
              onClick={() => onCategoryPress && onCategoryPress(item)}
              className="cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.03] hover:border-gray-300 flex flex-col items-center p-4"
            >
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                <ImageLoader
                  source={item.image}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <span className="mt-3 text-base font-semibold text-gray-800 text-center">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

// ==========================================
// 5. COMPONENT: SaleCard (Pure UI - used by DealOfTheDay)
// ==========================================
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
      if (diff < 0) return { ended: true };
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
        <div className="bg-gray-400 text-white text-xs px-3 py-1 rounded-full mt-2 inline-block font-bold">
          SALE ENDED
        </div>
      );
    const TimeBox = ({ val, label }) => (
      <div className="flex flex-col items-center bg-white rounded-md shadow-sm min-w-[36px] py-1.5 px-1 border border-gray-100">
        <span className="text-[#FF6B6B] font-bold text-lg leading-none">
          {String(val).padStart(2, "0")}
        </span>
        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
          {label}
        </span>
      </div>
    );
    return (
      <div className="bg-[#FFF3CD] p-3 rounded-xl mt-3 flex flex-col items-center border border-yellow-100 w-full shadow-sm">
        <span className="text-[10px] uppercase font-bold text-[#856404] mb-2 tracking-[0.15em]">
          {timerLabel}
        </span>
        <div className="flex items-start gap-1.5">
          <TimeBox val={timeRemaining.d} label="D" />{" "}
          <span className="text-[#FF6B6B] font-bold text-xl pt-1">:</span>
          <TimeBox val={timeRemaining.h} label="H" />{" "}
          <span className="text-[#FF6B6B] font-bold text-xl pt-1">:</span>
          <TimeBox val={timeRemaining.m} label="M" />{" "}
          <span className="text-[#FF6B6B] font-bold text-xl pt-1">:</span>
          <TimeBox val={timeRemaining.s} label="S" />
        </div>
      </div>
    );
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-sm border border-gray-100 bg-white flex flex-col my-2">
      <div
        className="w-full overflow-hidden relative"
        style={{ height: "192px" }}
      >
        <ImageLoader
          source={image}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-center">
        {title && (
          <h3 className="text-lg font-bold mb-2 leading-tight text-gray-900">
            {title}
          </h3>
        )}
        {discount && (
          <span className="bg-[#4ECDC4] text-white text-xs font-bold px-3 py-1 rounded-full self-start mb-3 shadow-sm">
            {discount}
          </span>
        )}
        <RenderTimer />
        {primaryButton && (
          <button
            onClick={primaryButton.onPress}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-md active:scale-95"
          >
            {primaryButton.text}
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 6. COMPONENT: DealOfTheDay (Hybrid - Wrapper for SaleCard)
// ==========================================
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
      <Heading
        title="Deal of the Day"
        subtitle="Expires Soon!"
        subtitleClassName="text-red-500 font-bold animate-pulse"
      />
      <SaleCard
        image={deal.image}
        showTimer={true}
        timerLabel="SALE ENDS IN"
        endTime={new Date(Date.now() + 172800000).toISOString()}
        title={deal.title}
        discount={`FLAT ${deal.discount}% OFF`}
        primaryButton={{
          text: "ORDER NOW",
          onPress: () => alert("Added to cart!"),
        }}
      />
    </Section>
  );
};

// ==========================================
// 7. COMPONENT: ProductCard (Pure UI)
// ==========================================
const ProductCard = ({
  image,
  brand,
  title,
  price,
  originalPrice,
  discount,
  onPress,
  onHeartPress,
  imageStyle,
}) => (
  <div
    onClick={onPress}
    className="group relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all hover:shadow-md w-full mb-3"
  >
    <div
      className="relative w-full overflow-hidden h-48 sm:h-64"
      style={imageStyle}
    >
      <ImageLoader
        source={image}
        className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        style={{ objectFit: imageStyle?.objectFit || "cover" }}
      />
      {discount && (
        <div className="absolute top-0 left-0 bg-[#FF5252] text-white text-[10px] font-bold px-2 py-1 rounded-br-lg z-10">
          {discount}
        </div>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onHeartPress && onHeartPress();
        }}
        className="absolute top-2 right-2 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 text-gray-600 hover:text-red-500"
      >
        ♥
      </button>
    </div>
    <div className="p-3">
      {brand && (
        <div className="text-xs text-gray-500 font-semibold mb-1">{brand}</div>
      )}
      <h3
        className="text-sm font-bold text-gray-900 truncate mb-2"
        title={title}
      >
        {title}
      </h3>
      <div className="flex items-center gap-2">
        <span className="text-base font-bold text-gray-900">₹{price}</span>
        {originalPrice && (
          <span className="text-xs text-gray-400 line-through decoration-gray-400">
            ₹{originalPrice}
          </span>
        )}
      </div>
    </div>
  </div>
);

// ==========================================
// 8. COMPONENT: ProductList (Hybrid - Logic + GridContainer)
// ==========================================
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
              const variant = item.variants?.[0];
              return {
                id: item.productId,
                title: item.productName,
                brand: item.brandName,
                price: variant ? variant.sellingPrice : "N/A",
                originalPrice: variant ? variant.mrp : null,
                discount: variant ? `${variant.discountPercentage}% OFF` : null,
                image:
                  variant?.productVariantImages?.[0]?.documentUrl ||
                  DEFAULT_IMAGE,
              };
            })
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProd();
  }, [apiUrl]);

  if (loading)
    return (
      <div className="p-10 text-center text-gray-400">Loading Products...</div>
    );

  return (
    <Section>
      <Heading
        title="Just For You"
        size="md"
        className="ml-2 text-gray-500 uppercase"
      />
      <div className="flex flex-wrap -mx-2 px-2">
        {products.map((item) => (
          <div
            key={item.id}
            className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/4 px-2 mb-4"
          >
            <ProductCard
              {...item}
              onHeartPress={() => alert(`Wishlisted ${item.title}`)}
              onPress={() => alert(`Clicked ${item.title}`)}
            />
          </div>
        ))}
      </div>
    </Section>
  );
};

// ==========================================
// 9. EXPORTS
// ==========================================
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
};
