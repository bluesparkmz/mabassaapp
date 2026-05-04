import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Briefcase,
  MapPin,
  Clock,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react-native";
import MabassaAvatar from "@/components/MabassaAvatar";
import FilterChips from "@/components/FilterChips";
import { mabassaApi } from "@/utils/api";
import { logError } from "@/utils/logger";

const BLUE = "#2563EB";
const GREEN = "#10B981";
const BG = "#F8FAFC";
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

const TYPE_COLORS = {
  "Full-time": { bg: "#EFF6FF", text: BLUE },
  "Part-time": { bg: "#FEF3C7", text: "#D97706" },
  Freelancer: { bg: "#F0FDF4", text: GREEN },
};

function VagaCard({ vaga }) {
  const router = useRouter();
  const typeColor = TYPE_COLORS[vaga.type] || {
    bg: "#F1F5F9",
    text: "#64748B",
  };

  return (
    <TouchableOpacity
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
        borderLeftWidth: 4,
        borderLeftColor: vaga.isNew ? BLUE : "transparent",
      }}
    >
      {/* Top row */}
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
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          marginBottom: 10,
        }}
      >
        <MabassaAvatar
          uri={vaga.logo}
          name={vaga.company}
          size={48}
          borderRadius={12}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "800",
                color: "#0F172A",
                flex: 1,
              }}
              numberOfLines={1}
            >
              {vaga.title}
            </Text>
            {vaga.isNew && (
              <View
                style={{
                  backgroundColor: GREEN,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{ fontSize: 10, fontWeight: "800", color: "#fff" }}
                >
                  NOVO
                </Text>
              </View>
            )}
          </View>
          <Text
            style={{
              fontSize: 13,
              color: "#64748B",
              fontWeight: "600",
              marginTop: 2,
            }}
          >
            {vaga.company}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Meta */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <MapPin size={12} color="#94A3B8" />
          <Text style={{ fontSize: 12, color: "#94A3B8" }}>
            {vaga.location}
          </Text>
        </View>
        <View
          style={{
            width: 3,
            height: 3,
            borderRadius: 2,
            backgroundColor: "#CBD5E1",
          }}
        />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Clock size={12} color="#94A3B8" />
          <Text style={{ fontSize: 12, color: "#94A3B8" }}>
            {vaga.postedAt}
          </Text>
        </View>
      </View>

      {/* Tags */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 14,
        }}
      >
        <View
          style={{
            backgroundColor: typeColor.bg,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
          }}
        >
          <Text
            style={{ fontSize: 12, fontWeight: "700", color: typeColor.text }}
          >
            {vaga.type}
          </Text>
        </View>
        {vaga.tags.map((tag) => (
          <View
            key={tag}
            style={{
              backgroundColor: "#F1F5F9",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 20,
            }}
          >
            <Text style={{ fontSize: 12, color: "#64748B", fontWeight: "500" }}>
              {tag}
            </Text>
          </View>
        ))}
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
          <Text style={{ fontSize: 11, color: "#94A3B8" }}>Salário</Text>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#0F172A" }}>
            {vaga.salary}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            backgroundColor: BLUE,
            paddingHorizontal: 18,
            paddingVertical: 10,
            borderRadius: 12,
          }}
          activeOpacity={0.8}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>
            Candidatar-se
          </Text>
          <ChevronRight size={14} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function VagasScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedType, setSelectedType] = useState("Todos");
  const { data: vagas = [], isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: mabassaApi.getJobs,
    onError: (error) => logError("jobs-query", error),
  });

  const filtered = vagas.filter((v) => {
    const catMatch =
      selectedCategory === "Todos" || v.category === selectedCategory;
    const typeMatch = selectedType === "Todos" || v.type === selectedType;
    return catMatch && typeMatch;
  });

  return (
    <View style={{ flex: 1, backgroundColor: BG, paddingTop: insets.top }}>
      {/* Header */}
      <View
        style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={{ fontSize: 26, fontWeight: "800", color: "#0F172A" }}>
              Vagas
            </Text>
            <Text style={{ fontSize: 14, color: "#64748B", marginTop: 3 }}>
              Encontre a oportunidade ideal
            </Text>
          </View>
          <TouchableOpacity
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 4,
              elevation: 2,
              borderWidth: 1,
              borderColor: "#E2E8F0",
            }}
          >
            <SlidersHorizontal size={18} color="#0F172A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <View style={{ marginBottom: 4 }}>
        <FilterChips
          options={jobCategories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </View>
      <View style={{ marginBottom: 8 }}>
        <FilterChips
          options={jobTypes}
          selected={selectedType}
          onSelect={setSelectedType}
        />
      </View>

      <Text
        style={{
          fontSize: 13,
          color: "#94A3B8",
          fontWeight: "600",
          paddingHorizontal: 16,
          marginBottom: 10,
        }}
      >
        {filtered.length} vaga{filtered.length !== 1 ? "s" : ""} encontrada
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
            <Briefcase size={48} color="#CBD5E1" />
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#94A3B8" }}>
              Nenhuma vaga encontrada
            </Text>
            <Text
              style={{ fontSize: 13, color: "#CBD5E1", textAlign: "center" }}
            >
              Tente ajustar os filtros de pesquisa
            </Text>
          </View>
        ) : (
          filtered.map((vaga) => <VagaCard key={vaga.id} vaga={vaga} />)
        )}
      </ScrollView>
    </View>
  );
}
