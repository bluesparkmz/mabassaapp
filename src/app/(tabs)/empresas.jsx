import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Building2,
  MapPin,
  Users,
  Briefcase,
  ChevronRight,
} from "lucide-react-native";
import MabassaAvatar from "@/components/MabassaAvatar";
import FilterChips from "@/components/FilterChips";
import { mabassaApi } from "@/utils/api";
import { logError } from "@/utils/logger";

const PURPLE = "#6C5DD3";
const RED = "#FF5656";
const TEXT_MAIN = "#11142D";
const TEXT_SUB = "#808191";
const BG = "#F8F9FA";
const CARD = "#FFFFFF";
const BORDER = "#E2E8F0";
const categorias = [
  "Todos",
  "Tecnologia",
  "Construcao",
  "Saude",
  "Educacao",
  "Logistica",
  "Agricultura",
  "Geral",
];

function EmpresaCard({ empresa }) {
  const router = useRouter();
  const openProfile = () => {
    router.push({ pathname: "/public-profile", params: { kind: "empresa", id: empresa.id } });
  };

  return (
    <TouchableOpacity
      onPress={openProfile}
      activeOpacity={0.92}
      style={{
        backgroundColor: CARD,
        borderRadius: 24,
        padding: 24,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
      >
        <MabassaAvatar
          uri={empresa.logo}
          name={empresa.name}
          size={56}
          borderRadius={28}
        />
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: TEXT_MAIN }}>
            {empresa.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginTop: 4,
            }}
          >
            <View
              style={{
                backgroundColor: PURPLE + "18",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 20,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "600", color: PURPLE }}>
                {empresa.area}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Text
        style={{
          fontSize: 14,
          color: TEXT_SUB,
          lineHeight: 20,
          marginBottom: 20,
        }}
        numberOfLines={2}
      >
        {empresa.description}
      </Text>

      <View style={{ flexDirection: "row", gap: 16, marginBottom: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <MapPin size={14} color={TEXT_SUB} />
          <Text style={{ fontSize: 13, color: TEXT_SUB }}>
            {empresa.location}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Users size={14} color={TEXT_SUB} />
          <Text style={{ fontSize: 13, color: TEXT_SUB }}>
            {empresa.employees} colaboradores
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Briefcase size={16} color={PURPLE} />
          <Text style={{ fontSize: 14, fontWeight: "600", color: PURPLE }}>
            {empresa.openJobs} vagas abertas
          </Text>
        </View>
        <TouchableOpacity
          onPress={openProfile}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: PURPLE,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 24,
          }}
          activeOpacity={0.8}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
            Ver perfil
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function EmpresasScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const { data: empresas = [], isLoading } = useQuery({
    queryKey: ["empresas"],
    queryFn: mabassaApi.getCompanies,
    onError: (error) => logError("companies-query", error),
  });

  const filtered =
    selectedCategory === "Todos"
      ? empresas
      : empresas.filter((e) => e.area === selectedCategory);

  return (
    <View style={{ flex: 1, backgroundColor: BG, paddingTop: insets.top }}>
      {/* Header */}
      <View
        style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}
      >
        <Text style={{ fontSize: 32, fontWeight: "700", color: TEXT_MAIN, lineHeight: 40 }}>
          {filtered.length}+ Empresas
        </Text>
        <Text style={{ fontSize: 14, color: TEXT_SUB, marginTop: 4 }}>
          Descubra empresas a contratar em Angola
        </Text>
      </View>

      {/* Filter Chips */}
      <FilterChips
        options={categorias}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        style={{ marginBottom: 16 }}
      />

      {/* Count */}
      <Text
        style={{
          fontSize: 13,
          color: TEXT_SUB,
          fontWeight: "600",
          paddingHorizontal: 24,
          marginBottom: 16,
        }}
      >
        {filtered.length} empresa{filtered.length !== 1 ? "s" : ""} encontrada
        {filtered.length !== 1 ? "s" : ""}
      </Text>

      {/* List */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <View
              key={index}
              pointerEvents="none"
              style={{
                height: 150,
                backgroundColor: "#FFFFFF",
                borderRadius: 18,
                marginBottom: 14,
              }}
            />
          ))
        ) : filtered.length === 0 ? (
          <View style={{ alignItems: "center", paddingTop: 60, gap: 12 }}>
            <Building2 size={48} color="#CBD5E1" />
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#94A3B8" }}>
              Nenhuma empresa encontrada
            </Text>
            <Text
              style={{ fontSize: 13, color: "#CBD5E1", textAlign: "center" }}
            >
              Tente selecionar outra categoria
            </Text>
          </View>
        ) : (
          filtered.map((empresa) => (
            <EmpresaCard key={empresa.id} empresa={empresa} />
          ))
        )}
      </ScrollView>
    </View>
  );
}
