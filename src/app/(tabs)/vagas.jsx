import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  Briefcase,
  MapPin,
  Clock,
  ChevronRight,
  SlidersHorizontal,
  Search,
  Bell
} from "lucide-react-native";
import MabassaAvatar from "@/components/MabassaAvatar";
import FilterChips from "@/components/FilterChips";
import { mabassaApi } from "@/utils/api";
import { logError } from "@/utils/logger";
import {
  ACCENT,
  ACCENT_DARK,
  TEXT_MAIN,
  TEXT_SUB,
  BG_SOFT as BG,
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
    <View style={{ flex: 1, backgroundColor: BG, paddingTop: insets.top }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}>
          {/* Top bar */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: CARD, padding: 6, paddingRight: 16, borderRadius: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
              <MabassaAvatar uri={null} name="User" size={32} borderRadius={16} />
              <Text style={{ marginLeft: 10, fontWeight: "600", fontSize: 14, color: TEXT_MAIN }}>Mabassa</Text>
            </View>
            <TouchableOpacity style={{ width: 48, height: 48, backgroundColor: CARD, borderRadius: 24, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
              <Bell size={20} color={TEXT_MAIN} />
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 32, fontWeight: "700", color: TEXT_MAIN, marginBottom: 24 }}>
            {vagas.length}+ Vagas publicadas
          </Text>

          {/* Search Bar */}
          <View style={{ flexDirection: "row", gap: 12 }}>
             <View style={{ flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: CARD, borderRadius: 24, paddingHorizontal: 20, height: 56, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
                <Search size={20} color={TEXT_SUB} />
                <TextInput 
                  placeholder="Pesquisar projetos" 
                  placeholderTextColor={TEXT_SUB}
                  value={search}
                  onChangeText={setSearch}
                  style={{ flex: 1, marginLeft: 12, fontSize: 15, color: TEXT_MAIN, fontWeight: "500" }} 
                />
             </View>
             <TouchableOpacity style={{ width: 56, height: 56, backgroundColor: CARD, borderRadius: 24, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
                <SlidersHorizontal size={20} color={TEXT_MAIN} />
             </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingHorizontal: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: TEXT_MAIN }}>Listados Recentemente</Text>
          <TouchableOpacity>
            <Text style={{ fontSize: 13, color: TEXT_SUB, textDecorationLine: "underline" }}>Ver todos {filtered.length}</Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        <View style={{ paddingHorizontal: 24 }}>
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
        </View>
      </ScrollView>
    </View>
  );
}
