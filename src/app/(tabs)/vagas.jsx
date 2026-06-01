import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Briefcase, MapPin, Clock, ChevronRight } from "lucide-react-native";
import MabassaAvatar from "@/components/MabassaAvatar";
import ListScreenHeader from "@/components/ListScreenHeader";
import FilterChips from "@/components/FilterChips";
import { mabassaApi } from "@/utils/api";
import { logError } from "@/utils/logger";
import {
  ACCENT,
  ACCENT_DARK,
  TEXT_MAIN,
  TEXT_SUB,
  BG_SOFT,
  CARD,
  cardStyle,
  shadow,
} from "@/theme";

const jobCategories = [
  "Todos",
  "Tecnologia",
  "Construcao",
  "Saude",
  "Educacao",
  "Logistica",
  "Design",
  "Geral",
];
const jobTypes = ["Todos", "Full-time", "Part-time", "Freelancer", "Contrato"];

function VagaCard({ vaga }) {
  const router = useRouter();
  
  const openDetail = () => {
    router.push({
      pathname: "/content-detail",
      params: { type: "vaga", id: vaga.id, item: JSON.stringify(vaga.raw || vaga) },
    });
  };

  return (
    <TouchableOpacity
      onPress={openDetail}
      activeOpacity={0.92}
      style={{
        ...cardStyle,
        padding: 24,
        ...shadow.card,
      }}
    >
      {/* Top row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            const id = vaga.companyProfileId || vaga.companyUserId;
            if (!id) return;
            router.push({
              pathname: "/public-profile",
              params: { kind: vaga.companyProfileId ? "empresa" : "user", id },
            });
          }}
          activeOpacity={0.8}
        >
          <MabassaAvatar
            uri={vaga.logo}
            name={vaga.company}
            size={48}
            borderRadius={24}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: TEXT_MAIN,
              lineHeight: 22,
            }}
            numberOfLines={2}
          >
            {vaga.title}
          </Text>
        </View>
      </View>

      {/* Meta Info */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 13, color: TEXT_SUB }}>
          Posted in <Text style={{ fontWeight: "700", color: TEXT_MAIN }}>{vaga.category || vaga.company}</Text>
        </Text>
        <Text style={{ fontSize: 13, color: TEXT_SUB }}>
          {vaga.postedAt}
        </Text>
      </View>

      {/* Footer */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ fontSize: 16, fontWeight: "700", color: ACCENT_DARK }}>
            {vaga.salary}
          </Text>
          <Text style={{ fontSize: 12, color: TEXT_SUB, marginTop: 4 }}>
            {vaga.type}
          </Text>
        </View>
        <TouchableOpacity
          onPress={openDetail}
          style={{
            backgroundColor: ACCENT,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 24,
          }}
          activeOpacity={0.8}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
            Candidatar-se
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function VagasScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedType, setSelectedType] = useState("Todos");
  const [search, setSearch] = useState("");
  const { data: vagas = [], isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: mabassaApi.getJobs,
    onError: (error) => logError("jobs-query", error),
  });

  const filtered = vagas.filter((v) => {
    const catMatch =
      selectedCategory === "Todos" || v.category === selectedCategory;
    const typeMatch = selectedType === "Todos" || v.type === selectedType;
    const searchMatch = !search || v.title?.toLowerCase().includes(search.toLowerCase()) || v.company?.toLowerCase().includes(search.toLowerCase());
    return catMatch && typeMatch && searchMatch;
  });

  return (
    <View style={{ flex: 1, backgroundColor: BG_SOFT }}>
      <ListScreenHeader
        insets={insets}
        title="Vagas"
        onBack={() => router.push("/(tabs)/feed")}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Pesquisar vagas..."
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 88,
        }}
        showsVerticalScrollIndicator={false}
      >
        <FilterChips
          options={jobCategories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          style={{ marginTop: 12 }}
        />
        <FilterChips
          options={jobTypes}
          selected={selectedType}
          onSelect={setSelectedType}
          showFilterIcon={false}
          style={{ marginTop: 6 }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 10,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: TEXT_MAIN }}>
            {filtered.length} vaga{filtered.length !== 1 ? "s" : ""}
          </Text>
          <Text style={{ fontSize: 13, color: TEXT_SUB }}>Recentes</Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <View
              key={index}
              pointerEvents="none"
              style={{
                height: 180,
                backgroundColor: CARD,
                borderRadius: 24,
                marginBottom: 16,
              }}
            />
          ))
        ) : filtered.length === 0 ? (
          <View style={{ alignItems: "center", paddingTop: 40, gap: 12 }}>
            <Briefcase size={48} color="#CBD5E1" />
            <Text style={{ fontSize: 16, fontWeight: "600", color: TEXT_SUB }}>
              Nenhuma vaga encontrada
            </Text>
          </View>
        ) : (
          filtered.map((vaga) => <VagaCard key={vaga.id} vaga={vaga} />)
        )}
      </ScrollView>
    </View>
  );
}
