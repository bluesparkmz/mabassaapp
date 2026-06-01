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
  X,
  Zap,
  Users,
} from "lucide-react-native";
import MabassaAvatar from "@/components/MabassaAvatar";
import SkeletonCard from "@/components/SkeletonCard";
import { mabassaApi } from "@/utils/api";
import { logError } from "@/utils/logger";

const BLUE = "#2563EB";
const GREEN = "#10B981";
const PURPLE = "#6C5DD3";
const RED = "#FF5656";
const TEXT_MAIN = "#11142D";
const TEXT_SUB = "#808191";
const BG = "#F8F9FA";
const CARD = "#FFFFFF";
const BORDER = "#E2E8F0";
const feedTypes = ["Todos", "Posts", "Vagas", "Serviços", "Empresas"];

function openPublicProfile(router, item) {
  const kind = item.profile_type || (item.type === "empresa" ? "empresa" : "user");
  const id = item.profile_id || item.user_id || (item.type === "empresa" ? item.id : null);
  if (!id) return;
  router.push({ pathname: "/public-profile", params: { kind, id } });
}

function openContentDetail(router, item) {
  if (!["post", "vaga", "servico"].includes(item.type)) return;
  router.push({
    pathname: "/content-detail",
    params: { type: item.type, id: item.id, item: JSON.stringify(item) },
  });
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
      activeOpacity={0.75}
      style={{
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: CARD,
        borderWidth: 1,
        borderColor: active ? PURPLE : BORDER,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: active ? 0.1 : 0.02,
        shadowRadius: 6,
        elevation: active ? 2 : 1,
        flexShrink: 1,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: active ? "600" : "500",
          color: active ? PURPLE : "#11142D",
          letterSpacing: 0.2,
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
    <TouchableOpacity onPress={() => openContentDetail(router, item)} activeOpacity={0.92} style={cardStyle}>
      {/* Author */}
      <TouchableOpacity
        onPress={() => openPublicProfile(router, item)}
        activeOpacity={0.8}
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <MabassaAvatar uri={item.avatar} name={item.author} size={48} borderRadius={24} />
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: TEXT_MAIN }}>
            {item.author}
          </Text>
          <Text style={{ fontSize: 13, color: TEXT_SUB, marginTop: 1 }}>
            {item.role}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Content */}
      {!!item.content && (
        <Text
          style={{
            fontSize: 15,
            color: TEXT_MAIN,
            lineHeight: 22,
            marginBottom: 16,
          }}
        >
          {item.content}
        </Text>
      )}

      {/* Image */}
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={{
            width: "100%",
            height: 220,
            borderRadius: 16,
            marginBottom: 16,
          }}
          contentFit="cover"
        />
      )}

      {/* Divider */}
      <View
        style={{ height: 1, backgroundColor: BORDER, marginBottom: 16 }}
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
          <Text style={{ fontSize: 13, color: TEXT_SUB, fontWeight: "600" }}>
            {likesCount}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
          activeOpacity={0.7}
        >
          <MessageCircle size={18} color={TEXT_SUB} />
          <Text style={{ fontSize: 13, color: TEXT_SUB, fontWeight: "600" }}>
            {item.comments}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
          activeOpacity={0.7}
        >
          <Share2 size={18} color={TEXT_SUB} />
          <Text style={{ fontSize: 13, color: TEXT_SUB, fontWeight: "600" }}>
            Partilhar
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ── VAGA card ─────────────────────────────────────────────────────
function VagaCard({ item }) {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => openContentDetail(router, item)} activeOpacity={0.92} style={cardStyle}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
        <TouchableOpacity
          onPress={() => openPublicProfile(router, item)}
          activeOpacity={0.8}
        >
          <MabassaAvatar
            uri={item.avatar}
            name={item.company}
            size={48}
            borderRadius={24}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "800",
              color: TEXT_MAIN,
              lineHeight: 23,
            }}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          {!!item.company && (
            <Text style={{ fontSize: 13, color: TEXT_SUB, marginTop: 4 }} numberOfLines={1}>
              {item.company}
            </Text>
          )}
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        <Badge label="Vaga" color={PURPLE} />
        {!!item.jobType && (
          <View style={{ backgroundColor: PURPLE + "12", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: PURPLE }}>{item.jobType}</Text>
          </View>
        )}
        {!!item.postedAt && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Clock size={12} color={TEXT_SUB} />
            <Text style={{ fontSize: 12, color: TEXT_SUB }}>{item.postedAt}</Text>
          </View>
        )}
      </View>

      {(item.location || item.description) && (
        <View style={{ marginBottom: 14 }}>
          {!!item.location && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: item.description ? 8 : 0 }}>
              <MapPin size={14} color={TEXT_SUB} />
              <Text style={{ fontSize: 13, color: TEXT_SUB }} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
          )}
          {!!item.description && (
            <Text style={{ fontSize: 14, color: TEXT_SUB, lineHeight: 20 }} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ fontSize: 16, fontWeight: "700", color: RED }}>
            {item.salary || "A negociar"}
          </Text>
          <Text style={{ fontSize: 12, color: TEXT_SUB, marginTop: 4 }}>Salário</Text>
        </View>
        <TouchableOpacity
          onPress={() => openContentDetail(router, item)}
          style={{
            backgroundColor: PURPLE,
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

// ── SERVIÇO card ──────────────────────────────────────────────────
function ServicoCard({ item }) {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => openContentDetail(router, item)} activeOpacity={0.92} style={cardStyle}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
        <TouchableOpacity
          onPress={() => openPublicProfile(router, item)}
          activeOpacity={0.8}
        >
          <MabassaAvatar uri={item.avatar} name={item.company} size={48} borderRadius={24} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={{ fontSize: 17, fontWeight: "800", color: TEXT_MAIN, lineHeight: 23 }} numberOfLines={2}>
            {item.title}
          </Text>
          {!!item.company && (
            <Text style={{ fontSize: 13, color: TEXT_SUB, marginTop: 4 }} numberOfLines={1}>
              {item.company}
            </Text>
          )}
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        <Badge label="Serviço" color={PURPLE} />
        {!!item.postedAt && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Clock size={12} color={TEXT_SUB} />
            <Text style={{ fontSize: 12, color: TEXT_SUB }}>{item.postedAt}</Text>
          </View>
        )}
      </View>

      {/* Image */}
      {item.image && (
        <View
          style={{
            width: "100%",
            height: 160,
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 14,
            backgroundColor: "#F1F5F9",
          }}
        >
          <Image
            source={{ uri: item.image }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        </View>
      )}

      {!!item.description && (
        <Text style={{ fontSize: 14, color: TEXT_SUB, lineHeight: 20, marginBottom: 14 }} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontSize: 16, fontWeight: "700", color: RED }}>
            {item.price || "A negociar"}
          </Text>
          <Text style={{ fontSize: 12, color: TEXT_SUB, marginTop: 4 }}>Preço</Text>
        </View>
        <TouchableOpacity
          onPress={() => openContentDetail(router, item)}
          style={{
            backgroundColor: PURPLE,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 24,
          }}
          activeOpacity={0.8}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
            Contratar
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ── EMPRESA card ──────────────────────────────────────────────────
function EmpresaCard({ item }) {
  const router = useRouter();
  return (
    <View style={cardStyle}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => openPublicProfile(router, item)}
          activeOpacity={0.8}
        >
          <MabassaAvatar
            uri={item.avatar}
            name={item.company}
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
            {item.company}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <Text style={{ fontSize: 13, color: TEXT_SUB }}>
          Posted in <Text style={{ fontWeight: "700", color: TEXT_MAIN }}>Empresas</Text>
        </Text>
        <Text style={{ fontSize: 13, color: TEXT_SUB }}>
          {item.postedAt}
        </Text>
      </View>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: TEXT_MAIN,
          marginBottom: 6,
        }}
      >
        {item.title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: TEXT_SUB,
          lineHeight: 20,
          marginBottom: 20,
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
              <MapPin size={14} color={TEXT_SUB} />
              <Text style={{ fontSize: 13, color: TEXT_SUB }}>
                {item.location}
              </Text>
            </View>
          )}
          {item.employees && (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Users size={14} color={TEXT_SUB} />
              <Text style={{ fontSize: 13, color: TEXT_SUB }}>
                {item.employees} pessoas
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={() => openPublicProfile(router, item)}
          style={{
            backgroundColor: PURPLE,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 24,
          }}
          activeOpacity={0.8}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
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
  borderRadius: 24,
  padding: 24,
  marginBottom: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.05,
  shadowRadius: 12,
  elevation: 3,
};
const btnPrimary = {
  backgroundColor: PURPLE,
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 24,
  alignItems: "center",
  justifyContent: "center",
};
const btnPrimaryText = { color: "#fff", fontWeight: "700", fontSize: 13 };
const btnSecondary = {
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 24,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: CARD,
  borderWidth: 1,
  borderColor: BORDER,
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
  Serviços: "servico",
  Empresas: "empresa",
};

// ── Main screen ───────────────────────────────────────────────────
export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const {
    data: feedItems = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["feed"],
    queryFn: () => mabassaApi.getFeed(),
    staleTime: 0,
    refetchOnMount: "always",
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
    <View style={{ flex: 1, backgroundColor: BG }}>
      {/* Header fixo apenas com logo e notificações */}
      <View
        style={{
          backgroundColor: CARD,
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: 14,
          borderBottomWidth: 1,
          borderBottomColor: BORDER,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: PURPLE, alignItems: "center", justifyContent: "center" }}>
              <Briefcase size={20} color="#fff" />
            </View>
            <View>
              <Text style={{ fontSize: 12, color: TEXT_SUB, fontWeight: "600" }}>Mabassa</Text>
              <Text style={{ fontSize: 20, color: TEXT_MAIN, fontWeight: "900", marginTop: 2 }}>
                Explorar
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            activeOpacity={0.8}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: BG, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: BORDER }}
          >
            <Bell size={20} color={TEXT_MAIN} />
            <View style={{ position: "absolute", top: 10, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: RED }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Feed list com busca e filtros dentro do scroll ── */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 88,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Barra de busca - agora dentro do scroll */}
        <View style={{ paddingHorizontal: 20, marginTop: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 18, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 14, minHeight: 52, gap: 10 }}>
            <Search size={18} color={TEXT_SUB} />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Pesquisar vagas, posts e serviços..."
              placeholderTextColor={TEXT_SUB}
              style={{ flex: 1, fontSize: 15, color: TEXT_MAIN, fontWeight: "500" }}
            />
            {!!searchText && (
              <TouchableOpacity
                onPress={() => setSearchText("")}
                activeOpacity={0.7}
                style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#E2E8F0", alignItems: "center", justifyContent: "center" }}
              >
                <X size={16} color="#475569" strokeWidth={2.5} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filtros (categorias) - agora dentro do scroll */}
        <ScrollView
          horizontal
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, flexShrink: 0, height: 60, minHeight: 60, maxHeight: 60, backgroundColor: BG }}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 10,
            paddingBottom: 10,
            alignItems: "center",
            minHeight: 60,
            gap: 8,
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

        <View style={{ paddingHorizontal: 20, paddingTop: 0, paddingBottom: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "800", color: TEXT_MAIN }}>Resultados</Text>
          <Text style={{ fontSize: 13, color: TEXT_SUB, marginTop: 2 }}>{filtered.length} item{filtered.length !== 1 ? "s" : ""}</Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
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
        </View>
      </ScrollView>
    </View>
  );
}
