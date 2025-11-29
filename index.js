import React, { useState, useEffect, useRef } from "react";

// ==========================================
// 1. HELPER: ImageLoader (Web - Robust)
// ==========================================
const ImageLoader = ({
  source,
  className,
  fallbackSource,
  style,
  alt = "Image",
}) => {
  const [error, setError] = useState(false);

  // Handle React Native style {uri: '...'} OR direct string '...'
  const imageSrc = typeof source === "string" ? source : source?.uri;
  const finalSrc = !error && imageSrc ? imageSrc : fallbackSource;

  if (!finalSrc || error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center text-gray-400 text-xs font-medium ${className}`}
        style={style}
      >
        <span>No Image</span>
      </div>
    );
  }

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
// 2. COMPONENT: BannerComponent (Web)
// ==========================================
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
    <div className="w-full relative group my-4 select-none">
      <div className="relative w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm h-64 sm:h-72 md:h-80 lg:h-96">
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
              <ImageLoader source={item.image} className="w-full h-full" />
            </div>
          ))}
        </div>
        {showDots && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10 pointer-events-none">
            {bannerData.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className="pointer-events-auto rounded-full transition-all duration-300 h-2 shadow-sm border border-white/20"
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

// ==========================================
// 3. COMPONENT: CategoryComponent (Web)
// ==========================================
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
      className={`cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
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
            className="rounded-full overflow-hidden shadow-md bg-white border-2 border-white"
            style={{ width: circleSize, height: circleSize }}
          >
            <ImageLoader
              source={item.image}
              className="w-full h-full hover:opacity-90"
            />
          </div>
          {showTitle && (
            <span className="mt-2 text-xs text-center font-semibold text-gray-700 truncate w-20">
              {item.name}
            </span>
          )}
          {showCount && (
            <span className="text-[10px] text-gray-500 font-medium">
              {item.count}
            </span>
          )}
        </Item>
      );
    }
    // Vertical
    if (layout === "vertical") {
      return (
        <Item
          item={item}
          className="flex flex-row items-center p-3 mb-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md"
        >
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
            <ImageLoader source={item.image} className="w-full h-full" />
          </div>
          <div className="ml-4 flex flex-col">
            <span className="font-bold text-gray-800 text-sm">{item.name}</span>
            {item.description && (
              <span className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                {item.description}
              </span>
            )}
            {showCount && (
              <span className="text-[10px] text-gray-400 mt-1 font-medium bg-gray-50 px-2 py-0.5 rounded-full w-fit">
                {item.count} items
              </span>
            )}
          </div>
        </Item>
      );
    }
    // Horizontal / Grid
    return (
      <Item
        item={item}
        className="flex flex-col items-center justify-start h-full"
      >
        <div className="w-full aspect-square rounded-xl overflow-hidden shadow-sm bg-gray-100 border border-gray-200 flex items-center justify-center p-2">
          <ImageLoader
            source={item.image}
            className="w-full h-full !object-contain mix-blend-multiply"
          />
        </div>
        {showTitle && (
          <span className="mt-2 text-[13px] text-center font-bold text-gray-800 line-clamp-2 w-full leading-tight">
            {item.name}
          </span>
        )}
        {showCount && (
          <span className="text-[10px] text-gray-500 mt-0.5">{item.count}</span>
        )}
      </Item>
    );
  };

  if (layout === "grid") {
    return (
      <div className="w-full p-2">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${numColumns}, minmax(0, 1fr))`,
          }}
        >
          {categoriesData.map((item, i) => (
            <div key={i} className="flex justify-center">
              {renderContent(item)}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (layout === "vertical") {
    return (
      <div className="flex flex-col w-full p-4 space-y-2">
        {categoriesData.map((item, i) => (
          <div key={i}>{renderContent(item)}</div>
        ))}
      </div>
    );
  }
  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-4 px-2">
      <div className="flex pl-2">
        {categoriesData.map((item, i) => (
          <div key={i}>{renderContent(item)}</div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. COMPONENT: SaleCard (Web - Robust)
// ==========================================
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
        ended: false,
      };
    };
    setTimeRemaining(tick());
    const timer = setInterval(() => setTimeRemaining(tick()), 1000);
    return () => clearInterval(timer);
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
    const Separator = () => (
      <span className="text-[#FF6B6B] font-bold text-xl pt-1">:</span>
    );

    return (
      <div className="bg-[#FFF3CD] p-3 rounded-xl mt-3 flex flex-col items-center border border-yellow-100 w-full shadow-sm">
        <span className="text-[10px] uppercase font-bold text-[#856404] mb-2 tracking-[0.15em]">
          {timerLabel}
        </span>
        <div className="flex items-start gap-1.5">
          {timeRemaining.d > 0 && (
            <>
              <TimeBox val={timeRemaining.d} label="D" />
              <Separator />
            </>
          )}
          <TimeBox val={timeRemaining.h} label="H" /> <Separator />
          <TimeBox val={timeRemaining.m} label="M" /> <Separator />
          <TimeBox val={timeRemaining.s} label="S" />
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
        <span className="bg-[#4ECDC4] text-white text-xs font-bold px-3 py-1 rounded-full self-start mb-3 shadow-sm">
          {discount}
        </span>
      )}
      <RenderTimer />
      {primaryButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            primaryButton.onPress && primaryButton.onPress();
          }}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-md active:scale-95 transform duration-100"
        >
          {primaryButton.text}
        </button>
      )}
    </div>
  );

  return (
    <div
      onClick={onPress}
      className={`group relative overflow-hidden rounded-2xl shadow-sm border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-md my-2
        ${horizontal ? "flex flex-row" : "flex flex-col"} 
        ${isDark ? "bg-gray-900 border-gray-800" : "bg-white"}`}
    >
      {!minimalMode && imagePosition === "top" && (
        // FIX: Ensure container has explicit height or falls back to 'h-48'
        <div
          className={`${
            horizontal ? "w-2/5" : "w-full"
          } overflow-hidden relative`}
          style={{ height: imageStyle?.height || "192px", ...imageStyle }}
        >
          <ImageLoader
            source={image}
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

export { BannerComponent, CategoryComponent, SaleCard };
