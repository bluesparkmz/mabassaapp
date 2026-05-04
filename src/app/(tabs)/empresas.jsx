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

const BLUE = "#2563EB";
const GREEN = "#10B981";
const BG = "#F8FAFC";
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
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <MabassaAvatar
          uri={empresa.logo}
          name={empresa.name}
          size={52}
          borderRadius={14}
        />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#0F172A" }}>
            {empresa.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginTop: 3,
            }}
          >
            <View
              style={{
                backgroundColor: BLUE + "18",
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 20,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: "700", color: BLUE }}>
                {empresa.area}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Text
        style={{
          fontSize: 13,
          color: "#64748B",
          lineHeight: 18,
          marginBottom: 12,
        }}
        numberOfLines={2}
      >
        {empresa.description}
      </Text>

      <View style={{ flexDirection: "row", gap: 16, marginBottom: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <MapPin size={12} color="#94A3B8" />
          <Text style={{ fontSize: 12, color: "#94A3B8" }}>
            {empresa.location}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Users size={12} color="#94A3B8" />
          <Text style={{ fontSize: 12, color: "#94A3B8" }}>
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Briefcase size={13} color={GREEN} />
          <Text style={{ fontSize: 13, fontWeight: "600", color: GREEN }}>
            {empresa.openJobs} vagas abertas
          </Text>
        </View>
        <TouchableOpacity
          onPress={openProfile}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: BLUE,
            paddingHorizontal: 14,
            paddingVertical: 9,
            borderRadius: 11,
          }}
          activeOpacity={0.8}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>
            Ver perfil
          </Text>
          <ChevronRight size={13} color="#fff" />
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
        style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 }}
      >
        <Text style={{ fontSize: 26, fontWeight: "800", color: "#0F172A" }}>
          Empresas
        </Text>
        <Text style={{ fontSize: 14, color: "#64748B", marginTop: 3 }}>
          Descubra empresas a contratar em Angola
        </Text>
      </View>

      {/* Filter Chips */}
      <FilterChips
        options={categorias}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        style={{ marginBottom: 8 }}
      />

      {/* Count */}
      <Text
        style={{
          fontSize: 13,
          color: "#94A3B8",
          fontWeight: "600",
          paddingHorizontal: 16,
          marginBottom: 10,
        }}
      >
        {filtered.length} empresa{filtered.length !== 1 ? "s" : ""} encontrada
        {filtered.length !== 1 ? "s" : ""}
      </Text>

      {/* List */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 16,
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
