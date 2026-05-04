import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Bell,
  Search,
  Briefcase,
  Star,
  Building2,
  MapPin,
  Clock,
  ChevronRight,
  Heart,
  MessageCircle,
  Share2,
  Zap,
  Users,
} from "lucide-react-native";
import MabassaAvatar from "@/components/MabassaAvatar";
import SkeletonCard from "@/components/SkeletonCard";
import { mabassaApi } from "@/utils/api";
import { logError } from "@/utils/logger";

const BLUE = "#2563EB";
const GREEN = "#10B981";
const PURPLE = "#8B5CF6";
const BG = "#F0F4F8";
const CARD = "#FFFFFF";
const feedTypes = ["Todos", "Posts", "Vagas", "Servicos", "Empresas"];

function openPublicProfile(router, item) {
  const kind = item.profile_type || (item.type === "empresa" ? "empresa" : "user");
  const id = item.profile_id || item.user_id || (item.type === "empresa" ? item.id : null);
  if (!id) return;
  router.push({ pathname: "/public-profile", params: { kind, id } });
}

// ── Badge ──────────────────────────────────────────────────────────
function Badge({ label, color }) {
  return (
    <View
      style={{
        backgroundColor: color + "18",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 20,
      }}
    >
      <Text
        style={{ fontSize: 10, fontWeight: "800", color, letterSpacing: 0.3 }}
      >
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

// ── Filter pill ────────────────────────────────────────────────────
function FilterPill({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 9,
        minHeight: 40,
        borderRadius: 20,
        backgroundColor: active ? BLUE : CARD,
        borderWidth: 1.5,
        borderColor: active ? BLUE : "#E2E8F0",
        marginRight: 8,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: active ? "#fff" : "#64748B",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ── POST card (estilo Instagram/LinkedIn) ─────────────────────────
function PostCard({ item }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes);
  const scale = useRef(new Animated.Value(1)).current;

  const handleLike = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.3,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
    setLiked((v) => !v);
    setLikesCount((c) => (liked ? c - 1 : c + 1));
  };

  return (
    <View style={cardStyle}>
      {/* Author */}
      <TouchableOpacity
        onPress={() => openPublicProfile(router, item)}
        activeOpacity={0.8}
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <MabassaAvatar uri={item.avatar} name={item.author} size={44} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#0F172A" }}>
            {item.author}
          </Text>
          <Text style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>
            {item.role}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
          <Clock size={10} color="#94A3B8" />
          <Text style={{ fontSize: 11, color: "#94A3B8" }}>
            {item.postedAt}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Content */}
      <Text
        style={{
          fontSize: 14,
          color: "#1E293B",
          lineHeight: 21,
          marginBottom: 12,
        }}
      >
        {item.content}
      </Text>

      {/* Image */}
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={{
            width: "100%",
            height: 180,
            borderRadius: 12,
            marginBottom: 12,
          }}
          contentFit="cover"
        />
      )}

      {/* Divider */}
      <View
        style={{ height: 1, backgroundColor: "#F1F5F9", marginBottom: 10 }}
      />

      {/* Actions */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
        <TouchableOpacity
          onPress={handleLike}
          style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
          activeOpacity={0.7}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <Heart
              size={18}
              color={liked ? "#EF4444" : "#94A3B8"}
              fill={liked ? "#EF4444" : "transparent"}
            />
          </Animated.View>
          <Text style={{ fontSize: 13, color: "#64748B", fontWeight: "600" }}>
            {likesCount}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
          activeOpacity={0.7}
        >
          <MessageCircle size={18} color="#94A3B8" />
          <Text style={{ fontSize: 13, color: "#64748B", fontWeight: "600" }}>
            {item.comments}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
          activeOpacity={0.7}
        >
          <Share2 size={18} color="#94A3B8" />
          <Text style={{ fontSize: 13, color: "#64748B", fontWeight: "600" }}>
            Partilhar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── VAGA card ─────────────────────────────────────────────────────
function VagaCard({ item }) {
  const router = useRouter();
  return (
    <View style={[cardStyle, { borderLeftWidth: 4, borderLeftColor: BLUE }]}>
      <TouchableOpacity
        onPress={() => openPublicProfile(router, item)}
        activeOpacity={0.8}
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          marginBottom: 10,
        }}
      >
        <MabassaAvatar
          uri={item.avatar}
          name={item.company}
          size={46}
          borderRadius={12}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            <Badge label="Vaga" color={BLUE} />
            {item.isNew && <Badge label="Nova" color={GREEN} />}
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
            >
              <Clock size={10} color="#94A3B8" />
              <Text style={{ fontSize: 11, color: "#94A3B8" }}>
                {item.postedAt}
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "800",
              color: "#0F172A",
              marginTop: 5,
            }}
          >
            {item.title}
          </Text>
          <Text style={{ fontSize: 13, color: "#64748B", fontWeight: "600" }}>
            {item.company}
          </Text>
        </View>
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 13,
          color: "#64748B",
          lineHeight: 19,
          marginBottom: 10,
        }}
        numberOfLines={2}
      >
        {item.description}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <MapPin size={12} color="#94A3B8" />
          <Text style={{ fontSize: 12, color: "#64748B" }}>
            {item.location}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#EFF6FF",
            paddingHorizontal: 9,
            paddingVertical: 3,
            borderRadius: 20,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "600", color: BLUE }}>
            {item.jobType}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Zap size={12} color={GREEN} />
          <Text style={{ fontSize: 12, fontWeight: "700", color: GREEN }}>
            {item.salary}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <TouchableOpacity style={[btnPrimary, { flex: 1 }]} activeOpacity={0.8}>
          <Text style={btnPrimaryText}>Candidatar-se</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[btnSecondary, { paddingHorizontal: 14 }]}
          activeOpacity={0.8}
        >
          <ChevronRight size={18} color="#334155" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── SERVIÇO card ──────────────────────────────────────────────────
function ServicoCard({ item }) {
  const router = useRouter();
  return (
    <View style={[cardStyle, { borderLeftWidth: 4, borderLeftColor: PURPLE }]}>
      <TouchableOpacity
        onPress={() => openPublicProfile(router, item)}
        activeOpacity={0.8}
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <MabassaAvatar uri={item.avatar} name={item.company} size={46} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            <Badge label="Serviço" color={PURPLE} />
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
            >
              <Clock size={10} color="#94A3B8" />
              <Text style={{ fontSize: 11, color: "#94A3B8" }}>
                {item.postedAt}
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: "#0F172A",
              marginTop: 4,
            }}
          >
            {item.company}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontSize: 14, fontWeight: "800", color: GREEN }}>
            {item.price}
          </Text>
        </View>
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 15,
          fontWeight: "700",
          color: "#0F172A",
          marginBottom: 6,
        }}
      >
        {item.title}
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: "#64748B",
          lineHeight: 19,
          marginBottom: 12,
        }}
        numberOfLines={2}
      >
        {item.description}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Star size={14} color="#F59E0B" fill="#F59E0B" />
          <Text style={{ fontSize: 13, fontWeight: "700", color: "#0F172A" }}>
            {item.rating}
          </Text>
          <Text style={{ fontSize: 12, color: "#94A3B8" }}>
            ({item.reviews} avaliações)
          </Text>
        </View>
        <TouchableOpacity style={btnPrimary} activeOpacity={0.8}>
          <Text style={btnPrimaryText}>Contratar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── EMPRESA card ──────────────────────────────────────────────────
function EmpresaCard({ item }) {
  const router = useRouter();
  return (
    <View style={[cardStyle, { borderLeftWidth: 4, borderLeftColor: GREEN }]}>
      <TouchableOpacity
        onPress={() => openPublicProfile(router, item)}
        activeOpacity={0.8}
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <MabassaAvatar
          uri={item.avatar}
          name={item.company}
          size={46}
          borderRadius={12}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            <Badge label="Empresa" color={GREEN} />
            {item.isNew && <Badge label="Novo" color={BLUE} />}
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
            >
              <Clock size={10} color="#94A3B8" />
              <Text style={{ fontSize: 11, color: "#94A3B8" }}>
                {item.postedAt}
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: "#0F172A",
              marginTop: 4,
            }}
          >
            {item.company}
          </Text>
        </View>
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 15,
          fontWeight: "700",
          color: "#0F172A",
          marginBottom: 6,
        }}
      >
        {item.title}
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: "#64748B",
          lineHeight: 19,
          marginBottom: 12,
        }}
        numberOfLines={3}
      >
        {item.description}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", gap: 14 }}>
          {item.location && (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <MapPin size={12} color="#94A3B8" />
              <Text style={{ fontSize: 12, color: "#64748B" }}>
                {item.location}
              </Text>
            </View>
          )}
          {item.employees && (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Users size={12} color="#94A3B8" />
              <Text style={{ fontSize: 12, color: "#64748B" }}>
                {item.employees} pessoas
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={() => openPublicProfile(router, item)}
          style={btnSecondary}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 13, fontWeight: "700", color: "#334155" }}>
            Ver Perfil
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Shared styles ─────────────────────────────────────────────────
const cardStyle = {
  backgroundColor: CARD,
  borderRadius: 18,
  padding: 16,
  marginBottom: 14,
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.07,
  shadowRadius: 10,
  elevation: 3,
};
const btnPrimary = {
  backgroundColor: BLUE,
  paddingVertical: 10,
  paddingHorizontal: 18,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
};
const btnPrimaryText = { color: "#fff", fontWeight: "700", fontSize: 13 };
const btnSecondary = {
  paddingVertical: 9,
  paddingHorizontal: 14,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#F1F5F9",
  borderWidth: 1,
  borderColor: "#E2E8F0",
};

// ── Render by type ────────────────────────────────────────────────
function FeedCard({ item }) {
  if (item.type === "post") return <PostCard item={item} />;
  if (item.type === "vaga") return <VagaCard item={item} />;
  if (item.type === "servico") return <ServicoCard item={item} />;
  if (item.type === "empresa") return <EmpresaCard item={item} />;
  return null;
}

const TYPE_MAP = {
  Posts: "post",
  Vagas: "vaga",
  Servicos: "servico",
  Empresas: "empresa",
};

// ── Main screen ───────────────────────────────────────────────────
export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const {
    data: feedItems = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["feed"],
    queryFn: () => mabassaApi.getFeed(),
    onError: (queryError) => logError("feed-query", queryError),
  });

  const filtered = feedItems.filter((item) => {
    const typeMatch =
      activeFilter === "Todos" || item.type === TYPE_MAP[activeFilter];
    const text = searchText.toLowerCase();
    const textMatch =
      !text ||
      item.title?.toLowerCase().includes(text) ||
      item.company?.toLowerCase().includes(text) ||
      item.author?.toLowerCase().includes(text) ||
      item.content?.toLowerCase().includes(text);
    return typeMatch && textMatch;
  });

  return (
    <View style={{ flex: 1, backgroundColor: BG, paddingTop: insets.top }}>
      {/* ── Header ── */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 10,
          backgroundColor: BG,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: BLUE,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Briefcase size={17} color="#fff" strokeWidth={2.5} />
            </View>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "900",
                color: "#0F172A",
                letterSpacing: -0.5,
              }}
            >
              Mabassa
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: CARD,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Bell size={20} color="#0F172A" strokeWidth={2} />
            <View
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#EF4444",
                borderWidth: 1.5,
                borderColor: "#fff",
              }}
            />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: CARD,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 11,
            borderWidth: 1,
            borderColor: "#E2E8F0",
            gap: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          <Search size={17} color="#94A3B8" />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Pesquisar no feed..."
            placeholderTextColor="#94A3B8"
            style={{ flex: 1, fontSize: 14, color: "#0F172A" }}
          />
        </View>
      </View>

      {/* ── Filter pills ── */}
      <ScrollView
        horizontal
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, flexShrink: 0, height: 64, minHeight: 64, maxHeight: 64 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 14,
          alignItems: "center",
          minHeight: 64,
        }}
      >
        {feedTypes.map((t) => (
          <FilterPill
            key={t}
            label={t}
            active={activeFilter === t}
            onPress={() => setActiveFilter(t)}
          />
        ))}
      </ScrollView>

      {/* ── Feed list ── */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 88,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Count label */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: "#94A3B8",
            marginBottom: 12,
          }}
        >
          {filtered.length} publicaç{filtered.length !== 1 ? "ões" : "ão"}
        </Text>

        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map((item) => <FeedCard key={item.id} item={item} />)}

        {!loading && error && (
          <View style={{ alignItems: "center", paddingTop: 60, gap: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#94A3B8" }}>
              Nao foi possivel carregar o feed
            </Text>
            <Text style={{ fontSize: 13, color: "#CBD5E1", textAlign: "center" }}>
              Veja o console do Expo para detalhes.
            </Text>
          </View>
        )}

        {!loading && !error && filtered.length === 0 && (
          <View style={{ alignItems: "center", paddingTop: 60, gap: 12 }}>
            <Search size={48} color="#CBD5E1" />
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#94A3B8" }}>
              Nenhum resultado
            </Text>
            <Text
              style={{ fontSize: 13, color: "#CBD5E1", textAlign: "center" }}
            >
              Tenta outro filtro ou pesquisa
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
