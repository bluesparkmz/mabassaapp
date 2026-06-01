import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { ArrowLeft, Search, X } from "lucide-react-native";
import ScreenFixedHeader from "@/components/ScreenFixedHeader";
import FilterChips from "@/components/FilterChips";
import { BG_SOFT, BORDER, TEXT_MAIN, TEXT_SUB } from "@/theme";

/** Header estilo Job List: voltar + título + pesquisa + filtros */
export default function ListScreenHeader({
  insets,
  title,
  onBack,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Pesquisar...",
  filterOptions,
  selectedFilter,
  onFilterSelect,
  secondaryFilters,
  showFilterIcon = true,
  onFilterPress,
}) {
  const [searchOpen, setSearchOpen] = useState(Boolean(searchValue));

  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => {
    setSearchOpen(false);
    onSearchChange?.("");
  };

  return (
    <ScreenFixedHeader insets={insets} paddingBottom={12}>
      {searchOpen ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingTop: 6,
            paddingBottom: 10,
            gap: 10,
          }}
        >
          <TouchableOpacity
            onPress={closeSearch}
            activeOpacity={0.8}
            style={{
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowLeft size={22} color={TEXT_MAIN} strokeWidth={2} />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: BG_SOFT,
              borderRadius: 12,
              paddingHorizontal: 14,
              minHeight: 44,
              borderWidth: 1,
              borderColor: BORDER,
            }}
          >
            <Search size={18} color={TEXT_SUB} />
            <TextInput
              value={searchValue}
              onChangeText={onSearchChange}
              placeholder={searchPlaceholder}
              placeholderTextColor={TEXT_SUB}
              autoFocus
              returnKeyType="search"
              style={{
                flex: 1,
                marginLeft: 10,
                fontSize: 15,
                color: TEXT_MAIN,
                paddingVertical: 10,
              }}
            />
            {searchValue ? (
              <TouchableOpacity onPress={() => onSearchChange?.("")} hitSlop={8}>
                <X size={18} color={TEXT_SUB} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 8,
            paddingTop: 4,
            paddingBottom: 10,
            minHeight: 48,
          }}
        >
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.8}
            style={{
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowLeft size={22} color={TEXT_MAIN} strokeWidth={2} />
          </TouchableOpacity>
          <Text
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 18,
              fontWeight: "700",
              color: TEXT_MAIN,
              letterSpacing: -0.3,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
          <TouchableOpacity
            onPress={openSearch}
            activeOpacity={0.8}
            style={{
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Search size={22} color={TEXT_MAIN} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      )}

      {filterOptions?.length > 0 && (
        <FilterChips
          options={filterOptions}
          selected={selectedFilter}
          onSelect={onFilterSelect}
          showFilterIcon={showFilterIcon}
          onFilterPress={onFilterPress}
        />
      )}

      {secondaryFilters?.options?.length > 0 && (
        <FilterChips
          options={secondaryFilters.options}
          selected={secondaryFilters.selected}
          onSelect={secondaryFilters.onSelect}
          showFilterIcon={false}
          style={{ marginTop: 6 }}
        />
      )}
    </ScreenFixedHeader>
  );
}
