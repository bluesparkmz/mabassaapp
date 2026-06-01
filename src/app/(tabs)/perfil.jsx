import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Keyboard } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Camera,
  Edit3,
  MapPin,
  Building2,
  UserRoundCheck,
  CheckCircle,
  Plus,
  Save,
  Settings,
  X,
} from "lucide-react-native";
import LocationFields from "@/components/LocationFields";
import MabassaAvatar from "@/components/MabassaAvatar";
import { getDefaultDistrict } from "@/data/mozambiqueLocationsData";
import { authApi, mabassaApi } from "@/utils/api";
import { useAuth } from "@/utils/auth/useAuth";
import { logError } from "@/utils/logger";

const BLUE = "#2563EB";
const GREEN = "#10B981";
const BG = "#F8FAFC";
const inputStyle = {
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#E2E8F0",
  borderRadius: 14,
  paddingHorizontal: 16,
  paddingVertical: 15,
  fontSize: 14,
  color: "#0F172A",
  minHeight: 54,
};
const loginButton = {
  backgroundColor: BLUE,
  borderRadius: 14,
  paddingVertical: 16,
  minHeight: 54,
  alignItems: "center",
  justifyContent: "center",
};
const DEFAULT_PROVINCE = "Cidade de Maputo";


function StatBox({ value, label }) {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: "800", color: "#0F172A" }}>
        {value}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: "#64748B",
          marginTop: 2,
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function SectionTitle({ title }) {
  return (
    <Text
      style={{
        fontSize: 18,
        fontWeight: "800",
        color: "#0F172A",
        marginBottom: 12,
        marginTop: 8,
      }}
    >
      {title}
    </Text>
  );
}


function AuthPanel({ insets, mode, setMode, form, setForm, onSubmit, error, loading }) {
  return (
    <View style={{ flex: 1, backgroundColor: BG, paddingTop: insets.top }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 16,
          paddingBottom: insets.bottom + 80,
          gap: 12,
        }}
      >
        <View style={{ width: "100%", maxWidth: 420, alignSelf: "center", gap: 12 }}>
          <Text style={{ fontSize: 28, fontWeight: "800", color: "#0F172A" }}>
            {mode === "login" ? "Entrar" : "Criar conta"}
          </Text>
          <Text style={{ fontSize: 14, color: "#64748B", marginBottom: 10 }}>
            Acesse o Mabassa para configurar o seu perfil.
          </Text>

          {mode === "register" && (
            <>
              <TextInput value={form.name} onChangeText={(name) => setForm((current) => ({ ...current, name }))} placeholder="Nome" style={inputStyle} />
              <TextInput value={form.phone} onChangeText={(phone) => setForm((current) => ({ ...current, phone }))} placeholder="Telefone" style={inputStyle} />
              <LocationFields
                province={form.province}
                city={form.city}
                onProvinceChange={(province) => setForm((current) => ({ ...current, province }))}
                onCityChange={(city) => setForm((current) => ({ ...current, city }))}
                inputStyle={inputStyle}
                rowStyle={{ flexDirection: "column", gap: 12 }}
              />
            </>
          )}

          <TextInput value={form.email} onChangeText={(email) => setForm((current) => ({ ...current, email }))} placeholder="Email" autoCapitalize="none" keyboardType="email-address" style={inputStyle} />
          <TextInput value={form.password} onChangeText={(password) => setForm((current) => ({ ...current, password }))} placeholder="Senha" secureTextEntry style={inputStyle} />
          {error && <Text style={{ color: "#DC2626", fontSize: 13 }}>{error}</Text>}
          <TouchableOpacity onPress={onSubmit} disabled={loading} style={[loginButton, { opacity: loading ? 0.65 : 1 }]}>
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>
              {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode((current) => (current === "login" ? "register" : "login"))} style={{ alignItems: "center", paddingVertical: 12 }}>
            <Text style={{ color: BLUE, fontWeight: "700" }}>
              {mode === "login" ? "Criar nova conta" : "Ja tenho conta"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function EditProfilePanel({
  form,
  setForm,
  onPickAvatar,
  onCancel,
  onSave,
  error,
  loading,
  avatarLoading,
}) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
        <Text style={{ flex: 1, fontSize: 18, fontWeight: "900", color: "#0F172A" }}>
          Editar perfil
        </Text>
        <TouchableOpacity
          onPress={onCancel}
          activeOpacity={0.75}
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            backgroundColor: "#F1F5F9",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={17} color="#334155" />
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: "center", marginBottom: 14 }}>
        <TouchableOpacity onPress={onPickAvatar} activeOpacity={0.8} disabled={avatarLoading}>
          <View>
            <MabassaAvatar uri={form.avatar_url} name={form.name || "Perfil Mabassa"} size={86} />
            <View
              style={{
                position: "absolute",
                right: -2,
                bottom: -2,
                width: 34,
                height: 34,
                borderRadius: 12,
                backgroundColor: BLUE,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 3,
                borderColor: "#fff",
              }}
            >
              <Camera size={15} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>
        <Text style={{ color: "#64748B", fontSize: 12, fontWeight: "700", marginTop: 8 }}>
          {avatarLoading ? "Enviando avatar..." : "Tocar para trocar avatar"}
        </Text>
      </View>

      <View style={{ gap: 12 }}>
        <TextInput
          value={form.name}
          onChangeText={(name) => setForm((current) => ({ ...current, name }))}
          placeholder="Nome"
          style={inputStyle}
        />
        <TextInput
          value={form.phone}
          onChangeText={(phone) => setForm((current) => ({ ...current, phone }))}
          placeholder="Telefone"
          keyboardType="phone-pad"
          style={inputStyle}
        />
        <LocationFields
          province={form.province}
          city={form.city}
          onProvinceChange={(province) => setForm((current) => ({ ...current, province }))}
          onCityChange={(city) => setForm((current) => ({ ...current, city }))}
          inputStyle={inputStyle}
          rowStyle={{ flexDirection: "column", gap: 12 }}
        />
        {error && <Text style={{ color: "#DC2626", fontSize: 13, fontWeight: "700" }}>{error}</Text>}
        <TouchableOpacity
          onPress={onSave}
          disabled={loading || avatarLoading}
          activeOpacity={0.85}
          style={{
            backgroundColor: BLUE,
            minHeight: 54,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 8,
            opacity: loading || avatarLoading ? 0.65 : 1,
          }}
        >
          <Save size={17} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 15, fontWeight: "900" }}>
            {loading ? "Guardando..." : "Guardar alteracoes"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { auth, isAuthenticated, login, register, signOut, setAuth } = useAuth();
  const user = auth?.user;
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    province: DEFAULT_PROVINCE,
    city: getDefaultDistrict(DEFAULT_PROVINCE),
    avatar_url: null,
  });
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    province: DEFAULT_PROVINCE,
    city: getDefaultDistrict(DEFAULT_PROVINCE),
    user_type: "normal",
  });
  const [authError, setAuthError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const goCreate = (path) => {
    setCreateOpen(false);
    router.push(path);
  };

  const openEdit = () => {
    setCreateOpen(false);
    setEditError(null);
    setEditForm({
      name: user?.name || "",
      phone: user?.phone || "",
      province: user?.province || DEFAULT_PROVINCE,
      city: user?.city || getDefaultDistrict(user?.province || DEFAULT_PROVINCE),
      avatar_url: user?.avatar_url || null,
    });
    setEditOpen(true);
  };

  const pickAvatar = async () => {
    setEditError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setEditError("Permita acesso a galeria para escolher um avatar.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const selected = result.assets[0];
    const formData = new FormData();
    formData.append("file", {
      uri: selected.uri,
      name: selected.fileName || `avatar-${Date.now()}.jpg`,
      type: selected.mimeType || "image/jpeg",
    });

    setAvatarUploading(true);
    try {
      const uploaded = await mabassaApi.uploadAvatar(formData, auth?.accessToken);
      setEditForm((current) => ({ ...current, avatar_url: uploaded.image_url }));
    } catch (error) {
      logError("avatar-upload", error);
      setEditError(error.message);
    } finally {
      setAvatarUploading(false);
    }
  };

  const saveProfile = async () => {
    Keyboard.dismiss();
    setEditSaving(true);
    setEditError(null);
    try {
      const updatedUser = await authApi.updateMe(
        {
          name: editForm.name.trim(),
          phone: editForm.phone?.trim() || null,
          province: editForm.province,
          city: editForm.city,
          avatar_url: editForm.avatar_url,
        },
        auth?.accessToken
      );
      setAuth({ ...auth, user: updatedUser });
      setEditOpen(false);
    } catch (error) {
      logError("profile-update", error);
      setEditError(error.message);
    } finally {
      setEditSaving(false);
    }
  };

  const handleAuth = async () => {
    Keyboard.dismiss();
    setSubmitting(true);
    setAuthError(null);
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
      Keyboard.dismiss();
    } catch (error) {
      logError("auth-submit", error);
      setAuthError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <AuthPanel
        insets={insets}
        mode={mode}
        setMode={setMode}
        form={form}
        setForm={setForm}
        onSubmit={handleAuth}
        error={authError}
        loading={submitting}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        {/* Hero Section */}
        <View
          style={{
            backgroundColor: BLUE,
            paddingTop: insets.top + 16,
            paddingBottom: 70,
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <TouchableOpacity
              onPress={() => setCreateOpen((value) => !value)}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {createOpen ? <X size={18} color="#fff" /> : <Plus size={20} color="#fff" />}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/settings")}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Settings size={17} color="#fff" />
            </TouchableOpacity>
          </View>
          {createOpen && (
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.16)",
                borderRadius: 16,
                padding: 10,
                gap: 8,
                marginBottom: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => goCreate("/create-post")}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 14,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "800", color: "#0F172A" }}>
                  Criar post
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => goCreate("/create-service")}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 14,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "800", color: "#0F172A" }}>
                  Publicar servico
                </Text>
              </TouchableOpacity>
              {user?.user_type === "empresa" && (
                <TouchableOpacity
                  onPress={() => goCreate("/create-job")}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: "800", color: "#0F172A" }}>
                    Publicar vaga
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={{ alignItems: "center" }}>
            <View
              style={{
                borderWidth: 3,
                borderColor: "rgba(255,255,255,0.6)",
                borderRadius: 42,
                marginBottom: 12,
              }}
            >
              <MabassaAvatar
                uri={user?.avatar_url}
                name={user?.name || "Perfil Mabassa"}
                size={80}
              />
            </View>
            <Text style={{ fontSize: 22, fontWeight: "800", color: "#fff" }}>
              {user?.name || "Perfil Mabassa"}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.8)",
                marginTop: 4,
              }}
            >
              {user?.user_type === "empresa" ? "Empresa" : "Profissional"}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                marginTop: 8,
              }}
            >
              <MapPin size={13} color="rgba(255,255,255,0.7)" />
              <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                {[user?.city, user?.province].filter(Boolean).join(", ") || "Mocambique"}
              </Text>
            </View>
          </View>
        </View>

        {/* Content card overlay */}
        <View style={{ paddingHorizontal: 16, marginTop: -50 }}>
          {/* Rating + Stats card */}
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 18,
              shadowColor: "#0F172A",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.12,
              shadowRadius: 16,
              elevation: 6,
              marginBottom: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                marginBottom: 16,
              }}
            >
              <CheckCircle size={14} color={user?.is_verified ? GREEN : "#94A3B8"} fill={user?.is_verified ? GREEN : "transparent"} />
              <Text style={{ fontSize: 13, color: user?.is_verified ? GREEN : "#64748B", fontWeight: "700" }}>
                {user?.is_verified ? "Perfil verificado" : "Perfil em configuracao"}
              </Text>
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: "#F1F5F9",
                marginBottom: 16,
              }}
            />

            <View style={{ flexDirection: "row" }}>
              <StatBox value={user?.user_type === "empresa" ? "Empresa" : "Profissional"} label="Tipo de conta" />
              <View style={{ width: 1, backgroundColor: "#F1F5F9" }} />
              <StatBox value={user?.province || "-"} label="Provincia" />
              <View style={{ width: 1, backgroundColor: "#F1F5F9" }} />
              <StatBox value={user?.city || "-"} label="Cidade" />
            </View>

            <TouchableOpacity
              onPress={() => router.push("/edit-profile")}
              style={{
                marginTop: 16,
                paddingVertical: 12,
                borderRadius: 14,
                backgroundColor: BLUE,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              activeOpacity={0.8}
            >
              <Edit3 size={16} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
                Editar Perfil
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={signOut}
              style={{
                marginTop: 10,
                paddingVertical: 10,
                borderRadius: 14,
                backgroundColor: "#F1F5F9",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#334155", fontWeight: "700", fontSize: 14 }}>
                Sair
              </Text>
            </TouchableOpacity>
          </View>

          {editOpen && (
            <EditProfilePanel
              form={editForm}
              setForm={setEditForm}
              onPickAvatar={pickAvatar}
              onCancel={() => setEditOpen(false)}
              onSave={saveProfile}
              error={editError}
              loading={editSaving}
              avatarLoading={avatarUploading}
            />
          )}

          {/* About */}
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 18,
              padding: 16,
              marginBottom: 16,
              shadowColor: "#0F172A",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <SectionTitle title="Sobre" />
            <Text style={{ fontSize: 14, color: "#64748B", lineHeight: 21 }}>
              Complete o seu perfil para aparecer melhor nas pesquisas do Mabassa.
              Aqui ficam os dados principais da sua conta e as publicacoes que
              voce criar no aplicativo.
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 14,
              }}
            >
              {[
                user?.user_type === "empresa" ? "Empresa" : "Profissional",
                user?.province,
                user?.city,
              ].filter(Boolean).map((skill) => (
                <View
                  key={skill}
                  style={{
                    backgroundColor: BLUE + "12",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={{ fontSize: 12, fontWeight: "600", color: BLUE }}
                  >
                    {skill}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {user?.user_type === "normal" && (
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 18,
                padding: 16,
                marginBottom: 16,
                shadowColor: "#0F172A",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <SectionTitle title="Conta profissional" />
              <Text style={{ fontSize: 14, color: "#64748B", lineHeight: 21 }}>
                Configure como quer trabalhar no Mabassa.
              </Text>
              <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
                {user?.user_type !== "empresa" && (
                  <TouchableOpacity
                    onPress={() => router.push("/become-company")}
                    activeOpacity={0.85}
                    style={{
                      flex: 1,
                      minHeight: 52,
                      borderRadius: 14,
                      backgroundColor: BLUE,
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      gap: 8,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Building2 size={17} color="#fff" />
                    <Text style={{ color: "#fff", fontWeight: "800", fontSize: 13 }}>
                      Criar empresa
                    </Text>
                  </TouchableOpacity>
                )}
                {user?.user_type !== "freelancer" && (
                  <TouchableOpacity
                    onPress={() => router.push("/become-freelancer")}
                    activeOpacity={0.85}
                    style={{
                      flex: 1,
                      minHeight: 52,
                      borderRadius: 14,
                      backgroundColor: "#ECFDF5",
                      borderWidth: 1,
                      borderColor: "#BBF7D0",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      gap: 8,
                      paddingHorizontal: 10,
                    }}
                  >
                    <UserRoundCheck size={17} color={GREEN} />
                    <Text style={{ color: "#047857", fontWeight: "800", fontSize: 13 }}>
                      Virar freelancer
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 18,
              padding: 16,
              marginTop: 4,
              shadowColor: "#0F172A",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <SectionTitle title="Publicacoes" />
            <Text style={{ fontSize: 14, color: "#64748B", lineHeight: 21 }}>
              Use o botao + no topo do perfil para criar post, publicar servico
              ou, se a conta for empresa, publicar uma vaga.
            </Text>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
