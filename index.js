import React, { useState, useEffect, useRef } from "react";

// --- 1. Shared Image Loader (Web) ---
const ImageLoader = ({ source, className, fallbackSource, alt = "Image" }) => {
  const [loading, setLoading] = useState(true);
  const src = source?.uri || fallbackSource;
  return (
    <div className={`relative overflow-hidden bg-gray-200 ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setLoading(false)}
      />
      {loading && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse" />
      )}
    </div>
  );
};

// --- 2. Banner Component (Web) ---
const BannerComponent = ({
  bannerData = [],
  autoplay = true,
  autoplayInterval = 4000,
  showDots = true,
  activeDotColor = "#a1127f",
  dotColor = "rgba(0,0,0,0.3)",
  onBannerPress,
}) => {
  const [index, setIndex] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (autoplay && bannerData.length > 1) {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setIndex((prev) => (prev === bannerData.length - 1 ? 0 : prev + 1));
      }, autoplayInterval);
    }
    return () => timer.current && clearTimeout(timer.current);
  }, [index, autoplay, autoplayInterval, bannerData.length]);

  if (!bannerData.length) return null;

  return (
    <div className="w-full relative group my-4">
      <div className="relative w-full overflow-hidden rounded-xl bg-gray-100 h-64 sm:h-72 md:h-80 lg:h-96">
        <div
          className="flex h-full w-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {bannerData.map((item, i) => (
            <div
              key={i}
              className="w-full flex-none h-full relative cursor-pointer"
              onClick={() => onBannerPress && onBannerPress(item)}
            >
              <ImageLoader
                source={{ uri: item.image }}
                className="w-full h-full"
              />
            </div>
          ))}
        </div>
        {showDots && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10 pointer-events-none">
            {bannerData.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className="pointer-events-auto rounded-full transition-all duration-300 h-2 shadow-sm"
                style={{
                  width: index === i ? "24px" : "8px",
                  backgroundColor: index === i ? activeDotColor : dotColor,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- 3. Category Component (Web) ---
const CategoryComponent = ({
  categoriesData = [],
  layout = "horizontal",
  onCategoryPress,
  numColumns = 3,
  showTitle = true,
  showCount = false,
  circleSize = 70,
}) => {
  const Item = ({ item, children, className }) => (
    <div
      className={`cursor-pointer transition-transform hover:scale-105 ${className}`}
      onClick={() => onCategoryPress && onCategoryPress(item)}
    >
      {children}
    </div>
  );

  const renderContent = (item) => {
    // Circle
    if (layout === "circle") {
      return (
        <Item item={item} className="flex flex-col items-center mr-4 shrink-0">
          <div
            className="rounded-full overflow-hidden shadow-md bg-white border border-gray-100"
            style={{ width: circleSize, height: circleSize }}
          >
            <ImageLoader
              source={{ uri: item.image }}
              className="w-full h-full"
            />
          </div>
          {showTitle && (
            <span className="mt-2 text-xs text-center font-medium text-gray-700 truncate w-20">
              {item.name}
            </span>
          )}
          {showCount && (
            <span className="text-[10px] text-gray-500">{item.count}</span>
          )}
        </Item>
      );
    }
    // Vertical
    if (layout === "vertical") {
      return (
        <Item
          item={item}
          className="flex flex-row items-center p-3 mb-3 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            <ImageLoader
              source={{ uri: item.image }}
              className="w-full h-full"
            />
          </div>
          <div className="ml-4 flex flex-col">
            <span className="font-bold text-gray-800">{item.name}</span>
            {item.description && (
              <span className="text-xs text-gray-500 mt-1 line-clamp-2">
                {item.description}
              </span>
            )}
            {showCount && (
              <span className="text-xs text-gray-400 mt-1">
                {item.count} items
              </span>
            )}
          </div>
        </Item>
      );
    }
    // Horizontal / Grid
    return (
      <Item item={item} className="flex flex-col items-center mr-4 shrink-0">
        <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm bg-white border border-gray-100">
          <ImageLoader source={{ uri: item.image }} className="w-full h-full" />
        </div>
        {showTitle && (
          <span className="mt-2 text-xs text-center font-medium text-gray-800 line-clamp-2 w-24">
            {item.name}
          </span>
        )}
        {showCount && (
          <span className="text-[10px] text-gray-500">{item.count}</span>
        )}
      </Item>
    );
  };

  if (layout === "grid") {
    return (
      <div
        className="grid gap-4 w-full p-4"
        style={{ gridTemplateColumns: `repeat(${numColumns}, minmax(0, 1fr))` }}
      >
        {categoriesData.map((item, i) => (
          <div key={i} className="flex justify-center">
            {renderContent(item)}
          </div>
        ))}
      </div>
    );
  }
  if (layout === "vertical") {
    return (
      <div className="flex flex-col w-full p-4">
        {categoriesData.map((item, i) => (
          <div key={i}>{renderContent(item)}</div>
        ))}
      </div>
    );
  }
  // Horizontal Scroll
  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-4 px-4">
      <div className="flex">
        {categoriesData.map((item, i) => (
          <div key={i}>{renderContent(item)}</div>
        ))}
      </div>
    </div>
  );
};

// --- 4. Sale Card Component (Web) ---
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
}) => {
  const isDark = theme === "dark";
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!showTimer || !endTime) return;
    const tick = () => {
      const diff = new Date(endTime) - new Date();
      if (diff < 0) return { ended: true };
      return {
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / 1000 / 60) % 60),
        s: Math.floor((diff / 1000) % 60),
      };
    };
    const timer = setInterval(() => setTimeLeft(tick()), 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const RenderTimer = () => {
    if (!showTimer || !timeLeft) return null;
    if (timeLeft.ended)
      return (
        <div className="bg-gray-400 text-white text-xs px-2 py-1 rounded mt-2 inline-block">
          Ended
        </div>
      );
    return (
      <div className="bg-yellow-50 p-2 rounded-lg mt-2 flex items-center gap-2 border border-yellow-100 animate-pulse">
        <span className="text-[10px] uppercase font-bold text-yellow-700">
          {timerLabel}
        </span>
        <div className="flex gap-1 text-red-500 font-mono font-bold text-sm">
          {timeLeft.d > 0 && <span>{timeLeft.d}d</span>}
          <span>{timeLeft.h}h</span>
          <span>{timeLeft.m}m</span>
          <span>{timeLeft.s}s</span>
        </div>
      </div>
    );
  };

  const Content = () => (
    <div className="p-4 flex-1 flex flex-col justify-center">
      {(category || brand) && (
        <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
          {brand} {category}
        </div>
      )}
      {title && (
        <h3
          className={`text-lg font-bold mb-2 leading-tight ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h3>
      )}
      {discount && (
        <span className="bg-teal-400 text-white text-xs font-bold px-2 py-1 rounded-full self-start mb-2">
          {discount}
        </span>
      )}
      <RenderTimer />
      {primaryButton && (
        <button
          onClick={primaryButton.onPress}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {primaryButton.text}
        </button>
      )}
    </div>
  );

  return (
    <div
      onClick={onPress}
      className={`group relative overflow-hidden rounded-xl shadow-sm border border-gray-100 cursor-pointer transition-all hover:shadow-md my-2
        ${horizontal ? "flex flex-row" : "flex flex-col"} 
        ${isDark ? "bg-gray-900 border-gray-800" : "bg-white"}`}
    >
      {!minimalMode && imagePosition === "top" && (
        <div
          className={`${horizontal ? "w-2/5" : "w-full"} h-48 overflow-hidden`}
        >
          <ImageLoader
            source={{ uri: image }}
            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      {!imageOnly && <Content />}
      {badge && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
          {badge}
        </div>
      )}
    </div>
  );
};

// --- 5. Product Card Component (Web) ---
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
}) => {
  return (
    <div
      onClick={onPress}
      className="group relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all hover:shadow-md w-full max-w-[200px]"
    >
      {/* Image Section */}
      <div className="relative h-64 w-full overflow-hidden">
        <ImageLoader
          source={image}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-0 left-0 bg-[#FF5252] text-white text-[10px] font-bold px-2 py-1 rounded-br-lg z-10">
            {discount}
          </div>
        )}

        {/* Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onHeartPress && onHeartPress();
          }}
          className="absolute top-2 right-2 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors z-10 text-gray-600 hover:text-red-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>

      {/* Details Section */}
      <div className="p-3">
        {brand && (
          <div className="text-xs text-gray-500 font-semibold mb-1">
            {brand}
          </div>
        )}
        <h3
          className="text-sm font-bold text-gray-900 truncate mb-2"
          title={title}
        >
          {title}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-gray-900">
            {currencySymbol}
            {price}
          </span>
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through decoration-gray-400">
              {currencySymbol}
              {originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// --- 6. Generic Button Component (Reusable) ---
const ButtonComponent = ({
  text = "Button",
  onPress,
  backgroundColor = "#FF6B6B",
  textColor = "#FFF",
}) => {
  return (
    <button
      onClick={onPress}
      className="w-full py-4 rounded-xl shadow-md font-bold text-lg transition-transform active:scale-95 hover:opacity-90 flex items-center justify-center my-2"
      style={{ backgroundColor, color: textColor }}
    >
      {text}
    </button>
  );
};

export {
  BannerComponent,
  CategoryComponent,
  SaleCard,
  ProductCard,
  ButtonComponent,
};
